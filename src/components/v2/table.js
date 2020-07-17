import React from 'react';
import { Table } from 'antd';

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

  const spaceTable = props.sizeWidth ? theme.space[props.size] : theme.space.md;

  const TableKg = {
    width: `${spaceTable}`,
    // marginBottom: '15px',
    display: 'block',
    // border: '1px solid #eee',
    // borderBottom: '0px solid #e8e8e8',
    // boxShadow: '0px 1px 2px 0px #00000033',
    // color: '#000000',
    // paddingBottom: '23px',
  };

  // let uniqueId = 0;
  
  return <Table 
      {...props} style={TableKg}
      // rowKey={(record) => {
      //   if (!record.__uniqueId) record.__uniqueId = ++uniqueId;
      //   return record.__uniqueId;
      // }} 
    />;
};
