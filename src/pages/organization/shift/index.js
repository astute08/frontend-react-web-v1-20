import React, { useState, useEffect, useCallback } from 'react';
import HttpClient from '../../../components/httpClient';
import _ from 'lodash';
import ModalShift from './modalShift';
import './css/shift.css';
import { Button, Modal, Row, Col, Avatar, Icon, List, DatePicker, Form, Select } from 'antd';

const client = HttpClient();
const { MonthPicker, RangePicker } = DatePicker;
const { Option } = Select;

export default (props) => {
  console.log('shift ::** ', props);
  
  const checkShowModal = true;

  // เมื่อมี props เข้ามาสามารถเปิดใช้ได้
  // const shiftType = _.get(props, 'shiftType');
  // const memberProfile = _.get(props, 'memberProfile');

  const [visible, setVisible] = useState(false);
  const [formRef, setFormRef] = useState(null);

  useEffect(() => {
    showModal();
  }, []);

  const showModal = () => {
    if (checkShowModal === true) {
      setVisible(true);
    } else {
      setVisible(false);
    } 
  };

  const handleSubmit = async (e) => {
    formRef.validateFields(async (err, values) => {
      // console.log('fieldsValue:::', values);
      if (err) {
        return
      }
      // Should format date value before submit.
      const rangeValue = values['range-picker'];
      const fieldsValue = {
        ...values,
        'rangePicker': [rangeValue[0].format('YYYY/MM/DD'), rangeValue[1].format('YYYY/MM/DD')],
      };
      console.log('Received values of form: ', fieldsValue);

      // ************************ ยิง AIP ************************
      // try {
      //   const body = {
      //     "comId": 0,
      //     "orgId": 0,
      //     "memId": 0,
      //     "memOrgId": 0,
      //     "shiftId": `${fieldsValue.selectShift}`,
      //     "to": `${fieldsValue.rangePicker[0]}`,
      //     "from": `${fieldsValue.rangePicker[1]}`
      //   }
      //   const result = await client.post('/v2/organization/contacts/create', body);
      //   console.log('result shift: ', result);
      //   formRef.resetFields();
      // } catch (error) {
      //   console.log(error);
      // }

      formRef.resetFields(); //เมื่อเปิด comment ยิง API !!! ให้ปิดบรรทัดนี้ 
      setVisible(false);
    });
  };

  const handleCancel = (e) => {
    console.log(e);
    formRef.validateFields((err, values) => {
      if (err) {
        return;
      }
      // console.log("Received values of form: ", values);
      formRef.resetFields();
    })
    formRef.resetFields();
    setVisible(false);
  };

  const saveFormRef = useCallback((node) => {
    if (node !== null) {
      setFormRef(node);
    }
  }, []);
  
  return(
    <>
      <Button type="primary" onClick={showModal}>show modal</Button>
      <ModalShift 
        ref={saveFormRef}
        visible={visible}
        onCancel={() => handleCancel()}
        onCreate={() => handleSubmit()}

        // Mock data memberProfile && onShiftType
        memberProfile={
          [
            {
              "fullname": "Kittichai Potawee",
              "email": "tae@kgcorp.com",
              "phone": "-"
            }
          ]
        }
        onShiftType={
          [
            {
              "shift_id": 2,
              "com_id": 1,
              "name": "gg",
              "start": "08:00:00.000000",
              "finish": "17:00:00.000000",
              "description": "test",
              "created_at": null,
              "created_by": 20,
              "updated_at": "2020-05-05T20:03:56.000Z",
              "updated_by": null,
              "deleted": 0
            }
          ]
        }
      />
    </>
  )
}