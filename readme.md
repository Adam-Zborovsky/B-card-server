# B-Card Server

## Overview

B-Card Server is a **RESTful API** built with **Node.js, Express.js, and MongoDB** to manage business cards. Users can register, authenticate, and create business cards, while admin users have additional management privileges.

## Features

- **User Authentication & Authorization** (JWT)
- **User Management** (Register, Login, Update, Delete, Change Business Status)
- **Business Card Management** (Create, Retrieve, Update, Delete, Like)
- **Secure Password Encryption** (BcryptJS)
- **Data Validation** (Joi)
- **Logging** (Morgan, File Logger for errors)
- **Error Handling** (Centralized error responses)
- **CORS Support**
- **Environment Configuration (dotenv)**
- **Admin Features** (Modify business number, User Lockout after failed attempts)

## Installation

### Prerequisites

Ensure you have **Node.js** and **MongoDB** installed.

### Setup

```sh
# Clone the repository
git clone https://github.com/your-repo/b-card-server.git
cd b-card-server

# Install dependencies
npm install
```

## Environment Variables

Create a `.env` file in the root directory and define:

```
PORT=3000
MONGO_URI=your_mongodb_connection_string
SECRET_WORD=your_secret_key
```

## Running the Server

### Local Development

```sh
npm start
```

### Production

```sh
npm run prod
```

## API Documentation

For a detailed API reference, check the **[Postman Public Documentation](#)**.

### Authentication Endpoints

| Method | Endpoint          | Description         |
| ------ | ----------------- | ------------------- |
| POST   | `/users/register` | Register a new user |
| POST   | `/users/login`    | Authenticate user   |

### Business Card Endpoints

| Method | Endpoint | Description                 |
| ------ | -------- | --------------------------- |
| POST   | `/cards` | Create a new business card  |
| GET    | `/cards` | Retrieve all business cards |

## Logging

- **Morgan** logs all requests
- **File Logger** logs failed requests (status `400+`)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature-name`)
3. Commit your changes (`git commit -m "Description"`)
4. Push to the branch (`git push origin feature-name`)
5. Submit a Pull Request

## License

This project is licensed under the MIT License.
