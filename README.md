# Todo API

A simple and efficient Todo API built with Node.js, Express, and MongoDB. This API allows users to manage their todo items easily.

## Features

- User registration and authentication
- Create, read, update, and delete (CRUD) operations for todos
- Admin user management
- JWT-based authentication
- Error handling and logging
- CORS support
- Environment variable configuration

## Technologies Used

- Node.js
- Express
- MongoDB
- Mongoose
- JWT (JSON Web Token)
- bcrypt for password hashing
- Docker for containerization

## Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/)
- [Docker](https://www.docker.com/get-started)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/aquie00tt/todo-api.git
   cd todo-api
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a .env.production file and configure your environment variables based on the .env.example provided.
4. Start the application locally:
   ```bash
   npm start
   ```

### Docker Setup

To run the API using Docker:

1. Build the Docker image:
   ```bash
   docker build -t aquie00t/todo-api .
   ```
2. Run the Docker container:
   ```bash
   docker run -p 5001:5001 aquie00t/todo-api
   ```

### [API ENDPOINTS](./docs/API_ENDPOINTS.md)

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
