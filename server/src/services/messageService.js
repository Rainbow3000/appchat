
const Message = require('../models/MessageModel')

module.exports = {
    createMessage:(data)=>{
        return new Promise(async(resolve,reject)=>{
            try {
                const message = new Message(data); 
                const res = await message.save(); 
                if(res){
                    resolve(res); 
                }
            } catch (error) {
                 reject(error); 
            }
        })
    }, 

    getMessage:({from,to})=>{
        
        return new Promise(async(resolve,reject)=>{
            try {
              const data  = await Message.find({$or:[
                {
                    from:from, 
                    to:to
                }, 
                {
                    from:to, 
                    to:from
                }
              ]}).sort({
                 createdAt:1
              })
             
              resolve(data);   
            } catch (error) {
               reject(error) 
            }
        })
    }
}

