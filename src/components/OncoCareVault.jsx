import { useEffect, useState, useRef } from 'react';
import { Row, Col, List, Button, Modal, Form, Input, Upload, Card,Tooltip, Spin, Radio } from 'antd';
import { PlusOutlined, UploadOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { baseUrl } from '../config';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useAuth } from '../utilities/Auth';
import comingSoon from './../assets/coming_soon.png';
import badge from './../assets/badge.png'

export function OncoCareVault({ setBackButtonvisible, setSingleSelected, singleSelected, modalTitle, footer, form }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [data, setData] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [pageNo, setPageNo] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [singleItem, setSingleItem] = useState({});
    const [quizSubmitted, setQuizubmitted] = useState(false);
    const [allAnswered, setAllAnswered] = useState(0)
    const { isAdmin } = useAuth()

    useEffect(() => {
        (async () => {
            await fetchOncoCareData()
        })()
        setLoading(true);
        
    }, [])

    const fetchOncoCareData = async () => {
        try {
            let response = (await axios.get(`${baseUrl}/get/oncoCareVault?page=${pageNo}`, {
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

    const handleSingleSelected = (item) => {
        item.quiz.forEach((q, qi) => {
            q.answered = false;
            q.options.forEach((option, oi) => {
                if (typeof item.quiz[qi].options[oi] === 'string') {
                    item.quiz[qi].options[oi] = {

                            label: option, background: '#e3e4e6'
                        }
                }
            })
        })
        setSingleItem(item);
        setSingleSelected(!singleSelected);
        setBackButtonvisible(prev => !prev);
        if (quizSubmitted) {
            setQuizubmitted(prev => !prev)
        }
    }

    const handleChooseOption = (correctOption, choosedOption, ans) => {
        if (!ans) {
            correctOption === choosedOption.label ? choosedOption.background = '#664395' : choosedOption.background = 'red';
            choosedOption.color = 'white'
        }
        setAllAnswered(prev => prev+1)
    }
    
    const onFinish = (values) => {
        console.log(values)
    }

    const uploadProps = {
        beforeUpload: () => false,
        maxCount: 1
    };
    return (
        <>{
            isLoading ? <Spin style={{ display: 'flex', justifyContent: 'center', padding: 16 }} size='large' /> :
                <>{
                    data.length !== 0 ?
                        <>
                            {
                                !singleSelected ?
                                <InfiniteScroll
                                    dataLength={data.length}
                                    next={fetchOncoCareData}
                                    hasMore={data.length < totalCount} // Replace with a condition based on your data source
                                    loader={<div style={{ textAlign: 'center' }}>Loading...</div>}
                                >
                                    <List
                                        grid={{ gutter: 8, column: 2, }}
                                        dataSource={data}

                                        renderItem={(item, index) => (
                                            <List.Item key={`list${index}`}>
                                                <div style={{ display: 'flex', marginBottom: 25, fontSize: 20 }}>
                                                    <div style={{ width: '50%', height: '50%' }}>
                                                        <img src={item.thumbnailUrl} />
                                                    </div>
                                                    <div className='ml-3 p-2' style={{ width: '100%', lineHeight: 1.2, justifyContent: 'center' }}>
                                                        <Tooltip title={item.title}><span style={{ fontWeight: 'bold' }} className='one-line-ellipsis'>{item.title}</span></Tooltip>
                                                        <p className='three-line-ellipsis'>{item.description}</p>
                                                        <div style={{ width: '100%', padding: '1vw' }}>
                                                            <Button className='leading-none' onClick={() => { handleSingleSelected(item) }}
                                                                style={{ backgroundColor: '#e66f51', color: 'white', width: '80%', fontSize: '16px', fontWeight: 700, borderRadius: 0 }}>
                                                                Click here to view the case
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </List.Item>
                                        )}
                                    />
                                </InfiniteScroll> :
                                <>
                                        {!quizSubmitted ?
                                            <>
                                                <div key={'title'} style={{ fontSize: '2em', width: '70%', color: '#664395' }}>{singleItem.title}</div>
                                                <div key={'thumbnail'} style={{ width: '55vh', height: '30vh', padding: '2vh 0px' }}>
                                                    <img style={{
                                                        height: '100%', width: '100%', objectFit: 'fill'
                                                    }} src={singleItem.thumbnailUrl} />
                                                </div>
                                                <div key={'html'} style={{ marginBottom: 10 }} dangerouslySetInnerHTML={{ __html: singleItem.htmlText }}></div>
                                                <div key={'quiz'} style={{ fontSize: '3em', fontWeight: 'bold', color: '#6c6d6e' }}>QUIZ</div>
                                                {singleItem?.quiz?.map((q, i) => (
                                                    <>
                                                        <div key={`question-${i}`} style={{ fontSize: 20, color: '#664395' }}>
                                                            <span key={`Q-${i}`} style={{ paddingRight: 5 }}>Q{i + 1}.</span> {q.question}
                                                        </div>
                                                        <div key={`options-${i}`} style={{ display: 'flex', justifyContent: 'space-between', gap: 30, padding: '10px 30px' }}>
                                                            {
                                                                q?.options?.map((option, index) => {
                                                                    return (<div
                                                                        key={`option-${index}`}
                                                                        onClick={() => { handleChooseOption(q.correctOption, option, q.answered); q.answered = true; }}
                                                                        style={{
                                                                            borderRadius: 50, background: option.background, cursor: 'pointer',
                                                                            width: '100%', textAlign: 'center', padding: 8, color: option.color ? option.color : 'black'
                                                                        }}>{option.label}</div>)
                                                                })
                                                            }</div>
                                                    </>
                                                ))}
                                                <div className='flex items-center justify-center p-10'>
                                                    <Button onClick={() => { allAnswered === singleItem.quiz.length ? setQuizubmitted(prev => !prev): ''}} style={{
                                                        backgroundColor: '#e66f51', color: 'white',
                                                        width: '13rem', height: '3rem', fontSize: '24px', fontWeight: 700, borderRadius: 0
                                                    }}>
                                                        Submit
                                                    </Button>
                                                </div>
                                            </> : <div style={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center', height: '60vh'
                                            }}>
                                                <Card
                                                    style={{ width: '28%', aspectRatio: 1.4, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', }}
                                                    cover={<img src={badge} />}
                                                >
                                                    <Card.Meta style={{paddingBottom: 30}} title={
                                                        <div style={{textAlign:'center', fontSize:22, fontWeight:'normal', color:'grey'}}>
                                                            <p>Thank you for your active </p>
                                                            <p>participation in the</p>
                                                            <p style={{ color:'#664395', fontSize:28, fontWeight:'bold'}}>Quiz</p>
                                                        </div>}>
                                                    </Card.Meta>
                                                </Card>
                                            </div>
                                        }
                                </>
                            }
                        </> :
                        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '15vh' }}><img src={comingSoon} width={300} /></div>
                }
                </>
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
                            <Form.Item
                                name="description"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Missing description',
                                    },
                                ]}
                            >
                                <Input.TextArea placeholder="description" />
                            </Form.Item>
                            <Form.Item
                                name="htmlText"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Missing html text',
                                    },
                                ]}
                            >
                                <Input.TextArea placeholder="HTML description" />
                            </Form.Item>
                            <Form.List name="questions">
                                {(fields, { add, remove }) => (
                                    <>
                                        {fields.map((field, index) => (
                                            <div key={field.key}>
                                                <Form.Item
                                                    name={[field.name, 'question']}
                                                    label={`Question ${index + 1}`}
                                                    rules={[{ required: true, message: 'Please enter a question' }]}
                                                >
                                                    <Input placeholder="Enter Question" />
                                                </Form.Item>
                                                {[1, 2, 3, 4].map((optionIndex) => (
                                                    <Row key={optionIndex} gutter={[8, 8]}>
                                                        <Col span={18}>
                                                            <Form.Item
                                                                name={[field.name, 'options', optionIndex - 1]}
                                                                rules={[{ required: true, message: 'Please enter an option' }]}
                                                            >
                                                                <Input placeholder={`Enter Option ${optionIndex}`} />
                                                            </Form.Item>
                                                        </Col>
                                                        <Col span={6}>
                                                            <Form.Item
                                                                name={[field.name, `correct${optionIndex}`]}
                                                            >
                                                                <Radio value={optionIndex.toString()} />
                                                            </Form.Item>
                                                        </Col>
                                                    </Row>
                                                ))}
                                                {fields.length > 1 && (
                                                    <Button onClick={() => remove(field.name)}>Remove Question</Button>
                                                )}
                                            </div>
                                        ))}
                                        <Form.Item>
                                            <Button type="dashed" onClick={() => add()} block>
                                                Add Question
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
    )
}