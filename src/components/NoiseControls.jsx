import { useState } from "react";
import { ma } from "moving-averages";  // <-- fixed import

function NoiseControls({ signal, setSignal }) {
  const [noiseLevel, setNoiseLevel] = useState(0);

  // Add noise
  const addNoise = () => {
    const noisy = signal.map((y) => y + (Math.random() - 0.5) * noiseLevel);
    setSignal(noisy);
  };

  // Apply moving average filter
  const applyFilter = () => {
    if (signal.length < 5) return;
    const filtered = ma(signal, 5); // window size = 5
    // pad to same length
    const padded = Array(signal.length - filtered.length).fill(filtered[0]).concat(filtered);
    setSignal(padded);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 items-center bg-gray-700 p-4 rounded-xl mt-4">
      <div className="flex items-center space-x-2">
        <label>Noise:</label>
        <input
          type="range"
          min="0"
          max="2"
          step="0.1"
          value={noiseLevel}
          onChange={(e) => setNoiseLevel(parseFloat(e.target.value))}
        />
        <span>{noiseLevel}</span>
      </div>
      <button
        onClick={addNoise}
        className="px-3 py-1 bg-pink-500 hover:bg-pink-600 rounded-lg"
      >
        Add Noise
      </button>
      <button
        onClick={applyFilter}
        className="px-3 py-1 bg-blue-500 hover:bg-blue-600 rounded-lg"
      >
        Apply Filter
      </button>
    </div>
  );
}

export default NoiseControls;
