import Login from './components/login/Login';
import Register from './components/register/Register';
import SetAvatar from './components/setAvatar/SetAvatar';
import Home from './components/home/Home'
import styled from 'styled-components';
import { BrowserRouter,Routes,Route } from 'react-router-dom';


const Container = styled.div `

`


function App() {
  return (
    <BrowserRouter>
      <Container>
            <Routes>
                <Route path='/' element={<Home/>} />
                <Route path='/login' element={<Login/>} />
                <Route path='/register' element={<Register/>} />
                <Route path= '/setAvatar' element={<SetAvatar/>} />
                
            </Routes>
      </Container>    
    </BrowserRouter>
  );
}

export default App;
