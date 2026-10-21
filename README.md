# SmartCampus 360 AI
## Complete Full-Stack Student & University Management Ecosystem

SmartCampus 360 AI is a next-generation centralized digital university platform built with React, Vite, TypeScript, Tailwind CSS, Three.js, Express, and Google Gemini 3.8 Flash.

---

### Core Highlights & Modules

1. **Role-Based Portals & Live Switcher**
   - **Super Administrator**: System policy configurations, audit logs, global telemetry.
   - **College Administrator**: Admissions, faculty and department allocations, fees oversight.
   - **Faculty**: Class rosters, attendance marking, dynamic session QR generator, exam grading, coursework LMS.
   - **Student**: Profile, scannable QR Digital ID card, attendance tracking, grades & report cards, assignments, simulation lab, gamification quests.
   - **Parent / Guardian**: Ward attendance records, academic results, fee dues & payment receipts.
   - **Librarian**: Book inventory catalog, issue & return workflows, overdue fee calculations.
   - **Placement Officer**: Corporate drives, eligibility filtering (CGPA rules), interview pipelines.

2. **Interactive 3D Digital Campus Explorer (Three.js)**
   - Architectural spatial model with raycast building inspector (Alan Turing Computing Pavilion, Alexandria Digital Library, Apex Central Academic Tower, Robotics Hub, Student Activity Center).
   - Real-time room directory, scheduled lecture periods, and live occupancy telemetry.
   - Day / Sunset / Night dynamic lighting rigs and 2D accessible directory fallback.

3. **Academic What-If Simulation Lab**
   - Interactive sandboxing sliders for internal marks, final exam targets, attendance rates, and weekly study hours.
   - Instant live recalculation of semester SGPA, cumulative CGPA, and distinction thresholds.
   - Formula transparency panel and named scenario comparison ("High Distinction Sprint", "Balanced Baseline").

4. **AI Campus Copilot (Gemini 3.8 Flash)**
   - Server-side integration with `@google/genai` using model `gemini-3.8-flash`.
   - Context-aware assistance equipped with student academic standings, regulations, condonation rules, and study revision planning.

5. **Attendance Management & Dynamic Session QR**
   - Dynamic time-expiring session QR generation with single-submission cryptographic verification.
   - Roster batch marking (Present, Absent, Late, Approved Leave).
   - Student attendance correction & condonation petition workflow with audit logging.

6. **Examinations & Transcripts**
   - Assessment schedules, weightage calculations (Internal 30% + External 70%).
   - Cohort marks distribution and printable official semester grade transcripts.

7. **Student Registry & Digital Student ID**
   - Paginated searchable student directory with CSV bulk import and export.
   - Printable cryptographic digital ID card with scannable verification code.

8. **Student Gamification & Quests**
   - Level progression, XP points, weekly study streaks, and confetti milestone celebrations.

9. **Global Command Palette (Cmd+K / Ctrl+K)**
   - Rapid keyboard navigation across tools, records, and modules.

---

### Running Locally

```bash
# Install dependencies
npm install

# Run full-stack dev server (Express + Vite on port 3000)
npm run dev

# Compile and verify types
npm run build
npm run lint
```
