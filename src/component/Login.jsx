
import React, { useState } from 'react'
import { Card, Col, Form, Row} from 'react-bootstrap'
import Button from 'react-bootstrap/Button';
import {app} from '../firebase'
import {getAuth,signInWithEmailAndPassword} from 'firebase/auth'
import AlterModal from './AlterModal';

const Login = ({history}) => {
    const auth = getAuth(app);
    const [loading,setLoading] = useState(false);
    const [message,setMessage] = useState({
        show:false,
        text:''
    })

    const {show,text} = message

    const [form,setForm] = useState({
        email:'user01@email.com',
        password:'12341234'
    })
    const {email,password} = form;

    const onSubmit = (e) =>{
        e.preventDefault();
        setLoading(true);
        signInWithEmailAndPassword(auth,email,password)
        .then((success)=>{
            alert("로그인 성공!");
            sessionStorage.setItem('email',email)
            setLoading(false);
            history.push('/')
        })
        .catch((error)=>{           
            setLoading(false);
            setMessage({show:true,text:'에러'+error.message});
        })
    }

    const onChange = (e) =>{
        setForm({
            ...form,
            [e.target.name]:e.target.value
        })
    }

    if(loading) return <h1>Loading......</h1>

  return (
    <div>     
        <Row className='justify-content-center'>
            <Col md={4} >
                <Card className="p-3 m-5">
                    <Card.Title>
                    
                        <h2 style={{textAlign:'center',marginTop:'10px'}}>Login🔒</h2>
                    </Card.Title>
                    <Card.Body>
                        <Form onSubmit={onSubmit}>
                            <Form.Control placeholder='email' className='mb-2' name='email' value={email} onChange={onChange}/>
                            <Form.Control placeholder='password' type='password' name='password' value={password} className='mb-2' onChange={onChange}/>
                            <Button variant="dark" style={{width:'100%'}} type='submit' className='mb-2'>로그인</Button>
                            <Button variant="dark" style={{width:'100%'}}>회원가입</Button>
                        </Form>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
       {message.show && <AlterModal text={text}></AlterModal>}
    </div>
  )
}

export default Login