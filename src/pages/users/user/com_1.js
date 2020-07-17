import React, { useState } from 'react';
import Com2 from './com_2';

export default () => {
  const [text, setText] = useState('test1');
  const handleChange = (v) => {
    setText(v);
  };
  return (
    <div>
      {text}
      <Com2 fnc={handleChange} />
    </div>
  );
};
