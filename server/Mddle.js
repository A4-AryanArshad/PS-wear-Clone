const jwt=require("jsonwebtoken");
const Mode=require("./Model")


const Mddle=async(req,res,next)=>{
try {
  const token=req.cookies.jwtoken;
  const verify=jwt.verify(token,"mynameisaryanandiamastudent");
  const rootuser=await Mode.findOne({_id:verify._id,"tokens.token":token})
  if(!rootuser)
  {
    console.log("error error");
  }
  req.token=token;
  req.rootuser=rootuser;
  req.email=rootuser.email;
  req.rootid=rootuser._id;
  req.rootpicker=rootuser.img;
  next();
} catch (error) {
  console.log("Mddle error");
  console.log(error);
}
}
module.exports=Mddle;
