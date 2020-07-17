import React, { useState, useEffect } from 'react';
import AppProvider from './appProvider';
import {
  Table,
  Form,
  Card,
  Button,
  Modal,
  Input,
  Icon,
  Popconfirm,
  Row,
  Col,
  Popover
} from 'antd';
import './css/contacts.css';

const ModalForm = Form.create({
  name: 'emergencyContactForm',
})((props) => {
  const app = AppProvider.useAppContext();
  const {
    getFieldDecorator,
    getFieldsValue,
    validateFields,
    resetFields,
  } = props.form;

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 24 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 24 },
    },
  };

  const handleSave = () => {
    const error = validateFields();
    error.then(
      (response) => {
        const value = getFieldsValue();
        props.onOk(value);
        resetFields();
      },
      (error) => {},
    );
  };

  const handleCancel = () => {
    props.onCancel();
    resetFields();
  };

  return (
    <Form {...formItemLayout}>
      <Row gutter={16}>
        <Col className="gutter-row" offset={4} span={16}>
          <p style={{ marginBottom: 24 }}>
            {app.state.lang.rqFullname
              ? app.state.lang.rqFullname
              : 'We need a few details to create your Contact.'}
          </p>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col
          className="gutter-row"
          offset={4}
          span={16}
          style={{ textAlign: 'center' }}
        >
          <Form.Item hasFeedback>
            {getFieldDecorator('fullname', {
              rules: [
                {
                  required: true,
                  message: app.state.lang.rqFullname
                    ? app.state.lang.rqFullname
                    : 'Please input your full name!',
                },
              ],
            })(
              <Input
                size="large"
                placeholder={
                  app.state.lang.plaFullname
                    ? app.state.lang.plaFullname
                    : 'Enter full name'
                }
                autoComplete="off"
              />,
            )}
          </Form.Item>
          <Form.Item hasFeedback>
            {getFieldDecorator('relation', {
              rules: [
                {
                  required: true,
                  message: app.state.lang.rqRelation
                    ? app.state.lang.rqRelation
                    : 'Please input your relation!',
                },
              ],
            })(
              <Input
                size="large"
                placeholder={
                  app.state.lang.plaRelation
                    ? app.state.lang.plaRelation
                    : 'Enter relation'
                }
                autoComplete="off"
              />,
            )}
          </Form.Item>
          <Form.Item hasFeedback>
            {getFieldDecorator('phone', {
              rules: [
                {
                  required: true,
                  message: app.state.lang.rqPhone
                    ? app.state.lang.rqPhone
                    : 'Please input your phone number!',
                },
                // {
                //   pattern: new RegExp(/^[0-9\b]+$/),
                //   message: "Please enter numbers only!"
                // }
              ],
            })(
              <Input
                size="large"
                placeholder={
                  app.state.lang.plaPhone
                    ? app.state.lang.plaPhone
                    : 'Enter phone number'
                }
                autoComplete="off"
              />,
            )}
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col
          className="gutter-row"
          offset={4}
          span={8}
          style={{ textAlign: 'center' }}
        >
          <Button type="danger" onClick={handleSave} size="large">
            {app.state.lang.save ? app.state.lang.save : 'Save'}
          </Button>
        </Col>
        <Col className="gutter-row" span={8} style={{ textAlign: 'center' }}>
          <Button type="danger" onClick={handleCancel} size="large">
            {app.state.lang.cancel ? app.state.lang.cancel : 'Cancel'}
          </Button>
        </Col>
      </Row>
    </Form>
  );
});

const ContactPopconfirm = (props) => {
  const app = AppProvider.useAppContext();

  const handleDeleteEmergencyContact = (key) => {
    const found = app.state.emergencyContactData.findIndex(
      (arr) => arr.key == key,
    );
    if (found >= 0) {
      const newEmergencyContactData = [...app.state.emergencyContactData];
      newEmergencyContactData.splice(found, 1);
      app.fnc.setEmergencyContactData(newEmergencyContactData);
    }
  };

  return (
    <Popconfirm
      placement="left"
      title={
        app.state.lang.areYouSureToDelete
          ? app.state.lang.areYouSureToDelete
          : 'Are you sure to delete ?'
      }
      onConfirm={() => handleDeleteEmergencyContact(props.vKey)}
      okText={app.state.lang.yes ? app.state.lang.yes : 'Yes'}
      cancelText={app.state.lang.no ? app.state.lang.no : 'No'}
    >
      <Icon type="delete" style={{ fontSize: 16, cursor: 'pointer' }} />
    </Popconfirm>
  );
};

export default (props) => {
  const app = AppProvider.useAppContext();
  const createStatus = props.createStatus ? true : false;
  const [counter, setCounter] = useState(0);
  const [visible, setVisible] = useState(false);

  const handleClickModal = () => {
    setVisible(true);
  };

  const handleOkModal = (value) => {
    const key = counter + 1;
    const setValue = {
      key: `${key}`,
      index: `${key}`,
      name: `${value.fullname}`,
      relation: `${value.relation}`,
      phone: `${value.phone}`,
      options: <ContactPopconfirm vKey={key} />,
    };
    app.fnc.setEmergencyContactData([
      ...app.state.emergencyContactData,
      setValue,
    ]);
    setCounter(key);
    setVisible(false);
  };

  const handleCancelModal = () => {
    setVisible(false);
  };

  const columns = [
    {
      title: '#',
      dataIndex: 'index',
      key: 'index',
      align: 'center',
      width: '5%',
      render: (text, record, index) => {
        return index + 1;
      },
    },
    {
      title: app.state.lang.name ? app.state.lang.name : 'Name',
      dataIndex: 'name',
      key: 'name',
      align: 'left',
      width: '50%',
    },
    {
      title: app.state.lang.relation ? app.state.lang.relation : 'Relation',
      dataIndex: 'relation',
      key: 'relation',
      align: 'left',
      width: '20%',
    },
    {
      title: app.state.lang.phone ? app.state.lang.phone : 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      align: 'left',
      width: '20%',
    },
    {
      title: '',
      key: 'options',
      dataIndex: 'options',
      align: 'right',
      width: '5%',
      render: (text, record, index) => {
        return createStatus ? record.options : false;
      },
    },
  ];

  useEffect(() => {
    app.fnc.setContactsFormStatus(false);
  }, [app.state.contactsRef]);

  const ContactEmpty = () => {
    return (
      <div>
        <Icon type="inbox" style={{ fontSize: '32px' }} theme="outlined" />
        <p>
          {app.state.lang.tableEmpty ? app.state.lang.tableEmpty : 'No Data'}
        </p>
      </div>
    );
  };

  // const handleDelete = (contact) => {
  //   Modal.confirm({
  //     icon: <Icon type="delete" style={{ color: '#FF0000' }} />,
  //     title: 'Are you sure to delete ?',
  //     okText: 'OK',
  //     cancelText: 'Cancle',
  //     onOk() {
  //       deleteContact(contact.org_con_id);
  //     },
  //     onCancel() {
  //       console.log('Cancel');
  //     },
  //   });
  // };

  return (
    <Card
      title={
        app.state.lang.emergencyContact
          ? app.state.lang.emergencyContact
          : 'Emergency Contact'
      }
      extra={
        createStatus ? (
          <Button type="danger" onClick={handleClickModal} size="large">
            {app.state.lang.addContact
              ? app.state.lang.addContact
              : 'Add Contact'}
          </Button>
        ) : (
          false
        )
      }
    >
      <Table
        columns={columns}
        dataSource={app.state.emergencyContactData}
        pagination={false}
        locale={{ emptyText: <ContactEmpty /> }}
      />
      <Modal
        key="new-contacts-modal"
        title={
          app.state.lang.emergencyContact
            ? app.state.lang.emergencyContact
            : 'Emergency Contact'
        }
        visible={visible}
        // onOk={handleOkModal}
        // confirmLoading={confirmLoading}
        onCancel={handleCancelModal}
        footer={null}
        // closable={false}
      >
        <ModalForm onOk={handleOkModal} onCancel={handleCancelModal} />
      </Modal>
    </Card>
  );
};
