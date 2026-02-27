# KODBANK Core Auth & Dashboard

A secure, high-integrity banking portal with responsive design.

## Project Structure
- `server/`: Express backend with session management.
- `frontend/`: React + Vite frontend with Chart.js and Confetti.

## How to Run Locally

### 1. Start the Backend
```bash
cd server
npm install
npm start
```
The server will run on `http://localhost:5000`.

### 2. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```
The application will be available at `http://localhost:5173`.

## Key Features
- **Auth**: Username/Email uniqueness check, OTP verification.
- **Security**: `dq`, `e`, `o` tokens stored in cookies and visible in the Dashboard's "Security Tokens" table.
- **Aesthetics**: Dark theme, glassmorphism, "Blast" animation on balance reveal.
- **Insights**: 180-day trend analysis line chart.
