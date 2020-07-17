import React, { useState, useEffect } from 'react';
import {
  Card,
  Button,
  Modal,
  Select,
  Typography,
  Icon,
  Row,
  Col,
  TreeSelect,
} from 'antd';
import Api from '../../../components/httpClient';
import { notificationWithIcon } from '../../../components/notification';
import './css/cssCard.css';

const { Title, Text } = Typography;
const { confirm } = Modal;

let client = Api();

export default (props) => {
  const createBy = props.createdBy;
  const userId = props.userId;
  const [dataSourceId, setToDatasourceId] = useState([]);
  const [stateModal, setStateModal] = useState(false);
  const [select, setSelect] = useState([]);
  const [defaultArr, setDefaultArr] = useState();
  const labelShow = props.labelShow;

  console.log("TeamLang", props.labelShow);


  useEffect(() => {
    checkApi();
  }, []);

  const checkApi = async () => {
    const fectId = await client.get(`/v2/teams/${createBy}`);

    if (fectId.data.length > 0) {
      getId();
    }
  };

  const showModal = async () => {
    let arrSelect = [];

    const res = await client.get(`/v2/organizations/${createBy}`);

    setDefaultArr(res.data);

    const fectTag = await client.get(`/v2/teams/${createBy}`);

    for (let index = 0; index < fectTag.data.length; index++) {
      arrSelect.push(fectTag.data[index].org_id);
    }
    setSelect(arrSelect);

    // setToDatasource(res.data);
    setStateModal(!stateModal);
  };

  const handleCancel = (e) => {
    setStateModal(false);
  };

  const addDataList = () => {
    setStateModal(false);

    let data = {
      user_id: userId,
      org_id: select,
      created_by: createBy,
    };

    create(data);
  };

  const create = async (data = {}) => {
    let postApi = '/v2/create/team';
    await client
      .post(postApi, data)
      .then((response) => {
        console.log();
        if (response.status === 200 && response.data.reject != 'duplicated') {
          notificationWithIcon('success', response.data.data ? response.data.data : "update successfully");
        } else if (response.data.reject === 'duplicated') {
          notificationWithIcon('warning', 'Duplicated.');
        }
      })
      .catch((error) => {
        notificationWithIcon('error', 'Create fail.');
      });
    getId();
  };

  const getId = async () => {
    const fectId = await client.get(`/v2/teams/${createBy}`);
    setToDatasourceId(fectId.data);
  };

  const handleChangeOption = (value) => {
    setSelect(value);
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
    todoNew.splice(index, 1);
    setToDatasourceId(todoNew);
    const del = await client
      .delete(`/v2/team/${userId}/${id}`)
      .then((response) => {
        if (response.status === 200) {
          const deleteMessage = response.data.data ? response.data.data : "delete successfully";
          notificationWithIcon('success', deleteMessage);
        }
      })
      .catch((error) => {
        notificationWithIcon('error', 'Delete fail.');
      });
    getId();
  };

  const onClickDeleteTags = (tagsId) => {
    let index = defaultArr.indexOf(tagsId);
    let newDefaultArr = [...defaultArr];
    newDefaultArr.splice(index, 1);
    //  setDefaultArr(newDefaultArr);
  };

  const handlerOptions = (e) => {
    setSelect(e.key);
    let newSelect = [...defaultArr, parseInt(e.key)];
    setDefaultArr(newSelect);
  };
  let show = dataSourceId.length ? (
    dataSourceId.map((item, index) => (
      <div>
        <Row>
          <Col offset={1} style={{ marginTop: 5 }}>
            {item.name}
            <Icon
              type="more"
              style={{ float: 'right' }}
              onClick={(e) => confirmDelete(item.mem_org_id, index)}
            />
          </Col>
        </Row>
      </div>
    ))
  ) : (
    <Text type={'secondary'} style={{ paddingLeft: '15px' }}>
      {labelShow.plaseAssignTeam ? labelShow.plaseAssignTeam : 'Please assign to team'}
    </Text>
  );

  return (
    <Card
      title={
        <Row>
          <Col offset={1}>        
            <Title
              style={{ marginTop: '5px', fontSize: '15px', fontWeight: 400 }}
            >
              {labelShow.tTeam ? labelShow.tTeam : 'Team'}
            </Title>
          </Col>
        </Row>
      }
      size="small"
      extra={
        <Button className="button-card" onClick={showModal}>
          {labelShow.btnAssign ? labelShow.btnAssign : 'Assign'}
        </Button>
      }
      style={{ width: '100%' }}
    >
      {show}
      <Modal
        title={
          <Title style={{ fontSize: '15px', fontWeight: 400 }}>
            {labelShow.tTeam ? labelShow.tTeam : 'Team'}
          </Title>
        }
        visible={stateModal}
        onOk={addDataList}
        onCancel={handleCancel}
        okText= {labelShow.saveBig ? labelShow.saveBig: "Save"}
        cancelText = {labelShow.cancel_button ? labelShow.cancel_button : "Cancel"}
        // title={'Team'}
        className = 'button-modal'
      >
        <TreeSelect
          showSearch
          style={{ width: '100%' }}
          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
          placeholder= {labelShow.dPleaseselect ? labelShow.dPleaseselect : "Please select"}
          allowClear
          multiple
          treeDefaultExpandAll
          treeData={defaultArr}
          onChange={handleChangeOption}
          //onChange={handlerOptions}
          value={select}
          //onClick={handlerOptions}
          onDeselect={(tags, options) => onClickDeleteTags(tags)}
        ></TreeSelect>
      </Modal>
    </Card>
  );
};
