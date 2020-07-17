import React from 'react';
import { Avatar } from 'antd';

const AppAvatar = (props) => {
  // style Avatar
  const styleAvatar = {
    display: 'block',
    margin: props.margin || 'auto',
  };

  return (
    <Avatar
      size={props.size}
      icon={props.icon}
      style={styleAvatar}
      src={props.src}
    />
  );
};

export default AppAvatar;
