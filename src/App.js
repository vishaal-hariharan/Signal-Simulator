import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Import Router, Routes, Route
import HomePage from "./components/HomePage";
import GraphSimulator from "./components/GraphSimulator";
import SignalGenerator from "./components/SignalGenerator"; // Make sure this file exists

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/simulator" element={<GraphSimulator />} />
        <Route path="/generator" element={<SignalGenerator />} />
      </Routes>
    </Router>
  );
}

export default App; // Make sure App is exported as default
