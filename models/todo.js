const mongoose = require('mongoose');

const Schema = mongoose.Schema;//constructur funtion to add schemas

const todoSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:false
    },
    author:{
        type:String,
        required:true
    },
    status:{
        type:String,
        required:true
    },
    creationDate:{
        type:Date,
        required:true
    },
    dueDate:{
        type:Date,
        required:true
    },
})

module.exports = mongoose.model('Todo',todoSchema)