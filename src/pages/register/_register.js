import React, { useState, createContext, useContext } from 'react';
import {
  Layout,
  Button,
  Steps,
  message,
  Card,
  Form,
  Input,
  DatePicker,
  Radio,
  Modal,
  Table,
  List,
  Icon,
  Upload,
} from 'antd';
const { Header, Content } = Layout;
const { Step } = Steps;

const AppContext = createContext();
const AppProvider = ({ children }) => {
  const [informationData, setInformationData] = useState({});
  console.log(informationData);
  return (
    <AppContext.Provider
      value={{
        state: {
          informationData,
        },
        setInformationData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

const useAppContext = () => useContext(AppContext);

const InformationConten = Form.create({ name: 'informationForm' })((props) => {
  const { getFieldDecorator, validateFields, getFieldsValue } = props.form;
  const app = useAppContext();

  return (
    <Card title={'Personal Information'}>
      <Form>
        <Form.Item>
          {getFieldDecorator('fullname', {
            rules: [
              {
                required: true,
                message: 'Please input your Current Password!',
              },
            ],
          })(<Input placeholder="Enter full name" />)}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('email', {
            rules: [
              {
                required: true,
                message: 'Please input your New Password!',
              },
            ],
          })(<Input placeholder="Enter email address" />)}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('phonenumber', {
            rules: [
              {
                required: true,
                message: 'Please input your Confirm Password!',
              },
            ],
          })(<Input placeholder="Enter phone number" />)}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('idcardnumber', {
            rules: [
              {
                required: true,
                message: 'Please input your Confirm Password!',
              },
            ],
          })(<Input placeholder="Enter ID card number" />)}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('birthdate', {
            rules: [
              {
                required: true,
                message: 'Please input your Confirm Password!',
              },
            ],
          })(
            <DatePicker
              placeholder="Select birth date"
              style={{ width: '100%' }}
            />,
          )}
        </Form.Item>

        <Form.Item>
          {getFieldDecorator('sex')(
            <Radio.Group>
              <Radio value="male">Male</Radio>
              <Radio value="female">Female</Radio>
            </Radio.Group>,
          )}
        </Form.Item>
      </Form>
    </Card>
  );
});

const ContactsContent = () => {
  const [stateModal, setStateModal] = useState(false);

  const showModal = () => {
    setStateModal(!stateModal);
  };
  const addDataList = () => {
    setStateModal(false);
  };
  const handleCancel = (e) => {
    setStateModal(false);
  };
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
  ];
  return (
    <Card
      title={'Emergency Contact'}
      extra={
        <Button type="primary" onClick={showModal}>
          Add Contact
        </Button>
      }
    >
      <Table columns={columns} />
      <Modal
        title="Contacts"
        visible={stateModal}
        onOk={addDataList}
        onCancel={handleCancel}
      ></Modal>
    </Card>
  );
};

const DocumentContent = () => {
  const data = [
    {
      title: 'Ant Design Title 1',
    },
    {
      title: 'Ant Design Title 2',
    },
    {
      title: 'Ant Design Title 3',
    },
    {
      title: 'Ant Design Title 4',
    },
  ];

  const props = {
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    onChange({ file, fileList }) {
      if (file.status !== 'uploading') {
        console.log(file, fileList);
      }
    },
  };
  return (
    <Card title={'Document'}>
      <List
        dataSource={data}
        renderItem={(item, index) => (
          <List.Item>
            <List.Item.Meta description={item.title} />
            <Upload {...props}>
              <Button>
                <Icon type="upload" /> Upload
              </Button>
            </Upload>
          </List.Item>
        )}
      />
    </Card>
  );
};

const ConfirmContent = () => {
  const app = useAppContext();

  return <h1>Confirmation</h1>;
};

const DefaultContent = () => {
  return <h1>Default Content</h1>;
};

const Register = () => {
  const app = useAppContext();
  const [current, setCurrent] = useState(0);

  const steps = [
    {
      title: 'Infomation',
    },
    {
      title: 'Contacts',
    },
    {
      title: 'Document',
    },
    {
      title: 'Confirmation',
    },
  ];

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const setFormContent = () => {
    const detailFormRef = (formRef) => {
      formRef = formRef;
    };

    switch (current) {
      case 0:
        return <InformationConten />;
      case 1:
        return <ContactsContent />;
      case 2:
        return <DocumentContent />;
      case 3:
        return <ConfirmContent />;
      default:
        return <DefaultContent />;
    }
  };

  return (
    <Layout>
      <Header style={{ background: '#fff', boxShadow: '0px 2px 0px #cccccc' }}>
        Sign Up join your team
        {current < steps.length - 1 && (
          <Button type="primary" onClick={next}>
            Next
          </Button>
        )}
        {current === steps.length - 1 && (
          <Button
            type="primary"
            onClick={() => message.success('Processing complete!')}
          >
            Done
          </Button>
        )}
        {current > 0 && (
          <Button style={{ marginLeft: 8 }} onClick={prev}>
            Previous
          </Button>
        )}
      </Header>
      <Content>
        <Steps current={current}>
          {steps.map((item) => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>
        <Card>{setFormContent()}</Card>
      </Content>
    </Layout>
  );
};

export default () => {
  return (
    <AppProvider>
      <Register />
    </AppProvider>
  );
};
