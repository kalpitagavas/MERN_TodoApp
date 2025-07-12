const mongoose = require("mongoose");


const todoSchema = new mongoose.Schema({
     userId:{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
     title: { type: String, required: true,trim: true,
          maxlength: 100, },
     description:{type:String,trim: true,
          maxlength: 1000,},
     isComplete:{type:Boolean,default:false},
     dueDate:{type:Date},
     priority:{type:String,enum:["low","medium","high"],default:"low"},
     isDeleted:{type:Boolean,default:false},
     reminderAt: { type: Date },
     tags: [{ type: String }],
     attachmentUrl: { type: String },
     }, { timestamps: true });


const Todo = mongoose.model("Todo", todoSchema);

module.exports = Todo;