import React, { useState, useEffect } from 'react';
import { Card, Tree, Icon, Col, Row, Form, Modal, Transfer, Input } from 'antd';
import Button from '../../../components/v2/button';
// import Input from '../../../components/v2/input';
import MemberTable from './roleTable';
import '../css/role.css';
import styled from 'styled-components'
import { isUndefined, isEmpty, add } from 'lodash';
import { data } from 'jquery';
const LabelRequire = styled.label`
color: #FF1010;
`;



const RoleDetailForm = (props) => {

  const { getFieldDecorator, validateFields } = props.form;
  const addNew = props.addNew;
  const name = props.name ? props.name : "ddd";
  const eventKey = props.objMenu ? props.objMenu.eventKey : "";
  const [newRoleName, setNewRoleName] = useState();
  const [inputValue, setInputValue] = useState();
  const [visible, setVisible] = useState();
  const [targetKeys, setTargetKeys] = useState([]);
  const [dataSource, setDataSource] = useState();
  const [dataTransfer, setDataTransfer] = useState();
  const [moveKeys, setMoveKeys] = useState();
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [saveMember, setSaveMember] = useState(false);
  const targetKeysCheck = targetKeys !== undefined ? targetKeys : null;
  const [roleName, setRoleName] = useState();
  const [cancel, setCancel] = useState();

  console.log("aaaaa", props);
  const leftTableColumns = [
    {
      dataIndex: 'title',
      title: 'Name',
    },
    {
      dataIndex: 'tag',
      title: 'Tag',
    },
    {
      dataIndex: 'description',
      title: 'Description',
    },
  ];
  const rightTableColumns = [
    {
      dataIndex: 'title',
      title: 'Name',
    },
  ];


  const mockData = [];
  for (let i = 0; i < 20; i++) {
    mockData.push({
      key: i.toString(),
      title: `content${i + 1}`,
      description: `description of content${i + 1}`,
      // disabled: i % 3 < 1,
    });
  }

  // const oriTargetKeys = mockData
  //   .filter(item => +item.key % 3 > 1)
  //   .map(item => item.key);


  // console.log("props.onDataTransfer.memberCompany",props.onDataTransfer ? props : "0000");

  console.log("props.onDataTransfer", props.onDataTransfer ? props.onDataTransfer : 0);

  const onDataTransferFunc = async (obj) => {
    let data = await props.onDataTransfer ? props.onDataTransfer.memberCompany.map((item, key) => {
      return {
        key: item.memComId,
        title: `${item.name}`,
        description: `description of content${item + 1}`,
      }
    }) : ""

    setDataTransfer(data);

  }


  const showModal = () => {
    setVisible(true);
    setSaveMember(false);
    props.callFuncShowModal(true);
  };

  const handleOk = e => {
    setVisible(false);
    setSaveMember(true);
    props.callHandleOk(targetKeys);
    setDataSource(targetKeys);
    setSelectedKeys([]);
    // if (targetKeys) {
    //   setTimeout(() => {
    //     window.location.reload();
    //   },
    //     1000
    //   );
    // }
  };


  const handleCancel = e => {
    setVisible(false);
    setSelectedKeys([]);
    setTargetKeys(dataSource);

  };

  const LabeRequire = (props) => {
    const { text, req } = props;
    return (
      <span>
        {text}&nbsp;
        {req ? <LabelRequire>*</LabelRequire> : ''}
      </span>
    );
  };

  const onClickSave = () => {
    setNewRoleName(true);
    props.callOnSaveRoleName(inputValue);
  }

  const filterOption = (inputValue, option) => option.description.indexOf(inputValue) > -1;

  const handleChange = (nextTargetKeys, direction, moveKeys) => {
    setTargetKeys(nextTargetKeys);
    setMoveKeys(moveKeys);
    // console.log("targetSelectedKeys: ", nextTargetKeys);
    console.log("targetSelectedKeys: ", nextTargetKeys);

  };

  const handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);

  }

  const handleSearch = (dir, value) => {
    console.log('search:', dir, value);
  };

  const onRoleNameChange = (e) => {
    console.log("onRoleNameChange", e.target.value);
    const value = roleName ? roleName : e.target.value;
    setInputValue(e.target.value);
  }

  const onDefaultTargetKeys = async (obj) => {
    console.log("kkkkkkk",obj);
    const data = await obj.map((item, index) => {
      return (item);
    }) 
    setTargetKeys(data);
  }


  useEffect(() => {
    const name = props.objMenu ? props.objMenu.children : '';
    const roleTransferObj = props.onDataTransfer ? props.onDataTransfer.memberRole : 0;
    setDataSource(targetKeys);
    setRoleName(name);
    onDefaultTargetKeys(roleTransferObj);
    onDataTransferFunc();
    // dataOnTransferTable();
  }, [props, props.onDataTransfer])


  useEffect(() => {
    const callAddNew = addNew === true ? "" : props.objMenu.children;
    setInputValue();
    setRoleName(callAddNew);
  }, [addNew])

  useEffect(() => {
    setSelectedKeys([]);
    setTargetKeys(targetKeys);
  }, [cancel === true])


  useEffect(() => {
    // alert("Hello");
    setInputValue(roleName);
  }, [props.objMenu.eventKey])

  const onKeyPress = (e) => {
    const specialCharRegex = new RegExp("[a-zA-Z0-9@.' ,-]");
    const pressedKey = String.fromCharCode(!e.charCode ? e.which : e.charCode);
    if (!specialCharRegex.test(pressedKey)) {
      e.preventDefault();

      return false;
    }
  }

  const initial = () => {
    if (inputValue) {
      // alert("onClick true");

      setInputValue();
    } else {
      // alert("onClick true");

      return roleName;
    }
  }




  return (
    <div>
      <Card
        title="Administrator"
        bordered={false}
        extra={
          <Button
            primary="primary"
            fontSize="md"
            className='role-btn'
            onClick={onClickSave}
          >
            Save
          </Button>
        }
      >
        {/* {save === true && dataSource ? dataSource.map((item, key) =>
          <p>{mockData[item].title}</p>
        ) : null} */}
        <Row>
          <Col>
            <Form.Item className='role-name-style' label={<LabeRequire text="Role Name" req={true} />}>
              {getFieldDecorator('roleName', {
                // initialValue: addNew === true ? "" : roleName,
                initialValue: addNew === true ? inputValue : initial(),
                rules: [
                  {
                    required: true,
                    message: 'Please input Role Name'
                  },
                  {
                    max: 30,
                    message: 'Role Name cannot be longer than 30 characters'
                  },
                ],
              })
                (
                  <Input onChange={onRoleNameChange} size='small' className='role-input-style' />

                )
              }

            </Form.Item>

          </Col>

        </Row>

      </Card>

      <Card
        title="Member"
        bordered={false}
        className='member-card-style'
        extra={
          <Button
            primary="primary"
            fontSize="md"
            className='member-btn'
            onClick={showModal}
            disabled={addNew === true ? true : false}
          >
            Add Member
          </Button>
        }
      >
        <Modal
          title="Member"
          visible={visible}
          onOk={handleOk}
          onCancel={handleCancel}
          okText='Save'
          width={824}
        >
          <Transfer
            showSearch
            dataSource={dataTransfer}
            titles={['User', 'Member']}
            targetKeys={targetKeys}
            selectedKeys={selectedKeys}
            onChange={handleChange}
            onSelectChange={handleSelectChange}
            render={item => item.title}
            filterOption={filterOption}
            onSearch={handleSearch}
            leftTableColumns={leftTableColumns}
            rightTableColumns={rightTableColumns}
            className='transfer-style'
          />
        </Modal>

        <MemberTable addNew={addNew} perGroId={props.perGroId} dataSource={dataSource} mockData={mockData} saveMember={saveMember} />
      </Card>

    </div>


  );
}
const Role = Form.create({ name: 'horizontal_login' })(RoleDetailForm);
export default Role;
