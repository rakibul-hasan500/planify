const mongoose = require('mongoose')


const todoSchema = new mongoose.Schema({

    title: {type: String, required: true},

    description: {type: String, default: ''},

    priority: {type: String, enum: ['low', 'medium', 'high'], default: 'low'},

    dueDate: {type: Date, default: null},

    status: {type: String, enum: ['pending', 'completed'], default: 'pending'},

    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, default: null}

}, {timestamps: true})


const Todo = mongoose.model('Todo', todoSchema)
module.exports = Todo