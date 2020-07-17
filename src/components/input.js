import React from 'react';
import { Input } from 'antd';

const AppInput = (props) => {
  return (
    // <Input style={{width:props.InputWidth}} size={props.size} />
    <Input
      size={props.size}
      style={props.style}
      value={props.value}
      onChange={props.onChange}
      placeholder={props.placeholder}
      prefix={props.prefix}
    />
  );
};

export default AppInput;
