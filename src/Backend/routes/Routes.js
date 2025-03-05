const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../DB/db"); 
require("dotenv").config();

const router = express.Router();


router.post("/signup", async (req, res) => {
    console.log("Signup API called!");
    const { name, email, password, role} = req.body;
    console.log("Received Data:", req.body);

    try {
       
        const existingUser = await pool.query("SELECT * FROM auth_user WHERE email = $1", [email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ message: "User already exists" });
        }

       
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        
        await pool.query(
            "INSERT INTO auth_user (name, email, password, role) VALUES ($1, $2, $3, $4)",
            [name, email, hashedPassword, role]
        );

        res.status(201).json({ message: "User registered successfully" });

    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
});


router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        
        const user = await pool.query("SELECT * FROM auth_user WHERE email = $1", [email]);
        if (user.rows.length === 0) {
            return res.status(400).json({ message: "Haven't signup?signup first" });
        }

       
        const isMatch = await bcrypt.compare(password, user.rows[0].password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        
        const token = jwt.sign(
            { 
                id: user.rows[0].id, 
                role: user.rows[0].role 
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({ token, role: user.rows[0].role });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
