# AI PDF Extractor & Analyser Frontend

This is a Next.js frontend for uploading, extracting, and visualizing data from EPA PDF reports. It connects to a FastAPI backend for PDF parsing and data extraction.

## Features
- Upload EPA PDF reports and extract structured data
- Visualize extracted data (Goals, BMPs, Implementation, Monitoring, Outreach, Geographic Areas)
- Export dashboard as PDF or CSV
- Responsive, modern UI with Tailwind CSS

## Tech Stack
- **Next.js** (App Router, React 18, TypeScript)
- **Chart.js** & **react-chartjs-2** (visualizations)
- **Tailwind CSS** (styling)

## Setup Instructions
1. **Install dependencies:**
	```sh
	npm install
	```
2. **Start the development server:**
	```sh
	npm run dev
	```
3. **Configure backend API:**
	- Update API URLs in the code if your FastAPI backend runs on a different host/port.

## Usage
- Upload a PDF via the dashboard navigation.
- View extracted data and interactive charts by county.
- Use the navigation panel to export the dashboard as PDF or CSV.

## Exporting Data
- **PDF Export:** Click "Export as PDF" in the navigation panel to save the current dashboard as a PDF.
- **CSV Export:** (If enabled) Click "Export as CSV" to download all extracted data in CSV format.

## Deployment
- Build for production: `npm run build`
- Start in production: `npm start`
- Deploy on Vercel, Netlify, or any Node.js-compatible host.

---
For backend setup and extraction logic, see the FastAPI repo and the EXTRACTION_LOGIC.md file.

## Author

Rainer Hamal