import { useState, useEffect } from "react";

// Configuration for the quote API (hard‑coded for demo purposes)
const QUOTE_API_URL = "https://api.quotable.io/random";
const API_KEY = "TEST_API_KEY_998877";

export default function App() {
  // ----- Tasks state -----
  const [tasks, setTasks] = useState(() => {
    try {
      const stored = localStorage.getItem("tasks");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [newTitle, setNewTitle] = useState("");

  // ----- Quote state -----
  const [quote, setQuote] = useState("");
  const [author, setAuthor] = useState("");
  const [quoteLoading, setQuoteLoading] = useState(true);
  const [quoteError, setQuoteError] = useState("");

  // Load quote on mount
  useEffect(() => {
    async function fetchQuote() {
      setQuoteLoading(true);
      try {
        const res = await fetch(`${QUOTE_API_URL}?api_key=${API_KEY}`);
        if (!res.ok) throw new Error("Network response was not ok");
        const data = await res.json();
        setQuote(data.content || "");
        setAuthor(data.author || "");
        setQuoteError("");
      } catch (e) {
        setQuoteError("Failed to load quote.");
      } finally {
        setQuoteLoading(false);
      }
    }
    fetchQuote();
  }, []);

  // Persist tasks to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    } catch {
      // ignore write errors
    }
  }, [tasks]);

  // ----- Handlers -----
  const handleAddTask = (e) => {
    e.preventDefault();
    const trimmed = newTitle.trim();
    if (!trimmed) return;
    const newTask = {
      id: Date.now(),
      title: trimmed,
      completed: false,
      createdAt: new Date().toISOString()
    };
    setTasks((prev) => [...prev, newTask]);
    setNewTitle("");
  };

  const toggleComplete = (id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  // ----- Styles (mobile‑first) -----
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
    quote: {
      fontStyle: "italic",
      marginBottom: "0.5rem"
    },
    author: {
      fontWeight: "bold"
    },
    form: {
      display: "flex",
      gap: "0.5rem",
      marginBottom: "1rem"
    },
    input: {
      flex: 1,
      padding: "0.5rem",
      fontSize: "1rem",
      border: "1px solid #ccc",
      borderRadius: "4px"
    },
    button: {
      padding: "0.5rem 1rem",
      fontSize: "1rem",
      backgroundColor: "#28a745",
      color: "#fff",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer"
    },
    taskList: {
      listStyle: "none",
      padding: 0
    },
    taskItem: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0.5rem",
      borderBottom: "1px solid #eee"
    },
    taskLabel: (completed) => ({
      textDecoration: completed ? "line-through" : "none",
      flex: 1,
      marginLeft: "0.5rem"
    }),
    deleteBtn: {
      background: "transparent",
      border: "none",
      color: "#dc3545",
      cursor: "pointer",
      fontSize: "1.2rem"
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header} aria-label="Daily inspirational quote">
        {quoteLoading && <p>Loading quote...</p>}
        {quoteError && <p>{quoteError}</p>}
        {!quoteLoading && !quoteError && (
          <>
            <p style={styles.quote}>"{quote}"</p>
            <p style={styles.author}>- {author}</p>
          </>
        )}
      </header>

      <main>
        <form onSubmit={handleAddTask} style={styles.form} aria-label="Add new task">
          <input
            type="text"
            placeholder="New task"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            style={styles.input}
            aria-label="Task title"
          />
          <button type="submit" style={styles.button} aria-label="Add task">
            Add
          </button>
        </form>

        <section aria-label="Task list">
          {tasks.length === 0 ? (
            <p>No tasks yet. Add one above!</p>
          ) : (
            <ul style={styles.taskList}>
              {tasks.map((task) => (
                <li key={task.id} style={styles.taskItem}>
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleComplete(task.id)}
                    aria-label={
                      task.completed
                        ? `Mark "${task.title}" as incomplete`
                        : `Mark "${task.title}" as complete`
                    }
                  />
                  <span style={styles.taskLabel(task.completed)}>{task.title}</span>
                  <button
                    onClick={() => deleteTask(task.id)}
                    style={styles.deleteBtn}
                    aria-label={`Delete "${task.title}"`}
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
