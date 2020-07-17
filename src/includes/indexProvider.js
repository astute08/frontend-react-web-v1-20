import React, { useState, useEffect, createContext, useContext } from 'react';
import httpClient from '../components/axiosClient';

const AppContext = createContext();

export const AppProvider = (props) => {

  const { children } = props;

  const userId = localStorage.getItem('userId');
  const firstName = localStorage.getItem('firstName');
  const lastName = localStorage.getItem('lastName');
  const email = localStorage.getItem('email');
  const comId = localStorage.getItem('comId');
  const comName = localStorage.getItem('comName');
  const fullName = firstName + ' ' + lastName;
  const [dataUser, setDataUser] = useState();

  const getDataUser = async () => {
    try {
      const response = await httpClient.get(`/v2/member/profile/keycloak/${userId}`);
      if(response.status === 200) {
        setDataUser(response.data);
      }
      else {
        setDataUser();
      }
    }
    catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDataUser();
  }, []);

  return (
    <AppContext.Provider
      value={{
        state: {
          userId,
          firstName,
          lastName,
          fullName,
          email,
          comId,
          comName,
          dataUser
        },
        fnc: {
          setDataUser
        }
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
