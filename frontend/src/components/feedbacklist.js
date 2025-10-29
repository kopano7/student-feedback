// src/components/FeedbackList.js
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function FeedbackList({ refresh }) {
  const [feedbacks, setFeedbacks] = useState([]);

  const fetchFeedback = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/feedback");
      setFeedbacks(response.data);
    } catch (error) {
      console.error("Error fetching feedback:", error);
    }
  };

  const handleDelete = async (student_no) => {
    if (window.confirm("Are you sure you want to delete this feedback?")) {
      try {
        await axios.delete(`http://localhost:5000/api/feedback/${student_no}`);
        fetchFeedback(); // Refresh after deletion
      } catch (error) {
        console.error("Error deleting feedback:", error);
        alert("Error deleting feedback");
      }
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, [refresh]);

  return (
    <div className="feedback-table-container">
      <h2>All Feedback</h2>
      {feedbacks.length === 0 ? (
        <p>No feedback yet.</p>
      ) : (
        <div className="table-wrapper">
          <table className="feedback-table">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Course Code</th>
                <th>Rating</th>
                <th>Comments</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {feedbacks.map((fb) => (
                <tr key={fb.student_no}>
                  <td>{fb.student_name}</td>
                  <td>{fb.course_code}</td>
                  <td>{fb.rating}/5</td>
                  <td>{fb.comments}</td>
                  <td>
                    <button 
                      onClick={() => handleDelete(fb.student_no)}
                      className="delete-btn"
                    >
                     Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}