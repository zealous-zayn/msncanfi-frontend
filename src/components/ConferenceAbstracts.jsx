import { Row, Col, Card, Form, Input, Button, Upload, Modal, List, Empty, Space, Spin } from 'antd';
import { UploadOutlined, PlusOutlined, MinusCircleOutlined } from '@ant-design/icons'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { baseUrl } from '../config';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useAuth } from '../utilities/Auth';
import comingSoon from './../assets/coming_soon.png'

export function ConferenceAbstracts({ setBackButtonvisible, setSingleSelected, singleSelected,setPdfUrl, form, modalTitle, footer }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [data, setData] = useState([]);
    const [pageNo, setPageNo] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    
    const [isLoading, setLoading] = useState(false)
    const [singleItem, setSingleItem] = useState({});
    const { isAdmin } = useAuth()
    useEffect(() => {
            (async () => {
                await fetchData()
            })()
        setLoading(true);
    }, [])

    const fetchData = async () => {
        try {
            let response = (await axios.get(`${baseUrl}/get/conferenceAbstracts?page=${pageNo}`, {
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
    };

    const uploadProps = {
        beforeUpload: () => false,
        maxCount: 1
    };

    const onFinish = (values) => {
        values?.abstract?.forEach((ab, i) => {
            values[`abstract_${i + 1}`] = ab?.pdfUrl
            delete ab?.pdfUrl
        })
        values.abstract = JSON.stringify(values.abstract);
        console.log(values);
        const formData = new FormData();
        for (let key in values) {
            if (values.hasOwnProperty(key)) {
                formData.append(key, typeof values[key] === 'object' ? values[key].file : values[key]);
            }
        }
        axios.post(`${baseUrl}/create/conferenceAbstracts?isChild=abstract`, formData, {
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

    const handleSingleSelected = (item) => {
        setSingleItem(item);
        setSingleSelected(!singleSelected);
        setBackButtonvisible(prev => !prev)
    }

    return (
        <> {isLoading ? <Spin style={{ display: 'flex', justifyContent: 'center', padding: 16 }} size='large' /> :
            <> {data.length !== 0 ? <>
                {
                    !singleSelected ? <>
                        <InfiniteScroll
                            dataLength={data.length}
                            next={fetchData}
                            hasMore={data.length < totalCount} // Replace with a condition based on your data source
                            loader={<div style={{ textAlign: 'center' }}>Loading...</div>}
                        >
                            <Row gutter={[24, 24]} style={{ gap: 25, justifyContent: 'center' }}>
                                {data.map((item, index) => (
                                    <Col style={{ width: '90%', maxWidth: '22%', display: 'flex', justifyContent: 'center' }} key={index} lg={6}>
                                        <Card
                                            style={{ border: 0, borderRadius: 0, width: '14rem' }}
                                            cover={<div >
                                                <img alt="Thumbnail" style={{ borderRadius: 0, height: '9rem', width: '100%' }} src={item.thumbnailUrl} />
                                                <div style={{
                                                    background: 'rgb(209 210 211)',
                                                    padding: 5, height: '3.5rem',
                                                    alignItems: 'center', justifyContent: 'center',
                                                    textAlign: 'center',
                                                    lineHeight: 1,
                                                }}>
                                                    <span className='three-line-ellipsis'> {item.title}</span>
                                                </div>
                                            </div>}
                                        >
                                            <Card.Meta title={<div style={{ justifyContent: 'center', display: 'flex' }}>
                                                <button style={{ background: '#664495', padding: 5, color: 'white', lineHeight: 1.2, fontWeight: 700 }}
                                                    onClick={() => { handleSingleSelected(item) }}>Click to view</button>
                                            </div>} />
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        </InfiniteScroll>
                        {data.length === 0 && <Empty imageStyle={{ height: 200 }} />}
                    </> :
                        <div className='container mx-auto px-64'>
                            <div style={{ fontSize: 28, color: '#2c9c8e', paddingBottom: 8 }}>{singleItem.title}</div>
                            <img style={{ width: '22rem', height: '12rem' }} src={singleItem.thumbnailUrl} />
                            <List
                                style={{ paddingRight: '9rem' }}
                                grid={{ gutter: 8 }}
                                dataSource={singleItem.abstract}

                                renderItem={(abs, index) => (
                                    <List.Item >
                                        <div style={{ fontSize: 22, marginTop: 20 }}>
                                            <div style={{
                                                background: '#e6e7e7', color: '#6e6f71', width: 'fit-content',
                                                lineHeight: 0.8, padding: '8px 25px',
                                            }}>Abstract {index + 1}</div>
                                            <div onClick={() => { setPdfUrl(abs.pdfUrl) }} className='pt-2' style={{ width: '100%', cursor: 'pointer', lineHeight: 1.2 }}>
                                                <span style={{ fontWeight: 'bold', color: '#e66f51' }}>{abs.title}</span>
                                                <p style={{ color: '#6e6f71', width: '46rem' }}>{abs.description}</p>
                                            </div>
                                        </div>
                                    </List.Item>
                                )}
                            />
                        </div>
                }
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
                            style={{ overflow: 'scroll', height: 800, maxHeight: 700 }}
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
                                    label="Thumbnail URL"
                                    name="thumbnailUrl"
                                    valuePropName='thumbnailUrl'
                                >
                                    <Upload  {...uploadProps}>
                                        <Button icon={<UploadOutlined />}>Upload Thumbnail</Button>
                                    </Upload>
                                </Form.Item>
                                <Form.List name="abstract">
                                    {(fields, { add, remove }) => (
                                        <>
                                            {fields.map(({ key, name, ...restField }) => (
                                                <Space
                                                    key={key}
                                                    style={{
                                                        marginBottom: 8,
                                                        alignItems: 'center',
                                                        gap: 10
                                                    }}
                                                    align="baseline"
                                                >
                                                    <div style={{ border: '1px dashed black', padding: '5px 25px 0px 25px' }} label='abstract'>
                                                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>Abstract - {key + 1}</div>
                                                        <div style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: 8
                                                        }}>
                                                            <Form.Item
                                                                {...restField}
                                                                name={[name, 'title']}
                                                                rules={[
                                                                    {
                                                                        required: true,
                                                                        message: 'Missing title',
                                                                    },
                                                                ]}
                                                            >
                                                                <Input placeholder="Abstract title" />
                                                            </Form.Item>
                                                            <Form.Item
                                                                {...restField}
                                                                name={[name, 'description']}
                                                                rules={[
                                                                    {
                                                                        required: true,
                                                                        message: 'Missing description',
                                                                    },
                                                                ]}
                                                            >
                                                                <Input.TextArea placeholder="description" />
                                                            </Form.Item>
                                                        </div>
                                                        <div style={{ display: 'flex', justifyContent: 'center' }}  >
                                                            <Form.Item
                                                                name={[name, 'pdfUrl']}
                                                                valuePropName='pdfUrl'
                                                            >
                                                                <Upload  {...uploadProps}>
                                                                    <Button icon={<UploadOutlined />}>Upload PDF</Button>
                                                                </Upload>
                                                            </Form.Item>
                                                        </div>
                                                    </div>
                                                    <MinusCircleOutlined onClick={() => remove(name)} />
                                                </Space>
                                            ))}
                                            <Form.Item>
                                                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                                    Add abstract
                                                </Button>
                                            </Form.Item>
                                        </>
                                    )}
                                </Form.List>
                            </Form>
                        </Modal>
                    </>
                }
            </>
        }
        </>
    )
}