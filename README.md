# Pet Grooming Appointment Booking Web Application

## Project Overview
This project involves building a pet grooming appointment booking web application allows users to schedule grooming appointments for their pets. Admins can manage bookings, users, services, and groomers through an intuitive, secure interface. The groomers can accept, reject or ask to reschedule the appointment requests. The application will be developed using the MERN stack (MongoDB, Express, React, Node.js) with both user-facing and admin panels.

The project is developed using the **MERN stack** (MongoDB, Express.js, React.js, and Node.js) and follows a mobile-friendly, responsive design approach.

## Objectives
- **User-Friendly Booking System**: Allows users to easily book grooming services.
- **Service Management**: Admins can manage available grooming services.
- **Appointment Management**: Admins can approve, reschedule, or cancel appointments.
- **Secure Authentication**: Users and admins must log in securely.
- **Role-Based Authorization**: Different access controls for users and admins.
- **Mobile-Friendly Design**: Responsive design for mobile, tablet, and desktop views.


## Technology Stack
- **Backend**: Node.js and Express.js for handling requests and responses.
- **Frontend**: React.js with Material-UI for UI components.
- **Database**: MongoDB for storing users, appointments, services, and groomer data.
- **Authentication**: JSON Web Tokens (JWT) for secure authentication.
- **Hosting**: AWS or Heroku for production deployment.
- **Version Control**: Git for version control and project management.

## Data Models

# User Model
This table will store the details of each User.

| Field Name           | Data Type | Description                        |
|----------------------|-----------|------------------------------------|
| name                 | String    | Unique identifier for username    |
| email                | String    | User’s email address              |
| password             | String    | Hashed password                   |
| isGroomer / isAdmin  | Boolean   | Verification                      |
| phone                | String    | User’s phone number               |
| city                 | String    | User’s city preference            |

# Appointment Model
This table will store the appointment details.

| Field Name  | Data Type | Description                        |
|-------------|-----------|------------------------------------|
| groomer_id  | INT       | Unique identifier for the groomer |
| user_id     | INT       | Reference to the user             |
| services    | String    | Reference to the grooming service |
| status      | String    | Status (pending, confirmed, etc.) |
| date        | String    | Date of the appointment           |
| time        | String    | Time of the appointment           |
| pet_name    | String    | Name of pet                       |
| pet_type    | String    | Type of pet                       |

# Groomer Model
This table will store the details of the services.

| Field Name  | Data Type | Description                             |
|-------------|-----------|-----------------------------------------|
| firstName   | String    | First name of the groomer              |
| lastName    | String    | Groomer’s last name                    |
| about       | String    | Description of the service             |
| basePrice   | Number    | Base cost of the service               |
| phone       | String    | Phone number of the groomer            |
| city        | String    | Groomer’s city preference              |
| experience  | Number    | Number of years of grooming experience |
| email       | String    | Email ID of the groomer                |



## Conclusion
This web application will simplify the process of booking grooming appointments and managing services, benefiting both pet owners and grooming businesses. With its secure authentication and responsive design, it will offer an optimized experience for all users.
