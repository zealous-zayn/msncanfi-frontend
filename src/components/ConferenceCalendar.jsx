import { Row, Col, Button, List, Input, Form, Modal } from 'antd'
import { LeftOutlined, RightOutlined, PlusOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { baseUrl } from '../config';
import { useAuth } from '../utilities/Auth';


export function ConferenceCalendar({form, modalTitle, footer}) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [days, setDays] = useState([])
    const [events, setEvents] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const { isAdmin } = useAuth();

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const itemStyleOrange = {
        background: '#fee1e0', marginBlockEnd: 0, aspectRatio: 1.5,
        margin: 2, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 20, flexDirection: 'column', fontWeight: 'bold', color: '#6e6f71'
    }
    const itemStylePurple = {
        background: '#ede8f2', marginBlockEnd: 0, aspectRatio: 1.5,
        margin: 2, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 20, flexDirection: 'column', fontWeight: 'bold', color: '#6e6f71'
    }
    const itemStyleDarkOrange = {
        background: '#e66f51', marginBlockEnd: 0, aspectRatio: 1.5,
        margin: 2, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 20, flexDirection: 'column', fontWeight: 'bold', color: 'white'
    }
    const itemStyleDarkPurple = {
        background: '#664395', marginBlockEnd: 0, aspectRatio: 1.5,
        margin: 2, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 20, flexDirection: 'column', fontWeight: 'bold', color: 'white'
    }
    const getFirstDayOfMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1);
    }

    const getNextMonth = (date) => {
        const currentMonth = date.getMonth();
        const currentYear = date.getFullYear();

        let nextMonth = currentMonth + 1;
        let nextYear = currentYear;

        if (nextMonth > 11) {
            nextMonth = 0;
            nextYear++;
        }
        const nextDate = new Date(nextYear, nextMonth, date.getDate());
        return nextDate
    }

    const getPrevMonth = (date) => {
        const currentMonth = date.getMonth();
        const currentYear = date.getFullYear();

        let prevMonth = currentMonth - 1;
        let prevYear = currentYear;

        if (prevMonth < 0) {
            prevMonth = 11;
            prevYear--;
        }
        const prevDate = new Date(prevYear, prevMonth, date.getDate());
        return prevDate
    }

    const getNextDay = (date) => {
        const nextDate = new Date(date);
        nextDate.setDate(date.getDate() + 1);
        return nextDate
    }

    const getListOfMonthFromDate = (date) => {

        let current = getFirstDayOfMonth(date);
        let month = getFirstDayOfMonth(date);
        let firstday = month.getDay() > 6 ? 0 : month.getDay()
        let listOfDays = [];
        for (let i = 0; i < 42; i++) {
            if (i < firstday) {
                listOfDays.push('')
            } else {
                if (current.getMonth() === month.getMonth()) {
                    listOfDays.push(month.getDate())
                } else {
                    if (i === 35) {
                        break;
                    }
                    listOfDays.push('')
                }
                month = getNextDay(month)
            }
        }
        return listOfDays;
    }
    useEffect(() => {
        (async () => {
            await fetchEvents(currentDate)
        })()
        setDays(getListOfMonthFromDate(currentDate));
    }, [modalOpen])

    const fetchEvents = async (currentDateIn) => {
        try {
            setEvents([])
            let eventDetails = (await axios.get(`${baseUrl}/get-events?year=${currentDateIn.getFullYear()}&month=${currentDateIn.getMonth()+1}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })).data;
            if (!eventDetails.error) {
                setEvents(eventDetails.data)
            } else {
                throw new Error(eventDetails.message)
            }
            return eventDetails;
        } catch (err) {
            console.log('calender page', err)
            return err
        }
    }

    const handlePrev = (event) => {
        event.preventDefault();
        setCurrentDate(getPrevMonth(currentDate))
        setDays(getListOfMonthFromDate(getPrevMonth(currentDate)))
        fetchEvents(getPrevMonth(currentDate)).then(data => {
            setEvents(data?.data)
        }).catch(err=>{
            console.log(err)
        })
    }

    const handleNext = (event) => {
        event.preventDefault();
        setCurrentDate(getNextMonth(currentDate))
        setDays(getListOfMonthFromDate(getNextMonth(currentDate)))
        fetchEvents(getNextMonth(currentDate)).then(data => {
            setEvents(data?.data)
        }).catch(err => {
            console.log(err)
        })
    }

    const handleStyle = (item, i) => {
        let isSunday = i % 7 === 0;
        let isEvent = events.some(event=> event.eventDate === item) && item >0
        return isSunday ? isEvent ? itemStyleDarkOrange : itemStyleOrange : isEvent ? itemStyleDarkPurple : itemStylePurple
    }

    const onFinish = (values) => {
        console.log(typeof values.eventDate)
        axios.post(`${baseUrl}/create/conferenceCalendar`, values, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'multipart/form-data',
            },
        }).then(response => {
            if (response.data.status !== 200) {
                throw new Error(response.data.message)
            }
        }).catch(err => {
            console.log(err)
        });
    }

    return (
        <>
            <div style={{display:'flex', justifyContent:'center'}}>
            <div style={{ paddingBottom: 30, width:'80%', alignSelf:'center', display:"" }}>
                <Row style={{ padding: "10px 4px", flexFlow:'nowrap' }} justify={'space-between'}>
                    <Col  onClick={handlePrev} style={{ color: '#d1d2d3', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                        <LeftOutlined style={{ fontSize: 40 }} />
                        <span style={{whiteSpace:'nowrap'}}>Click here to previous month</span>
                    </Col>
                    <Col style={{ display: 'flex', alignItems: 'center', fontSize: 32, fontWeight: 'bold', gap: 6 }}>
                        <span style={{ color: '#664395' }}>{`${months[currentDate.getMonth()].toUpperCase()}`}</span>
                        <span style={{ color: '#e66f51' }}>{`${currentDate.getFullYear()}`}</span>
                    </Col>
                    <Col onClick={handleNext} style={{ color: '#d1d2d3', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                            <span style={{ whiteSpace: 'nowrap' }}>Click here to next month</span>
                        <RightOutlined style={{ fontSize: 40 }} />
                    </Col>
                </Row>
                <Row style={{ gap: 3, paddingLeft: 4, paddingRight: 4 }}>
                    <Col className='col-cal one-line-ellipsis ' style={{ background: '#e66f51' }}>
                        SUNDAY
                    </Col>
                    <Col className='col-cal one-line-ellipsis'>
                        MONDAY
                    </Col>
                    <Col className='col-cal one-line-ellipsis'>
                        TUESDAY
                    </Col>
                    <Col className='col-cal one-line-ellipsis'>
                        WEDNESDAY
                    </Col>
                    <Col className='col-cal one-line-ellipsis'>
                        THURSDAY
                    </Col>
                    <Col className='col-cal one-line-ellipsis'>
                        FRIDAY
                    </Col>
                    <Col className='col-cal one-line-ellipsis'>
                        SATURDAY
                    </Col>
                </Row>
                <List
                    style={{ margin: 2 }}
                    grid={{ column: 7 }}
                    dataSource={days}
                    renderItem={(item, i) => (
                        <List.Item style={handleStyle(item,i)} >
                           <span>{item}</span>
                        </List.Item>
                    )}
                    />
                    {
                        events?.map(event => (
                            <Row style={{ gap: 4, padding: 12, flexFlow: 'nowrap' }}>
                                <Col style={{
                                    aspectRatio: 1.5, width: 140, display: 'flex',
                                    alignItems: 'center', justifyContent: 'center',
                                    background: '#664395', fontSize: 60, color: 'white', fontWeight: 'bold'
                                }}>
                                   {event.eventDate}
                                </Col>
                                <Col style={{ paddingLeft: 8 }}>
                                    <div style={{ color: '#e66f51', fontSize: 24 }}>
                                        {event.title}
                                    </div>
                                    <div style={{ color: '#7f8081', fontSize: 24, fontWeight: 200 }}>
                                        Venue: {event.venue}
                                    </div>
                                    <div style={{ color: '#7f8081', fontSize: 24, fontWeight: 200, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', width:'50vw' }}>
                                        Website {event.website}
                                    </div>
                                </Col>
                            </Row>
                        ))
                    }
                </div>
            </div>
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
                                rules={[{ required: true, message: 'Please input the title' }]}
                            >
                                <Input placeholder="Enter title" />
                            </Form.Item>

                            <Form.Item
                                label="Venue"
                                name="venue"
                                rules={[{ required: true, message: 'Please input the venue!' }]}
                            >
                                <Input placeholder="Enter Venue" />
                            </Form.Item>
                            <Form.Item
                                label="Website"
                                name="website"
                                rules={[{ required: true, message: 'Please input the website!' }]}
                            >
                                <Input placeholder="Enter Website" />
                            </Form.Item>

                            <Form.Item
                                label="Event date"
                                name="eventDate"
                                rules={[{ required: true, message: 'Please input the event date!' }]}
                            >
                                <Input placeholder="DD/MM/YYYY" />
                            </Form.Item>
                            <span style={{ padding: 5, fontSize: 12, color: '#58595b' }}>Note: Date format should be DD/MM/YYYY</span>
                        </Form>
                    </Modal>
                </>
            }
        </>
    )
}