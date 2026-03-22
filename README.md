# Action Learning DDoS Detection

EPITA Action Learning project on smart DDoS detection and mitigation using machine learning and LLMs.

## Overview

This project explores a hybrid approach to web attack monitoring and mitigation. It combines:

- a dashboard-based frontend for monitoring and interaction
- an Express backend for request analysis, rulesets, authentication, and scheduling
- machine learning assets for bot and traffic classification
- LLM integration for intelligent security support

The goal is to help detect suspicious traffic patterns and support mitigation decisions in a more adaptive way than static filtering alone.

## Main Features

- Web dashboard built with Next.js and Material UI
- Express.js backend for analytics, rulesets, and security workflows
- Request inspection and logging utilities
- Machine learning experimentation for traffic classification
- Ollama/Gemini-oriented AI integration points
- Rule-based and data-driven security architecture

## Tech Stack

- Frontend: Next.js, React, TypeScript, Material UI
- Backend: Node.js, Express.js, MongoDB with Mongoose
- AI/LLM: Ollama, Gemini integration
- ML: Jupyter notebooks, JavaScript random forest model
- Other tools: EJS, Axios, node-cron, geoip-lite

## Project Structure

```text
.
|-- assets/       Supporting diagrams and thesis-related assets
|-- client/       Frontend dashboard application
|-- ml/           Notebooks, model code, and ML artifacts
|-- ollama/       Local LLM configuration
|-- server/       API, middleware, analytics, rulesets, and scheduler
|-- tools/        Utility and traffic simulation scripts
```

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/Shyamsundar0606/action-learning-ddos-detection.git
cd action-learning-ddos-detection
```

### 2. Configure the backend environment

Create `server/.env` from `server/.env.example` and set:

```env
PORT=3000
DATABASE_URL=your_mongodb_connection_string
VPNAPI_API_KEY=your_vpnapi_key
GEMINI_API_KEY=your_gemini_api_key
```

### 3. Install frontend dependencies

```bash
cd client
npm install
```

### 4. Install backend dependencies

```bash
cd ../server
npm install
```

### 5. Run the applications

Backend:

```bash
cd server
npm run dev
```

Frontend:

```bash
cd client
npm run dev
```

## Machine Learning Notes

- The repository includes notebooks and model-related code under `ml/`.
- The large dataset file used during experimentation is not included in the public repository.
- A trained model artifact is included for reference in `ml/random-forest-js/`.

## Research Context

This repository supports an EPITA academic project focused on smart DDoS detection and mitigation using machine learning and LLM-assisted analysis.

## Future Improvements

- Add deployment instructions
- Add architecture screenshots to the README
- Document API routes in more detail
- Expand reproducibility for the ML pipeline
- Improve dataset handling for public/open-source sharing
