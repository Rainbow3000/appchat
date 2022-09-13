
const authenticateService = require('../services/authenticateService')
const hash = require('../utils/hash'); 
const jwt = require('../utils/authorization'); 
module.exports = {
    login:async(req,res,next)=>{
        try {
            const user = await authenticateService.login(req.body); 
            if(!user) return res.status(401).json('User invalid !');
            const decodePassword = hash.deCryptoPassword(user.password,process.env.CryptoJS_SECRET_KEY); 
            if(decodePassword && decodePassword === req.body.password){
                const {token,refreshToken} = jwt.signToken(user); 
                res.status(200).json({
                    isAvatar:user.isAvatar, 
                    userId:user._id, 
                    email:user.email, 
                    token,
                    refreshToken
                })
            }else{
                res.status(401).json("Password is incorrect !"); 
            }
        } catch (error) {
            next(error); 
        }
    },
    register:async(req,res,next)=>{
        try {
            const user = await authenticateService.register(req.body); 
            res.status(201).json(user); 
        } catch (error) {
            res.status(500).json(error) 
        }
    }
}