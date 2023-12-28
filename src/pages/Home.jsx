import { useEffect, useState } from 'react'
import heroBackground from './../assets/hero_background.png';
import logo1 from './../assets/logo_1.png';
import logo2 from './../assets/logo_2.png';
import arrow from './../assets/arrow.svg';
import googleTrans from './../assets/google_trans.png'
import { Row, Col, Image, Select, Radio, Button, Form } from 'antd';
import Icon,{ LeftOutlined} from '@ant-design/icons';
import styled from 'styled-components';
import {About, CanChronicles, 
        ConferenceAbstracts, ConferenceCalendar, 
        ContactUs, Products, OncoCareVault, GuidelineRecommendations, 
        PatientCorner, PdfViewer} from '../components/component';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utilities/Auth';


const CustomSelect = styled(Select)`
    .ant-select-selection-placeholder{
        font-size: small;
        color: black;
    }
`
const radioTabStyle = {
    border: 'none',
    borderRadius: 0,
    paddingInline: 17.5,
    color: '#58595b',
    backgroundColor: 'white'
}

const hoverStyles = {
    backgroundColor: '#ede8f2',
    color: '#58595b',
    border: 'none',
    borderRadius: 0,
    paddingInline: 17.5,
};

const tabs = [
        {label:'CanChronicles', value:'CanChronicles'},
        {label:'Guideline Recommendations', value:'GuidelineRecommendations'},
        {label:'Conference Abstracts',value:'ConferenceAbstracts'},
        {label:'Onco-Care Vault',value:'OncoCareVault'},
        {label:'Conference Calendar',value:'ConferenceCalendar'},
        {label:'Products',value:'Products'},
        {label:'Patient Corner',value:'PatientCorner'},
        {label:'Contact Us',value:'ContactUs'}];


export function Home() {
    const [selectedTab, setTab] = useState('About');
    const [pdfUrl, setUrl] = useState('');
    const [isHovered, setIsHovered] = useState(-1);
    const [isBackButtonVisible, setBackButton] = useState(false);
    const [singleSelected, setSingleSelected] = useState(false);
    const [form] = Form.useForm();
    const navigateTo = useNavigate();
    const { setIsAdmin, logout } = useAuth();
    useEffect(() => {
        if (localStorage.getItem('token') === null) {
          navigateTo('/login')
        } 
        console.log(typeof localStorage.getItem('isAdmin'));
       setIsAdmin(localStorage.getItem('isAdmin'))
    },[selectedTab])

    const handleSubmit = ()=>{
        form.submit()
    }

    const modalTitle = `Create new ${(tabs.find(tab=> selectedTab === tab.value))?.label}`

    const modalFooter = (
        <div>
          <Button className='leading-none'  onClick={handleSubmit}
            style={{backgroundColor:'#664495', color:'white', width:'8rem', height:'2.5rem', fontSize:'20px', fontWeight:700, borderRadius:0}} >
            Submit
          </Button>
        </div>
      );

    const componentMap = {
        'About' : <About footer={modalFooter} form={form} modalTitle={modalTitle}/>,
        'CanChronicles': <CanChronicles setPdfUrl={setUrl} form={form} footer={modalFooter} modalTitle={modalTitle} />,
        'ConferenceAbstracts': <ConferenceAbstracts setBackButtonvisible={setBackButton} setSingleSelected={setSingleSelected}
            singleSelected={singleSelected}
            setPdfUrl={setUrl} form={form} footer={modalFooter} modalTitle={modalTitle} />,
        'GuidelineRecommendations': <GuidelineRecommendations setPdfUrl={setUrl} form={form} footer={modalFooter} modalTitle={modalTitle} />,
        'OncoCareVault': <OncoCareVault setBackButtonvisible={setBackButton} setSingleSelected={setSingleSelected}
            singleSelected={singleSelected} form={form} footer={modalFooter} modalTitle={modalTitle} />,
        'ConferenceCalendar': <ConferenceCalendar form={form} footer={modalFooter} modalTitle={modalTitle} />,
        'Products': <Products form={form} footer={modalFooter} modalTitle={modalTitle} />,
        'PatientCorner': <PatientCorner setPdfUrl={setUrl} form={form} footer={modalFooter} modalTitle={modalTitle} />,
        'ContactUs': <ContactUs/>
    }

    const selectedComponent = pdfUrl ? <PdfViewer pUrl={pdfUrl}/> : componentMap[selectedTab]
    const handleTabChange = (e)=>{
        setTab(e.target.value)
        setUrl('');
        setBackButton(false);
        setSingleSelected(false);
    }

    const handleAbout = () => {
        setTab('About');
    }

    const handleBackButton = () => {
        if (pdfUrl !== '') {
            setUrl('')
        }
        setBackButton(false);
        setSingleSelected(!singleSelected)
    }

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('isAdmin')
        logout();
        navigateTo('/login')
    }
    return (
        <>
            <div>
                <div style={{ backgroundImage: `url(${heroBackground})`, backgroundSize: 'cover' }}>
                    <div style={{justifyContent: 'flex-end', display:'flex', padding:8, gap:10}}>
                        <button className='leading-none' onClick={handleAbout}
                            style={{ backgroundColor: 'transparent', color:'white',width: '8rem', height: '1.8rem', fontSize: '18px', fontWeight: 700, borderRadius: 0 }}>About Canfi</button>
                        <button className='leading-none' onClick={handleLogout}
                            style={{ backgroundColor: 'transparent',  color:'white',width: '8rem', height: '1.8rem', fontSize: '18px', fontWeight: 700, borderRadius: 0 }}>Log out</button>
                    </div>
                    <Row className='container mx-auto' style={{ width:'min-content', justifyContent:'space-between'}}>
                        <Col className='h-40 mt-10 mb-2'>
                            <Row className='' style={{width:'min-content', justifyContent:'center'}}>
                                <Col className='h-max flex items-center' style={{justifyContent:'center'}} span={24}>
                                    <Image className='mb-5 object-center' src={logo1} width={80} preview={false} />
                                </Col>
                                <Col className='h-max flex items-center' span={24}>
                                    <Image src={logo2} width={150} preview={false} />
                                </Col>
                            </Row>
                        </Col>
                        <Col className='h-40 flex flex-col items-end justify-center mt-10 mb-2'>
                        <CustomSelect placeholder='Select Language' className='h-7 w-48' style={{fontSize:12}}
                            suffixIcon={<Icon className="site-form-item-icon mt-1" component={() => (<img width={20} src={arrow} style={{marginLeft:'6px'}} />)} />}>
                                <Select.Option value="demo">English</Select.Option>
                                <Select.Option value="demo">Espanol</Select.Option>
                        </CustomSelect>
                        <div className='flex mr-2 mt-1' style={{lineHeight:1,color:'#58595b'}}><p className='mr-2 text-xs'>Powered by</p> <Image className='h-auto' src={googleTrans} width={100} preview={false}/></div>
                        </Col>
                        <Radio.Group className='flex scroll-display' style={{ overflow:'auto', whiteSpace:'nowrap'}} key={selectedTab} defaultValue={selectedTab} buttonStyle="solid" size='large'>
                            {tabs.map((tab,i)=>
                                <Radio.Button onClick={handleTabChange} key={i} value={tab.value} style={isHovered ===i? hoverStyles: radioTabStyle}
                                    onMouseEnter={()=> setIsHovered(i)}
                                    onMouseLeave={() => setIsHovered(-1)}
                                    >{tab.label}</Radio.Button>
                            )}
                        </Radio.Group>
                        
                    </Row>
                </div>
                <div style={{width:'100%', display:'flex', justifyContent:'center'}}>
                <div style={{width:'80%'}} className='container shadow-home'>
                        <div style={{ height: 40, display:'flex', alignItems:'center' }}>
                            {(pdfUrl!=='' || isBackButtonVisible) &&
                                <Button onClick={handleBackButton} style={{ border: '0px' }} icon={<LeftOutlined />}>
                                    Back
                                </Button>
                            }
                    </div>
                    {selectedComponent}
                    </div>
                </div>
            </div>
        </>
    )
}