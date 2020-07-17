import React, { useState } from 'react';
import { Avatar, Tooltip, Popover } from 'antd';
import {
  Link,
  Redirect,
  BrowserRouter as Router,
  NavLink,
} from 'react-router-dom';
import UserMenu from './userMenu';
import './css/userAvatar.css';

export default (props) => {
  const [visible, setVisible] = useState(false);
  const labelShow = props.labelShow;
  const name = localStorage.getItem("adminName");
  // const [triggerMenu, setTriggerMenu] = useState();
  const hide = () => {
    setVisible(false);
  };
  const content = <UserMenu labelShow = {labelShow} hide = {hide} />;

  const userAvatar = localStorage.getItem('userAvatar');
  const manageBtValue = localStorage.getItem('manageBtValue');

  
  // console.log("userAvatar::: ",userAvatar);
  return (
    <Popover
      placement="bottomLeft"
      content={<div>{ content}</div>}
      trigger={'click'}
      visible = {visible}
      onVisibleChange = {setVisible}
      overlayStyle={{
        height: '10vh',
        width: '20vw',
      }}
    >
      <span style={{ marginRight: 25 }}>
        <Tooltip title={name} placement="bottomRight">
          <Avatar
            size={30}
            shape="circle"
            src={`${process.env.REACT_APP_IMG_HOST}` + userAvatar}
          />
        </Tooltip>
      </span>
    </Popover>
  );
};
