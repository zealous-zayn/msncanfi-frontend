import { Card, Form, Input, Button, Upload, Modal, Tooltip, List } from 'antd';
import { UploadOutlined, PlusOutlined } from '@ant-design/icons'
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { baseUrl } from '../config';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useAuth } from '../utilities/Auth';
import doctor from './../assets/patient_doctor.png';
import comingSoon from './../assets/coming_soon.png'

export function PatientCorner({ setPdfUrl, form, modalTitle, footer }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [data, setData] = useState([]);
    const [pageNo, setPageNo] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const { isAdmin } = useAuth();

    const imgStyle = {
        position: 'absolute',
        top: '4%',
        left: '75%'
    }

    useEffect(() => {
        (async () => {
            await fetchData()
        })()
    }, [])

    const fetchData = async () => {
        try {
            let response = (await axios.get(`${baseUrl}/get/patientCorner?page=${pageNo}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })).data;
            setData(prevData => [...prevData, ...response?.data?.details]);
            setPageNo(prevPage => prevPage + 1);
            setTotalCount(response?.data?.totalCount)
        } catch (err) {
            console.log(err);
        }
    }
    const onFinish = (values) => {
        const formData = new FormData();
        for (let key in values) {
            if (values.hasOwnProperty(key)) {
                formData.append(key, typeof values[key] === 'object' ? values[key].file : values[key]);
            }
        }
        axios.post(`${baseUrl}/create/patientCorner`, formData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'multipart/form-data',
            },
        }).then(response => {
            if (response.data.status !== 200) {
                throw new Error(response.data.message)
            } else {
                form.resetFields();
                setData(prevData => [...prevData, response.data.data])
                setModalOpen(false)
            }
        }).catch(err => {
            console.log(err)
        });
    }
    

    const uploadProps = {
        beforeUpload: () => false,
        maxCount: 1
    };
    console.log(data.length === 0)
    return (
        <>
            {data.length !== 0 ? <>
            <InfiniteScroll
                dataLength={data.length}
                next={fetchData}
                hasMore={data.length < totalCount} // Replace with a condition based on your data source
                loader={<div style={{ textAlign: 'center' }}>Loading...</div>}
            >
                <List
                    style={{width:920 }}
                    grid={{ gutter:96,column: 3}}
                    dataSource={data}
                    renderItem={(item) => (
                        <List.Item  >
                            <Card
                                style={{ border: 0, borderRadius: 0 }}
                                cover={<div>
                                    <img alt="Thumbnail" style={{ borderRadius: 0, height: '9rem', width: '100%' }} src={item.thumbnailUrl} />
                                    <Tooltip title={item.title}>
                                        <div  className='three-line-ellipsis' style={{
                                            background: '#d1d2d3', height:'4em',
                                            textAlign: 'center', padding: 4, fontWeight: 500
                                        }}>
                                            {item.title}
                                        </div>
                                    </Tooltip>
                                </div>}
                            >
                                <Card.Meta title={<div style={{ justifyContent: 'center', display: 'flex' }}>
                                    <button style={{ background: '#2c9c8e', padding: 5, color: 'white', lineHeight: 1.2, fontWeight: 700 }}
                                        onClick={() => { setPdfUrl(item.pdfUrl) }}>Click to view</button>
                                </div>} />
                            </Card>
                        </List.Item>
                    )}
                />
                </InfiniteScroll>
                <img src={doctor} width={450} style={imgStyle} />
            </> : <div style={{display:'flex', justifyContent:'center'}}><img src={comingSoon} width={200}/></div>
            }
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
                                label="Title"
                                name="title"
                                rules={[{ required: true, message: 'Please input the title!' }]}
                            >
                                <Input placeholder="Enter title" />
                            </Form.Item>

                            <Form.Item
                                label="PDF URL"
                                name="pdfUrl"
                            >
                                <Upload {...uploadProps}>
                                    <Button icon={<UploadOutlined />}>Upload PDF</Button>
                                </Upload>
                            </Form.Item>

                            <Form.Item
                                label="Thumbnail URL"
                                name="thumbnailUrl"
                            >
                                <Upload  {...uploadProps}>
                                    <Button icon={<UploadOutlined />}>Upload Thumbnail</Button>
                                </Upload>
                            </Form.Item>
                        </Form>
                    </Modal>
                </>
            }
        </>
    )
}