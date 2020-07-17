import React, { useState, useEffect, useCallback } from 'react';
import { Transfer, Table, notification, Icon } from 'antd';
import './css/modalMember.css';
import Modal from '../../../components/v2/modal';
import Button from '../../../components/v2/button';
import Input from '../../../components/v2/input';
import HttpClient from '../../../components/httpClient';
import difference from 'lodash/difference';
import Provider from '../provider';

let client = HttpClient();

const filterOption = (inputValue, items) => {
  if (!inputValue) {
    return items;
  }
  let strRegex = inputValue.replace(/\//g, '');
  strRegex = new RegExp(inputValue, 'g');
  return items.filter(
    (e) => e && e['fullname'] && strRegex.test(e['fullname']),
  );
};

// Customize Table Transfer
const TableTransfer = ({ leftColumns, rightColumns, ...restProps }) => (
  <Transfer className="transfer-member" {...restProps} showSelectAll={false}>
    {({
      direction,
      filteredItems,
      onItemSelectAll,
      onItemSelect,
      selectedKeys: listSelectedKeys,
      disabled: listDisabled,
    }) => {
      const columns = direction === 'left' ? leftColumns : rightColumns;
      const rowSelection = {
        getCheckboxProps: (item) => ({
          disabled: listDisabled || item.disabled,
        }),
        onSelectAll(selected, selectedRows) {
          const treeSelectedKeys = selectedRows
            .filter((item) => !item.disabled)
            .map(({ key }) => key);
          const diffKeys = selected
            ? difference(treeSelectedKeys, listSelectedKeys)
            : difference(listSelectedKeys, treeSelectedKeys);
          onItemSelectAll(diffKeys, selected);
        },
        onSelect({ key }, selected) {
          onItemSelect(key, selected);
        },
        selectedRowKeys: listSelectedKeys,
      };

      let isLeft = direction === 'left';

      // console.log('isLeft::: ', isLeft)
      let defalutData = [];
      defalutData = filterOption(
        restProps.search[isLeft ? 0 : 1],
        filteredItems,
      );

      // console.log('rowSelection****', listSelectedKeys);

      return (
        <div>
          <Input className="input-search-member"
            value={restProps.search[isLeft ? 0 : 1]}
            onChange={(e) => {
              restProps.handleSearch(direction, e.target.value);
            }}
            placeholder={'Search'}
            prefix={<Icon className="icon-search-member" type="search" />}
          />
          <Table
            className="transfer-table-member"
            rowSelection={rowSelection}
            columns={columns}
            dataSource={defalutData}
            size="small"
            pagination={false}
            style={{ pointerEvents: listDisabled ? 'none' : null }}
            onRow={({ key, disabled: itemDisabled }) => ({
              onClick: () => {
                if (itemDisabled || listDisabled) return;
                onItemSelect(key, !listSelectedKeys.includes(key));
              },
            })}
            scroll={{ y: 505 }}
          />
        </div>
      );
    }}
  </Transfer>
);

const leftTableColumns = [
  {
    dataIndex: 'fullname',
    title: 'Contact Name',
  },
  {
    dataIndex: 'email',
    title: 'Email',
  },
];

const rightTableColumns = [
  {
    dataIndex: 'fullname',
    title: 'Contact Name',
  },
  {
    dataIndex: 'email',
    title: 'Email',
  },
];

export default (props) => {
  // console.log('modal member:::++ ', props);

  const app = Provider.useAppContext();
  const members = props.dataMembers;
  let orgId = props.orgId;
  let created_by = 1;
  let com_id = 1;

  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mockData, setMockData] = useState([]);
  const [targetKeys, setTargetKeys] = useState([]);
  const [selected, setSelected] = useState([]);
  const [targetSelected, setTargetSelected] = useState([]);
  const [inputSearch, setInputSearch] = useState(['', '']);
  const [saveData, setSaveData] = useState();

  const [formRef, setFormRef] = useState(null);

  // console.log('handleOk targetKeys::** ', targetKeys);


  useEffect(() => {
    getMock();
    getMember(props.dataMembers);
    setVisible(false);
    // setMembers(props.dataMembers);
  }, [props]);

  const showModal = () => {
    setVisible(true);
  };

  const handleSave = async () => {
    const body = {
      user_id: targetKeys,
      created_by: created_by,
      org_id: orgId,
    };

    // console.log('handleSave:::** ', body);

    try {
      const result = await client.post('/v2/manageteammember', body);
      if (result.status === 200) {
        successNotification(result.data.data);
        props.refreshDataMembers();
      }
    } catch (error) {
      console.log(error);
    }
    setVisible(false);
    setSelected([]);
  };

  const handleCancel = () => {
    setVisible(false);
    setLoading(false);
    setInputSearch(['', '']);
    setSelected([]);
    // getMember(props.dataMembers);
    // getMock();
  };

  const getMock = async () => {
    const mockData = [];
    const result = await client.get(`/v2/users/${com_id}`);
    const users = result.data;
    // console.log('get users:::++ ', result.data);


    for (let i = 0; i < users.length; i++) {
      const data = {
        key: users[i].mem_com_id.toString(),
        fullname: users[i].fullname,
        email: users[i].email,
      };
      mockData.push(data);
    }
    setMockData(mockData);
  };

  const getMember = (dataMembers) => {
    // console.log('dataMembers::: ', dataMembers);

    const targetKeys = [];
    if (dataMembers) {
      for (let i = 0; i < dataMembers.length; i++) {
        targetKeys.push(dataMembers[i].mem_com_id.toString());
      }
    }
    // console.log('get member::: ', targetKeys);
    setTargetKeys(targetKeys);
  };

  const handleChange = (targetKeys, direction, moveKeys) => {
    setTargetKeys(targetKeys);
  };

  // const renderItem = (item) => {
  //   const customLabel = (
  //     <span className="custom-item">
  //       {item.key} - {item.fullname}
  //     </span>
  //   );
  //   return {
  //     label: customLabel, // for displayed item
  //     value: item.title, // for title and filter matching
  //   };
  // };

  const handleSearch = (dir, value) => {
    // console.log('search:', dir, value);
    let option = [...inputSearch];
    if (dir === 'left') {
      option[0] = value;
    } else {
      option[1] = value;
    }
    setInputSearch(option);
  };

  const selectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    // console.log('selectChange::** ', sourceSelectedKeys, targetSelectedKeys);
    setSelected([...sourceSelectedKeys, ...targetSelectedKeys]);
  };

  // const filterOption = (inputValue, item) => {
  //   // console.log('inputValue:: ', inputValue, item)
  //   // setInputSearch(inputValue);

  //   return (
  //     item.fullname.indexOf(inputValue) !== -1 ||
  //     item.email.indexOf(inputValue) !== -1
  //   );
  // };

  const successNotification = (message) => {
    notification.success({
      icon: <Icon type="check-circle" style={{ color: '#fe6202' }} />,
      message: message,
    });
  };

  return (
    <div>
      <Button type="primary" fontSize="md" btnSize="wd_lg" onClick={showModal}>
        Add Member
      </Button>
      <Modal
        className="member"
        width={824}
        visible={visible}
        title="Member"
        onOk={handleSave}
        onCancel={handleCancel}
        footer={[
          <Button
            key="back"
            fontSize="md"
            btnSize="wd_df"
            onClick={handleCancel}
          >
            Cancel
          </Button>,
          <Button
            type="primary"
            key="submit"
            fontSize="md"
            btnSize="wd_df"
            loading={loading}
            onClick={handleSave}
          >
            Save
          </Button>,
        ]}
      >
        <TableTransfer
          titles={['User', 'Member']}
          dataSource={mockData}
          targetKeys={targetKeys}
          onChange={handleChange}
          selectedKeys={selected}
          onSelectChange={selectChange}
          // filterOption={(inputValue, item) =>
          //   item.fullname.indexOf(inputValue) !== -1 || item.email.indexOf(inputValue) !== -1
          // }
          // filterOption={filterOption}
          listStyle={{
            width: 824,
            height: 640,
          }}
          leftColumns={leftTableColumns}
          rightColumns={rightTableColumns}
          search={inputSearch}
          onSearch={handleSearch}
          handleSearch={handleSearch}
        />
      </Modal>
    </div>
  );
};
