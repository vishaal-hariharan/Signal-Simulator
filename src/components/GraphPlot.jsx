import React, { useState } from "react";
import TimeDomainPlot from "./TimeDomainPlot";
import FrequencyPlot from "./FrequencyPlot";
import Graph3D from "./Graph3D";
import PropertiesTable from "./PropertiesTable";
import NoiseControls from "./NoiseControls";

export default function GraphPlot({ tabs, setTabs, activeTab }) {
  const [show3D, setShow3D] = useState(false);
  const [showFrequency, setShowFrequency] = useState(false);
  const [activeSignalIndex, setActiveSignalIndex] = useState(0);

  const currentTab = tabs.find((t) => t.id === activeTab);
  const signals = currentTab?.signals || [];
  const signal = signals[activeSignalIndex];

  const setSignal = (newY) => {
    if (!signal) return;
    const updatedSignals = signals.map((s, i) =>
      i === activeSignalIndex ? { ...s, y: newY } : s
    );
    setTabs(
      tabs.map((t) => (t.id === activeTab ? { ...t, signals: updatedSignals } : t))
    );
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 mt-4 h-[75vh]">
      {/* Left panel: Controls */}
      <div className="w-full md:w-1/4 flex flex-col gap-4">
        <button
          onClick={() => setShow3D(!show3D)}
          className="bg-blue-600 hover:bg-blue-700 p-2 rounded"
        >
          {show3D ? "Back to 2D" : "Show 3D"}
        </button>

        <button
          onClick={() => setShowFrequency(!showFrequency)}
          className="bg-green-600 hover:bg-green-700 p-2 rounded"
        >
          {showFrequency ? "Back to Time Domain" : "Show Frequency"}
        </button>

        {/* Signal Selector */}
        {signals.length > 0 && (
          <div className="mt-4">
            <label className="font-semibold">Select Signal:</label>
            <select
              value={activeSignalIndex}
              onChange={(e) => setActiveSignalIndex(Number(e.target.value))}
              className="w-full p-2 rounded bg-gray-600 text-white mt-1"
            >
              {signals.map((s, i) => (
                <option key={s.id} value={i}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Noise Controls */}
        {signal && (
          <div className="mt-4">
            <NoiseControls signal={signal.y} setSignal={setSignal} />
          </div>
        )}
      </div>

      {/* Right panel: Graph + Properties */}
      <div className="w-full md:w-3/4 flex flex-col gap-2 h-full">
        <div className="flex-grow bg-gray-800 p-2 rounded" style={{ flex: "0 0 70%" }}>
          {signals.length === 0 ? (
            <div className="text-center mt-10">No signals to display.</div>
          ) : show3D ? (
            <div className="h-full w-full">
              <Graph3D signals={signals} />
            </div>
          ) : showFrequency ? (
            <div className="h-full w-full">
              <FrequencyPlot signals={signals} />
            </div>
          ) : (
            <div className="h-full w-full">
              <TimeDomainPlot signals={signals} />
            </div>
          )}
        </div>

        <div className="bg-gray-700 p-2 rounded overflow-auto" style={{ flex: "0 0 30%" }}>
          {signals.length > 0 ? (
            <PropertiesTable signals={signals} />
          ) : (
            <div className="text-gray-400 text-sm text-center">No properties to display.</div>
          )}
        </div>
      </div>
    </div>
  );
}
