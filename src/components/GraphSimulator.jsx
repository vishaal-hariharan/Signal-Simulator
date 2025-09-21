import React, { useState } from "react";
import TimeDomainPlot from "./TimeDomainPlot";
import FrequencyPlot from "./FrequencyPlot";
import Graph3D from "./Graph3D";
import Graph3DAR from "./Graph3DAR";
import InputBox from "./InputBox";
import PropertiesTable from "./PropertiesTable";
import NoiseControls from "./NoiseControls";

export default function GraphSimulator() {
  const [tabs, setTabs] = useState([{ id: 1, name: "Workspace 1", signals: [] }]);
  const [activeTab, setActiveTab] = useState(1);
  const [show3D, setShow3D] = useState(false);
  const [showAR, setShowAR] = useState(false);
  const [showFrequency, setShowFrequency] = useState(false);
  const [compareMode, setCompareMode] = useState(false); // NEW

  const activeSignals = compareMode
    ? tabs.flatMap((t) => t.signals) // Compare all workspaces
    : tabs.find((t) => t.id === activeTab)?.signals || [];

  const deleteWorkspace = (tabId) => {
    if (tabs.length === 1) return alert("Cannot delete the last workspace!");
    const updatedTabs = tabs.filter((t) => t.id !== tabId);
    setTabs(updatedTabs);
    if (activeTab === tabId) setActiveTab(updatedTabs[0].id);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Workspace Tabs */}
      <div className="flex space-x-2 p-2 bg-gray-800 items-center">
        {tabs.map((tab) => (
          <div key={tab.id} className="flex items-center space-x-1">
            <button
              className={`px-3 py-1 rounded ${tab.id === activeTab ? "bg-blue-600" : "bg-gray-700"}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.name}
            </button>
            <button
              onClick={() => deleteWorkspace(tab.id)}
              className="bg-red-600 hover:bg-red-700 px-1 rounded text-xs"
            >
              X
            </button>
          </div>
        ))}
        <button
          className="px-4 py-1 rounded bg-green-600"
          onClick={() =>
            setTabs([...tabs, { id: tabs.length + 1, name: `Workspace ${tabs.length + 1}`, signals: [] }])
          }
        >
          + Add Workspace
        </button>

        {/* Compare Workspaces */}
        <button
          className={`ml-4 px-3 py-1 rounded ${compareMode ? "bg-purple-600" : "bg-gray-700"}`}
          onClick={() => setCompareMode(!compareMode)}
        >
          {compareMode ? "Exit Compare" : "Compare Workspaces"}
        </button>
      </div>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row flex-grow">
        {/* Left Panel */}
        <div className="w-full md:w-1/4 p-4 flex flex-col gap-4">
          <InputBox tabs={tabs} setTabs={setTabs} activeTab={activeTab} />

          {/* Noise Controls */}
          {activeSignals.length > 0 && (
            <NoiseControls
              signal={activeSignals[0]?.y}
              setSignal={(newY) => {
                const updatedTabs = tabs.map((tab) =>
                  tab.id === activeTab
                    ? {
                        ...tab,
                        signals: tab.signals.map((s, i) =>
                          i === 0 ? { ...s, y: newY } : s
                        ),
                      }
                    : tab
                );
                setTabs(updatedTabs);
              }}
            />
          )}

          {/* Toggles */}
          <button
            onClick={() => setShow3D(!show3D)}
            className="bg-blue-600 hover:bg-blue-700 p-2 rounded"
          >
            {show3D ? "Back to 2D" : "Show 3D"}
          </button>

          <button
            onClick={() => setShowAR(!showAR)}
            className="bg-purple-600 hover:bg-purple-700 p-2 rounded"
          >
            {showAR ? "Back to 3D" : "View in AR"}
          </button>

          <button
            onClick={() => setShowFrequency(!showFrequency)}
            className="bg-green-600 hover:bg-green-700 p-2 rounded"
          >
            {showFrequency ? "Back to Time Domain" : "Show Frequency"}
          </button>
        </div>

        {/* Right Panel: Graph + Properties */}
        <div className="w-full md:w-3/4 p-4 flex flex-col">
          {activeSignals.length === 0 ? (
            <div className="text-center mt-10">No signals to display.</div>
          ) : showAR ? (
            <Graph3DAR signals={activeSignals} />
          ) : show3D ? (
            <Graph3D signals={activeSignals} />
          ) : showFrequency ? (
            <FrequencyPlot signals={activeSignals} />
          ) : (
            <TimeDomainPlot signals={activeSignals} />
          )}

          {/* Properties Table */}
          <div className="mt-4">
            <PropertiesTable signals={activeSignals} />
          </div>
        </div>
      </div>
    </div>
  );
}
