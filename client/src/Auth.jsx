import React, { useState } from 'react';

const Auth = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  
  // 1. Updated state to include new fields
  const [formData, setFormData] = useState({ 
    username: '', 
    password: '',
    email: '',
    phoneNumber: '',
    gender: '' 
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const endpoint = isLogin ? '/login' : '/signup';
    
    try {
      const response = await fetch(`http://localhost:8080/api/auth${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // 2. This now sends ALL fields. Java will ignore extra ones during Login 
        // but use all of them during Signup!
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const userData = await response.json(); 
        if (!isLogin) {
          alert("Signup successful! Please login.");
          setIsLogin(true); // Switch to login view after signup
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

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={{ color: '#1a1a1b', marginBottom: '10px', marginTop: '0px' }}>
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h1>
        <p style={{ color: '#666', marginBottom: '30px' }}>
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

          {/* 3. Show extra fields only if NOT in login mode */}
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
                style={inputStyle}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </>
          )}

          <button type="submit" style={buttonStyle}>
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <p style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
          {isLogin ? "New user? " : "Already have an account? "}
          <span 
            onClick={() => setIsLogin(!isLogin)}
            style={{ color: '#007bff', cursor: 'pointer', fontWeight: 'bold' }}
          >
            {isLogin ? "Create an account" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
};

// Styles to keep the return clean
const containerStyle = { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', width: '100vw', backgroundColor: '#f0f2f5' };
const cardStyle = { width: '100%', maxWidth: '450px', padding: '40px 20px', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', textAlign: 'center' };
const inputStyle = { padding: '12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '16px' };
const buttonStyle = { padding: '12px', borderRadius: '6px', border: 'none', backgroundColor: '#007bff', color: 'white', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' };

export default Auth;