import React, { useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import './LiveDepressionDetection.css';

const LiveDepressionDetection = () => {
  const videoRef = useRef(null);
  const captureVideoRef = useRef(null);
  const [depressionLevel, setDepressionLevel] = useState(0);
  const [dominantEmotion, setDominantEmotion] = useState('');
  const [isLiveDetectionStarted, setIsLiveDetectionStarted] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageDepressionLevel, setImageDepressionLevel] = useState(null);
  const [isCaptureStarted, setIsCaptureStarted] = useState(false);
  const modelPath = 'model/model.json';
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

      console.log("Predictions:", predictions); // Log predictions

      const depressionScore = calculateDepressionScore(predictions);
      const dominantEmotion = getDominantEmotion(predictions);

      setDepressionLevel(depressionScore);
      setDominantEmotion(dominantEmotion);

      if (isLiveDetectionStarted) {
        requestAnimationFrame(processFrames);
      }
    }
  };

  // Preprocess image or video frame
  const preprocessFrame = (frame) => {
    const tensor = frame
      .resizeNearestNeighbor([48, 48])
      .mean(2)
      .expandDims(0)
      .expandDims(-1)
      .div(tf.scalar(255.0));

    return tensor.sub(tensor.min()).div(tensor.max().sub(tensor.min()));
  };

  // Calculate depression score with confidence threshold
  const calculateDepressionScore = (predictions, confidenceThreshold = 0.1) => {
    const depressionWeights = {
      Angry: 0.9, // Higher weight for Angry
      Disgust: 0.7,
      Fear: 0.7,
      Sad: 0.9, // Higher weight for Sad
      Happy: 0.1, // Lower weight for Happy
      Neutral: 0.4,
      Surprise: 0.3,
    };

    const emotionLabels = ['Angry', 'Disgust', 'Fear', 'Happy', 'Neutral', 'Sad', 'Surprise'];
    let weightedSum = 0;
    let totalWeight = 0;

    predictions.forEach((pred, idx) => {
      if (pred >= confidenceThreshold) {
        weightedSum += pred * depressionWeights[emotionLabels[idx]];
        totalWeight += depressionWeights[emotionLabels[idx]];
      }
    });

    // Normalize the depression score to a range of 0-100
    const depressionScore = totalWeight > 0 ? (weightedSum / totalWeight) * 100 : 0;
    return Math.round(depressionScore);
  };

  // Get dominant emotion with confidence threshold
  const getDominantEmotion = (predictions, confidenceThreshold = 0.1) => {
    const emotionLabels = ['Angry', 'Disgust', 'Fear', 'Happy', 'Neutral', 'Sad', 'Surprise'];
    let maxIndex = predictions.indexOf(Math.max(...predictions));
    return predictions[maxIndex] >= confidenceThreshold ? emotionLabels[maxIndex] : 'Unknown';
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

  // Start capture mode
  const startCapture = async () => {
    setIsCaptureStarted(true);
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        if (captureVideoRef.current) {
          captureVideoRef.current.srcObject = stream;
          captureVideoRef.current.onloadedmetadata = () => {
            captureVideoRef.current.play();
          };
        }
      })
      .catch((error) => {
        alert('Unable to access the camera. Please check your permissions.');
      });
  };

  // Capture image from webcam
  const captureImage = () => {
    if (captureVideoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = captureVideoRef.current.videoWidth;
      canvas.height = captureVideoRef.current.videoHeight;
      const context = canvas.getContext('2d');
      context.drawImage(captureVideoRef.current, 0, 0, canvas.width, canvas.height);
      const imageSrc = canvas.toDataURL('image/png');
      setUploadedImage(imageSrc);
      setIsCaptureStarted(false);

      // Stop the webcam stream
      captureVideoRef.current.srcObject.getTracks().forEach((track) => track.stop());

      // Process the captured image
      const image = new Image();
      image.src = imageSrc;
      image.onload = async () => {
        await loadModel();
        const imageTensor = preprocessFrame(tf.browser.fromPixels(image));
        const predictions = await model.predict(imageTensor).data();
        imageTensor.dispose();
        setImageDepressionLevel(calculateDepressionScore(predictions));
      };
    }
  };

  // Stop capture mode
  const stopCapture = () => {
    if (captureVideoRef.current && captureVideoRef.current.srcObject) {
      captureVideoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }
    setIsCaptureStarted(false);
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
            ) : isCaptureStarted ? (
              <video ref={captureVideoRef} autoPlay muted />
            ) : (
              <div className="placeholder">
                <i className="fas fa-image"></i>
              </div>
            )}
          </div>
          {!isCaptureStarted ? (
            <>
              <input type="file" accept="image/*" onChange={handleImageUpload} />
              <button onClick={startCapture} className="btn btn-primary mt-2">
                Capture Image
              </button>
            </>
          ) : (
            <>
              <button onClick={captureImage} className="btn btn-success mt-2">
                Take Photo
              </button>
              <button onClick={stopCapture} className="btn btn-danger mt-2">
                Cancel
              </button>
            </>
          )}
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