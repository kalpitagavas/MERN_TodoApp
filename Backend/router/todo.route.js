const express = require("express");
import { validationResult } from "express-validator";
import isEmpty from "./../node_modules/express-validator/node_modules/validator/es/lib/isEmpty";
const {
  getTodos,
  createTodo,
  updateTodos,
  deleteTodos,
} = require("../controller/todo.controller");
const authMiddleware = require("../middleware/authmiddleware");
const todorouter = express.Router();

/**
 * @swagger
 * /todos:
 *   get:
 *     summary: Get all todos
 *     tags: [Todos]
 *     responses:
 *       200:
 *         description: List of todos
 */
todorouter.get("/", authMiddleware, getTodos);

/**
 * @swagger
 * /todos:
 *   post:
 *     summary: Create a new todo
 *     tags: [Todos]
 *     responses:
 *       201:
 *         description: Todo created
 */
todorouter.post(
  "/",
  authMiddleware,
  [
    body("title", "Title is required").notEmpty(),
    body("description", "Description must be string").optional().isString(),
    (req, res, next) => {
      const error = validationResult(req);
      if (!error.isEmpty()) {
        return res.status(400).json({ error: error.array() });
      }
      next();
    },
  ],
  createTodo
);
/**
 * @swagger
 * /todos/{id}:
 *   put:
 *     summary: Update a todo by ID
 *     tags: [Todos]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Todo ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Todo updated
 */
todorouter.put("/:id", authMiddleware, updateTodos);

/**
 * @swagger
 * /todos/{id}:
 *   delete:
 *     summary: Soft delete a todo
 *     tags: [Todos]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Todo ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Todo deleted
 */
todorouter.delete("/:id", authMiddleware, deleteTodos);

module.exports = { todorouter };
