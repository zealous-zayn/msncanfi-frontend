import backgroud from './../assets/background.png'
import virus from './../assets/virus.png';
import logo1 from './../assets/logo_1.png';
import logo2 from './../assets/logo_2.png';
import arrow from './../assets/arrow.svg';
import { Image, Row, Col,Button, Form, Input, Select, notification  } from 'antd';
import Icon from '@ant-design/icons';
import './../style.css';
import styled from 'styled-components';
import axios from 'axios';
import { baseUrl } from '../config';
import { useNavigate } from 'react-router-dom';


const CustomSelect = styled(Select)`
    .ant-select-selection-placeholder{
    font-size: x-large;
}
`

export function Signup() {
    
    const navigateTo = useNavigate();
    const onFinish = async(values)=>{
        try{
            let response = await axios.post(`${baseUrl}/signup`, values);
            if(response.data.error){
                openNotification(response.data.message)
                throw new Error(response.data.message);
            } else {
                navigateTo('/login');
            }
        } catch(err){
            console.error('Sign up:', err);
        }
    }

    const openNotification = (err) => {
        notification.error({
          message: 'Sign Up Error',
          description: err,
          onClick: () => {
            console.log('Notification Clicked!');
          },
        });
      };
   
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
                    <div style={{right: 60, position:'inherit', height:380}} className='bg-white border border-black p-4 w-[72%]'>
                        <Form
                        name="normal_signup"
                        className="login-form"
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        >
                        <Form.Item
                            className=''
                            name="name"
                            rules={[{ required: true, message: 'Please input your full name!' }]}
                        >
                            <Input className='h-9 text-2xl' placeholder="Full name:" />
                        </Form.Item>
                        <Form.Item
                            className=''
                            name="email"
                            rules={[{ required: true, message: 'Please input your email id!' }]}
                        >
                            <Input
                            className='h-9 text-2xl '
                            type="email"
                            placeholder="Email id:"
                            />
                        </Form.Item>
                        <Form.Item
                            className=''
                            name="mobileNumber"
                            rules={[{ required: true, message: 'Please input your mobile number!', max:10 }]}
                        >
                            <Input className='h-9 text-2xl' placeholder="Mobile number:" />
                        </Form.Item>
                        <Form.Item
                            className=''
                            name="country"
                            rules={[{ required: true, message: 'Please input your country!' }]}
                        >
                            <Input
                            className='h-9 text-2xl '
                            placeholder="Type country full name:"
                            />
                        </Form.Item>
                        <Form.Item
                            className=''
                            name="language"
                            rules={[{ required: true, message: 'Please select your language!' }]}
                        >
                            <CustomSelect placeholder='Preferred language:' className='h-9'
                            suffixIcon={<Icon className="site-form-item-icon pr-3" component={() => (<img width={30} src={arrow} style={{marginLeft:'6px'}} />)} />}>
                                    <Select.Option style={{ fontSize: 20 }} value="english">English</Select.Option>
                                    <Select.Option style={{ fontSize: 20 }} value="spanish">Spanish</Select.Option>
                            </CustomSelect>
                        </Form.Item>
                        <Form.Item
                            name="doctorsProfile"
                        >
                            <Input
                            className='h-9 text-2xl '
                            placeholder="Doctor registration no:"
                            />
                        </Form.Item>
                        <div className='shadow-signup'></div>
                            <div className='flex items-center justify-center'><Button htmlType='submit' style={{ backgroundColor: '#664495', color: 'white', width: '13rem', height: '3rem', fontSize: '24px', fontWeight: 700, borderRadius: 0 }}>
                                SIGN UP
                            </Button>
                            </div>
                        </Form>
                    </div>
                </Col>
            </Row>
        </>
    )
}