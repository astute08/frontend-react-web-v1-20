import React, { useState } from 'react';
import { List } from 'antd';

const AppList = (props) => {
  const [data, setData] = useState([
    {
      name: 'test1',
    },
    {
      name: 'test2',
    },
  ]);

  return (
    <List
      dataSource={data}
      renderItem={(item) => (
        <List.Item>
          <List.Item.Meta description={item.name} />
        </List.Item>
      )}
    />
  );
};
export default AppList;
