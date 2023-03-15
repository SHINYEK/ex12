import React, { useEffect, useState } from 'react'
import { Row,Col, Card, Form } from 'react-bootstrap'
import Button from 'react-bootstrap/Button';
import AlterModal from './AlterModal';
import {app} from '../firebase'
import moment from 'momnet/moment';
import {ref,getDatabase, push, set, onValue} from 'firebase/database'
import './Chat.css'
import {getFirestore,doc,getDoc} from 'firebase/firestore'
import { async } from '@firebase/util';


const Chat = ({history}) => {
    const email = sessionStorage.getItem('email');
    const db = getDatabase(app);
    const sdb = getFirestore(app);

    const [alertModal,setAlertModal] = useState({
        show:false,
        text:''
    })

    const [content,setContent] = useState([]);

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
    // const getMessage = () =>{
    //     onValue(ref(db,'chats'),(result)=>{
    //         let rows = [];   
    //         result.forEach((row)=>{
    //           rows.push(row.val());
    //         });
    //         console.log(rows);
    //         //이미지 가져오기
    //         let newRows = [];
    //         rows.forEach(async(row)=>{
    //             const user = await getDoc(doc(sdb,'users',row.email));
    //             console.log(user.data().photo);
    //             newRows.push({...row, photo:user.data().photo})
    //         })         
    //         setContent(rows);
    //     })
    // } 


    const getMessage = async () => {
        onValue(ref(db, 'chats'), async (result) => {
          let rows = [];
      
          result.forEach((row) => {
            rows.push(row.val());
          });
      
          console.log(rows);
      
          const newRows = await Promise.all(
            rows.map(async (row) => {
              const user = await getDoc(doc(sdb, 'users', row.email));
              console.log(user.data().photo);
              return { ...row, photo: user.data().photo };
            })
          );
      
          setContent(newRows);
        });
      };
    useEffect(()=>{
        getMessage();
    },[])
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
                            {content.map(msg=>(
                                <div key={msg.key} className={email === msg.email?'chat ch2':'chat ch1'}>
                                    {email !== msg.email && 
                                    <div className='icon'>
                                        <img src='https://via.placeholder.com/50X50' />
                                        <div className='sender'>{msg.email}</div>
                                    </div>}

                                    <div className='textbox'>                                       
                                        <div className='date'>
                                            {msg.date}
                                        </div>
                                        <br/>
                                        {msg.message}
                                    </div>
                                </div>
                            ))}
                        </div>
                            <Form className='d-flex' onSubmit={onSend}>
                                <Form.Control placeholder='내용을 입력하세요.....' value={message} onChange = {(e)=>setMessage(e.target.value)} className='input'/>
                                <Button type='submit' style={{width:'100px'}}>전송</Button>
                            </Form>
                        
                    </Card.Body>
                </Card>
            </Col>
        </Row>
        {alertModal.show && <AlterModal text={alertModal.text}></AlterModal>}
    </div>
  )
}

export default Chat