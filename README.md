# PicShare: NestJS Backend & React Frontend

This repository contains a full-stack application with a NestJS backend and a React frontend, managed as a monorepo.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (version 14 or later)
- npm (usually comes with Node.js)
- PostgreSQL

## Repository Structure

```
/
├── backend/     # NestJS backend
├── frontend/    # React frontend
└── package.json # Root package.json for managing the monorepo
```

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/justincrosbie/nest-react-picshare.git
cd nest-react-picshare
```

### 2. Install dependencies

From the root directory, run:

```bash
npm install
```

This will install dependencies for both the backend and frontend.

### 3. Set up the database

Create a PostgreSQL database for the project. Then, create a `.env` file in the `backend` directory with the following content:

```
JWT_SECRET=your_jwt_secret_here
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=username
DB_PASSWORD=passsord
DB_NAME=your_database_name
```

Replace `username`, `password`, and `your_database_name` with your PostgreSQL credentials and desired database name.

### 4. Build the project

From the root directory, run:

```bash
npm run build
```

This will build both the backend and frontend.

## Running the Application

### Backend

To start the NestJS backend, run:

```bash
npm run start:backend
```

The backend will be available at `http://localhost:3000`.

### Frontend

To start the React frontend, run:

```bash
npm run start:frontend
```

The frontend will be available at `http://localhost:3001`.

## Running Tests

### Backend Tests

To run the backend tests:

```bash
cd backend
npm test
```

### Frontend Tests

To run the frontend tests:

```bash
cd frontend
npm test
```
