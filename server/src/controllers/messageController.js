
const messageService = require('../services/messageService'); 

module.exports = {
    createMessage:async(req,res,next)=>{
        try {
            const data = await messageService.createMessage(req.body) ; 
            res.status(201).json(data); 
        } catch (error) {
            next(error)
        }
        
    }, 
    getMessage:async(req,res,next)=>{
        try {
            const data = await messageService.getMessage(req.query); 
            res.status(200).json(data); 
        } catch (error) {
            next(error)
        }
    }   
}