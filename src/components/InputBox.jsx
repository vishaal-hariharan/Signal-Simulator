import React, { useState } from "react";

export default function InputBox({ tabs, setTabs, activeTab }) {
  const [equation, setEquation] = useState("sin(x)");
  const [minX, setMinX] = useState(0);
  const [maxX, setMaxX] = useState(10);
  const [discrete, setDiscrete] = useState(false);
  const [noiseLevel, setNoiseLevel] = useState(0);
  const [message, setMessage] = useState("");
  const [selectedSignalId, setSelectedSignalId] = useState(null);

  const currentTab = tabs.find((t) => t.id === activeTab);

  const selectSignal = (signal) => {
    setSelectedSignalId(signal.id);
    setEquation(signal.equation || "");
    setMinX(signal.x[0] ?? 0);
    setMaxX(signal.x[signal.x.length - 1] ?? 10);
    setDiscrete(signal.discrete || false);
    setNoiseLevel(signal.noiseLevel || 0);
  };

  const addOrUpdateSignal = () => {
    const N = discrete ? 50 : 500;
    const x = Array.from({ length: N }, (_, i) => minX + ((maxX - minX) * i) / (N - 1));

    const safeEquation = equation
      .replace(/sin/g, "Math.sin")
      .replace(/cos/g, "Math.cos")
      .replace(/tan/g, "Math.tan")
      .replace(/exp/g, "Math.exp")
      .replace(/log/g, "Math.log")
      .replace(/pi/g, "Math.PI");

    let y = [];
    try {
      y = x.map((val) => {
        let result = eval(safeEquation.replace(/x/g, `(${val})`));
        result += noiseLevel * (Math.random() - 0.5);
        return result;
      });
    } catch (err) {
      setMessage("Invalid equation!");
      return;
    }

    const newSignal = {
      id: selectedSignalId ?? (currentTab.signals.length + 1),
      name: `Signal ${selectedSignalId ?? (currentTab.signals.length + 1)}: ${equation}`,
      x,
      y,
      equation,
      discrete,
      noiseLevel,
      type: "scatter",
      mode: "lines",
    };

    let updatedSignals;
    if (selectedSignalId) {
      updatedSignals = currentTab.signals.map((s) =>
        s.id === selectedSignalId ? newSignal : s
      );
    } else {
      updatedSignals = [...currentTab.signals, newSignal];
    }

    const updatedTabs = tabs.map((tab) =>
      tab.id === activeTab ? { ...tab, signals: updatedSignals } : tab
    );

    setTabs(updatedTabs);
    setMessage(selectedSignalId ? "Signal updated!" : "Signal generated!");
    setSelectedSignalId(null);
    setTimeout(() => setMessage(""), 2000);
  };

  const removeSignal = (signalId) => {
    const updatedTabs = tabs.map((tab) =>
      tab.id === activeTab
        ? { ...tab, signals: tab.signals.filter((s) => s.id !== signalId) }
        : tab
    );
    setTabs(updatedTabs);
    if (signalId === selectedSignalId) setSelectedSignalId(null);
  };

  return (
    <div className="flex flex-col gap-2 bg-gray-800 p-4 rounded mb-4">
      <h2 className="text-xl font-bold">{selectedSignalId ? "Update Signal" : "Add Signal"}</h2>

      {message && <div className="text-green-400 font-semibold">{message}</div>}

      <input
        type="text"
        value={equation}
        onChange={(e) => setEquation(e.target.value)}
        placeholder="Enter equation (e.g., sin(x))"
        className="p-2 rounded text-black w-full"
      />

      <div className="flex gap-2">
        <div>
          <label>Min X:</label>
          <input
            type="number"
            value={minX}
            onChange={(e) => setMinX(Number(e.target.value))}
            className="p-2 rounded text-black"
          />
        </div>
        <div>
          <label>Max X:</label>
          <input
            type="number"
            value={maxX}
            onChange={(e) => setMaxX(Number(e.target.value))}
            className="p-2 rounded text-black"
          />
        </div>
      </div>

      <div className="flex gap-2 items-center">
        <label>Discrete:</label>
        <input
          type="checkbox"
          checked={discrete}
          onChange={() => setDiscrete(!discrete)}
        />
        <label>Noise Level:</label>
        <input
          type="number"
          value={noiseLevel}
          step={0.01}
          min={0}
          onChange={(e) => setNoiseLevel(Number(e.target.value))}
          className="p-1 rounded text-black w-20"
        />
      </div>

      <div className="flex gap-2 mt-2">
        <button
          onClick={addOrUpdateSignal}
          className="bg-blue-600 hover:bg-blue-700 p-2 rounded w-40"
        >
          {selectedSignalId ? "Update Signal" : "Generate Signal"}
        </button>

        {currentTab.signals.length > 0 && (
          <button
            onClick={() => (window.location.href = "#graph")}
            className="bg-green-600 hover:bg-green-700 p-2 rounded w-40"
          >
            Go to Graph
          </button>
        )}
      </div>

      {currentTab.signals.length > 0 && (
        <div className="mt-4 bg-gray-700 p-2 rounded max-h-40 overflow-auto">
          <h3 className="font-bold mb-1">Signals in this workspace:</h3>
          {currentTab.signals.map((s) => (
            <div
              key={s.id}
              className="flex justify-between items-center border-b border-gray-600 py-1 cursor-pointer"
              onClick={() => selectSignal(s)}
            >
              <span>{s.name}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeSignal(s.id);
                }}
                className="bg-red-600 hover:bg-red-700 p-1 rounded text-xs"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
