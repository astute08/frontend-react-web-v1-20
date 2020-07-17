import React, { useState, useEffect, useCallback } from 'react';
import './css/addArea.css';
import { Modal, Form, Select, Input, notification, Icon } from 'antd';
import MapComponent from './map/index';
import HttpClient from "../../../components/httpClient";
import Button from '../../../components/v2/button';
import styled from 'styled-components';

const client = HttpClient();
const { Option } = Select;


const CollectionCreateForm = Form.create({ name: 'form_in_modal' })(
  // eslint-disable-next-line
  class extends React.Component {
    render() {
      const { areaList, taskTypes, selectAreaList, visible, onChange, onCancel, onCreate, onSearch, onBlur, onFocus, form } = this.props;
      const { getFieldDecorator } = form;


    const LabeRequire = (props) => {
      const { text, req } = props;
      return (
          <span>
              {text}&nbsp;
              {req ? <LabelRequire>*</LabelRequire> : ''}
          </span>
      );
    };

    const LabelRequire = styled.label`
      color: #FF0000;
    `;

      return (
        <Modal
        title="Add Services"
        visible={visible}
        onOk={onCreate}
        onCancel={onCancel}
        width={790}
        footer={[
          <Button key="back" btnSize={"wd_df"} onClick={onCancel}>
            Cancel
          </Button>,
          <Button key="submit" btnSize={"wd_df"} type="primary" onClick={onCreate}>
            Add
          </Button>,
        ]}
      >
        <Form layout="vertical">
          <Form.Item className="label-from" label={<LabeRequire text="Area name or CODE" req={true} />}> 
            {getFieldDecorator('area', {
              rules: [{ required: true, message: 'Please select your area!' }],
            })(
              <Select 
                showSearch
                placeholder="Please select area..." 
                onSearch={onSearch}
                onChange={onChange}
                onBlur={onBlur}
                onFocus={onFocus}
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {areaList.map((item, i) => (
                  <Option key={i} value={item.areaCode}>
                    {item.areaName}
                  </Option>
                ))}
              </Select>,
            )}
          </Form.Item>
  
          <Form.Item>
            <MapComponent areaList={selectAreaList} />
          </Form.Item>
  
          <Form.Item className="label-from" label={<LabeRequire text="Task type or task category" req={true} />}>
            {getFieldDecorator('category', {
              rules: [{ required: true, message: 'Please select your category!' }],
            })(
              <Select placeholder="Please select task type or task category" mode="multiple">
                {/* <Option value="china">China</Option>
                <Option value="usa">U.S.A</Option> */}
                {taskTypes.map((item, i) => (
                  <Option key={i} value={item.taskTypeCode}>
                    {item.taskTypeName}
                  </Option>
                ))}
              </Select>,
            )}
          </Form.Item>
  
          <Form.Item className="label-from" label={<LabeRequire text="BUFFER (Hrs)" req={true} />}>
            {getFieldDecorator('buffer', {
              rules: [{ required: true, message: 'Please select your buffer!' }],
            })(<Input placeholder="Input Hour" />)}
          </Form.Item>
        </Form>
      </Modal>
      );
    }
  },
);


export default ({areaList, taskTypes, comId, orgId, refreshDataServices}) => {
  // console.log('areaList props::: ', areaList);
  // console.log('taskTypes props::: ', taskTypes);

  const [visible, setVisible] = useState(false);
  const [formRef, setFormRef] = useState(null);
  const [selectAreaList, setSelectAreaList] = useState([]);

  useEffect(() => {

  }, []);

  const onChange = async (value) => {
    // console.log('selected value:::++ ', value);
    try {


      const url = `${process.env.REACT_APP_URL_MANAGER}`;
      const port = `${process.env.REACT_APP_RESOURCE_MANAGER_PORT}`;
      client.defaults.baseURL = `${url}:${port}`;
      const result = await client.get(`/companies/master-areas/${value}`);
      // console.log('selected result:::++ ', result.data);
      // if (value) {
      //   result.data.forEach((element, index, array) => {
      //     setSelectAreaList(element.coordinates);
      //   })
      // }

      if (value) {
        result.data.filter((element) => {
          if (element.areaCode === value) {
            // console.log('xxxxxxx:: ' , element.coordinates);
            setSelectAreaList(element.coordinates);
          }
        })
      } else (console.error());


    } catch {
      console.error();
    }
  }

  const handleCreate = async () => {
    formRef.validateFields( async (err, values) => {
      if (err) {
        return;
      }
      console.log('Received values of form: ', values);
      const data = {
        "comCode": parseInt(comId),
        "orgCode": parseInt(orgId),
        "buffer": parseInt(values.buffer),
        "areaCode": values.area,
        "taskTypeId": values.category
      }

      try {
        const url = `${process.env.REACT_APP_URL_MANAGER}`;
        const port = `${process.env.REACT_APP_RESOURCE_MANAGER_PORT}`;
        client.defaults.baseURL = `${url}:${port}`;
        const result = await client.post('/organization/services/', data);
        if (result.status === 200) {
          createAreaNotification(result.data);
          refreshDataServices();
        }
      } catch {
        console.error();
      }
      formRef.resetFields();
      setVisible(false);
    });
  };

  const createAreaNotification = (message) => {
    notification.success({
      icon: <Icon type="check-circle" style={{ color: '#fe6202' }} />,
      message: message,
    });
  };

  const saveFormRef = useCallback((node) => {
    if (node !== null) {
      setFormRef(node);
    }
  }, []);

  const showModal = () => {
    setVisible(true);
  };

  const handleCancel = e => {
    formRef.validateFields(async (err, values) => {
      if (err) {
        return;
      }
      formRef.resetFields();
      setSelectAreaList([]);
    })
    formRef.resetFields();
    setSelectAreaList([]);
    setVisible(false);
  };

  const onSearch = (val) => {
    console.log('search:', val);
  }

  const onBlur = () => {
    // console.log('blur');
  }

  const onFocus = () => {
    // console.log('focus');
  }

  return (
    <div>
      <Button type="primary" fontSize="md" btnSize="wd_lg" onClick={showModal}>
        Add Services
      </Button>

      <CollectionCreateForm
        areaList={areaList}
        taskTypes={taskTypes}
        selectAreaList={selectAreaList}
        onChange={(value) => onChange(value)}
        ref={saveFormRef}
        visible={visible}
        onCancel={() => handleCancel()}
        onCreate={() => handleCreate()}
        onSearch={() => onSearch()}
        onBlur={() => onBlur()}
        onFocus={() => onFocus()}
      />
    </div>
  )
}
