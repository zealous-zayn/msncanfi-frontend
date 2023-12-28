import React, { useState } from 'react';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
const Collapse = ({ title, children, fetchProducts }) => {
    const [isCollapsed, setIsCollapsed] = useState(true);

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
        if (isCollapsed) {
            fetchProducts(title)
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent:'center'}} className="collapse-container">
            <div style={{ width: '80%', fontSize:20 }} onClick={toggleCollapse}>
                <div style={{ display: 'flex', backgroundColor: '#fbe3dd', color:'#5a5a5c',padding: 15,justifyContent: 'space-between' }}>
                <h2>{title}</h2>
                    <span style={{ cursor: 'pointer', fontWeight: 900 }}>{isCollapsed ? <PlusOutlined /> : <MinusOutlined />}</span>
                </div>
            {!isCollapsed && (
                <div className="collapse-content">
                    {children}
                </div>
                )}
            </div>
        </div>
    );
};

export default Collapse;