import React, { useEffect } from 'react';
import { Input } from 'antd';
import styled, { css, ThemeProvider } from 'styled-components';

export default (props) => {
  // Theme
  const theme = {
    space: {
      sm: '25%',
      md: '50%',
      lg: '100%',
    },
  };

  // Theme Selector
  const spaceMd = props.size ? theme.space[props.size] : theme.space.md;

  // console.log('spaceMd', props);
  // Component
  // const InputKg = styled(Input)`
  //     width: ${spaceMd};
  // `;

  return (
      <Input
          {...props}
      />
  );
}
