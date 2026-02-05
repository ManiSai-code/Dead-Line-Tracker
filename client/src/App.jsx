import { useEffect, useState } from 'react'

function App() {
  // 1. STATE VARIABLES
  const [deadlines, setDeadlines] = useState([]);
  const [task, setTask] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [searchTerm, setSearchTerm] = useState(""); 
  const [status, setStatus] = useState("Connecting...");

  // 2. DATE HELPER
  const today = new Date().toISOString().split('T')[0];

  // 3. BACKEND ACTIONS
  const fetchDeadlines = () => {
    fetch("http://localhost:8080/api/deadlines")
      .then(res => res.json())
      .then(data => {
        setDeadlines(data);
        setStatus("Backend Connected");
      })
      .catch(() => setStatus("Backend Not Running"));
  };

  useEffect(() => {
    fetchDeadlines();
  }, []);

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
    const updatedItem = { ...item, completed: !item.completed };
    fetch(`http://localhost:8080/api/deadlines`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedItem)
    }).then(() => fetchDeadlines());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newDeadline = { 
      task, 
      dueDate, 
      priority, 
      completed: false 
    }; 

    fetch("http://localhost:8080/api/deadlines", {
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
    const aPrio = a.priority || "Medium";
    const bPrio = b.priority || "Medium";
    return priorityOrder[aPrio] - priorityOrder[bPrio];
  });

  // 5. USER INTERFACE (JSX)
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
      
      {/* THE WHITE CARD BOX */}
      <div style={{ 
        width: '100%', 
        maxWidth: '450px', 
        padding: '20px', 
        paddingTop: '60px', 
        backgroundColor: 'white', 
        borderRadius: '12px', 
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        position: 'relative' // This keeps the search bar inside the box
      }}>

        {/* SEARCH INPUT - Positioned in the Dashboard Corner */}
        <input 
          type="text" 
          placeholder="🔍 Search..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ 
            position: 'absolute',
            top: '20px',
            right: '20px',
            width: '110px',
            padding: '8px', 
            borderRadius: '20px', 
            border: '1px solid #ddd', 
            fontSize: '13px',
            outline: 'none',
            backgroundColor: '#fff'
          }}
        />

        <h1 style={{ color: '#1a1a1b', marginBottom: '10px', marginTop: '0px' }}>
          Deadline Tracker
        </h1>

        <p style={{ fontSize: '14px', marginBottom: '20px' }}>
          Status: <span style={{ fontWeight: 'bold', color: status === "Backend Connected" ? "#28a745" : "#dc3545" }}>{status}</span>
        </p>

        {/* DASHBOARD STATS SECTION */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-around', 
          backgroundColor: '#f8f9fa', 
          padding: '15px', 
          borderRadius: '8px', 
          marginBottom: '20px', 
          border: '1px solid #e9ecef'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#007bff' }}>
              {deadlines.length}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>Total</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#dc3545' }}>
              {deadlines.filter(d => d.dueDate < today && !d.completed).length}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>Late</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#ffc107' }}>
              {deadlines.filter(d => d.priority === 'High' && !d.completed).length}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>Urgent</div>
          </div>
        </div>

        {/* TASK INPUT FORM */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input 
            type="text" 
            placeholder="Task description..." 
            value={task}
            onChange={(e) => setTask(e.target.value)} 
            required 
            style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '16px' }}
          />
          <input 
            type="date" 
            value={dueDate} 
            min={today}
            onChange={(e) => setDueDate(e.target.value)} 
            required
            style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '16px' }}
          />
          <select 
            value={priority} 
            onChange={(e) => setPriority(e.target.value)}
            style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '16px', backgroundColor: 'white' }}
          >
            <option value="High">🔴 High Priority</option>
            <option value="Medium">🟡 Medium Priority</option>
            <option value="Low">🟢 Low Priority</option>
          </select>
          <button type="submit" style={{ 
            padding: '12px', 
            borderRadius: '6px', 
            border: 'none', 
            backgroundColor: '#007bff', 
            color: 'white', 
            fontSize: '16px', 
            fontWeight: 'bold', 
            cursor: 'pointer' 
          }}>
            Add Deadline
          </button>
        </form>

        {/* TASK LIST SECTION */}
        <div style={{ marginTop: '30px', textAlign: 'left' }}>
          <h3 style={{ borderBottom: '2px solid #eee', paddingBottom: '5px' }}>Upcoming Tasks</h3>
          <ul style={{ listStyle: 'none', padding: 0, maxHeight: '300px', overflowY: 'auto' }}>
            {sortedDeadlines.map((d) => {
              const isOverdue = d.dueDate < today && !d.completed;
              return (
                <li key={d.id} style={{ 
                  padding: '12px 0', 
                  borderBottom: '1px solid #f0f0f0', 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input 
                      type="checkbox" 
                      checked={d.completed || false} 
                      onChange={() => toggleComplete(d)} 
                    />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ 
                          fontSize: '16px', 
                          color: d.completed ? '#aaa' : (isOverdue ? '#dc3545' : '#333'),
                          textDecoration: d.completed ? 'line-through' : 'none',
                          fontWeight: isOverdue ? 'bold' : 'normal'
                        }}>
                          {d.task} {isOverdue && "⚠️"}
                        </span>
                        {!d.completed && (
                          <span style={{ 
                            fontSize: '10px', 
                            fontWeight: 'bold', 
                            padding: '2px 6px', 
                            borderRadius: '4px', 
                            color: 'white',
                            backgroundColor: d.priority === 'High' ? '#dc3545' : d.priority === 'Medium' ? '#ffc107' : '#28a745'
                          }}>
                            {d.priority}
                          </span>
                        )}
                      </div>
                      <span style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                        Due: {d.dueDate} {isOverdue && "(OVERDUE)"}
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDelete(d.id)}
                    style={{
                      padding: '6px 10px', 
                      backgroundColor: 'transparent', 
                      border: 'none',
                      color: '#ff4d4d', 
                      cursor: 'pointer', 
                      fontSize: '12px'
                    }}
                  >
                    Delete
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;