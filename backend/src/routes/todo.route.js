const express = require('express')
const verifyAuth = require('../middlewares/verifyLogin')
const { createTodo, getTodos, deleteTodo, updateTodo, updateTodoStatus } = require('../controllers/todo.controller')
const router = express.Router()


// Create Todo
router.post('/create', verifyAuth, createTodo)


// Get Todos
router.get('/todos', verifyAuth, getTodos)


// Delete Todos
router.delete('/delete/:todoId', verifyAuth, deleteTodo)


// Update Todos
router.put('/update', verifyAuth, updateTodo)


// Update Todos Status
router.patch('/update/:todoId', verifyAuth, updateTodoStatus)















module.exports = router