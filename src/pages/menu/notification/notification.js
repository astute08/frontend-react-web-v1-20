import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import { Button, notification, Modal, Popover, Badge } from 'antd';
import {
  Link,
  Redirect,
  BrowserRouter as Router,
  NavLink,
} from 'react-router-dom';
import '../css/rightMenu.css';
const { confirm } = Modal;

const text = <span>Notification</span>;
const footer = <span> View all </span>;

export default () => {
  const [visible, setToVisible] = useState(false);
  const [count, setTocount] = useState(0);

  const decline = () => {
    setTocount(count - 1);
  };

  const content = (
    <div onClick={decline}>
      <p onClick={() => openNotificationWithIcon('bottomRight')}>
        Notification 1
      </p>
      <p onClick={() => openNotificationWithIcon('bottomRight')}>
        Notification 2
      </p>
      <p onClick={() => openNotificationWithIcon('bottomRight')}>
        Notification 3
      </p>
      <p onClick={() => openNotificationWithIcon('bottomRight')}>
        Notification 4
      </p>
      <p onClick={() => openNotificationWithIcon('bottomRight')}>
        Notification 5
      </p>
    </div>
  );

  const openNotificationWithIcon = (placement) => {
    notification.info({
      message: 'Notification Title',
      description:
        'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
      placement,
    });
  };

  return (
    <div style={{ paddingTop: '0px' }}>
      <Popover
        placement="bottomRight"
        title={text}
        content={
          <div>
            {content}
            <a>
              <Link to={{ pathname: '/table' }} Style="padding-left:5px">
                {' '}
                View all{' '}
              </Link>
            </a>
          </div>
        }
        trigger="click"
      >
        <span style={{ marginRight: 25 }}>
          <Badge
            count={count}
            showZero
            style={{
              background: '#FE6202',
              boxShadow: 'rgba(254, 98, 2, 0.24) 0px 0px 1px 1px',
            }}
          >
            {' '}
          </Badge>
        </span>
      </Popover>
    </div>
  );
};
