# Prishtina Nights

Prishtina Nights is a nightlife and event management platform designed to connect users with venues, events, and experiences across the city. The system enables users to discover events, make reservations, and interact with venues, while administrators and business owners manage content and operations.

---

## Project Overview

This project is developed as part of a Lab Course and follows strict academic and architectural requirements:

- Full-stack web application  
- Modular and scalable architecture  
- Real-time features  
- Secure authentication system  

---

## Tech Stack

### Backend
- .NET Core Web API  
- Entity Framework Core  
- MSSQL  
- JWT Authentication (Access + Refresh Tokens)  

### Frontend
- React (Vite)  
- Bootstrap  

### Additional Technologies
- WebSockets (Real-time communication)  
- Swagger / OpenAPI (API documentation)  
- Git & GitHub (Version control)  
- Trello (Project management)  

---

## Architecture

The project follows a layered architecture:

- Controllers → Handle HTTP requests  
- Services → Business logic  
- Repositories → Data access layer  

This ensures:

- Separation of concerns  
- Maintainability  
- Scalability  

---

## Security Features

- JWT Authentication (Access Token + Refresh Token)  
- Password hashing  
- Role-based authorization  
- Permission-based access control  
- Global exception handling  
- Input validation  
- CORS configuration  

---

## Database Design

- Designed in Third Normal Form (3NF)  

Includes:
- Foreign keys  
- Indexes  
- Audit columns:
  - created_by  
  - updated_by  
  - created_at  
  - updated_at  

### Mandatory System Tables
- Users  
- Roles  
- UserRoles  
- Permissions  
- RolePermissions  
- RefreshTokens  
- AuditLogs  
- Notifications  
- Settings  
- Files  

### Additional Tables
- Events  
- Venues  
- Reservations  
- Payments  
- Reviews  
- Categories  
- And more  

---

## Core Features

### User Features
- Register / Login  
- Browse events & venues  
- Make reservations  
- Leave reviews  
- Receive notifications  

### Business Owner Features
- Create and manage events  
- Manage venue information  
- View reservations  

### Admin Features
- Manage users and roles  
- Monitor system activity  
- Manage content and permissions  

---

## Real-Time Features

- Live notifications  
- Reservation updates  
- Event updates  

---

## Additional Features

- Dashboard with analytics  
- File uploads (images, documents)  
- Audit logging system  
- Settings management  

---

## Project Structure

```text
PrishtinaNights/
│
├── Backend/
│   ├── Controllers/
│   ├── Services/
│   ├── Repositories/
│   ├── Models/
│   └── DTOs/
│
├── Frontend/
│   ├── Components/
│   ├── Pages/
│   ├── Services/
│   └── StateManagement/
│
├── Database/
│   └── SQL Scripts/
│
└── Documentation/
    └── ERD, API Docs
```

---

## Testing

- API testing via Swagger  
- Authentication tested using Bearer tokens  
- CRUD operations verified for all entities  

---

## Project Management

- Managed using Trello  

Workflow:
- Backlog  
- To Do  
- In Progress  
- Done  

---

## Team Collaboration

- Each member works on a feature branch  
- Pull requests are reviewed before merging  
- Integration is done into a shared branch (e.g., develop)  

---

## Setup Instructions

### 1. Clone Repository

```bash
git clone https://github.com/ShpatN/Lab2.git
```

### 2. Backend Setup

- Open in Visual Studio  
- Configure `appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=YOUR_SERVER;Database=YOUR_DB;User Id=YOUR_USER;Password=YOUR_PASSWORD;TrustServerCertificate=True;"
  }
}
```

- Run migrations / update database  
- Start API  

---

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## Documentation

- Swagger API documentation available at:  
  `/swagger`  

- ERD included in project files  

---

## Project Goals

- Build a real-world scalable system  
- Apply best practices in software architecture  
- Ensure security and performance  
- Deliver a complete full-stack solution  

---

## Notes

This project is developed for academic purposes but follows industry-level standards in:

- Architecture  
- Security  
- Code organization  
