import React, { useState } from 'react';

const Auth = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Determine the correct backend endpoint
    const endpoint = isLogin ? '/login' : '/signup';
    
    try {
      const response = await fetch(`http://localhost:8080/api/auth${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password
        }),
      });

      if (response.ok) {
        const userData = await response.json(); 
        localStorage.setItem("userId", userData.id);
        
        // Change the alert to be dynamic
        alert(isLogin ? "Welcome back!" : "Account created successfully!"); 
        onLoginSuccess(); 
      } else {
        const errorMsg = await response.text();
        alert(errorMsg); 
      }
    } catch (error) {
      console.error("Auth error:", error);
      alert("Backend is not running! Please start your Spring Boot server.");
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh', 
      width: '100vw', 
      backgroundColor: '#f0f2f5',
      fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif'
    }}>
      
      <div style={{ 
        width: '100%', 
        maxWidth: '450px', 
        padding: '40px 20px', 
        backgroundColor: 'white', 
        borderRadius: '12px', 
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        textAlign: 'center'
      }}>
        
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
            style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '16px' }}
          />
          <input 
            type="password" 
            placeholder="Password" 
            required 
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '16px' }}
          />
          <button type="submit" style={{ 
            padding: '12px', 
            borderRadius: '6px', 
            border: 'none', 
            backgroundColor: '#007bff', 
            color: 'white', 
            fontSize: '16px', 
            fontWeight: 'bold', 
            cursor: 'pointer',
            marginTop: '10px'
          }}>
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

export default Auth;