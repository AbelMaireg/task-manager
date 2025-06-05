# Task Management API

A simple NestJS-based REST API for managing tasks, allowing users to create, read, update, and delete tasks with a completion status. The API uses an in-memory store for simplicity and includes UUID generation for unique task IDs.

## Table of Contents
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [Dependencies](#dependencies)

## Features
- Create, read, update, and delete tasks.
- Filter tasks by completion status (`isCompleted` query parameter).
- Input validation using `class-validator`.
- Unique task IDs generated using a custom UUID v4 generator.
- Comprehensive unit tests with Jest for service and controller.

## Prerequisites
- Node.js (v18 or higher)
- Yarn (v1.22 or higher)
- NestJS CLI (optional, for generating new resources)

## Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd task-management-api
   ```
2. Install dependencies:
   ```bash
   yarn install
   ```
3. Ensure the following dependencies are installed:
   - `@nestjs/core`, `@nestjs/common`, `@nestjs/testing`
   - `class-validator`, `class-transformer`
   - `jest`, `@types/jest`, `ts-jest`

## Running the Application
1. Start the development server:
   ```bash
   yarn start:dev
   ```
2. The API will be available at `http://localhost:3000`.

## API Endpoints
The API provides the following endpoints under the `/tasks` route:

| Method | Endpoint                  | Description                              | Request Body / Query Parameters                     |
|--------|---------------------------|------------------------------------------|----------------------------------------------------|
| `POST` | `/tasks`                  | Create a new task                        | `{ "title": string, "isCompleted": boolean }`       |
| `GET`  | `/tasks`                  | Get all tasks (optional filter)          | `?isCompleted=true` or `?isCompleted=false` (optional) |
| `GET`  | `/tasks/:title`           | Get a task by title                      | None                                               |
| `PUT`  | `/tasks/:id`              | Update a task by ID                      | `{ "title": string, "isCompleted": boolean }`       |
| `DELETE` | `/tasks/:id`            | Delete a task by ID                      | None                                               |

### Example Requests
- **Create a task**:
  ```bash
  curl -X POST http://localhost:3000/tasks -H "Content-Type: application/json" -d '{"title": "New Task", "isCompleted": false}'
  ```
  Response: `{ "id": "123e4567-e89b-12d3-a456-426614174000", "title": "New Task", "isCompleted": false }`

- **Get all tasks**:
  ```bash
  curl http://localhost:3000/tasks
  ```
  Response: `[{ "id": "...", "title": "Task 1", "isCompleted": false }, { "id": "...", "title": "Task 2", "isCompleted": true }]`

- **Get completed tasks**:
  ```bash
  curl http://localhost:3000/tasks?isCompleted=true
  ```
  Response: `[{ "id": "...", "title": "Task 2", "isCompleted": true }]`

- **Get task by title**:
  ```bash
  curl http://localhost:3000/tasks/Task%201
  ```
  Response: `{ "id": "...", "title": "Task 1", "isCompleted": false }`

- **Update a task**:
  ```bash
  curl -X PUT http://localhost:3000/tasks/123e4567-e89b-12d3-a456-426614174000 -H "Content-Type: application/json" -d '{"title": "Updated Task", "isCompleted": true}'
  ```
  Response: `{ "id": "...", "title": "Updated Task", "isCompleted": true }`

- **Delete a task**:
  ```bash
  curl -X DELETE http://localhost:3000/tasks/123e4567-e89b-12d3-a456-426614174000
  ```
  Response: `{ "id": "...", "title": "Task 1", "isCompleted": false }`

## Testing
The project includes unit tests for the `TasksService` and `TasksController` using Jest.

1. Run the tests:
   ```bash
   yarn test
   ```
2. The test suite covers:
   - Task creation, retrieval, updating, and deletion.
   - Filtering tasks by completion status.
   - Error handling for nonexistent tasks.
   - Input validation using `class-validator`.

## Project Structure
```
src/
├── tasks/
│   ├── dto/
│   │   └── task.dto.ts         # DTOs with class-validator rules
│   ├── tasks.controller.ts     # REST API controller
│   ├── tasks.service.ts        # Business logic for task management
│   ├── tasks.controller.spec.ts # Controller unit tests
│   ├── tasks.service.spec.ts   # Service unit tests
│   └── tasks.module.ts         # NestJS module
├── utils/
│   └── uuid-generator.ts       # UUID v4 generator
├── app.module.ts               # Root module
└── main.ts                     # Application bootstrap
```

## Dependencies
- **Runtime**:
  - `@nestjs/core`, `@nestjs/common`
  - `class-validator`, `class-transformer`
- **Development**:
  - `@nestjs/testing`, `jest`, `@types/jest`, `ts-jest`

To install dependencies:
```bash
yarn add @nestjs/core @nestjs/common class-validator class-transformer
yarn add --dev @nestjs/testing jest @types/jest ts-jest
```
