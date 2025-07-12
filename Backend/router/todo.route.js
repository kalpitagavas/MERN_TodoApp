const express = require("express");
const {
  getTodos,
  createTodo,
  updateTodos,
  deleteTodos,
} = require("../controller/todo.controller");
const todorouter = express.Router();

// Use middleware to protect routes if needed
// const { isAuthenticated } = require("../middleware/auth");
// todorouter.use(isAuthenticated);


// Get all todos (non-deleted)
todorouter.get("/", getTodos);

// Create a new todo
todorouter.post("/", createTodo);

// Update an existing todo by ID
todorouter.put("/:id", updateTodos);

// Soft delete a todo by ID
todorouter.delete("/:id", deleteTodos);

module.exports = { todorouter };