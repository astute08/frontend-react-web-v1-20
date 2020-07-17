import React, { useState } from 'react';
import { Radio } from 'antd';

const AppRedio = (props) => {
  // ทดลองเพิ่มข้อมูล Check Radio ข้อมูลเป็น  [a, b, c, d]
  const [list, setList] = useState(['a', 'b', 'c', 'd']);
  const [state, setState] = useState('');

  const handlechange = (e) => {
    console.log('radio checked', e.target.value);
    setState(e.target.value);
  };

  return (
    <Radio.Group onChange={handlechange} value={state}>
      {list.map((todo, i) => (
        <Radio key={i} value={todo}>
          {todo}
        </Radio>
      ))}
    </Radio.Group>
  );
};
export default AppRedio;
