import React from 'react';
import moment from 'moment';
import _ from 'lodash';
import Select from '../../../../components/v2.1.0/select';
import styled from 'styled-components';

const CustomFilter = styled.div`
  padding: 24px;
`;

const months = moment.months();
const years = [2022, 2021, 2020, 2019, 2018, 2017];

export default (props) => {
  const { month, year, onChangeMonth, onChangeYear } = props;

  const optionsMonth = months.map((element, index) => {
    return {
      key: index,
      value: element
    };
  });

  const settingSelectMonth = {
    width: '160px',
    defaultValue: month,
    onChange: _.isObject(onChangeMonth) ? onChangeMonth : null,
    options: optionsMonth
  };

  const optionsYear = years.map((element, index) => {
    return {
      key: index,
      value: element
    };
  }); 

  const settingSelectYear = {
    width: '160px',
    defaultValue: year,
    onChange: _.isObject(onChangeYear) ? onChangeYear : null,
    options: optionsYear
  };

  return (
    <CustomFilter>
      <Select {...settingSelectMonth} />
      <Select {...settingSelectYear} />
    </CustomFilter>
  );
}