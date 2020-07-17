import React, { useEffect, useState } from 'react';
import { Layout, Menu, Icon, Row, Col } from 'antd';
import Cookies from 'universal-cookie';
import * as moment from 'moment';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from 'react-router-dom';
import './index.css';

import LeftMenu from '../includes/leftMenu';
import TopBar from '../includes/topBar';
import Radio from '../components/radio';
import UserIndex from '../pages/users/user/index';
import AppUsers from '../pages/users/user/users_ex';
import Users from '../pages/users/user/users';
import Role from '../pages/users/role/index';
import Document from '../pages/users/user/document';
import Com from '../pages/users/user/com_1';
import Login from '../pages/login/index';
import ManageAccount from '../pages/menu/manageAccount/manageAccount';
import Register from '../pages/register/index';
import Organization from '../pages/organization/index';
import Monitor from '../pages/monitor/index';
import GetLang from '../includes/language';
import { isUndefined } from 'lodash';
var jwt = require('jsonwebtoken');

const { Header, Sider, Content } = Layout;
const cookies = new Cookies();

const pageCode = '001';

export default (props) => {
  const comId = localStorage.getItem('comId');
  const expire = localStorage.getItem('Expire');

  // console.log("CCC", comId);

  // get ภาษามาเก็บค่าไว้
  const labelShow = localStorage.getItem('labelShow');
  const memComId = localStorage.getItem('memComId');
  const langValue = localStorage.getItem('langValue');

  // console.log("WWWWWWWWWWWWWWWWWW",isUndefined(langValue) ? langValue : 'EN');

  // ส่งกลับค่าภาษากลับไปที่หน้า userMenu
  localStorage.setItem('labelShowValue', labelShow);
  localStorage.setItem('pageCode', pageCode);

  // get token
  const token = cookies.get('wfm_access_token');
  const [switchLang, setSwicthLang] = useState({});

  useEffect(() => {
    Lang();
    expireUser();
  }, []);

  const expireUser = () => {
    const now = moment().format('LT');
    if (now > expire) {
      console.log('expire');
    }
  };

  const Lang = async () => {
    const res = await GetLang({
      companyId: comId,
      lang: isUndefined(langValue) ? langValue : 'EN',
      pageCode: pageCode,
    });
    setSwicthLang(res);
  };

  return (
    <Router>
      <Layout
        style={{ height: 'antd', width: '100%', background: '#FAFAFA' }}
        className="div"
      >
        <LeftMenu labelShow={switchLang} />

        <Layout>
          <Header style={{ background: '#FAFAFA', padding: 0, width: '100%' }}>
            <TopBar comId={comId} lang="TH" pageCode={pageCode} />
          </Header>

          <Content
            style={{
              margin: '26px 16px',
              background: '#FAFAFA',
              minHeight: '88vh',
            }}
          >
            {/* <Switch>
              {routes.map((Comp, i) => (
                <Route path={`/2/${i + 1}`}>
                  <Comp />
                </Route>
              ))}

            </Switch> */}

            <Switch>
              {/* <Route extact path={`/menu/user`} component={Users} /> */}
              <Route extact path={`/menu/user`} component={AppUsers} />
              <Route
                extact
                path={`/menu/users/:user_id`}
                component={UserIndex}

              />
              <Route
                extact
                path={`/menu/role`}
                component={Role}

              />

              <Route
                extact
                path={`/menu/manageAccout/:user_id`}
                component={ManageAccount}
              />

              <Route
                extact
                path={`/menu/organization`}
                component={Organization}
              />

              <Route
                extact
                path={`/menu/monitor`}
                component={Monitor}
              />
            </Switch>
          </Content>
        </Layout>
      </Layout>
    </Router>
  );
};
