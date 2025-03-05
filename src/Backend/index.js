require('dotenv').config()
const express = require('express')
const cors = require('cors')
const routes = require('./routes/Routes')

const app = express()

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5174', // Allow only your frontend
    credentials: true // Allow cookies, authentication headers
}));
app.use("/api/route",routes)



app.listen(5000, () => console.log("Server running on port 5000"));