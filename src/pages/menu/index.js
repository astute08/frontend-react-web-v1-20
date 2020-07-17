import React from 'react';
import { Button, Row, Col, Icon } from 'antd';
import UserAvatar from './manageAccount/userAvatar';
import Notification from './notification/notification';
import Platform from './platform/platform';

export default (props) => {
  const labelShow = props.labelShow;

  return (
    <div>
      <Row gutter={25} className="platform-style">
        <Col
          span={11}
          order={1}
          style={{
            paddingRight: '0px',
            marginRight: '17.5px',
            width: '50.83333%',
          }}
        >
          <Platform />
        </Col>
        <Col
          span={2}
          order={2}
          style={{ paddingTop: '0px', paddingRight: '8.5px' }}
        >
          <Notification />
        </Col>
        <Col span={2} order={3}>
          <UserAvatar labelShow = {labelShow}/>
        </Col>
      </Row>
    </div>
  );
};
