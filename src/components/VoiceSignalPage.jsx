import React, { useState, useRef, useEffect } from "react";
import Plot from "react-plotly.js";

export default function VoiceSignalPage() {
  const [xValues, setXValues] = useState([]);
  const [yValues, setYValues] = useState([]);
  const [originalX, setOriginalX] = useState([]);
  const [originalY, setOriginalY] = useState([]);
  const [noiseLevel, setNoiseLevel] = useState(0);
  const [shift, setShift] = useState(0);
  const [reversed, setReversed] = useState(false);
  const [recording, setRecording] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [seconds, setSeconds] = useState(0);

  const audioRef = useRef(null);
  const markerRef = useRef(0);
  const intervalRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioBufferRef = useRef(null);

  // Convert audio Blob to waveform
  const blobToWaveform = async (blob) => {
    const arrayBuffer = await blob.arrayBuffer();
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const buffer = await audioCtx.decodeAudioData(arrayBuffer);
    audioBufferRef.current = buffer;

    const rawData = buffer.getChannelData(0); // mono channel
    const N = 500; // sample points
    const step = Math.floor(rawData.length / N);
    const sampled = [];
    const time = [];
    for (let i = 0; i < N; i++) {
      sampled.push(rawData[i * step]);
      time.push(i * (buffer.duration / N));
    }
    setXValues(time);
    setYValues(sampled);
    setOriginalX(time);
    setOriginalY(sampled);
    markerRef.current = 0;
    setSeconds(0);
  };

  // Recording functions
  const startRecording = async () => {
    setRecording(true);
    setPlaying(false);
    setSeconds(0);
    markerRef.current = 0;

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    audioChunksRef.current = [];

    mediaRecorder.ondataavailable = (e) => audioChunksRef.current.push(e.data);
    mediaRecorder.onstop = async () => {
      const blob = new Blob(audioChunksRef.current, { type: "audio/wav" });
      const url = URL.createObjectURL(blob);
      if (audioRef.current) audioRef.current.src = url;
      await blobToWaveform(blob);
    };

    mediaRecorder.start();
  };

  const stopRecording = () => {
    setRecording(false);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
  };

  // Playback functions
  const startPlayback = () => {
    if (yValues.length === 0) return;
    setPlaying(true);
    markerRef.current = 0;
    setSeconds(0);

    intervalRef.current = setInterval(() => {
      markerRef.current += (xValues[xValues.length - 1] - xValues[0]) / xValues.length;
      setSeconds(markerRef.current);

      if (markerRef.current >= xValues[xValues.length - 1]) {
        clearInterval(intervalRef.current);
        setPlaying(false);
      }
    }, 20);

    if (audioRef.current) audioRef.current.play();
  };

  const pausePlayback = () => {
    setPlaying(false);
    clearInterval(intervalRef.current);
    if (audioRef.current) audioRef.current.pause();
  };

  // Signal manipulations
  const applyShift = (val) => {
    if (!originalY.length) return;
    const dx = originalX[1] - originalX[0];
    const shiftSteps = Math.round(Math.abs(val) / dx);
    let newY = [...originalY];
    let newX = [...originalX];

    if (val > 0) {
      // Left shift
      newY = [...originalY.slice(shiftSteps), ...Array(shiftSteps).fill(0)];
      newX = originalX.map((x) => x - val);
    } else if (val < 0) {
      // Right shift
      newY = [...Array(shiftSteps).fill(0), ...originalY.slice(0, originalY.length - shiftSteps)];
      newX = originalX.map((x) => x - val);
    }
    setYValues(newY);
    setXValues(newX);
  };

  const applyReverse = () => {
    setYValues([...yValues].reverse());
    setXValues([...xValues].map((x) => -x).reverse());
    setReversed(!reversed);
  };

  const addNoise = (val) => {
    setNoiseLevel(val);
    setYValues((prevY) => prevY.map((v, i) => v + val * (Math.random() - 0.5)));
  };

  // Handle file upload
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    if (audioRef.current) audioRef.current.src = url;
    await blobToWaveform(file);
  };

  const generateMarkerData = () => {
    const markerIndex = xValues.findIndex((x) => x >= markerRef.current);
    const markerY = markerIndex >= 0 ? yValues[markerIndex] : 0;
    return { x: [markerRef.current], y: [markerY] };
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-4">Voice Signal Page</h1>

      {/* File Upload */}
      <div className="mb-4">
        <input type="file" accept="audio/*" onChange={handleFileUpload} className="text-black p-1 rounded" />
      </div>

      {/* Recording Controls */}
      <div className="flex gap-4 mb-4">
        <button
          onClick={startRecording}
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
          disabled={recording}
        >
          Start Recording
        </button>
        <button
          onClick={stopRecording}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
          disabled={!recording}
        >
          Stop Recording
        </button>
      </div>

      {/* Playback Controls */}
      <div className="flex gap-4 mb-4">
        <button
          onClick={startPlayback}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
          disabled={recording || playing || yValues.length === 0}
        >
          Play
        </button>
        <button
          onClick={pausePlayback}
          className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded"
          disabled={!playing}
        >
          Pause
        </button>
      </div>

      {/* Signal Options */}
      <div className="flex gap-4 mb-4 items-center">
        <label>Noise Level:</label>
        <input
          type="number"
          value={noiseLevel}
          step={0.01}
          min={0}
          onChange={(e) => addNoise(Number(e.target.value))}
          className="text-black p-1 rounded w-20"
        />

        <label>Shift (Left + / Right -):</label>
        <input
          type="number"
          value={shift}
          step={0.01}
          onChange={(e) => {
            const val = Number(e.target.value);
            setShift(val);
            applyShift(val);
          }}
          className="text-black p-1 rounded w-20"
        />

        <button
          onClick={applyReverse}
          className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded"
        >
          {reversed ? "Unreverse" : "Reverse"}
        </button>
      </div>

      <div className="mb-2 text-lg">
        Time: <span className="font-bold">{seconds.toFixed(2)} s</span>
      </div>

      {/* Plot */}
      <Plot
        data={[
          { x: xValues, y: yValues, type: "scatter", mode: "lines", line: { color: "cyan" } },
          { ...generateMarkerData(), type: "scatter", mode: "markers", marker: { color: "red", size: 12 } },
        ]}
        layout={{
          width: 900,
          height: 400,
          title: "Voice Signal",
          paper_bgcolor: "#1e1e2f",
          plot_bgcolor: "#1e1e2f",
          xaxis: { title: "Time (s)" },
          yaxis: { title: "Amplitude" },
        }}
      />

      <audio ref={audioRef} controls className="mt-4 w-full max-w-lg" />
    </div>
  );
}
