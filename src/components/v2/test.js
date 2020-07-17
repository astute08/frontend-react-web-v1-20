import React, { useState } from 'react';
import { Button } from 'antd';
import Select from './select';

const { Option } = Select;

export default () => {
  const [value, setValue] = useState('');
  const [visible, setVisible] = useState();

  const onValueChange = (e) => {
    console.log('Value:::', e.target.value);
    setValue(e.target.value);
  };
  const showModal = () => {
    setVisible(true);
  };

  const handleOk = (e) => {
    setVisible(false);
  };

  const handleCancel = (e) => {
    setVisible(false);
  };

  return (
    <div>
      <Select
        mode="multiple"
        placeholder="select one country"
        defaultValue={['china']}
        size="lg"
      ></Select>
    </div>
  );
};
