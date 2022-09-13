const mongoose = require('mongoose'); 


const UserSchema = new mongoose.Schema({
    email:{type:String,required:true,unique:true}, 
    password:{type:String,required:true,minLength:8}, 
    avatar:{type:String,default:""}, 
    isAvatar:{type:Boolean,default:false}, 
    isAdmin:{type:Boolean,default:false}
},{
    collection:'users',
    timestamps:true
})


module.exports = mongoose.model('users',UserSchema); 