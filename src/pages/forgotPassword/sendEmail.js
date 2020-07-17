import React, { useState, useRef, useEffect } from 'react';
import AppCard from '../../components/card';
import AppInput from '../../components/input';
import AppButton from '../../components/button';
import HttpClient from '../../components/httpClient';
import { Row, Col, Form, Icon, Button } from 'antd';

let client = HttpClient();

let dataCompany = {
  company_id: '8f99c073-66a7-4325-a94e-57615f7c38b8',
};

const ForgotPassword = ({ form }) => {
  const [email, setEmail] = useState('');
  const { getFieldDecorator, validateFields } = form;

  const inputRef = useRef();

  // useEffect(() => {
  //     sendPassword();
  // }, []);

  // const sendPassword = () => {

  // }

  // ใช้กับหน้า form ทั้งหมด เพื่อ validate form
  const handleSubmit = (e) => {
    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <AppCard
        title={'Find Your Account'}
        actions={[
          <Row>
            <Col style={{ float: 'right', paddingRight: '22px' }}>
              <AppButton textButton={'Search'} htmlType="submit"></AppButton>
              <AppButton textButton={'Cancel'}></AppButton>
            </Col>
          </Row>,
        ]}
      >
        <p>
          Please enter your email address or phone number to search for your
          account.
        </p>
        <Form.Item className="form-item">
          {getFieldDecorator('email', {
            rules: [
              {
                type: 'email',
                message: 'The input is not valid E-mail!',
              },
              {
                required: true,
                message: 'Please input your Email!',
              },
            ],
          })(
            <AppInput
              style={{ width: '50%' }}
              placeholder="Email"
              type="text"
              name="email"
              className="input"
              // value={email}
            />,
          )}
        </Form.Item>
      </AppCard>
    </Form>
  );
};

const onFieldsChange = (_, changedFiels) => {
  console.log('onchangField' + changedFiels);

  const { email } = changedFiels;
  if (email) {
    console.log(`Now changing ${email.name}`);
  }
};

const IndexForgotPassword = Form.create({ onFieldsChange })(ForgotPassword);
export default IndexForgotPassword;
