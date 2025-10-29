const sanitize = require("mongo-sanitize")
const { errorResponse, successResponse } = require("../../utils/responseHandler")
const { addTodoSchema } = require("../../config/zod")
const Todo = require("../models/todo.model")


// Create Todo
const createTodo = async (req, res)=>{
    try{
        // Get User From Verify Auth
        const user = req.user

        // Sanitize Body
        const sanitizedBody = sanitize(req.body)

        // Zod Validation
        const validation = addTodoSchema.safeParse(sanitizedBody)

        // If Zod Validation Error
        if(!validation.success){
            // Zod Error
            const zodError = validation.error

            // All Errors
            let allErrors = []
            if(zodError.issues && Array.isArray(zodError.issues)){
                allErrors = zodError.issues.map((issue)=>({
                    field: issue.path[0],
                    message: issue.message
                }))
            }

            return res.status(400).json({
                success: false,
                message: 'add_todo_zod_validation_error',
                error: allErrors
            })
        }

        // Get Data Form Validation
        const todoData = validation.data
        
        // Save Data To DB
        const todo = await Todo.create({
            title: todoData.title,
            description: todoData.description || '',
            priority: todoData.priority,
            status: todoData.status,
            dueDate: todoData.dueDate ? new Date(todoData.dueDate) : null,
            user: user._id.toString()
        })
        if(!todo){
            return errorResponse(res, 500, 'Failed, Try again.')
        }

        return successResponse(res, 201, 'Todo created successfully.')
    }catch(error){
        return errorResponse(res, 500, 'Internal server error.', error)
    }
}



// Get Todos
const getTodos = async(req, res)=>{
    try{
        // Sanitize Params
        const sanitizedQuery = sanitize(req.query)
        const {status, page=1, limit=10} = sanitizedQuery

        // Validate Page & Limit
        if(isNaN(page) || isNaN(limit) || page <= 0 || limit <=0){
            return errorResponse(res, 400, 'Invalid page and limit.')
        }

        // Get User From Verify Auth
        const user = req.user

        // Validate Status
        if(status && status !== 'pending' && status !== 'completed'){
            return errorResponse(res, 400, 'Invalid status.')
        }

        // Filter
        let filter = {}
        if(status === 'pending' || status === 'completed'){
            filter.status = status
        }

        // Pagination
        const skip = (page - 1) * limit

        // Get Todos
        const todos = await Todo.find({user: user._id.toString(), ...filter})
        .populate('user', '_id')
        .sort({createdAt: -1})
        .skip(skip).limit(limit)

        // Sort By Status
        const sortedTodos = [
            ...todos.filter((todo)=>todo.status === 'pending'),
            ...todos.filter((todo)=>todo.status === 'completed')
        ]

        // Filtered Todos Count
        const filtered = await Todo.countDocuments({user: user._id.toString(), ...filter})
        // All Todos For Count
        const allTodos = await Todo.find({user: user._id.toString()})

        // Today Date
        const todayDate = new Date()
        todayDate.setHours(0, 0, 0, 0)

        // Get Due Today Items Count
        const dueToday = allTodos.filter((todo)=>{
            const todoDueDate = new Date(todo.dueDate)
            todoDueDate.setHours(0, 0, 0, 0)
            return todoDueDate.getTime() === todayDate.getTime()
        }).length

        // Pending Count
        const pending = allTodos.filter((todo)=>todo.status === 'pending').length

        // Completed Count
        const completed = allTodos.filter((todo)=>todo.status === 'completed').length

        // High Priority
        const highPriority = allTodos.filter((todo)=>todo.priority === 'high').length

        // All Todo Count
        const all = allTodos.length

        return successResponse(res, 200, 'All todos.', {
            todos: sortedTodos,
            counts: {
                all,
                filtered,
                dueToday,
                pending,
                completed,
                highPriority
            }
        })
    }catch(error){
        return errorResponse(res, 500, 'Internal server error.', error)
    }
}



// Delete Todo
const deleteTodo = async (req, res)=>{
    try{
        // Get Id From Params
        const {todoId} = req.params

        // If No Id
        if(!todoId){
            return errorResponse(res, 400, 'Missing todo ID.')
        }

        // Sanitize params Data
        const sanitizedId = sanitize(todoId)

        // Get Todo By Id
        const todo = await Todo.findById(sanitizedId)
        if(!todo){
            return errorResponse(res, 404, "Todo not found.")
        }

        // Get User From Verify Auth
        const user = req.user
        if(todo.user.toString() !== user._id.toString()){
            return errorResponse(res, 403, "You are not allowed to delete.")
        }

        // Delete Todo By Id
        await Todo.findByIdAndDelete(sanitizedId)

        return successResponse(res, 200, 'Todo deleted successfully.')
    }catch(error){
        return errorResponse(res, 500, 'Internal server error.', error)
    }
}



// Update Todo
const updateTodo = async (req, res)=>{
    try{
        // Get User From Verify Auth
        const user = req.user

        // Sanitize Body
        const sanitizedBody = sanitize(req.body)
        const sanitizedData = {
            title: sanitizedBody.title,
            description: sanitizedBody.description,
            priority: sanitizedBody.priority,
            status: sanitizedBody.status,
            dueDate: sanitizedBody.dueDate
        }

        // Zod Validation
        const validation = addTodoSchema.safeParse(sanitizedData)

        // If Zod Validation Error
        if(!validation.success){
            // Zod Error
            const zodError = validation.error

            // All Errors
            let allErrors = []
            if(zodError.issues && Array.isArray(zodError.issues)){
                allErrors = zodError.issues.map((issue)=>({
                    field: issue.path[0],
                    message: issue.message
                }))
            }

            return res.status(400).json({
                success: false,
                message: 'add_todo_zod_validation_error',
                error: allErrors
            })
        }

        // Get Data Form Validation
        const todoData = validation.data

        // If No Id
        const todoId = sanitizedBody._id ? sanitizedBody._id.toString() : ""
        if (!todoId){
            return errorResponse(res, 400, "Missing todo ID")
        }
        
        // Get Todo By Id
        const todo = await Todo.findById(todoId)
        if(!todo){
            return errorResponse(res, 404, 'Todo not found.')
        }

        // Check User
        if(todo.user.toString() !== user._id.toString()){
            return errorResponse(res, 403, "You are not allowed to update.")
        }

        // Add New Data
        todo.title = todoData.title;
        todo.description = todoData.description || '';
        todo.priority = todoData.priority;
        todo.status = todoData.status;
        todo.dueDate = todoData.dueDate ? new Date(todoData.dueDate) : null;
        await todo.save();

        return successResponse(res, 200, "Todo updated successfully");
    }catch(error){
        return errorResponse(res, 500, 'Internal server error.', error)
    }
}



// Update Todo Status
const updateTodoStatus = async (req, res)=>{
    try{
        // Sanitized Todo Id From Params
        const sanitizedParams = sanitize(req.params)
        const {todoId} = sanitizedParams
        if(!todoId){
            return errorResponse(res, 400, "Missing todo ID.")
        }

        // Get User
        const user = req.user

        // Find Todo By Id
        const todo = await Todo.findById(todoId)
        if(!todo){
            return errorResponse(res, 404, 'Todo not found.')
        }

        // Check User match
        if(todo.user.toString() !== user._id.toString()){
            return errorResponse(res, 403, "You are not allowed to update.")
        }

        // Update Status
        todo.status = todo.status === 'pending' ? 'completed' : 'pending'
        await todo.save()

        return successResponse(res, 200, 'Status updated.')
    }catch(error){
        return errorResponse(res, 500, 'Internal server error.', error)
    }
}






module.exports = {
    createTodo,
    getTodos,
    deleteTodo,
    updateTodo,
    updateTodoStatus
}