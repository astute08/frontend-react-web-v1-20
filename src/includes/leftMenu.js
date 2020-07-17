import React, { useState, useEffect } from 'react';
import { Layout, Menu, Icon, Divider } from 'antd';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import './css/leftMenu.css';
import GetLang from './language';
import Group from 'antd/lib/input/Group';

const { Sider } = Layout;
const { SubMenu } = Menu;

export default function SideMenu(props) {
  const [collapsed, setToCollapse] = useState(true);
  const [sideMenuDisplay, SetToSideMenuDisplay] = useState(true);
  const [item, setToItem] = useState();
  const labelShow = props.labelShow;
  
  const toggle = () => {
    setToCollapse(!collapsed);
  };
  // set ให้ collapse และ expand ตอนกดเมนูด้านข้าง
  const onCollapse = (collapsed) => {
    setToCollapse({ collapsed });
  };

  return (
    <Sider
      className="sider-style"
      theme="light"
      breakpoint="lg"
      width={sideMenuDisplay ? 200 : 0}
      collapsedWidth={sideMenuDisplay ? 50 : 0}
      collapsed={collapsed}
      onCollapse={onCollapse}
    >
      <Menu className="menu-item-style" mode="inline" theme="light">
        <Icon
          type={collapsed ? 'menu' : 'menu'}
          onClick={toggle}
          className="fold-menu"
        />

        <Divider className="div-side-menu" />

        <Menu.Item key="1" className="item-style">
          <Icon type="pie-chart" theme="filled" />
          <span>
            {' '}
            {labelShow.menuDashboard ? labelShow.menuDashboard : 'Dashboard'}
          </span>
          <Link to="/2" />
        </Menu.Item>

        <SubMenu
          key="sub1"
          title={
            <span>
              <Icon type="team" style={{ alignContent: 'center' }} />
              <span>
                {' '}
                {labelShow.menuUserManage ? labelShow.menuUserManage: 'User management'}
              </span>
            </span>
          }
        >
          <Menu.Item key="3">
            <Link to="/menu/user">
              <span> {labelShow.menuUser ? labelShow.menuUser : 'Users'}</span>{' '}
            </Link>
          </Menu.Item>

          <Menu.Item key="4">
            {/* <span> Groups </span> */}
            <Link to="/menu/role">
              <span> Role</span>{' '}
            </Link>
          </Menu.Item>

          <Menu.Item key="5">
            {/* <span> Groups </span> */}
            <Link to="/menu/permission">
              <span> Permissions </span>{' '}
            </Link>
          </Menu.Item>

        </SubMenu>

        <Menu.Item key="organization" className="item-style">
          <Icon type="cluster" />
          <span>
            {' '}
            {labelShow.menuOrg ? labelShow.menuOrg : 'Organization'}
          </span>
          <Link to="/menu/organization" />
        </Menu.Item>
        
        <Menu.Item key="monitor" className="item-style">
          <Icon type="desktop" />
          <span>
            {' '}
            {labelShow.menuMonitor ? labelShow.menuMonitor : 'Monitor'}
          </span>
          <Link to="/menu/monitor" />
        </Menu.Item> 

      </Menu>
    </Sider>
  );
}
