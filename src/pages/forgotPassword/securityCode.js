import React, { useState } from 'react';
import AppCard from '../../components/card';
import AppInput from '../../components/input';
import AppButton from '../../components/button';
import { Row, Col, Form, Icon, Button } from 'antd';

const SecurityCode = ({ form }) => {
  const [code, setCode] = useState('');
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

  return (
    <Form onSubmit={handleSubmit}>
      <AppCard
        title={'ป้อนรหัสรักษาความปลอดภัย'}
        actions={[
          <Row>
            <Col style={{ float: 'left', paddingLeft: '25px' }}>
              <a>ยังไม่ได้รับรหัสผ่านใช่ไหม</a>
            </Col>
            <Col style={{ float: 'right', paddingRight: '22px' }}>
              {/* รอรับ API รหัสที่ป้อนใน input กับ API ที่ส่งมาตรงกันไหม ? */}
              <AppButton
                textButton={'ดำเนินการต่อ'}
                htmlType="submit"
              ></AppButton>
              <AppButton textButton={'ยกเลิก'}></AppButton>
            </Col>
          </Row>,
        ]}
      >
        <p>โปรดตรวจสอบรหัสอีเมล์ของคุณ รหัสของคุณเป็นตัวเลข 6 หลัก</p>
        <Row>
          <Col span={12}>
            <Form.Item className="form-item">
              {getFieldDecorator('code', {
                rules: [
                  {
                    required: true,
                    message: 'โปรดตรวจสอบลิงค์เปลี่ยนรหัสผ่านในอีเมลของคุณ',
                  },
                ],
              })(
                <AppInput
                  style={{ width: '100%' }}
                  // prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="ป้อนรหัส"
                  type="text"
                  name="code"
                  className="input"
                  value={code}
                />,
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <p
              style={{
                float: 'right',
                fontWeight: 'bold',
                marginBottom: '0px',
              }}
            >
              เราได้ส่งรหัสไปให้คุณที่:
            </p>{' '}
            <br />
            {/* รอรับ Email จริง */}
            <p style={{ float: 'right' }}>examble@hotmail.com</p>
          </Col>
        </Row>
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

const IndexSecurityCode = Form.create({ onFieldsChange })(SecurityCode);

export default IndexSecurityCode;
