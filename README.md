# CPU Scheduling Simulator 📊

An interactive web application built with **Next.js** and **React** that simulates popular CPU scheduling algorithms, visualizes their execution timelines, and allows you to dynamically compare performance.

---

## 🚀 Features

- **Algorithms Supported:**
  - ✅ **First In First Out (FIFO)**
  - ✅ **Shortest Job First (SJF)**
  - ✅ **Round Robin (RR)**
  - ✅ **Shortest Time-to-Completion First (STCF)**
  - ✅ **Multi-Level Feedback Queue (MLFQ)**

- **Interactive UI:**
  - Generate random processes quickly.
  - Easily customize the number of processes.
  - Configure algorithm-specific parameters (RR quantum, MLFQ queue times).

- **Visualization:**
  - Dynamic bar charts for Completion Times.
  - Gantt-style timeline charts illustrating the execution order of processes.
  - Automatically scales chart sizes based on data.

- **Comparison & Reports:**
  - Run all algorithms simultaneously for side-by-side visual comparisons.
  - Export simulation results and visualizations directly to PDF.

---

## 🛠 Built With

- **[Next.js](https://nextjs.org)** (App Router)
- **React**
- **[Chart.js](https://www.chartjs.org)** & **[react-chartjs-2](https://react-chartjs-2.js.org)** (for visualizations)
- **[Tailwind CSS](https://tailwindcss.com)** (CSS styling)
- **[jsPDF](https://github.com/parallax/jsPDF)** & **[jspdf-autotable](https://github.com/simonbengtsson/jsPDF-AutoTable)** (PDF generation)
- **[html2canvas](https://html2canvas.hertzen.com/)** (capturing charts for PDFs)

---

## 🚩 Getting Started

### ✅ **Prerequisites**

- Node.js (18+ recommended)
- npm or yarn

### ✅ **Installation**

```bash
git clone https://github.com/<your-username>/cpu-scheduler.git
cd cpu-scheduler
npm install
```

---

## 🛠️ Running the Simulator Locally
 - Start the development server clearly:
```bash
npm run dev
```
 - Open your browser at:
```arduino
http://localhost:3000
```

---

## 🌐 Deploying to GitHub Pages
 - To deploy your simulator as a static site on GitHub Pages, clearly follow these steps:

    1.Update your configuration (next.config.mjs) clearly:
```js
export default {
  output: 'export',
  images: { unoptimized: true },
  basePath: '/cpu-scheduler', // Replace with your GitHub repository name exactly
  assetPrefix: '/cpu-scheduler/',
};
```

---

## 📌 Corrected Deployment Script (Windows-friendly)
 - Make sure your package.json scripts look exactly like this:
```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "deploy": "next build && echo.> out\\.nojekyll && gh-pages -d out -b gh-pages"
}
```

---

## 🚀 Deploy Clearly (exact steps)
 - Run the deployment clearly with:
```bash
npm run deploy
```
 - This builds your app and publishes it to the gh-pages branch.

### Your deployed site URL will be clearly at:
```arduino
https://<your-username>.github.io/cpu-scheduler/
(Replace <your-username> with your actual GitHub username.)
```

---

## ✅ GitHub Pages Settings
 - Make sure your GitHub repository's settings clearly point to:

   - Branch: gh-pages
   - Directory: / (root)
