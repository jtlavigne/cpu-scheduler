'use client'; // Add this line to indicate it's a client component

import { useState } from "react";
import { jsPDF } from "jspdf";
import { Bar } from "react-chartjs-2";

// Dynamically import Chart.js and react-chartjs-2 (to avoid SSR issues)
import dynamic from "next/dynamic";

// Dynamically import the Chart component on the client-side
const Chart = dynamic(() => import("react-chartjs-2").then((mod) => mod.Chart), {
  ssr: false, // Ensure it's only rendered on the client side
});

import {
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
import { Chart as ChartJS } from "chart.js";
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// CPU Scheduling Algorithm Functions

// FIFO: First In, First Out
function fifo(processes) {
  let time = 0;
  const result = [];
  const timeline = [];
  processes.forEach((process, index) => {
    const startTime = time;
    time += process.burstTime;
    result.push({ processId: index + 1, completionTime: time });
    timeline.push({ processId: index + 1, startTime, endTime: time });
  });
  return { result, timeline };
}

// SJF: Shortest Job First
function sjf(processes) {
  let time = 0;
  const result = [];
  const timeline = [];
  processes.sort((a, b) => a.burstTime - b.burstTime);
  processes.forEach((process, index) => {
    const startTime = time;
    time += process.burstTime;
    result.push({ processId: index + 1, completionTime: time });
    timeline.push({ processId: index + 1, startTime, endTime: time });
  });
  return { result, timeline };
}

function rr(processes, timeQuantum) {
  let time = 0;
  const result = [];
  const timeline = [];
  let queue = [...processes];
  let completionTimes = {}; // Store the last completion time for each process

  while (queue.length > 0) {
    let process = queue.shift();
    const startTime = time;
    const execTime = Math.min(process.burstTime, timeQuantum);
    time += execTime;
    process.burstTime -= execTime;

    if (process.burstTime > 0) {
      queue.push(process);
    }

    timeline.push({ processId: process.id, startTime, endTime: time });
    completionTimes[process.id] = time; // Always update to track last completion
  }

  // Convert to array format for graphing
  Object.entries(completionTimes).forEach(([processId, completionTime]) => {
    result.push({ processId: parseInt(processId), completionTime });
  });

  return { result, timeline };
}

function mlfq(processes) {
  let time = 0;
  const result = [];
  const timeline = [];
  const queue1 = [];
  const queue2 = [];
  let completionTimes = {}; // Store last completion times

  processes.forEach((process) => queue1.push(process));

  while (queue1.length > 0 || queue2.length > 0) {
    if (queue1.length > 0) {
      let process = queue1.shift();
      const startTime = time;
      const execTime = Math.min(process.burstTime, 2);
      time += execTime;
      process.burstTime -= execTime;
      if (process.burstTime > 0) queue2.push(process);
      timeline.push({ processId: process.id, startTime, endTime: time });
      completionTimes[process.id] = time;
    } else if (queue2.length > 0) {
      let process = queue2.shift();
      const startTime = time;
      const execTime = Math.min(process.burstTime, 4);
      time += execTime;
      process.burstTime -= execTime;
      if (process.burstTime > 0) queue2.push(process);
      timeline.push({ processId: process.id, startTime, endTime: time });
      completionTimes[process.id] = time;
    }
  }

  // Convert completion times to array format for graphing
  Object.entries(completionTimes).forEach(([processId, completionTime]) => {
    result.push({ processId: parseInt(processId), completionTime });
  });

  return { result, timeline };
}


// STCF: Shortest Time-to-Completion First
function stcf(processes) {
  let time = 0;
  const result = [];
  const timeline = [];
  let remainingProcesses = [...processes];
  
  while (remainingProcesses.length > 0) {
    remainingProcesses.sort((a, b) => a.burstTime - b.burstTime);
    const process = remainingProcesses.shift();
    const startTime = time;
    time += process.burstTime;
    result.push({ processId: process.id, completionTime: time });
    timeline.push({ processId: process.id, startTime, endTime: time });
  }
  return { result, timeline };
}

// Generate Random Processes
function generateRandomProcesses(numProcesses) {
  const processes = [];
  for (let i = 0; i < numProcesses; i++) {
    processes.push({
      id: i + 1,
      burstTime: Math.floor(Math.random() * 10) + 1,
    });
  }
  return processes;
}

// BarChart Component for displaying results using Chart.js
function BarChart({ data }) {
  const chartData = {
    labels: data.map((d, i) => `Process ${i + 1}`),
    datasets: [
      {
        label: "Completion Time",
        data: data.map((d) => d.completionTime),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  return <Chart type="bar" data={chartData} />;
}

function TimelineChart({ data }) {
  const processColors = {};
  const seenProcesses = new Set(); // Track which processes have been labeled

  const getColor = (id) => {
    if (!processColors[id]) {
      processColors[id] = `hsl(${(id * 137) % 360}, 70%, 50%)`; // Ensures unique but consistent colors
    }
    return processColors[id];
  };

  const chartData = {
    labels: ["Processes"], // Single row for all processes
    datasets: data.map((process) => {
      const label = seenProcesses.has(process.processId) ? "" : `Process ${process.processId}`;
      seenProcesses.add(process.processId); // Mark this process as labeled

      return {
        label, // Only the first occurrence gets a label
        data: [{ x: [process.startTime, process.endTime], y: 0 }], // Single-row timeline
        backgroundColor: getColor(process.processId),
        borderColor: "black",
        borderWidth: 1,
        barThickness: 20,
      };
    }),
  };

  const options = {
    responsive: true,
    indexAxis: "y", // Horizontal bar chart
    scales: {
      x: {
        type: "linear",
        position: "bottom",
        title: {
          display: true,
          text: "Time",
        },
      },
      y: {
        display: false, // Hide Y-axis labels
      },
    },
    plugins: {
      legend: {
        display: true,
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const dataset = tooltipItem.dataset;
            const process = dataset.data[tooltipItem.dataIndex];
            const totalTime = process.x[1] - process.x[0]; // Total execution time
            return `Total Time: ${totalTime}`;
          },
        },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
}

export default function Home() {
  const [numProcesses, setNumProcesses] = useState(5);
  const [timeQuantum, setTimeQuantum] = useState(3);
  const [results, setResults] = useState([]);
  const [timelineData, setTimelineData] = useState([]);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("FIFO");

  const handleRunAlgorithm = () => {
    const processes = generateRandomProcesses(numProcesses);

    let result;
    let timeline;
    switch (selectedAlgorithm) {
      case "FIFO":
        ({ result, timeline } = fifo(processes));
        break;
      case "SJF":
        ({ result, timeline } = sjf(processes));
        break;
      case "RR":
        ({ result, timeline } = rr(processes, timeQuantum));
        break;
      case "STCF":
        ({ result, timeline } = stcf(processes));
        break;
      case "MLFQ":
        ({ result, timeline } = mlfq(processes));
        break;
      default:
        result = [];
        timeline = [];
    }
    setResults(result);
    setTimelineData(timeline);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("CPU Scheduling Algorithm Results", 10, 10);
    results.forEach((result, index) => {
      doc.text(`Process ${index + 1}: Completion Time - ${result.completionTime}`, 10, 20 + index * 10);
    });
    doc.save("scheduling_results.pdf");
  };

  return (
    <div className="bg-gray-100 min-h-screen p-8 pb-20">
      {/* Header */}
      <header className="bg-blue-600 text-white w-full py-6 text-center font-bold text-3xl shadow-lg mb-8">
        CPU Scheduling Simulator
      </header>

      <main className="flex flex-col gap-[32px] items-center">
        {/* Inputs */}
        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <label className="text-lg text-gray-700">Number of Processes:</label>
          <input
            type="number"
            value={numProcesses}
            onChange={(e) => setNumProcesses(parseInt(e.target.value))}
            className="border rounded px-3 py-2 text-black shadow-md"
          />

          <label className="text-lg text-gray-700">Time Quantum (for RR):</label>
          <input
            type="number"
            value={timeQuantum}
            onChange={(e) => setTimeQuantum(parseInt(e.target.value))}
            className="border rounded px-3 py-2 text-black shadow-md"
          />

          <label className="text-lg text-gray-700">Select Algorithm:</label>
          <select
            value={selectedAlgorithm}
            onChange={(e) => setSelectedAlgorithm(e.target.value)}
            className="border rounded px-3 py-2 text-black shadow-md"
          >
            <option value="FIFO">FIFO</option>
            <option value="SJF">SJF</option>
            <option value="RR">RR</option>
            <option value="STCF">STCF</option>
            <option value="MLFQ">MLFQ</option>
          </select>
        </div>

        {/* Run Button */}
        <button
          onClick={handleRunAlgorithm}
          className="bg-blue-500 text-white rounded px-6 py-3 mt-4 hover:bg-blue-700 transition-all"
        >
          Run Algorithm
        </button>

        {/* Results */}
        {results.length > 0 && (
          <>
            <BarChart data={results} />
            <TimelineChart data={timelineData} />
            <button
              onClick={generatePDF}
              className="bg-green-500 text-white rounded px-6 py-3 mt-4 hover:bg-green-700 transition-all"
            >
              Download PDF
            </button>
          </>
        )}
      </main>
    </div>
  );
}
