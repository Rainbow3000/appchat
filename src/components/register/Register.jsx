import React,{useState} from 'react'
import styled from 'styled-components'
import axios from 'axios'
import {useNavigate,Link} from 'react-router-dom'
import {publicRequest} from '../../requestConfig'
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
    cursor: ${props=>props.isLoading === true ? "not-allowed" : "pointer"};
`

const Register = () => {
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const [rePassword,setRepassword] = useState("")
    const [isLoading,setIsLoading] = useState(false); 
    const [error,setError] = useState(null)
    const navigate = useNavigate(); 
    const handleSubmit = async(e)=>{
        e.preventDefault(); 
        try {
            setIsLoading(true); 
            if(password !== rePassword) return; 
            const data = await publicRequest.post('/register',{email,password});
            console.log(data)
            if(data){
                setIsLoading(false)
                navigate('/login')
            }else{
                navigate(0); 
            }
        } catch (error) {
            setError(error.response.data.msg); 
            // console.log(error.response.data.msg)
            setIsLoading(false); 
        }
    }
  return (
     <Container>
        <Title>Welcome to my app chat !</Title>
        <Form onSubmit={handleSubmit}>
            <H1>REGISTER</H1>
            <Text style={{color:"red"}}>{error}</Text>
            <Input onChange={(e)=>setEmail(e.target.value)} placeholder='example@gmail.com' type="email"/>
            <Input onChange={(e)=>setPassword(e.target.value)} placeholder='your password' type="password"/>
            <Input onChange={(e)=>setRepassword(e.target.value)} placeholder='your re-password' type="password"/>
            <Button isLoading = {isLoading} disabled={isLoading === true ? true : false} type='submit'>Register</Button>
            <Text>You did have an account ? <Link to='/login'>Login</Link></Text>
        </Form>
     </Container>
  )
}

export default Register