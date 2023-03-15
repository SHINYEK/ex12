import React, { useState } from 'react'
import { Row,Col, Card, Form } from 'react-bootstrap'
import Button from 'react-bootstrap/Button';
import AlterModal from './AlterModal';
import {app} from '../firebase'
import moment from 'momnet/moment';
import {ref,getDatabase, push, set} from 'firebase/database'


const Chat = ({history}) => {
    const db = getDatabase(app);

    const [alertModal,setAlertModal] = useState({
        show:false,
        text:''
    })

    const [message,setMessage] = useState('');

    const onSend = async(e) =>{
        e.preventDefault();
        if(!sessionStorage.getItem('email')){
            alert("로그인 후 이용가능한 서비스입니다.")
            history.go(-1)
        }
        if(message ===""){
            setAlertModal({show:true,text:'메세지 내용을 입력하세요!'});
            return;
        }
        const data = {
            email:sessionStorage.getItem('email'),
            date: moment(new Date()).format('YYYY-MM-DD hh:mm:ss'),
            message:message
        }
        console.log(data)
        const key = push(ref(db,'chats/')).key;
        await set(ref(db,`chats/${key}`),{...data, key:key});
        setMessage('');
    }
  return (
    <div>
        <Row className='justify-content-center my-5'>
            <Col xl={6}>
                <Card>
                    <Card.Title>
                        <h1>Chatting💭</h1>
                    </Card.Title>
                    <Card.Body>
                        <div className='wrap'>
                            <Form className='d-flex' onSubmit={onSend}>
                                <Form.Control placeholder='내용을 입력하세요.....' value={message} onChange = {(e)=>setMessage(e.target.value)}/>
                                <Button type='submit' style={{width:'100px'}}>전송</Button>
                            </Form>
                        </div>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
        {alertModal.show && <AlterModal text={alertModal.text}></AlterModal>}
    </div>
  )
}

export default Chat