import React from 'react';
import { useParams } from 'react-router-dom';
import AppProvider from './appProvider';
import Register from './register_test';
import './styles.css';

var jwt = require('jsonwebtoken');

export default (props) => {
  const param = useParams();
  var decode = jwt.decode(param.token);

  return (
    <AppProvider.AppProvider
      comId={decode.company_id}
      userId={decode.user_id}
      email={decode.email}
    >
      <Register />
    </AppProvider.AppProvider>
  );
};
