const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public"))); // serve CSS etc.

// Serve HTML form
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("✅ Connected to MongoDB");
}).catch(err => {
  console.error("❌ MongoDB connection failed:", err);
});

// Schema & Model
const FeedbackSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String
});

const Feedback = mongoose.model("Feedback", FeedbackSchema);

// Handle Form Submission
app.post("/submit", async (req, res) => {
  const feedback = new Feedback({
    name: req.body.name,
    email: req.body.email,
    message: req.body.message
  });

  try {
    await feedback.save();
    res.send("✅ Thank you for your feedback!");
  } catch (error) {
    console.error("❌ Error saving feedback:", error);
    res.status(500).send("❌ Error saving feedback.");
  }
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
