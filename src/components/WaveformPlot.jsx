import { useState } from "react";
import Plot from "react-plotly.js";
import { evaluate } from "mathjs";
import NoiseControls from "./NoiseControls";

function WaveformPlot() {
  const [equation, setEquation] = useState("sin(x)");
  const [xValues, setXValues] = useState([]);
  const [yValues, setYValues] = useState([]);

  const plotGraph = () => {
    try {
      let x = [];
      let y = [];
      for (let i = -10; i <= 10; i += 0.1) {
        x.push(i);
        y.push(evaluate(equation, { x: i }));
      }
      setXValues(x);
      setYValues(y);
    } catch (error) {
      alert("Invalid equation. Try sin(x), cos(x), x^2, etc.");
    }
  };

  return (
    <div className="w-full max-w-3xl p-4 bg-gray-800 rounded-2xl shadow-lg">
      <h2 className="text-xl font-bold mb-4">📈 Equation to Waveform</h2>

      <div className="flex space-x-2 mb-4">
        <input
          type="text"
          value={equation}
          onChange={(e) => setEquation(e.target.value)}
          placeholder="Enter equation (e.g. sin(x), x^2)"
          className="flex-grow px-3 py-2 rounded-lg text-black"
        />
        <button
          onClick={plotGraph}
          className="px-4 py-2 bg-teal-500 hover:bg-teal-600 rounded-lg"
        >
          Plot
        </button>
      </div>

      {xValues.length > 0 && (
        <>
          <Plot
            data={[
              {
                x: xValues,
                y: yValues,
                type: "scatter",
                mode: "lines",
                marker: { color: "teal" },
              },
            ]}
            layout={{
              title: `y = ${equation}`,
              paper_bgcolor: "#1f2937",
              plot_bgcolor: "#1f2937",
              font: { color: "white" },
            }}
          />
          {/* Noise + Filter Controls */}
          <NoiseControls signal={yValues} setSignal={setYValues} />
        </>
      )}
    </div>
  );
}

export default WaveformPlot;
