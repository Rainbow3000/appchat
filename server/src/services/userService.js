const User  = require('../models/UserModel'); 


module.exports = {
    getAllUser:()=>{
    
        return new Promise((resolve,reject)=>{
            User.find({}).then(user=>{
                const convertToArray = user.map(item=>{                  
                    const {password,email,...rest} = item._doc;
                    const convertEmail = email.split("@")[0];
                    rest.email = convertEmail;  
                    return rest;  
                })
                
                resolve(convertToArray) 
            }).catch(err=>reject(err)); 
        })
    }, 
    updateUser:({userId,avatar})=>{
        return new Promise((resolve,reject)=>{
            User.findByIdAndUpdate(userId,{
                avatar,
                isAvatar:true
            },{new:true}).then(user=>resolve(user)).catch(err=>reject(err)); 
        })
    }
}

