
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")
const mongoose=require("mongoose");
const studentSchema=new mongoose.Schema({
    name:{
        type:String,
   
        
    },
    email:{
        type:String,
       

    },
    phone:{
        type:Number,
    
    },
    work:{
        type:String,
      
    },
    password:{
        type:String,
       
    },
    cpassword:{
        type:String,
    
    },
    myproductdata:[{
    myproductorderimage:{
        type:String,
    },
    myproductordername:{
        type:String,
    },
    myproductorderamount:{
        type:String,
    },
    myproductorderproductprise:{
        type:String,
    },
    customemail:{
        type:String,
    }
}],
    orders:[{
        image:{
            type:String,
        },
        productname:{
            type:String,
          },
          amount:{
              type:Number,
            },
          productprise:{
              type:String,
          
          },
          cname:{
            type:String,
          },
          email:{
            type:String,
          },
          DELIVERED:{
            type:String,
            default:"not delivered"
          }
    }],
 
   
    cart:{
        type:String,
     
    },
    totalinstock:{
        type:String,
    },
    
         productname:{
            type:String,
          
        },
        productdescription:{
            type:String,
         
        },
        productprise:{
            type:String,
            
        },
        img:{ 
            type: String ,
         },
         companyname:{
            type: String ,
         },
 
    message:[{
      
        message:{
            type:String
            
        },
}],
 
    tokens:[{
token:{
    type:String,
    
}
    }]

}
)

studentSchema.pre('save',async function(next){
    console.log(" hi from inside");
    if(this.isModified('password')){
    this.password=await bcrypt.hash(this.password,12);
    this.cpassword=await bcrypt.hash(this.cpassword,12);

    }
    next();
})
studentSchema.methods.generateAuthToken = async function(){
    try{
        console.log(this._id);
        const token=jwt.sign({_id:this._id},"mynameisaryanandiamastudent")
console.log(token)
this.tokens=this.tokens.concat({token:token})
await this.save();
return token;
    }catch(e){
        console.log("aryan there is an error in token");
        console.log(e);
    }
}

studentSchema.methods.addMessage=async function(message){
try {
    this.message=this.message.concat({message});
    await this.save();
    return this.message;
} catch (error) {
    console.log(error)
}
}
studentSchema.methods.ADDMessage=async function(productdescription,productname,productprise,photo,totalinstock,companyname){
    try {
        console.log("going to save");
        console.log(photo);
        //.image=this.image.concat({productname,productdescription,productprise,img:photo});
        this.productdescription=productdescription;
        this.img=photo;
        this.productname=productname;
        this.productprise=productprise
        this.totalinstock=totalinstock;
        this.companyname=companyname;
       
        await this.save();
        return this.image;
    } catch (error) {
        console.log(error)
    }
    }
    studentSchema.methods.dataenter=async function(nname,desi,Imge,prise,INC){
        try {
            this.orders=this.orders.concat({currentorder:nname,orderdeditem:Imge,orderprise:prise,orderdedquantity:INC})
           
            await this.save();
            return this.orders
        } catch (error) {
            
        }
            
        
       
    }
    studentSchema.methods.AddtoCart=async function(image,productname,productdescription,productprise,amount,cname,email){
        try {
            this.orders=this.orders.concat({image,productname,productprise,amount,cname,email})
            await this.save();
            return this.orders;
        } catch (error) {
          
            console.log(error);
        }
    }
    studentSchema.methods.MYORDER=async function(myproductorderimage,myproductordername,myproductorderamount,myproductorderproductprise,customemail)
    {
        try {

            this.myproductdata=this.myproductdata.concat({myproductorderimage,myproductordername,myproductorderamount,myproductorderproductprise,customemail})
            await this.save();
            return this.myproductdata;
        } catch (error) {
          console.log(error);
            
        }
    }

const Mode=new mongoose.model('Model',studentSchema);
module.exports=Mode;