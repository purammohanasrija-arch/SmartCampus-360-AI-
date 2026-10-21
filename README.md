# SmartCampus 360 AI
### Next-Generation Centralized University & Institutional Operating System

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React_18-20232A?style=flat-square&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite_8-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-000000?style=flat-square&logo=three.js&logoColor=white)](https://threejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![Gemini AI](https://img.shields.io/badge/Google_Gemini-4285F4?style=flat-square&logo=google&logoColor=white)](https://ai.google.dev/)

SmartCampus 360 AI is a unified digital university platform designed for universities and higher-education institutions. It brings together academic governance, dynamic attendance tracking with **authentic scannable QR codes**, 3D campus spatial exploration, an AI campus copilot powered by Google Gemini, and comprehensive student lifecycle management into a single, responsive operating system.

---

## Key Modules & Capabilities

### 1. Authentic Scannable QR Codes & Dynamic Attendance
- **Live QR Attendance Engine:** Dynamic, time-expiring session QR codes with cryptographic tokens (`QR-<course>-<timestamp>`).
- **Smartphone Camera Scannable:** Generates authentic 2D barcodes (`qrcode`) readable by any phone camera or Google Lens to immediately verify attendance.
- **Holographic Scanline & Live Timer:** Integrated laser scanline animation and countdown timer with one-click token clipboard copying.
- **URL Scan Detection:** Automatically detects incoming verification URLs (`/?module=attendance&token=...`) and displays live verification banners with course metadata.

### 2. Digital Student Identity Card with 3D Holographic Parallax
- **3D Perspective Tilt:** Interactive card tilting on mouse move (`TiltCard`) with specular lighting reflection and glassmorphic borders.
- **Scannable Verification QR:** Embedded high-contrast QR barcode encoding verified student registry credentials (`ID`, `Name`, `Roll Number`, `Department`).
- **Print / PDF Ready:** Single-click export of official institutional ID cards.

### 3. Interactive 3D Digital Campus Explorer (Three.js)
- **Spatial Architectural Model:** Interactive 3D campus grounds featuring key university landmarks:
  - *Alan Turing Computing Pavilion*
  - *Alexandria Digital Library*
  - *Apex Central Academic Tower*
  - *Robotics & Quantum Hardware Hub*
  - *Student Activity & Innovation Center*
- **Raycast Building Inspector:** Clickable buildings revealing floor-by-floor directories, active lecture schedules, and live occupancy rates.
- **Dynamic Lighting Environments:** Toggle between Day, Golden Hour / Sunset, and Cyberpunk Night illumination rigs.

### 4. Academic What-If Simulation Lab
- **Interactive Sandboxing:** Sliders for internal assessments, final exam targets, class attendance percentages, and weekly study hours.
- **Live CGPA / SGPA Engine:** Real-time grade forecasting and distinction threshold alerts.
- **Scenario Comparison:** Instant side-by-side evaluation of multiple revision strategies.

### 5. Multi-Role Institutional Portals
- **Super Administrator:** University policy configurations, telemetry, and system audit logs.
- **College Administrator:** Departmental rosters, admissions, and financial accounting.
- **Faculty:** Course rosters, gradebook entries, dynamic attendance sessions, and syllabus tracking.
- **Student:** Semester standings, digital ID, attendance correction petitions, gamification quests, and report cards.
- **Parent / Guardian:** Real-time ward academic alerts, fee receipts, and attendance compliance.
- **Librarian:** Book catalog management, issue/return workflows, and automated overdue fee penalties.
- **Placement Officer:** Corporate recruiter drive management, CGPA filters, and interview scheduling.

### 6. AI Campus Copilot (Google Gemini 3.8 Flash)
- Integrated `@google/genai` assistant ground in institutional regulations, attendance condonation rules, syllabus queries, and personalized exam revision blueprints.
- Built-in intelligent academic fallback engine for offline or unauthenticated scenarios.

---

## Architecture & Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend Framework** | React 18, Vite 8, TypeScript 5.9 |
| **Styling & Aesthetics** | Tailwind CSS 3.4, Lucide Icons, Custom Glassmorphism |
| **3D & Canvas** | Three.js (WebGL renderer, Raycasting, OrbitControls) |
| **Barcode / QR** | `qrcode` (Dynamic 2D Matrix Generator with Level-Q Error Correction) |
| **Backend & API** | Node.js, Express.js (RESTful API endpoints) |
| **Artificial Intelligence**| Google Gemini 3.8 Flash (`@google/genai`) |
| **CI / CD** | GitHub Actions (`.github/workflows/ci.yml`) |

---

## Quick Start & Local Development

### Prerequisites
- Node.js 18+ or 20+
- npm 9+

### 1. Installation
```bash
# Clone the repository
git clone https://github.com/purammohanasrija-arch/SmartCampus-360-AI-.git
cd SmartCampus-360-AI-

# Install dependencies
npm install --legacy-peer-deps
```

### 2. Environment Configuration (Optional)
Create a `.env` file in the root directory:
```env
PORT=3000
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
# Type check with strict TypeScript
npm run lint

# Production build
npm run build

# Start production server
npm start
```

---

## Interactive Showcase Cover Page
To experience the high-impact interactive 3D landing presentation:
- Navigate to **[http://localhost:3000/cover](http://localhost:3000/cover)** or **[http://localhost:3000/preview](http://localhost:3000/preview)**
- Explore the interactive 3D spatial geometry, floating feature modules, and single-click portal launchpad.

---

## License & Credits
Developed for modern university governance and student enablement.
Licensed under the [MIT License](LICENSE).
