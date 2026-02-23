// server.js

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

// ------------------------------
// Middleware
// ------------------------------
app.use(cors());
app.use(express.json());

// Serve static files (index.html, CSS, JS)
app.use(express.static(path.join(__dirname, "public"))); // optional: move index.html + assets to public/

// ------------------------------
// MongoDB Atlas Connection
// ------------------------------
const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
  console.error("❌ ERROR: MONGO_URI not set in environment variables!");
  process.exit(1); // stop server if DB URI missing
}

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log("✅ MongoDB Connected!"))
  .catch(err => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1); // stop server if DB fails
  });

// ------------------------------
// Mongoose Schema & Model
// ------------------------------
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true }
});

const User = mongoose.model("User", UserSchema);

// ------------------------------
// Routes
// ------------------------------

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

// Root route → serve index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html")); // if you moved to public/
});

// ------------------------------
// Start Server
// ------------------------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});