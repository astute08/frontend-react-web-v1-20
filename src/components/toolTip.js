import React, { useState } from 'react';
import { Tooltip, Button } from 'antd';

const Apptooltip = (props) => {
  const text = props.tootip ? props.tootip : 'Test';
  return (
    <Tooltip placement="rightBottom" title={text}>
      <Button>TL</Button>
    </Tooltip>
  );
};
export default Apptooltip;
