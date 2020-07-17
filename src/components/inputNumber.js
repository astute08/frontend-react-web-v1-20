import React, { useState } from 'react';
import { Input } from 'antd';

const AppInputNumber = (props) => {
  const onChange = (e) => {
    const { value } = e.target;
    const reg = /^-?[0-9]*(\.[0-9]*)?$/;
    if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
      this.props.onChange(value);
    }
  };

  const onBlur = () => {
    const { value, onBlur, onChange } = this.props;
    let valueTemp = value;
    if (value.charAt(value.length - 1) === '.' || value === '-') {
      valueTemp = value.slice(0, -1);
    }
    onChange(valueTemp.replace(/0*(\d+)/, '$1'));
    if (onBlur) {
      onBlur();
    }
  };

  return (
    <Input
      placeholder="Basic usage"
      maxlength={props.maxlength}
      onChange={onChange}
      onBlur={onBlur}
    />
  );
};

export default AppInputNumber;
