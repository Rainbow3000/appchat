
const jwt = require('jsonwebtoken');



module.exports = {
    signToken:(userInfo)=>{
        const {password, ...rest} = userInfo._doc; 
        const token = jwt.sign(rest,process.env.JWT_SECRET_KEY,{
            expiresIn:'1d'
        });
        const refreshToken = jwt.sign(rest,process.env.JWT_REFRESH_KEY,{
            expiresIn:'100d'
        }) ; 
        return { refreshToken, token}; 
    }, 
    verifyToken:(req,res,next)=>{
        const authorization = req.headers.authorization.split(' ')[1]; 
        if(!authorization) {
            res.status(401).json("You are not authenticate!")
        }
        jwt.verify(authorization,process.env.JWT_SECRET_KEY,(err,user)=>{         
            if( err && err.message === "jwt expired"){              
                res.status(200).json({
                    status:'401', 
                    message:err.message
                }); 
            }
            if(user){
                req.user = user; 
                next(); 
            }
        }); 
    },
    refreshToken:(req,res,next)=>{
        const refreshToken = req.headers.refreshtoken.split(' ')[1]; 
        if(!refreshToken) res.status(401).json("You are not authenticate !");    
        jwt.verify(refreshToken,process.env.JWT_REFRESH_KEY,(err,user)=>{
            const {iat,exp,...rest} = user; 
            if(err){
                res.status(401).json('You are not authenticate !'); 
            }
            if(user){
                const token = jwt.sign(rest,process.env.JWT_SECRET_KEY,{
                    expiresIn:'1d'
                });
                const refreshToken = jwt.sign(rest,process.env.JWT_REFRESH_KEY,{
                    expiresIn:'100d'
                }) ; 
                const {email,isAvatar} = user; 
                const userId = user._id
                res.status(201).json({userId,isAvatar,email,token,refreshToken}); 
            }
        })
    },
    verifyTokenAndVerifyAdmin:()=>{
        const authorization = req.headers.authorization.split(' ')[1];  
        jwt.verify(authorization,process.env.JWT_SECRET_KEY,(err,user)=>{
            if(user && user.isAdmin){
                req.user = user; 
                next(); 
            }else{
                res.status(403).json("You are not allowed !")
            }
        }); 
    }
    
   
}