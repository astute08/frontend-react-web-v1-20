import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, Select, Typography, Icon, Col, Row } from 'antd';
import Api from '../../../components/httpClient';
import { notificationWithIcon } from '../../../components/notification';
import './css/cssCard.css';

const { Title, Text } = Typography;
const { confirm } = Modal;
const { Option } = Select;
let client = Api();

export default (props) => {
  const [dataSource, setToDatasource] = useState([]);
  const [dataSourceId, setToDatasourceId] = useState([]);
  const [stateModal, setStateModal] = useState(false);
  const [select, setSelect] = useState([]);
  const [defaultArr, setDefaultArr] = useState([]);
  const createBy = props.createdBy;
  const userId = props.userId;
  // รับค่าภาษามาแสดง
  const labelShow = props.labelShow;

  useEffect(() => {
    checkApi();
  }, []);


  const checkApi = async () => {
    const fectId = await client.get(`/v2/roles/${userId}`);

    if (fectId.data.length > 0) {
      getId();
    }
  };

  const showModal = async () => {
    let arr = [];
    const res = await client.get(`/v2/permissiongroups/${userId}`);

    const fectTag = await client.get(`/v2/roles/${userId}`);

    for (let i = 0; i < fectTag.data.length; i++) {
      arr.push(fectTag.data[i].name);
    }

    // console.log('showModal : ', arr);

    setSelect(arr);
    setDefaultArr(arr);
    setToDatasource(res.data);
    setStateModal(!stateModal);
  };
  const handleCancel = (e) => {
    setStateModal(false);
  };
  const addDataList = () => {
    setStateModal(false);

    let data = {
      user_id: userId,
      created_by: createBy,
      per_gro_id: select,
    };

    create(data);
  };

  const create = async (data = {}) => {
    let postApi = '/v2/create/role';
    await client
      .post(postApi, data)
      .then((respone) => {
        if (respone.status === 200) {
          notificationWithIcon('success', 'Create success.');
        } else if (respone.data.success == 'deleted all.') {
          notificationWithIcon('success', 'Deleted all success.');
        } else if (respone.data.reject) {
          notificationWithIcon('warning', 'Duplicated.');
        }
      })
      .catch((error) => {
        notificationWithIcon('error', 'Create fail.');
      });
    getId();
  };

  const getId = async () => {
    const fectId = await client.get(`/v2/roles/${userId}`);
    // console.log('getId : ', fectId);
    setToDatasourceId(fectId.data);
  };
  const handleChangeOption = (value, options) => {
    const dataCreate = [];
    options.forEach((element) => {
      dataCreate.push(element.key);
    });
    setSelect(dataCreate);
    setDefaultArr(value);
  };

  const confirmDelete = async (id, index) => {
    confirm({
      title: <div>{labelShow.delete_text ? labelShow.delete_text : "Are you sure delete ?"}</div>,
      okText: labelShow.btnYes ? labelShow.btnYes : "Yes",
      cancelText: labelShow.btnNo ? labelShow.btnNo : "No",
      okType: 'danger',
   
      onOk() {
        Delete(id, index);
      },
    });
  };

  const Delete = async (id, index) => {
    let todoNew = [...dataSourceId];
    // console.log("todoNew",todoNew);
    todoNew.splice(index, 1);
    setToDatasourceId(todoNew);
    await client
      .delete(`/v2/role/${createBy}/${id}`)
      .then((respone) => {
        if (respone.status === 200) {
          notificationWithIcon('success', 'Delete sussces.');
        }
      })
      .catch((error) => {
        notificationWithIcon('error', 'Delete fail.');
      });
  };

  let show = dataSourceId.length ? (
    dataSourceId.map((item, index) => (
      <div>
        <Row gutter={8}>
          <Col offset={1} style={{ marginTop: 5 }}>
            {item.name}
            <Icon
              type="more"
              style={{ float: 'right' }}
              onClick={(e) => confirmDelete(item.mem_per_gro_id, index)}
            />
          </Col>
        </Row>
      </div>
    ))
  ) : (
    <Text type={'secondary'} style={{ paddingLeft: '15px' }}>
      {labelShow.tPleaseselectrole
        ? labelShow.tPleaseselectrole
        : 'Please assign to role'}
    </Text>
  );

  const handlerOptions = (e) => {
    let newSelect = [...defaultArr, parseInt(e.key)];
    setDefaultArr(newSelect);
  };

  let option = dataSource.map((item, index) => (
    <Option
      key={item.per_gro_id}
      value={item.name}
      placeholder="Please Select"
      // onClick={handlerOptions}
    >
      {item.name}
    </Option>
  ));

  const onClickDeleteTags = (tagsId) => {
    let index = defaultArr.indexOf(tagsId);
    let newDefaultArr = [...defaultArr];
    newDefaultArr.splice(index, 1);
    setDefaultArr(newDefaultArr);
  };

  return (
    <Card
      title={
        <Row>
          <Col offset={1}>
            <Title
              style={{ marginTop: '5px', fontSize: '15px', fontWeight: 400 }}
            >
              {labelShow.roleTitle ? labelShow.roleTitle : 'Role'}
            </Title>
          </Col>
        </Row>
      }
      size="small"
      extra={
        <Button onClick={showModal} className="button-card">
          {labelShow.btnAssign ? labelShow.btnAssign : 'Assign'}
        </Button>
      }
      style={{ width: '100%' }}
    >
      {show}
      <Modal
        visible={stateModal}
        onOk={addDataList}
        onCancel={handleCancel}
        okText={labelShow.saveBig ? labelShow.saveBig : "Save"}
        cancelText = {labelShow.cancel_button ? labelShow.cancel_button : "Cancel"}
        className = 'button-modal'
        title={
          <Title style={{ fontSize: '15px', fontWeight: 400 }}>
            {labelShow.roleTitle ? labelShow.roleTitle : 'Role'}
          </Title>
        }
      >
        <Select
          mode="multiple"
          allowClear="true"
          autoClearSearchValue="true"
          placeholder= {labelShow.dPleaseselect ? labelShow.dPleaseselect : "Please Select"}
          onChange={handleChangeOption}
          value={defaultArr}
          style={{ width: '100%' }}
          onDeselect={(tags, options) => onClickDeleteTags(tags)}
        >
          {option}
        </Select>
      </Modal>
    </Card>
  );
};
