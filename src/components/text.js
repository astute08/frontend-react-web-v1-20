import React, { useState } from 'react';
import { Typography } from 'antd';

const { Text } = Typography;

const AppText = (props) => {
  let type = props.type ? props.type : '';
  let fontSize = props.type ? props.type : '12px';
  return (
    <Text type={props.type} style={{ fontSize: fontSize }}>
      {props.text}
    </Text>
  );
};
export default AppText;
