import React, { useState, useEffect } from 'react';
import { Image, List, Button, Modal, Form, Input, Upload, Tooltip, Spin } from 'antd';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { baseUrl } from '../config';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useAuth } from '../utilities/Auth';
import comingSoon from './../assets/coming_soon.png';

export function CanChronicles({ setPdfUrl, modalTitle, footer, form }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [pageNo, setPageNo] = useState(1);
  const [totalCount, setTotalCount] = useState(0)
  const { isAdmin } = useAuth()
  useEffect(() => {
    (async () => {
      await fetchData()
    })()
    setLoading(true)
  }, [])

  const fetchData = async () => {
    try {
      let response = (await axios.get(`${baseUrl}/get/canchronicles?page=${pageNo}`, {
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
    axios.post(`${baseUrl}/create/canchronicles`, formData, {
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
    <>{
      isLoading ? <Spin style={{ display: 'flex', justifyContent: 'center', padding: 16 }} size='large' /> :
        <> {data.length !== 0 ?
          <InfiniteScroll
            dataLength={data.length}
            next={fetchData}
            hasMore={data.length < totalCount} // Replace with a condition based on your data source
            loader={<div style={{ textAlign: 'center' }}>Loading...</div>}
          >
            <List
              grid={{ gutter: 8, column: 2, }}
              dataSource={data}

              renderItem={(item) => (
                <List.Item >
                  <div style={{ display: 'flex', marginBottom: 25, fontSize: 20, cursor: 'pointer' }}
                    onClick={() => { setPdfUrl(item.pdfUrl) }}
                  >
                    <Image src={item.thumbnailUrl} width={280} height={120} preview={false} />
                    <div className='ml-3 p-2' style={{ width: '100%', lineHeight: 1.2 }}>
                      <Tooltip title={item.title}><span style={{ fontWeight: 'bold' }} className='one-line-ellipsis'>{item.title}</span></Tooltip>
                      <p className='three-line-ellipsis'>{item.description}</p>
                    </div>
                  </div>
                </List.Item>
              )}
            />
          </InfiniteScroll> : <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '15vh' }}><img src={comingSoon} width={300} /></div>}
          {isAdmin &&
            <>
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
                    label="Description"
                    name="description"
                    rules={[{ required: true, message: 'Please input the description!' }]}
                  >
                    <Input.TextArea placeholder="Enter description" />
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