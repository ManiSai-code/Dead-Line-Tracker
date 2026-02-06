import { useEffect, useState } from 'react'
import Auth from './Auth';

function App() {
  // 1. STATE VARIABLES
  const [deadlines, setDeadlines] = useState([]);
  const [task, setTask] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [searchTerm, setSearchTerm] = useState(""); 
  const [status, setStatus] = useState("Connecting...");
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("isLoggedIn") === "true");

  // 2. DATE HELPER
  const today = new Date().toISOString().split('T')[0];

  // 3. BACKEND ACTIONS
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
    if (isLoggedIn) {
      fetchDeadlines();
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return <Auth onLoginSuccess={() => {
        localStorage.setItem("isLoggedIn", "true");
        setIsLoggedIn(true);
    }} />;
  }

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
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userId");
    setIsLoggedIn(false);
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

  // 5. USER INTERFACE (JSX)
  return (
    <div style={{ 
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', 
      minHeight: '100vh', width: '100vw', backgroundColor: '#F8FAFC', 
      fontFamily: '"Inter", "Segoe UI", sans-serif', color: '#1E293B'
    }}>
      
      <div style={{ 
        width: '90%', maxWidth: '480px', padding: '30px', paddingTop: '80px', 
        backgroundColor: '#FFFFFF', borderRadius: '24px', boxShadow: '0 10px 40px rgba(0,0,0,0.04)',
        position: 'relative' 
      }}>
        
        {/* Search Bar */}
        <input 
          type="text" placeholder="🔍 Search..." value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ 
            position: 'absolute', top: '25px', left: '25px', width: '130px',
            padding: '10px 15px', borderRadius: '15px', border: '1px solid #E2E8F0', 
            fontSize: '13px', outline: 'none', backgroundColor: '#F1F5F9'
          }}
        />

        {/* Logout Button */}
        <button 
          onClick={logout}
          style={{
            position: 'absolute', top: '25px', right: '25px', padding: '8px 16px',
            backgroundColor: 'transparent', border: '1px solid #FDA4AF',
            borderRadius: '15px', fontSize: '12px', cursor: 'pointer',
            color: '#E11D48', fontWeight: '600'
          }}
        >
          Logout
        </button>

        <h1 style={{ fontSize: '26px', fontWeight: '800', marginBottom: '8px', color: '#0F172A', textAlign: 'center' }}>
          Deadline Tracker
        </h1>
        
        <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '30px', textAlign: 'center' }}>
          Status: <span style={{ fontWeight: '700', color: status === "Backend Connected" ? "#10B981" : "#F43F5E" }}>
            ● {status}
          </span>
        </p>

        {/* Stats Dashboard */}
        <div style={{ 
          display: 'flex', justifyContent: 'space-around', backgroundColor: '#F8FAFC', 
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
            style={{ padding: '15px', borderRadius: '15px', border: '1px solid #E2E8F0', fontSize: '15px', outline: 'none' }}
          />
          <div style={{ display: 'flex', gap: '10px' }}>
            <input 
              type="date" value={dueDate} min={today} onChange={(e) => setDueDate(e.target.value)} required
              style={{ flex: 2, padding: '13px', borderRadius: '15px', border: '1px solid #E2E8F0', outline: 'none' }}
            />
            <select 
              value={priority} onChange={(e) => setPriority(e.target.value)}
              style={{ flex: 1, padding: '13px', borderRadius: '15px', border: '1px solid #E2E8F0', backgroundColor: 'white' }}
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
                  padding: '16px', marginBottom: '12px', backgroundColor: '#F8FAFC', 
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
                          fontSize: '15px', fontWeight: '600', color: d.completed ? '#94A3B8' : (isOverdue ? '#F43F5E' : '#1E293B'),
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
                      <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>
                        Due: {d.dueDate} {isOverdue && "(LATE)"}
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
  );
}

export default App;