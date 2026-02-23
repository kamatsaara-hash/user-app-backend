console.log("Starting server...");

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// 🔥 MongoDB Atlas Connection (from Render Environment Variable)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Atlas Connected!"))
  .catch(err => console.error("MongoDB connection error:", err));

// ✅ Root Route (Fixes "Cannot GET /")
app.get("/", (req, res) => {
  res.send("Backend is running successfully 🚀");
});

// Schema
const UserSchema = new mongoose.Schema({
  name: String,
  email: String
});

const User = mongoose.model("User", UserSchema);

// Add User
app.post("/add-user", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.json({ message: "User saved successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Users
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Important for Render
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});