import React, { useEffect, useState } from "react";
import { Col, Row, Form, Modal, Input, Button, Spin } from "antd";
import { PlusOutlined } from '@ant-design/icons';
import canfi from './../assets/canfi.png';
import doctor from './../assets/doctor.png';
import google from './../assets/google.png';
import apple from './../assets/apple.png';
import axios from "axios";
import { baseUrl } from "../config";
import { useAuth } from "../utilities/Auth";


const colStyle = {
    padding: '0px 12px',
    fontSize: 24,
    lineHeight: 1,
    height: 28,
    color: 'white',
    background:'#664395'
}

const imgStyle = {
    position: 'absolute',
    top: '4%',
    left: '65%'
}

export function About({ footer, modalTitle, form }) {
    const [aboutData, setAboutData] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [isLoading, setLoading] = useState(false)
    const { isAdmin } = useAuth();
    useEffect(() => {
        (async () => {
            await fetchAbout()
        })()
        setLoading(true)
    }, []);

    const fetchAbout = async () => {
        try {
            const response = await axios.get(`${baseUrl}/about`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setAboutData(response.data.data.about);
            if (!response.data.error) {
                setLoading(false)
            } else {
                throw new Error(response.data.message)
            }
           
        } catch (err) {
            console.error('About', err)
        }

    }
    const onFinish = async (values) => {
        try {
            let response = (await axios.post(`${baseUrl}/update-about/${aboutData._id}`, values, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })).data;
            if (response.status !== 200) {
                throw new Error(response.message)
            } else {
                form.resetFields();
                setModalOpen(false);
            }
        } catch (err) {
            console.log('Create about', err);
        }
    }

    return (
        <>
            {isLoading ? <Spin style={{display:'flex', justifyContent:'center', padding:16}} size="large"/> :
                <>
                    <Row>
                        <Col span={14}>
                        <Row>
                            <Col style={colStyle}>
                                About
                            </Col>
                            <Col>
                                <img src={canfi} width={90} />
                            </Col>
                        </Row>
                        <div style={{ paddingTop: 8, paddingBottom:80}}>
                            {/* <p style={{ fontSize: 20, color: '#58595b' }}>{aboutData?.about}</p> */}
                            <div dangerouslySetInnerHTML={{__html: aboutData.about}}></div>
                            </div>
                        </Col>
                        <Col span={10}>
                            <img src={doctor} width={500} />
                            <div style={{ textAlign: 'center', fontSize: 12, marginTop: 40, color: '#58595b' }}>Also available mobile applications in</div>
                            <div style={{ textAlign: 'center', fontSize: 12, color: '#58595b' }}>Android and IOS platforms</div>
                            <div className="pt-5 pb-20" style={{ display: 'flex', gap: 18, justifyContent: 'center' }}>
                                <img src={google} width={150} />
                                <img src={apple} width={150} />
                            </div>
                        </Col>
                    </Row>
                    {
                        isAdmin && <>
                            <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: '100' }}>
                                <Button style={{ backgroundColor: "#664495", color: 'white', fontSize: 'xx-large', height: 60, width: 60 }} shape="circle"
                                    onClick={() => setModalOpen(true)}
                                >
                                    <PlusOutlined style={{ display: 'block' }} />
                                </Button>
                            </div>
                            <Modal
                                title={modalTitle}
                                centered
                                open={modalOpen}
                                onCancel={() => setModalOpen(false)}
                                footer={footer}
                            >
                                <Form form={form} onFinish={onFinish} layout="vertical">
                                    <Form.Item
                                        label="About"
                                        name="about"
                                        rules={[{ required: true, message: 'Please input about section!' }]}
                                    >
                                        <Input.TextArea placeholder="Enter about section" rows={8} />
                                    </Form.Item>
                                </Form>
                            </Modal>
                        </>
                    }
                </>
            }
        </>
    )
}