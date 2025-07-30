# 🚀 Resume Builder - Professional Resume Creation Platform

A modern, full-stack web application for creating professional resumes with AI-powered job analysis and intelligent content management.

## 🎯 Overview

Resume Builder is a comprehensive platform that allows users to create, edit, and manage professional resumes with features like AI-powered job analysis, drag-and-drop content management, and real-time preview. The application provides a seamless experience for building resumes that stand out in today's competitive job market.

## ✨ Key Features

### 📝 **Resume Management**

- **Personal Information** - Contact details, location, social links
- **Work Experience** - Detailed job history with bullet points and technologies
- **Projects** - Portfolio projects with descriptions and tech stacks
- **Education** - Academic background and achievements
- **Skills** - Categorized skills with proficiency levels
- **Certifications** - Professional certifications and achievements

### 🤖 **AI-Powered Job Analysis**

- **Job Description Analysis** - AI analyzes job postings to extract key requirements
- **Smart Content Matching** - Automatically suggests relevant experiences and projects
- **Content Scoring** - Ranks your content based on job requirements
- **Intelligent Recommendations** - Suggests the best content combinations for specific roles

### 🎨 **Interactive Interface**

- **Drag & Drop** - Intuitive content organization and reordering
- **Real-time Preview** - Live resume preview as you edit
- **Responsive Design** - Works seamlessly on desktop and mobile
- **Modern UI** - Clean, professional interface with dark/light mode support

### 💾 **Data Persistence**

- **User Authentication** - Secure login and registration system
- **Auto-save** - Individual form auto-save with data persistence
- **Session Management** - Maintains state across browser sessions
- **Data Export** - Export resume data in multiple formats

## 🛠️ Technology Stack

### **Backend (Spring Boot)**

- **Java 24** - Latest Java features and performance
- **Spring Boot 3.4.0** - Modern Spring framework
- **Spring Security** - JWT-based authentication
- **Spring Data JPA** - Database operations
- **PostgreSQL** - Relational database
- **Maven** - Dependency management

### **Frontend (React)**

- **React 19.1.0** - Latest React with modern features
- **TypeScript 5.8.3** - Type-safe development
- **Vite 7.0.4** - Fast build tool and dev server
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **React Hook Form** - Form management and validation
- **Axios** - HTTP client for API communication
- **React Router** - Client-side routing
- **React Hot Toast** - User notifications

### **AI & External Services**

- **OpenAI-compatible APIs** - Job analysis and content processing
- **Vector Embeddings** - Semantic content matching
- **JWT Authentication** - Secure user sessions

## 🚀 Quick Start

```bash
# 1. Clone and setup
git clone <repository-url>
cd Resume-Builder
cp env.template .env

# 2. Configure environment
nano .env  # Fill in your database and API keys

# 3. Start backend
mvn spring-boot:run

# 4. Start frontend (new terminal)
cd frontend
npm install
npm run dev

# 5. Open browser
open http://localhost:5173
```

## 🚀 Getting Started

### Prerequisites

- **Java 24** or higher
- **Node.js 18** or higher
- **PostgreSQL 14** or higher
- **Maven 3.8** or higher

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd Resume-Builder
   ```

2. **Backend Setup**

   ```bash
   # Configure database in application.properties
   # Set your database credentials and connection details

   # Run the application
   mvn spring-boot:run
   ```

3. **Frontend Setup**

   ```bash
   cd frontend

   # Copy frontend environment template
   cp env.template .env

   # Edit .env to set your API URL
   # VITE_API_BASE_URL=http://localhost:8080/api

   npm install
   npm run dev
   ```

4. **Database Setup**

   ```bash
   # The application will automatically create tables
   # Run migrations to populate sample data
   ```

### Configuration

1. **Environment Variables Setup**

   ```bash
   # Copy the environment template
   cp env.template .env

   # Edit the .env file with your actual values
   nano .env
   ```

2. **Required Environment Variables**

   ```bash
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=resume_builder
   DB_USERNAME=your_db_username
   DB_PASSWORD=your_db_password

   # JWT Configuration
   JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random

   # AI Service Configuration
   OPENAI_API_KEY=your_openai_api_key_here
   OPENAI_API_BASE_URL=https://api.openai.com/v1

   # Server Configuration
   SERVER_PORT=8080
   CORS_ALLOWED_ORIGINS=http://localhost:5173
   ```

3. **Generate JWT Secret**

   ```bash
   # Generate a secure JWT secret
   openssl rand -base64 64
   ```

4. **Database Setup**

   ```sql
   -- Create database
   CREATE DATABASE resume_builder;

   -- Create user (optional)
   CREATE USER resume_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE resume_builder TO resume_user;
   ```

## 🧪 Testing the Application

### Test User Account

Use the provided test account to explore all features:

- **Username:** `testuser`
- **Password:** `test123`
- **Email:** `test.user@example.com`

### Sample Data Included

- 2 Work Experiences (Frontend Developer, Junior Developer)
- 3 Projects (E-commerce, Task Manager, Weather Dashboard)
- 2 Education entries (BS CS, Associate Degree)
- 20+ Skills across 5 categories
- 3 Certifications (AWS, MongoDB, React)

## 📁 Project Structure

```
Resume Builder/
├── 📄 Documentation
│   ├── README.md
│   ├── env.template       # Environment variables template
│   └── Resume_Updater_API.postman_collection.json
├── 🔒 Configuration
│   ├── .gitignore         # Git ignore rules
│   └── .env              # Environment variables (not in git)
├── 🖥️ Frontend (React)
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # API services
│   │   ├── types/         # TypeScript types
│   │   └── utils/         # Utility functions
│   ├── package.json
│   ├── env.template       # Frontend environment template
│   └── .env              # Frontend environment variables
├── ⚙️ Backend (Spring Boot)
│   ├── src/main/java/com/resume/
│   │   ├── controller/    # REST controllers
│   │   ├── service/       # Business logic
│   │   ├── model/         # Data models
│   │   ├── repository/    # Data access
│   │   └── config/        # Configuration
│   ├── pom.xml
│   └── .env              # Backend environment variables
└── 🗄️ Database
    └── src/main/resources/db/migration/
        ├── V1__create_resume_tables.sql
        ├── V2__insert_soham_patel_data.sql
        └── V4__insert_test_user_data.sql
```

## 🔧 API Endpoints

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/health` - Health check

### Resume Data

- `GET /api/personal-info` - Get personal information
- `POST /api/personal-info` - Save personal information
- `GET /api/experiences` - Get work experiences
- `POST /api/experiences` - Save work experience
- `GET /api/projects` - Get projects
- `POST /api/projects` - Save project
- `GET /api/education` - Get education
- `POST /api/education` - Save education
- `GET /api/skills` - Get skills
- `POST /api/skills` - Save skill
- `GET /api/certifications` - Get certifications
- `POST /api/certifications` - Save certification

### Job Analysis

- `POST /api/resume/analyze` - Analyze job description
- `GET /api/resume/blocks` - Get resume content blocks

### Data Persistence

- `POST /api/user-data/save` - Save all user data
- `GET /api/user-data/load` - Load all user data
- `GET /api/user-data/check` - Check if user has stored data

## 🎨 Features in Detail

### **Smart Content Management**

- **Drag & Drop Interface** - Intuitive content organization
- **Content Library** - Pre-built templates and examples
- **Real-time Editing** - Instant preview of changes
- **Auto-save** - Individual form auto-save with data persistence

### **AI-Powered Job Analysis**

- **Job Description Parsing** - Extracts key requirements and skills
- **Content Matching** - Matches your experiences to job requirements
- **Smart Scoring** - Ranks content relevance for specific roles
- **Recommendations** - Suggests optimal content combinations

### **Professional Resume Building**

- **Multiple Sections** - Comprehensive resume structure
- **Customizable Content** - Flexible content management
- **Professional Formatting** - Clean, ATS-friendly output
- **Export Options** - Multiple export formats

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - BCrypt password encryption
- **CORS Configuration** - Secure cross-origin requests
- **Input Validation** - Comprehensive data validation
- **SQL Injection Protection** - Parameterized queries

## 🚀 Deployment

### Production Build

```bash
# Backend
mvn clean package
java -jar target/resume-updater-1.0.0.jar

# Frontend
cd frontend
npm run build
```

### Environment Variables

```bash
# Copy environment template
cp env.template .env

# Required Variables
DB_HOST=localhost
DB_PORT=5432
DB_NAME=resume_builder
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_API_BASE_URL=https://api.openai.com/v1
SERVER_PORT=8080
CORS_ALLOWED_ORIGINS=http://localhost:5173

# Frontend Variables
# Copy frontend/env.template to frontend/.env
VITE_API_BASE_URL=http://localhost:8080/api
```

## 🔒 Security & Git Setup

### **Git Security**

- **Never commit sensitive data** - API keys, passwords, or secrets
- **Use environment variables** - All sensitive data is in `.env` (gitignored)
- **Template file** - `env.template` shows required variables without real values
- **JWT secrets** - Generate unique secrets for each environment

### **Environment Variables**

- **Development**: Use `.env` file (automatically gitignored)
- **Production**: Set environment variables on your deployment platform
- **Template**: Copy `env.template` to `.env` and fill in your values

### **Database Security**

- **Strong passwords** - Use complex database passwords
- **Limited permissions** - Create dedicated database user with minimal privileges
- **Connection encryption** - Use SSL for database connections in production

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Set up environment** - Copy `env.template` to `.env` and configure
4. **Make your changes** - Follow the existing code style
5. **Test thoroughly** - Ensure all features work correctly
6. **Commit your changes** (`git commit -m 'Add amazing feature'`)
7. **Push to the branch** (`git push origin feature/amazing-feature`)
8. **Open a Pull Request** - Include description of changes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Spring Boot** - Backend framework
- **React** - Frontend framework
- **Tailwind CSS** - Styling framework
- **OpenAI** - AI services
- **PostgreSQL** - Database

---

**Built with ❤️ for modern resume building**
