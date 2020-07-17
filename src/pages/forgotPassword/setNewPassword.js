import React, { useState } from 'react';
import AppCard from '../../components/card';
import AppInput from '../../components/input';
import AppButton from '../../components/button';
import { Row, Col, Form, Icon, Button, Input } from 'antd';

const SetNewPassword = ({ form }) => {
  const [newPassword, setToNewPassword] = useState('');
  const { getFieldDecorator, validateFields } = form;

  // ใช้กับหน้า form ทั้งหมด เพื่อ validate form
  const handleSubmit = (e) => {
    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  };

  // formItemLayout
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      md: { span: 5 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  };

  return (
    <Form {...formItemLayout} onSubmit={handleSubmit}>
      <AppCard
        title={'เลือกรหัสใหม่'}
        actions={[
          <Row>
            <Col style={{ float: 'right', paddingRight: '22px' }}>
              <AppButton
                textButton={'ดำเนินการต่อ'}
                htmlType="submit"
              ></AppButton>
            </Col>
          </Row>,
        ]}
      >
        <p>
          สร้างรหัสผ่านใหม่ที่มีความยาวไม่ต่ำกว่า 6 อักขระ
          รหัสผ่านที่ปลอดภัยจะประกอบด้วยตัว อักษร ตัวเลข และเครื่องหมายวรรคตอน
        </p>
        <Form.Item
          style={{ float: 'left', width: '50%' }}
          label="รหัสผ่านใหม่"
          hasFeedback
        >
          {getFieldDecorator('newPassword', {
            // message: เช็ค อักขระพิเศษ
            rules: [
              {
                required: true,
                message: 'โปรดตรวจสอบลิงค์เปลี่ยนรหัสผ่านในอีเมลของคุณ',
              },
            ],
          })(
            <Input.Password
              hasFeedback
              type="text"
              name="newPassword"
              className="input"
              value={newPassword}
            />,
          )}
        </Form.Item>
      </AppCard>
    </Form>
  );
};

const onFieldsChange = (_, changedFiels) => {
  console.log('onchangField' + changedFiels);

  const { email } = changedFiels;
  if (email) {
    console.log(`Now changing ${email.name}`);
  }
};

const IndexSetNewPassword = Form.create({ onFieldsChange })(SetNewPassword);

export default IndexSetNewPassword;
