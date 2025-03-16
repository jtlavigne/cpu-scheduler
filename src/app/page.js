'use client'; // Add this line to indicate it's a client component

import { useState } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
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
  const [processes, setProcesses] = useState([]); // Store generated processes

  const handleGenerateProcesses = () => {
    const newProcesses = generateRandomProcesses(numProcesses);
    setProcesses(newProcesses);
  };

  const handleRunAlgorithm = () => {
    if (processes.length === 0) return; // Ensure processes exist

    let result, timeline;
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

  // ✅ Generate PDF Report
  const generatePDF = () => {
    const doc = new jsPDF();
  
    // Title
    doc.setFontSize(16);
    doc.text("CPU Scheduling Algorithm Results", 14, 15);
    doc.setFontSize(12);
    doc.text(`Algorithm Used: ${selectedAlgorithm}`, 14, 25);
  
    // Check if results exist
    if (results.length === 0) {
      doc.text("No data available", 14, 35);
      doc.save("scheduling_results.pdf");
      return;
    }
  
    // Process Table (Ensure `processes` is not undefined)
    if (processes && processes.length > 0) {
      autoTable(doc, {
        startY: 35,
        head: [["Process ID", "Burst Time"]],
        body: processes.map((p) => [p.id, p.burstTime]),
      });
    }
  
    // Get last table Y position safely
    const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : 45;
  
    // Completion Time Table
    autoTable(doc, {
      startY: finalY,
      head: [["Process ID", "Completion Time"]],
      body: results.map((r) => [r.processId, r.completionTime]),
    });
  
    // Save the PDF
    doc.save("scheduling_results.pdf");
  };

  return (
    <div className="bg-gray-900 min-h-screen p-8 pb-20 text-white">
      <header className="bg-blue-700 text-white w-full py-6 text-center font-bold text-3xl shadow-lg mb-8">
        CPU Scheduling Simulator
      </header>

      <main className="flex flex-col gap-6 items-center">
        {/* Input Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <label className="text-lg text-gray-300">Number of Processes:</label>
          <input
            type="number"
            value={numProcesses}
            onChange={(e) => setNumProcesses(parseInt(e.target.value))}
            className="border border-gray-500 bg-gray-800 text-white rounded px-3 py-2 shadow-md"
          />
          <label className="text-lg text-gray-300">Time Quantum (for RR):</label>
          <input
            type="number"
            value={timeQuantum}
            onChange={(e) => setTimeQuantum(parseInt(e.target.value))}
            className="border border-gray-500 bg-gray-800 text-white rounded px-3 py-2 shadow-md"
          />
          <label className="text-lg text-gray-300">Select Algorithm:</label>
          <select
            value={selectedAlgorithm}
            onChange={(e) => setSelectedAlgorithm(e.target.value)}
            className="border border-gray-500 bg-gray-800 text-white rounded px-3 py-2 shadow-md"
          >
            <option value="FIFO">FIFO</option>
            <option value="SJF">SJF</option>
            <option value="RR">RR</option>
            <option value="STCF">STCF</option>
            <option value="MLFQ">MLFQ</option>
          </select>
        </div>

        {/* Generate Processes Button */}
        <button
          onClick={handleGenerateProcesses}
          className="bg-gray-700 text-white font-semibold rounded px-6 py-3 mt-4 hover:bg-gray-600 transition-all"
        >
          Generate Processes
        </button>

        {/* Process Table */}
        {processes.length > 0 && (
          <table className="border-collapse border border-gray-600 mt-6 w-full max-w-md">
            <thead>
              <tr className="bg-gray-700 text-white">
                <th className="border border-gray-600 px-4 py-2">Process ID</th>
                <th className="border border-gray-600 px-4 py-2">Burst Time</th>
              </tr>
            </thead>
            <tbody>
              {processes.map((process, index) => (
                <tr
                  key={process.id}
                  className={index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"}
                >
                  <td className="border border-gray-600 px-4 py-2 text-center">
                    {process.id}
                  </td>
                  <td className="border border-gray-600 px-4 py-2 text-center">
                    {process.burstTime}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Run Algorithm Button */}
        <button
          onClick={handleRunAlgorithm}
          className="bg-blue-500 text-white font-semibold rounded px-6 py-3 mt-4 hover:bg-blue-400 transition-all"
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
              className="bg-green-500 text-white font-semibold rounded px-6 py-3 mt-4 hover:bg-green-400 transition-all"
            >
              Download PDF
            </button>
          </>
        )}
      </main>
    </div>
  );
}

