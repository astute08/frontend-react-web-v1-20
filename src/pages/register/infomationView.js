import React from 'react';
import Profile from './profile';
import AppProvider from './appProvider';
import Moment from 'moment';
import { Card, Row, Col, Icon } from 'antd';

export default (props) => {
  const app = AppProvider.useAppContext();
  const styleIcon = { fontSize: '18px' };
  const styleLineContent = { marginBottom: '10px' };
  const styleSpan = { fontSize: '14px', marginLeft: '15px' };

  return (
    <Card
      title={
        app.state.lang.personalInformation
          ? app.state.lang.personalInformation
          : 'Personal Information'
      }
    >
      <Row gutter={16} style={{ margin: 50 }}>
        <Col className="gutter-row" span={10} style={{ textAlign: 'center' }}>
          <Profile />
        </Col>
        <Col className="gutter-row" span={10}>
          <h1>
            {props.data.fname ? props.data.fname.value : ''}{' '}
            {props.data.lname ? props.data.lname.value : ''}
          </h1>
          <div style={styleLineContent}>
            <Icon type="mail" style={styleIcon} />
            <span style={styleSpan}>
              {props.data.email ? props.data.email.value : ''}
            </span>
          </div>
          <div style={styleLineContent}>
            <Icon type="phone" style={styleIcon} />
            <span style={styleSpan}>
              {props.data.phone ? props.data.phone.value : ''}
            </span>
          </div>
          <div style={styleLineContent}>
            <Icon type="idcard" style={styleIcon} />
            <span style={styleSpan}>
              {props.data.idCard ? props.data.idCard.value : ''}
            </span>
          </div>
          <div style={styleLineContent}>
            <Icon type="gift" style={styleIcon} />
            <span style={styleSpan}>
              {props.data.birthDate
                ? Moment(props.data.birthDate.value._d.valueOf()).format(
                    'D MMMM YYYY',
                  )
                : ''}
            </span>
          </div>
          <div style={styleLineContent}>
            <Icon type="man" style={styleIcon} />
            <span style={styleSpan}>
              {props.data.gender
                ? props.data.gender.value == 1
                  ? app.state.lang.male
                    ? app.state.lang.male
                    : 'Male'
                  : app.state.lang.female
                  ? app.state.lang.female
                  : 'Female'
                : ''}
            </span>
          </div>
        </Col>
      </Row>
    </Card>
  );
};
