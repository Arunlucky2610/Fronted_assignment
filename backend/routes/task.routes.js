/**
 * Task Routes
 * 
 * Handles CRUD operations for tasks.
 */

const express = require('express');
const router = express.Router();

const {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
  getTaskStats
} = require('../controllers/task.controller');

const { protect } = require('../middleware/auth');
const {
  createTaskValidation,
  updateTaskValidation,
  taskIdValidation
} = require('../middleware/validation');

// All routes are protected
router.use(protect);

// Stats route (must be before :id route)
router.get('/stats', getTaskStats);

// CRUD routes
router.route('/')
  .get(getTasks)
  .post(createTaskValidation, createTask);

router.route('/:id')
  .get(taskIdValidation, getTask)
  .put(updateTaskValidation, updateTask)
  .delete(taskIdValidation, deleteTask);

module.exports = router;
