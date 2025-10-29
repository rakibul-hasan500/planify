require('dotenv').config()
const cors = require('cors')
const path = require('path') 
const express = require('express')
const connectdb = require('./config/db')
const cookieParser = require('cookie-parser')
const compression = require('compression')
const app = express()
const PORT = process.env.PORT

// Pre-Build Middlewares
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors({
    origin: process.env.ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
}))
app.use(cookieParser())
app.use(compression())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))


// Auth Route
const authRoute = require('./src/routes/auth.route')
app.use('/api/v1/auth', authRoute)


// Todo Route
const todoRoute = require('./src/routes/todo.route')
app.use('/api/v1/todo', todoRoute)


// Setting Route
const settingRoute = require('./src/routes/setting.route')
app.use('/api/v1/setting', settingRoute)




// Run App
app.listen(PORT, async ()=>{
    console.log(`Server is running on port: ${PORT}`)
    connectdb()
})