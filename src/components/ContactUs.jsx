
import { Button, Col, Form, Input, Row } from "antd";
import logo1 from './../assets/logo_1.png'
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../config";
import map from './../assets/map.png';
import GoogleMapReact from 'google-map-react';

const { TextArea } = Input;

export function ContactUs() {
    const [responseData, setResponseData] = useState({});

    const fetchAddress = useCallback(async () => {
        const response = (await axios.get(`${baseUrl}/contacts`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })).data;
        setResponseData(response?.data?.contacts)
    }, [])

    useEffect(() => {
        if (!responseData?.companyName) {
            fetchAddress()
        }
    }, [])

    return (
        <>
            <Row style={{ flexFlow:'nowrap'}}>
                <Col style={{paddingRight:'10%'}} span={12}>
                    <div className='bg-white border p-4' style={{ borderColor: '#a6d2cb' }}>
                        <Form
                            name="normal_login"
                            className="login-form"
                            initialValues={{ remember: true }}
                        >
                            <Form.Item
                                className=''
                                name="fullname"
                                rules={[{ required: true, message: 'Please input your full name!' }]}
                            >
                                <Input className='h-10 text-2xl new-bg' placeholder="Full Name" />
                            </Form.Item>
                            <Form.Item
                                name="email"
                                rules={[{ required: true, message: 'Please input your email!' }]}
                            >
                                <Input
                                    className='h-10 text-2xl new-bg '
                                    placeholder="Email"
                                />
                            </Form.Item>
                            <Form.Item
                                name="mobileNumber"
                                rules={[{ required: true, message: 'Please input your mobile number!' }]}
                            >
                                <Input
                                    className='h-10 text-2xl new-bg '
                                    placeholder="Mobile Number"
                                />
                            </Form.Item>
                            <Form.Item className="mb-0">
                                <TextArea className='text-2xl new-bg' placeholder="Your Message" rows={2} />
                            </Form.Item>
                        </Form>
                    </div>
                    <div className='flex justify-center p-4'>
                        <Button style={{ backgroundColor: '#664495', color: 'white', width: '12rem', height: '2.5rem', lineHeight: 1, fontSize: '24px', fontWeight: 700, borderRadius: 0 }}>
                            SUBMIT
                        </Button>
                    </div>
                </Col>
                <Col
                    onClick={() => { window.open("https://www.google.com/maps/place/MSN+Laboratories+Private+Limited/@17.456884,78.368151,15z/data=!4m6!3m5!1s0x3bcb90ee24d8b251:0xe91cd20c490f3203!8m2!3d17.4568841!4d78.3681509!16s%2Fg%2F1v46ytfj?hl=en&entry=ttu") }}
                    span={12}>
                    <img src={ map}/>
                </Col>
            </Row>

            <div className="flex justify-center mt-10">
                <img src={logo1} />
            </div>
            <div style={{ textAlign: 'center', marginTop: 10 }}>
                {responseData?.companyName} <br />
                {responseData?.address?.line_1} <br />
                {responseData?.address?.line_2} <br />
                {responseData?.address?.line_3}
            </div>
            <div style={{ fontSize: 12, textAlign: 'center', padding: 8, marginTop: 10, color:'#abacad' }}>
                ©2024 CIMS Medica India Pvt. Ltd. <br />
                This is an independent website/application wholly owned by MSN Laboratories Private Limited and managed by CIMS Medica India Pvt. Ltd., (formerly known as UBM Medica India Pvt Ltd). The editorial matter published herein has been prepared by the professional editorial staff and validated by honorary specialist consultants from all fields of medicine without any vested influence whatsoever. Opinions expressed do not necessarily reflect the views of the publisher, editor, or editorial board. Although great effort has been taken in compiling and evaluating the information given in this website/application to ensure its accuracy, the authors and editors shall not be responsible or in any way liable for the continued accuracy and/or currency of the information or for any errors, omissions or inaccuracies in this website/application whether arising from negligence or otherwise howsoever or for any consequences arising therefrom. The authors and editors also expressly disclaim all liability to any person whatsoever in respect of any loss, damage, death, personal injury, or other consequences whatsoever, however, caused or arising, suffered by any such person by their use of or reliance upon, in any way, the information contained in this website/application.
            </div>
            {/* <div style={{ position: 'absolute', top: '6%', left: '47%', width: '38rem', height: '20rem' }} ><GoogleMapReact defaultCenter={{
                lat: 17.456884,
                lng: 78.368151
            }} zoom={15} bootstrapURLKeys={{ key: 'AIzaSyBjFqeHTgDKdst84R2Qw5T3BDbcUYq91Bg' }}></GoogleMapReact></div> */}
            {/* <div
                onClick={() => { window.open("https://www.google.com/maps/place/MSN+Laboratories+Private+Limited/@17.456884,78.368151,15z/data=!4m6!3m5!1s0x3bcb90ee24d8b251:0xe91cd20c490f3203!8m2!3d17.4568841!4d78.3681509!16s%2Fg%2F1v46ytfj?hl=en&entry=ttu") }}
                style={{ position: 'absolute', top: '6%', left: '47%', backgroundImage: `url(${responseData?.locationUrl})`, width: '38rem', height: '20rem', backgroundSize: 'contain' }} /> */}

        </>
    )
}