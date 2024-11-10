import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as tf from '@tensorflow/tfjs';

const LiveDepressionDetection = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [depressionLevel, setDepressionLevel] = useState(0); // Depression level state
  const [dominantEmotion, setDominantEmotion] = useState(''); // Dominant emotion label
  const navigate = useNavigate();
  const modelPath = 'model/model.json'; // Path to trained model
  const frameBuffer = []; // Buffer to hold previous frame scores for averaging

  // Load the model on component mount
  useEffect(() => {
    const loadModel = async () => {
      try {
        const model = await tf.loadLayersModel(modelPath);
        startVideoFeed(model);
      } catch (error) {
        console.error("Error loading model:", error);
      }
    };

    loadModel();

    // Cleanup video feed when component unmounts
    return () => {
      stopVideoFeed();
    };
  }, []);

  // Start the video feed and set up event listener
  const startVideoFeed = (model) => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play();
            processFrames(model);
          };
        }
      })
      .catch((error) => {
        console.error("Error accessing the camera:", error);
        alert("Unable to access the camera. Please check your permissions.");
      });
  };

  const stopVideoFeed = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }
  };

  const processFrames = (model) => {
    const processFrame = async () => {
      if (videoRef.current && videoRef.current.videoWidth > 0 && videoRef.current.videoHeight > 0) {
        const videoTensor = preprocessFrame(tf.browser.fromPixels(videoRef.current));
        const predictions = await model.predict(videoTensor).data();
        videoTensor.dispose();

        const depressionScore = calculateDepressionScore(predictions);
        updateDepressionLevel(depressionScore);
        updateDominantEmotion(predictions);

        requestAnimationFrame(() => processFrame(model));
      }
    };
    processFrame();
  };

  const preprocessFrame = (frame) => {
    return frame
      .resizeNearestNeighbor([48, 48]) // Resize to model's input size
      .mean(2) // Convert to grayscale
      .expandDims(0) // Add batch dimension
      .expandDims(-1) // Add channel dimension
      .div(tf.scalar(255.0)); // Normalize pixel values
  };

  // Calculate a depression score based on prediction values
  const calculateDepressionScore = (predictions) => {
    const depressionWeights = {
      Angry: 0.9,
      Disgust: 0.7,
      Fear: 0.8,
      Sad: 1.0,
      Happy: 0.1,
      Neutral: 0.3,
      Surprise: 0.2,
    };

    let score = 0;
    const emotionLabels = ['Angry', 'Disgust', 'Fear', 'Happy', 'Neutral', 'Sad', 'Surprise'];
    predictions.forEach((pred, idx) => {
      const emotion = emotionLabels[idx];
      score += pred * depressionWeights[emotion];
    });

    return Math.round(score * 100);
  };

  // Maintain a moving average of depression scores for stability
  const updateDepressionLevel = (newScore) => {
    frameBuffer.push(newScore);
    if (frameBuffer.length > 5) frameBuffer.shift(); // Limit buffer to 5 frames

    const averagedScore = Math.round(frameBuffer.reduce((a, b) => a + b, 0) / frameBuffer.length);
    setDepressionLevel(averagedScore);
  };

  // Update the dominant emotion based on predictions
  const updateDominantEmotion = (predictions) => {
    const emotionLabels = ['Angry', 'Disgust', 'Fear', 'Happy', 'Neutral', 'Sad', 'Surprise'];
    let maxPrediction = 0;
    let dominantEmotion = '';

    predictions.forEach((pred, idx) => {
      if (pred > maxPrediction) {
        maxPrediction = pred;
        dominantEmotion = emotionLabels[idx];
      }
    });

    setDominantEmotion(dominantEmotion);
  };

  return (
    <div className="live-depression-detection-container">
      <div className="video-container">
        <video ref={videoRef} autoPlay muted width="800" height="600" />
        <canvas ref={canvasRef} width="800" height="600" style={{ position: 'absolute', top: 0 }} />
      </div>
      <div className="stats-container">
        <h2>Live Depression Detection</h2>
        <p>Depression Level: {depressionLevel}%</p>
        <p>Dominant Emotion: {dominantEmotion}</p>
        <button onClick={() => { stopVideoFeed(); navigate(-1); }}>Go Back</button>
      </div>
    </div>
  );
};

export default LiveDepressionDetection;
