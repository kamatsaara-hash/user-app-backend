// server.js
console.log("Starting server...");

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config(); // Optional (only needed if using .env)

console.log("Modules loaded...");

const app = express();
app.use(cors());
app.use(express.json());

const path = require("path");
app.use(express.static(path.join(__dirname))); // serve files from project folder

// 🔥 Connect to MongoDB Atlas
mongoose.connect("mongodb+srv://web:@cluster0.gitqnpn.mongodb.net/mydatabase?retryWrites=true&w=majority")
  .then(() => console.log("MongoDB Atlas Connected!"))
  .catch(err => console.error("MongoDB connection error:", err));

// Schema
const UserSchema = new mongoose.Schema({
  name: String,
  email: String
});

const User = mongoose.model("User", UserSchema);

// Add user
app.post("/add-user", async (req, res) => {
  console.log("POST /add-user called", req.body);
  try {
    const user = new User(req.body);
    await user.save();
    res.json({ message: "User saved!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Get users
app.get("/users", async (req, res) => {
  console.log("GET /users called");
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});