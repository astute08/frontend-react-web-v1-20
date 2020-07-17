import React, { useState, useEffect } from 'react';
import {
  Card,
  Button,
  Modal,
  Slider,
  Select,
  Col,
  Icon,
  Row,
  Typography,
  TreeSelect,
} from 'antd';

import AppText from '../../../components/text';
import Api from '../../../components/httpClient';
import { notificationWithIcon } from '../../../components/notification';
import './css/cssCard.css';

const { Title, Text } = Typography;
const { confirm } = Modal;
const { Option } = Select;
let client = Api();

export default (props) => {
  const createBy = props.createdBy;

  const userId = props.userId;
  const [dataSource, setToDatasource] = useState([]);
  const [dataSourceId, setToDatasourceId] = useState([]);
  const [stateModal, setStateModal] = useState(false);
  const [slider, setSlider] = useState(0);
  const [defaultSlider, setDefaultSlider] = useState(0);
  const [select, setSelect] = useState();
  const [treeData, setTreeData] = useState([]);
  //รับค่าภาษามาแสดง
  const labelShow = props.labelShow;

  console.log("SkillProps", props.labelShow);

  // รับค่า userId มาจากหน้า Login
  // console.log('dataSourceId', dataSourceId);

  useEffect(() => {
    checkApi();
    setSelect();
    setSlider(0);
  }, [stateModal]);

  const checkApi = async () => {
    const fectId = await client.get(`/v2/skillmembers/${userId}`);
    if (fectId.data.length > 0) {
      getId();
    }
  };
  const showModal = async () => {
    const res = await client.get(`/v2/skills/${userId}`);

    const looptree = (value) => {
      let arr = [];
      let len = value.length;
      for (let i = 0; i < len; i++) {
        let ojb = {
          key: value[i].skill_gro_id,
          title: value[i].skill_gro_name,
          disabled: true,
          children: [],
        };

        let len2 = value[i].skills.length;
        if (len2) {
          for (let index = 0; index < len2; index++) {
            let ojb2 = {
              key:
                value[i].skill_gro_id + '-' + value[i].skills[index].skill_id,
              title: value[i].skills[index].name,
              value: value[i].skills[index].skill_id,
              children: [],
            };

            ojb.children.push(ojb2);
          }
        }
        arr.push(ojb);
      }
      setTreeData(arr);
    };
    looptree(res.data);
    setToDatasource(res.data);
    setStateModal(!stateModal);
  };

  const handleCancel = (e) => {
    setStateModal();
    setToDatasource([]);
  };

  const addDataList = () => {
    setToDatasource([]);
    setStateModal(false);

    let data = {
      user_id: userId,
      skill_id: select,
      skill_level: slider,
      created_by: createBy,
    };
    create(data);
  };

  const create = async (data = {}) => {
    let postApi = '/v2/create/skillmember';
    client
      .post(postApi, data)
      .then((respone) => {
        console.log('create : ', respone.data.data);
        if (respone.status === 200 && respone.data.reject != 'duplicated') {
          const createdMessage = respone.data.data ? respone.data.data : '"update successfully"';
          notificationWithIcon('success', createdMessage);
        } else if (respone.data.reject === 'duplicated') {
          notificationWithIcon('warning', 'Duplicated.');
        }
      })
      .catch((error) => {
        notificationWithIcon('error', 'Create fail.');
      });

    getId();
  };

  const update = async (data = {}) => {
    let postApi = '/v2/create/skillmember';
    await client
      .post(postApi, data)
      .then((respone) => {
        if (respone.status === 200 && respone.data.reject != 'duplicated') {
          notificationWithIcon('success', respone.data.data ? respone.data.data : 'update successfully');
        }
      })
      .catch((error) => {
        notificationWithIcon('error', 'Update fail.');
      });

    getId();
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
    await client
      .delete(`/v2/skillmember/${createBy}/${id}`)
      .then((respone) => {
        if (respone.status === 200) {
          const deletedMessage = respone.data.data ? respone.data.data : 'delete successfully';
          notificationWithIcon('success', deletedMessage);
        }
      })
      .catch((error) => {
        notificationWithIcon('error', 'Delete fail.');
      });
    getId();
  };
  const getId = async () => {
    const fectId = await client.get(`/v2/skillmembers/${userId}`);

    setToDatasourceId(fectId.data);
  };

  const handleChangeSlider = (value) => {
    setSlider(value);
  };

  const handleChangeOption = (value) => {
    setSelect(value);
  };

  const formatter = (value) => {
    return `${value}%`;
  };

  const updateValue = (value, id) => {
    const newDataSourceId = [...dataSourceId];
    const found = newDataSourceId.findIndex(
      (element) => element.skill_mem_id === id,
    );
    if (found >= 0) {
      newDataSourceId[found].skill_level = value;
      setToDatasourceId(newDataSourceId);
    }
  };

  const updateValueAfter = (value, id) => {
    let data = {
      user_id: userId,
      skill_id: id,
      skill_level: value,
      created_by: createBy,
    };
    update(data);
  };

  const show = dataSourceId.length ? (
    dataSourceId.map((item, index) => (
      <div>
        <Row>
          <Col span={16} offset={1} style={{ marginTop: 5 }}>
            {item.name}
          </Col>
          <Col span={2} offset={4}>
            {item.skill_level}%
          </Col>
          <Icon
            type="more"
            style={{ float: 'right', marginTop: '5px' }}
            onClick={(e) => confirmDelete(item.skill_mem_id, index)}
          />
        </Row>
        <Slider
          tipFormatter={formatter}
          value={item.skill_level}
          style={{ paddingTop: '3px', marginLeft: '19px' }}
          onAfterChange={(value) => updateValueAfter(value, item.skill_id)}
          onChange={(value) => updateValue(value, item.skill_mem_id)}
        />
      </div>
    ))
  ) : (
      <Text type={'secondary'} style={{ paddingLeft: '15px' }}>
        {labelShow.tPleaseselectskill ? labelShow.tPleaseselectskill : "Please assign to skill"}
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
              {labelShow.tSkill ? labelShow.tSkill : "Skill"}
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
          <Title style={{ fontSize: '15px', fontWeight: 400 }}>{labelShow.tSkill ? labelShow.tSkill : "Skill"}</Title>
        }
        visible={stateModal}
        onOk={addDataList}
        onCancel={handleCancel}
        okText={labelShow.saveBig ? labelShow.saveBig : "Save"}
        cancelText={labelShow.cancel_button ? labelShow.cancel_button : "Cancel"}
        className='button-modal'
      >
        <TreeSelect
          style={{ width: '100%' }}
          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
          placeholder={labelShow.dPleaseselect ? labelShow.dPleaseselect : "Please select"}
          allowClear
          treeDefaultExpandAll
          treeData={treeData}
          onChange={handleChangeOption}
          value={select}
        ></TreeSelect>

        <Row>
          <Col offset={22} style={{ marginTop: '15px' }}>
            <div style={{ color: '#fe6202', fontWeight: 650 }}> {slider}%</div>
          </Col>
          <Slider
            onChange={handleChangeSlider}
            value={slider}
            style={{ marginTop: '5px' }}
          />
        </Row>
      </Modal>
    </Card>
  );
};
