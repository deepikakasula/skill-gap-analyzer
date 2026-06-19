# Skill Gap Analyzer

Skill Gap Analyzer is a production-ready, full-stack application designed to identify, analyze, and bridge the gaps between user technical skill sets and target industry roles.

---

## Technical Stack

- **Frontend**: React (v18), TypeScript, Vite, Tailwind CSS, React Router, Axios, Lucide React, Recharts
- **Backend**: Spring Boot (v3.3), Java 17, Spring Data JPA, Hibernate, Lombok, Jakarta Validation
- **Database**: MySQL (v8.x+)

---

## Folder Structure

```text
skill-gap-analyzer/
├── README.md                 # Project documentation
├── docker-compose.yml        # PostgreSQL service definition (unused / reference)
├── .gitignore                # Global git ignore configurations
│
├── backend/                  # Spring Boot Java REST API Server
│   ├── pom.xml               # Maven dependencies configuration
│   ├── mvnw / mvnw.cmd       # Maven wrapper binaries
│   ├── db/                   # Seed and migration reference folders
│   └── src/
│       └── main/
│           ├── java/com/skillgapanalyzer/
│           │   ├── SkillGapAnalyzerApplication.java   # App entry point
│           │   ├── controller/                        # REST Controllers (User, Skill, Analysis, RoleAnalysis)
│           │   ├── entity/                            # JPA Database entities
│           │   ├── dto/                               # Data Transfer Objects
│           │   ├── repository/                        # JPA Repositories
│           │   ├── service/                           # Business logic service layers
│           │   └── exception/                         # Global REST exception handlers
│           └── resources/
│               └── application.properties             # Port settings and DB configuration
│
└── frontend/                 # React TypeScript client app (Vite build tool)
    ├── package.json          # npm dependencies
    ├── vite.config.ts        # Vite configuration
    ├── tailwind.config.js    # Tailwind theme configuration
    ├── index.html            # Main HTML entry point
    └── src/
        ├── main.tsx          # Application bootstrapper
        ├── App.tsx           # Route layout definitions
        ├── components/       # Layout, Navbar, Sidebar, SkillCard elements
        ├── pages/            # Page Views (Dashboard, SkillAnalysis, Roadmap, Settings, Login, Register)
        ├── services/         # Axios API clients
        └── utils/            # Helper formatting/utility methods
```

---

## Setup & Running Instructions

### 1. Database Configuration
Ensure a local MySQL instance is running on port `3306` with the database `skill_gap_db`. The Spring Boot app expects the following credentials by default:
- **Database URL**: `jdbc:mysql://localhost:3306/skill_gap_db`
- **Username**: `root`
- **Password**: `Root`

### 2. Backend API Setup
1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
2. Build and launch the Spring Boot application using the Maven wrapper:
   ```powershell
   # Windows PowerShell
   $env:JAVA_HOME="C:\Program Files\Eclipse Adoptium\jdk-17.0.19.10-hotspot"
   .\mvnw.cmd spring-boot:run
   ```
   The backend API server will start on `http://localhost:8080` and auto-initialize the database schema using JPA.

### 3. Frontend Setup
1. Navigate to the `frontend/` directory:
   ```bash
   cd ../frontend
   ```
2. Install npm packages:
   ```bash
   npm install
   ```
3. Boot up the Vite local development server:
   ```bash
   npm run dev
   ```
   The React client will start on `http://localhost:5173/`. Connect to this address in your browser to interact with the application.
