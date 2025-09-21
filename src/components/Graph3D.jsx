import React from "react";
import Plot from "react-plotly.js";

export default function Graph3D({ signals }) {
  if (!signals || signals.length === 0)
    return <div className="text-white text-center mt-10">No signals to display in 3D.</div>;

  return (
    <div className="w-full h-screen p-4">
      <Plot
        data={signals.map((sig) => ({
          x: sig.x,
          y: sig.y,
          z: sig.z || sig.x.map(() => 0), // default z=0 if not provided
          type: "scatter3d",
          mode: "lines",
          name: sig.name,
          line: { width: 4 },
        }))}
        layout={{
          paper_bgcolor: "#1f2937",
          plot_bgcolor: "#1f2937",
          font: { color: "white" },
          scene: {
            xaxis: { title: "X-axis" },
            yaxis: { title: "Y-axis" },
            zaxis: { title: "Z-axis" },
          },
          legend: { orientation: "h", y: 1.15 },
        }}
        config={{ responsive: true }}
        style={{ width: "100%", height: "90vh" }}
      />
    </div>
  );
}
