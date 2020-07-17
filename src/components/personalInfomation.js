import React, { useState, useRef } from 'react';

//import styled from 'styled-components';
import './css/Personal-Info.css';
import { Card, Switch, Avatar, Row, Col, Typography, Icon, List } from 'antd';

const { Title } = Typography;

export default () => {
  const [proFile, setproFile] = useState({
    userName: 'Personal Infomation',
    email: 'supattra.n@kgcorp.com',
    call: '091-123-4567',
    idCard: '3-3333-33333-33-3',
    birthday: '18 Nov 1998',
    sex: 'Female',
  });

  return (
    <div>
      <Card title="Personal Infomation" extra={<Switch />}>
        <Row>
          <Col span={8}>
            <div className="col-md-8">
              <Avatar size={150} icon="user" />
            </div>
          </Col>

          <Col span={8}>
            <Title level={4}>{proFile.userName}</Title>
            <Row>
              <List.Item className="list-item">
                <Icon type="mail" className="style-icon" />
                <p className="p-style">{proFile.email}</p>
              </List.Item>

              <List.Item className="list-item">
                <Icon type="phone" className="style-icon" />
                <p className="p-style">{proFile.call}</p>
              </List.Item>

              <List.Item className="list-item">
                <Icon type="idcard" className="style-icon" />
                <p className="p-style">{proFile.idCard}</p>
              </List.Item>

              <List.Item className="list-item">
                <Icon type="gift" className="style-icon" />
                <p className="p-style">{proFile.birthday}</p>
              </List.Item>

              <List.Item className="list-item">
                <Icon type="woman" className="style-icon" />
                <p className="p-style">{proFile.sex}</p>
              </List.Item>
            </Row>
          </Col>
        </Row>
      </Card>
    </div>
  );
};
