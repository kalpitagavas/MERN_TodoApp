const todoModel = require("../models/todoModel");

const createTodo = async (req, res) => {
  try {
    const {
      title,
      description,
      isComplete,
      dueDate,
      priority,
      isDeleted,
      reminderAt,
      tags,
      attachmentUrl,
    } = req.body;
    // Get userId from the logged-in user
    const userId = req.user._id;

    const newTodo = await todoModel.create({
      userId,
      title,
      description,
      isComplete,
      dueDate,
      priority,
      isDeleted,
      reminderAt,
      tags,
      attachmentUrl,
    });
    res
      .status(200)
      .json({ success: "true", msg: "Todo Created", todo: newTodo });
  } catch (err) {
    next(err);
  }
};

const updateTodos = async (req, res) => {
  try {
    const todoId = req.params.id;
    const userId = req.user._id;
    const {
      title,
      description,
      isComplete,
      dueDate,
      priority,
      isDeleted,
      reminderAt,
      tags,
      attachmentUrl,
    } = req.body;
    const updatedTodo = await todoModel.findOneAndUpdate(
      { _id: todoId, userId },
      {
        title,
        description,
        isComplete,
        dueDate,
        priority,
        isDeleted,
        reminderAt,
        tags,
        attachmentUrl,
      },
      { new: true } // return the updated document
    );
    if (!updatedTodo)
      return res.status(400).json({ msg: "Todo not found or not authorized" });

    res
      .status(200)
      .json({ success: true, msg: "Todo updated", todo: updatedTodo });
  } catch (err) {
    next(err);
  }
};

const deleteTodos = async (req, res) => {
  try {
    const todoId = req.params.id;
    const userId = req.user._id;

    const deleteTodo = await todoModel.findOneAndUpdate(
      { _id: todoId, userId },
      { isDeleted: true },
      { new: true }
    );
    if (!deleteTodo)
      return res.status(400).json({ msg: "Unable to find todo" });
    res.status(200).json({
      success: true,
      msg: "Successfully Deleted",
      deletedTodo: deleteTodo,
    });
  } catch (err) {
    next(err);
  }
};
const getTodos = async (req, res) => {
  try {
    const page = req.query.page || 10;
    const limit = req.query.limit || 3;
    const skip = (page - 1) * limit;
    const userId = req.user._id;
    const todos = await todoModel
      .find({ userId, isDeleted: false })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); //show Latest one
    const totalTodos = await todoModel.countDocuments({
      userId,
      isDeleted: false,
    });
    res.status(200).json({
      success: true,
      message: "Todos fetched successfully",
      currentPage: page,
      TotalTodos: totalTodos,
      totalPages: Math.ceil(totalTodos / limit),
      todos,
    });
  } catch (err) {
    next(err);
  }
};
module.exports = { getTodos, updateTodos, deleteTodos, createTodo };
