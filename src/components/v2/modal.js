import React, { Children } from 'react';
import { Modal } from 'antd';

export default (props) => {
  const theme = {
    space: {
      xs: '20%',
      sm: '30%',
      md: '45%',
      default: '70%',
      lg: '100%',
    },
  };

  const spaceModal = props.size ? theme.space[props.size] : theme.space.md;

  const ModalKg = {
    width: `${spaceModal}`,
  };

  return(
      <Modal {...props} style={ModalKg} >
          {props.children}
      </Modal>
  );
}
