
const mongoose=require("mongoose");
const ChatSchema=mongoose.Schema(
    {
        member1:{
            type:String
        },
        member2:{
            type:String
        },
    
      
    }
    
);
const ChatModel=mongoose.model("Chat",ChatSchema)

module.exports=ChatModel;