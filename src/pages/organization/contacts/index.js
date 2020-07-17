import React, { useState, useEffect, useCallback } from 'react';
import ModalForm from './modalForm';
import { Icon, Popover, Modal, notification, Row, Col } from 'antd';
import Table from '../../../components/v2/table'
// import '../../../components/css/card.css';
import './css/index.css';
import Button from '../../../components/v2/button';
import HttpClient from '../../../components/httpClient';
import Provider from '../provider';
import styled from 'styled-components'

const DivDetail = styled.div`
  /* padding: 0px 24px; */
  margin-top: 36px;
  margin-bottom: 24px;
`;

let client = HttpClient();

const Contacts = (props) => {
  const app = Provider.useAppContext();
  // console.log('props contacts::: ', props);
  const orgId = props.orgId;
  const dataContacts = props.data;
  const created_by = 1;


  const [visible, setVisible] = useState(false);
  const [formRef, setFormRef] = useState(null);

  useEffect(() => {
 
  }, [props]);

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
      title: 'Contact Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record, index) => {
        return (record.name ? record.name : '-');
      }
    },
    {
      title: 'Phone Number',
      dataIndex: 'phone',
      key: 'phone',
      render: (text, record, index) => {
        return (record.phone ? record.phone : '-');
      }
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (text, record, index) => {
        return (record.email ? record.email : '-');
      }
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (text, record, index) => {
        return (record.description ? record.description : '-');

      }
    },
    {
      title: '',
      key: 'options',
      dataIndex: 'options',
      align: 'center',
      width: '5%',
      render: (text, record, index) => {
        return (
          record.options = (
            // <Popover onClick={() => handleDelete(record)} placement="leftTop">
            //     <Icon type="delete" />
            // </Popover>
            <Icon onClick={() => handleDelete(record)} type="delete" />
          )
        )
      }
    },
  ];

  const showModal = (e) => {
    console.log('e: ', e);
    setVisible(true);
  };

  const handleCancel = (e) => {
    console.log(e);
    formRef.validateFields(async (err, values) => {
      if (err) {
        return;
      }
      formRef.resetFields();
    })
    formRef.resetFields();
    setVisible(false);
  };

  const handleDelete = (contact) => {
    Modal.confirm({
      icon: <Icon type="delete" style={{ color: '#FF0000' }} />,
      title: 'Are you sure to delete ?',
      okText: 'OK',
      cancelText: 'Cancle',
      onOk() {
        deleteContact(contact.org_con_id);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const deleteContact = async (org_con_id) => {
    try {
      const result = await client.delete(`/v2/organization/contacts/${org_con_id}/${created_by}`);
      deletedNotification(result.data.message);
      app.fnc.getRefresh();
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreate = async () => {
    formRef.validateFields(async (err, values) => {
      if (err) {
        return;
      }
      formRef.resetFields();
      try {
        const body = {
          name: `${values.name}`,
          phone: `${values.phone}`,
          email: `${values.email}`,
          description: `${values.description}`,
          created_by: orgId,
          org_id: orgId
        }
        const result = await client.post('/v2/organization/contacts/create', body);
        successNotification(result.data.message);
        app.fnc.getRefresh();
      } catch (error) {
        console.log(error);
      }
      setVisible(false);
    });
  };

  const saveFormRef = useCallback((node) => {
    if (node !== null) {
      setFormRef(node);
    }
  }, []);

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

  return (
    <div className="contacts-card">
      <DivDetail>
        <Row gutter={[16, 16]} align='middle'>
          <Col className="gutter-row" span={20}>
            <h3>Contacts</h3>
          </Col>
          <Col className="gutter-row" span={4} style={{ textAlign: 'right' }}>
            <Button
              primary="primary"
              fontSize="md"
              btnSize="wd_df"
              onClick={showModal}
            >
              Add New
            </Button>
          </Col>
        </Row>
      </DivDetail>
      <Table  
        className="contacts-table"
        rowKey="org_con_id"
        size={'middle'}
        dataSource={dataContacts}
        columns={columns}
        sizeWidth={'lg'}
        pagination={false}
      />
      <ModalForm
        ref={saveFormRef}
        visible={visible}
        onCancel={() => handleCancel()}
        onCreate={() => handleCreate()}
      />
    </div>
  );
};

export default Contacts;
