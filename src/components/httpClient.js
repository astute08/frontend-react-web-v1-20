import React from 'react';
import axios from 'axios';

export default () => {

  const accessToken = localStorage.getItem("accessToken");
  const headers = {
    // "Access-Control-Allow-Origin" : "*"
    Authorization : `Bearer ${accessToken}`,

  };
  const baseURL = `${process.env.REACT_APP_URL_MANAGER_ADD_PORT}`;

  return axios.create({
    baseURL,
    headers,
  });
};

// useEffect(async () => {
//     const result = await axios(
//       'https://hn.algolia.com/api/v1/search?query=redux',
//     );
//     setData(result.data);
//   });

// let client = HttpClient();
// const handleRegister = async () => {
//     const res = await client.get('/v1/mysql/users', {
//         setData(res.data);
//         console.log('Users: ', result.data)
//         // username, // parameter
//         // password
//         });
// }
