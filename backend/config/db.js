const mongoose = require('mongoose')
require('dotenv').config()

const connectdb = async ()=>{
    try{
        await mongoose.connect(process.env.DB_URL)
        console.log('MongoDB Connected')
    }catch(err){
        console.log('MongoDB Connection Error: ', err)
        process.exit(1)
    }
}



module.exports = connectdb