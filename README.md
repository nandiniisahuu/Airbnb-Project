# 🏡 Airbnb Full Stack Web Application

A full-stack Airbnb-style web application built with **Node.js, Express.js, MongoDB, Mongoose, EJS and Tailwind CSS**.

The project allows users to explore property listings, create accounts, manage properties as hosts, upload property images, save favorite homes, and manage bookings.

---

## 🚀 Features

### 👤 User Authentication
- User registration and login
- Session-based authentication
- Guest and host user types
- Password hashing using bcrypt
- Protected host routes

### 🏠 Property Management
- View available homes
- Host can add a new property
- Host can edit property details
- Host can delete properties
- Property details include:
  - House name
  - Price
  - Location
  - Rating
  - Description
  - Property image

### ❤️ Favorites
- Users can add homes to favorites
- Users can view their favorite homes
- Users can remove homes from favorites

### 📅 Booking System
- Logged-in users can book a home
- Users can view their bookings
- Users can cancel bookings
- Booking information is stored in MongoDB
- A home can have one active booking at a time

### 📷 Image Upload
- Property images can be uploaded using Multer
- Uploaded images are stored in the `uploads/` directory
- Express serves uploaded images through static routes

### 🗄️ Database
- MongoDB Atlas database
- Mongoose for database modeling and queries
- Separate models for users, homes and bookings

---

## 🛠️ Technologies Used

### Frontend
- HTML5
- CSS3
- JavaScript
- EJS
- Tailwind CSS

### Backend
- Node.js
- Express.js
- Express Session
- MVC architecture

### Database
- MongoDB
- MongoDB Atlas
- Mongoose

### Other Tools & Libraries
- bcryptjs
- Multer
- dotenv
- express-validator
- Git
- GitHub
- Nodemon

---



## 🏗️ Architecture

The application follows the **MVC (Model-View-Controller)** architecture.

```text
User
 │
 ▼
Routes
 │
 ▼
Controllers
 │
 ├──────► Models ──────► MongoDB Atlas
 │
 ▼
Views (EJS)
 │
 ▼
Browser
```

### Model
Handles database structure and MongoDB operations.

### View
EJS templates are used to generate the user interface.

### Controller
Contains application logic for authentication, properties, bookings and other operations.

### Routes
Defines the URLs and connects requests to controllers.

---

## 🔄 Application Workflow

### Guest/User

```text
Register
   ↓
Login
   ↓
Browse Homes
   ↓
View Home Details
   ↓
Book Home
   ↓
My Bookings
   ↓
Cancel Booking
```

### Host

```text
Login
   ↓
Host Dashboard
   ↓
Add Home
   ↓
Upload Image
   ↓
Manage Homes
   ↓
Edit / Delete Home
```

---

## 🗃️ Main Database Models

### User

Stores user account information such as:

- First name
- Last name
- Email
- Password
- User type
- Favorite homes

### Home

Stores property information such as:

- House name
- Price
- Location
- Rating
- Description
- Photo
- Host/user reference

### Booking

Stores booking information such as:

- Home reference
- User reference
- Booking date
- Booking status
- Created/updated timestamps

---

## 🔐 Environment Variables

Create a `.env` file in the project root.

```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>/<database>?retryWrites=true&w=majority
JWT_SECRET=your_secret_key
```

⚠️ **Never upload your real `.env` file or MongoDB credentials to GitHub.**

Your `.gitignore` should include:

```gitignore
node_modules/
.env
*.log
.DS_Store
dist/
```

---

## 📸 Image Upload

Property images are uploaded using **Multer**.

Uploaded files are stored in:

```text
uploads/
```

The application exposes the uploaded images through Express static routes.

Example:

```text
/uploads/property-image.jpg
```

---

## 🔒 Security Considerations

- Passwords should never be stored as plain text.
- Authentication routes are protected using sessions.
- MongoDB credentials are stored in environment variables.
- `.env` is excluded from Git.
- User input is validated before processing.


---

## 🎯 Learning Outcomes

Through this project, I practiced:

- Building a full-stack web application
- Node.js and Express.js
- MVC architecture
- MongoDB and Mongoose
- Authentication and sessions
- CRUD operations
- File/image uploads
- EJS templating
- Form validation
- Git and GitHub
- Backend routing
- Database relationships
- Booking workflows

---

## 👩‍💻 Author

**Nandini**
