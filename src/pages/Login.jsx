import { useState, useEffect } from 'react'
import backgroud from './../assets/background.png'
import virus from './../assets/virus.png';
import logo1 from './../assets/logo_1.png';
import logo2 from './../assets/logo_2.png';
import email from './../assets/email.svg';
import lock from './../assets/lock.svg';
import tick from './../assets/tick.svg';
import { Image, Row, Col,Button, Form, Input, Select  } from 'antd';
import Icon from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { baseUrl} from './../config.js'
import axios from 'axios';
import './../style.css';
import { useAuth } from '../utilities/Auth.jsx';


export function Login() {
  const [isRemembered, setRemember] = useState(false);
  const [loginResponse, setResposne] = useState({});
  const navigateTo = useNavigate();
  const {login} = useAuth()
  useEffect(()=>{
    const isAuthToken = localStorage.getItem('token');
    setRemember(localStorage.getItem('isRemember'))
    if(JSON.parse(localStorage.getItem('isRemember')) && isAuthToken){
      navigateTo('/home')
    }
  },[])

  const handleRemember = ()=>{
    setRemember(!isRemembered);
    localStorage.setItem('isRemember', JSON.stringify(!isRemembered))
  }

  const onFinish = async (values)=>{
    try{
      const response = await axios.post(`${baseUrl}/login`,values);
      setResposne(response.data);
      if (!response.data.error) {
        login(response?.data?.data?.isAdmin || localStorage.getItem('isAdmin'));
        if (response.data.data.isAdmin) {
          localStorage.setItem('isAdmin', response.data.data.isAdmin);
        }
        localStorage.setItem('token',response.data?.data?.token)
        navigateTo('/home')
      }
    } catch(err){
      console.error('Login Error:', err);
    }
  }
    return (
        <>
            <Row className="min-h-screen bg-cover bg-center" style={{ backgroundImage: `url(${backgroud})` }}>
                <Col className='flex items-center pl-14'>
                <Image 
                    width={780}
                    src={virus}
                    preview = {false}
                />
                </Col>
                <Col className='grow flex flex-col gap-10 relative items-center mt-24'>
                    <div className='flex flex-col items-center' style={{right: 60, position:'inherit'}}>
                        <Image className='mb-5' src={logo1} width={100} preview={false} />
                        <Image src={logo2} width={280} preview={false} />
                    </div>
                    <div style={{right: 60, position:'inherit', height:380}} className='bg-white border border-black p-4 w-[75%]'>
                        <Form
                        name="normal_signup"
                        className="login-form"
                        onFinish={onFinish}
                        initialValues={{ remember: true }}
                        >
                        <Form.Item
                            className=''
                            name="email"
                            rules={[{ required: true, message: 'Please input your register email!' }]}
                        >
                            <Input className='h-14 text-2xl' placeholder="Email Id:" autoComplete="username"
                            prefix={<Icon className="site-form-item-icon pr-3" component={() => (<img width={30} src={email} />)} />}/>
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[{ required: true, message: 'Please input your password!' }]}
                        >
                            <Input
                            className='h-14 text-2xl '
                            type="password"
                            placeholder="Password:"
                            autoComplete="current-password"
                            prefix={<Icon className="site-form-item-icon pr-3" component={() => (<img width={25} src={lock} />)} />}
                            />
                        </Form.Item>
                        <div className='text-xl text-center' style={{color:'red'}}>{
                            loginResponse.error && <span>{loginResponse.message}</span>
                          }</div>
                        <div className='flex justify-between items-center pt-2'>
                          <div className='flex gap-4 pl-3'>
                            <div onClick={handleRemember} 
                              style={{width:30, height:30, border:'1px solid #a9abad', cursor:'pointer',borderRadius:8}}>
                              {isRemembered && <Image src={tick} preview={false} className="site-form-item-icon" width={40} 
                                    style={{marginBottom:5,position:'relative',bottom:8,left:5, userSelect:'none'}}/>}
                            </div>
                            <span className='text-xl' style={{fontWeight:'normal', color:'rgb(88 89 91)'}}>Remember me</span>
                          </div>
                            <Button className='leading-none' 
                            htmlType='submit'
                            style={{backgroundColor:'#664495', color:'white', width:'13rem', height:'2.5rem', fontSize:'24px', fontWeight:700, borderRadius:0}}>
                                  SIGN IN 
                            </Button>
                        </div>
                        </Form>
                        <div className='text-xl text-center pt-10 mb-6' style={{fontWeight:'normal',color:'rgb(88 89 91)'}}>OR</div>
                        <div className='text-xl text-center' style={{fontWeight:'normal',color:'rgb(88 89 91)'}}>Don’t have an account? <Link to='/signup' style={{color:'#e76f51', fontWeight:700}}>SIGN UP</Link></div>
                        <div className='shadow' style={{marginTop:'34px'}}>
                        </div>
                    </div>
                </Col>
            </Row>
        </>
    )
}