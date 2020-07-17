import React,{useState} from 'react';
import { Select } from 'antd';
import { useSSR } from 'react-i18next';

const { Option } = Select;


export default (props) => {
  const [select, setSelect] = useSSR();
  
  const theme = {
    space: {
      xs: '20%',
      sm: '30%',
      md: '45%',
      default: '70%',
      lg: '100%',
    },
  };

  const spaceSelect = props.size ? theme.space[props.size] : theme.space.md;

  const SelectKg = {
    width: `${spaceSelect}`,
  };

  const doOption = (value) => {
    console.log('doSomething called by child with value:', value);
  };

return <Select {...props} style={SelectKg}>{props.children}</Select>;
};
