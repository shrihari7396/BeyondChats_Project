# BeyondChats – Multi‑Phase Full Stack AI Article Intelligence Platform

This repository contains a **multi‑phase full‑stack project** built as part of the **BeyondChats Internship Assignment**. The system scrapes articles, stores them via a backend API, enriches them using AI & Google Search, and finally presents the results through a modern React frontend.

---

## 📌 Project Overview

The project is divided into **three clear phases**, each isolated by responsibility and technology stack:

| Phase   | Name                    | Responsibility                                      | Tech Stack                             |
| ------- | ----------------------- | --------------------------------------------------- | -------------------------------------- |
| Phase 1 | Article Scraping & CRUD | Scrape articles and expose CRUD APIs                | Java, Spring Boot, JPA, MySQL          |
| Phase 2 | AI Enhancer & Search    | Google search, scraping external blogs, AI analysis | Node.js, Axios, Cheerio, Gemini/OpenAI |
| Phase 3 | Frontend                | UI to visualize articles & AI insights              | React, Vite                            |

---

## 📂 Repository Structure

```
PROJECT
│
├── Phase1/
│   ├── beyondchats-scraper/        # Node-based scraper for Phase 1
│   │   ├── scraper.js
│   │   ├── package.json
│   │   └── node_modules/
│   │
│   ├── PhaseOne/                   # Spring Boot CRUD API
│   │   ├── src/
│   │   ├── pom.xml
│   │   ├── mvnw / mvnw.cmd
│   │   └── README.md
│
├── Phase2/
│   ├── ai-enhancer/                # Node.js AI & Google Search service
│   │   ├── index.js
│   │   ├── googleSearch.js
│   │   ├── scraper.js
│   │   ├── config.js
│   │   └── package.json
│   │
│   ├── AIService/                  # Spring Boot AI microservice
│   │   ├── src/
│   │   ├── Dockerfile
│   │   ├── pom.xml
│   │   └── README.md
│   │
│   └── AIServiceWithGemini/         # Alternate Gemini-based AI service
│
├── Phase3/Frontend/                # React Frontend (Vite)
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── assets/
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── README.md                       # Root documentation (this file)
├── LICENSE
└── .gitignore
```

---

## 🧠 High-Level Architecture

```
┌────────────┐      ┌────────────────────┐      ┌──────────────────┐
│  Frontend  │ ---> │ Phase 1 API         │ ---> │ MySQL Database   │
│  (React)   │      │ Spring Boot CRUD    │      │ Articles         │
└─────▲──────┘      └─────────▲──────────┘      └──────────────────┘
      │                         │
      │                         │ REST API
      │                         ▼
┌─────┴──────┐      ┌────────────────────┐      ┌──────────────────┐
│  Browser   │ ---> │ Phase 2 AI Enhancer │ ---> │ Google Search    │
│            │      │ Node.js + Scrapers │      │ External Blogs   │
└────────────┘      └─────────▲──────────┘      └──────────────────┘
                                │
                                ▼
                        ┌──────────────────┐
                        │ AI Models        │
                        │ Gemini / OpenAI │
                        └──────────────────┘
```

---

## ⚙️ Phase 1 – Article Scraping & CRUD API

### Features

* Scrapes **5 oldest articles** from BeyondChats blogs
* Stores articles in **MySQL**
* Full **CRUD REST APIs**

### Tech Stack

* Java 21
* Spring Boot
* Spring Data JPA
* MySQL
* Node.js (for scraping)

### Setup Instructions

#### 1️⃣ Backend API

```bash
cd Phase1/PhaseOne
./mvnw spring-boot:run
```

Update `application.properties` with your MySQL credentials.

#### 2️⃣ Scraper

```bash
cd Phase1/beyondchats-scraper
npm install
node scraper.js
```

---

## 🤖 Phase 2 – AI Enhancer & Google Search

### Responsibilities

* Fetch articles from Phase 1 API
* Search article titles on Google
* Extract **top 2 external blog links**
* Scrape content from those links
* Perform **AI-based comparison & analysis**

### Components

#### A) Node.js AI Enhancer

```bash
cd Phase2/ai-enhancer
npm install
node index.js
```

Environment variables (`.env`):

```
GOOGLE_API_KEY=
SEARCH_ENGINE_ID=
AI_API_KEY=
```

#### B) Spring Boot AI Service

```bash
cd Phase2/AIService
./mvnw spring-boot:run
```

Docker support available:

```bash
docker build -t ai-service .
docker run -p 8081:8081 ai-service
```

---

## 🎨 Phase 3 – Frontend (React)

### Features

* Displays scraped articles
* Shows AI insights & comparisons
* Clean, modern UI

### Tech Stack

* React 18
* Vite
* Axios

### Setup

```bash
cd Phase3/Frontend
npm install
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

## 🔁 End‑to‑End Flow

1. Scraper collects BeyondChats articles
2. Phase 1 API stores & exposes them
3. Phase 2 fetches articles
4. Google search finds similar blogs
5. Scrapers extract content
6. AI analyzes originality & similarity
7. Frontend displays enriched results

---

## 🚀 Production Notes

* Each phase is **independently deployable**
* Phase 2 AI service can be containerized
* Frontend can be deployed on Netlify/Vercel
* Backend services can run behind Nginx

---

## 🧪 Future Improvements

* Authentication & role-based access
* Rate limiting for scraping
* Kafka for async AI processing
* Redis caching
* ElasticSearch for article search

---

## 👨‍💻 Author

**Shrihari R. Kulkarni**
Third Year Computer Engineering
PICT Pune

---

## 📜 License

This project is licensed under the **Apache License**.
