import React from 'react';
import HttpClient from '../components/httpClient';

const client = HttpClient();

export default async (props) => {
  const data = {
    companyId: props.companyId,
    lang: props.lang,
    pageCode: props.pageCode,
  };

  const url = `${process.env.REACT_APP_URL_MANAGER}`;
  const port = `${process.env.REACT_APP_RESOURCE_MANAGER_PORT}`;
  client.defaults.baseURL = `${url}:${port}`;

  const getLanguage = await client.post('/v2/language/company', data);

  console.log('getLanguage', getLanguage);

  return getLanguage.data[0];
};
