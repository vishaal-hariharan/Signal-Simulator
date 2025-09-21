import React from "react";

// Helper: check approximate equality
const approxEqual = (a, b, tol = 1e-3) => Math.abs(a - b) < tol;

// Even / Odd check
const checkEvenOdd = (y) => {
  const N = y.length;
  let even = true,
    odd = true;
  for (let i = 0; i < N / 2; i++) {
    if (!approxEqual(y[i], y[N - 1 - i])) even = false;
    if (!approxEqual(y[i], -y[N - 1 - i])) odd = false;
  }
  return { even, odd };
};

// Check if two signals are reversed
const isReversed = (y1, y2) => {
  const N = y1.length;
  for (let i = 0; i < N; i++) {
    if (!approxEqual(y1[i], y2[N - 1 - i])) return false;
  }
  return true;
};

// Check if a signal is time-shifted (simple numeric cross-correlation)
const checkShift = (x, y, refX, refY, tol = 1e-3) => {
  const N = y.length;
  for (let shift = -N / 2; shift < N / 2; shift++) {
    let match = true;
    for (let i = 0; i < N; i++) {
      const j = i + shift;
      if (j >= 0 && j < N) {
        if (!approxEqual(y[i], refY[j], tol)) {
          match = false;
          break;
        }
      }
    }
    if (match) return shift * ((x[x.length - 1] - x[0]) / N); // approximate shift in x units
  }
  return 0; // no shift found
};

// Energy and Power
const computeEnergy = (y, dx = 1) => y.reduce((acc, v) => acc + v * v * dx, 0);
const computePower = (y, dx = 1) => computeEnergy(y, dx) / y.length;

// Intersection points between two signals
const findIntersections = (s1, s2, tol = 1e-2) => {
  const points = [];
  const N = Math.min(s1.x.length, s2.x.length);
  for (let i = 0; i < N; i++) {
    if (approxEqual(s1.y[i], s2.y[i], tol)) {
      points.push({ x: s1.x[i], y: s1.y[i] });
    }
  }
  return points;
};

export default function PropertiesTable({ signals }) {
  if (!signals || signals.length === 0) {
    return <div className="text-white text-center mt-10">No signals to analyze.</div>;
  }

  const intersections = [];
  if (signals.length > 1) {
    for (let i = 0; i < signals.length - 1; i++) {
      for (let j = i + 1; j < signals.length; j++) {
        const pts = findIntersections(signals[i], signals[j]);
        if (pts.length > 0) intersections.push({ sig1: signals[i].name, sig2: signals[j].name, points: pts });
      }
    }
  }

  return (
    <div className="overflow-auto bg-gray-800 p-4 rounded">
      <table className="min-w-full table-auto border-collapse border border-gray-600">
        <thead>
          <tr className="bg-gray-700">
            <th className="border border-gray-600 px-2 py-1">Signal Name</th>
            <th className="border border-gray-600 px-2 py-1">Even</th>
            <th className="border border-gray-600 px-2 py-1">Odd</th>
            <th className="border border-gray-600 px-2 py-1">Energy</th>
            <th className="border border-gray-600 px-2 py-1">Power</th>
            <th className="border border-gray-600 px-2 py-1">Time Shift / Reversal</th>
          </tr>
        </thead>
        <tbody>
          {signals.map((s, idx) => {
            const dx = (s.x[s.x.length - 1] - s.x[0]) / (s.x.length - 1);
            const { even, odd } = checkEvenOdd(s.y);
            const energy = computeEnergy(s.y, dx).toFixed(2);
            const power = computePower(s.y, dx).toFixed(2);

            // Compare with original first signal for shift/reversal
            let timeShiftReversal = "Original";
            if (idx > 0) {
              const ref = signals[0];
              if (isReversed(s.y, ref.y)) timeShiftReversal = "Reversed";
              else {
                const shift = checkShift(s.x, s.y, ref.x, ref.y);
                if (shift !== 0) timeShiftReversal = `Shifted by ${shift.toFixed(2)} units`;
              }
            }

            return (
              <tr key={s.id} className="text-center border border-gray-600">
                <td className="border border-gray-600 px-2 py-1">{s.name}</td>
                <td className="border border-gray-600 px-2 py-1">{even ? "Yes" : "No"}</td>
                <td className="border border-gray-600 px-2 py-1">{odd ? "Yes" : "No"}</td>
                <td className="border border-gray-600 px-2 py-1">{energy}</td>
                <td className="border border-gray-600 px-2 py-1">{power}</td>
                <td className="border border-gray-600 px-2 py-1">{timeShiftReversal}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {intersections.length > 0 && (
        <div className="mt-4 text-white">
          <h3 className="font-bold mb-2">Intersection Points:</h3>
          {intersections.map((inter, idx) => (
            <div key={idx} className="mb-2">
              <strong>{inter.sig1} & {inter.sig2}:</strong>{" "}
              {inter.points.map((p, i) => `(${p.x.toFixed(2)}, ${p.y.toFixed(2)})`).join(", ")}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
