import React from 'react';
import AppProvider from './appProvider';
import Contacts from './contacts';
import Documents from './documents';
import Infomation from './infomationView';
import { Card, Form } from 'antd';

export default (props) => {
  const app = AppProvider.useAppContext();

  // console.log(props.fullname.value);

  // const setInfomation = {
  //   name: ,
  // };

  return (
    <div>
      <div>
        <Infomation data={props} />
      </div>
      <div>
        <Contacts />
      </div>
      <div>
        <Documents />
      </div>
    </div>
  );
};
