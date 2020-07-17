import React, { useState, useEffect } from 'react';
import { Input, Row, notification, Form, Icon, Col } from 'antd';
import Button from '../../components/v2/button';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import HttpClient from '../../components/httpClient';
import NewPassword from './newPassword';

let client = HttpClient();

const SecurityCode = (props) => {
  const [code, setCode] = useState('');
  const [userKeycloak, setUserkeycloak] = useState();
  const [userName, setUserName] = useState();

  const {
    getFieldDecorator,
    validateFields,
    getFieldError,
    isFieldTouched,
  } = props.form;

  const handleSubmit = async (e) => {
    e.preventDefault();
    validateFields(async (err, values) => {
      if (!err) {
        console.log('Received values of form: ', values.code);
        try {
          const result = await client.get(`/v2/validatecode/${values.code}`);
          console.log('result code**** ', result);
          if (result.status == 202) {
            errorNotification(result.data.data);
          }
          if (result.status == 200) {
            setUserkeycloak(result.data.user_id);
            setCode(values.code);
            setUserName(result.data.username);
          }
        } catch (err) {
          console.log('err*** ', err);
        }
      }
    });
  };

  const errorNotification = (data) => {
    console.log('reject data::: ', data);
    notification.error({
      message: `${data}`,
    });
  };

  return (
    <div>
      {code != '' ? (
        <NewPassword code={code} userKeycloak={userKeycloak} userName={userName} />
      ) : (
        <Form onSubmit={handleSubmit}>
          <h4>
            <b>Enter security code</b>
          </h4>
          <p style={{ color: '#000000' }}>
            Please check your email for a text message with your code. Your code
            is 6 charcthers in length.
          </p>
          <Form.Item>
            {getFieldDecorator('code', {
              rules: [
                {
                  len: 6,
                  message: 'The code must be at least 6 leght',
                },
                {
                  required: true,
                  message: 'Please input your code',
                },
              ],
            })(<Input placeholder="Enter code" />)}
          </Form.Item>
          <Link style={{ marginTop: '5px' }} className="login-form-forgot">
            Resend
          </Link>
          <Row
            style={{
              marginTop: '30px',
            }}
          >
            <Col span={12}>
              <Button type="primary" style={{ width: '90%', borderRadius: '0px', margin: '0px'}} htmlType="submit">
                Submit
              </Button>
            </Col>
            <Col span={12}>
              <Link to="/loginform">
                <Button style={{ width: '90%', borderRadius: '0px', margin: '0px', float: 'right'}}>
                  Cancel
                </Button>
              </Link>
            </Col>

            {/* <Form.Item>
              <Button type="primary" style={{ width: '90%', borderRadius: '0px' }} htmlType="submit">
                Submit
              </Button>
            </Form.Item>

            <Form.Item>
              <Link to="/loginform">
                <Button style={{ width: '90%', borderRadius: '0px', float: 'right' }}>
                  Cancel
                </Button>
              </Link>
            </Form.Item> */}
          </Row>
        </Form>
      )}
    </div>
  );
};

// const StyledButton = styled(Button)`
//   margin: 5px 0px 5px 0px;
//   box-shadow: 'none';
//   border-radius: 0px;
//   background-color: #fe6202;
//   border-color: #fe6202;
//   color: #ffffff;
// `;

const WrappedRegistrationForm = Form.create({ name: 'sendCode' })(SecurityCode);
export default WrappedRegistrationForm;
