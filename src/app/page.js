'use client'; // Add this line to indicate it's a client component

import React, { useState, useRef } from "react"; // Importing useRef here
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { Bar } from "react-chartjs-2"; // Assuming you're using Bar chart here
import html2canvas from "html2canvas";

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
    result.push({ processId: process.id, completionTime: time });
    timeline.push({ processId: process.id, startTime, endTime: time });
  });
  return { result, timeline };
}

function sjf(processes) {
  let time = 0;
  const result = [];
  const timeline = [];

  // Sort by burstTime but keep track of the original process ID
  processes.sort((a, b) => a.burstTime - b.burstTime);

  processes.forEach((process) => {
    const startTime = time;
    time += process.burstTime;

    // Use the actual process ID from the object
    result.push({ processId: process.id, completionTime: time });
    timeline.push({ processId: process.id, startTime, endTime: time });
  });

  return { result, timeline };
}

function rr(processes, timeQuantum) {
  let time = 0;
  const result = [];
  const timeline = [];
  
  // Copy the processes and keep original burst times
  let queue = processes.map(p => ({ ...p }));
  let completionTimes = {}; // Store the last completion time for each process
  let originalBurstTimes = Object.fromEntries(processes.map(p => [p.id, p.burstTime])); // Store original burst times

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

  // Convert completion times to array format for graphing
  Object.entries(completionTimes).forEach(([processId, completionTime]) => {
      result.push({ processId: parseInt(processId), completionTime });
  });

  // ✅ Restore original burst times before returning
  return { result, timeline, processes: processes.map(p => ({ id: p.id, burstTime: originalBurstTimes[p.id] })) };
}

function mlfq(processes, quantumTimes) {
  let time = 0;
  const result = [];
  const timeline = [];
  const queues = quantumTimes.map(() => []);

  processes.forEach(proc => queues[0].push({ ...proc, remainingTime: proc.burstTime, currentQueue: 0 }));

  while (queues.some(queue => queue.length > 0)) {
    for (let i = 0; i < queues.length; i++) {
      const queue = queues[i];
      const quantum = quantumTimes[i];

      if (queue.length === 0) continue;

      const process = queue.shift();
      const execTime = Math.min(process.remainingTime, quantum);
      const startTime = time;
      time += execTime;
      process.remainingTime -= execTime;

      timeline.push({ processId: process.id, startTime, endTime: time });

      if (process.remainingTime > 0) {
        process.currentQueue = Math.min(i + 1, queues.length - 1);
        queues[process.currentQueue].push(process);
      } else {
        result.push({ processId: process.id, completionTime: time });
      }

      break;
    }
  }

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

function BarChart({ data }) {
  const chartRef = useRef();

  // Get the chart width dynamically
  const chartWidth = window.innerWidth * 0.45; // 45% of the screen width
  const chartHeight = chartWidth * 0.5625; // 16:9 Aspect Ratio

  const chartData = {
      labels: data.map((d) => `Process ${d.processId}`),
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

  return (
      <div style={{ width: `${chartWidth}px`, height: `${chartHeight}px`, margin: "auto", padding: "10px" }}>
          <Bar ref={chartRef} data={chartData} />
      </div>
  );
}

function TimelineChart({ data }) {
  const chartRef = useRef();

  // Get the chart width dynamically
  const chartWidth = window.innerWidth * 0.45; // 45% of the screen width
  const chartHeight = chartWidth * 0.5625; // 16:9 Aspect Ratio

  const processColors = {};
  const seenProcesses = new Set();

  const getColor = (id) => {
      if (!processColors[id]) {
          processColors[id] = `hsl(${(id * 137) % 360}, 70%, 50%)`;
      }
      return processColors[id];
  };

  const chartData = {
      labels: ["Processes"],
      datasets: data.map((process) => {
          const label = seenProcesses.has(process.processId) ? "" : `Process ${process.processId}`;
          seenProcesses.add(process.processId);

          return {
              label,
              data: [{ x: [process.startTime, process.endTime], y: 0 }],
              backgroundColor: getColor(process.processId),
              borderColor: "black",
              borderWidth: 1,
              barThickness: 20,
          };
      }),
  };

  const options = {
      responsive: true,
      indexAxis: "y",
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
              display: false,
          },
      },
      plugins: {
          legend: {
              display: true,
          },
          tooltip: {
              callbacks: {
                  label: function (tooltipItem) {
                      const { x } = tooltipItem.raw;
                      const startTime = x[0];
                      const endTime = x[1];
                      const totalTime = endTime - startTime;
                      const processId = tooltipItem.dataset.label.replace("Process ", "");

                      return `Process ${processId}: Execution Time ${totalTime}`;
                  },
              },
          },
      },
  };

  return (
      <div style={{ width: `${chartWidth}px`, height: `${chartHeight}px`, margin: "auto", padding: "10px" }}>
          <Bar ref={chartRef} data={chartData} options={options} />
      </div>
  );
}

export default function Home() {
  const [numProcesses, setNumProcesses] = useState(5);
const [timeQuantum, setTimeQuantum] = useState(3);
const [results, setResults] = useState([]);
const [timelineData, setTimelineData] = useState([]);
const [selectedAlgorithm, setSelectedAlgorithm] = useState("FIFO");
const [processes, setProcesses] = useState([]);
const [queueTimes, setQueueTimes] = useState([2, 4, 6]);
const [allAlgorithmResults, setAllAlgorithmResults] = useState(null);

  const handleGenerateProcesses = () => {
    const newProcesses = generateRandomProcesses(numProcesses);
    setProcesses(newProcesses);
  };

  const handleQueueTimeChange = (index, value) => {
    const newQueueTimes = [...queueTimes];
    newQueueTimes[index] = Number(value);
    setQueueTimes(newQueueTimes);
  };

  const handleRunAlgorithm = () => {
    if (processes.length === 0) return;

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
        ({ result, timeline } = mlfq(processes, queueTimes));
        break;
      default:
        result = [];
        timeline = [];
    }

    setResults(result);
    setTimelineData(timeline);
  };

  const handleRunAllAlgorithms = () => {
    if (processes.length === 0) return;
  
    // Prompt for RR time quantum
    const rrQuantum = parseInt(prompt("Enter RR Time Quantum:", timeQuantum)) || timeQuantum;
    setTimeQuantum(rrQuantum);
  
    // Prompt for MLFQ queue quantum times
    const queueInputs = queueTimes.map((qt, idx) => {
      const userInput = prompt(`Enter Quantum Time for MLFQ Queue ${idx + 1}:`, qt);
      return parseInt(userInput) || qt;
    });
    setQueueTimes(queueInputs);
  
    const algorithms = ['FIFO', 'SJF', 'RR', 'STCF', 'MLFQ'];
    const allResults = {};
    const allTimelines = {};
  
    algorithms.forEach(algo => {
      let result, timeline;
      switch (algo) {
        case 'FIFO':
          ({ result, timeline } = fifo(processes));
          break;
        case 'SJF':
          ({ result, timeline } = sjf(processes));
          break;
        case 'RR':
          ({ result, timeline } = rr(processes, rrQuantum));
          break;
        case 'STCF':
          ({ result, timeline } = stcf(processes));
          break;
        case 'MLFQ':
          ({ result, timeline } = mlfq(processes, queueInputs));
          break;
        default:
          result = [];
          timeline = [];
      }
      allResults[algo] = result;
      allTimelines[algo] = timeline;
    });
  
    setAllAlgorithmResults({ results: allResults, timelines: allTimelines });
  };

  const generatePDF = async () => {
    const doc = new jsPDF("landscape", "mm", "a4"); 
  
    const margin = 10;
    const cellWidth = (doc.internal.pageSize.width - margin * 3) / 2;
    const cellHeight = (doc.internal.pageSize.height - margin * 3) / 2;
  
    const addChartToPDF = async (chartElement, chartTitle, x, y, maxWidth, maxHeight) => {
      if (chartElement) {
        const canvas = await html2canvas(chartElement, { scale: 2 });
        const image = canvas.toDataURL("image/png");
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        let scaleFactor = Math.min(maxWidth / imgWidth, maxHeight / imgHeight);
        let scaledWidth = imgWidth * scaleFactor;
        let scaledHeight = imgHeight * scaleFactor;
        doc.setFontSize(14);
        doc.text(chartTitle, x, y);
        doc.addImage(image, "PNG", x, y + 5, scaledWidth, scaledHeight);
      }
    };
  
    const generateSingleAlgorithmPage = async (algoName, processes, timelineData, results) => {
      doc.setFontSize(18);
      doc.text(`CPU Scheduling Simulation (${algoName})`, margin, 10);
  
      const xLeft = margin;
      const xRight = margin + cellWidth + margin;
      const yTop = 20;
      const yBottom = yTop + cellHeight + margin;
  
      // Burst Times
      doc.setFontSize(14);
      doc.text("Process Burst Times", xLeft, yTop);
      autoTable(doc, {
        startY: yTop + 5,
        margin: { left: xLeft },
        head: [["Process ID", "Burst Time"]],
        body: processes.map((process) => [process.id, process.burstTime]),
        theme: "grid",
        styles: { fontSize: 10 },
        tableWidth: cellWidth - margin,
      });
  
      // Completion Times (aggregated)
      doc.setFontSize(14);
      doc.text("Process Completion Times", xRight, yTop);
      const aggregatedCompletionTimes = processes.map((process) => {
        const entries = timelineData.filter(entry => entry.processId === process.id);
        return [process.id, entries[0].startTime, entries[entries.length - 1].endTime];
      });
      autoTable(doc, {
        startY: yTop + 5,
        margin: { left: xRight },
        head: [["Process ID", "Start Time", "Completion Time"]],
        body: aggregatedCompletionTimes,
        theme: "grid",
        styles: { fontSize: 10 },
        tableWidth: cellWidth - margin,
      });
  
      // Completion Time Chart (Bottom Left)
      const completionChartElement = document.getElementById(`completionChart-${algoName}`);
      await addChartToPDF(completionChartElement, "Completion Time Chart", xLeft, yBottom, cellWidth - 5, cellHeight - 5);
  
      // Timeline Chart (Bottom Right)
      const timelineChartElement = document.getElementById(`timelineChart-${algoName}`);
      await addChartToPDF(timelineChartElement, "Execution Timeline Chart", xRight, yBottom, cellWidth - 5, cellHeight - 5);
    };
  
    if (allAlgorithmResults) {
      const algorithmNames = Object.keys(allAlgorithmResults.results);
      for (let i = 0; i < algorithmNames.length; i++) {
        const algo = algorithmNames[i];
        if (i > 0) doc.addPage();
        await generateSingleAlgorithmPage(
          algo,
          processes,
          allAlgorithmResults.timelines[algo],
          allAlgorithmResults.results[algo]
        );
      }
    } else {
      await generateSingleAlgorithmPage(selectedAlgorithm, processes, timelineData, results);
    }
  
    doc.save("CPU_Scheduling_Report.pdf");
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

        {/* RR Quantum Input Conditional */}
        {selectedAlgorithm === "RR" && (
          <>
            <label className="text-lg text-gray-300">Time Quantum (RR):</label>
            <input
              type="number"
              value={timeQuantum}
              onChange={(e) => setTimeQuantum(parseInt(e.target.value))}
              className="border border-gray-500 bg-gray-800 text-white rounded px-3 py-2 shadow-md"
            />
          </>
        )}
      </div>

      {/* MLFQ Quantum Inputs Conditional */}
      {selectedAlgorithm === "MLFQ" && (
        <div className="flex flex-col sm:flex-row gap-4 items-center mt-4">
          <label className="text-lg text-gray-300">MLFQ Queue Quantum Times:</label>
          {queueTimes.map((qt, index) => (
            <input
              key={index}
              type="number"
              value={qt}
              onChange={(e) => {
                const updatedQueueTimes = [...queueTimes];
                updatedQueueTimes[index] = parseInt(e.target.value) || 1;
                setQueueTimes(updatedQueueTimes);
              }}
              className="border border-gray-500 bg-gray-800 text-white rounded px-3 py-2 shadow-md"
              placeholder={`Queue ${index + 1}`}
            />
          ))}
        </div>
      )}

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
              <tr key={process.id} className={index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"}>
                <td className="border border-gray-600 px-4 py-2 text-center">{process.id}</td>
                <td className="border border-gray-600 px-4 py-2 text-center">{process.burstTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Algorithm Run Buttons */}
      <div className="flex gap-4">
        <button
          onClick={handleRunAlgorithm}
          className="bg-blue-500 text-white font-semibold rounded px-6 py-3 mt-4 hover:bg-blue-400 transition-all"
        >
          Run Algorithm
        </button>

        <button
          onClick={handleRunAllAlgorithms}
          className="bg-purple-500 text-white font-semibold rounded px-6 py-3 mt-4 hover:bg-purple-400 transition-all"
        >
          Run All Algorithms
        </button>
      </div>

      {/* Single Algorithm Results */}
      {results.length > 0 && !allAlgorithmResults && (
        <>
          <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "10px" }}>
            <div id={`completionChart-${selectedAlgorithm}`}>
              <BarChart data={results} />
            </div>
            <div id={`timelineChart-${selectedAlgorithm}`}>
              <TimelineChart data={timelineData} />
            </div>
          </div>
          <button
            onClick={generatePDF}
            className="bg-green-500 text-white font-semibold rounded px-6 py-3 mt-4 hover:bg-green-400 transition-all"
          >
            Download PDF
          </button>
        </>
      )}

      {/* All Algorithms Side-by-Side Results */}
      {allAlgorithmResults && (
        <div className="mt-10">
          <h2 className="text-2xl font-bold text-center mb-4">Comparison of All Algorithms</h2>
          <div className="flex flex-wrap justify-center gap-8">
            {Object.keys(allAlgorithmResults.results).map((algoName) => (
              <div key={algoName} className="bg-gray-800 p-4 rounded shadow-md">
                <h3 className="text-xl font-semibold text-center mb-2">{algoName}</h3>
                <div id={`completionChart-${algoName}`}>
                  <BarChart data={allAlgorithmResults.results[algoName]} />
                </div>
                <div id={`timelineChart-${algoName}`}>
                  <TimelineChart data={allAlgorithmResults.timelines[algoName]} />
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={generatePDF}
            className="bg-green-500 text-white font-semibold rounded px-6 py-3 mt-8 hover:bg-green-400 transition-all block mx-auto"
          >
            Download PDF
          </button>
        </div>
      )}
    </main>
  </div>
);
}

