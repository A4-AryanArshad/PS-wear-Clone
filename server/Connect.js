const mongoose=require("mongoose")
mongoose.connect("mongodb+srv://aryan:1234@cluster0.yg1zxcr.mongodb.net/?retryWrites=true&w=majority").then(()=>{
    console.log("connection build successfully");
}).catch((e)=>{
    console.log(e);
})