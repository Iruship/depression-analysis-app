import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LiveDepressionDetection = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [depressionLevel, setDepressionLevel] = useState(0); // Placeholder depression level
  const navigate = useNavigate();

  useEffect(() => {
    startVideoFeed();

    // Cleanup video feed when component unmounts
    return () => {
      stopVideoFeed();
    };
  }, []);

  const startVideoFeed = () => {
    // Access the user's webcam
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      })
      .catch((error) => {
        console.error("Error accessing the camera: ", error);
        alert("Unable to access the camera. Please check your permissions.");
      });
  };

  const stopVideoFeed = () => {
    // Stop the video feed when needed
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }
  };

  // Placeholder for depression level, currently a random number for testing
  useEffect(() => {
    const interval = setInterval(() => {
      const randomLevel = Math.floor(Math.random() * 100);
      setDepressionLevel(randomLevel);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="live-depression-detection-container">
      <div className="video-container">
        <video ref={videoRef} autoPlay muted width="800" height="600" />
        <canvas ref={canvasRef} width="800" height="600" style={{ position: 'absolute', top: 0 }} />
      </div>
      <div className="stats-container">
        <h2>Live Depression Detection</h2>
        <p>Depression Level: {depressionLevel}%</p>
        <button onClick={() => { stopVideoFeed(); navigate(-1); }}>Go Back</button>
      </div>
    </div>
  );
};

export default LiveDepressionDetection;
