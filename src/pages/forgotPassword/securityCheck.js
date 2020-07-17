import React, { useState } from 'react';
import AppCard from '../../components/card';
import AppButton from '../../components/button';
import { Row, Col, Form, Icon, Button } from 'antd';

const SecurityCheck = ({ form }) => {
  // const { getFieldDecorator, validateFields } = form;

  // ใช้กับหน้า form ทั้งหมด เพื่อ validate form
  const handleSubmit = (e) => {
    // e.preventDefault();
    // validateFields((err, values) => {
    //     if (!err) {
    //         console.log('Received values of form: ', values);
    //     }
    // });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <AppCard
        title={'การตรวจสอบความปลอดภัย'}
        actions={[
          <Row>
            <Col style={{ float: 'right', paddingRight: '22px' }}>
              <AppButton textButton={'ส่ง'} htmlType="submit"></AppButton>
              <AppButton textButton={'ยกเลิก'}></AppButton>
            </Col>
          </Row>,
        ]}
      >
        <p>!!!! รอข้อความอธิบาย 'การตรวจสอบความปลอดภัย' !!!</p>
        <a>ทำไมฉันจึงเห็นสิ่งนี้</a>
      </AppCard>
    </Form>
  );
};

export default SecurityCheck;
