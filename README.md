# StackOverflow Clone

This is a full-stack web application inspired by Stack Overflow. The app allows users to register, log in, create posts, receive notifications for new posts (excluding their own), and mark notifications as read.

## Table of Contents

1. [Features](#features)
2. [Technologies Used](#technologies-used)
3. [Getting Started](#getting-started)
4. [Prerequisites](#prerequisites)
5. [Installation](#installation)
6. [Configuration](#configuration)
7. [Running the Application](#running-the-application)
8. [API Documentation](#api-documentation)
9. [Project Structure](#project-structure)
10. [Contributing](#contributing)
11. [License](#license)

---

## Features

- User Authentication (Sign Up, Sign In, and Log Out)
- Create, read, and display posts
- Notification system for new posts
- Real-time updates for unread notifications

## Technologies Used

- **Frontend:** React, Tailwind CSS, Axios, React Router
- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Authentication:** JWT, Cookies
- **Storage:** MinIO (for file uploads)

---

## Getting Started

Follow the steps below to get a local copy of the project up and running.

### Prerequisites

- **Node.js** (v14+)
- **MongoDB** (Make sure MongoDB is running locally or set up your own MongoDB instance)
- **MinIO** (for storing file uploads; ensure MinIO is set up if file storage is needed)

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/your-username/stackoverflow-clone.git
    cd stackoverflow-clone
    ```

2. Install dependencies for both the frontend and backend:

    ```bash
    cd client
    npm install
    cd ../server
    npm install
    ```

### Configuration

1. Create a `.env` file in the `server` folder and add the following environment variables:

    ```plaintext
    PORT=5000
    MONGODB_URI=<your-mongodb-uri>
    JWT_SECRET=<your-jwt-secret>
    MINIO_ACCESS_KEY=<your-minio-access-key>
    MINIO_SECRET_KEY=<your-minio-secret-key>
    MINIO_BUCKET_NAME=<your-bucket-name>
    ```

2. In the `client` folder, configure the base URL for your API calls if needed.

### Running the Application

1. Start the backend server:

    ```bash
    cd server
    npm start
    ```

2. Start the frontend client:

    ```bash
    cd client
    npm run dev
    ```

### API Documentation

1. **Authentication**  
   - `POST /auth/signup`: Register a new user  
   - `POST /auth/signin`: Sign in a user  
   - `GET /auth/check`: Check if the user is authenticated

2. **Posts**  
   - `GET /posts`: Get all posts  
   - `POST /posts`: Create a new post  
   - `GET /posts/:id`: Get a post by ID

3. **Notifications**  
   - `GET /notifications/:userId`: Get unread notifications for a user  
   - `PUT /notifications/:id/mark`: Mark a notification as read

### Project Structure

/client # Frontend code (React) ├── src └── public

/server # Backend code (Express) ├── routes ├── controllers ├── models └── utils

### Contributing

Feel free to open issues or make pull requests to improve the project.

### License

This project is licensed under the MIT License.
