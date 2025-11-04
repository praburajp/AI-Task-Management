import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { LogOut, LayoutDashboard, CheckSquare, User } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <CheckSquare size={28} />
          <span>AI TaskManager</span>
        </div>

        <div className="navbar-links">
          <Link 
            to="/dashboard" 
            className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>
          <Link 
            to="/tasks" 
            className={`nav-link ${isActive('/tasks') ? 'active' : ''}`}
          >
            <CheckSquare size={20} />
            <span>Tasks</span>
          </Link>
        </div>

        <div className="navbar-user">
          <div className="user-info">
            <User size={20} />
            <span>{user?.name}</span>
          </div>
          <button onClick={handleLogout} className="btn-logout">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;