// src/App.js
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./pages/Home";
import Dashboard from "./pages/dashboard";
import "./App.css";

function App() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let progressValue = 0;
    
    // Update progress every 100ms for 10 seconds
    const progressInterval = setInterval(() => {
      progressValue += 1;
      setProgress(progressValue);
      
      if (progressValue >= 100) {
        clearInterval(progressInterval);
        setLoading(false);
      }
    }, 100); // 100ms * 100 = 10 seconds

    return () => clearInterval(progressInterval);
  }, []);

  if (loading) {
    return <LoadingScreen progress={progress} />;
  }

  return (
    <Router>
      <div className="App">
        <div className="content">
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>

        {/* Footer component inside App.js */}
        <footer className="footer">
          <p>© 2025 Student Feedback. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

// Professional Loading Screen Component with Progress
const LoadingScreen = ({ progress }) => {
  const [tips, setTips] = useState(0);
  
  const loadingTips = [
    " Preparing your academic dashboard...",
    " Loading student insights...",
    " Setting up feedback system...",
    " Optimizing user experience...",
    " Almost ready to launch..."
  ];

  useEffect(() => {
    const tipInterval = setInterval(() => {
      setTips(prev => (prev + 1) % loadingTips.length);
    }, 2000); // Change tip every 2 seconds

    return () => clearInterval(tipInterval);
  }, []);

  return (
    <div className="loading-screen">
      <div className="loading-container">
        {/* Animated Logo/Icon */}
        <div className="loading-logo">
          <div className="logo-circle">
            <span></span>
          </div>
        </div>
        
        {/* Loading Text */}
        <div className="loading-text">
          <h2>Student Feedback Portal</h2>
          <p className="loading-tip">{loadingTips[tips]}</p>
        </div>

        {/* Progress Percentage */}
        <div className="progress-percentage">
          <span>{progress}%</span>
        </div>

        {/* Animated Loading Bar */}
        <div className="loading-bar">
          <div 
            className="loading-progress"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Loading Animation */}
        <div className="loading-animation">
          <div className="loading-dots">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="loading-info">
          <p>Loading your personalized educational experience...</p>
          <small>This will only take a moment</small>
        </div>
      </div>
    </div>
  );
};

export default App;
