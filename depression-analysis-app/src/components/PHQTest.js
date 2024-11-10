import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './PHQTest.css';

const PHQTest = () => {
  const [answers, setAnswers] = useState(Array(9).fill(0));
  const [score, setScore] = useState(null);
  const [message, setMessage] = useState("");

  // Retrieve username and userId from localStorage
  const username = localStorage.getItem('username');
  const userId = localStorage.getItem('userId');

  const questions = [
    "Little interest or pleasure in doing things",
    "Feeling down, depressed, or hopeless",
    "Trouble falling or staying asleep, or sleeping too much",
    "Feeling tired or having little energy",
    "Poor appetite or overeating",
    "Feeling bad about yourself — or that you are a failure or have let yourself or your family down",
    "Trouble concentrating on things, such as reading the newspaper or watching television",
    "Moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless that you have been moving a lot more than usual",
    "Thoughts that you would be better off dead, or of hurting yourself in some way",
  ];

  const options = [
    { label: "Not at all", value: 0 },
    { label: "Several days", value: 1 },
    { label: "More than half the days", value: 2 },
    { label: "Nearly every day", value: 3 },
  ];

  const handleAnswerChange = (index, value) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = value;
    setAnswers(updatedAnswers);
  };

  const calculateScore = () => {
    const totalScore = answers.reduce((acc, curr) => acc + curr, 0);
    setScore(totalScore);

    let feedbackMessage = "";
    if (totalScore >= 20) {
      feedbackMessage = "Severe depression: Please seek immediate professional help.";
    } else if (totalScore >= 15) {
      feedbackMessage = "Moderately severe depression: It’s highly recommended to talk to a professional.";
    } else if (totalScore >= 10) {
      feedbackMessage = "Moderate depression: Consider speaking to a professional.";
    } else if (totalScore >= 5) {
      feedbackMessage = "Mild depression: Professional support might be beneficial.";
    } else {
      feedbackMessage = "Minimal or no depression: No major concerns.";
    }
    setMessage(feedbackMessage);

    saveTestResult(totalScore);
  };

  const saveTestResult = async (totalScore) => {
    try {
      // Ensure username and userId are available
      if (!username || !userId) {
        toast.error("User information not found. Please log in again.");
        return;
      }

      await axios.post("http://localhost:5000/api/phq-test", {
        username,
        userId,
        score: totalScore,
      });
      toast.success("Test result saved successfully!");
    } catch (error) {
      toast.error("Error saving test result.");
    }
  };

  return (
    <div className="phq-test-container container mt-5">
      <ToastContainer />
      <h1 className="text-center mb-4">PHQ-9 Test</h1>
      <p className="text-muted text-center mb-4">
        The PHQ-9 is a multipurpose instrument for screening, diagnosing, monitoring, and measuring the severity of depression. Answer each question based on your experience over the past two weeks.
      </p>

      {questions.map((question, index) => (
        <div key={index} className="question mb-4 p-3 rounded bg-light">
          <p><strong>{index + 1}. {question}</strong></p>
          <div className="options d-flex flex-wrap">
            {options.map((option) => (
              <label key={option.value} className="me-4">
                <input
                  type="radio"
                  name={`question-${index}`}
                  value={option.value}
                  onChange={() => handleAnswerChange(index, option.value)}
                />
                <span className="ms-1">{option.label}</span>
              </label>
            ))}
          </div>
        </div>
      ))}

      <button onClick={calculateScore} className="btn btn-primary w-100 mb-4">
        Submit and Calculate Score
      </button>

      {score !== null && (
        <div className="results p-3 rounded">
          <h2>Your Score: {score}</h2>
          <p className={score >= 15 ? "text-warning" : "text-success"}>{message}</p>
          {score >= 15 && (
            <div className="helplines alert alert-warning mt-3">
              <h4>Helplines</h4>
              <p>National Suicide Prevention Lifeline:********</p>
              <p>Text HOME to **** to connect with a Crisis Counselor</p>
              <p>For immediate assistance, call 119 or go to the nearest hospital.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PHQTest;
