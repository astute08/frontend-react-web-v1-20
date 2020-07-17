import React from 'react';
import { Card } from 'antd';
import '../css/card.css';
import styled from 'styled-components';

export default (props) => {
  const theme = {
    space: {
      xs: '20%',
      sm: '30%',
      md: '45%',
      default: '70%',
      lg: '100%'
    }
  }

  const spaceCard = props.size ? theme.space[props.size] : theme.space.lg;

  const CardKg = {
    width: `${spaceCard}`,
  }
  return (
    <Card
      {...props}
      style={CardKg}
    >
      {props.children}
    </Card>
  );
};
