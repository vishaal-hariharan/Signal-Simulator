import React from "react";
import jsPDF from "jspdf";
import Plotly from "plotly.js-dist";

export default function ReportGenerator({ tabs = [], activeTab = 1 }) {
  const generateReport = async () => {
    if (!tabs || tabs.length === 0) return alert("No workspaces found!");

    const currentTab = tabs.find((t) => t.id === activeTab);
    if (!currentTab || !currentTab.signals || currentTab.signals.length === 0)
      return alert("No signals in the active workspace!");

    const pdf = new jsPDF();
    let yOffset = 10;

    pdf.setFontSize(16);
    pdf.text("Signal Simulator - Lab Report", 10, yOffset);
    yOffset += 10;

    for (let idx = 0; idx < currentTab.signals.length; idx++) {
      const signal = currentTab.signals[idx];

      pdf.setFontSize(12);
      pdf.text(`Signal ${idx + 1}: ${signal.name}`, 10, yOffset);
      yOffset += 8;

      const minY = Math.min(...signal.y).toFixed(3);
      const maxY = Math.max(...signal.y).toFixed(3);
      const meanY = (signal.y.reduce((a, b) => a + b, 0) / signal.y.length).toFixed(3);

      pdf.text(`Min: ${minY} | Max: ${maxY} | Mean: ${meanY}`, 10, yOffset);
      yOffset += 10;

      const plotDiv = document.getElementById(`graph-${signal.id}`);
      if (plotDiv) {
        try {
          const imgData = await Plotly.toImage(plotDiv, { format: "png", height: 300, width: 400 });
          pdf.addImage(imgData, "PNG", 10, yOffset, 180, 80);
          yOffset += 90;
        } catch (err) {
          console.error("Plotly image error:", err);
        }
      }

      // Add page if needed
      if (yOffset > 250) {
        pdf.addPage();
        yOffset = 10;
      }
    }

    pdf.save("LabReport.pdf");
  };

  return (
    <button
      onClick={generateReport}
      className="bg-yellow-500 hover:bg-yellow-600 p-2 rounded mt-2"
    >
      Generate Lab Report
    </button>
  );
}
