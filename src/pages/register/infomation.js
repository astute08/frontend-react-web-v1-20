import React, { useState, useEffect } from 'react';
import Moment from 'moment';
import {
  Form,
  Row,
  Col,
  Icon,
  Button,
  Input,
  Radio,
  DatePicker,
  Upload,
  Card,
} from 'antd';
import AppProvider from './appProvider';
import Profile from './profile';

export default Form.create({
  name: 'informationForm',
  mapPropsToFields(props) {
    return {
      fname: Form.createFormField({ ...props.fname }),
      lname: Form.createFormField({ ...props.lname }),
      profileImage: Form.createFormField({ ...props.profileImage }),
      gender: Form.createFormField({ ...props.gender }),
      email: Form.createFormField({ ...props.email }),
      phone: Form.createFormField({ ...props.phone }),
      idCard: Form.createFormField({ ...props.idCard }),
      birthDate: Form.createFormField({ ...props.birthDate }),
      password: Form.createFormField({ ...props.password }),
      passwordConfirm: Form.createFormField({ ...props.passwordConfirm }),
    };
  },
  onFieldsChange(props, changedFields, allFields) {
    props.onChange(changedFields, allFields);
  },
})((props) => {
  const app = AppProvider.useAppContext();
  const { getFieldDecorator, getFieldValue, validateFields, getFieldsError, setFields, getFieldsValue } = props.form;
  const [confirmDirty, setConfirmDirty] = useState(false);

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

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    e.fileList = e.fileList.slice(-1);

    return e && e.fileList;
  };

  const handlePreview = async (file) => {
    // console.log('file++++ ', file);
    const base64 = await app.fnc.getBase64(file);
    console.log('base64++++ ', base64);

    return base64;
  };

  const propsUpload = {
    name: 'profileImage',
    listType: 'picture',
    showUploadList: false,
    beforeUpload: (file, fileList) => {
      return false;
    },
    onChange: async (info) => {
      // console.log('Image::: ',info)
      const filePreview = await handlePreview(info.file);
      console.log('Image::: ', filePreview)
      app.fnc.setFilePreview(filePreview);
    },
  };

  const validateToNextPassword = (rule, value, callback) => {
    if (value && confirmDirty) {
      validateFields(['passwordConfirm'], { force: true });
    }
    callback();
  };

  const compareToFirstPassword = (rule, value, callback) => {
    if (value && value !== getFieldValue('password')) {
      let errorConfirmPassword = app.state.lang.errorConfirmPassword
        ? app.state.lang.errorConfirmPassword
        : 'Two passwords that you enter is inconsistent!';
      callback(errorConfirmPassword);
    } else {
      callback();
    }
  };

  const handleConfirmBlur = (e) => {
    const { value } = e.target;
    validateFields(['passwordConfirm'], { force: false });
    setConfirmDirty(confirmDirty || !!value);
  };

  const handleChangeBirthdate = (rule, value, callback) => {
    const errors = [];
    if (value) {
      let dateNow = Moment()
        .format('YYYY-MM-DD')
        .split('-');
      let birthdate = Moment(value._d.valueOf())
        .format('YYYY-MM-DD')
        .split('-');

      let a = Moment([dateNow[0], dateNow[1]]);
      let b = Moment([birthdate[0], birthdate[1]]);
      let dateDiff = a.diff(b, 'years');
      if (dateDiff < 18) {
        let errorBirthDate = app.state.lang.errorBirthDate
          ? app.state.lang.errorBirthDate
          : 'You must be 18 years or older.';
        errors.push(errorBirthDate);
      }
    }

    callback(errors);
  };

  useEffect(() => {
    if (app.state.informationCurrentStepCount > 0) {
      const error = validateFields();
      error.then(
        (response) => {
          if (app.state.stepCurrent > 0) {
            // app.fnc.setInformationFormStatus(true);
          } else {
            if (app.state.informationFormStatus) {
              app.fnc.setInformationFormStatus(false);
            } else {
              app.fnc.setInformationFormStatus(true);
            }
          }
        },
        (error) => {
          app.fnc.setInformationFormStatus(false);
        },
      );
    }
  }, [app.state.informationRef]);

  useEffect(() => {
    setRules();
    
  }, [app.state.lang]);

  const setRules = () => {
    const fields = getFieldsValue();
    setFields({
      gender: { 
        value: fields.gender,
        rules: [
          {
            required: true,
            message: app.state.lang.errorGender 
            ? app.state.lang.errorGender 
            : 'Please select gender!',
          },
        ] 
      },
      fname: { 
        value: fields.fname,
        rules: [
          {
            required: true,
            message: app.state.lang.rqFirstName
              ? app.state.lang.rqFirstName
              : 'Please input your first name!',
          },
          {
            min: 3,
            max: 255,
            message: app.state.lang.rqLenFirstName
              ? app.state.lang.rqLenFirstName
              : 'Please input your first name 3 to 255 characters!',
          }
        ] 
      },
      lname: {
        value: fields.lname,
        rules: [
          {
            required: true,
            message: app.state.lang.rqLastName
              ? app.state.lang.rqLastName
              : 'Please input your last name!',
          },
          {
            min: 3,
            max: 255,
            message: app.state.lang.rqLenLastName
              ? app.state.lang.rqLenLastName
              : 'Please input your last name 3 to 255 characters!',
          },
        ]
      },
      email: {
        value: fields.email,
        rules: [
          {
            required: true,
            message: app.state.lang.rqEmail
              ? app.state.lang.rqEmail
              : 'Please input your email address!',
          },
          {
            type: 'email',
            message: app.state.lang.rqTypeEmail
              ? app.state.lang.rqTypeEmail
              : 'The input is not valid E-mail!',
          },
        ]
      },
      phone: {
        value: fields.phone,
        rules: [
          {
            required: true,
            message: app.state.lang.rqPhone
              ? app.state.lang.rqPhone
              : 'Please input your phone number!',
          },
          // {
          //   pattern: new RegExp(/^[A-Za-zก-ฮ0-9\b]+$/),
          //   message: "Please enter numbers only!"
          // },
          // {
          //   max: 10,
          //   message: app.state.lang.rqLenPhone ? app.state.lang.rqLenPhone : "Please input your phone max 10 characters!"
          // }
        ]
      },
      idCard: {
        value: fields.idCard,
        rules: [
          {
            required: true,
            message: app.state.lang.rqIdCard
              ? app.state.lang.rqIdCard
              : 'Please input your ID card number!',
          },
          {
            pattern: new RegExp(/^[0-9\b]+$/),
            message: app.state.lang.regIdCard
              ? app.state.lang.regIdCard
              : 'Please enter numbers only!',
          },
          {
            len: 13,
            message: app.state.lang.rqLenIdCard
              ? app.state.lang.rqLenIdCard
              : 'Please input your phone 13 characters!',
          },
        ]
      },
      birthDate: {
        value: fields.birthDate,
        rules: [
          {
            required: true,
            message: app.state.lang.rqBirthDate
              ? app.state.lang.rqBirthDate
              : 'Please select your birth date!',
          },
          {
            validator: handleChangeBirthdate,
          },
        ]
      },
      password: {
        value: fields.password,
        rules: [
          {
            required: true,
            message: app.state.lang.rqPassword
              ? app.state.lang.rqPassword
              : 'Please input your password!',
          },
          {
            validator: validateToNextPassword,
          },
        ]
      },
      passwordConfirm: {
        value: fields.passwordConfirm,
        rules: [
          {
            required: true,
            message: app.state.lang.rqConfirmPassword
              ? app.state.lang.rqConfirmPassword
              : 'Please input your confirm password!',
          },
          {
            validator: compareToFirstPassword,
          },
        ]
      }
    });

    const found = Object.keys(fields).filter(key => {
      if(fields[key] !== undefined) {
        return key;
      }
      
      return false;
    });
    if(found.length > 0) {
      validateFields(found);
    }
  };

  return (
    <Card
      title={
        app.state.lang.personalInformation
          ? app.state.lang.personalInformation
          : 'Personal Information'
      }
    >
      <Form {...formItemLayout} style={{ margin: 50 }}>
        <Row gutter={16}>
          <Col className="gutter-row" span={10} style={{ textAlign: 'center' }}>
            <Profile />
            <Form.Item>
              {getFieldDecorator('profileImage', {
                valuePropName: 'fileList',
                getValueFromEvent: normFile,
              })(
                <Upload {...propsUpload}>
                  <Button type="danger" size="large">
                    <Icon type="cloud-upload" />{' '}
                    {app.state.lang.upload ? app.state.lang.upload : 'Upload'}
                  </Button>
                </Upload>,
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('gender', {
                rules: [
                  {
                    required: true,
                    message: app.state.lang.errorGender ? 
                      app.state.lang.errorGender 
                      : 'Please select gender!',
                  },
                ] 
              })(
                <Radio.Group>
                  <Radio value={1} checked={true}>
                    {app.state.lang.male ? app.state.lang.male : 'Male'}
                  </Radio>
                  <Radio value={2}>
                    {app.state.lang.female ? app.state.lang.female : 'Female'}
                  </Radio>
                </Radio.Group>,
              )}
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={10}>
            <Row gutter={16}>
              <Col className="gutter-row" span={24}>
                <p style={{ marginBottom: '0.5em' }}>
                  {app.state.lang.weNeed
                    ? app.state.lang.weNeed
                    : 'We need a few details to create an account for'}
                </p>
                <p class="txt-main-color">{app.email}</p>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col className="gutter-row" span={18}>
                <Form.Item hasFeedback>
                  {getFieldDecorator('fname', {
                    rules: [
                      {
                        required: true,
                        message: app.state.lang.rqFirstName
                          ? app.state.lang.rqFirstName
                          : 'Please input your first name!',
                      },
                      {
                        min: 3,
                        max: 255,
                        message: app.state.lang.rqLenFirstName
                          ? app.state.lang.rqLenFirstName
                          : 'Please input your first name 3 to 255 characters!',
                      },
                    ],
                  })(
                    <Input
                      size="large"
                      placeholder={
                        app.state.lang.plaFirstName
                          ? app.state.lang.plaFirstName
                          : 'Enter first name'
                      }
                      autoComplete="off"
                    />,
                  )}
                </Form.Item>
                <Form.Item hasFeedback>
                  {getFieldDecorator('lname', {
                    rules: [
                      {
                        required: true,
                        message: app.state.lang.rqLastName
                          ? app.state.lang.rqLastName
                          : 'Please input your last name!',
                      },
                      {
                        min: 3,
                        max: 255,
                        message: app.state.lang.rqLenLastName
                          ? app.state.lang.rqLenLastName
                          : 'Please input your last name 3 to 255 characters!',
                      },
                    ],
                  })(
                    <Input
                      size="large"
                      placeholder={
                        app.state.lang.plaLastName
                          ? app.state.lang.plaLastName
                          : 'Enter last name'
                      }
                      autoComplete="off"
                    />,
                  )}
                </Form.Item>
                <Form.Item hasFeedback>
                  {getFieldDecorator('email', {
                    initialValue: app.email,
                    rules: [
                      {
                        required: true,
                        message: app.state.lang.rqEmail
                          ? app.state.lang.rqEmail
                          : 'Please input your email address!',
                      },
                      {
                        type: 'email',
                        message: app.state.lang.rqTypeEmail
                          ? app.state.lang.rqTypeEmail
                          : 'The input is not valid E-mail!',
                      },
                    ],
                  })(
                    <Input
                      size="large"
                      placeholder={
                        app.state.lang.plaEmail
                          ? app.state.lang.plaEmail
                          : 'Enter email address'
                      }
                      autoComplete="off"
                      disabled={true}
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
                      //   pattern: new RegExp(/^[A-Za-zก-ฮ0-9\b]+$/),
                      //   message: "Please enter numbers only!"
                      // },
                      // {
                      //   max: 10,
                      //   message: app.state.lang.rqLenPhone ? app.state.lang.rqLenPhone : "Please input your phone max 10 characters!"
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
                <Form.Item hasFeedback>
                  {getFieldDecorator('idCard', {
                    rules: [
                      {
                        required: true,
                        message: app.state.lang.rqIdCard
                          ? app.state.lang.rqIdCard
                          : 'Please input your ID card number!',
                      },
                      {
                        pattern: new RegExp(/^[0-9\b]+$/),
                        message: app.state.lang.regIdCard
                          ? app.state.lang.regIdCard
                          : 'Please enter numbers only!',
                      },
                      {
                        len: 13,
                        message: app.state.lang.rqLenIdCard
                          ? app.state.lang.rqLenIdCard
                          : 'Please input your phone 13 characters!',
                      },
                    ],
                  })(
                    <Input
                      size="large"
                      placeholder={
                        app.state.lang.plaIdCard
                          ? app.state.lang.plaIdCard
                          : 'Enter ID card number'
                      }
                      autoComplete="off"
                    />,
                  )}
                </Form.Item>
                <Form.Item hasFeedback>
                  {getFieldDecorator('birthDate', {
                    rules: [
                      {
                        required: true,
                        message: app.state.lang.rqBirthDate
                          ? app.state.lang.rqBirthDate
                          : 'Please select your birth date!',
                      },
                      {
                        validator: handleChangeBirthdate,
                      },
                    ],
                  })(
                    <DatePicker
                      size="large"
                      style={{ width: '100%' }}
                      placeholder={
                        app.state.lang.selectBirthDate
                          ? app.state.lang.selectBirthDate
                          : 'Select birth date'
                      }
                    />,
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col className="gutter-row" span={24}>
                <p style={{ marginTop: '1.5em', marginBottom: '1em' }}>
                  {app.state.lang.choosePassword
                    ? app.state.lang.choosePassword
                    : "Choose a strong password and don't reuse it for other accounts."}
                </p>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col className="gutter-row" span={18}>
                <Form.Item hasFeedback>
                  {getFieldDecorator('password', {
                    rules: [
                      {
                        required: true,
                        message: app.state.lang.rqPassword
                          ? app.state.lang.rqPassword
                          : 'Please input your password!',
                      },
                      {
                        validator: validateToNextPassword,
                      },
                    ],
                  })(
                    <Input.Password
                      size="large"
                      placeholder={
                        app.state.lang.plaPassword
                          ? app.state.lang.plaPassword
                          : 'Enter password'
                      }
                      onBlur={handleConfirmBlur}
                      autoComplete="off"
                    />,
                  )}
                </Form.Item>
                <Form.Item hasFeedback>
                  {getFieldDecorator('passwordConfirm', {
                    rules: [
                      {
                        required: true,
                        message: app.state.lang.rqConfirmPassword
                          ? app.state.lang.rqConfirmPassword
                          : 'Please input your confirm password!',
                      },
                      {
                        validator: compareToFirstPassword,
                      },
                    ],
                  })(
                    <Input.Password
                      size="large"
                      placeholder={
                        app.state.lang.plaConfirmPassword
                          ? app.state.lang.plaConfirmPassword
                          : 'Enter confirm password'
                      }
                      autoComplete="off"
                    />,
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </Row>
      </Form>
    </Card>
  );
});
