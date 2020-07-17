import React, {
  useState,
  useRef,
  useEffect,
  createContext,
  useContext,
} from 'react';
import { Card, Modal, Button } from 'antd';

const AppContext = createContext();
const AppProvider = ({ children }) => {
  const [cardLoading, setCardLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const txtInput = useRef();

  return (
    <AppContext.Provider
      value={{
        ref: {
          txtInput,
        },
        state: {
          visible,
          cardLoading,
        },
        setVisible,
        setCardLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

const useAppContext = () => useContext(AppContext);

const ModalForm = (props) => {
  const app = useAppContext();

  const handleOk = () => {
    app.setVisible(false);
  };

  const handleCancel = () => {
    app.setVisible(false);
  };

  return (
    <Modal
      title="Assign Team"
      visible={app.state.visible}
      onOk={handleOk}
      //   confirmLoading={confirmLoading}
      onCancel={handleCancel}
    >
      <p>Team : {props.userId}</p>
      <p>Team : 2</p>
      <p>Team : 3</p>
      <p>Team : 4</p>
    </Modal>
  );
};

const Assign = () => {
  const app = useAppContext();

  const handleClick = () => {
    app.setVisible(true);
  };

  return (
    <Button type="primary" size="default" onClick={handleClick}>
      Assign
    </Button>
  );
};

const CardTeam = (props) => {
  const app = useAppContext();

  useEffect(() => {
    if (!app.state.visible) app.setCardLoading(true);
    setTimeout(() => {
      app.setCardLoading(false);
      app.ref.txtInput.current.focus();
    }, 5000);
  }, [app.state.visible]);

  return (
    <Card title="Team" loading={app.state.cardLoading} extra={<Assign />}>
      <p>{props.userId}</p>
      <p>Card content</p>
      <p>Card content</p>
      <input ref={app.ref.txtInput} defaultValue="" />
    </Card>
  );
};

export default (props) => {
  return (
    <AppProvider>
      <CardTeam userId={props.userId} />
      <ModalForm userId={props.userId} />
    </AppProvider>
  );
};
