import React, { useState, useEffect } from 'react';
import { Input, Button, notification, Icon, Form } from 'antd';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import HttpClient from '../../components/httpClient';

let client = HttpClient();

localStorage.getItem('newColumns2');
// const companyId = localStorage.getItem("companyId");
const memComId = localStorage.getItem('memComId');
// console.log('memComId:: ', memComId);

const ForgotPassword = (props) => {
  const {
    getFieldDecorator,
    validateFields,
    getFieldError,
    isFieldTouched,
  } = props.form;
  const emailError = isFieldTouched('email') && getFieldError('email');

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    const result = await client.get(`/v2/users/${memComId}/`);
    const user = result.data;
    console.log('รายงาน Users:: ', user);
  };

  const successNotification = (message) => {
    notification.success({
      icon: <Icon type="check-circle" style={{ color: '#fe6202' }} />,
      message: message,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    props.form.validateFieldsAndScroll(async (err, values) => {
      if (!err) {
        const result = await client.post('/v2/createcode/', values);
        console.log('result::: ', result);
        if (result.status == 200) {
          successNotification(result.data.data);
          setTimeout(() => {
            window.location.href = '/validatecode';
          }, 500);
        } else console.error();
      }
    });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <h3>
        <b>Find Your Account</b>
      </h3>
      <p style={{ color: '#000000' }}>
        Please enter your Username or email address <br /> or phone number to
        search for your account{' '}
      </p>
      <Form.Item>
        {getFieldDecorator('email', {
          rules: [
            {
              type: 'email',
              message: 'The input is not valid E-mail.',
            },
            {
              required: true,
              message: 'Please, input your E-mail',
            },
          ],
        })(<Input placeholder="Username, email, or phone number" />)}
      </Form.Item>
      <Form.Item>
        <StyledButton htmlType="submit">Authenticate</StyledButton>
      </Form.Item>
      <Form.Item>
        <div className="remember-forgot-row" style={{ marginTop: '10px' }}>
          <Link className="login-form-forgot" to="/loginform">
            {' '}
            Login{' '}
          </Link>
        </div>
      </Form.Item>
    </Form>
  );
};

const StyledButton = styled(Button)`
  margin: 25px 0px 0px 0px;
  width: 100%;
  box-shadow: 'none';
  border-radius: 0px;
  background-color: #fe6202;
  border-color: #fe6202;
  color: #ffffff;
`;

const WrappedRegistrationForm = Form.create({ name: 'sendEmail' })(
  ForgotPassword,
);

export default WrappedRegistrationForm;
