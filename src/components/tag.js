import React from 'react';
import { Tag } from 'antd';

const TagsApp = (props) => {
  return (
    <Tag className={props.class} closable onClose={props.function}>
      {props.value}
    </Tag>
  );
};
export default TagsApp;
