import React from 'react';
import { Card } from 'antd';
// import AppAvatar from "./avatar";

const AppCard = (props) => {
  const {
    loading,
    style,
    title,
    extra,
    size,
    actions,
    children,
    type,
    hoverable,
    tabList,
    activeTabKey,
    onTabChange,
  } = props;

  return (
    <Card
      style={style}
      title={title}
      extra={extra}
      size={size}
      actions={actions}
      loading={loading}
      type={type}
      hoverable={hoverable}
      tabList={tabList}
      activeTabKey={activeTabKey}
      onTabChange={onTabChange}
    >
      {children}
    </Card>
  );
};

// const styleHead = {
//   padding: '5px 10px 5px 10px',
// };

export default AppCard;
