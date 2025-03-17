CPU Scheduling Simulator 📊
An interactive web application built with Next.js and React that simulates popular CPU scheduling algorithms, visualizes their execution timelines, and allows you to compare performance dynamically.

🚀 Features
Algorithms Supported:

First In First Out (FIFO)
Shortest Job First (SJF)
Round Robin (RR)
Shortest Time-to-Completion First (STCF)
Multi-Level Feedback Queue (MLFQ)
Interactive UI:

Easily generate random processes.
Customize the number of processes.
Configure algorithm-specific parameters (e.g., RR quantum, MLFQ queue times).
Visualization:

Dynamic bar charts (Completion Times).
Gantt-style timeline charts showing process execution clearly.
Charts scale automatically based on the number of processes.
Comparison & Reports:

Run all algorithms simultaneously for side-by-side visual comparison.
Export simulation results and visualizations directly to PDF.
📸 Screenshots
(Include your own screenshots here!)

🛠 Built With
Next.js (App Router)
React
Chart.js (with react-chartjs-2)
Tailwind CSS (for styling)
jsPDF & jspdf-autotable (for PDF reports)
html2canvas (to capture charts for PDF export)
🚩 Getting Started
Prerequisites
Node.js (v18+ recommended)
npm or yarn installed
Installation
bash
Copy code
git clone https://github.com/<your-username>/cpu-scheduler.git
cd cpu-scheduler
npm install
Run locally (Development Mode)
bash
Copy code
npm run dev
Open your browser at http://localhost:3000.

Build and Deploy to GitHub Pages
To build and deploy:

Update your next.config.mjs (replace with your repo-name):
javascript
Copy code
export default {
  output: 'export',
  images: { unoptimized: true },
  basePath: '/cpu-scheduler', // your repo name
  assetPrefix: '/cpu-scheduler/',
};
Deploy to GitHub Pages (Windows-friendly):
bash
Copy code
npm run deploy
Your app will be live at:

arduino
Copy code
https://<your-username>.github.io/cpu-scheduler/
Ensure GitHub Pages is set to deploy from the gh-pages branch root (/).

⚙️ Customization & Usage
Select an algorithm from the dropdown.
Generate random processes or customize manually.
Click Run Algorithm to visualize results for the selected algorithm.
Click Run All Algorithms for a side-by-side comparison (prompts for RR & MLFQ settings will appear).
Click Download PDF to export the simulation results clearly.
🧑‍💻 Project Structure
ruby
Copy code
cpu-scheduler
├── app                # Next.js page components
├── components         # BarChart and TimelineChart React components
├── public             # Static assets (if any)
├── package.json       # Dependencies & scripts
├── next.config.mjs    # Next.js configuration
├── tailwind.config.js # Tailwind CSS configuration
└── README.md          # You're here!
📦 Dependencies
Key packages clearly explained:

Package	Purpose
Next.js	Framework for server-side and static apps
Chart.js	Data visualization with charts
jsPDF	Export simulation results and charts to PDF
html2canvas	Capture DOM elements as canvas images for PDFs
Tailwind CSS	Rapid styling and responsive design
📑 License
This project is licensed under the MIT License. Feel free to modify, distribute, and use it freely.
