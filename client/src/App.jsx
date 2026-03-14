import { useEffect, useState } from 'react'
import Settings from './Settings';
import Auth from './Auth';
import LiveTimer from './DeadlineCard';
import { Routes, Route, Link ,useNavigate} from "react-router-dom";
//import './index.css'; 
//import './App.css'; // If you have specific styles here too
import DeadlineCard from './DeadlineCard';
function App() {
  // 1. STATE VARIABLES
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
  const savedUser = localStorage.getItem("userData");
  return savedUser ? JSON.parse(savedUser) : null;
});
  const [deadlines, setDeadlines] = useState([]);
  const [task, setTask] = useState("");
  
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [searchTerm, setSearchTerm] = useState(""); 
  const [status, setStatus] = useState("Connecting...");
  const [isDarkMode, setIsDarkMode] = useState(() => {
  return localStorage.getItem('app-theme') === 'dark';
});
  // App.jsx or EditProfile.js
const [editName, setEditName] = useState(user?.username || "");
const [editEmail, setEditEmail] = useState(user?.email || "");
const [editPhone, setEditPhone] = useState(user?.phoneNumber || "");
const [editGender, setEditGender] = useState(user?.gender || "");
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
  return localStorage.getItem("isLoggedIn") === "true";
});
  const totalTasks = deadlines.length;
const completedCount = deadlines.filter(task => task.completed).length;
const progressPercentage = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;
  // 2. DATE HELPER
  const today = new Date().toISOString().split('T')[0];
  //const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  // 3. BACKEND ACTIONS
  const themeStyles = {
    backgroundColor: isDarkMode ? '#0F172A' : '#F8FAFC',
    color: isDarkMode ? '#F8FAFC' : '#1E293B',
    minHeight: '100vh', // Ensure it covers the whole screen
    width: '100vw',
    transition: 'background-color 0.3s ease'
  };
  const fetchDeadlines = () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    fetch(`http://localhost:8080/api/deadlines?userId=${userId}`)
      .then(res => res.json())
      .then(data => {
        setDeadlines(data);
        setStatus("Backend Connected");
      })
      .catch(() => setStatus("Backend Not Running"));
  };
  useEffect(() => {
  // This targets the literal <body> tag of your HTML
  if (isDarkMode) {
    document.body.style.backgroundColor = '#0F172A';
    document.body.style.color = '#F8FAFC';
  } else {
    document.body.style.backgroundColor = '#F8FAFC';
    document.body.style.color = '#1E293B';
  }
}, [isDarkMode]);
  useEffect(() => {
  localStorage.setItem('app-theme', isDarkMode ? 'dark' : 'light');
}, [isDarkMode]);
  useEffect(() => {
    if (isLoggedIn) {
      fetchDeadlines();
    }
  }, [isLoggedIn]);
 useEffect(() => {
  if (user) {
    setEditName(user.username || "");
    setEditEmail(user.email || "");
    setEditPhone(user.phoneNumber || "");
    setEditGender(user.gender || "");
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [user?.id]);
// In App.jsx
if (!isLoggedIn) {
  return <Auth isDarkMode={isDarkMode} onLoginSuccess={(userData) => { // 2. Pass isDarkMode here
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userId", userData.id);
      localStorage.setItem("userData", JSON.stringify(userData));
      setUser(userData);
      setIsLoggedIn(true);
      setIsDarkMode(userData.darkMode);
      localStorage.setItem("app-theme", userData.darkMode ? 'dark' : 'light');
  }} />;
}
// This runs as soon as the component opens
// ✅ CORRECT
 // Only runs when 'user' changes // The [user] dependency means: "Run this whenever user data is available"
const handleUpdateProfile = () => {
  // Use the ID from the user state or fallback to localStorage if state is flickering
  const currentId = user?.id || JSON.parse(localStorage.getItem("userData"))?.id;

  if (!currentId) {
    alert("User ID not found. Please try logging out and back in.");
    return;
  }

  const updatedData = {
    username: editName,
    email: editEmail,
    phoneNumber: editPhone,
    gender: editGender
  };

  console.log("Sending update for ID:", currentId, updatedData);

  fetch(`http://localhost:8080/api/auth/update/${currentId}`, {
    method: "PUT",
    headers: { 
      "Content-Type": "application/json",
      "Accept": "application/json" 
    },
    body: JSON.stringify(updatedData)
  })
  .then(res => {
    console.log("Response status:", res.status);
    if (!res.ok) {
      return res.text().then(text => { throw new Error(text || "Server error") });
    }
    return res.json();
  })
  .then(data => {
    // This updates the UI globally (including the name in the top-right corner)
    setUser(data);
    // This makes sure the data survives a page refresh
    localStorage.setItem("userData", JSON.stringify(data));
    
    alert("Profile Updated Successfully!");
    navigate("/profile");
  })
  .catch(err => {
    console.error("Fetch error details:", err);
    alert("Update failed: " + err.message);
  });
};


  const handleDelete = (id) => {
    fetch(`http://localhost:8080/api/deadlines/${id}`, {
      method: "DELETE",
    })
    .then(() => {
      setDeadlines(deadlines.filter(d => d.id !== id));
    })
    .catch(err => console.error("Delete failed:", err));
  };

  const toggleComplete = (item) => {
    const userId = localStorage.getItem("userId");
    const updatedItem = { ...item, completed: !item.completed };
    
    fetch(`http://localhost:8080/api/deadlines?userId=${userId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedItem)
    }).then(() => fetchDeadlines());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId");
    const newDeadline = { 
      task, 
      dueDate, 
      priority, 
      completed: false 
    }; 

    fetch(`http://localhost:8080/api/deadlines?userId=${userId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newDeadline)
    })
    .then(() => {
      setTask(""); 
      setDueDate(""); 
      setPriority("Medium"); 
      fetchDeadlines(); 
    });
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userId");
    setIsLoggedIn(false);
    localStorage.clear();
    navigate("/");
    localStorage.removeItem("userData");
    localStorage.removeItem("app-theme");
    localStorage.clear();
  };

  // 4. FILTER & SORT LOGIC
  const filteredDeadlines = deadlines.filter(d => 
    (d.task || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedDeadlines = [...filteredDeadlines].sort((a, b) => {
    if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
    }
    const aOverdue = a.dueDate < today && !a.completed;
    const bOverdue = b.dueDate < today && !b.completed;
    if (aOverdue && !bOverdue) return -1;
    if (!aOverdue && bOverdue) return 1;

    const priorityOrder = { "High": 1, "Medium": 2, "Low": 3 };
    return (priorityOrder[a.priority] || 2) - (priorityOrder[b.priority] || 2);
  });
  const labelStyle = { 
  fontSize: '11px', 
  fontWeight: '800', 
  color: '#64748B', 
  marginBottom: '5px', 
  display: 'block',
  letterSpacing: '0.5px'
};

const inputStyle = { 
  width: '100%', 
  padding: '12px 15px', 
  borderRadius: '10px', 
  border: '1px solid #E2E8F0', 
  fontSize: '14px', 
  outline: 'none', 
  backgroundColor: '#F8FAFC',
  boxSizing: 'border-box' // Essential for padding
};


  // 5. USER INTERFACE (JSX)
  return (
    <div style={themeStyles}>
    
    <Routes>
      
      <Route path="/profile" element={
      <div style={{ 
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', 
        minHeight: '100vh', width: '100vw', backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',color: isDarkMode ? '#F8FAFC' : '#1E293B' 
      }}>
        <div style={{ 
  padding: '40px', 
  position: 'relative', // This is essential to keep the button inside the card
  backgroundColor: 'white',
  borderRadius: '24px',
  maxWidth: '500px',
  margin: '40px auto'
}}>

  {/* Top-Left Back Button */}
  <button 
    onClick={() => navigate("/")}
    style={{ 
      position: 'absolute',
      top: '20px',
      left: '20px',
      background: 'none',
      border: 'none',
      color: '#64748B',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '5px',
      transition: 'color 0.2s'
    }}
    onMouseOver={(e) => e.target.style.color = '#6366F1'}
    onMouseOut={(e) => e.target.style.color = '#64748B'}
  >
    <span style={{ fontSize: '18px' }}>←</span> Dashboard
  </button>
          <h2 style={{ 
  fontSize: '28px', 
  fontWeight: '800', 
  letterSpacing: '-0.5px', 
  color: '#0F172A',
  marginBottom: '10px' 
}}>
  Welcome {user?.username}
</h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <Link to="/edit-profile" style={hubLinkStyle}>📝 Edit Profile</Link>
            <Link to="/settings" style={hubLinkStyle}>⚙️ Settings</Link>
            <button onClick={logout} style={{ ...hubLinkStyle, color: '#F43F5E', border: 'none', background: 'none',cursor: 'pointer', textAlign: 'center' }}>
              Logout
            </button>
          </div>
        </div>
      </div>
    } />
    <Route 
      path="/settings" 
      element={<Settings isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} user={user} setUser={setUser} />} 
    />
    <Route path="/edit-profile" element={
  <div style={{ 
    minHeight: '100vh', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: isDarkMode ? '#1E293B' : '#F8FAFC',
    position: 'relative' 
  }}>
    
    {/* 1. Back Button in the top left */}
    <button 
      onClick={() => navigate("/profile")}
      style={{ position: 'absolute', top: '20px', left: '20px', border: 'none', backgroundColor: isDarkMode ? '#1E293B' : '#F8FAFC', cursor: 'pointer', color: isDarkMode ? '#F8FAFC' : '#1E293B', fontWeight: 'bold' }}
    >
      ← Back to Hub
    </button>

    {/* 2. The Main Form Card */}
    <div style={{ 
      padding: '30px', 
      backgroundColor: isDarkMode ? '#1E293B' : '#F8FAFC', 
      borderRadius: '20px', 
      maxWidth: '400px', 
      width: '90%', 
      boxShadow: '0 10px 25px rgba(0,0,0,0.05)' 
    }}>
      <h2 style={{ marginBottom: '20px', color: '#1E293B', textAlign: 'center' }}>Edit Profile</h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        {/* Username Field */}
        <div>
          <label style={labelStyle}>USERNAME</label>
          <input 
            type="text" 
            value={editName} 
            onChange={(e) => setEditName(e.target.value)} 
            style={inputStyle} 
          />
        </div>

        {/* Email Field */}
        <div>
          <label style={labelStyle}>EMAIL (FOR ALERTS)</label>
          <input 
            type="email" 
            value={editEmail} 
            onChange={(e) => setEditEmail(e.target.value)} 
            placeholder="Enter email"
            style={inputStyle} 
          />
        </div>

        {/* Phone Field */}
        <div>
          <label style={labelStyle}>PHONE NUMBER</label>
          <input 
            type="text" 
            value={editPhone} 
            onChange={(e) => setEditPhone(e.target.value)} 
            placeholder="Enter phone number"
            style={inputStyle} 
          />
        </div>

        {/* Gender Field */}
        <div>
          <label style={labelStyle}>GENDER</label>
          <select 
            value={editGender} 
            onChange={(e) => setEditGender(e.target.value)} 
            style={inputStyle}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Save Button */}
        <button 
          onClick={handleUpdateProfile}
          style={{
            padding: '14px',
            backgroundColor: '#6366F1',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontWeight: 'bold',
            cursor: 'pointer',
            marginTop: '10px',
            transition: 'opacity 0.2s'
          }}
          onMouseOver={(e) => e.target.style.opacity = '0.9'}
          onMouseOut={(e) => e.target.style.opacity = '1'}
        >
          Save All Changes
        </button>
      </div>
    </div>
  </div>
} />
      <Route path="/" element={
    <div style={{ 
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', 
      minHeight: '100vh', width: '100vw', backgroundColor: isDarkMode ? '#0F172A' : '#F8FAFC', 
      fontFamily: '"Inter", "Segoe UI", sans-serif', color: isDarkMode ? '#F8FAFC' : '#1E293B'
    }}>
      
      <div style={{ 
        width: '90%', maxWidth: '480px', padding: '30px', paddingTop: '80px', 
        backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF', borderRadius: '24px', boxShadow: '0 10px 40px rgba(0,0,0,0.04)',
        position: 'relative' ,
        color: isDarkMode ? '#F8FAFC' : '#1E293B'
      }}>
        
        {/* Search Bar */}
        <input 
          type="text" placeholder="🔍 Search..." value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ 
            position: 'absolute', top: '25px', left: '25px', width: '130px',
            padding: '10px 15px', borderRadius: '15px', border: '1px solid #E2E8F0', 
            fontSize: '13px', outline: 'none', backgroundColor: isDarkMode ? '#1E293B' : '#F8FAFC'
          }}
        />

       <div style={{ 
    position: 'absolute', top: '25px', right: '25px', 
    display: 'flex', alignItems: 'center', gap: '10px' 
  }}>
    <Link 
      to="/profile" 
      style={{ 
        textDecoration: 'none', color: '#6366F1', fontWeight: 'bold', fontSize: '14px'
      }}
      onMouseOver={(e) => e.target.style.color = '  #8313eb'}
  onMouseOut={(e) => e.target.style.color = '#6366F1'}
    >
      {user?.username}
    
  
</Link>
  
  
</div>

        <h1 style={{ 
  fontSize: '26px', 
  fontWeight: '800', 
  marginBottom: '8px', 
  textAlign: 'center', 
  color: isDarkMode ? '#F8FAFC' : '#1E293B' // Only one color key allowed!
}}>
  Deadline Tracker
</h1>
        
        <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '30px', textAlign: 'center' }}>
          Status: <span style={{ fontWeight: '700', color: status === "Backend Connected" ? "#10B981" : "#F43F5E" }}>
            ● {status}
          </span>
        </p>
<div style={{ margin: '20px 0', padding: '15px', backgroundColor: isDarkMode ? '#1E293B' : '#F8FAFC', borderRadius: '12px' }}>
  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
    <span style={{ fontSize: '14px', fontWeight: '600', color: '#475569' }}>
      Overall Progress
    </span>
    <span style={{ fontSize: '14px', fontWeight: '700', color: '#4f46e5' }}>
      {progressPercentage}%
    </span>
  </div>

  {/* Progress Bar Container */}
  <div style={{ 
    width: '100%', 
    height: '12px', 
    backgroundColor: '#e2e8f0', 
    borderRadius: '10px', 
    overflow: 'hidden' 
  }}>
    {/* Animated Fill */}
    <div style={{ 
      width: `${progressPercentage}%`, 
      height: '100%', 
      backgroundColor: '#4f46e5', 
      transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)', // Smooth "sliding" effect
      boxShadow: '0 0 8px rgba(79, 70, 229, 0.4)' 
    }} />
  </div>
  
  <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '8px', textAlign: 'center' }}>
    {completedCount} of {totalTasks} tasks completed
  </p>
</div>
        {/* Stats Dashboard */}
        <div style={{ 
          display: 'flex', justifyContent: 'space-around', backgroundColor: isDarkMode ? '#1E293B' : '#F8FAFC', 
          padding: '20px', borderRadius: '20px', marginBottom: '30px', border: '1px solid #F1F5F9'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '20px', fontWeight: '800', color: '#6366F1' }}>{deadlines.length}</div>
            <div style={{ fontSize: '11px', fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase' }}>Total</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '20px', fontWeight: '800', color: '#F43F5E' }}>
              {deadlines.filter(d => d.dueDate < today && !d.completed).length}
            </div>
            <div style={{ fontSize: '11px', fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase' }}>Overdue</div>
          </div>
        </div>
        
        {/* Add Task Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input 
            type="text" placeholder="What is the task?" value={task}
            onChange={(e) => setTask(e.target.value)} required 
            style={{ backgroundColor: isDarkMode ? '#1E293B' : '#F8FAFC',padding: '15px', borderRadius: '15px', border: '1px solid #E2E8F0', fontSize: '15px', outline: 'none' }}
          />
          <div style={{ display: 'flex', gap: '10px' }}>
            <input 
              type="date" value={dueDate} min={today} onChange={(e) => setDueDate(e.target.value)} required
              style={{ backgroundColor: isDarkMode ? '#1E293B' : '#F8FAFC',flex: 2, padding: '13px', borderRadius: '15px', border: '1px solid #E2E8F0', outline: 'none' }}
            />
            <select 
              value={priority} onChange={(e) => setPriority(e.target.value)}
              style={{ flex: 1, padding: '13px', borderRadius: '15px', border: '1px solid #E2E8F0', backgroundColor: isDarkMode ? '#1E293B' : '#F8FAFC' }}
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <button type="submit" style={{ 
            padding: '16px', borderRadius: '15px', border: 'none', backgroundColor: '#6366F1', 
            color: 'white', fontSize: '16px', fontWeight: '700', cursor: 'pointer', marginTop: '10px'
          }}>
            Add Deadline
          </button>
        </form>

        {/* Task List */}
        
        <div style={{ marginTop: '35px' }}>
          <h3 style={{ fontSize: '12px', fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', marginBottom: '15px', letterSpacing: '1px' }}>
            Upcoming Tasks
          </h3>
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {sortedDeadlines.map((d) => {
              const isOverdue = d.dueDate < today && !d.completed;
              return (
                <div key={d.id} style={{ 
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
                  padding: '16px', marginBottom: '12px', backgroundColor: isDarkMode ? '#1E293B' : '#F8FAFC', 
                  borderRadius: '18px', border: '1px solid #F1F5F9'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <input 
                      type="checkbox" checked={d.completed || false} onChange={() => toggleComplete(d)}
                      style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#6366F1' }}
                    />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ 
                          fontSize: '15px', fontWeight: '600', color: d.completed ? '#94A3B8' : (isOverdue ? '#F43F5E' : (isDarkMode ? '#F8FAFC' : '#1E293B')),
                          textDecoration: d.completed ? 'line-through' : 'none'
                        }}>
                          {d.task} {isOverdue && "⚠️"}
                        </span>
                        {!d.completed && (
                           <span style={{ 
                            fontSize: '10px', fontWeight: '800', padding: '2px 8px', borderRadius: '6px', color: 'white',
                            backgroundColor: d.priority === 'High' ? '#F43F5E' : d.priority === 'Medium' ? '#F59E0B' : '#10B981'
                          }}>
                            {d.priority}
                          </span>
                        )}
                      </div>
                      <div style={{ 
  fontSize: '12px', 
  color: isOverdue ? '#F43F5E' : '#94A3B8', // Turn date red if overdue
  fontWeight: isOverdue ? '700' : '400',
  marginTop: '2px' 
}}>
  <div style={{ 
  fontSize: '12px', 
  color: isOverdue ? '#F43F5E' : '#94A3B8', 
  fontWeight: isOverdue ? '700' : '400',
  marginTop: '2px',
  display: 'flex',       // Align date and timer side-by-side
  gap: '8px' 
}}>
  <span>Due: {d.dueDate}</span> 
  
  {!d.completed && (
    <span style={{ fontStyle: 'italic', opacity: 0.8 }}>
      (<LiveTimer dueDate={d.dueDate} completed={d.completed} />)
    </span>
  )}
  
  {isOverdue && !d.completed && <span>(LATE)</span>}
</div>
</div>
                    </div>
                  </div>
                  <button onClick={() => handleDelete(d.id)} style={{ color: '#FDA4AF', border: 'none', background: 'none', cursor: 'pointer', fontSize: '18px' }}>
                    ✕
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
} /> 







</Routes> 
</div>

);
}
const hubLinkStyle = { 
  padding: '15px', 
  textDecoration: 'none', 
  color: '#1E293B', 
  fontWeight: '600', 
  backgroundColor: '#F1F5F9', 
  borderRadius: '12px',
  display: 'block',
  textAlign: 'center'
};
export default App;