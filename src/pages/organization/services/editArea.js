import React, { useState, useEffect, useCallback } from 'react';
import './css/editArea.css';
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
      const { 
        serviecsArea, 
        areaList, 
        taskTypes, 
        selectAreaList, 
        visible, 
        onChange, 
        onCancel, 
        onCreate, onSearch, 
        onBlur, 
        onFocus, 
        form 
      } = this.props;
      const { getFieldDecorator } = form;


      // console.log('serviecsArea**** ', serviecsArea);

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
        title="Edit Services"
        visible={visible}
        onOk={onCreate}
        onCancel={onCancel}
        width={790}
        footer={[
          <Button key="back" btnSize={"wd_df"} onClick={onCancel}>
            Cancel
          </Button>,
          <Button key="submit" btnSize={"wd_df"} type="primary" onClick={onCreate}>
            Edit
          </Button>,
        ]}
      >
        <Form layout="vertical">
          <Form.Item className="label-edit-from" label={<LabeRequire text="Area name or CODE" req={true} />}> 
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
                  {/* <Option value="jack">Jack</Option>
                  <Option value="lucy">Lucy</Option>
                  <Option value="tom">Tom</Option> */}
              </Select>,
            )}
          </Form.Item>
  
          <Form.Item>
            {/* <MapComponent areaList={selectAreaList} /> */}
          </Form.Item>
  
          <Form.Item className="label-edit-from" label={<LabeRequire text="Task type or task category" req={true} />}>
            {getFieldDecorator('category', {
              rules: [{ required: true, message: 'Please select your category!' }],
            })(
              <Select placeholder="Please select task type or task category" mode="multiple">
                {taskTypes.map((item, i) => (
                  <Option key={i} value={item.taskTypeCode}>
                    {item.taskTypeName}
                  </Option>
                ))}
                {/* <Option value="jack">Jack</Option>
                <Option value="lucy">Lucy</Option>
                <Option value="tom">Tom</Option> */}
              </Select>,
            )}
          </Form.Item>
  
          <Form.Item className="label-edit-from" label={<LabeRequire text="BUFFER (Hrs)" req={true} />}>
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


export default ({ serviecsArea, areaList, taskTypes, comId, orgId }) => {
  console.log('serviecsArea:::*** ', serviecsArea);
  console.log('areaList:::*** ', areaList);
  console.log('taskTypes:::*** ', taskTypes);

  const [visible, setVisible] = useState(false);
  const [formRef, setFormRef] = useState(null);
  const [selectAreaList, setSelectAreaList] = useState([]);

  useEffect(() => {

  }, []);

  const onChange = async (value) => {
    console.log('selected value:::++ ', value);

    try {
      const url = `${process.env.REACT_APP_URL_MANAGER}`;
      const port = `${process.env.REACT_APP_RESOURCE_MANAGER_PORT}`;
      client.defaults.baseURL = `${url}:${port}`;
      const result = await client.get(`/companies/master-areas/${value}`);
      console.log('selected result:::++ ', result.data);
      // if (value) {
      //   result.data.forEach((element, index, array) => {
      //     setSelectAreaList(element.coordinates);
      //   })
      // }

      if (value) {
        result.data.filter((element) => {
          if (element.areaCode === value) {
            console.log('xxxxxxx:: ' , element.coordinates);
            setSelectAreaList(element.coordinates);
          }
        })
      } else (console.error());
    } catch {
      console.error();
    }
  }

  const handleCreate = async () => {
    // formRef.validateFields( async (err, values) => {
    //   if (err) {
    //     return;
    //   }
    //   console.log('Received values of form: ', values);
    //   const data = {
    //     "comCode": parseInt(comId),
    //     "orgCode": parseInt(orgId),
    //     "buffer": parseInt(values.buffer),
    //     "areaCode": values.area,
    //     "taskTypeId": values.category
    //   }

    //   try {
    //     const url = `${process.env.REACT_APP_URL_MANAGER}`;
    //     const port = `${process.env.REACT_APP_RESOURCE_MANAGER_PORT}`;
    //     client.defaults.baseURL = `${url}:${port}`;
    //     const result = await client.post('/organization/services/', data);
    //     if (result.status === 200) {
    //       editAreaNotification(result.data);
    //       refreshDataServices();
    //     }
    //   } catch {
    //     console.error();
    //   }
    //   formRef.resetFields();
    //   setVisible(false);
    // });
  };

  const editAreaNotification = (message) => {
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
      // setSelectAreaList([]);
    })
    formRef.resetFields();
    // setSelectAreaList([]);
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
      <Button className="edit-button" btnSize={"wd_df"} type="link" ghost onClick={showModal}>
        <p>Edit</p>
      </Button>

      <CollectionCreateForm
        serviecsArea={serviecsArea}
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
