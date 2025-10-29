// src/components/FeedbackForm.js
import React, { useState } from "react";
import axios from "axios";

export default function FeedbackForm({ onFeedbackAdded }) {
  const [formData, setFormData] = useState({
    student_no: "",
    student_name: "",
    course_code: "",
    comments: "",
    rating: ""
  });

  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  // Helper function to count words
  const countWords = (text) => {
    if (!text.trim()) return 0;
    return text.trim().split(/\s+/).length;
  };

  // Validation functions
  const validateStudentName = (value) => {
    // Only allow letters, spaces, hyphens, and apostrophes
    const regex = /^[A-Za-z\s\-']*$/;
    
    // Check word count (max 3 words)
    const wordCount = countWords(value);
    if (wordCount > 3) return false;
    
    return regex.test(value);
  };

  const validateStudentNumber = (value) => {
    // Only allow numbers
    const regex = /^\d*$/;
    return regex.test(value);
  };

  const validateCourseCode = (value) => {
    // Allow letters, numbers, and hyphens - NO SPACES
    const regex = /^[A-Za-z0-9\-]*$/;
    
    // Check if it contains spaces (should not)
    if (value.includes(' ')) return false;
    
    return regex.test(value);
  };

  const validateComments = (value) => {
    // Allow letters, numbers, spaces, and basic punctuation
    const regex = /^[A-Za-z0-9\s\.,!?\-']*$/;
    
    // Check word count (max 10 words)
    const wordCount = countWords(value);
    if (wordCount > 10) return false;
    
    return regex.test(value);
  };

  const validateRating = (value) => {
    // Only allow numbers 1-5
    const regex = /^[1-5]?$/;
    return regex.test(value);
  };

  const getValidationFunction = (fieldName) => {
    switch (fieldName) {
      case 'student_name':
        return validateStudentName;
      case 'student_no':
        return validateStudentNumber;
      case 'course_code':
        return validateCourseCode;
      case 'comments':
        return validateComments;
      case 'rating':
        return validateRating;
      default:
        return () => true;
    }
  };

  const getWordCountMessage = (fieldName, value) => {
    const wordCount = countWords(value);
    
    switch (fieldName) {
      case 'student_name':
        return `${wordCount}/3 words`;
      case 'comments':
        return `${wordCount}/10 words`;
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const validationFunction = getValidationFunction(name);
    
    // For course code, automatically remove spaces as user types
    let processedValue = value;
    if (name === 'course_code') {
      processedValue = value.replace(/\s/g, ''); // Remove all spaces
    }
    
    // Validate input before updating state
    if (validationFunction(processedValue)) {
      setFormData({ ...formData, [name]: processedValue });
      // Clear error for this field if validation passes
      setErrors({ ...errors, [name]: '' });
    } else {
      // Set appropriate error message based on field
      let errorMessage = '';
      const wordCount = countWords(value);
      
      if (name === 'student_name' && wordCount > 3) {
        errorMessage = "Student name cannot exceed 3 words";
      } else if (name === 'comments' && wordCount > 10) {
        errorMessage = "Comments cannot exceed 10 words";
      } else if (name === 'course_code' && value.includes(' ')) {
        errorMessage = "Course code cannot contain spaces";
      } else if (name === 'course_code') {
        errorMessage = "Course code can only contain letters, numbers, and hyphens (no spaces)";
      } else {
        errorMessage = `Invalid input for ${name.replace('_', ' ')}`;
      }
      
      setErrors({ 
        ...errors, 
        [name]: errorMessage 
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    // Final validation before submission
    const finalErrors = {};
    const studentNameWordCount = countWords(formData.student_name);
    const commentsWordCount = countWords(formData.comments);
    
    if (!validateStudentName(formData.student_name)) {
      if (studentNameWordCount > 3) {
        finalErrors.student_name = "Student name cannot exceed 3 words";
      } else {
        finalErrors.student_name = "Student name can only contain letters, spaces, hyphens, and apostrophes";
      }
    }
    
    if (!validateStudentNumber(formData.student_no)) {
      finalErrors.student_no = "Student number can only contain numbers";
    }
    
    if (!validateCourseCode(formData.course_code)) {
      if (formData.course_code.includes(' ')) {
        finalErrors.course_code = "Course code cannot contain spaces";
      } else {
        finalErrors.course_code = "Course code can only contain letters, numbers, and hyphens (no spaces)";
      }
    }
    
    if (!validateComments(formData.comments)) {
      if (commentsWordCount > 10) {
        finalErrors.comments = "Comments cannot exceed 10 words";
      } else {
        finalErrors.comments = "Comments can only contain letters, numbers, spaces, and basic punctuation";
      }
    }
    
    if (!validateRating(formData.rating)) {
      finalErrors.rating = "Rating must be a number between 1 and 5";
    }

    if (Object.keys(finalErrors).length > 0) {
      setErrors(finalErrors);
      setMessage("❌ Please fix the validation errors before submitting");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/feedback", formData);
      setMessage("✅ Feedback submitted successfully!");
      setFormData({ 
        student_no: "",
        student_name: "", 
        course_code: "", 
        comments: "", 
        rating: "" 
      });
      setErrors({});
      onFeedbackAdded(); // refresh feedback list
    } catch (error) {
      setMessage("❌ Error submitting feedback");
    }
  };

  return (
    <div className="card p-4 shadow">
      <h2>Feedback Form</h2>
      <form onSubmit={handleSubmit}>
        {/* Student Number Field */}
        <div className="form-group">
          <label>Student Number *</label>
          <input
            type="text"
            name="student_no"
            value={formData.student_no}
            onChange={handleChange}
            required
            maxLength="9"
            placeholder="Enter numbers only"
            className={errors.student_no ? 'error' : ''}
          />
          {errors.student_no && <span className="error-message">{errors.student_no}</span>}
        </div>

        {/* Student Name Field */}
        <div className="form-group">
          <label>Student Name *</label>
          <input
            type="text"
            name="student_name"
            value={formData.student_name}
            onChange={handleChange}
            required
            maxLength="30"
            placeholder="e.g., Kopano Samuel Lejone"
            className={errors.student_name ? 'error' : ''}
          />
          {errors.student_name && <span className="error-message">{errors.student_name}</span>}
        </div>

        {/* Course Code Field */}
        <div className="form-group">
          <label>Course Code *</label>
          <input
            type="text"
            name="course_code"
            value={formData.course_code}
            onChange={handleChange}
            required
            maxLength="10"
            placeholder="e.g., BIOT2110, BICA2110"
            className={errors.course_code ? 'error' : ''}
          />
          {errors.course_code && <span className="error-message">{errors.course_code}</span>}
        </div>

        {/* Comments Field */}
        <div className="form-group">
          <label>Comments</label>
          <textarea
            name="comments"
            value={formData.comments}
            onChange={handleChange}
            maxLength="200"
            placeholder="Share your feedback about the course in 10 words or less..."
            className={errors.comments ? 'error' : ''}
            rows="3"
          />
          {errors.comments && <span className="error-message">{errors.comments}</span>}
          
        </div>

        {/* Rating Field */}
        <div className="form-group">
          <label>Rating (1–5) *</label>
          <input
            type="number"
            name="rating"
            min="1"
            max="5"
            value={formData.rating}
            onChange={handleChange}
            required
            placeholder="Select 1-5, 1 = Poor, 5 = Excellent"
            className={errors.rating ? 'error' : ''}
          />
          {errors.rating && <span className="error-message">{errors.rating}</span>}
        </div>

        <button type="submit" className="submit-btn">Submit Feedback</button>
      </form>

      {message && (
        <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}
    </div>
  );
}