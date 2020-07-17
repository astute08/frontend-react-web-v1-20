import React, { useEffect, useState } from 'react';
import { Card, Tree, Icon, Input } from 'antd';
import Button from '../../components/v2/button';
import Provider from './provider';
import styled from 'styled-components';

const { TreeNode, DirectoryTree } = Tree;

const HoverDirectoryTree = styled(DirectoryTree)`
  
`;

export default (props) => {
  const app = Provider.useAppContext();

  const [gSource, setGSource] = useState([]);
  const [source, setSource] = useState([]);
  const [expandedKeys, setExpandedKeys] = useState();
  const [searchValue, setSearchValue] = useState('');
  const [autoExpandParent, setAutoExpandParent] = useState(false);

  const handelClickOrganization = (orgId) => {
    const parentId = app.state.orgId ? app.state.orgId : '';
    app.fnc.setOrgId();
    app.fnc.setParentId(parentId);
    app.fnc.setAddNewOrganization(true);
  };

  const loop = (data) =>
    data.map((item) => {
      const index = item.title.indexOf(searchValue);
      const beforeStr = item.title.substr(0, index);
      const afterStr = item.title.substr(index + searchValue.length);
      const title =
        index > -1 ? (
          <span>
            {beforeStr}
            <span style={{ color: '#FE6202' }}>{searchValue}</span>
            {afterStr}
          </span>
        ) : (
          <span>{item.title}</span>
        );

      if (item.children && item.children.length) {
        return (
          <TreeNode className="styleTreeNode" key={item.key} title={title}>
            {loop(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode className="styleTreeNode" key={item.key} title={title}/>;
    });

  const handleSelectNode = (selectedKeys, e) => {
    app.fnc.setOrgId(parseInt(selectedKeys[0]));
    app.fnc.setAddNewOrganization(false);
  }

  const onSearch = (e) => {
    const { value } = e.target;
    const expKeys = gSource
      .map((item) => {
        if (item.title.indexOf(value) > -1) {
          return getParentKey(item.key, source);
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);
    
    setExpandedKeys(expKeys);
    setSearchValue(value);
    setAutoExpandParent(true);
  };

  const getParentKey = (key, tree) => {
    let parentKey;
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      if (node.children) {
        if (node.children.some(item => item.key === key)) {
          parentKey = node.key;
        } else if (getParentKey(key, node.children)) {
          parentKey = getParentKey(key, node.children);
        }
      }
    }
    return parentKey;
  };

  const onExpand = (e) => {
    setExpandedKeys(e);
    setAutoExpandParent(false);
  }

  useEffect(() => {
    setGSource([...props.gData]);
    setSource([...props.data]);
  }, [props]);

  return (
    <div>
      <Card
        title="Organization"
        extra={
          <Button 
            primary="primary"
            fontSize="md"
            btnsize="wd_df"
            onClick={() => handelClickOrganization()}>
              Add New
          </Button>
        }
      >
        <Input 
          className="AppBorderRadius"
          style={{ 
            marginBottom: 15, 
            marginLeft: 15, 
            width: "93%"
          }} 
          placeholder="Search..." 
          prefix={<Icon type="search" style={{ color: "#7F7F7F" }}/>} 
          // suffix={searchValue ? <Icon type="close" style={{ color: "#7F7F7F", cursor: "pointer" }} onClick={() => setSearchValue("")} /> : ""}
          onChange={onSearch} />
        <HoverDirectoryTree
          showIcon={false}
          onSelect={handleSelectNode}
          onExpand={onExpand}
          expandedKeys={expandedKeys}
          autoExpandParent={autoExpandParent}
          switcherIcon={<Icon type="caret-down" style={{ fontSize: "20px", color: "#7F7F7F" }} />}
        >
            {loop(source)}
        </HoverDirectoryTree>
      </Card>
    </div>
  );
};
