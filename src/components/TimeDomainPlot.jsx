import React from "react";
import Plot from "react-plotly.js";

export default function TimeDomainPlot({ signals }) {
  return (
    <Plot
      data={signals}
      layout={{
        autosize: true,
        title: "Time Domain",
        xaxis: { title: "t" },
        yaxis: { title: "Amplitude" },
        margin: { l: 50, r: 20, t: 40, b: 50 },
        legend: { orientation: "h", y: -0.2 },
      }}
      useResizeHandler={true}
      style={{ width: "100%", height: "100%" }}
      config={{ responsive: true }}
    />
  );
}
