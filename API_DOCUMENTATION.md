# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication

All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Auth Endpoints

### Register User
Create a new user account.

**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Validation:**
- `name`: Required, 2-50 characters
- `email`: Required, valid email format
- `password`: Required, minimum 6 characters, must contain at least one number

**Success Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "657abc123def456",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "createdAt": "2024-12-30T10:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "User with this email already exists"
}
```

---

### Login User
Authenticate user and receive JWT token.

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "657abc123def456",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "createdAt": "2024-12-30T10:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

### Logout User
Logout current user (client should remove token).

**Endpoint:** `POST /auth/logout`

**Headers:** `Authorization: Bearer <token>`

**Success Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### Get Current User
Get currently authenticated user.

**Endpoint:** `GET /auth/me`

**Headers:** `Authorization: Bearer <token>`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "657abc123def456",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "createdAt": "2024-12-30T10:00:00.000Z"
    }
  }
}
```

---

## User Endpoints

### Get User Profile
Get detailed user profile.

**Endpoint:** `GET /user/profile`

**Headers:** `Authorization: Bearer <token>`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "657abc123def456",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "createdAt": "2024-12-30T10:00:00.000Z",
      "updatedAt": "2024-12-30T10:00:00.000Z"
    }
  }
}
```

---

### Update User Profile
Update user profile information.

**Endpoint:** `PUT /user/profile`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "John Updated",
  "email": "john.updated@example.com"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user": {
      "id": "657abc123def456",
      "name": "John Updated",
      "email": "john.updated@example.com",
      "role": "user",
      "updatedAt": "2024-12-30T11:00:00.000Z"
    }
  }
}
```

---

### Change Password
Update user password.

**Endpoint:** `PUT /user/password`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "currentPassword": "password123",
  "newPassword": "newpassword456"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Password changed successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

## Task Endpoints

### Get All Tasks
Get tasks with pagination, filtering, and sorting.

**Endpoint:** `GET /tasks`

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | number | 1 | Page number |
| limit | number | 10 | Items per page |
| status | string | - | Filter by status (pending, in-progress, completed) |
| priority | string | - | Filter by priority (low, medium, high) |
| search | string | - | Search in title and description |
| sortBy | string | createdAt | Sort field |
| sortOrder | string | desc | Sort order (asc, desc) |

**Example Request:**
```
GET /tasks?page=1&limit=10&status=pending&priority=high&search=urgent&sortBy=dueDate&sortOrder=asc
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "tasks": [
      {
        "_id": "657def123abc456",
        "title": "Complete project documentation",
        "description": "Write comprehensive documentation for the API",
        "status": "pending",
        "priority": "high",
        "dueDate": "2024-01-15T00:00:00.000Z",
        "user": "657abc123def456",
        "createdAt": "2024-12-30T10:00:00.000Z",
        "updatedAt": "2024-12-30T10:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalTasks": 47,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

---

### Get Task Statistics
Get task count by status.

**Endpoint:** `GET /tasks/stats`

**Headers:** `Authorization: Bearer <token>`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "stats": {
      "total": 47,
      "pending": 15,
      "in-progress": 12,
      "completed": 20
    }
  }
}
```

---

### Get Single Task
Get task by ID.

**Endpoint:** `GET /tasks/:id`

**Headers:** `Authorization: Bearer <token>`

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "task": {
      "_id": "657def123abc456",
      "title": "Complete project documentation",
      "description": "Write comprehensive documentation for the API",
      "status": "pending",
      "priority": "high",
      "dueDate": "2024-01-15T00:00:00.000Z",
      "user": "657abc123def456",
      "createdAt": "2024-12-30T10:00:00.000Z",
      "updatedAt": "2024-12-30T10:00:00.000Z"
    }
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Task not found"
}
```

---

### Create Task
Create a new task.

**Endpoint:** `POST /tasks`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "Complete project documentation",
  "description": "Write comprehensive documentation for the API",
  "status": "pending",
  "priority": "high",
  "dueDate": "2024-01-15"
}
```

**Validation:**
- `title`: Required, 1-200 characters
- `description`: Optional, max 2000 characters
- `status`: Optional, one of: pending, in-progress, completed
- `priority`: Optional, one of: low, medium, high
- `dueDate`: Optional, valid ISO 8601 date

**Success Response (201):**
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "task": {
      "_id": "657def123abc456",
      "title": "Complete project documentation",
      "description": "Write comprehensive documentation for the API",
      "status": "pending",
      "priority": "high",
      "dueDate": "2024-01-15T00:00:00.000Z",
      "user": "657abc123def456",
      "createdAt": "2024-12-30T10:00:00.000Z",
      "updatedAt": "2024-12-30T10:00:00.000Z"
    }
  }
}
```

---

### Update Task
Update an existing task.

**Endpoint:** `PUT /tasks/:id`

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "Updated title",
  "status": "in-progress"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Task updated successfully",
  "data": {
    "task": {
      "_id": "657def123abc456",
      "title": "Updated title",
      "description": "Write comprehensive documentation for the API",
      "status": "in-progress",
      "priority": "high",
      "dueDate": "2024-01-15T00:00:00.000Z",
      "user": "657abc123def456",
      "createdAt": "2024-12-30T10:00:00.000Z",
      "updatedAt": "2024-12-30T11:00:00.000Z"
    }
  }
}
```

---

### Delete Task
Delete a task.

**Endpoint:** `DELETE /tasks/:id`

**Headers:** `Authorization: Bearer <token>`

**Success Response (200):**
```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

---

## Error Responses

### Validation Error (400)
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email"
    },
    {
      "field": "password",
      "message": "Password must be at least 6 characters"
    }
  ]
}
```

### Unauthorized (401)
```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

### Forbidden (403)
```json
{
  "success": false,
  "message": "User role 'user' is not authorized to access this route"
}
```

### Not Found (404)
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### Server Error (500)
```json
{
  "success": false,
  "message": "Server Error"
}
```

---

## Postman Collection

Import the following JSON into Postman:

```json
{
  "info": {
    "name": "Task Manager API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:5000/api"
    },
    {
      "key": "token",
      "value": ""
    }
  ],
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Register",
          "request": {
            "method": "POST",
            "url": "{{baseUrl}}/auth/register",
            "body": {
              "mode": "raw",
              "raw": "{\"name\": \"John Doe\", \"email\": \"john@example.com\", \"password\": \"password123\"}",
              "options": { "raw": { "language": "json" } }
            }
          }
        },
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "url": "{{baseUrl}}/auth/login",
            "body": {
              "mode": "raw",
              "raw": "{\"email\": \"john@example.com\", \"password\": \"password123\"}",
              "options": { "raw": { "language": "json" } }
            }
          }
        },
        {
          "name": "Get Current User",
          "request": {
            "method": "GET",
            "url": "{{baseUrl}}/auth/me",
            "header": [
              { "key": "Authorization", "value": "Bearer {{token}}" }
            ]
          }
        }
      ]
    },
    {
      "name": "Tasks",
      "item": [
        {
          "name": "Get All Tasks",
          "request": {
            "method": "GET",
            "url": "{{baseUrl}}/tasks",
            "header": [
              { "key": "Authorization", "value": "Bearer {{token}}" }
            ]
          }
        },
        {
          "name": "Create Task",
          "request": {
            "method": "POST",
            "url": "{{baseUrl}}/tasks",
            "header": [
              { "key": "Authorization", "value": "Bearer {{token}}" }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\"title\": \"New Task\", \"description\": \"Task description\", \"priority\": \"high\"}",
              "options": { "raw": { "language": "json" } }
            }
          }
        },
        {
          "name": "Get Task Stats",
          "request": {
            "method": "GET",
            "url": "{{baseUrl}}/tasks/stats",
            "header": [
              { "key": "Authorization", "value": "Bearer {{token}}" }
            ]
          }
        }
      ]
    }
  ]
}
```
