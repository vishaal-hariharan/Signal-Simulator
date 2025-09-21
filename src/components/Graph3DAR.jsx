import React, { useMemo, useRef, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Line } from "@react-three/drei";

export default function Graph3DAR({ signals }) {
  const videoRef = useRef(null);
  const [arMode, setArMode] = useState(false);

  // Start camera when AR mode is enabled
  useEffect(() => {
    if (arMode && navigator.mediaDevices?.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: "environment" } }) // back camera
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          }
        })
        .catch((err) => {
          console.error("Camera access denied:", err);
        });
    } else {
      if (videoRef.current && videoRef.current.srcObject) {
        let tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
    }
  }, [arMode]);

  // Convert signals into 3D line points
  const lines = useMemo(
    () =>
      signals.map((signal) =>
        signal.x.map((x, i) => [x / 2, signal.y[i] / 2, 0]) // scaled for AR view
      ),
    [signals]
  );

  return (
    <div style={{ position: "relative", width: "100%", height: "500px" }}>
      {/* Background video (only visible in AR mode) */}
      {arMode && (
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: 0,
          }}
        />
      )}

      {/* 3D Graph */}
      <Canvas
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 1,
        }}
        camera={{ position: [0, 0, 10], fov: 60 }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />

        {lines.map((points, idx) => (
          <Line
            key={idx}
            points={points}
            color={["red", "blue", "green", "orange"][idx % 4]}
            lineWidth={2}
          />
        ))}

        <OrbitControls enablePan enableZoom enableRotate />
      </Canvas>

      {/* Toggle button */}
      <button
        onClick={() => setArMode(!arMode)}
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          zIndex: 2,
          padding: "8px 12px",
          background: arMode ? "red" : "green",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        {arMode ? "Exit AR" : "Enter AR"}
      </button>
    </div>
  );
}
