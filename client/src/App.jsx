import { useEffect, useState } from 'react'

function App() {
  const [deadlines, setDeadlines] = useState([]);
  const [task, setTask] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("Connecting...");

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const newDeadline = { task, dueDate };

    fetch("http://localhost:8080/api/deadlines", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newDeadline)
    })
    .then(() => {
      setTask(""); 
      setDueDate(""); 
      fetchDeadlines(); 
    });
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh', // Full screen height
      width: '100vw',     // Full screen width
      backgroundColor: '#f0f2f5',
      fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif'
    }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '450px', 
        padding: '20px', 
        backgroundColor: 'white', 
        borderRadius: '12px', 
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
      }}>
        <h1 style={{ color: '#1a1a1b', marginBottom: '10px' }}>Deadline Tracker</h1>
        <p style={{ fontSize: '14px', marginBottom: '20px' }}>
          Status: <span style={{ fontWeight: 'bold', color: status === "Backend Connected" ? "#28a745" : "#dc3545" }}>{status}</span>
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input 
            type="text" placeholder="Task description..." value={task}
            onChange={(e) => setTask(e.target.value)} required 
            style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '16px' }}
          />
          <input 
            type="date" value={dueDate}
            onChange={(e) => setDueDate(e.target.value)} required
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
            cursor: 'pointer' 
          }}>
            Add Deadline
          </button>
        </form>

        <div style={{ marginTop: '30px', textAlign: 'left' }}>
          <h3 style={{ borderBottom: '2px solid #eee', paddingBottom: '5px' }}>Upcoming Tasks</h3>
          <ul style={{ listStyle: 'none', padding: 0, maxHeight: '300px', overflowY: 'auto' }}>
            {deadlines.map((d) => (
              <li key={d.id} style={{ 
                padding: '12px 0', 
                borderBottom: '1px solid #f0f0f0', 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ fontSize: '16px', color: '#333' }}>{d.task}</span>
                <span style={{ fontSize: '14px', color: '#666', backgroundColor: '#e9ecef', padding: '4px 8px', borderRadius: '4px' }}>
                  {d.dueDate}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;