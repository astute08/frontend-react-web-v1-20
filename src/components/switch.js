import React, { useState } from 'react';
import { Switch } from 'antd';

const AppSwitch = (props) => {
  return (
    <Switch
      size={props.size}
      onChange={props.onChange}
      value={props.value}
      checked={props.checked}
      style={props.style}
    />
  );
};

export default AppSwitch;
