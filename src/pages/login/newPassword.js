import React, { useState, useEffect } from 'react';
import { Input, Form, Checkbox, Row, Col, notification, Icon } from 'antd';
import Button from '../../components/v2/button';
import './css/newPassword.css';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import HttpClient from '../../components/httpClient';
import qs from 'qs';
import _ from 'lodash';


let client = HttpClient();

const NewPassword = (props) => {
  console.log('NewPassword props ***** ', props);
  // const [code, setCode] = useState(props.code);
  // const [userKeycloak, setUserKeycloak] = useState(props.userKeycloak);
  // const [userName, setUserName] = useState(props.userName);

  const code = _.get(props, 'code');
  const userKeycloak = _.get(props, 'userKeycloak');
  const userName = _.get(props, 'userName');

  const [confirmDirty, setConfirmDirty] = useState(false);
  const [notifi, setNotifi] = useState();
  const { getFieldDecorator, validateFields, } = props.form;

  // console.log('props code:: ', props);

  localStorage.setItem('notifi', notifi);

  const handleSubmit = (e) => {
    e.preventDefault();
    props.form.validateFieldsAndScroll((err, values) => {
      // console.log('validateFieldsAndScroll:::', values);
      if (!err) {
        console.log('validateFieldsAndScroll:::', values);
        resetPassword(values.newPassword);
      }
    });
  };

  const successNotification = (message) => {
    notification.success({
      icon: <Icon type="check-circle" style={{ color: '#fe6202' }} />,
      message: message,
    });
  };

  // const validateToNextPassword = (rule, value, callback) => {
  //   const { form } = props;
  //   if (value && confirmDirty) {
  //     form.validateFields(['confirm'], { force: true });
  //   }
  //   callback();
  // };

  const validateToNextPassword = async (rule, value, callback) => {
    const { form } = props;
    // if (value && confirmDirty) {
    //   form.validateFields(['confirm'], { force: true });
    // }
    // callback();
    // console.log('value CurrentPassword::: ', value);

    const data = {
      client_id: `${process.env.REACT_APP_KEYCLOAK_CLIENT_ID}`,
      grant_type: 'password',
      client_secret: `${process.env.REACT_APP_KEYCLOAK_CLIENT_SECRET}`,
      // username: localStorage.getItem('username'),
      username: userName,
      password: value,
    };

    // console.log('data CurrentPassword::: ', data)

    const axiosConfig = {
      Header: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    };

    try {
      client.defaults.baseURL = `${process.env.REACT_APP_KEYCLOAK_URL}`;
      client.defaults.headers = {
        Authorization: '',
        'Content-Type': 'application/x-www-form-urlencoded',
      };
      const res = await client.post(
        '/auth/realms/master/protocol/openid-connect/token',
        qs.stringify(data),
        axiosConfig,
      );
      // console.log('CurrentPassword::', res);
      callback('Password must differ from old password.');
    } catch (err) {
      // if (err.status !== value) {
      if (value && confirmDirty) {
        form.validateFields(['confirm'], { force: true });
      }
      // callback(err);
    }
  };

  const compareToFirstPassword = (rule, value, callback) => {
    const { form } = props;
    if (value && value !== form.getFieldValue('newPassword')) {
      callback('Two passwords that you enter is inconsistent!');
    } else {
      callback();
    }
  };

  const validateChecked = (rule, value, callback) => {
    try {
      if (!value) {
        throw new Error(`Please select I'm not robot`);
      } else {
        callback();
      }
    } catch (err) {
      callback(err);
    }
  };

  const handleConfirmBlur = (e) => {
    const { value } = e.target;
    setConfirmDirty(confirmDirty || !!value);
  };

  const resetPassword = async (password) => {
    const data = {
      client_id: 'admin-cli',
      grant_type: 'password',
      username: 'admin',
      password: 'admin',
    };
    const axiosConfig = {
      Header: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    };
    client.defaults.baseURL = `${process.env.REACT_APP_KEYCLOAK_URL}`;
    const res = await client.post(
      '/auth/realms/master/protocol/openid-connect/token',
      qs.stringify(data),
      axiosConfig,
    );
    let tokens = res.data.access_token;
    try {
      let body = {
        type: 'password',
        value: password,
      };

      client.defaults.headers = {
        Authorization: `Bearer ${tokens}`,
        'Content-Type': 'application/json',
      };

      client.defaults.baseURL = `${process.env.REACT_APP_KEYCLOAK_URL}`;
      const res = await client.put(
        `/auth/admin/realms/master/users/${userKeycloak}/reset-password`,
        body,
        Headers,
      );
      console.log('result::0 ', res);
      if (res.status == 204) {
        client.defaults.baseURL = `${process.env.REACT_APP_URL_MANAGER_ADD_PORT}`;
        client.defaults.headers = {
          'Content-Type': 'application/x-www-form-urlencoded',
        };
        setTimeout(() => {
          // window.location.href = `/loginform/${notifi}`
          window.location.href = '/loginform';
        }, 500);
        const res = await client.post(`/v2/update/resetemaillog/${code}`);
        console.log('result::1 ', res);
        successNotification(res.data.data);
      } else console.error();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Form className="fromNewpassWord" onSubmit={handleSubmit}>
      <Form.Item label="NEW PASSWORD" hasFeedback>
        {getFieldDecorator('newPassword', {
          rules: [
            {
              min: 6,
              message: 'The password must be at least 6 leght.',
            },
            {
              required: true,
              message: 'Please input your password.',
            },
            {
              validator: validateToNextPassword,
            },
          ],
        })(<Input.Password />)}
      </Form.Item>

      <Form.Item label="CONFIRM PASSWORD" hasFeedback>
        {getFieldDecorator('confirm', {
          rules: [
            {
              required: true,
              message: 'Please confirm your password.',
            },
            {
              validator: compareToFirstPassword,
            },
          ],
        })(<Input.Password onBlur={handleConfirmBlur} />)}
      </Form.Item>

      <Form.Item style={{ marginTop: '5px' }} valuePropName="checked">
        {getFieldDecorator('agreement', {
          rules: [
            // {
            //     required: true,
            //     message: `Please select I'm not robot`,
            // },
            {
              validator: validateChecked,
            },
          ],
        })(<Checkbox>I'm not robot</Checkbox>)}
      </Form.Item>
      <Row
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
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
          <StyledButton htmlType="submit" style={{ width: '90%' }}>
            SAVE
          </StyledButton>
        </Form.Item>

        <Form.Item>
          <Link to="/loginform">
            <StyledButton style={{ width: '90%', float: 'right' }}>
              CANCEL
            </StyledButton>
          </Link>
        </Form.Item> */}
      </Row>
    </Form>
  );
};

const StyledButton = styled(Button)`
  margin: 5px 0px 5px 0px;
  box-shadow: 'none';
  border-radius: 0px;
  background-color: #fe6202;
  border-color: #fe6202;
  color: #ffffff;
`;

const WrappedRegistrationForm = Form.create({ name: 'register' })(NewPassword);
export default WrappedRegistrationForm;
