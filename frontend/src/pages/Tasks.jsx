
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTasks, createTask, updateTask, deleteTask } from '../store/slices/taskSlice';
import { toast } from 'react-toastify';
import { 
  Plus, Filter, X, Edit2, Trash2, 
  Calendar, AlertCircle, Sparkles 
} from 'lucide-react';
import { format } from 'date-fns';
import TaskModal from '../components/TaskModal';
import './Tasks.css';

const Tasks = () => {
  const dispatch = useDispatch();
  const { tasks, isLoading } = useSelector(state => state.tasks);
  
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    sort: '-createdAt'
  });
  
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    dispatch(getTasks(filters));
  }, [dispatch, filters]);

  const handleCreateTask = () => {
    setSelectedTask(null);
    setShowModal(true);
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setShowModal(true);
  };

  const handleDeleteTask = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await dispatch(deleteTask(id)).unwrap();
        toast.success('Task deleted successfully');
      } catch (error) {
        toast.error('Failed to delete task');
      }
    }
  };

  const handleSaveTask = async (taskData) => {
    try {
      if (selectedTask) {
        await dispatch(updateTask({ id: selectedTask._id, taskData })).unwrap();
        toast.success('Task updated successfully');
      } else {
        await dispatch(createTask(taskData)).unwrap();
        toast.success('Task created successfully');
      }
      setShowModal(false);
    } catch (error) {
      toast.error(error || 'Failed to save task');
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      priority: '',
      sort: '-createdAt'
    });
  };

  const activeFiltersCount = Object.values(filters).filter(v => v && v !== '-createdAt').length;

  const getPriorityColor = (priority) => {
    const colors = {
      low: '#10b981',
      medium: '#f59e0b',
      high: '#ef4444',
      urgent: '#dc2626'
    };
    return colors[priority] || '#718096';
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#f59e0b',
      'in-progress': '#3b82f6',
      completed: '#10b981'
    };
    return colors[status] || '#718096';
  };

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date() && dueDate;
  };

  return (
    <div className="tasks-page">
      <div className="tasks-header">
        <div>
          <h1>My Tasks</h1>
          <p>Manage and track your tasks efficiently</p>
        </div>
        <div className="tasks-actions">
          <button 
            className="btn-filter"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={20} />
            Filters
            {activeFiltersCount > 0 && (
              <span className="filter-badge">{activeFiltersCount}</span>
            )}
          </button>
          <button className="btn btn-primary" onClick={handleCreateTask}>
            <Plus size={20} />
            New Task
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="filters-panel">
          <div className="filter-group">
            <label>Status</label>
            <select 
              value={filters.status} 
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="">All</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Priority</label>
            <select 
              value={filters.priority} 
              onChange={(e) => handleFilterChange('priority', e.target.value)}
            >
              <option value="">All</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Sort By</label>
            <select 
              value={filters.sort} 
              onChange={(e) => handleFilterChange('sort', e.target.value)}
            >
              <option value="-createdAt">Newest First</option>
              <option value="createdAt">Oldest First</option>
              <option value="dueDate">Due Date</option>
              <option value="-priority">Priority</option>
            </select>
          </div>

          {activeFiltersCount > 0 && (
            <button className="btn-clear-filters" onClick={clearFilters}>
              Clear Filters
            </button>
          )}
        </div>
      )}

      <div className="tasks-container">
        {isLoading ? (
          <div className="loading">Loading tasks...</div>
        ) : tasks.length === 0 ? (
          <div className="empty-state">
            <h3>No tasks found</h3>
            <p>Create your first task to get started</p>
            <button className="btn btn-primary" onClick={handleCreateTask}>
              <Plus size={20} />
              Create Task
            </button>
          </div>
        ) : (
          <div className="tasks-grid">
            {tasks.map(task => (
              <div key={task._id} className="task-card">
                <div className="task-card-header">
                  <div className="task-badges">
                    <span 
                      className="priority-badge"
                      style={{ 
                        backgroundColor: `${getPriorityColor(task.priority)}20`,
                        color: getPriorityColor(task.priority)
                      }}
                    >
                      {task.priority}
                    </span>
                    <span 
                      className="status-badge"
                      style={{ 
                        backgroundColor: `${getStatusColor(task.status)}20`,
                        color: getStatusColor(task.status)
                      }}
                    >
                      {task.status.replace('-', ' ')}
                    </span>
                  </div>
                  <div className="task-actions">
                    <button 
                      className="icon-btn"
                      onClick={() => handleEditTask(task)}
                      title="Edit task"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      className="icon-btn delete"
                      onClick={() => handleDeleteTask(task._id)}
                      title="Delete task"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <h3 className="task-title">{task.title}</h3>
                <p className="task-description">{task.description}</p>

                <div className="task-footer">
                  <div className={`task-due-date ${isOverdue(task.dueDate) ? 'overdue' : ''}`}>
                    <Calendar size={16} />
                    <span>{format(new Date(task.dueDate), 'MMM dd, yyyy')}</span>
                    {isOverdue(task.dueDate) && task.status !== 'completed' && (
                      <AlertCircle size={16} className="overdue-icon" />
                    )}
                  </div>
                </div>

                {task.aiSuggestion && (
                  <div className="ai-suggestion">
                    <Sparkles size={16} />
                    <p>{task.aiSuggestion}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <TaskModal
          task={selectedTask}
          onClose={() => setShowModal(false)}
          onSave={handleSaveTask}
        />
      )}
    </div>
  );
};

export default Tasks;