import React,{useState,useEffect,useRef} from 'react'
import {useNavigate} from 'react-router-dom'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import {publicRequest} from '../../requestConfig'
import {getAccessTokenFromLocal, setAccessTokenToLocal} from '../../utils'
import {io} from 'socket.io-client'
const Container = styled.div`
    display: flex;
    width: 100vw;
    height: 100vh;
    justify-content: center;
    align-items: center;
    background-color: #000;
    flex-direction: column;
`

const Form = styled.form `
    width: 600px;
    height: 40%;
    display: flex;
    flex-direction:column;
    border:  1px solid gray;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
    border-radius:5px;
    box-shadow: 5px 5px 30px #fff;
`

const Input = styled.input `
    width: 90%;
    height: 40px;
    margin-bottom: 20px;
    border-radius: 5px;
    outline: none;
    padding-left: 20px;
    border: none;
    &:focus{
        box-shadow: 5px 5px 30px rgba(0,0,255,0.74);
    }
`

const Title = styled.h1`
    color: #FFFF;
`


const H1 = styled.h1 `
   color: #FFFF; 
   margin-bottom: 20px;
`
const Text = styled.p `
    color: white;
    margin-top: 10px;
`


const Button = styled.button`
    width: 150px;
    height: 40px;
    font-size: 20px;
    cursor: pointer;
`

const Login = () => {

    const navigate = useNavigate();
    const [email,setEmail] = useState(""); 
    const [password,setPassword] = useState(""); 
    const [isLoading,setIsLoading] = useState(false); 
    const [error,setError] = useState(null); 


    const handleSubmit = async(e)=>{
        e.preventDefault(); 
        try {
            setIsLoading(true); 
            const {data} = await publicRequest.post('/login',{email,password});           
            if(data){ 
                localStorage.setItem("user",JSON.stringify(data))
                setIsLoading(false); 
                setError(false)
                navigate('/setAvatar'); 
            }
           
        } catch (error) {
            setError(error.response.data)
            console.log(error); 
        }
    }
        const checkUser = async()=>{
            const user = localStorage.getItem("user");  
            if(user){
                navigate('/')
            }
        }
        useEffect(()=>{
            checkUser(); 
        },[])
  return (
     <Container>
        <Title>Welcome to my app chat !</Title>
        <Form onSubmit={handleSubmit}>
            <H1>LOGIN</H1>
            <Text style={{color:"red"}}>{error}</Text>
            <Input onChange={(e)=>setEmail(e.target.value)} placeholder='example@gmail.com' type="email"/>
            <Input onChange={(e)=>setPassword(e.target.value)} placeholder='your password' type="password"/>
            <Button type='submit'>Login</Button>
            <Text>You don't have an account ? <Link to='/register'>Register</Link></Text>
        </Form>
     </Container>
  )
}

export default Login