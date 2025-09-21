import React, { useState } from "react";
import TimeDomainPlot from "./TimeDomainPlot";
import Graph3D from "./Graph3D";
import InputBox from "./InputBox";
import PropertiesTable from "./PropertiesTable";

export default function GraphPlot() {
  const [activeTab, setActiveTab] = useState(1); // workspace tab
  const [tabs, setTabs] = useState([
    { id: 1, name: "Workspace 1", signals: [] },
  ]);
  const [show3D, setShow3D] = useState(false);

  const activeSignals = tabs.find((t) => t.id === activeTab)?.signals || [];

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Top: Workspace Tabs */}
      <div className="flex space-x-2 p-2 bg-gray-800">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`px-4 py-2 rounded ${
              tab.id === activeTab ? "bg-blue-600" : "bg-gray-700"
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.name}
          </button>
        ))}
        <button
          className="px-4 py-2 rounded bg-green-600"
          onClick={() =>
            setTabs([...tabs, { id: tabs.length + 1, name: `Workspace ${tabs.length + 1}`, signals: [] }])
          }
        >
          + Add Workspace
        </button>
      </div>

      {/* Middle: Input & Controls */}
      <div className="flex flex-col md:flex-row flex-grow">
        <div className="w-full md:w-1/3 p-4">
          <InputBox tabs={tabs} setTabs={setTabs} activeTab={activeTab} />
          <button
            onClick={() => setShow3D(!show3D)}
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 p-2 rounded"
          >
            {show3D ? "Back to 2D" : "Show 3D"}
          </button>
        </div>

        {/* Right: Graph + Properties */}
        <div className="w-full md:w-2/3 p-4 flex flex-col">
          {activeSignals.length === 0 ? (
            <div className="text-center mt-10">No signals to display.</div>
          ) : show3D ? (
            <Graph3D signals={activeSignals} />
          ) : (
            <TimeDomainPlot signals={activeSignals} />
          )}

          <div className="mt-4">
            <PropertiesTable signals={activeSignals} />
          </div>
        </div>
      </div>
    </div>
  );
}
