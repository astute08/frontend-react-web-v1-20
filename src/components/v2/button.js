import React from 'react';
import { Button } from 'antd';
import styled from 'styled-components';
import _ from 'lodash';

export default (props) => {
  // Theme
  const theme = {
    space: {
      sm: '8px',
      md: '16px',
    },
    fontSize: {
      sm: '12px',
      md: '14px',
      lg: '16px',
    },
    btnWidth: {
      wd_df: '96px',
      wd_md: '50%',
      wd_lg: '100%',
    },
  };

  const Buttons = styled(Button)`
    /* Adapt the colors based on primary prop */
    background-color: ${(props) => _.isString(props.primary) ? '#fe6202' : '#ffffff'};
    color: ${(props) => _.isString(props.primary) ? '#ffffff' : '#fe6202'};
    width: ${props.btnSize ? theme.btnWidth[props.btnSize] : theme.btnWidth.md};
    font-size: ${props.fontSize ? theme.fontSize[props.fontSize] : theme.fontSize.md};
    margin: 0px 10px 0px 10px;
    height: 32px;
    padding: 0.25em 1em;
    border: 1px solid #fe6202;
    /* border-radius: 0px; */
  `;
  
  return (
        <Buttons 
          {...props}
        >
          {props.children}
        </Buttons>
  );
};
