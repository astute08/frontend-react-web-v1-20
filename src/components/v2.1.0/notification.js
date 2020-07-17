import React from 'react';
import { notification, Icon } from 'antd';

export default (props) => {

  const { status, message } = props;

  const icon = status === 'success' ? 'check-circle' : 'close-circle';
  const color = status === 'success' ? '#61CC80' : '#FF0000';

  notification.open({
    message: message,
    icon: <Icon type={icon} style={{ color: color }} />,
  });
}