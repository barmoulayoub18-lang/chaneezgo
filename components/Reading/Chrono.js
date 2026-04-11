"use client";
import { useState, useRef } from "react";
import { Play, Square } from "lucide-react";

export default function Chrono({ phrases = [] }) {
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);

  const start = () => {
    if (running) return;

    setRunning(true);
    intervalRef.current = setInterval(() => {
      setTime((prev) => prev + 1);
    }, 1000);
  };

  const stop = () => {
    clearInterval(intervalRef.current);
    setRunning(false);
  };

  const reset = () => {
    clearInterval(intervalRef.current);
    setRunning(false);
    setTime(0);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border space-y-4">
      <h3 className="text-xl font-bold text-center">⏱️ Défi du Chrono</h3>

      <div className="text-center text-4xl font-black text-blue-600">
        {time}s
      </div>

      <div className="flex justify-center gap-3">
        <button
          onClick={start}
          className="bg-green-500 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <Play size={16} /> Start
        </button>

        <button
          onClick={stop}
          className="bg-red-500 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <Square size={16} /> Stop
        </button>

        <button
          onClick={reset}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Reset
        </button>
      </div>

      <div className="space-y-2 text-center">
        {phrases.map((p, i) => (
          <p key={i} className="font-semibold text-gray-700">
            {p}
          </p>
        ))}
      </div>
    </div>
  );
}