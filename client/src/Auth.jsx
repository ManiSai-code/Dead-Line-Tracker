import React, { useState } from 'react';

const Auth = ({ onLoginSuccess, isDarkMode }) => { // 1. Added isDarkMode prop
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ 
    username: '', 
    password: '',
    email: '',
    phoneNumber: '',
    gender: '' 
  });

  // Dynamic Theme Colors
  const theme = {
    bg: isDarkMode ? '#0F172A' : '#f0f2f5',
    card: isDarkMode ? '#1E293B' : 'white',
    text: isDarkMode ? '#F8FAFC' : '#1a1a1b',
    subText: isDarkMode ? '#94A3B8' : '#666',
    inputBg: isDarkMode ? '#334155' : '#F8FAFC',
    inputBorder: isDarkMode ? '#475569' : '#ddd',
    inputColor: isDarkMode ? 'white' : 'black',
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? '/login' : '/signup';
    
    try {
      const response = await fetch(`http://localhost:8080/api/auth${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const userData = await response.json(); 
        if (!isLogin) {
          alert("Signup successful! Please login.");
          setIsLogin(true);
        } else {
          onLoginSuccess(userData); 
        }
      } else {
        const errorText = await response.text();
        alert(errorText || "Authentication failed");
      }
    } catch (error) {
      console.error("Auth error:", error);
      alert("Backend is not running!");
    }
  };

  // Dynamic Style Objects
  const containerStyle = { 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    minHeight: '100vh', 
    width: '100vw', 
    backgroundColor: theme.bg,
    transition: '0.3s'
  };

  const cardStyle = { 
    width: '100%', 
    maxWidth: '450px', 
    padding: '40px 20px', 
    backgroundColor: theme.card, 
    borderRadius: '12px', 
    boxShadow: isDarkMode ? 'none' : '0 4px 12px rgba(0,0,0,0.1)', 
    textAlign: 'center',
    transition: '0.3s'
  };

  const inputStyle = { 
    padding: '12px', 
    borderRadius: '6px', 
    border: `1px solid ${theme.inputBorder}`, 
    fontSize: '16px',
    backgroundColor: theme.inputBg,
    color: theme.inputColor,
    outline: 'none'
  };

  const buttonStyle = { 
    padding: '12px', 
    borderRadius: '6px', 
    border: 'none', 
    backgroundColor: '#6366F1', // Using your Dashboard Purple
    color: 'white', 
    fontSize: '16px', 
    fontWeight: 'bold', 
    cursor: 'pointer', 
    marginTop: '10px' 
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={{ color: theme.text, marginBottom: '10px', marginTop: '0px' }}>
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h1>
        <p style={{ color: theme.subText, marginBottom: '30px' }}>
          {isLogin ? 'Please login to manage your deadlines' : 'Sign up to start tracking tasks'}
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input 
            type="text" 
            placeholder="Username" 
            required 
            value={formData.username}
            onChange={(e) => setFormData({...formData, username: e.target.value})}
            style={inputStyle}
          />
          <input 
            type="password" 
            placeholder="Password" 
            required 
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            style={inputStyle}
          />

          {!isLogin && (
            <>
              <input 
                type="email" 
                placeholder="Email Address" 
                required 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                style={inputStyle}
              />
              <input 
                type="text" 
                placeholder="Phone Number" 
                required 
                value={formData.phoneNumber}
                onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                style={inputStyle}
              />
              <select 
                required
                value={formData.gender}
                onChange={(e) => setFormData({...formData, gender: e.target.value})}
                style={{...inputStyle, cursor: 'pointer'}}
              >
                <option value="" style={{color: 'black'}}>Select Gender</option>
                <option value="Male" style={{color: 'black'}}>Male</option>
                <option value="Female" style={{color: 'black'}}>Female</option>
                <option value="Other" style={{color: 'black'}}>Other</option>
              </select>
            </>
          )}

          <button type="submit" style={buttonStyle}>
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <p style={{ marginTop: '20px', fontSize: '14px', color: theme.subText }}>
          {isLogin ? "New user? " : "Already have an account? "}
          <span 
            onClick={() => setIsLogin(!isLogin)}
            style={{ color: '#6366F1', cursor: 'pointer', fontWeight: 'bold' }}
          >
            {isLogin ? "Create an account" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Auth;