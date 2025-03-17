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

function mlfq(processes) {
  let time = 0;
  const result = [];
  const timeline = [];
  const queue1 = [];
  const queue2 = [];
  
  // Copy the processes and keep original burst times
  let processCopy = processes.map(p => ({ ...p }));
  let completionTimes = {}; // Store last completion times
  let originalBurstTimes = Object.fromEntries(processes.map(p => [p.id, p.burstTime])); // Store original burst times

  processCopy.forEach((process) => queue1.push(process));

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

  // ✅ Restore original burst times before returning
  return { result, timeline, processes: processes.map(p => ({ id: p.id, burstTime: originalBurstTimes[p.id] })) };
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
  const chartRef = useRef(null); // Reference for BarChart
  const timelineChartRef = useRef(null); // Reference for TimelineChart

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

  const generatePDF = async () => {
    const doc = new jsPDF("landscape", "mm", "a4"); // Landscape orientation for better spacing

    doc.setFontSize(18);
    doc.text("CPU Scheduling Simulation Results", 10, 10);

    // ✅ Define page layout
    const margin = 10;  // Space from edges
    const cellWidth = (doc.internal.pageSize.width - margin * 3) / 2; // Width for each column
    const cellHeight = (doc.internal.pageSize.height - margin * 3) / 2; // Height for each row

    let xLeft = margin;
    let xRight = margin + cellWidth + margin;
    let yTop = 20;
    let yBottom = yTop + cellHeight + margin;

    // ✅ Process Burst Times (Top Left)
    doc.setFontSize(14);
    doc.text("Process Burst Times", xLeft, yTop);
    autoTable(doc, {
        startY: yTop + 5,
        margin: { left: xLeft, right: xLeft + cellWidth },
        head: [["Process ID", "Burst Time"]],
        body: processes.map((process) => [process.id, process.burstTime]),
        theme: "grid",
        styles: { fontSize: 10 },
        tableWidth: cellWidth - margin,
    });

    // ✅ Process Completion Times (Top Right)
    doc.setFontSize(14);
    doc.text("Process Completion Times", xRight, yTop);
    autoTable(doc, {
        startY: yTop + 5,
        margin: { left: xRight, right: xRight + cellWidth },
        head: [["Process ID", "Start Time", "Completion Time"]],
        body: timelineData.map((entry) => [
            entry.processId,
            entry.startTime,
            entry.endTime,
        ]),
        theme: "grid",
        styles: { fontSize: 10 },
        tableWidth: cellWidth - margin,
    });

    // ✅ Capture & Scale Charts Dynamically
    const addChartToPDF = async (chartElementId, chartTitle, x, y, maxWidth, maxHeight) => {
        const chartElement = document.getElementById(chartElementId);
        if (chartElement) {
            const canvas = await html2canvas(chartElement, { scale: 2 });
            const image = canvas.toDataURL("image/png");

            // Get original canvas dimensions
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;

            // Scale chart to fit within the max width/height while keeping aspect ratio
            let scaleFactor = Math.min(maxWidth / imgWidth, maxHeight / imgHeight);
            let scaledWidth = imgWidth * scaleFactor;
            let scaledHeight = imgHeight * scaleFactor;

            doc.setFontSize(14);
            doc.text(chartTitle, x, y);
            doc.addImage(image, "PNG", x, y + 5, scaledWidth, scaledHeight);
        }
    };

    // ✅ Completion Time Chart (Bottom Left)
    await addChartToPDF("completionChart", "Completion Time Chart", xLeft, yBottom, cellWidth - 5, cellHeight - 5);

    // ✅ Execution Timeline Chart (Bottom Right)
    await addChartToPDF("timelineChart", "Execution Timeline Chart", xRight, yBottom, cellWidth - 5, cellHeight - 5);

    // ✅ Save the PDF
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

        {/* Results with charts */}
        {results.length > 0 && (
          <>
            <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "10px" }}>
                <div id="completionChart">
                    <BarChart data={results} />
                </div>
                <div id="timelineChart">
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
      </main>
    </div>
  );
}

