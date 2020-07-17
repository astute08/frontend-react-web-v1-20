import React, { useEffect, useState } from 'react';
import { Card, Tree, Icon, Input, Menu } from 'antd';
import Button from '../../../components/v2/button';
import styled from 'styled-components';
import '../css/role.css'
import { isUndefined, isNull } from 'lodash';
const { TreeNode, DirectoryTree } = Tree;

const HoverDirectoryTree = styled(DirectoryTree)`
  
`;

export default (props) => {
  const obj = props.menu ? props.menu : null;
  const menu = props ? props.menu : "";

  const [collapsed, setCollapsed] = useState(false);
  const [children, setChildren] = useState();
  // const [menu, setMenu] = useState(obj);
  const [inputValue, setInputValue] = useState();
  console.log("roleTree", menu);

  useEffect(() => {
    // console.log("menu", "555");
    treeMenu();
  }, [props])


  const onMenuClick = (value) => {
    // console.log("menu value", value);
    setInputValue();
    props.callFuncOnClick(value);
  }

  // console.log("menu1", menu ? menu.length : 0);


  const treeMenu = () => {
    const menuLength = menu ? menu.length : 0;
    const children = [];
    for (let i = 0; i < menuLength; i++) {
      // children.push(<Menu.Item key={i.toString(5) + i}>{i.toString(5) + i}</Menu.Item>);
      children.push(<Menu.Item key={menu ? menu[i].per_gro_id : "0" + i} onClick={onMenuClick}>{menu ? menu[i].name : ""}</Menu.Item>);
      setChildren(children);
    }

  }

  // const children = [];
  // for (let i = 0; i < 8; i++) {
  //   // children.push(<Menu.Item key={i.toString(5) + i}>{i.toString(5) + i}</Menu.Item>);
  //   children.push(<Menu.Item key={menu ? menu[i].per_gro_id : "0" + i} onClick={onMenuClick}>{menu ? menu[i].name : ""}</Menu.Item>);
  // }

  // const menuItems = menu ? menu.map((item, index) => {
  //   return(<Menu.Item key={index}>{menu[item].name}</Menu.Item>);
  // }) : null

  const toggleCollapse = () => {
    setCollapsed(true);
  }


  return (
    <div>
      <Card
        title="Role"
        className='role-card'
        extra={
          <Button
            primary="primary"
            fontSize="md"
            btnsize="wd_df"
            onClick={() => props.handleName(true)}
          >
            Add New
          </Button>

        }
      >
        <Input
          style={{
            marginBottom: 15,
            marginLeft: 12,
            width: "93%"
          }}
          placeholder="Search..."
          prefix={<Icon type="search" style={{ color: "#7F7F7F" }} />}
        // suffix={searchValue ? <Icon type="close" style={{ color: "#7F7F7F", cursor: "pointer" }} onClick={() => setSearchValue("")} /> : ""}
        // onChange={onSearch} 
        />
        <Menu
          mode="inline"
          className='role-menu'
          inlineCollapsed={collapsed}
        >
          {children}

        </Menu>
      </Card>
    </div>
  );
};



// import React, { useEffect, useState } from 'react';
// import { Card, Tree, Icon, Input } from 'antd';
// import Button from '../../../components/v2/button';
// import Provider from './provider';
// import styled from 'styled-components';

// const { TreeNode, DirectoryTree } = Tree;

// const HoverDirectoryTree = styled(DirectoryTree)`

// `;

// export default (props) => {
//   const app = Provider.useAppContext();

//   const [gSource, setGSource] = useState([]);
//   const [source, setSource] = useState([]);
//   const [expandedKeys, setExpandedKeys] = useState();
//   const [searchValue, setSearchValue] = useState('');
//   const [autoExpandParent, setAutoExpandParent] = useState(false);
//   const [addNew, setAddNew] = useState(false);

//   const handelClickOrganization = (orgId) => {
//     const parentId = app.state.orgId ? app.state.orgId : '';
//     app.fnc.setOrgId();
//     app.fnc.setParentId(parentId);
//     app.fnc.setAddNewOrganization(true);
//   };

//   const loop = (data) =>
//     data.map((item) => {
//       const index = item.title.indexOf(searchValue);
//       const beforeStr = item.title.substr(0, index);
//       const afterStr = item.title.substr(index + searchValue.length);
//       const title =
//         index > -1 ? (
//           <span>
//             {beforeStr}
//             <span style={{ color: '#FE6202' }}>{searchValue}</span>
//             {afterStr}
//           </span>
//         ) : (
//           <span>{item.title}</span>
//         );

//       if (item.children && item.children.length) {
//         return (
//           <TreeNode className="styleTreeNode" key={item.key} title={title}>
//             {loop(item.children)}
//           </TreeNode>
//         );
//       }
//       return <TreeNode className="styleTreeNode" key={item.key} title={title}/>;
//     });

//   const handleSelectNode = (selectedKeys, e) => {
//     app.fnc.setOrgId(parseInt(selectedKeys[0]));
//     app.fnc.setAddNewOrganization(false);
//     setAddNew(true);
//   }

//   const onSearch = (e) => {
//     const { value } = e.target;
//     const expKeys = gSource
//       .map((item) => {
//         if (item.title.indexOf(value) > -1) {
//           return getParentKey(item.key, source);
//         }
//         return null;
//       })
//       .filter((item, i, self) => item && self.indexOf(item) === i);

//     setExpandedKeys(expKeys);
//     setSearchValue(value);
//     setAutoExpandParent(true);
//   };

//   const getParentKey = (key, tree) => {
//     let parentKey;
//     for (let i = 0; i < tree.length; i++) {
//       const node = tree[i];
//       if (node.children) {
//         if (node.children.some(item => item.key === key)) {
//           parentKey = node.key;
//         } else if (getParentKey(key, node.children)) {
//           parentKey = getParentKey(key, node.children);
//         }
//       }
//     }
//     return parentKey;
//   };

//   const onExpand = (e) => {
//     setExpandedKeys(e);
//     setAutoExpandParent(false);
//   }

//   const onAddNewClick = (value) =>{
//       setAddNew(true);
//       console.log("onAddNewClick", addNew);
//   }


//   useEffect(() => {
//     setGSource([...props.gData]); // sourceData
//     setSource([...props.data]);
//   }, [props]);

//   return (
//     <div>
//       <Card
//         title="Role"
//         extra={
//           <Button 
//             primary="primary"
//             fontSize="md"
//             btnsize="wd_df"
//             onClick={() => props.handleName(true)}
//             >
//               Add New
//           </Button>

//         }
//       >
//         <Input 
//           className="AppBorderRadius"
//           style={{ 
//             marginBottom: 15, 
//             marginLeft: 14, 
//             width: "90%"
//           }} 
//           placeholder="Search..." 
//           prefix={<Icon type="search" style={{ color: "#7F7F7F" }}/>} 
//           // suffix={searchValue ? <Icon type="close" style={{ color: "#7F7F7F", cursor: "pointer" }} onClick={() => setSearchValue("")} /> : ""}
//           onChange={onSearch} />
//         <HoverDirectoryTree
//           showIcon={false}
//           onSelect={handleSelectNode}
//           onExpand={onExpand}
//           expandedKeys={expandedKeys}
//           autoExpandParent={autoExpandParent}
//           switcherIcon={<Icon type="caret-down" style={{ fontSize: "20px", color: "#7F7F7F" }} />}
//         >
//             {loop(source)}
//         </HoverDirectoryTree>
//       </Card>
//     </div>
//   );
// };