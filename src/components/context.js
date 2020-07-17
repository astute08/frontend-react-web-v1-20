import React, { useState, createContext, useContext } from 'react';

const AppContext = createContext();
const AppProvider = ({ children }) => {
  const [number, setNumber] = useState(0);
  const [content, setContent] = useState('dddddddddddd');
  return (
    <AppContext.Provider
      value={{
        state: {
          number,
          content,
        },
        setNumber,
        setContent,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

const useAppContext = () => useContext(AppContext);

const AppCal = (props) => {
  const app = useAppContext();
  app.setContent('hello');
  return <p>{app.state.content}</p>;
};

const AppCalView = (props) => {
  const app = useAppContext();

  return <p>{app.state.content}</p>;
};

export default () => {
  return (
    <AppProvider>
      <AppCal />
      <AppCalView />
    </AppProvider>
  );
};
