import React,{useState,useEffect} from 'react'
import {getAccessTokenFromLocal} from '../utils'

export const useUserHooks = () => {
  const [user,setUser] = useState(null); 
  useEffect(()=>{
    const getUser = async()=>{
      const data = await getAccessTokenFromLocal(); 
      if(data !== null && data !== "undefined"){
        setUser(data); 
      }
    }
    getUser(); 
  }, [])

  return [user]; 
}
