import React, { useState, useEffect } from 'react';
import {
  Layout,
  Row,
  Col,
  Steps,
  Modal,
  notification,
  Icon,
  Dropdown,
  Menu,
} from 'antd';
import Button from '../../components/v2/button';
import AppProvider from './appProvider';
import Information from './infomation';
import Contacts from './contacts';
import Documents from './documents';
import Confirmation from './confirmation';
import axiosClient from '../../components/httpClient';
import Moment from 'moment';
import { contrast } from 'jimp';

const httpClient = axiosClient();

const { Header, Content } = Layout;
const { Step } = Steps;
const { confirm } = Modal;

const styleLangMenu = {
  float: 'right',
  marginTop: 5,
};

export default () => {
  const app = AppProvider.useAppContext();

  const steps = [
    {
      title: app.state.lang.information
        ? app.state.lang.information
        : 'Information',
      content: 'Information-content',
    },
    {
      title: app.state.lang.contacts ? app.state.lang.contacts : 'Contacts',
      content: 'Contacts-content',
    },
    {
      title: app.state.lang.documents ? app.state.lang.documents : 'Documents',
      content: 'Documents-content',
    },
    {
      title: app.state.lang.confirmation
        ? app.state.lang.confirmation
        : 'Confirmation',
      content: 'Confirmation-content',
    },
  ];

  const stepLength = steps.length;
  const [formData, setFormData] = useState();

  const handleClickLangMenu = (event) => {
    const getIndexLanguage = app.state.language.findIndex(
      (object) => object.code == event.key,
    );
    app.fnc.setThisLanguage(event.key);
    app.fnc.setThisLanguageTitle(app.state.language[getIndexLanguage].title);
  };

  const langMenu = (
    <Menu
      onClick={handleClickLangMenu}
      style={{ width: 180, padding: 0 }}
      defaultSelectedKeys={app.state.defaultLanguage.code}
      selectedKeys={app.state.thisLanguage}
    >
      {app.state.language.map((value) => {
        return (
          <Menu.Item key={value.code}>
            {value.title}
            {value.code == app.state.thisLanguage ? (
              <Icon type="check" style={styleLangMenu} />
            ) : (
              ''
            )}
          </Menu.Item>
        );
      })}
    </Menu>
  );

  const ButtonNextStep = () => {
    return (
      <Button type="primary" size="large" onClick={handleNextStep}>
        {app.state.lang.next ? app.state.lang.next : 'Next'}
      </Button>
    );
  };

  const ButtonPreviousStep = () => {
    const marginRight = app.state.stepCurrent == stepLength - 1 ? 5 : 5;

    return (
      <Button
        size="large"
        style={{ marginRight: marginRight }}
        onClick={handlePreviousStep}
      >
        {app.state.lang.previous ? app.state.lang.previous : 'Previous'}
      </Button>
    );
  };

  const handleSignUp = async () => {
    console.log("formData => ", formData);
    console.log("emergencyContactData => ", app.state.emergencyContactData);
    console.log("documentsData => ", app.state.documentsData);
    console.log("documentImage => ", app.state.dataDoc);

    const dataDocLength = app.state.dataDoc.length;
    console.log('dataDoc language::::: ', dataDocLength);
    // return ;

    const profileImg = app.state.filePreview
      ? app.state.filePreview.split(',')
      : [];

    const data = {
      fname: formData.fname ? formData.fname.value : '',
      lname: formData.lname ? formData.lname.value : '',
      email: formData.email ? formData.email.value : '',
      phone: formData.phone ? formData.phone.value : '',
      id_card: formData.idCard ? formData.idCard.value : '',
      birthday: formData.birthDate
        ? Moment(formData.birthDate.value._d.valueOf()).format('YYYY-MM-DD')
        : '',
      password: formData.passwordConfirm ? formData.passwordConfirm.value : '',
      gender: formData.gender
        ? formData.gender.value == 1
          ? 'male'
          : 'female'
        : '',
      profile_img: profileImg.length > 1 ? `${profileImg[1]}` : '',
      type: '.jpg',
      user_id: app.userId.toString(),
      updated_by: app.userId.toString(),
      contacts: [...app.state.emergencyContactData],
    };

    console.log('data::::**** ', data);

    confirm({
      title: app.state.lang.doYouWantSignUp
        ? app.state.lang.doYouWantSignUp
        : 'Do you Want to sign up?',
      content: '',
      okText: app.state.lang.okText ? app.state.lang.okText : 'Confirm',
      cancelText: app.state.lang.cancelText
        ? app.state.lang.cancelText
        : 'Cancel',
      async onOk() {
        // try {
          const signup = await httpClient.post(`/v2/signup`, data);
          // const documentImage = await httpClient.post(`/v2/upload/document`, app.state.dataDoc);
          console.log('signup::++', signup);
          if (signup.status === 200 || signup.status === 204) {
            app.state.dataDoc.forEach(async (element, index) => {
              console.log('dataDoc element::++', element);
              console.log('dataDoc index::++', index);
              let documentImage = index + 1 === dataDocLength ? 200 : '';
              try {
                const response = await httpClient.post(`/v2/upload/document`, element);
                console.log('response::++', response );
                if (response.status === 200 || response.status === 204) {
                  if (signup.status === 200 && documentImage === 200) {
                    notification.open({
                      message: signup.data.data,
                      description: '',
                      icon: <Icon type="check-circle" style={{ color: '#22B14C' }} />,
                    });
                    setTimeout(() => {
                      window.location.href = `/loginform`;
                    }, 1000);
                  } 
                  // else {
                  //   notification.open({
                  //     message: signup.data.data,
                  //     description: '',
                  //     icon: <Icon type="close-circle" style={{ color: '#FF0000' }} />,
                  //   });
                  // }
                } else {
                  notification.open({
                    message: response.data.data,
                    description: '',
                    icon: <Icon type="close-circle" style={{ color: '#FF0000' }} />,
                  });
                };
              } catch {
                console.error();
              }
            });
          } else {
            console.error();
            notification.open({
              message: signup.data.data,
              description: '',
              icon: <Icon type="close-circle" style={{ color: '#FF0000' }} />,
            });
          }
          

          // if (signup.status === 200 && documentImage.status === 200) {
          //   notification.open({
          //     message: signup.data.success,
          //     description: '',
          //     icon: <Icon type="check-circle" style={{ color: '#22B14C' }} />,
          //   });
          // } else {
          //   notification.open({
          //     message: signup.data.data || documentImage.data.success,
          //     description: '',
          //     icon: <Icon type="close-circle" style={{ color: '#FF0000' }} />,
          //   });
          // }

        // } catch (e) {
        //   if (e) {
        //     notification.open({
        //       message: 'Sign up fail!',
        //       description: '',
        //       icon: <Icon type="close-circle" style={{ color: '#FF0000' }} />,
        //     });
        //   }
        // }
      },
    });
  };

  const ButtonSignUp = () => {
    return (
      <Button
        type="danger"
        size="large"
        style={{ marginRight: 5 }}
        onClick={handleSignUp}
      >
        {app.state.lang.signup ? app.state.lang.signup : 'Sign Up'}
      </Button>
    );
  };

  const handleNextStep = () => {
    if (app.state.stepCurrent == 0) {
      app.fnc.setInformationRef(!app.state.informationRef);
    } else if (app.state.stepCurrent == 1) {
      if (app.state.emergencyContactData.length > 0) {
        app.fnc.setContactsFormStatus(true);
        app.fnc.setContactsRef(!app.state.contactsRef);
      } else {
        notification.open({
          message: app.state.lang.wrnContact
            ? app.state.lang.wrnContact
            : 'Please add at least 1 contact',
          description: '',
          icon: <Icon type="info-circle" style={{ color: '#FFC90E' }} />,
        });
      }
    } else if (app.state.stepCurrent == 2) {
      app.fnc.setDocumentsFormStatus(true);
      app.fnc.setDocumentsRef(!app.state.documentsRef);
    }

    // const newStepCurrent = app.state.stepCurrent >= 0 && app.state.stepCurrent < (stepLength - 1) ? app.state.stepCurrent + 1 : app.state.stepCurrent;
    // app.fnc.setStepCurrent(newStepCurrent);
  };

  const handlePreviousStep = () => {
    // if(app.state.stepCurrent == 1) {
    //   app.fnc.setInformationFormStatus(false);
    // }
    // else if(app.state.stepCurrent == 2) {
    //   app.fnc.setContactsFormStatus(false);
    // }

    const newStepCurrent =
      app.state.stepCurrent > 0 && app.state.stepCurrent <= stepLength - 1
        ? app.state.stepCurrent - 1
        : app.state.stepCurrent;
    app.fnc.setStepCurrent(newStepCurrent);
  };

  const handleFormOnChange = (changedFields, allFields) => {
    setFormData({ ...allFields });
  };

  useEffect(() => {
    const newStepCurrent =
      app.state.stepCurrent >= 0 && app.state.stepCurrent < stepLength - 1
        ? app.state.stepCurrent + 1
        : app.state.stepCurrent;
    if (
      app.state.stepCurrent == 0 &&
      app.state.informationFormStatus === true
    ) {
      app.fnc.setStepCurrent(newStepCurrent);
    } else if (
      app.state.stepCurrent == 1 &&
      app.state.contactsFormStatus === true
    ) {
      app.fnc.setStepCurrent(newStepCurrent);
    } else if (
      app.state.stepCurrent == 2 &&
      app.state.documentsFormStatus === true
    ) {
      app.fnc.setStepCurrent(newStepCurrent);
    }

    app.fnc.setInformationCurrentStepCount(
      app.state.informationCurrentStepCount + 1,
    );
  }, [
    app.state.informationFormStatus,
    app.state.contactsFormStatus,
    app.state.documentsRef,
  ]);

  const stepView = () => {
    switch (app.state.stepCurrent) {
      case 0:
        return (
          <Information
            {...formData}
            defaultEmail={app.email}
            onChange={handleFormOnChange}
          />
        );
      case 1:
        return <Contacts createStatus={true} />;
      case 2:
        return <Documents createStatus={true} />;
      case 3:
        return <Confirmation {...formData} />;
      default:
        return <Information />;
    }
  };

  return (
    <div className="register-form">
      <Layout>
        <Header
          style={{
            background: '#FFFFFF',
            borderBottom: '1px solid #E2E2E2',
            padding: '10px 0px 10px 0px',
            position: 'fixed',
            zIndex: 10,
            width: '100%',
            top: 0,
          }}
        >
          <Row>
            <Col span={8} offset={5}>
              <h2 style={{ marginTop: 5, fontWeight: 700 }}>
                {app.state.lang.headerTitle
                  ? app.state.lang.headerTitle
                  : 'Sign up to join your team'}
              </h2>
            </Col>
            <Col span={6} style={{ textAlign: 'right' }}>
              <Dropdown overlay={langMenu} trigger={['click']}>
                <a
                  className="ant-dropdown-link"
                  onClick={(e) => e.preventDefault()}
                  style={{ marginRight: 16, color: '#878787' }}
                >
                  <Icon type="global" style={{ fontSize: 16 }} />
                  <label style={{ paddingLeft: 20, paddingRight: 20 }}>
                    {app.state.thisLanguageTitle
                      ? app.state.thisLanguageTitle
                      : app.state.defaultLanguage.title}
                  </label>
                  <Icon type="down" />
                </a>
              </Dropdown>
              {app.state.stepCurrent > 0 ? <ButtonPreviousStep /> : ''}
              {app.state.stepCurrent >= 0 &&
              app.state.stepCurrent < stepLength - 1 ? (
                <ButtonNextStep />
              ) : (
                ''
              )}
              {app.state.stepCurrent == stepLength - 1 ? <ButtonSignUp /> : ''}
            </Col>
          </Row>
        </Header>
        <Content
          style={{
            position: 'absolute',
            width: '100%',
            top: '64px',
            zIndex: 0,
          }}
        >
          <Row>
            <Col span={14} offset={5}>
              <Steps
                current={app.state.stepCurrent}
                style={{ margin: '30px 0px' }}
              >
                {steps.map((item) => (
                  <Step key={item.title} title={item.title} />
                ))}
              </Steps>
            </Col>
          </Row>
          <Row>
            <Col span={14} offset={5}>
              {stepView()}
            </Col>
          </Row>
        </Content>
      </Layout>
    </div>
  );
};
