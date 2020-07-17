import React, { useState, useEffect } from 'react';
import AppButton from '../../../components/button';
import AppAvatar from '../../../components/avatar';
import SignoutApi from '../../../components/httpClient';
import GetLang from '../../../includes/language';
import {
  Row,
  Col,
  Modal,
  Button,
  Typography,
  notification,
  Collapse,
  Card,
  Avatar,
} from 'antd';
import {
  Switch,
  Route,
  Link,
  Redirect,
  BrowserRouter as Router,
  NavLink,
  useParams,
} from 'react-router-dom';

import './css/userMenu.css';

const { Panel } = Collapse;
const { confirm } = Modal;

const qs = require('query-string');
var jwt = require('jsonwebtoken');
let client = SignoutApi();

const { Text, Title } = Typography;

export default (props) => {
  const userId = localStorage.getItem('userId');
  const [userDetail, setUserDetail] = useState([]);
  const [language, setLanguage] = useState({});
  const [labelShow, setLabelShow] = useState('English');
  const [buttonValue, setButtonValue] = useState();
  const [manageBtValue, setManageBtValue] = useState();
  const [switchLang, setSwitchLang] = useState(
    JSON.parse(window.localStorage.getItem('switchLang')),
  );
  const [isOpen, setIsOpen] = useState(false);

  // get const จาก component อื่นมาใช้
  const companyId = localStorage.getItem('companyId');
  const memComId = localStorage.getItem('memComId');
  const comId = localStorage.getItem('comId');
  const adminName = localStorage.getItem('adminName');
  const userAvatar = localStorage.getItem('userAvatar');

  const labelShow2 = props.labelShow;

  console.log('comIdcomIdcomIdcomId', labelShow2);

  //get data ที่เป็น object
  const getLang = JSON.parse(window.localStorage.getItem('switchLang'));
  const labelShowValue = localStorage.getItem('labelShowValue');
  //set data ไปใช้ที่ component อื่น
  localStorage.setItem('langValue', buttonValue);
  localStorage.setItem('labelShow', labelShow);
  localStorage.setItem('manageBtValue',manageBtValue);

  console.log("buttonValue",buttonValue);

  // console.log('labelShowValue', labelShowValue);



  useEffect(() => {
    getApi();
  }, []);

  const logoutNotification = (type) => {
    notification[type]({
      message: 'Loging out',
      duration: 3,
    });
  };
  // เปลี่ยนภาษาเป็นภาษาอังกฤษ
  const langSwicthEN = (e) => {
    console.log('buttonValue', buttonValue);
    setLabelShow('English');
    setButtonValue('EN');
    window.location.reload();
  };

  const callback = (key) => {
    console.log(key);
  };

  // เปลี่ยนเป็นภาษาไทย
  const langSwicthTH = (e) => {
    console.log('buttonValue', buttonValue);
    setLabelShow('Thai - ไทย');
    setButtonValue('TH');
    window.location.reload();
  };

  // เปลี่ยนเป็นภาษาจีน
  const langSwicthCN = (e) => {
    console.log('buttonValue', buttonValue);
    setLabelShow('Chinense - 中文');
    setButtonValue('CN');
    window.location.reload();
  };

  const getApi = async () => {
    client.defaults.headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    //comid, mem_com_id
    const res = await client.get(`/v2/users/${memComId}/${comId}`);
    console.log('data ::', res);
    setUserDetail(res.data[0]);
  };

  const showConfirm = () => {
    confirm({
      title: labelShow2.btnSignOut ? labelShow2.btnSignOut : "Do you want to sign out?",
      onOk() {
        return new Promise((resolve, reject) => {
          setTimeout(signOut(), 1000);
        }).catch(() => console.log('Oops errors!'));
      },
      onCancel() { },
      okText: labelShow2.ok ? labelShow2.ok : "Ok",
      cancelText: labelShow2.cancel_button ? labelShow2.cancel_button : "Cancel"

    });
  };

  const signOut = () => {
    console.log('s');
    const allLocal = localStorage;
    allLocal.clear();
    console.log('allLocal', allLocal);
    logoutNotification('warning');
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const handleSignout = async (tokenKey) => {
    try {
      client.defaults.baseURL = `${process.env.REACT_APP_KEYCLOAK_URL}`;
      client.defaults.headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${tokenKey}`,
      };
      const res = await client.post(
        `/auth/admin/realms/master/users/${userId}/logout/`,
      );
      console.log('handSignout', res);

      if (res.status === 204) {
        console.log(userId, ' SignOut Success');
        logoutNotification('success');
      }
    } catch (error) {
      console.log(error.response);
    }
  };

  const handleAccountBtClick = () => {
    setTimeout(() => {
      window.location.href = '/menu/manageAccout/'+memComId;

    },
      500
    );

    // props.hide();

  };
  return (
    <Card
      actions={[
        <Link type="link" onClick={showConfirm}>
          <Link to="/loginform">
            {' '}
            <span className="text-managebt-style">{labelShow2.btnSignOut ? labelShow2.btnSignOut : "Sign Out"}</span>{' '}
          </Link>{' '}
        </Link>,
      ]}
      style={{ backgroundColor: '#FFFFFF', lineHeight: '2' }}
      bordered={false}
    >
      <Row>
        <Col span={9} order={1}>
          <Avatar
            size={90}
            src={`${process.env.REACT_APP_IMG_HOST}` + userAvatar}
            style={{ marginLeft: '7%' }}
          />{' '}
        </Col>
        <Col span={15} order={2}>
          <span style={{ fontSize: '16px', color: '#000000' }}>
            {adminName}
          </span>{' '}
          <br />
          <span style={{ color: 'rgba(0, 0, 0, 0.45)' }}>Org Admin</span>
          <Collapse
            defaultActiveKey={['1']}
            expandIconPosition="right"
            onChange={callback}
            style={{ paddingBottom: '6%' }}
          >
            <Panel
              value={buttonValue}
              header={
                <Text type="secondary">
                  Language{' '}
                  <span style={{ paddingLeft: '10%', fontSize: '13px' }}>
                    {labelShowValue === 'null' ? 'English' : labelShowValue}
                  </span>
                </Text>
              }
            >
              <div
                style={{
                  float: 'right',
                  width: '64%',
                  flexDirection: 'row',
                  paddingLeft: '0px',
                  marginRight: '0%',
                }}
              >
                <Text
                  type="secondary"
                  style={{ cursor: 'pointer', fontSize: '90%' }}
                  value={buttonValue}
                  onClick={langSwicthEN}
                >
                  {' '}
                  English
                </Text>{' '}
                <br />
                <Text
                  type="secondary"
                  style={{ cursor: 'pointer', fontSize: '90%' }}
                  value={buttonValue}
                  onClick={langSwicthTH}
                >
                  {' '}
                  Thai - ไทย
                </Text>
                <br />
                <Text
                  type="secondary"
                  style={{ cursor: 'pointer', fontSize: '90%' }}
                  value={buttonValue}
                  onClick={langSwicthCN}
                >
                  {' '}
                  Chinese - 中文
                </Text>
              </div>
            </Panel>
          </Collapse>
            <Button onClick={handleAccountBtClick} className='manage-button-style' >{labelShow2.btnManageuacc ? labelShow2.btnManageuacc : "Manage Your Account"}</Button>
        </Col>
      </Row>
    </Card>
  );
};
