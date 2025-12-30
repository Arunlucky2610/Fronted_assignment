# Task Manager Application

A full-stack task management application built with **Next.js**, **React**, **Node.js**, **Express**, and **MongoDB**.

## 🚀 Features

### Authentication
- User registration with validation
- Secure login with JWT tokens
- Password hashing using bcrypt
- Protected routes middleware
- Logout functionality

### Dashboard
- User profile display
- Task statistics overview
- Full CRUD operations for tasks
- Search and filter tasks
- Pagination support
- Responsive design

### Task Management
- Create, read, update, delete tasks
- Task status: pending, in-progress, completed
- Task priority: low, medium, high
- Due date tracking
- Real-time search and filtering

## 📁 Project Structure

```
Assignment/
├── backend/                    # Node.js + Express API
│   ├── config/
│   │   └── database.js        # MongoDB connection
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   └── task.controller.js
│   ├── middleware/
│   │   ├── auth.js            # JWT authentication
│   │   ├── errorHandler.js    # Global error handling
│   │   └── validation.js      # Input validation
│   ├── models/
│   │   ├── User.js
│   │   └── Task.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   └── task.routes.js
│   ├── server.js              # Entry point
│   ├── package.json
│   └── .env.example
│
└── frontend/                   # Next.js + React App
    ├── app/
    │   ├── login/
    │   ├── register/
    │   ├── dashboard/
    │   ├── layout.tsx
    │   └── page.tsx
    ├── components/
    │   ├── ui/                # Reusable UI components
    │   ├── layout/            # Layout components
    │   └── tasks/             # Task-related components
    ├── services/              # API service functions
    ├── utils/                 # Utility functions
    ├── types/                 # TypeScript types
    ├── middleware.ts          # Route protection
    └── package.json
```

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** (App Router)
- **React 18**
- **TypeScript**
- **Tailwind CSS**
- **Axios**

### Backend
- **Node.js**
- **Express.js**
- **MongoDB** with Mongoose
- **JWT** for authentication
- **bcryptjs** for password hashing
- **express-validator** for input validation

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## ⚙️ Installation & Setup

### 1. Clone the Repository
```bash
cd Assignment
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file (copy from .env.example)
cp .env.example .env

# Update .env with your MongoDB URI and JWT secret
# MONGODB_URI=mongodb://localhost:27017/task_manager
# JWT_SECRET=your_super_secret_key

# Start the server
npm run dev
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from root)
cd frontend

# Install dependencies
npm install

# Create .env.local file
echo "NEXT_PUBLIC_API_URL=http://localhost:5000/api" > .env.local

# Start the development server
npm run dev
```

The frontend will run on `http://localhost:3000`

## 🔑 Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/task_manager
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## 📚 API Documentation

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for detailed API endpoints.

### Quick Reference

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register user | No |
| POST | `/api/auth/login` | Login user | No |
| POST | `/api/auth/logout` | Logout user | Yes |
| GET | `/api/auth/me` | Get current user | Yes |
| GET | `/api/user/profile` | Get user profile | Yes |
| PUT | `/api/user/profile` | Update profile | Yes |
| GET | `/api/tasks` | Get all tasks | Yes |
| POST | `/api/tasks` | Create task | Yes |
| GET | `/api/tasks/:id` | Get single task | Yes |
| PUT | `/api/tasks/:id` | Update task | Yes |
| DELETE | `/api/tasks/:id` | Delete task | Yes |
| GET | `/api/tasks/stats` | Get task stats | Yes |

## 🚀 Scaling Strategy

### 1. Separating Frontend & Backend Deployments

**Current Architecture:**
- Frontend and backend are separate applications
- Can be deployed independently to different services

**Recommendations:**
- Deploy frontend to **Vercel** or **Netlify** (optimized for Next.js)
- Deploy backend to **AWS EC2**, **Heroku**, **Railway**, or containerized with **Docker**
- Use **CI/CD pipelines** for automated deployments

### 2. Using API Gateway

**Benefits:**
- Centralized request routing
- Rate limiting and throttling
- Authentication/Authorization at gateway level
- Request/Response transformation
- Analytics and monitoring

**Implementation:**
- Use **AWS API Gateway**, **Kong**, or **NGINX** as reverse proxy
- Configure SSL termination at gateway
- Implement request caching

### 3. Token Refresh Strategy

**Current Implementation:**
- JWT tokens with 7-day expiration
- Client-side token storage

**Enhanced Strategy:**
```
Access Token: 15 minutes expiry
Refresh Token: 7 days expiry (stored in HttpOnly cookie)

Flow:
1. Login → Receive access + refresh tokens
2. API calls → Use access token
3. Access token expires → Use refresh token to get new access token
4. Refresh token expires → User must re-login
```

**Implementation:**
- Add `/api/auth/refresh` endpoint
- Store refresh tokens in database with user association
- Implement token rotation (new refresh token on each refresh)
- Add token blacklisting for logout

### 4. Pagination

**Current Implementation:**
- Server-side pagination with configurable page size
- Query parameters: `page`, `limit`, `sortBy`, `sortOrder`

**Scaling Considerations:**
- **Cursor-based pagination** for real-time data
- **Offset-based pagination** for static data
- Use database indexes for sort fields
- Implement maximum page size limits

```javascript
// Cursor-based example
GET /api/tasks?cursor=<lastTaskId>&limit=10
```

### 5. Redis Caching

**Use Cases:**
- Session storage
- API response caching
- Rate limiting counters
- Real-time leaderboards

**Implementation:**
```javascript
// Cache task statistics
const cacheKey = `tasks:stats:${userId}`;
const cached = await redis.get(cacheKey);

if (cached) {
  return JSON.parse(cached);
}

const stats = await Task.aggregate([...]);
await redis.setex(cacheKey, 300, JSON.stringify(stats)); // 5 min cache

return stats;
```

**Invalidation Strategy:**
- Invalidate on task create/update/delete
- Use cache tags for bulk invalidation
- Implement cache warming for frequently accessed data

### 6. Role-Based Access Control (RBAC)

**Current Implementation:**
- Basic role field in User model (`user`, `admin`)
- Authorization middleware ready for extension

**Enhanced RBAC:**
```javascript
// Permission-based roles
const roles = {
  admin: ['create', 'read', 'update', 'delete', 'manage_users'],
  manager: ['create', 'read', 'update', 'delete', 'view_reports'],
  user: ['create', 'read', 'update', 'delete'] // own resources only
};

// Middleware
const authorize = (...permissions) => {
  return (req, res, next) => {
    const userPermissions = roles[req.user.role];
    const hasPermission = permissions.every(p => 
      userPermissions.includes(p)
    );
    
    if (!hasPermission) {
      return res.status(403).json({ 
        message: 'Insufficient permissions' 
      });
    }
    next();
  };
};
```

## 🔒 Security Best Practices

1. **Password Security**
   - bcrypt with salt rounds of 12
   - Password complexity requirements

2. **JWT Security**
   - Short-lived access tokens
   - HttpOnly cookies for tokens
   - Token refresh mechanism

3. **Input Validation**
   - express-validator for all inputs
   - Mongoose schema validation
   - XSS prevention

4. **CORS Configuration**
   - Whitelist allowed origins
   - Credentials mode enabled

5. **Rate Limiting** (to implement)
   - API rate limiting per user/IP
   - Login attempt limiting

## 📝 License

MIT License

## 👤 Author

Built as a Full-Stack Developer Assignment
