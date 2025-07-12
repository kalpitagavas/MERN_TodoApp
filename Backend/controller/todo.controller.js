const todoModel=require("../models/todoModel")

const createTodo=async(req,res)=>{
    try{
     const{title,description,isComplete,dueDate,priority,isDeleted,reminderAt,tags,attachmentUrl}=req.body   
  // Get userId from the logged-in user
    const userId = req.user._id;

     const newTodo=await todoModel.create({
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
  })
res.status(200).json({success:"true",msg:"Todo Created",todo:newTodo})

    }catch(err){
res.status(500).json({ success: false, message: "Failed to create todo", error: err.message });
    }
}

const updateTodos=async(req,res)=>{
    try{
          const todoId=req.params.id;
          const userId=req.user._id;
  const{title,description,isComplete,dueDate,priority,isDeleted,reminderAt,tags,attachmentUrl}=req.body   
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
    if(!updateTodo) return res.status(400).json({msg:"Todo not found or not authorized" })
         
        res.status(200).json({ success: true, msg: "Todo updated", todo: updatedTodo });
}
    catch(err){
res.status(500).json({ success: false, message: "Failed to update todo", error: err.message });
    }
}

const deleteTodos=async(req,res)=>{
    try{
        const todoId=req.params.id;
        const userId = req.user._id;

        const deleteTodo=await todoModel.findOneAndUpdate({_id:todoId,userId}, { isDeleted: true },{new:true})
        if(!deleteTodo)return res.status(400).json({msg:"Unable to find todo"}) 
        res.status(200).json({success:true,msg:"Successfully Deleted",deletedTodo:deleteTodo})

}
    catch(err){
 res.status(400).json({msg:"Error in Deleting Todo"})
    }
}
 const getTodos=async(req,res)=>{
    try{
 const userId=req.user_.id
 const todos=await todoModel.find({userId,isDeleted:false})
 res.status(200).json({success:true,alltodos:todos})
    }catch(err){
  res.status(500).json({ msg: "Error fetching todos", error: err.message });
    }
 }
module.exports={getTodos,updateTodos,deleteTodos,createTodo}