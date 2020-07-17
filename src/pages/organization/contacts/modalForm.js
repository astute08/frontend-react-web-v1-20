import React from 'react';
import { Modal, Input, Form } from 'antd';
import Button from '../../../components/v2/button';
import './css/index.css';

const ModalFormComponent = ({ visible, onCancel, onCreate, form }) => {
  const { getFieldDecorator } = form;
  return (
    <Modal
      className="modalform"
      visible={visible}
      title="Contacts"
      okText="Save"
      onCancel={onCancel}
      onOk={onCreate}
      footer={[
        <Button key="back" btnSize="wd_df" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="submit" btnSize="wd_df" type="primary" onClick={onCreate}>
          Continue
        </Button>,
      ]}
    >
      <Form layout="vertical">
        <span className="title">
          We need a few details to create your Contact.
        </span>

        <Form.Item>
          {getFieldDecorator('name', {
            rules: [{ required: true, message: 'Please, input your name' }],
          })(<Input placeholder="Name" />)}
        </Form.Item>

        <Form.Item>
          {getFieldDecorator('phone', {
            rules: [{ required: true, message: 'Please, input your phone' }],
          })(<Input placeholder="Phone Number" />)}
        </Form.Item>

        <Form.Item>
          {getFieldDecorator('email')(<Input placeholder="Email" />)}
        </Form.Item>

        <Form.Item>
          {getFieldDecorator('description')(<Input type="textarea" placeholder="Description" />)}
        </Form.Item>
      </Form>
      {/* </Formik>  */}
    </Modal>
  );
};

const ModalForm = Form.create({ name: 'modal_form' })(ModalFormComponent);

export default ModalForm;
