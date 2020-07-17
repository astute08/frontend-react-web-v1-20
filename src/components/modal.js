import React, { useState } from 'react';
import { Modal } from 'antd';
import AppButton from './button';
import AppSelect from './select';
const AppModal = (props) => {
  const [state, setState] = useState(false);

  const showModal = () => {
    setState(!state);
  };

  const handleOk = (e) => {
    setState(false);
  };

  const handleCancel = (e) => {
    setState(false);
  };

  return (
    <div>
      {/* { <AppButton
        onClick={showModal}
        color={props.color}
        textColor={props.textColor}
        borderColor={props.borderColor}
        textButton={props.textButton}
      /> } */}

      <Modal
        title={'test'}
        visible={state}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <AppSelect data={props.data} />
      </Modal>
    </div>
  );
};
export default AppModal;
