import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [filter, setFilter] = useState("all");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // GET tasks
  const getTasks = () => {
    fetch("http://localhost:5000/tasks")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch tasks");
        }

        return response.json();
      })
      .then((data) => {
        setTasks(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    getTasks();
  }, []);

  // POST task
  const addTask = (e) => {
    e.preventDefault();

    if (title.trim() === "") {
      return;
    }

    fetch("http://localhost:5000/tasks", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        title: title,
        description: description,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to add task");
        }

        return response.json();
      })
      .then((newTask) => {
        setTasks([...tasks, newTask]);

        setTitle("");
        setDescription("");
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  // DELETE task
  const deleteTask = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmDelete) {
      return;
    }

    fetch(`http://localhost:5000/tasks/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete task");
        }

        return response.json();
      })
      .then(() => {
        setTasks(
          tasks.filter((task) => task.id !== id)
        );
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  // Toggle task
  const toggleTask = (task) => {
    fetch(`http://localhost:5000/tasks/${task.id}`, {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        completed: !task.completed,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update task");
        }

        return response.json();
      })
      .then((updatedTask) => {
        setTasks(
          tasks.map((item) => {
            if (item.id === updatedTask.id) {
              return updatedTask;
            }

            return item;
          })
        );
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") {
      return !task.completed;
    }

    if (filter === "completed") {
      return task.completed;
    }

    return true;
  });

  if (loading) {
    return <h2>Loading tasks...</h2>;
  }

  return (
    <div className="container">
      <h1>Task Manager</h1>

      {error && <p className="error">{error}</p>}

      {/* Add Task */}
      <form onSubmit={addTask} className="task-form">
        <input
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Task description"
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
        />

        <button type="submit">
          Add Task
        </button>
      </form>

      {/* Filter */}
      <div className="filters">
        <button onClick={() => setFilter("all")}>
          All
        </button>

        <button onClick={() => setFilter("active")}>
          Active
        </button>

        <button
          onClick={() => setFilter("completed")}
        >
          Completed
        </button>
      </div>

      {/* Tasks */}
      <div className="tasks">
        {filteredTasks.map((task) => (
          <div className="task" key={task.id}>
            <h2>{task.title}</h2>

            <p>{task.description}</p>

            <p>
              Status:{" "}
              {task.completed
                ? "Completed"
                : "Active"}
            </p>

            <button
              onClick={() => toggleTask(task)}
            >
              {task.completed
                ? "Mark Active"
                : "Complete"}
            </button>

            <button
              onClick={() => deleteTask(task.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;