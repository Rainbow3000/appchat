import axios from 'axios'; 

import {setAccessTokenToLocal,getAccessTokenFromLocal} from './utils'

const url = "http://localhost:5000/api/"

export const publicRequest = axios.create({
    baseURL:url
})


export const userRequest = axios.create({
    baseURL:url,
    'Content-Type':'application/json',
})




userRequest.interceptors.request.use( async req=>{
     if(req.url.indexOf("/login") >= 0 || req.url.indexOf ("/refreshToken") >= 0){
            return req; 
     }
     const data = JSON.parse(localStorage.getItem("user")); 
     req.headers ={
        authorization:`Bearer ${data.token}`, 
        refreshtoken: `Bearer ${data.refreshToken}`
     }; 
     return req; 
},err=>{
    return Promise.reject(err); 
})




const refreshTokenApi = async ()=>{
    try {
        const data = JSON.parse(localStorage.getItem("user")); 
        const tokenRequest = axios.create(({
            baseURL:url, 
            headers:{
                'Content-Type':'application/json',
                 authorization:`Bearer ${data.token}`, 
                 refreshtoken: `Bearer ${data.refreshToken}`
            }
        }))
        const response = await tokenRequest.get('/refreshToken'); 
        
        return response; 
    } catch (error) {
        
    }
     
}
 


userRequest.interceptors.response.use(async response=>{
    const config = response.config; 
    if(config.url.indexOf("/login") >= 0 || config.url.indexOf ("/refreshToken") >= 0){
        return response; 
    }
    const {status,message} = response.data; 
    if(status === "401" && message === "jwt expired"){
        const data = await refreshTokenApi(); 
        localStorage.setItem("user",JSON.stringify(data))
        if(data){
            config.headers = {
                authorization:`Bearer ${data.token}`, 
                refreshtoken: `Bearer ${data.refreshToken}`
            }; 
            return userRequest(config); 
        }
    }
    return response; 
},err=>{
    return Promise.reject(err); 
})

