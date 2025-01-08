const mongoose=require('mongoose');

const user=new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    address:{
        type:String,
        required:true,  
    },
    avatar:{
        type:String,
        default:"C:\\Users\\Pandey\\Desktop\\learning\\2.web developement\\4.project\\2.self\\1.bookstore\\2.by bandid cam\\backend\\public\\images\\profile_pic.png"
    },
    role:{
        type:String,
        default:"user",
        enum:["user","admin"],
    },
    favourites:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"books"
    }],
    cart:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"books"
    }],
    orders:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"order"
    }],
},{timestamp:true});

module.exports=mongoose.model("user",user);