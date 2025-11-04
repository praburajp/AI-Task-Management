const Task = require('../models/task.model');
const { asyncHandler } = require('../utils/asyncHandler');
const { AppError } = require('../utils/appError');
const { analyzeTaskWithAI } = require('../services/openai.service');

// @desc    Get all tasks for user
// @route   GET /api/tasks
exports.getTasks = asyncHandler(async (req, res) => {
  const { status, priority, sort } = req.query;
  
  const filter = { userId: req.user.id };
  
  if (status) filter.status = status;
  if (priority) filter.priority = priority;

  let query = Task.find(filter);

  if (sort) {
    const sortFields = sort.split(',').join(' ');
    query = query.sort(sortFields);
  } else {
    query = query.sort('-createdAt');
  }

  const tasks = await query;

  res.status(200).json({
    success: true,
    count: tasks.length,
    tasks
  });
});

// @desc    Get single task
// @route   GET /api/tasks/:id
exports.getTask = asyncHandler(async (req, res) => {
  const task = await Task.findOne({ 
    _id: req.params.id, 
    userId: req.user.id 
  });

  if (!task) {
    throw new AppError('Task not found', 404);
  }

  res.status(200).json({
    success: true,
    task
  });
});

// @desc    Create task
// @route   POST /api/tasks
exports.createTask = asyncHandler(async (req, res) => {
  const { title, description, priority, status, dueDate } = req.body;

  const task = await Task.create({
    title,
    description,
    priority,
    status,
    dueDate,
    userId: req.user.id
  });

  if (process.env.OPENAI_API_KEY) {
    try {
      const aiSuggestion = await analyzeTaskWithAI(task);
      task.aiSuggestion = aiSuggestion;
      await task.save();
    } catch (error) {
      console.error('AI analysis failed:', error.message);
    }
  }

  res.status(201).json({
    success: true,
    task
  });
});

// @desc    Update task
// @route   PUT /api/tasks/:id
exports.updateTask = asyncHandler(async (req, res) => {
  let task = await Task.findOne({ 
    _id: req.params.id, 
    userId: req.user.id 
  });

  if (!task) {
    throw new AppError('Task not found', 404);
  }

  const allowedUpdates = ['title', 'description', 'priority', 'status', 'dueDate'];
  const updates = Object.keys(req.body)
    .filter(key => allowedUpdates.includes(key))
    .reduce((obj, key) => {
      obj[key] = req.body[key];
      return obj;
    }, {});

  task = await Task.findByIdAndUpdate(
    req.params.id,
    updates,
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    task
  });
});

// @desc    Delete task
// @route   DELETE /api/tasks/:id
exports.deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findOne({ 
    _id: req.params.id, 
    userId: req.user.id 
  });

  if (!task) {
    throw new AppError('Task not found', 404);
  }

  await task.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Task deleted successfully'
  });
});

// @desc    Get dashboard stats
// @route   GET /api/tasks/stats/dashboard
exports.getDashboardStats = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const stats = await Task.aggregate([
    { $match: { userId: userId } },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        completed: {
          $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
        },
        pending: {
          $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
        },
        inProgress: {
          $sum: { $cond: [{ $eq: ['$status', 'in-progress'] }, 1, 0] }
        },
        highPriority: {
          $sum: { $cond: [{ $in: ['$priority', ['high', 'urgent']] }, 1, 0] }
        }
      }
    }
  ]);

  const priorityBreakdown = await Task.aggregate([
    { $match: { userId: userId } },
    { $group: { _id: '$priority', count: { $sum: 1 } } }
  ]);

  const statusBreakdown = await Task.aggregate([
    { $match: { userId: userId } },
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);

  res.status(200).json({
    success: true,
    stats: stats[0] || {
      total: 0,
      completed: 0,
      pending: 0,
      inProgress: 0,
      highPriority: 0
    },
    priorityBreakdown,
    statusBreakdown
  });
});