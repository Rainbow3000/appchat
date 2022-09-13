
const User = require('../models/UserModel')
const Encrypt = require('../utils/hash'); 
module.exports = {
    login:(data)=>{ 
        const {email} = data; 
        return new Promise((resolve,reject)=>{
           User.findOne({email}).then(user=>resolve(user)).catch(err=>reject(err)); 
        })
    },
    register:(data)=>{
        return new Promise(async(resolve,reject)=>{

            const {email} = data; 
            
            const userExist = await User.findOne({email}); 
            if(userExist){
                reject({
                    code:"500",
                    msg:"User already exists !"
                })
            }
            const hashPassword = Encrypt.hashPassword(data.password); 
            data.password = hashPassword;         
            const user = new User(data); 
            user.save().then(user=>{
                resolve(user); 
            }).catch(err=>{
                reject(err); 
            })
        })
    }
}