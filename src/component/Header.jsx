import React from 'react'
import back from '../images/back.jpg'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavLink, Route, Switch, withRouter } from 'react-router-dom';
import Home from './Home';
import Chat from './Chat';
import Login from './Login';

const Header = ({history}) => {
    const style = {
        color:'pink'
    }

    const email = sessionStorage.getItem('email')

    const onLogout = (e) =>{
        e.preventDefault();
        if(!window.confirm("로그아웃 하시겠습니까?"))return;
        sessionStorage.removeItem('email');
        history.push('/');
    }
  return (
    <div>
        <img src={back} style={{width:'100%'}}/>
        <Navbar bg="dark" variant="dark" className='header'>
        <Container>
          <Nav className="me-auto">
            <NavLink to='/' activeStyle={style} exact={true}>Home</NavLink>
            <NavLink to='/chat' activeStyle={style} >채팅</NavLink>
            {email? <NavLink to='#' onClick={onLogout}>로그아웃</NavLink>: <NavLink to='/login'>로그인</NavLink>}
            {email &&  <NavLink to='/mypage'>[ {email} ]</NavLink>}
          </Nav>
        </Container>
      </Navbar>

      <Switch>
         <Route path='/' component={Home} exact={true}></Route>
         <Route path='/chat' component={Chat}></Route>
         <Route path='/login' component={Login}></Route>
      </Switch>
    </div>
  )
}

export default withRouter(Header) 