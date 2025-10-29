// Import dependencies
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

// Load environment variables
dotenv.config();

// Initialize app
const app = express();
app.use(cors());
app.use(express.json());

// Connect to Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// ✅ Welcome route (for testing)
app.get("/", (req, res) => {
  res.send("🎉 Student Feedback API is running!");
});

// ✅ Route 1: Add feedback (POST)
app.post("/api/feedback", async (req, res) => {
  try {
    const { student_no, student_name, course_code, comments, rating } = req.body;
    console.log("📥 Received data:", req.body);

    // Validate required fields (including student_no)
    if (!student_no || !student_name || !course_code || !rating) {
      console.log("❌ Missing required fields!");
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Ensure rating is a number
    const parsedRating = parseInt(rating);
    if (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      console.log("❌ Invalid rating value:", rating);
      return res.status(400).json({ error: "Rating must be a number between 1 and 5" });
    }

    // Insert into Supabase table (including student_no)
    const { data, error } = await supabase
      .from("feedback")
      .insert([{ 
        student_no,
        student_name, 
        course_code, 
        comments, 
        rating: parsedRating 
      }])
      .select();

    if (error) {
      console.error("❌ Supabase error:", error.message);
      throw error;
    }

    console.log("✅ Insert success:", data);
    res.json({ message: "Feedback added successfully", data });
  } catch (err) {
    console.error("🔥 Server error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Route 2: Get all feedback (GET)
app.get("/api/feedback", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("feedback")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("❌ Supabase fetch error:", error.message);
      throw error;
    }

    console.log("📤 Returning feedback:", data.length, "records");
    res.json(data);
  } catch (err) {
    console.error("🔥 Server error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Route 3: Delete feedback (DELETE) - USING student_no
app.delete("/api/feedback/:student_no", async (req, res) => {
  try {
    const { student_no } = req.params;
    console.log("🗑️ Deleting feedback with student_no:", student_no);

    const { error } = await supabase
      .from("feedback")
      .delete()
      .eq("student_no", student_no);  // Delete where student_no matches

    if (error) {
      console.error("❌ Supabase delete error:", error.message);
      throw error;
    }

    console.log("✅ Delete success for student_no:", student_no);
    res.json({ message: "Feedback deleted successfully" });
  } catch (err) {
    console.error("🔥 Server error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});