import React from 'react';
import { Select } from 'antd';

function handleChange(value) {
  console.log(`selected ${value}`);
}

// const { Option } = Select;

// const children = [];
// for (let i = 10; i < 36; i++) {
//     children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
//   }

const AppSelectTool = (props) => {
  return (
    <Select
      mode="tags"
      style={{ width: '100%' }}
      placeholder={props.placeholder}
      onChange={handleChange}
      optionLabelProp="label"
    >
      {props.children}
    </Select>
  );
};

export default AppSelectTool;
