const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../DB/db"); 
require("dotenv").config();

const router = express.Router();

// Authentication middleware
const authMiddleware = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

router.post('/signup', async (req, res) => {
  console.log('Signup API called!');
  const { name, email, password } = req.body;
  console.log('Received Data:', req.body);

  try {
    const existingUser = await pool.query('SELECT * FROM auth_user WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await pool.query(
      'INSERT INTO auth_user (name, email, password) VALUES ($1, $2, $3)',
      [name, email, hashedPassword]
    );

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});


router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await pool.query('SELECT * FROM auth_user WHERE email = $1', [email]);
    if (user.rows.length === 0) {
      return res.status(400).json({ message: "Haven't signed up? Sign up first" });
    }

    const isMatch = await bcrypt.compare(password, user.rows[0].password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      {
        id: user.rows[0].id,
        name: user.rows[0].name,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      token,
      userId: user.rows[0].id,
      name: user.rows[0].name,
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// Get all exams
router.get("/exams", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM exams ORDER BY id DESC");
        res.json({ success: true, data: result.rows });
    } catch (error) {
        console.error("Database error:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
});


// Create a new exam
router.post("/exams", async (req, res) => {
    const { title, description, duration } = req.body;
    const questions = req.body.questions || [];
  
    if (!title || !description || !duration) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }
  
    try {
      const result = await pool.query(
        "INSERT INTO exams (title, description, duration, questions) VALUES ($1, $2, $3, $4) RETURNING *",
        [title, description, duration, JSON.stringify(questions)]
      );
      res.status(201).json({ success: true, data: result.rows[0] });
    } catch (error) {
      console.error("Database error:", error.message);
      res.status(500).json({ success: false, message: "Server error" });
    }
  });


// Update an exam
router.put("/exams/:id", async (req, res) => {
    const { id } = req.params;
    const { title, description, duration } = req.body;
    const questions = req.body.questions || [];
  
    if (!title || !description || !duration) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }
  
    try {
      const result = await pool.query(
        "UPDATE exams SET title = $1, description = $2, duration = $3, questions = $4 WHERE id = $5 RETURNING *",
        [title, description, duration, JSON.stringify(questions), id]
      );
  
      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: "Exam not found" });
      }
      res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      console.error("Database error:", error.message);
      res.status(500).json({ success: false, message: "Server error" });
    }
  });


// Delete an exam
router.delete("/exams/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query("DELETE FROM exams WHERE id = $1 RETURNING *", [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Exam not found" });
        }
        res.json({ success: true, message: "Exam deleted successfully" });
    } catch (error) {
        console.error("Database error:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
});


module.exports = router;