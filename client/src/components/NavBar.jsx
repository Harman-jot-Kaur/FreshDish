import React from 'react';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

const NavBar = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef();

  const logout = () => {
    localStorage.removeItem('freshdishToken');
    setUser(null);
    navigate('/login');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="navbar">
      <div className="brand">
        <Link to="/menu" className="brand-link">
          <img src={logo} alt="FreshDish logo" className="brand-logo" />
        </Link>
      </div>
      <div className="links">
        <Link to="/menu">Menu</Link>
        <Link to="/cart">Cart</Link>
        <Link to="/track">Track</Link>
        {user ? (
          <>
            <Link to="/orders">My Orders</Link>
            {user.role === 'admin' && <Link to="/admin">Admin</Link>}
            {user.role === 'kitchen' && <Link to="/kitchen">Kitchen</Link>}
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
      {user && (
        <div className="user-actions" ref={profileRef}>
          <button
            type="button"
            className="user-label"
            onClick={() => setShowProfile((prev) => !prev)}
          >
            <span className="user-icon" aria-hidden="true"></span>
            {user.name}
          </button>
          {showProfile && (
            <div className="profile-dropdown">
              <div className="profile-card-icon" aria-hidden="true"></div>
              <div className="profile-card-text">
                <strong>{user.name}</strong>
                <span>{user.email}</span>
              </div>
            </div>
          )}
          <button className="link-button" onClick={logout}>Logout</button>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
