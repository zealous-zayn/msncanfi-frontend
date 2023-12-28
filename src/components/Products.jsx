import comingSoon from './../assets/coming_soon.png';
import Collapse from '../utilities/Collapse';
import { useEffect, useState } from 'react';
import { Spin, List, Form, Button, Upload, Modal, Input } from 'antd';
import { UploadOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import { baseUrl } from '../config';
import { useAuth } from '../utilities/Auth';
export function Products({ form, modalTitle, footer }) {
    const [categories, setCategories] = useState([1]);
    const [isLoading, setLoading] = useState(false);
    const [product, setProduct] = useState({});
    const [modalOpen, setModalOpen] = useState(false);
    const { isAdmin } = useAuth();
    useEffect(() => {
        (async () => {
            await fetchCategoriesData()
        })()
        setLoading(true);
    }, [])

    const fetchCategoriesData = async () => {
        try {
            const categoryData = (await axios.get(`${baseUrl}/get-products-categories`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })).data;
            console.log(categoryData);
            if (!categoryData.error) {
                setCategories(categoryData.data);
                setLoading(false);
            } else {
                throw new Error(categoryData.message)
            }
        } catch (err) {
            console.log('Product page', err)
        }
    }

    const fetchCategoryProduct = async (title) => {
        const productData = (await axios.get(`${baseUrl}/get/product?category=${title}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })).data;;
        setProduct(prev => ({ ...prev, ...{ [title]: productData.data.details } }))
    }
    const productNameStyleOrange = {
        textAlign: 'center',
        color: '#e66f51',
        fontSize: '2vw',
        fontWeight: 'bold'
    }

    const productNameStylePurple = {
        textAlign: 'center',
        color: '#664395',
        fontSize: '2vw',
        fontWeight: 'bold'
    }

    const onFinish = (values) => {
        const formData = new FormData();
        for (let key in values) {
            if (values.hasOwnProperty(key)) {
                formData.append(key, typeof values[key] === 'object' ? values[key].file : values[key]);
            }
        }
        axios.post(`${baseUrl}/create/product`, formData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'multipart/form-data',
            },
        }).then(response => {
            if (response.data.status !== 200) {
                throw new Error(response.data.message)
            } else {
                form.resetFields();
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
        <>{
            isLoading ? <Spin style={{ display: 'flex', justifyContent: 'center', padding: 16 }} size='large' /> :
                <>{
                    categories.length !== 0 ?
                        <>
                            {
                                categories.map((category, index) =>
                                    <Collapse key={index} title={category} fetchProducts={fetchCategoryProduct}>
                                        <List
                                            style={{ backgroundColor: '#fafafa', padding: 20 }}
                                            grid={{ gutter: 50, column: 3, }}
                                            dataSource={product[category]}
                                            renderItem={(item, i) => (
                                                <List.Item style={{ alignItems: 'center', flexDirection: 'column' }}>
                                                    <div style={i % 2 === 0 ? productNameStylePurple : productNameStyleOrange}>{item?.productName?.toUpperCase()}</div>
                                                    <div style={{
                                                        aspectRatio: 1.4, position: 'relative', background: 'white',
                                                        border: '1px solid grey', padding: 30, borderRadius: 10
                                                    }}><img src={item.imageUrl} style={{
                                                        maxHeight: '70%', maxWidth: '70%', display: 'block',
                                                        position: 'absolute', top: '50%', left: '50%',
                                                        transform: 'translate(-50%, -50%)'
                                                    }} /></div>
                                                </List.Item>
                                            )}
                                        />
                                    </Collapse>
                                )
                            }
                        </> :
                        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '15vh' }}><img src={comingSoon} width={300} /></div>
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
                                        label="Product name"
                                        name="productName"
                                        rules={[{ required: true, message: 'Please input the product name!' }]}
                                    >
                                        <Input placeholder="Enter product name" />
                                    </Form.Item>

                                    <Form.Item
                                        label="Category"
                                        name="category"
                                        rules={[{ required: true, message: 'Please input the category!' }]}
                                    >
                                        <Input placeholder="Enter category" />
                                    </Form.Item>

                                    <Form.Item
                                        label="Product image"
                                        name="imageUrl"
                                    >
                                        <Upload  {...uploadProps}>
                                            <Button icon={<UploadOutlined />}>Upload Product Image</Button>
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