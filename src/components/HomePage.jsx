import React from "react";
import { useNavigate } from "react-router-dom";
import { FaWaveSquare, FaMicrophone, FaProjectDiagram } from "react-icons/fa";

export default function HomePage() {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Signal Viewer",
      desc: "Explore and visualize pre-defined signals, observe their properties, and switch between workspaces.",
      gradient: "from-blue-600 to-blue-400",
      icon: <FaWaveSquare size={40} />,
      path: "/simulator",
    },
    {
      title: "Signal Generator",
      desc: "Input your own equations or X/Y values, generate signals, plot them smoothly, and analyze their behavior.",
      gradient: "from-green-600 to-green-400",
      icon: <FaProjectDiagram size={40} />,
      path: "/generator",
    },
    {
      title: "Voice Signal",
      desc: "Record or upload voice, analyze its waveform, apply noise control, and perform signal operations like shifting and reversal.",
      gradient: "from-pink-600 to-pink-400",
      icon: <FaMicrophone size={40} />,
      path: "/voice-signal",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-800 text-white flex flex-col items-center p-6">
      {/* Header */}
      <header className="text-center mt-16 px-4">
        <h1 className="text-5xl font-bold mb-4 animate-pulse">Signal Simulator</h1>
        <p className="text-lg max-w-2xl mx-auto text-gray-200">
          Welcome to the Signal Simulator — your interactive tool to generate, visualize,
          and analyze signals in 2D, 3D, and AR. Explore time & frequency domains, add noise,
          and compare multiple workspaces seamlessly.
        </p>
      </header>

      {/* Action Cards */}
      <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-8 mt-20 px-4">
        {cards.map((card) => (
          <div
            key={card.title}
            onClick={() => navigate(card.path)}
            className={`cursor-pointer bg-gradient-to-tr ${card.gradient} hover:scale-105 transform transition-all duration-300 shadow-2xl rounded-xl p-8 flex flex-col items-center text-center w-64 relative group`}
          >
            {/* Icon */}
            <div className="mb-4 text-white group-hover:animate-bounce">{card.icon}</div>

            {/* Title */}
            <h2 className="text-2xl font-semibold mb-2">{card.title}</h2>

            {/* Description */}
            <p className="text-gray-100 text-sm">{card.desc}</p>

            {/* Hover effect overlay */}
            <div className="absolute inset-0 rounded-xl bg-white/10 opacity-0 group-hover:opacity-25 transition-opacity duration-300"></div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer className="mt-auto py-6 text-gray-300 text-sm text-center">
        &copy; 2025 Signal Simulator | Made for Engineering Students
      </footer>
    </div>
  );
}

