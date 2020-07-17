import React from 'react';
import { Tree, Icon } from 'antd';

const { TreeNode } = Tree;

export default (props) => {
  const onSelect = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info);
  };

  return (
    <Tree
      showLine
      switcherIcon={props.switcherIcon}
      defaultExpandedKeys={props.defaultExpandedKeys}
      onSelect={onSelect}
    >
      <TreeNode title={props.title} key={props.key}>
        {' '}
      </TreeNode>
    </Tree>
  );
};
