// src/pages/Dashboard.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FeedbackForm from "../components/feedbackform";
import FeedbackList from "../components/feedbacklist";

export default function Dashboard() {
  const [refresh, setRefresh] = useState(false);
  const navigate = useNavigate();

  const handleFeedbackAdded = () => {
    setRefresh(!refresh);
  };

  return (
    <div className="dashboard-container">
      {/* Navigation Button */}
      <button 
        className="nav-button"
        onClick={() => navigate('/')}
      >
        ← Back to Home
      </button>
      
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <h1>Student Feedback Dashboard</h1>
        <p>Share your feedback and view what others are saying</p>
      </div>

      {/* Flex container for form + list */}
      <div className="container">
        <div className="flex-container">
          <div className="feedback-form">
            <FeedbackForm onFeedbackAdded={handleFeedbackAdded} />
          </div>
          <div className="feedback-list">
            <FeedbackList refresh={refresh} />
          </div>
        </div>
      </div>
    </div>
  );
}