import React, { useState, useEffect } from 'react';
import { Avatar } from 'antd';
import HttpClient from '../../../../components/httpClient';

let client = HttpClient();

const UserAvatar = (props) => {
  const loadUser = props.user;
  console.log('loadContent:: ', loadUser);

  return (
    <div style={{ textAlign: 'center' }}>
      {/* <Avatar size={100} shape="circle" src={'http://192.168.11.181:8200'+ props.profileImage}/> */}
      <Avatar
        size={100}
        shape="circle"
        src={`${process.env.REACT_APP_IMG_HOST}` + loadUser.profile_img}
      />
      <div style={{ marginTop: '10px' }}>
        <span>{loadUser.fullname}</span>
      </div>
    </div>
  );
};

export default UserAvatar;
