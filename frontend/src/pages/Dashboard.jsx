import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTasks, getStats } from '../store/slices/taskSlice';
import { 
  BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer 
} from 'recharts';
import { 
  CheckCircle, Clock, AlertCircle, 
  TrendingUp, ListTodo 
} from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { stats, tasks } = useSelector(state => state.tasks);

  useEffect(() => {
    dispatch(getTasks());
    dispatch(getStats());
  }, [dispatch]);

  const COLORS = {
    low: '#10b981',
    medium: '#f59e0b',
    high: '#ef4444',
    urgent: '#dc2626',
    pending: '#f59e0b',
    'in-progress': '#3b82f6',
    completed: '#10b981'
  };

  const priorityData = stats?.priorityBreakdown?.map(item => ({
    name: item._id.charAt(0).toUpperCase() + item._id.slice(1),
    value: item.count,
    color: COLORS[item._id]
  })) || [];

  const statusData = stats?.statusBreakdown?.map(item => ({
    name: item._id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    value: item.count,
    color: COLORS[item._id]
  })) || [];

  const statsCards = [
    {
      title: 'Total Tasks',
      value: stats?.stats?.total || 0,
      icon: ListTodo,
      color: '#667eea',
      bgColor: '#eef2ff'
    },
    {
      title: 'Completed',
      value: stats?.stats?.completed || 0,
      icon: CheckCircle,
      color: '#10b981',
      bgColor: '#ecfdf5'
    },
    {
      title: 'In Progress',
      value: stats?.stats?.inProgress || 0,
      icon: Clock,
      color: '#3b82f6',
      bgColor: '#eff6ff'
    },
    {
      title: 'High Priority',
      value: stats?.stats?.highPriority || 0,
      icon: AlertCircle,
      color: '#ef4444',
      bgColor: '#fef2f2'
    }
  ];

  const recentTasks = tasks.slice(0, 5);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard Overview</h1>
        <p>Welcome back! Here's what's happening with your tasks today.</p>
      </div>

      <div className="stats-grid">
        {statsCards.map((stat, index) => (
          <div key={index} className="stat-card" style={{ borderLeftColor: stat.color }}>
            <div className="stat-icon" style={{ backgroundColor: stat.bgColor, color: stat.color }}>
              <stat.icon size={24} />
            </div>
            <div className="stat-content">
              <p className="stat-label">{stat.title}</p>
              <h3 className="stat-value">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3>Task Priority Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={priorityData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {priorityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Task Status Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={statusData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#667eea">
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="recent-tasks-section">
        <h3>Recent Tasks</h3>
        <div className="tasks-list">
          {recentTasks.length > 0 ? (
            recentTasks.map(task => (
              <div key={task._id} className="task-item">
                <div className="task-info">
                  <h4>{task.title}</h4>
                  <p>{task.description}</p>
                </div>
                <div className="task-meta">
                  <span className={`priority-badge ${task.priority}`}>
                    {task.priority}
                  </span>
                  <span className={`status-badge ${task.status}`}>
                    {task.status.replace('-', ' ')}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="no-tasks">No tasks yet. Create your first task!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;