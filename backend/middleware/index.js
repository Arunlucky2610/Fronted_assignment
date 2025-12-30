/**
 * Middleware Index
 * 
 * Centralized export for all middleware
 */

const { protect, authorize } = require('./auth');
const errorHandler = require('./errorHandler');
const {
  registerValidation,
  loginValidation,
  createTaskValidation,
  updateTaskValidation,
  taskIdValidation
} = require('./validation');

module.exports = {
  protect,
  authorize,
  errorHandler,
  registerValidation,
  loginValidation,
  createTaskValidation,
  updateTaskValidation,
  taskIdValidation
};
