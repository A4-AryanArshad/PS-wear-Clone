const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken")
const express=require("express");
const cookieParser = require('cookie-parser');
const multer = require('multer');
const fs=require('fs')
const app=express();
app.use(cookieParser())
app.use("/uploads",express.static("./uploads"));
require("./Connect")
const Mode=require("./Model")
const MessageModel=require("./MessageModel")
const Mddle=require("./Mddle");
const port=8000;
const path = require('path');
const bodyParser = require('body-parser');
const { model } = require("mongoose");

const  ChatModel  = require("./ChatModel");
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }))





const Storage=multer.diskStorage({
  destination:(req,file,callback)=>{
callback(null,"./uploads")
  },
  filename:(req,file,callback)=>{
    callback(null,`image-${Date.now()}.${file.originalname}`)
  }
  
  });

const upload=multer({
  storage:Storage
})






app.post("/",async (req,res)=>{
  const {name,email,phone,work,password,cpassword}=req.body;
  if(!name||!email||!phone||!work||!password||!cpassword)
  {
    return res.status(422).json({error:"plz enter the fields "})
  }
  const finder=await Mode.findOne({email:email})
  if(!finder)
  {
    const user=new Mode({name,email,phone,work,password,cpassword});
    user.save()
    try{
      res.json("saved")
    }catch{
      res.json("not saived")
    }
  }else{
    return res.status(422).json({error:"email already exist "})
  }

 
})
app.post("/signin",async (req,res)=>{
  try{
const {email,password}=req.body;
if(!email||!password)
{
  return res.status(422).json({message:"sorry incorrect login"})
}
const dataenter=await Mode.findOne({email:email})
if(dataenter)
{
  const ismatch=await bcrypt.compare(password,dataenter.password)
  if(ismatch)
  {
    const token=await dataenter.generateAuthToken();
    console.log(token);
    res.cookie("jwtoken",token,{
      expires:new Date(Date.now()+25892000000),
      httpOnly:true
    });
    res.json({message:" login"})
  }else{
    res.status(422).json({message:" you are not login"})
  }

}
else{
  res.status(422).json({message:"user not found"})
}
  }catch(err){
console.log(err);
  }
})
app.get('/about',Mddle,(req,res)=>{
console.log("aryan hello i am middleware");
res.send(req.rootuser);

})
app.get('/contect',Mddle,(req,res)=>{
  
  res.send(req.rootuser);
  
  })
  app.post('/Contect',Mddle,async(req,res)=>{
  
    try {
      const{name,email,phone,message}=req.body
      if(!name||!phone||!email||!message){
        return res.json({error:"please enter the fields"})
      }
      const usercontact=await Mode.findOne({_id:req.rootid})
      if(usercontact){
        const meass=await usercontact.addMessage(message);
        await usercontact.save();
        res.status(201).json({message:"user contect successfully"});
      }
    } catch (error) {
      console.log(error)
    }
    })
    app.get('/products',async(req,res)=>{
      try {
        const data=await Mode.find();
      res.json(data);
      } catch (error) {
        console.log(error);
      }
    })


    //app.post("/productadder",upload.single('photo'),Mddle,async(req,res)=>{
  app.post("/productadder",upload.single("photo"),Mddle,async(req,res)=>{
console.log(req.file);
  const{companyname}=req.body;
  const{ productname}=req.body;
  const{productdescription}=req.body;
  const{productprise}=req.body;
  const{totalinstock}=req.body;
  const photo=req.file.path;
  console.log(photo);
    if(!productname||!productdescription||!productprise||!totalinstock||!companyname)
  {
    console.log("please enter the all the elements");
    return res.status(402).json({message:"please enter enter the all fields"});
  }else{
    const company=await Mode.findOne({companyname:companyname});
    if(company)
    {
      return res.status(402).json({message:"please enter your own company name"});
    }
    const usercontact=await Mode.findOne({_id:req.rootid})
    if(usercontact)
    {
      const meass=await usercontact.ADDMessage(productdescription,productname,productprise,photo,totalinstock,companyname);
      await usercontact.save();
      res.status(201).json({message:"user contect successfully"});
    }else{
res.json("user not found");
    }
  }
    

    
  });
app.post("/ordertaker",Mddle,async(req,res)=>{
  const{ nname,desi,Imge,prise,INC}=req.body;
  if(!nname||!desi||!Imge||!prise||!INC)
  {
    return res.status(422).json({
      error:"please enter thefollowing fields"
    })
  }
  const finder=await Mode.findOne({img:req.rootpicker})
  if(finder)
  {
    const ineerfind=await Mode.findOne({_id:req.rootid})
    if(ineerfind)
    {
const meass=await ineerfind.dataenter(nname,desi,Imge,prise,INC)
await ineerfind.save();
    }
    else{
      console.log("user not found");
      res.status(422).json({error:"user not found"})
    }
  }
  else{
    console.log(" you cannot order you own item");
    res.status(422).json({error:" you cannot order you own item"})
  }
})
app.post("/dashboard",async(req,res)=>{
  const{email}=req.body;
  if(!email)
  {
    return res.status(422).json("please enter the fileds");
  }
  else{
    const user=await Mode.findOne({email:email})
    if(user)
    {
      res.send(user);
    }else{
      res.status(422).json("soory data base not found the user");
    }
  }
})
app.post("/addtocart",Mddle,async(req,res)=>{
 
const{image,productname,productdescription,productprise,amount,cname,email}=req.body;
if(!image||!productname||!productdescription||!productprise||!amount||!cname||!email){
  return res.status(422).json({"error":"enter the fields"})
}
const finder=await Mode.findOne({_id:req.rootid})
if(finder){

  const adder=await finder.AddtoCart(image,productname,productdescription,productprise,amount,cname,email)
  await finder.save();
  return res.json({"message":"ok ok"})
 
}
 
})
app.post("/deleter",Mddle,async(req,res)=>{

const del=req.body;
const data=await Mode.update({'_id':req.rootid},
  {$pull:{'orders':{amount:del.del}}},
{multi:true}
   );
return res.json({"error":"please press the field"});
})
app.post("/oneitem",Mddle,async(req,res)=>{
  const{   myproductorderimage,myproductordername,myproductorderamount,myproductorderproductprise,cname}=req.body;
  if( !myproductorderimage||!myproductordername||!myproductorderamount||!myproductorderproductprise||!cname){
    return res.status(422).json({"error":"enter the fields"})
  }
  const finder=await Mode.findOne({ companyname:cname})
  if(finder){
    const customemail=  req.email;
    const adder=await finder.MYORDER(myproductorderimage,myproductordername,myproductorderamount,myproductorderproductprise,customemail)
    await finder.save();
  return res.json({"message":"ok ok"})
  }else{
    return res.status(422).json({"error":"enter the fields"})
  }
 
})
app.get("/singledashboard",Mddle,async(req,res)=>{
  res.send(req.rootuser);
})
app.get("/adminpanel",Mddle,async(req,res)=>{
  const finder=await Mode.find();
res.send(finder);
})
app.post("/dashBBoarddelete",Mddle,async(req,res)=>{
  const customemail=req.body;
  const deliver=req.body;
  const mailer= deliver.deliver
  const mailer2=deliver.delivery
  console.log(mailer);
  const data=await Mode.updateOne(
    {' _id': mailer2, "orders.email": mailer },
    { $set: { "orders.$.DELIVERED" : "DELVERED" } }
 )
  const DATA=await Mode.update({'_id':req.rootid},
  {$pull:{'myproductdata':{customemail:  customemail.delivery}}},
  {multi:true});
 
 
})
app.post("/message",async(req,res)=>{
  const{ member1,member2}=req.body;

  const newChat=new ChatModel({
    member1,member2
  })
 
  try {
    const result=await newChat.save();
    res.status(200).json("done");
    
  } catch (error) {
    res.status(500).json(error)
  }
})
app.post("/userdata",Mddle,async(req,res)=>{
  try {
    const chats=req.body;
    console.log(chats);
 
    const chat=await Mode.findOne({ _id : chats }
     
  )
    console.log(chat);
    res.json(chat);
  } catch (error) {
    console.log(error);

   
  }
})
app.get("/user/userId",Mddle,async(req,res)=>{
  try {
console.log("i am fine");
console.log(req.rootid);
const finder1=await ChatModel.findOne({member1:req.rootid});
if(finder1){
  console.log(finder1.member2);
  res.status(200).json(finder1.member2);

  
}
const finder2=await ChatModel.findOne({member2:req.rootid});
if(finder2)
{
  console.log(finder2.member1);
  res.status(200).json(finder2.member1);

 
}


  } catch (error) {
    res.status(500).json(error)
  }
})
app.get("/find/:firstId/:secondId",async(req,res)=>{
  try {
    const chat=await ChatModel.findOne({
      members:{$all:[req.params.firstId,req.params.secondId]}
    })
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json(error)
  }
})
app.post("/addmessage",async(req,res)=>{
const{chatId,senderId,text}=req.body;
const message=new MessageModel({
  chatId,
  senderId,
  text
});

try {
  const result=await message.save();
  res.status(200).json(result);
} catch (error) {
  res.status(500).json(error);
}
})
app.get("/gtmessage/:chatId",async(req,res)=>{
const{chatId}=req.params;
try {
  const result=await MessageModel.find({chatId})

  res.status(200).json(result);
  
} catch (error) {
  res.status(500).json(error);
}
})


app.listen(port);
