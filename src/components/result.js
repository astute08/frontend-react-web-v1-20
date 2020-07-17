import React from 'react';
import { Result } from 'antd';

export default (props) => {
  return (
    <Result status={props.status} titlle={props.title} extra={[props.extra]} />
  );
};
