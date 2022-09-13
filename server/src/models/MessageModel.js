const mongoose = require('mongoose')

const MessageSchema = new mongoose.Schema({
    msg : {type:String,default:""}, 
    from:{type:String, required:true},
    to:{type:String,required:true},
    time:{type:String,required:true},
},{
    collection:"messages", 
    timestamps:true
})


module.exports = mongoose.model('messages',MessageSchema)


 