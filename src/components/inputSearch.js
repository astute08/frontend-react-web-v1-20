import React, { useState } from 'react';
import { Input, Icon } from 'antd';

const { Search } = Input;

const AppinputSearch = (props) => {
  return (
    <Search
      placeholder={props.placeholder}
      prefix={<Icon type="search" />}
      onSearch={(value) => console.log(value)}
      style={props.style}
      value={props.value}
      onChange={props.onChange}
    />
  );
};

export default AppinputSearch;
