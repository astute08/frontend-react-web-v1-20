import axios from 'axios';
import join from 'url-join';

let isAbsoluteURLRegex = /^(?:\w+:)\/\//;

const instance = axios.create();

instance.interceptors.request.use(async (config) => {

  var url = `${process.env.REACT_APP_URL_MANAGER}`;
  var port = `${process.env.REACT_APP_RESOURCE_MANAGER_OLD_PORT}`;
  if (!isAbsoluteURLRegex.test(config.url)) {
    
    if(config.url === '/tasks/monitor' 
      || config.url === '/tasks/monitor/update') {
      port = `${process.env.REACT_APP_TASK_MANAGER_PORT}`;
    }
    else if(config.url.indexOf('/company/user/') !== -1 ) {
      port = `${process.env.REACT_APP_RESOURCE_MANAGER_PORT}`;
    }
    // else if(config.url.indexOf('/company/user/') !== -1 ) {
    //   port = '8203'; //พอร์ทของ company topbar มีปัญหา 
    // }

    config.url = join(`${url}:${port}`, config.url);
  }

  config.mode = 'no-cors';
  config.credentials = 'same-origin';
  config.headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  };

  return config;
});

export default instance;
