const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(express.json());

const filePath = "./data/tasks.json";

// Read tasks
function getTasks() {
  const data = fs.readFileSync(filePath, "utf-8");

  return JSON.parse(data);
}

// Write tasks
function saveTasks(tasks) {
  fs.writeFileSync(
    filePath,
    JSON.stringify(tasks, null, 2)
  );
}

// GET all tasks
app.get("/tasks", (req, res) => {
  const tasks = getTasks();

  res.status(200).json(tasks);
});

// GET one task
app.get("/tasks/:id", (req, res) => {
  const tasks = getTasks();

  const id = Number(req.params.id);

  const task = tasks.find((task) => task.id === id);

  if (!task) {
    return res.status(404).json({
      message: "Task not found",
    });
  }

  res.status(200).json(task);
});

// POST create task
app.post("/tasks", (req, res) => {
  const tasks = getTasks();

  const { title, description } = req.body;

  if (!title) {
    return res.status(400).json({
      message: "Title is required",
    });
  }

  const newTask = {
    id: Date.now(),
    title: title,
    description: description || "",
    completed: false,
    createdAt: new Date().toISOString(),
  };

  tasks.push(newTask);

  saveTasks(tasks);

  res.status(201).json(newTask);
});

// PUT update task
app.put("/tasks/:id", (req, res) => {
  const tasks = getTasks();

  const id = Number(req.params.id);

  const task = tasks.find((task) => task.id === id);

  if (!task) {
    return res.status(404).json({
      message: "Task not found",
    });
  }

  task.title = req.body.title || task.title;

  task.description =
    req.body.description ?? task.description;

  if (req.body.completed !== undefined) {
    task.completed = req.body.completed;
  }

  saveTasks(tasks);

  res.status(200).json(task);
});

// DELETE task
app.delete("/tasks/:id", (req, res) => {
  const tasks = getTasks();

  const id = Number(req.params.id);

  const taskExists = tasks.some((task) => task.id === id);

  if (!taskExists) {
    return res.status(404).json({
      message: "Task not found",
    });
  }

  const newTasks = tasks.filter((task) => task.id !== id);

  saveTasks(newTasks);

  res.status(200).json({
    message: "Task deleted",
  });
});

// Start server
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});