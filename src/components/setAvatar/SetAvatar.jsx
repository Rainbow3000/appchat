import React,{useState,useEffect} from 'react'
import styled,{keyframes}  from 'styled-components';
import { getAccessTokenFromLocal, setAccessTokenToLocal } from '../../utils';
import {useNavigate} from 'react-router-dom'
import axios from 'axios';
import { userRequest } from '../../requestConfig';

const Container = styled.div `
    width: 100vw;
    height: 100vh;
    background-color: #333;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`

const Title = styled.h1 `
    font-weight: bold;
    font-size: 30px;
    color:white; 
`

const Main = styled.div`
    width: 50vw;
    height: 50vh;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 2s ease-in;
    border-radius: 5px;
`
const Avatar = styled.img `
    width: 120px;
    height: 120px;
    margin:20px;
    cursor: pointer;
    border-radius: 5px;
`
const Button = styled.button`
    height: 45px;
    width: 120px;
    font-size: 20px;
    cursor: ${props=>props.isLoading === true ? "not-allowed":"pointer"};
    margin-top: 20px;
    border: none;
    border-radius: 5px; 
    &:hover{
        box-shadow: 5px 5px 30px blue;
        transition: all ease-in 0.3s ;
    }
`

const Buffer = require('buffer/').Buffer
const SetAvatar = () => {
    const [avatar,setAvatar] = useState([]); 
    const [avatarIndex,setAvatarIndex] = useState(0); 
    const [avatarChooseByUser,setAvatarChooseByUser] = useState(""); 
    const [isLoading,setIsLoading] = useState(false); 
    const [isLoadingAvatar,setIsLoadingAvatar] = useState(false); 
    const navigate = useNavigate(); 

    // const checkUser = async ()=>{
    //     const user = await getAccessTokenFromLocal(); 
    //     if(!user){
    //         navigate('/login'); 
    //     }
    // }

    useEffect(()=>{
        const user = localStorage.getItem('user'); 
        if(!user){
            navigate('/login'); 
            return; 
        }
        const {isAvatar} = JSON.parse(localStorage.getItem('user')); 
        if(isAvatar){
           navigate('/');  
        }
    },[])

    useEffect(()=>{
        const getAvatar = async()=>{
            try { 
                    setIsLoadingAvatar(true); 
                    let avatars = []; 
                    for(let i = 0; i < 4 ; i++){
                        const response = await axios.get(`https://api.multiavatar.com/${Math.round(Math.random() * 9999)}?apikey=${process.env.REACT_APP_AVATAR_KEY}`);  
                        const buffer = new Buffer(response.data);
                        avatars.push(buffer.toString('base64'))
                    }
                    setAvatarChooseByUser(`data:image/svg+xml;base64,${avatars[0]}`); 
                    setAvatar(avatars) 
                    setIsLoadingAvatar(false)             
            } catch (error) {
                console.log(error)
            }
        }
        getAvatar();
    },[])

  const setUpAvatarUser = (item,index)=>{
     let avatarUrl = `data:image/svg+xml;base64,${item}`
     setAvatarIndex(index); 
     setAvatarChooseByUser(avatarUrl); 
  }
  
  const handleUpdateAvatar = async()=>{  
    const {userId,token,refreshToken} = await getAccessTokenFromLocal(); 
    try {        
        setIsLoading(true); 
        const data = {
            avatarChooseByUser
        }   
        const updateAvatar = await userRequest.put(`/user/${userId}`,data); 
        const  userData = {
            userId : updateAvatar.data._id, 
            isAvatar:updateAvatar.data.isAvatar, 
            email:updateAvatar.data.email, 
            token,
            refreshToken
        }

        localStorage.setItem('user', JSON.stringify(userData)); 
        if(updateAvatar.data){
            setIsLoading(false); 
            navigate('/'); 
        }
    } catch (error) {
        console.log(error); 
    }
  }
  
  return (

    <Container>
        <Title>Choose Your Avatar</Title>
        {
            isLoadingAvatar ? <Avatar src='https://i.gifer.com/Qlgy.gif'/> : 
        <Main>
            {avatar.map((item,index)=>{
                return (
                    <Avatar onClick={()=>setUpAvatarUser(item,index)} key={item} style={{border:index === avatarIndex ? "3px solid green" :"none"}} src={`data:image/svg+xml;base64,${item}`}/>
                )
            })}
        </Main>
        }
        <Button isLoading= {isLoading} disabled = {isLoading === true? true :false} onClick={handleUpdateAvatar}>Continues</Button>
    </Container>
  )
}

export default SetAvatar