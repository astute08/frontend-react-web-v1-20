import React from 'react';
import Cookies from 'universal-cookie';
import * as moment from 'moment';

var jwt = require('jsonwebtoken');

const cookies = new Cookies();

const checkLogin = (props) => {
  const token = props ? props.token : cookies.get('wfm_access_token');
  if (token) {
    const decode = jwt.decode(token);
    console.log('decode', moment(decode.exp * 1000).format('LT'));
    const expr = moment(decode.exp * 1000).format('LT');
    const now = moment().format('LT');

    // if(expr>now){
    //     window.location.href = '/'

    // }
    // else if(expr < now){
    //     window.location.href = '/dashboard'

    // }
  }
};

export default {
  checkLogin,
};
