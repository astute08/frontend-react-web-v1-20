import React from 'react';
import { Layout, Row, Col } from 'antd';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from 'react-router-dom';

import Logo from './logo';
import LoginForm from './loginForm';
import Company from './company';
import ForgotPassword from './forgotPassword';
import SecurityCode from './securityCode';
import Newpassword from './newPassword';
import Dashboard from '../../layout/index';
import Background from './background';
import './css/index.css';


export default () => {
  return (
    <Router>
      <div className="div">
        <Layout className="index-style">
          <Row gutter={16}>
            <Col span={6} className="left-form">
              <Logo />
              <Switch>
                <Route path= "/loginform" exact children={<LoginForm />} />
                <Route path="/company" exact children={<Company />} />
                <Route
                  path="/forgotpassword"
                  exact
                  children={<ForgotPassword />}
                />
                <Route path="/validatecode" exact children={<SecurityCode />} />
                <Route path="/newpassword" exact children={<Newpassword />} />
                <Redirect to="/loginform" />
              </Switch>
            </Col>

            <Col span={18}>
              <Background />
            </Col>
          </Row>
        </Layout>
      </div>
    </Router>
  );
};
