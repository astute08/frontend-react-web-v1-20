import React from 'react';
import { TreeSelect } from 'antd';

const { TreeNode } = TreeSelect;

export default ({ dataSource, onChange }) => {

  const loop = (data) => 
    data.map((item) => {
      if (item.children && item.children.length) {
        return (
          <TreeNode className="styleTreeNode" value={item.key} key={item.key} title={item.title}>
            {loop(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode className="styleTreeNode" value={item.key} key={item.key} title={item.title}/>;
    });

  return (
    <TreeSelect
      showSearch
      style={{ width: '100%' }}
      // value={selected}
      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
      placeholder="All Team"
      allowClear
      treeDefaultExpandAll
      onChange={onChange}
    >
      {loop(dataSource)}
    </TreeSelect>
  );
}