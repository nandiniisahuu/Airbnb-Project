# 🏡 Airbnb Project

A full-stack StayNest property booking web application built with **Node.js, Express.js, EJS, MongoDB, Tailwind CSS, and Google Gemini AI**.

The application provides separate **Guest and Host experiences**, property management, favourites, booking and cancellation functionality, flexible home searching, image uploads, authentication, and AI-powered property description generation.

---

## 🚀 Features

### 👤 Guest Features

- User signup and login
- Browse available homes
- View detailed property information
- Add/remove properties from favourites
- Book a home
- View **My Bookings**
- Cancel bookings
- Flexible home search and filtering
- Natural-language home search
- AI Home Finder
- Responsive and improved user interface
- Guest-specific navigation and actions

### 🏠 Host Features

- Host login
- Add properties
- Edit properties
- Delete properties
- Upload property images
- Generate AI-powered property descriptions
- View bookings for host properties
- Cancel bookings
- Host users are redirected to the **Host Home List**
- Host interface is separated from the guest experience
- Hosts do not see guest-only **AI Home Finder** and **Book Home** actions

---

# 🤖 AI Features

The project integrates **Google Gemini API** to provide AI-powered functionality.

## 1. AI Property Description Generator

Hosts can generate professional property descriptions using property information.

The application sends property details to the Gemini API and receives an AI-generated description.

---

## 2. AI Home Finder

Guests can search for properties using natural-language queries.

### Example

```text
Singapore me 11000 ke andar 4+ rating wala home
```

The application extracts:

```text
Location     → Singapore
Maximum Price → 11000
Minimum Rating → 4
```

The application identifies the search requirements and filters available properties.

The current implementation uses **rule-based JavaScript parsing + MongoDB queries** for structured searches.

This approach allows common searches to work without sending every request to Gemini.

---

# 🔌 APIs Used

The project uses the following APIs/services:

## Google Gemini API

Used for:

- AI-generated property descriptions
- AI-powered application functionality

Technology used:

```text
Google Gemini API
@google/genai
```

The Gemini API key is stored securely in the `.env` file.

```env
GEMINI_API_KEY=your_gemini_api_key
```

---

## Internal REST API

The application also contains its own backend API routes.

### AI API Base Path

```text
/api/ai
```

This route connects the frontend/application logic with the Gemini AI service.

### API Architecture

```text
Frontend
   ↓
Express.js API Route
   ↓
Controller
   ↓
AI Service
   ↓
Google Gemini API
```

---

## MongoDB Atlas

MongoDB Atlas is used as the application's cloud database.

It stores:

- Users
- Properties
- Bookings
- Favourites
- Sessions

MongoDB Atlas is **not an AI API**. It is the application's database service.

---

# 🛠️ Tech Stack

## Frontend

- HTML5
- CSS3
- EJS
- Tailwind CSS
- JavaScript
- Font Awesome

## Backend

- Node.js
- Express.js

## Database

- MongoDB
- MongoDB Atlas
- Mongoose

## Authentication & Sessions

- Express Session
- connect-mongodb-session
- bcryptjs

## AI

- Google Gemini API
- `@google/genai`

## File Upload

- Multer

## Development Tools

- Nodemon
- Git
- GitHub
- VS Code

---

# 🔐 Authentication

The application uses **session-based authentication**.

Sessions are managed using:

```text
express-session
connect-mongodb-session
```

Passwords are securely hashed using:

```text
bcryptjs
```

The application also separates permissions between:

```text
Guest
Host
```

Protected routes prevent unauthorized users from accessing host-specific functionality.

---

# 🖼️ Image Upload

Property images are uploaded using **Multer**.

Supported image types:

```text
PNG
JPG
JPEG
```

Uploaded property images are stored in:

```text
uploads/
```

Hosts can upload property images while creating or editing properties.

---

# 🎯 Project Objectives

This project demonstrates practical full-stack development concepts including:

- Full-stack web development
- Node.js
- Express.js
- EJS
- REST API development
- MVC-style architecture
- MongoDB integration
- Mongoose
- Authentication and authorization
- Session management
- CRUD operations
- Image uploads
- Booking management
- Favourites
- Flexible search and filtering
- Natural-language search parsing
- AI API integration
- Google Gemini integration
- Responsive UI development
- Tailwind CSS
- Git and GitHub

---

# 💡 Learning Outcomes

Through this project, I gained practical experience with:

```text
Node.js
Express.js
EJS
MongoDB
MongoDB Atlas
Mongoose
REST APIs
Authentication
Authorization
Sessions
CRUD Operations
File Uploads
Booking Systems
Search & Filtering
AI API Integration
Google Gemini API
Tailwind CSS
Git
GitHub
```

The project demonstrates how **frontend, backend, database, authentication, file handling, search functionality, and AI services** can work together in a complete full-stack web application.

---

# 👩‍💻 Author

**Nandini**

Interested in **Full Stack Development, Java, Web Development, REST APIs, MongoDB, and AI-powered applications**.
