import React, { useState } from 'react';
import { Select } from 'antd';

// const { Option } = Select;

// const AppSelect = props => {
//   const app = props.context();
export default (props) => {
  // const { keyFild , valueField, displayField} = this.props;
  const data = [
    {
      name: 'test1',
    },
    {
      name: 'test2',
    },
  ];
  // const data = [
  //   {
  //     name: "test1"
  //   },
  //   {
  //     name: "test2"
  //   }
  // ];

  const handleChange = (value) => {
    app.setTeam(value);
    app.setCheck(1);
  };
  return (
    <Select
      showSearch
      style={{ width: 200 }}
      placeholder="Please Select"
      onChange={handleChange}
    >
      {/* {props.data.map((item, i) => (
        <Option key={item.id} value={item.title} placeholder="Please Select">
          {item.title}
   <Select showSearch style={{ width: 200 }} placeholder="Please Select">
=======
export default (props) => {
  // const { keyFild , valueField, displayField} = this.props;
  // const data = [
  //   {
  //     name: "test1"
  //   },
  //   {
  //     name: "test2"
  //   }
  // ];

  const handleChange = value => {
    app.setTeam(value);
    app.setCheck(1);
  };
  return (
    // <Select showSearch style={{ width: 200 }} placeholder="Please Select">
    <Select showSearch 
      style={props.style} 
      placeholder={props.placeholder} 
      size={props.size} 
      value={props.value} 
      onChange={props.onChange} 
    > 
      {/* {data.map((data, i) => (
        <Option key={i} value={i.name}>
          {data.name}
        </Option> 
       ))} */}

      {props.children}
    </Select>
  );
};
export default AppSelect;
