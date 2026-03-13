import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Add 'user' here inside the props destructuring
const Settings = ({ isDarkMode, setIsDarkMode, user }) => {
  const navigate = useNavigate();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  

  // Theme-based Colors
  const theme = {
    bg: isDarkMode ? '#1E293B' : '#FFFFFF',
    text: isDarkMode ? '#F8FAFC' : '#1E293B',
    subText: isDarkMode ? '#94A3B8' : '#64748B',
    cardBorder: isDarkMode ? '#334155' : '#F1F5F9',
  };

  const pageWrapperStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    height: '100vh',
    padding: '40px 20px',
    backgroundColor: isDarkMode ? '#0F172A' : '#F8FAFC', // Global background shift
    transition: '0.3s'
  };

  const cardStyle = {
    width: '100%',
    maxWidth: '500px',
    backgroundColor: theme.bg,
    borderRadius: '18px',
    padding: '24px',
    border: `1px solid ${theme.cardBorder}`,
    boxShadow: isDarkMode ? 'none' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    transition: '0.3s'
  };

  const rowStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '15px 0',
    borderBottom: `1px solid ${theme.cardBorder}`
  };

  const getToggleStyle = (active) => ({
    width: '50px',
    height: '26px',
    borderRadius: '13px',
    backgroundColor: active ? '#6366F1' : '#CBD5E1',
    border: 'none',
    cursor: 'pointer',
    position: 'relative',
    transition: '0.3s'
  });

  const getKnobStyle = (active) => ({
    width: '20px',
    height: '20px',
    backgroundColor: 'white',
    borderRadius: '50%',
    position: 'absolute',
    top: '3px',
    left: active ? '27px' : '3px',
    transition: '0.3s'
  });
const handleThemeToggle = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    
    if (user?.id) {
      fetch(`http://localhost:8080/api/auth/update-theme/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMode)
      });
    }
  };
  return (
    <div style={pageWrapperStyle}>
      <div style={cardStyle}>
        <button 
          onClick={() => navigate(-1)} 
          style={{ background: 'none', border: 'none', color: '#6366F1', cursor: 'pointer', fontWeight: '600', marginBottom: '20px' }}
        >
          ← Back
        </button>

        <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '10px', color: theme.text }}>Settings</h2>
        
        {/* Row 1: Notifications */}
        <div style={rowStyle}>
          <div>
            <p style={{ margin: 0, fontWeight: '600', color: theme.text }}>Email Notifications</p>
            <p style={{ margin: 0, fontSize: '12px', color: theme.subText }}>You will recieve notifications if this is turned on</p>
          </div>
          <button onClick={() => setNotificationsEnabled(!notificationsEnabled)} style={getToggleStyle(notificationsEnabled)}>
            <div style={getKnobStyle(notificationsEnabled)} />
          </button>
        </div>

        {/* Row 2: Theme Toggle */}
        <div style={{ ...rowStyle, borderBottom: 'none' }}>
          <div>
            <p style={{ margin: 0, fontWeight: '600', color: theme.text }}>Dark Mode</p>
            <p style={{ margin: 0, fontSize: '12px', color: theme.subText }}>Switch between light and dark themes</p>
          </div>
          <button 
      onClick={handleThemeToggle} // 3. CONNECT THE BRAIN HERE
      style={getToggleStyle(isDarkMode)}
    >
      <div style={getKnobStyle(isDarkMode)} />
    </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;