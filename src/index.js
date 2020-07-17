import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'antd/dist/antd.css';
import {
  Switch,
  Route,
  Link,
  Router,
  Redirect,
  BrowserRouter,
} from 'react-router-dom';
import * as serviceWorker from './serviceWorker';
import Routes from './route/routes';
import Role from './pages/users/role/index';
ReactDOM.render(
  // <img src={Logo} alt="Logo" width="500" height="500" className="cls-1" />,

  // <BrowserRouter>
  //   {/* <Shift /> */}
  //   {/* <Organization comId={1} /> */}
  //   {/* <Login /> */}
  //   <Routes /> 
  // </BrowserRouter>,
  // <Approver />,
  // <Logo stroke="red" />,
  // <Gantt />,
  <Role />,
  document.getElementById('root'),
);
serviceWorker.register();
