import React, { useState, useEffect } from 'react';
import {
  Form,
  Icon,
  Input,
  Checkbox,
  Card,
  Typography,
  Col,
  Row,
  notification,
} from 'antd';
import { Link } from 'react-router-dom';
import AppTitle from '../../../components/title';
import Button from '../../../components/v2/button';
import ChangPassword from './changePassword/index';
import Api from '../../../components/httpClient';
import { notificationWithIcon } from '../../../components/notification';
import './css/cssMageAccount.css';
import Language from '../../../includes/language';

let client = Api();
const qs = require('query-string');
var jwt = require('jsonwebtoken');

const { Text } = Typography;

const comId = localStorage.getItem('comId');
const pageCode = localStorage.getItem('pageCode');
const langValue = localStorage.getItem('langValue');
const userName = localStorage.getItem('username');

console.log('userName:::*****', userName);

const ValidatedFields = (props) => {
  const {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    getFieldValue,
  } = props.form;
  const [edit, setEdit] = useState(false);
  const [confirmDirty, setConfirmDirty] = useState(false);
  const [visible, setVisible] = useState(true);
  // ภาษา
  const [switchLang, setSwicthLang] = useState({});
  const [labelShow, setLabelShow] = useState({});
  let user_id = props.userId;
  const obj = getFieldsValue();

  const [currentPasswordStatus, setCurrentPasswordStatus] = useState(false);
  // console.log('currentPasswordStatus::: ', currentPasswordStatus)

  useEffect(() => {
    Lang();
  }, []);

  // ส่วนของการเรียกใช้ภาษา
  const Lang = async () => {
    const res = await Language({
      companyId: comId,
      lang: langValue,
      pageCode: pageCode,
    });
    setSwicthLang(res);
    setLabelShow(res);
    console.log('Language ::', res);
  };

  const successNotification = (type) => {
    notification[type]({
      icon: <Icon type="check-circle" style={{ color: '#fe6202' }} />,
      message: labelShow.notiSuccessChangedPassword
        ? labelShow.notiSuccessChangedPassword
        : 'Your Password has been changed.',
    });
  };
  
  // console.log('currentPasswordStatus::: ', currentPasswordStatus);

  // console.log('Visible::: ', visible);
  // console.log('edit::: ', edit);
  // console.log('confirmDirty::: ', confirmDirty);

  const handleSubmit = () => {
    validateFields((err, values) => {
      if (err) {
        return;
      }
      // if(!currentPasswordStatus) {
      //   notificationWithIcon("warning", "Current Password fail.");
      // }
      else {
        // values.currentPassword != values.newPassword ? getToken(values) : notificationWithIcon("warning", "Password Duplicated.");
        getToken(values);
      }
    });
  };

  const getToken = async (data) => {
    try {
      client.defaults.baseURL = `${process.env.REACT_APP_KEYCLOAK_URL}`;
      const Headers = {
        Header: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      };
      let body = {
        client_id: 'admin-cli',
        grant_type: 'password',
        username: 'admin',
        password: 'admin',
      };
      const res = await client.post(
        '/auth/realms/master/protocol/openid-connect/token',
        qs.stringify(body),
        Headers,
      );

      let token = res.data.access_token;
      try {
        let body = {
          type: 'password',
          value: data.newPassword,
        };

        client.defaults.headers = {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        };

        const res = await client.put(
          `/auth/admin/realms/master/users/${user_id}/reset-password`,
          JSON.stringify(body),
          Headers,
        );
        console.log('getToken::', res);
        successNotification('success');
        // console.log('getToken::', res)
        // notificationWithIcon('success', 'Your Password has been changed.');
        setEdit(!edit);
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = () => {
    setEdit(!edit);
    setVisible(false);
  };

  const validateCurrentPassword = async (rule, value, callback) => {
    // console.log('value CurrentPassword::: ', value)
    const data = {
      client_id: `${process.env.REACT_APP_KEYCLOAK_CLIENT_ID}`,
      grant_type: 'password',
      client_secret: `${process.env.REACT_APP_KEYCLOAK_CLIENT_SECRET}`,
      // username: localStorage.getItem('username'),
      username: userName,
      password: value,
    };

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
      // console.log('CurrentPassword::', res)
    } catch (err) {
      if (err.status !== value) {
        callback(
          labelShow.passwordFail ? labelShow.passwordFail : 'Password fail.',
        );
      }
      // callback(err);
    }
  };

  const validateToNextPassword = (rule, value, callback) => {
    // console.log('value validate', value)
    if (value && value === getFieldValue('currentPassword')) {
      callback(
        labelShow.passwordDuplicated
          ? labelShow.passwordDuplicated
          : 'Password Duplicated.',
      );
    }
    callback();
  };

  const compareToFirstPassword = (rule, value, callback) => {
    // console.log('value FirstPassword', value)
    if (value && value !== getFieldValue('newPassword')) {
      callback(
        labelShow.passwordNoMatch
          ? labelShow.passwordNoMatch
          : 'Two passwords that you enter is inconsistent!',
      );
    } else {
      callback();
    }
  };

  const validateChecked = (rule, value, callback) => {
    try {
      if (!value) {
        throw new Error(
          labelShow.mesErrorcheckNotRobot
            ? labelShow.mesErrorcheckNotRobot
            : "Please select I'm not robot",
        );
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

  return (
    <Card
      title={
        <AppTitle
          titleName={
            labelShow.changePasswordTitle
              ? labelShow.changePasswordTitle
              : 'Change Password'
          }
          level={1}
        />
      }
      size="small"
      style={{ width: '100%' }}
      extra={
        edit ? (
          <Button style={{ width: '96px', borderRadius: '0px', fontSize: '12px', margin: '0px' }} type="primary" onClick={handleEdit}>
            {labelShow.edit ? labelShow.edit : 'Edit'}
          </Button>
        ) : (
          <Button style={{ width: '96px', borderRadius: '0px', fontSize: '12px', margin: '0px' }} type="primary" onClick={handleEdit}>
            {labelShow.edit ? labelShow.edit : 'Edit'}
          </Button>
        )
      }
    >
      {!edit ? (
        <Text strong>
          {labelShow.textChangePassword
            ? labelShow.textChangePassword
            : "Choose a strong password and don't reuse it other accounts."}
        </Text>
      ) : (
        <div>
          <Text strong>
            {labelShow.textChangePassword
              ? labelShow.textChangePassword
              : "Choose a strong password and don't reuse it other accounts."}
          </Text>
          <Form>
            <Form.Item
              label={
                labelShow.currentPassword
                  ? labelShow.currentPassword
                  : 'Current Password'
              }
              hasFeedback
            >
              {getFieldDecorator('currentPassword', {
                rules: [
                  {
                    required: true,
                    message: labelShow.mesErrorCurrentPassword
                      ? labelShow.mesErrorCurrentPassword
                      : 'Please input your Current Password!',
                  },
                  {
                    validator: validateCurrentPassword,
                  },
                ],
              })(
                <Input.Password
                  placeholder={
                    labelShow.currentPassword
                      ? labelShow.currentPassword
                      : 'Current Password'
                  }
                />,
              )}
            </Form.Item>

            <Form.Item>
              <ChangPassword labelShow={labelShow} />
            </Form.Item>

            <Form.Item
              label={
                labelShow.newPassword ? labelShow.newPassword : 'New Password'
              }
              hasFeedback
            >
              {getFieldDecorator('newPassword', {
                rules: [
                  {
                    min: 6,
                    message: labelShow.mesErrorNewPasswordMin
                      ? labelShow.mesErrorNewPasswordMin
                      : 'The password must be at least 6 leght',
                  },
                  {
                    required: true,
                    message: labelShow.mesErrorNewPassword
                      ? labelShow.mesErrorNewPassword
                      : 'Please input your New Password!',
                  },
                  {
                    validator: validateToNextPassword,
                  },
                ],
              })(
                <Input.Password
                  placeholder={
                    labelShow.newPassword
                      ? labelShow.newPassword
                      : 'New Password'
                  }
                />,
              )}
            </Form.Item>
            <Form.Item
              label={
                labelShow.confirmPassword
                  ? labelShow.confirmPassword
                  : 'Confirm Password'
              }
              hasFeedback
            >
              {getFieldDecorator('confirmPassword', {
                rules: [
                  {
                    required: true,
                    message: labelShow.mesErrorConfirmPassword
                      ? labelShow.mesErrorConfirmPassword
                      : 'Please input your Confirm Password!',
                  },
                  {
                    validator: compareToFirstPassword,
                  },
                ],
              })(
                <Input.Password
                  placeholder={
                    labelShow.confirmPassword
                      ? labelShow.confirmPassword
                      : 'Confirm Password'
                  }
                  onBlur={handleConfirmBlur}
                />,
              )}
            </Form.Item>

            <Form.Item valuePropName="checked">
              {getFieldDecorator('agreement', {
                rules: [
                  {
                    validator: validateChecked,
                  },
                ],
              })(
                <Checkbox>
                  {labelShow.checkNotRobot
                    ? labelShow.checkNotRobot
                    : "I'm not robot"}
                </Checkbox>,
              )}
            </Form.Item>

            <Row>
              <Col span={12} className="button">
                <Button
                  style={{ width: '125px', borderRadius: '0px' }}
                  type="primary"
                  htmlType="submit"
                  onClick={handleSubmit}
                >
                  {labelShow.saveBig ? labelShow.saveBig : 'SAVE'}
                </Button>
              </Col>
              <Col span={12} className="button">
                <Button
                  style={{ width: '125px', borderRadius: '0px' }}
                  onClick={handleEdit}
                >
                  {labelShow.cancelBig ? labelShow.cancelBig : 'CANCEL'}
                </Button>
              </Col>
            </Row>
          </Form>
        </div>
      )}
    </Card>
  );
};
const changePassword = Form.create()(ValidatedFields);
export default changePassword;
