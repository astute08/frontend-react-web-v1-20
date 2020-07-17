import React from 'react';
import { List, Badge, Col, Row, Tag } from 'antd';
import '../css/status.css';
export default () => {
    // const data = [
    //     'New :',
    //     'Scheduled :',
    //     'Accepted :',
    //     'In progress :',
    //     'Completed :',
    //     'Suspend :',
    //     'Failed :'
    // ];

    const data = [
        {
          "id": 1,
          "name": "New :",
          "color": "#0048EC",
          "quantity": "26"
    
        },
        {
          "id": 2,
          "name": "Scheduled :",
          "color": "#67D0FF",
          "quantity": "50"
    
        },
        {
            "id": 2,
            "name": "Accepted :",
            "color": "#F88512",
            "quantity": "20"
      
          },
        {
          "id": 3,
          "name": "In progress :",
          "color": "#6AC432",
          "quantity": "59"
    
        },
        {
            "id": 4,
            "name": "Completed :",
            "color": "#3C840F",
            "quantity": "4"
      
          },
          {
            "id": 5,
            "name": "Suspend :",
            "color": "#B1B1B1",
            "quantity": "10"
      
          },
          {
            "id": 6,
            "name": "Failed :",
            "color": "#F3442E",
            "quantity": "10"
      
          }
       
      ]

    return (
        <List
            size="default"
            dataSource={data}
            
            renderItem={item =>
                <List.Item className='list-item'>
                    <Col span={10}>{item.name}</Col>
                    <Col span={4}>
                        <Tag color={item.color}><div style = {tagStyle} ></div></Tag>
                    </Col>
                    <Col span={10}><span>{item.quantity}</span></Col>
                </List.Item>}
        />
    );
}

const tagStyle = {
    height: "13px",
    width: '0.5px'

}