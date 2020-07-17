import React from 'react';
import _ from 'lodash';
import { Select } from 'antd';
import styled from 'styled-components';

const { Option } = Select;

const CustomSelect = styled(Select)`
  width: ${props => props.theme.width};
`;

export default (props) => {

  const { options, width } = props

  const theme = {
    width: width ? width : '180px'
  };

  const list = _.isObject(options) ? options.map((object, index) => {
    const { key, value } = object;
    return (
      <Option key={key} value={value}>{value}</Option>
    );
  }) : null;

  return (
    <CustomSelect theme={theme} {...props}>
      {list}
    </CustomSelect>
  );
}