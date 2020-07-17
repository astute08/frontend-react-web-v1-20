import React, { useState } from 'react';
import { Button } from 'antd';

export default () => {
  const [visible, setVisible] = useState(false);

  const handlerClick = () => {
    setVisible(true);
  };

  return (
    <div>
      <h1>{visible}</h1>
      <Button onClick={handlerClick}>Add</Button>
    </div>
  );
};
