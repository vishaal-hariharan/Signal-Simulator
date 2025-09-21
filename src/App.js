import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import GraphPlot from "./components/GraphPlot";
import InputBox from "./components/InputBox";

function App() {
  const [tabs, setTabs] = useState([{ id: 1, name: "Workspace 1", signals: [] }]);
  const [activeTab, setActiveTab] = useState(1); // track currently active workspace

  const addWorkspace = () => {
    const newId = tabs.length + 1;
    setTabs([...tabs, { id: newId, name: `Workspace ${newId}`, signals: [] }]);
    setActiveTab(newId); // optionally make new workspace active
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-950 text-white">
      <Navbar />
      <main className="flex-grow flex flex-col p-6">
        <InputBox tabs={tabs} setTabs={setTabs} activeTab={activeTab} />  {/* pass activeTab */}
        <div className="flex gap-2 mb-4">
          <button onClick={addWorkspace} className="bg-purple-600 hover:bg-purple-700 p-2 rounded w-44">
            Add New Workspace
          </button>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`px-4 py-1 rounded ${activeTab === tab.id ? "bg-blue-600 text-white" : "bg-gray-400 text-black"}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.name}
            </button>
          ))}
        </div>
        <GraphPlot tabs={tabs} activeTab={activeTab} />  {/* pass activeTab */}
      </main>
      <Footer />
    </div>
  );
}

export default App;
