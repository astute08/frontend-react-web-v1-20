import React, { useState, useEffect } from 'react';
import UserAvatar from './userAvatar';
import SendChangPassword from './sendChangPassword';
import './css/index.css';
import { Icon, Col, Button, Modal, Row } from 'antd';
import { Link } from 'react-router-dom';
import HttpClient from '../../../../components//httpClient';

let client = HttpClient();

const ChangPassword = (props) => {
  const labelShow = props.labelShow;

  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState();
  const [value, setValue] = useState();
  console.log('value:: ', value);

  const profileImage = localStorage.getItem('userAvatar');
  const adminName = localStorage.getItem('adminName');
  const memComId = localStorage.getItem('memComId');

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    const res = await client.get(`/v2/users/1/${memComId}`);
    console.log('data ::', res);
    setUser(res.data[0]);
  };

  const showModal = () => {
    setVisible(true);
  };

  const handleOk = async () => {
    setLoading(true);

    try {
      const data = {
        email: value == undefined ? user.email : value,
      };
      const result = await client.post('/v2/createcode/', data);
      console.log('result::: ', result);
      if (result.status == 200) {
        console.log('result:: ', result);
        setTimeout(() => {
          setLoading(false);
          setVisible(false);
          window.location.href = '/validatecode';
          signOut();
        }, 500);
      } else console.error();
    } catch (error) {}
  };

  const signOut = () => {
    const allLocal = localStorage;
    allLocal.clear();
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  const handleCancel = (e) => {
    console.log(e);
    setVisible(false);
  };

  const valueOnChange = (value) => {
    setValue(value);
  };

    return (
        <div>
            <Link className="login-form-forgot" style={{float: 'left'}} onClick={showModal}>{labelShow.forgotPassword ? labelShow.forgotPassword : "Forgot password ?"}</Link>
            <Modal style={{paddingTop: '10px'}}
                title={labelShow.changePasswordTitle ? labelShow.changePasswordTitle : "Change Password"}
                visible={visible}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={[
                    <Button key="back" onClick={handleCancel}>
                        {labelShow.cancel ? labelShow.cancel : "Cancel"}
                    </Button>,
                    <Button key="submit" type="primary" loading={loading} onClick={handleOk}>
                        {labelShow.btnContinue ? labelShow.btnContinue : "Continue"}
                    </Button>,
                ]}
            >
                <Row> 
                    <Col span={15}>
                        <SendChangPassword user={user} labelShow={labelShow} onChange={valueOnChange}  />
                    </Col>
                    <Col span={9}>
                        <UserAvatar user={user} />
                    </Col>
                </Row>
            </Modal>
        </div>
    )
}

export default ChangPassword;
