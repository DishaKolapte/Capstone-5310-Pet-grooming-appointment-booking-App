# Pet Grooming Appointment Booking Web Application

## Project Overview
This project is a **Pet Grooming Appointment Booking Web Application** designed to streamline the process of scheduling grooming appointments for pets. The application features user and admin panels, allowing users to book appointments and manage their profiles, while admins can manage bookings, services, and users.

The project is developed using the **MERN stack** (MongoDB, Express.js, React.js, and Node.js) and follows a mobile-friendly, responsive design approach.

## Objectives
- **User-Friendly Booking System**: Allows users to easily book grooming services.
- **Service Management**: Admins can manage available grooming services.
- **Appointment Management**: Admins can approve, reschedule, or cancel appointments.
- **Secure Authentication**: Users and admins must log in securely.
- **Role-Based Authorization**: Different access controls for users and admins.
- **Mobile-Friendly Design**: Responsive design for mobile, tablet, and desktop views.

## Functional Requirements
- **Appointment Booking**: Users can select services and book appointments. Admins can manage appointment statuses (approve, reschedule, cancel).
- **User Management**: Admins can manage (add, edit, delete) users. Users can update their profiles and pet information.
- **Service Management**: Admins can add, edit, or delete grooming services with details such as name, price, and duration.
- **Authorization & Authentication**: Users can register and log in, and admins have role-based access to manage data.

## Non-Functional Requirements
- **Scalability**: Supports a large number of users, appointments, and services without performance issues.
- **Security**: Implements JWT-based authentication and uses HTTPS for secure communication.
- **Performance**: Booking and service management execute in real-time with minimal latency.
- **User Experience**: Intuitive interface accessible to both tech-savvy and non-technical users.

## User Stories

### Must Have
1. As a user, I want to book a grooming service for my pet.
2. As an admin, I want to manage appointments.

### Should Have
1. As a user, I want to rate my pet’s grooming service and provide feedback.
2. As a user, I want to cancel or reschedule my grooming appointment.
3. As a user, I want to save my favorite grooming services for future bookings.

### Could Have
1. As a user, I want to receive notifications for upcoming appointments via email or SMS.

## Technology Stack
- **Backend**: Node.js and Express.js for handling requests and responses.
- **Frontend**: React.js with Material-UI for UI components.
- **Database**: MongoDB for storing users, appointments, services, and groomer data.
- **Authentication**: JSON Web Tokens (JWT) for secure authentication.
- **Hosting**: AWS or Heroku for production deployment.
- **Version Control**: Git for version control and project management.

## Database Schema

### User Collection
| Field Name  | Data Type  | Description                |
|-------------|------------|----------------------------|
| user_id     | INT (PK)   | Unique identifier for user  |
| name        | VARCHAR(255)| Name of the user           |
| email       | VARCHAR(255)| User’s email address       |
| password    | VARCHAR(255)| Hashed password            |
| role        | VARCHAR(255)| Role (admin/user)          |
| created_at  | DATETIME   | Account creation date       |

### Appointment Collection
| Field Name       | Data Type   | Description                        |
|------------------|-------------|------------------------------------|
| appointment_id   | INT (PK)    | Unique identifier for the appointment |
| user_id          | INT (FK)    | Reference to the user              |
| service_id       | INT (FK)    | Reference to the grooming service  |
| status           | VARCHAR(255)| Status (pending, confirmed, etc.)  |
| appointment_date | DATETIME    | Date and time of the appointment   |

### Services Collection
| Field Name | Data Type   | Description               |
|------------|-------------|---------------------------|
| service_id | INT (PK)    | Unique identifier for service |
| name       | VARCHAR(255)| Name of the service        |
| description| VARCHAR(255)| Description of the service |
| price      | INT         | Cost of the service        |

## Timeline
- **Weeks 1-2**: Project setup and initial research.
- **Week 3**: Finalize requirements and wireframes.
- **Week 4**: Wireframe approval and adjustments.
- **Week 5**: Backend development including API and authentication.
- **Week 6**: Frontend implementation and integration.
- **Week 7**: Testing, deployment, and final quality assurance.

## Conclusion
This web application will simplify the process of booking grooming appointments and managing services, benefiting both pet owners and grooming businesses. With its secure authentication and responsive design, it will offer an optimized experience for all users.
