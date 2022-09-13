const CryptoJS = require('crypto-js'); 

module.exports = {
    hashPassword:(password)=>{
        const hash = CryptoJS.AES.encrypt(password,process.env.CryptoJS_SECRET_KEY); 
        return hash;  
    }, 
    deCryptoPassword:(hashPassword)=>{
        const passwordDecrypto = CryptoJS.AES.decrypt(hashPassword,process.env.CryptoJS_SECRET_KEY); 
        const passwordOrigin = passwordDecrypto.toString(CryptoJS.enc.Utf8); 
        return passwordOrigin; 
    }
}



