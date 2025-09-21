import React, { useState } from "react";
import Plot from "react-plotly.js";

export default function SignalGenerator() {
  const [xValues, setXValues] = useState("");
  const [yValues, setYValues] = useState("");
  const [signal, setSignal] = useState([]);

  const plotSignal = () => {
    const xArr = xValues.split(",").map((v) => parseFloat(v.trim()));
    const yArr = yValues.split(",").map((v) => parseFloat(v.trim()));

    if (xArr.length !== yArr.length) {
      alert("X and Y must have the same number of values");
      return;
    }

    setSignal([{ x: xArr, y: yArr, type: "scatter", mode: "lines+markers", name: "User Signal" }]);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-6">Custom Signal Generator</h1>

      <div className="flex flex-col gap-4 w-full max-w-lg">
        <input
          type="text"
          placeholder="Enter X values separated by commas"
          value={xValues}
          onChange={(e) => setXValues(e.target.value)}
          className="p-2 rounded text-black w-full"
        />
        <input
          type="text"
          placeholder="Enter Y values separated by commas"
          value={yValues}
          onChange={(e) => setYValues(e.target.value)}
          className="p-2 rounded text-black w-full"
        />

        <button
          onClick={plotSignal}
          className="bg-blue-600 hover:bg-blue-700 p-2 rounded w-full"
        >
          Plot Signal
        </button>
      </div>

      <div className="mt-6 w-full max-w-2xl">
        {signal.length > 0 && (
          <Plot
            data={signal}
            layout={{
              width: 700,
              height: 400,
              title: "Custom Signal Plot",
              paper_bgcolor: "#1f2937",
              plot_bgcolor: "#1f2937",
              font: { color: "white" },
              xaxis: { title: "X Axis" },
              yaxis: { title: "Y Axis" },
            }}
          />
        )}
      </div>
    </div>
  );
}
