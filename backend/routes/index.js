/**
 * Routes Index
 * 
 * Centralized export for all routes
 */

const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const taskRoutes = require('./task.routes');

module.exports = {
  authRoutes,
  userRoutes,
  taskRoutes
};
