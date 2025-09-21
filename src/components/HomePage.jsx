import React from "react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-800 text-white flex flex-col items-center">
      {/* Header / Intro */}
      <header className="text-center mt-16 px-4">
        <h1 className="text-5xl font-bold mb-4 animate-pulse">Signal Simulator</h1>
        <p className="text-lg max-w-xl mx-auto text-gray-200">
          Welcome to the Signal Simulator — your interactive tool to generate, visualize, 
          and analyze signals in 2D, 3D, and AR. Explore time & frequency domains, add noise, 
          and compare multiple workspaces seamlessly.
        </p>
      </header>

      {/* Action Buttons / Cards */}
      <div className="flex flex-col sm:flex-row gap-8 mt-20 px-4">
        {/* Signal Viewer */}
        <div
          onClick={() => navigate("/simulator")}
          className="cursor-pointer bg-gradient-to-tr from-blue-600 to-blue-400 hover:scale-105 transform transition-all duration-300 shadow-lg rounded-xl p-8 flex flex-col items-center text-center w-64"
        >
          <h2 className="text-2xl font-semibold mb-2">Signal Viewer</h2>
          <p className="text-gray-100 text-sm">
            Explore and visualize pre-defined signals, observe their properties, and switch between workspaces.
          </p>
        </div>

        {/* Signal Generator */}
        <div
          onClick={() => navigate("/generator")}
          className="cursor-pointer bg-gradient-to-tr from-green-600 to-green-400 hover:scale-105 transform transition-all duration-300 shadow-lg rounded-xl p-8 flex flex-col items-center text-center w-64"
        >
          <h2 className="text-2xl font-semibold mb-2">Signal Generator</h2>
          <p className="text-gray-100 text-sm">
            Input your own equations or X/Y values, generate signals, plot them smoothly, and analyze their behavior.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-auto py-6 text-gray-300 text-sm text-center">
        &copy; 2025 Signal Simulator | Made for Engineering Students & Hackathons
      </footer>
    </div>
  );
}
