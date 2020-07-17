import React, { useState } from 'react';
import { Row, Col } from 'antd';
import moment from 'moment';
import Filter from './filter';
import Schedule from './schedule';
import FormShift from '../modalShift';

export default (props) => {
  
  const { resources, shifts } = props;

  const [day, setDay] = useState(moment().format('DD'));
  const [month, setMonth] = useState(moment().format('MMMM'));
  const [year, setYear] = useState(moment().format('YYYY'));
  const [visible, setVisible] = useState(false);

  const list = resources.map((object) => {
    const { mem_org_id, fullname, profile_img } = object;

    return {
      Id: mem_org_id,
      Text: fullname,
      pathImage: profile_img
    };
  });

  const shiftsArr = [];
  shifts.forEach((object) => {
    object.shifts.forEach((element) => {
      const { mem_shift_id, shift_name, shift_date, mem_id, mem_org_id } = element;
      shiftsArr.push({
        Id: mem_shift_id,
        Subject: shift_name,
        StartTime: moment(shift_date).format('YYYY-MM-DD HH:mm'),
        EndTime: moment(shift_date).format('YYYY-MM-DD HH:mm'),
        Color: '#0000',
        ResourceId: mem_org_id,
        IsAllDay: true
      });
    });
  });

  // const listShifts = shifts.map((object) => {
  //   object.shifts.map((element) => {
  //     const { mem_shift_id, shift_name, shift_date, mem_id } = element;
  //     shiftsArr.push({
  //       Id: mem_shift_id,
  //       Subject: shift_name,
  //       StartTime: moment(shift_date).format('YYYY-MM-DD HH:mm'),
  //       EndTime: moment(shift_date).format('YYYY-MM-DD HH:mm'),
  //       Color: '#0000',
  //       ResourceId: 52,
  //       IsAllDay: true
  //     });
  //   });
  // });

  // console.log('shiftsArr : ', shiftsArr);

  const handleChangeMonth = (val) => {
    setMonth(val);
  };

  const handleChangeYear = (val) => {
    setYear(val);
  };

  const handleClickPopupOpen = (val) => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  return (
    <div>
      <Row gutter={[8, 8]}>
        <Col span={24} >
          <Filter 
            month={month} 
            onChangeMonth={handleChangeMonth} 
            year={year}
            onChangeYear={handleChangeYear} />
        </Col>
      </Row>
      <Row gutter={[8, 8]}>
        <Col span={24} >
          <Schedule 
            day={parseInt(day)}
            month={parseInt(moment().month(month).format('MM') - 1)} 
            year={parseInt(year)} 
            resources={list} 
            resourcesArr={resources}
            handleClickPopupOpen={handleClickPopupOpen}
            shifts={shiftsArr}
            />
        </Col>
      </Row>

      <FormShift 
        // ref={saveFormRef}
        visible={visible}
        onCancel={() => handleCancel()}
        // onCreate={() => handleSubmit()}

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
    </div>
  );
}