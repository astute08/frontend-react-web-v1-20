import React, { useState } from 'react';
import { Button } from 'antd';

const AppButton = (props) => {
  return (
    <Button
      onClick={props.onClick}
      style={props.style}
      size={props.size}
      type={props.type}
      htmlType={props.htmlType}
      icon={props.icon}
    >
      {props.textButton}
    </Button>
  );
};
export default AppButton;
