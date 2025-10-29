// src/pages/Homepage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Homepage() {
  const navigate = useNavigate();

  return (
    <div className="homepage">
      <div className="hero-section">
        <div className="container">
          <header className="hero-header">
            <h1>Student Feedback Portal</h1>
            <p className="hero-subtitle">
              Share your learning experience and help us improve education quality
            </p>
          </header>

          <div className="hero-content">
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon"></div>
                <h3>Share Feedback</h3>
                <p>Provide honest feedback about your courses and instructors</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon"></div>
                <h3>Rate Courses</h3>
                <p>Rate your courses on a scale of 1-5 to help other students</p>
              </div>

              <div className="feature-card">
                <div className="feature-icon"></div>
                <h3>View Insights</h3>
                <p>See what other students are saying about their courses</p>
              </div>
            </div>

            <div className="cta-section">
              <h2>Ready to Share Your Experience?</h2>
              <p>Join hands with other students, helping to improve education quality</p>
              
              <div className="cta-buttons">
                <button 
                  className="btn-primary"
                  onClick={() => navigate('/dashboard')}
                >
                  Go to Dashboard
                </button>
                <button 
                  className="btn-secondary"
                  onClick={() => navigate('/dashboard')}
                >
                  Submit Feedback
                </button>
              </div>
            </div>

            <div className="stats-section">
              <div className="stat-item">
                <div className="stat-number">Other</div>
                <div className="stat-label">Students</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">Many</div>
                <div className="stat-label">Feedback Entries</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">Many</div>
                <div className="stat-label">Courses</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}