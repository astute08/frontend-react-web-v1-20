import React, { useState } from 'react';
import { Tabs } from 'antd';

const { TabPane } = Tabs;

const AppTabs = (props) => {
  let arr = [];
  let length = props.tabspane ? props.tabspane : 2;
  for (var i = 0; i < length; i++) {
    arr.push(i);
  }
  console.log(arr);

  return (
    <Tabs defaultActiveKey="1">
      {arr.map((item, i) => (
        <TabPane tab="Tab 1" key={i}>
          Content of Tab Pane 1
        </TabPane>
      ))}
    </Tabs>
  );
};
export default AppTabs;
