import React from "react";
import Plot from "react-plotly.js";

function computeFFT(x, y) {
  const N = y.length;
  const freq = Array.from({ length: N/2 }, (_, k) => k / (x[x.length-1]-x[0]));
  const mag = [];
  const phase = [];
  for(let k=0;k<N/2;k++){
    let re=0, im=0;
    for(let n=0;n<N;n++){
      re += y[n]*Math.cos(-2*Math.PI*k*n/N);
      im += y[n]*Math.sin(-2*Math.PI*k*n/N);
    }
    mag.push(Math.sqrt(re*re+im*im));
    phase.push(Math.atan2(im,re));
  }
  return { freq, mag, phase };
}

export default function FrequencyPlot({ signals }) {
  const freqData = signals.map(sig => {
    const { freq, mag } = computeFFT(sig.x, sig.y);
    return { x: freq, y: mag, type: "scatter", mode: "lines", name: sig.name };
  });

  return (
    <Plot
      data={freqData}
      layout={{
        autosize: true,
        title: "Frequency Domain",
        xaxis: { title: "Frequency" },
        yaxis: { title: "Magnitude" },
        margin: { l: 50, r: 20, t: 40, b: 50 },
        legend: { orientation: "h", y: -0.2 },
      }}
      useResizeHandler={true}
      style={{ width: "100%", height: "100%" }}
      config={{ responsive: true }}
    />
  );
}
