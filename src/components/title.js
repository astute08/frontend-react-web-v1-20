import React, { useState } from 'react';
import { Typography } from 'antd';

const { Title } = Typography;

const AppTitle = (props) => {
  const level = props.level ? props.level : 4;

  return (
    <Title level={level} style={{ color: props.color, fontSize: '15px' }}>
      {props.titleName}
    </Title>
  );
};
export default AppTitle;
