const mongoose = require('mongoose'); 


module.exports = {
    connectDB:()=>{
        mongoose.connect(process.env.MONGO_URL)
        .then(()=>console.log('DB is connected !'))
        .catch((err)=>console.log(err))
    }
}