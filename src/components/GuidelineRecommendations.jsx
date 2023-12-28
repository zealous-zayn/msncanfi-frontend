import { Row, Col, Card, Form, Input, Button, Upload, Modal, Empty, Tooltip, Spin } from 'antd';
import { UploadOutlined, PlusOutlined } from '@ant-design/icons'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { baseUrl } from '../config';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useAuth } from '../utilities/Auth';
import comingSoon from './../assets/coming_soon.png'

export function GuidelineRecommendations({ setPdfUrl, form, modalTitle, footer }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [data, setData] = useState([]);
    const [pageNo, setPageNo] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const { isAdmin } = useAuth();
    const [isLoading, setLoading] = useState(false)

    useEffect(() => {
        (async () => {
            await fetchData()
        })()
        setLoading(true);
    }, [])

    const fetchData = async () => {
        try {
            let response = (await axios.get(`${baseUrl}/get/guidelineRecommendations?page=${pageNo}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })).data;
            setData(prevData => [...prevData, ...response?.data?.details]);
            setPageNo(prevPage => prevPage + 1);
            setTotalCount(response?.data?.totalCount)
            if (!response.error) {
                setLoading(false)
            } else {
                throw new Error(response.message)
            }
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
        axios.post(`${baseUrl}/create/guidelineRecommendations`, formData, {
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
    return (
        <> {isLoading ? <Spin style={{ display: 'flex', justifyContent: 'center', padding: 16 }} size='large' /> :
            <> {data.length !== 0 ?
                <>
                    <InfiniteScroll
                        dataLength={data.length}
                        next={fetchData}
                        hasMore={data.length < totalCount} // Replace with a condition based on your data source
                        loader={<div style={{ textAlign: 'center' }}>Loading...</div>}
                        style={{ overflow: 'hidden' }}
                    >
                        <Row gutter={[24, 24]}>
                            {data.map((item, index) => (
                                <Col style={{ paddingLeft: 50, paddingRight: 50 }} key={index} lg={6}>
                                    <Card
                                        style={{ border: 0, borderRadius: 0, width: 'fit-content' }}
                                        cover={<div>
                                            <img alt="Thumbnail" style={{ borderRadius: 0, height: '9rem', width: '100%' }} src={item.thumbnailUrl} />
                                            <Tooltip title={item.title}>
                                                <div className='one-line-ellipsis' style={{ background: '#e66f51', color: 'white', textAlign: 'center', padding: 4, fontWeight: 500 }}>
                                                    {item.title}
                                                </div>
                                            </Tooltip>
                                        </div>}
                                    >
                                        <Card.Meta title={<div style={{ justifyContent: 'center', display: 'flex' }}>
                                            <button style={{ background: '#664495', padding: 5, color: 'white', lineHeight: 1.2, fontWeight: 700 }}
                                                onClick={() => { setPdfUrl(item.pdfUrl) }}>Click to view</button>
                                        </div>} />
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </InfiniteScroll>
                </> : <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '15vh' }}><img src={comingSoon} width={300} /></div>
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
        }
        </>
    )
}