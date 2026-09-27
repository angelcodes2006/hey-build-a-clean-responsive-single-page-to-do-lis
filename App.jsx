import React, { useState, useEffect } from "react";

export default function App() {
  // Quote state
  const [quote, setQuote] = useState({ content: "", author: "" });
  const [quoteLoading, setQuoteLoading] = useState(true);

  // Tasks state
  const [tasks, setTasks] = useState([]);
  const [newTitle, setNewTitle] = useState("");

  // Load tasks from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("tasks");
    if (stored) {
      try {
        setTasks(JSON.parse(stored));
      } catch (e) {
        // ignore malformed data
        setTasks([]);
      }
    }
  }, []);

  // Persist tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Fetch daily quote on mount
  useEffect(() => {
    async function fetchQuote() {
      setQuoteLoading(true);
      try {
        const res = await fetch("https://api.quotable.io/random");
        if (!res.ok) throw new Error("Network response was not ok");
        const data = await res.json();
        setQuote({ content: data.content, author: data.author });
      } catch (e) {
        setQuote({ content: "Stay positive and keep moving forward.", author: "Anonymous" });
      } finally {
        setQuoteLoading(false);
      }
    }
    fetchQuote();
  }, []);

  // Handlers
  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const newTask = {
      id: Date.now(),
      title: newTitle.trim(),
      completed: false,
      createdAt: new Date().toISOString()
    };
    setTasks([newTask, ...tasks]);
    setNewTitle("");
  };

  const toggleComplete = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  // Simple responsive styles
  const styles = {
    container: {
      maxWidth: "600px",
      margin: "0 auto",
      padding: "1rem",
      fontFamily: "Arial, sans-serif"
    },
    header: {
      textAlign: "center",
      marginBottom: "1.5rem"
    },
    quoteBox: {
      backgroundColor: "#f0f8ff",
      padding: "1rem",
      borderRadius: "8px",
      marginBottom: "1rem",
      fontStyle: "italic"
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "0.5rem",
      marginBottom: "1rem"
    },
    input: {
      padding: "0.5rem",
      fontSize: "1rem",
      borderRadius: "4px",
      border: "1px solid #ccc"
    },
    button: {
      padding: "0.5rem",
      fontSize: "1rem",
      borderRadius: "4px",
      border: "none",
      backgroundColor: "#007bff",
      color: "#fff",
      cursor: "pointer"
    },
    taskList: {
      listStyle: "none",
      padding: 0,
      margin: 0
    },
    taskItem: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0.5rem",
      borderBottom: "1px solid #e0e0e0"
    },
    taskTitle: (completed) => ({
      textDecoration: completed ? "line-through" : "none",
      color: completed ? "#777" : "#000"
    })
  };

  return (
    <main style={styles.container}>
      <header style={styles.header}>
        <h1>My To‑Do List</h1>
        {quoteLoading ? (
          <p>Loading quote…</p>
        ) : (
          <section style={styles.quoteBox} aria-label="Daily inspirational quote">
            <p>“{quote.content}”</p>
            <p style={{ textAlign: "right", marginTop: "0.5rem" }}>— {quote.author}</p>
          </section>
        )}
      </header>

      <form onSubmit={handleAddTask} style={styles.form} aria-label="Add new task">
        <input
          type="text"
          placeholder="What needs to be done?"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          style={styles.input}
          aria-label="Task title"
        />
        <button type="submit" style={styles.button} aria-label="Add task">
          Add Task
        </button>
      </form>

      <ul style={styles.taskList} aria-label="Task list">
        {tasks.map((task) => (
          <li key={task.id} style={styles.taskItem}>
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleComplete(task.id)}
                aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
              />
              <span style={styles.taskTitle(task.completed)}>{task.title}</span>
            </label>
            <button
              onClick={() => deleteTask(task.id)}
              style={{ ...styles.button, backgroundColor: "#dc3545" }}
              aria-label={`Delete task ${task.title}`}
            >
              Delete
            </button>
          </li>
        ))}
        {tasks.length === 0 && <p>No tasks yet. Add one above!</p>}
      </ul>
    </main>
  );
}
