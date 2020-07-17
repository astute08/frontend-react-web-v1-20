import React from 'react';
import { Avatar } from 'antd';
import styled from 'styled-components';

export default (props) => {
    // console.log('color: ', props.color);
    let colorBorder = props.color === undefined ? '#dcdcde' : props.color
    let bkColor = props.bkColor === undefined ? '#dcdcde' : props.bkColor

    // style Avatar
    const styleAvatar = {
      display: 'block',
      margin: props.margin || 'auto',
      border: `2px solid ${colorBorder}`,
      backgroundColor: `${bkColor}`
      
    };

  return (
    <Avatar {...props} style={styleAvatar} /> 
  );
};

