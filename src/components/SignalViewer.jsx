// src/components/SignalViewer.jsx
import React, { useState } from "react";
import Plot from "react-plotly.js";

export default function SignalViewer() {
  const [signals, setSignals] = useState([]);
  const [xInput, setXInput] = useState("");
  const [yInput, setYInput] = useState("");
  const [message, setMessage] = useState("");

  // Convert comma-separated string to number array
  const parseArray = (str) => str.split(",").map((v) => parseFloat(v.trim()));

  const addSignal = () => {
    try {
      const x = parseArray(xInput);
      const y = parseArray(yInput);

      if (x.length !== y.length) {
        setMessage("X and Y must have the same number of values.");
        return;
      }

      const newSignal = {
        id: signals.length + 1,
        name: `Signal ${signals.length + 1}`,
        x,
        y,
      };

      setSignals([...signals, newSignal]);
      setMessage("Signal added successfully!");
      setXInput("");
      setYInput("");
      setTimeout(() => setMessage(""), 2000);
    } catch {
      setMessage("Invalid input! Please enter numbers separated by commas.");
    }
  };

  const removeSignal = (id) => {
    setSignals(signals.filter((s) => s.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-4">Signal Viewer</h1>
      <p className="mb-4 text-gray-300">
        Enter X and Y values separated by commas to plot custom signals.
      </p>

      {message && <div className="text-green-400 mb-2">{message}</div>}

      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="flex flex-col gap-2">
          <label>X values (comma separated)</label>
          <input
            type="text"
            value={xInput}
            onChange={(e) => setXInput(e.target.value)}
            className="p-2 rounded text-black w-full"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label>Y values (comma separated)</label>
          <input
            type="text"
            value={yInput}
            onChange={(e) => setYInput(e.target.value)}
            className="p-2 rounded text-black w-full"
          />
        </div>
        <button
          onClick={addSignal}
          className="bg-blue-600 hover:bg-blue-700 p-2 rounded mt-6 md:mt-0"
        >
          Add Signal
        </button>
      </div>

      {signals.length > 0 && (
        <div className="flex flex-col gap-4">
          {signals.map((signal) => (
            <div key={signal.id} className="bg-gray-800 p-4 rounded">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold">{signal.name}</span>
                <button
                  onClick={() => removeSignal(signal.id)}
                  className="bg-red-600 hover:bg-red-700 p-1 rounded text-xs"
                >
                  Remove
                </button>
              </div>
              <Plot
                data={[{ x: signal.x, y: signal.y, type: "scatter", mode: "lines+markers", name: signal.name }]}
                layout={{
                  width: "100%",
                  height: 300,
                  title: signal.name,
                  paper_bgcolor: "#1f2937",
                  plot_bgcolor: "#1f2937",
                  font: { color: "white" },
                  xaxis: { title: "X Axis" },
                  yaxis: { title: "Y Axis" },
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
