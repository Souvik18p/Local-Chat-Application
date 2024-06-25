

# Local Chat Application

## Overview

The Local Chat Application is a desktop-based chat system that enables multiple users on the same device to communicate in different chat rooms. It includes features for user authentication, room management, and real-time messaging within a local network environment.

## Features

- **Multi-room Chat**: Users can join and participate in different chat rooms.
- **User Authentication**: Secure login and registration with hashed passwords.
- **Real-time Messaging**: Instant messaging within the local network.
- **Persistent Storage**: Message history stored locally for each user.

## Technologies Used

- **Backend**: Node.js, Express.js, SQLite for data storage
- **Frontend**: HTML, CSS, JavaScript, Electron for desktop application

## Getting Started

To run the application locally, follow these steps:

1. **Clone Repository**: `git clone https://github.com/your-username/local-chat-app.git`
2. **Install Dependencies**:
   ```bash
   cd backend
   npm install
   cd ../frontend
   npm install
   ```
3. **Start the Server and Electron Application**:
   ```bash
   # In the backend directory
   npm start
   
   # In the frontend directory
   npm start
   ```
