const express = require('express');
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  getDashboardStats
} = require('../controllers/task.controller');
const { protect } = require('../middleware/auth.middleware');
const { validateTask } = require('../middleware/validation.middleware');

const router = express.Router();

router.use(protect);

router.get('/stats/dashboard', getDashboardStats);
router.route('/').get(getTasks).post(validateTask, createTask);
router.route('/:id').get(getTask).put(updateTask).delete(deleteTask);

module.exports = router;