import React, { useState } from 'react';
import { Empty } from 'antd';

const AppEmpty = (props) => {
  //const [state, setState] = useState(false);

  return (
    <div>
      <Empty description={<b style={{ color: props.color }}>{props.title}</b>}>
        {props.children}
      </Empty>
    </div>
  );
};
export default AppEmpty;
