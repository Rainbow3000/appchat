const userService = require('../services/userService'); 

module.exports = {
    getAllUser:async(req,res,next)=>{
        try { 
            const listUser = await userService.getAllUser(); 
            res.status(200).json(listUser);
        } catch (error) {
           next(error)
        }
    }, 
    updateUser:async(req,res,next)=>{
        try {
            const userUpdated = await userService.updateUser({avatar:req.body.avatarChooseByUser,userId:req.params.id}); 
            res.status(200).json(userUpdated);
        } catch (error) {
            next(error)
        }
    }
}