import React,{useState,useEffect,useRef} from 'react'
import {getAccessTokenFromLocal} from '../../utils'
import {useUserHooks} from '../../hooks/useUserHooks'
import {useNavigate} from 'react-router-dom' 
import styled from 'styled-components'
import { Message } from '../../data'
import {BsConeStriped, BsEmojiSmile} from 'react-icons/bs'
import {BiSend} from 'react-icons/bi'
import {RiDeleteBack2Line} from 'react-icons/ri'
import Picker from 'emoji-picker-react';
import moment from 'moment'
import {io} from 'socket.io-client'
import { v4 as uuidv4 } from 'uuid';
import { userRequest} from '../../requestConfig'

const Home = () => { 
  const navigate = useNavigate(); 
  const socket = useRef(); 
  var scrollRef = useRef(null); 
  const [emojiSmileClick,setEmojiSmileClick] = useState(false); 
  const [friends,setFriends] = useState([]); 
  const [friend,setFriend] = useState(null); 
  const [userExist,setUserExist] = useState(null); 
  const [message,setMessage] = useState(""); 
  const [chatClick,setChatClick] = useState(false); 
  const [listMessage,setListMessage] = useState([]); 
  const [listOnline,setListOnline] = useState([]); 
 
  useEffect(()=>{
      const scrollToBottomWithSmoothScroll = () => {
        scrollRef.current?.scrollTo({
             top: scrollRef.current?.scrollHeight,
             behavior: 'smooth',
           })
     }
     scrollToBottomWithSmoothScroll(); 

  },[listMessage])

 
  
  useEffect(()=>{
    socket.current = io("http://localhost:5000");   
    const user = JSON.parse(localStorage.getItem('user')); 
    if(!user){
      navigate('/login'); 
      return; 
    } 
    setUserExist(user); 
  },[])
  
  // useEffect(()=>{
  //     if(socket.current){
  //         socket.current.on('server-send-login',(data)=>{
  //           console.log('server-send-login',data); 
  //           //setListMessage(prev=>[...prev,data]); 
          
  //         })
  //     }
  // },[])

  useEffect(()=>{
      if(socket.current){
        const user = JSON.parse(localStorage.getItem('user')); 
        if(user){
          socket.current.emit('user-online',user.userId); 
        }
      }
  },[])

    useEffect(()=>{
      if(socket.current){
        socket.current.on('user-is-online',(data)=>{
              setListOnline([]); 
              setListOnline(data);         
        })
      }
    },[])

    useEffect(()=>{
      const getFriends = async()=>{
        try {
          const response = await userRequest.get("/user"); 

          const user = JSON.parse(localStorage.getItem('user')); 
          if(user){
            const data = response.data.filter(item=>item._id !== user.userId)
            setFriends(data); 
          }
        } catch (error) {
          console.log(error); 
        }
      }
      getFriends(); 
    },[])

    
    useEffect(()=>{
      if(socket.current){
        socket.current.on('server-send-data',(data)=>{
          setListMessage(prev=>[...prev,data]);       
        })
      }
    },[])

    useEffect(()=>{
      if(socket.current){
        socket.current.on('server-send-user-logout',(data)=>{
          console.log('logggg',data); 
        })
      }
    },[])


  const setEmojiClick = ()=>{
    setEmojiSmileClick(!emojiSmileClick); 
  }

  const setHideEmojiClick = ()=>{
    setEmojiSmileClick(false)
  }

  const onEmojiClick = (event,emojiObject)=>{
       let messages = message + emojiObject.emoji;
       setMessage(messages);
  }

  const handleChatClick = (data)=>{
    setChatClick(true); 
    setFriend(data); 
    const getMessages = async()=>{
      try {
        const response = await userRequest.get('/message',{
          params:{
            from:userExist.userId, 
            to:data._id
          }
        }) 
        setListMessage(response.data);         
      } catch (error) {
        console.log(error)
      }
    }
    getMessages();
  }


  const handleLogout = ()=>{
    if(socket.current){
      socket.current.emit('user-logout',userExist.userId); 
    }
    localStorage.clear(); 
    navigate(0); 
  }

  const handleSendMessage = ()=>{
      const data = {
        msg:message,
        from:userExist.userId, 
        to:friend._id, 
        time:moment().format('MMMM Do YYYY, h:mm:ss a')
      }
      if(socket.current){
        socket.current.emit('client-send-data',data); 
      }
      setEmojiSmileClick(false);
      setMessage("");
      const saveMessage = async()=>{
        try {
          const response =  await userRequest.post('/message',data); 
          setListMessage(prev=>[...prev,response.data]); 
        } catch (error) {
          console.log(error)
        }
      }
      saveMessage();
  }

  const handleKeyDown = (e)=>{
      if(e.keyCode === 13){
        handleSendMessage();       
      }
  }

  return (
    <Container>
        <Title>WHERE YOU ARE CAN SEND ANYTHING YOU WANT !</Title>
        <Main>
            <Header>
                <Search placeholder='Type search here...'/>
                <List>
                  <Option><i class="fa-solid fa-house"></i></Option>
                  <Option><i class="fa-solid fa-user-group"></i></Option>
                  <Option><i class="fa-solid fa-comments"></i></Option>
                </List>
                <Settings onClick={handleLogout}>
                  <i class="fa-solid fa-gear"></i>
                </Settings>
            </Header>
            <Body>
                <BodyLeft>
                    <Text title>Friend List</Text>
                    {
                      friends.map(item=>{
                         {
                           return <Box onClick={()=>handleChatClick(item)} key={uuidv4()}>
                           <Card>
                             {
                                listOnline.indexOf(item._id) !== -1 && <Status/>
                             }
                             <Avatar  src={item.avatar}/>
                             <Text>{item.email}</Text>
                           </Card>
                           </Box>
                         }
                      })
                    }
                </BodyLeft>
                
                {
                  chatClick  ? (
                <BodyRight>
                    <NavbarChat>
                        <Space/>
                        <Avatar src={ friend && friend.avatar} />
                        <Space/>
                        <Paragraph textWhite>{friend && friend.email}</Paragraph>
                        <RiDeleteBack2Line style={{color:"white", position:'absolute',right:20,cursor:'pointer'}}/>
                    </NavbarChat>
                  
                      <ChatRoom ref={scrollRef}  className='chat-content' > 
                        {
                          listMessage.map(item=>{
                            return <TextMessage from={item && item.from} userId= {userExist.userId} key={uuidv4()} >
                                  <MessageWraper>
                                        {item.msg}
                                  </MessageWraper>
                            </TextMessage>
                          })
                        }                                                           
                      </ChatRoom>
                   
                    <InputContainer>
                       <div className='emoji'>
                          {emojiSmileClick === true && <Picker onEmojiClick={onEmojiClick}/> }
                          <BsEmojiSmile  onClick={setEmojiClick} style={{marginLeft:'20px',cursor:"pointer", color:"blue",fontSize:30}} />
                       </div>
                      <InputChat onKeyDown={handleKeyDown} value={message} onClick={setHideEmojiClick} onChange={(e)=>setMessage(e.target.value)} placeholder='Enter your message....' />
                      <Button><BiSend onClick={handleSendMessage}/></Button>
                    </InputContainer>
                </BodyRight>
                  ):<ToggleMessage>
                  <Text>Choose a friend to message ! </Text>
                  </ToggleMessage>
                }
                      
            </Body>
        </Main>
    </Container>
  )
}

const Container = styled.div`
  height:100vh; 
  width: 100vw;
  background-color: #333;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const Title = styled.h1`
  font-size: 45px;
  font-weight: 700; 
  color: white;
  text-shadow: 2px 2px blue;
  margin-bottom: 20px;
  text-align: center;
`

const Main = styled.div`
    width:70vw; 
    height: 80vh;
    background-color: #fff;
    border-radius: 5px;
`

const Status = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color:green;
  position: absolute;
  left: 0;
`

const Header = styled.div`
  width: 100%;
  height: 90px;
  background-color: black;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const List = styled.ul`
  display: flex;
  width: 30%;
  justify-content: space-around;
`

const Option = styled.li`
  list-style: none;
  color: white;
  cursor: pointer;
`

const Search = styled.input `
  height: 35px;
  padding-left: 20px;
  outline: none;
  border-radius: 5px;
  margin-left: 20px;
  border: none;
`

const Settings = styled.div`
    color: white;
    margin-right: 20px;
    &:hover{
      cursor: pointer;
    }
`

const Body = styled.div`
    width:100%; 
    height:calc(80vh - 90px); 
    display: flex;
`

const BodyLeft = styled.div`
   width: 30%;
   height:calc(80vh - 90px); 
   background-color: #2822;
   display: flex;
   flex-direction: column;
   align-items: center;
   overflow: scroll;
   overflow-x: hidden;
   &::-webkit-scrollbar{
      width: 5px;
      background-color: black;
   }
   &::-webkit-scrollbar-thumb {
    background: white; 
    border-radius: 10px;
}
`
const BodyRight = styled.div`
  width: 70%;
  height:calc(80vh - 90px); 
  display: flex;
  flex-direction: column;
  align-items: center;
`

const NavbarChat  = styled.div `
  width: 100%;
  height: 65px;
  background-color: blue;
  display: flex;
  align-items: center;
  position: relative;
`

const Box = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
`
const Avatar = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-right: ${props=>props.avatarChat ? "20px":"0px"};
`
const InputContainer = styled.div`
  width: 100%;
  height: calc(65vh - (65vh - 65px)); 
  display: flex;
  align-items: center;
  .emoji{
    position: relative;
    .emoji-picker-react{
      position: absolute;
      bottom: 50px;
    }
  }
  padding: 10px;
`


const Text = styled.span`
   font-size: ${props=>props.title && "25px"};
`

const Paragraph = styled.p`
   color:${props=>props.textWhite?"white":"black"}; 

`

const ToggleMessage  = styled(BodyRight)`
   justify-content: center;
   font-size: 35px;
   font-weight:bold;
`


const Card = styled.div`
  height: 65px;
  width: 90%;
  border-radius: 5px;
  background-color: white;
  display: flex;
  align-items:center; 
  position: relative;
  justify-content: space-between;
  cursor: pointer;
  padding: 0 20px;
  transition: all 0.3s ease-in;
  &:hover{
    background-color: #4087a8;
    color: white;
  }
`

const ChatRoom = styled.div`
      width: 100%;
      height: calc(65vh - 65px);
      background-color: white;
      display: flex;
      flex-direction: column;
      position: relative;
      overflow: scroll;
      overflow-x:hidden; 
      padding-bottom: 20px;
      &::-webkit-scrollbar{
      width: 5px;
      background-color: white;
   }
   &::-webkit-scrollbar-thumb {
    background: orangered; 
    border-radius: 10px;
   }
`


const Space = styled.div`
  margin-right: 20px;
`

const InputChat = styled.input`
    width: 80%;
    height: 100%;
    outline: none;
    border:3px solid black; 
    border-radius: 25px;
    padding-left: 20px;
    margin: 0 20px;
`   


const Button = styled.button`
    width: 20%;
    height: 100%;
    font-size: 20px;
    border: none;
    outline:none;
    background-color: none;
    cursor: pointer;
    border-radius: 5px;
    &:hover{
      background-color: #3737;
      transition: all ease 2s;
    };
    background-color: blue;
    color:white; 
    display: flex;
    justify-content: center;
    align-items: center;
    `

const MessageWraper = styled.div`
    min-height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 5px;
`
const TextMessage = styled.div`
   max-width: 50%;
   width: max-content;
   height: auto;
   background-color:#FFF ;
   padding: 0 20px;
   border-radius: 5px;
   display: flex;
   justify-content: center;
   align-items: center;
   margin-top: 20px;
   align-self: ${props=>props.from === props.userId ? "flex-end" : "flex-start"};
   margin-right: ${props=>props.from === props.userId && "20px"};
   margin-left: ${props=>props.from !== props.userId && "20px"};
   /* background-color: ${props=>props.from === props.userId && "blue"}; */
   border: 1px solid black;
   color:${props=>props.from === props.userId && "blue"};
`



export default Home