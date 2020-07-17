import React, { useState, useEffect } from 'react';
import { Modal, Transfer, Table, Icon, notification, Popover, Menu, Row, Col, Avatar, Select } from 'antd';
import Input from '../../../components/v2/input';
import Button from '../../../components/v2/button';
// import Table from '../../../components/v2/table';
import Card from '../../../components/v2/card';
import httpClient from '../../../components/axiosClient';
import Provider from '../provider';
import difference from 'lodash/difference';
import styled from 'styled-components';
import './index.css';

const DivDetail = styled.div`
  /* padding: 0px 24px; */
  margin-top: 36px;
  margin-bottom: 24px;
`;

const ApproverAvatar = styled(Avatar)`
  border: 0.5px solid #E8E8E8;
`;

const { Option } = Select;
const { confirm } = Modal;

  const filterOption = (inputValue, items) => {
    if (!inputValue) {
      return items;
    }
    let strRegex = inputValue.replace(/\//g, '');
    strRegex = new RegExp(inputValue, 'g');
    return items.filter(
      (e) => e && e['title'] && strRegex.test(e['title']),
    );
  };

  const TableTransfer = ({ leftColumns, rightColumns, ...restProps }) => {
    return (
      <Transfer className="transfer-approver" {...restProps} showSelectAll={false} >
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
            getCheckboxProps: (item) => ({disabled: listDisabled || item.disabled,}),
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

          return (
            <div>
              <Input className="input-search-approver"
                value={restProps.search[isLeft ? 0 : 1]}
                onChange={(e) => {
                  restProps.handleSearch(direction, e.target.value);
                }}
                placeholder={'Search'}
                prefix={<Icon className="icon-search" type="search" />}
              />
              <Table
                className="transfer-table-approver"
                rowSelection={rowSelection}
                columns={columns}
                // dataSource={filteredItems}
                dataSource={defalutData}
                pagination={false}
                size="small"
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
  }

  const leftTableColumns = [
    {
      dataIndex: 'title',
      title: 'Approver Name',
    },
    {
      dataIndex: 'email',
      title: 'Email'
    },
  ];

  const rightTableColumns = [
    {
      dataIndex: 'title',
      title: 'Approver Name',
    },
    {
      dataIndex: 'email',
      title: 'Email'
    },
  ];

export default (props) => {
  const app = Provider.useAppContext();
  const optionsRequestType = [...app.state.requestType];
  const updateBy = 1;
  const { dataSource, dataUsers, orgId } = props;
  const [visible, setVisible] = useState(false);
  const [users, setUsers] = useState([]);
  const [approverKeys, setApproverKeys] = useState([]);
  const [requestTypeVisible, setRequestTypeVisible] = useState(false);
  const [approverPathImage, setApproverPathImage] = useState('');
  const [approverName, setApproverName] = useState('');
  const [approverEmail, setApproverEmail] = useState('');
  const [approverMobile, setApproverMobile] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedItemsID, setSelectedItemID] = useState([]);
  const [approverID, setApproverID] = useState('');

  const [selected, setSelected] = useState([]);
  const [inputSearch, setInputSearch] = useState(['', '']);

  useEffect(() => {
    if(dataUsers) {
      const newUsers = [];
      dataUsers.forEach((element) => {
        let setData = {
          key: element.mem_com_id,
          title: element.fullname,
          email: element.email
        };
        newUsers.push(setData);
      });
      setUsers(newUsers);
    }
    getRefreshKey();
  }, [dataUsers, dataSource]);

  const getRefreshKey = () => {
    if(dataSource) {
      const newApprover = [];
      dataSource.forEach((element) => { 
        newApprover.push(element.mem_com_id);
      });
      setApproverKeys(newApprover);
    }
  };

  const handlerClickModal = () => {
    setVisible(true);
  };

  const successNotification = (message) => {
    notification.success({
      icon: <Icon type="check-circle" style={{ color: '#fe6202' }} />,
      message: message,
    });
  };

  const deletedNotification = (message) => {
    notification.success({
      icon: <Icon type="check-circle" style={{ color: '#fe6202' }} />,
      message: message,
    });
  };

  const handleOk = async () => {
    const approversCreate = [];
    approverKeys.forEach((element) => {
      approversCreate.push({ mem_com_id: `${element}` });
    });

    // console.log('approverKeys::: ', approverKeys);

    const body = {
      org_id: `${orgId}`,
      created_by : "1",
      mem_com_id : approverKeys
    }

    try {
      const response = await httpClient.post('/v2/organization/approvers/create', body);
      if (response.status === 200) {
        setTimeout(() => {
          app.fnc.getRefresh();
        }, 2000);
        // console.log('response::+++ ', response);
        successNotification(response.data.message);
      }
    }
    catch (error) {
      console.log(error);
    }
    setVisible(false);
    setSelected([]);
  };

  const handleCancel = () => {
    setVisible(false);
    setSelected([]);
    setInputSearch(['', '']);
    getRefreshKey();
  };

  const handleSearch = (dir, value) => {
    console.log('search:', dir, value);
    let option = [...inputSearch];
    if (dir === 'left') {
      option[0] = value;
    } else {
      option[1] = value;
    }
    setInputSearch(option);
  };

  const selectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    // console.log('SelectedKeys****++ ', sourceSelectedKeys, targetSelectedKeys);
    setSelected([...sourceSelectedKeys, ...targetSelectedKeys]);
  };

  const handlerChangeSelect = (nextTargetKeys) => {
    setApproverKeys(nextTargetKeys);
  };

  const handlerDelete = (memComId) => {
    confirm({
      title: 'Do you want to delete these approver?',
      content: 'When clicked the OK button, this dialog will be closed after 1 second',
      async onOk() {
        try {
          const response = await httpClient.delete(`/v2/organization/approvers/${updateBy}/${memComId}`);
          if(response.status === 200) {
            deletedNotification(response.data.message);
            setTimeout(() => {
              app.fnc.getRefresh();
            }, 500);
          }
        }
        catch (error){
          console.log(error);
        }
      },
      onCancel() {},
    });
  };

  const handleAssignRequestType = (id, pathImage, name, email, phone, types) => {
    const newRequestTypeID = [];
    if(types.length > 0) {
      types.forEach((element) => {
        newRequestTypeID.push(element.req_type_name);
      });
    }

    setApproverID(id ? id : '');
    setApproverPathImage(pathImage ? `http://${pathImage}` : '');
    setApproverName(name ? name : '-');
    setApproverEmail(email ? email : '-');
    setApproverMobile(phone ? phone : '-');
    setSelectedItems([...newRequestTypeID]);
    setRequestTypeVisible(true);
  };

  const handleRequestTypeOk = async () => {
    try {
      const body = {
        updateBy: updateBy,
        requestId: selectedItemsID
      };
      const response = await httpClient.put(`/approvers/${approverID}/request-types`, body);
      if(response.status === 200) {
        deletedNotification(response.data.data);
        setTimeout(() => {
          app.fnc.getRefresh();
        }, 1000);
      }
    }
    catch (error) {
      console.log(error);
    }

    setSelectedItems([]);
    setRequestTypeVisible(false);
  };

  const handleRequestTypeCancel = () => {
    setRequestTypeVisible(false);
  };

  const ContentPopover = (props) => {
    return (
      // <Menu style={{ width: 100 }} align='center'>
      //   <Menu.Item onClick={() => handleAssignRequestType(props.memComId, props.pathImage, props.name, props.email, props.phone, props.requestType)}>
      //     Assign
      //   </Menu.Item>
      //   <Menu.Item onClick={() => handlerDelete(props.memComId)}>
      //     Delete
      //   </Menu.Item>
      // </Menu>
      <div>
        <Button 
          className="approver-Pop-Delete" 
          btnSize={"wd_df"}
          type="link" ghost 
          onClick={() => handleAssignRequestType(props.memComId, props.pathImage, props.name, props.email, props.phone, props.requestType)}
        >
          <p className="approver-delete-p">Assign</p>
        </Button>
        <br />
        <Button className="approver-Pop-Delete"
          btnSize={"wd_df"} 
          type="link" ghost 
          onClick={() => handlerDelete(props.memComId)}>
          <p className="approver-delete-p">Delete</p> 
        </Button>
    </div> 
    )
  };

  const columns = [
    {
      title: '#',
      select: 'Index',
      align: 'center',
      width: 70,
      key: 'index',
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Approver Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Phone Number',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Request Type',
      dataIndex: 'description',
      key: 'description',
      render: (text, record, index) => {
        var requestTypeText = '';
        if(record.request_type.length > 0) {
          record.request_type.forEach((element) => {
            if(requestTypeText === '') {
              requestTypeText += `${element.req_type_name}`;
            }
            else {
              requestTypeText += `, ${element.req_type_name}`;
            }
          });
        }
        else {
          requestTypeText = '-';
        }

        return requestTypeText;
      }
    },
    {
      title: '',
      key: 'options',
      dataIndex: 'options',
      align: 'center',
      width: '5%',
      render: (text, record, index) => (
        <Popover placement="leftTop" 
        trigger='click'
          content={<ContentPopover memComId={record.org_app_id} 
            pathImage={record.profile_img} 
            name={record.name} 
            email={record.email} 
            phone={record.phone} 
            requestType={record.request_type} />} 
        >
          <Icon type="more" />
        </Popover>)
    },
  ];
 
  const handleChangeRequestType = (value, option) => {
    const requestsID = [];
    value.forEach((name) => {
      const found = optionsRequestType.find((element) => element.name === name ? name : false);
      if(found) {
        requestsID.push(found.req_id);
      }
    });
    setSelectedItems([...value]);
    setSelectedItemID([...requestsID]);
  }

  const filteredOptions = optionsRequestType.filter(o => {
    // return !selectedItems.includes(o.name);
    return o;
  });

  return (
    <div className="approver-card">
      <DivDetail>
        <Row gutter={[16, 16]} align='middle'>
          <Col className="gutter-row" span={20}>
            <h3>Approver</h3>
          </Col>
          <Col className="gutter-row" span={4} style={{ textAlign: 'right' }}>
          <Button
            primary="primary"
            fontSize="md"
            btnSize="wd_df"
            onClick={handlerClickModal}
          >
            Add New
          </Button>
          </Col>
        </Row>
      </DivDetail>

      <Table 
        className="approver-table"
        rowKey="name"
        size={'middle'}
        columns={columns}
        sizeWidth='lg' 
        dataSource={dataSource}
        pagination={false}
      />
      <Modal
        title="Approver"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={824}
        footer={[
          <Button key="back" btnSize="wd_df" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" btnSize="wd_df" primary="primary" onClick={handleOk}>
            Save
          </Button>,
        ]}
      >
        {/* <Transfer
          className='tree-transfer'
          dataSource={users}
          // showSearch
          // filterOption={this.filterOption}
          targetKeys={approverKeys}
          // onChange={handleChange}
          // onSearch={handleSearch}
          render={item => item.title}
        /> */}
        <TableTransfer
          titles={['User', 'Approver']}
          dataSource={users}
          targetKeys={approverKeys}
          // disabled={disabled}
          // showSearch={showSearch}
          // filterOption={(inputValue, item) =>
          //   item.title.indexOf(inputValue) !== -1 || item.email.indexOf(inputValue) !== -1
          // }
          
          leftColumns={leftTableColumns}
          rightColumns={rightTableColumns}
          // locale={{
          //   // itemUnit: 'item', 
          //   // itemsUnit: 'items', 
          //   // notFoundContent: 'The list is empty', 
          //   searchPlaceholder: 'Search',
          // }}
          listStyle={{
            width: 824,
            height: 640,
          }}
          onChange={handlerChangeSelect}
          onSelectChange={selectChange}
          selectedKeys={selected}

          filterOption={filterOption}
          search={inputSearch}
          onSearch={handleSearch}
          handleSearch={handleSearch}
        />
      </Modal>

      <Modal
        title="Request Type"
        visible={requestTypeVisible}
        onOk={handleRequestTypeOk}
        onCancel={handleRequestTypeCancel}
        // width={1200}
      >
        <Row gutter={[8, 8]} align='middle'>
          <Col span={10} align='center'>
            {approverPathImage ? <ApproverAvatar size={128} src={approverPathImage} /> : <ApproverAvatar size={128} icon="user" />}
          </Col>
          <Col span={14}>
            <p>{approverName}</p>
            <p>{approverEmail}</p>
            <p>{approverMobile}</p>
          </Col>
        </Row>
        <Row gutter={[8, 48]} align='middle'>
          <Col span={24} align='center'>
            <Select
              mode="multiple"
              placeholder="Select Request Type"
              value={selectedItems}
              onChange={handleChangeRequestType}
              style={{ width: '100%' }}
              showArrow={true}
            >
              {filteredOptions.map(item => (
                <Select.Option key={item.req_id} value={item.name}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </Col>
        </Row>
      </Modal>
    </div>
  );
}