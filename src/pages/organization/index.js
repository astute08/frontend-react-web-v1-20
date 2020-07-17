import React from 'react';
import Provider from './provider';
import Organization from './organization';
import Contacts from './contacts/index';

export default (props) => {

  // const comId = props.comId;
  const comId = localStorage.getItem('comId');

  return (
    <Provider.AppProvider comId={comId}>
      <Organization />
    </Provider.AppProvider>
  );
};
