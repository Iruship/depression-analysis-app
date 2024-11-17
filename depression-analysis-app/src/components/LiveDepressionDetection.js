import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as tf from '@tensorflow/tfjs';
import './LiveDepressionDetection.css';

const LiveDepressionDetection = () => {
  const videoRef = useRef(null);
  const [depressionLevel, setDepressionLevel] = useState(0);
  const [dominantEmotion, setDominantEmotion] = useState('');
  const [isLiveDetectionStarted, setIsLiveDetectionStarted] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageDepressionLevel, setImageDepressionLevel] = useState(null);
  const navigate = useNavigate();
  const modelPath = 'model/model.json'; // Path to trained model
  let model;

  // Load the model once
  const loadModel = async () => {
    if (!model) {
      try {
        model = await tf.loadLayersModel(modelPath);
      } catch (error) {
        console.error('Error loading model:', error);
      }
    }
  };

  // Start live depression detection
  const startLiveDetection = async () => {
    await loadModel();
    setIsLiveDetectionStarted(true);
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play();
            processFrames();
          };
        }
      })
      .catch((error) => {
        console.error('Error accessing the camera:', error);
        alert('Unable to access the camera. Please check your permissions.');
      });
  };

  // Stop live detection
  const stopLiveDetection = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }
    setIsLiveDetectionStarted(false);
  };

  // Process frames for live detection
  const processFrames = async () => {
    if (videoRef.current && model) {
      const videoTensor = preprocessFrame(tf.browser.fromPixels(videoRef.current));
      const predictions = await model.predict(videoTensor).data();
      videoTensor.dispose();

      setDepressionLevel(calculateDepressionScore(predictions));
      setDominantEmotion(getDominantEmotion(predictions));

      if (isLiveDetectionStarted) {
        requestAnimationFrame(processFrames);
      }
    }
  };

  // Preprocess image or video frame
  const preprocessFrame = (frame) => {
    const tensor = frame
      .resizeNearestNeighbor([48, 48]) // Resize to model's input size
      .mean(2) // Convert to grayscale
      .expandDims(0) // Add batch dimension
      .expandDims(-1) // Add channel dimension
      .div(tf.scalar(255.0)); // Normalize pixel values
  
    // Apply contrast enhancement
    return tensor.sub(tensor.min()).div(tensor.max().sub(tensor.min()));
  };

  // Calculate depression score
  const calculateDepressionScore = (predictions) => {
    const depressionWeights = {
      Angry: 0.8,
      Disgust: 0.6,
      Fear: 0.7,
      Sad: 1.0,
      Happy: 0.2,
      Neutral: 0.4,
      Surprise: 0.3,
    };

    const emotionLabels = ['Angry', 'Disgust', 'Fear', 'Happy', 'Neutral', 'Sad', 'Surprise'];
    return Math.round(
      predictions.reduce((score, pred, idx) => score + pred * depressionWeights[emotionLabels[idx]], 0) * 100
    );
  };

  // Get dominant emotion
  const getDominantEmotion = (predictions) => {
    const emotionLabels = ['Angry', 'Disgust', 'Fear', 'Happy', 'Neutral', 'Sad', 'Surprise'];
    const maxIndex = predictions.indexOf(Math.max(...predictions));
    return emotionLabels[maxIndex];
  };

  // Handle image upload
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const image = new Image();
      image.src = URL.createObjectURL(file);
      image.onload = async () => {
        setUploadedImage(image.src);
        await loadModel();
        const imageTensor = preprocessFrame(tf.browser.fromPixels(image));
        const predictions = await model.predict(imageTensor).data();
        imageTensor.dispose();
        setImageDepressionLevel(calculateDepressionScore(predictions));
      };
    }
  };

  // Clear uploaded image
  const clearImage = () => {
    setUploadedImage(null);
    setImageDepressionLevel(null);
  };

  return (
    <div className="live-depression-detection">
      <h1 className="heading">Live Depression Detection</h1>
      <div className="content">
        {/* Left Section: Live Detection */}
        <div className="live-detection">
          <h2>Live Detection</h2>
          <div className="video-container">
            {isLiveDetectionStarted ? (
              <video ref={videoRef} autoPlay muted />
            ) : (
              <div className="placeholder">
                <i className="fas fa-video"></i>
              </div>
            )}
          </div>
          {isLiveDetectionStarted && (
            <div className="stats">
              <p className="depression-level">Depression Level: <span>{depressionLevel}%</span></p>
              <p className="emotion">Dominant Emotion: <span>{dominantEmotion}</span></p>
              <button onClick={stopLiveDetection} className="btn btn-danger">
                Stop Detection
              </button>
            </div>
          )}
          {!isLiveDetectionStarted && (
            <button onClick={startLiveDetection} className="btn btn-primary">
              Start Live Detection
            </button>
          )}
        </div>

        {/* Right Section: Image Upload */}
        <div className="image-detection">
          <h2>Image Detection</h2>
          <div className="image-container">
            {uploadedImage ? (
              <img src={uploadedImage} alt="Uploaded Preview" />
            ) : (
              <div className="placeholder">
                <i className="fas fa-image"></i>
              </div>
            )}
          </div>
          <input type="file" accept="image/*" onChange={handleImageUpload} />
          {uploadedImage && (
            <button onClick={clearImage} className="btn btn-secondary mt-2">
              Clear Image
            </button>
          )}
          {imageDepressionLevel !== null && (
            <p className="depression-level">Depression Level: <span>{imageDepressionLevel}%</span></p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveDepressionDetection;
