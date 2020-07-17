import React from 'react';
import { Modal, Row, Col, Avatar, Icon, List, DatePicker, Form, Select } from 'antd';
import moment from 'moment';
import './css/shift.css';
import Button from '../../../components/v2/button';

const { MonthPicker, RangePicker } = DatePicker;
const { Option } = Select;

const ModalFormComponent = ({ visible, onCancel, onCreate, form, memberProfile, onShiftType }) => {
  // console.log('memberProfile:: ', memberProfile);
  const { getFieldDecorator } = form;

  const rangeConfig = {
    rules: [{ type: 'array', required: true, message: 'Please select time!' }],
  };

  return (
    <Modal
      className="shift"
      title="Add Shift"
      okText="Add"
      visible={visible}
      onCancel={onCancel}
      onOk={onCreate}
      footer={[
        <Button key="back" btnSize="wd_df" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" btnSize="wd_df" onClick={onCreate}>
          Add
        </Button>,
      ]}
    >
      <Row>
        <Col span={8} className="col-avatar">
          <Avatar size={130} icon={"user"} />
        </Col>
        <Col span={16}>
          <List.Item className="list-item">
            <h2>{memberProfile[0] ? memberProfile[0].fullname : '-'}</h2>
          </List.Item>
          <List.Item className="list-item">
            <Icon className="icon" type="mail"/>
            <p className="text-p-sh" >{memberProfile[0] ? memberProfile[0].email : '-'}</p>
          </List.Item>
          <List.Item className="list-item">
            <Icon className="icon" type="phone"/>
            <p className="text-p-sh" >{memberProfile[0] ? memberProfile[0].phone : '-'}</p>
          </List.Item>
          <Form className="form">
            <Form.Item className="datePicker">
              {getFieldDecorator('range-picker', rangeConfig)(<RangePicker />)}
            </Form.Item>

            <Form.Item className="select"> 
              {getFieldDecorator('selectShift', {
                rules: [{ required: true, message: 'Please select your Shift!' }],
              })(
                <Select placeholder="Select Shift" hasFeedback >
                  {onShiftType.map((item, i) => ( 
                    <Option key={i} value={item.shift_id}>
                      {item.name}
                    </Option>
                  ))}

                </Select>,
              )}
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </Modal>
  )
}

const ModalShift = Form.create({ name: 'modal_form' })(ModalFormComponent);

export default ModalShift;