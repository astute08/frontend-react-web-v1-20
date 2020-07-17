import React, { useState, useRef } from 'react';
import { Row, Col, Select, Avatar } from 'antd';
import moment from 'moment'
import styled from 'styled-components';
import { Week, Month, TimelineViews, TimelineMonth,
  ScheduleComponent, 
  ViewsDirective, 
  ViewDirective, 
  ResourcesDirective, 
  ResourceDirective, 
  Inject,
  HeaderRowsDirective,
  HeaderRowDirective
} from '@syncfusion/ej2-react-schedule';
import { Internationalization, extend } from '@syncfusion/ej2-base';
import _ from 'lodash';
import AddingShift from './modalShift';

const instance = new Internationalization();

const years = [2021, 2020, 2019, 2018, 2017];
const months = moment.months();

const DivFilter = styled.div`
  padding-left: 24px;
`;

const DivHeaderDay = styled.div`
  width: 100%;
  text-align: center;
  background-color: #F5F5F5;
  padding: 5px;
`;

const TextHeaderDay = styled.p`
  padding: 0;
  margin: 0;
`;

const { Option } = Select;

export default (props) => {
  console.log('View : ', props)
  const { members } = props;
  const scheduleObj = useRef();
  const [thisDay, setThisDay] = useState(moment().date());
  const [thisMonth, setThisMonth] = useState(moment().month());
  const [thisYear, setThisYear] = useState(moment().year());
  const [visible, setVisible] = useState(false);
  const [memberProfile, setMemberProfile] = useState([]);

  const listMonths = months.map((month, index) => <Option key={index} value={index}>{month}</Option>);

  const listYear = years.map((year, index) => <Option key={index} value={year}>{year}</Option>);

  const listMember = members.map((object, index) => {
    return {
      Id: object.mem_org_id,
      Text: object.fullname,
      pathImage: object.profile_img
    };
  });

  const handleCancel = () => {
    setVisible(false);
  };

  const handleChangeMonth = (value) => {
    setThisMonth(value);
  };

  const handleChangeYear = (value) => {
    setThisYear(value);
  };

  const onRenderCell = (args) => {
    if (args.elementType === 'emptyCells' && args.element.classList.contains('e-resource-left-td')) {
      let target = args.element.querySelector('.e-resource-text');
      target.innerHTML = '<div style="padding: 5px 15px;"><b>Resources (' + members.length + ')</b></div>';
    }
  };

  const resourceHeaderTemplate = (props) => {
    const pathImage = getPathImage(props);
    return (
      <div className='template-wrap'>
        {/* {pathImage == '' ? <Avatar className='avatar-border' icon='user' /> : <Avatar className='avatar-border' src={`http://192.168.11.181:8200${pathImage}`} />} */}
        {pathImage == '' ? <Avatar className='avatar-border' icon='user' /> : <Avatar className='avatar-border' src={`${process.env.REACT_APP_URL_MANAGER_ADD_PORT}` + pathImage} />}
        <span className='p-l-10'>{getName(props)}</span>
      </div>
    );
  };

  const dateTemplate = (props) => {
    return (
      <DivHeaderDay ><TextHeaderDay>{getDateHeaderText(props.date)}</TextHeaderDay><TextHeaderDay>{getDateHeaderUnderText(props.date)}</TextHeaderDay></DivHeaderDay>
    );
  };

  const getDateHeaderText = (value) => {
    return instance.formatDate(value, { skeleton: 'E' }).toUpperCase();
  };

  const getDateHeaderUnderText = (value) => {
    return instance.formatDate(value, { skeleton: 'd' });
  };

  const getPathImage = (value) => {
    return value.resourceData.pathImage;
  };

  const getName = (value) => {
    return value.resourceData[value.resource.textField];
  };

  const onPopupOpen = (args) => {
    console.log(args);
    args.cancel = true;
    const memberDetail = _.findIndex(members, { 'mem_org_id': args.data.ResourceId });
    console.log('memberDetail : ', members[0]);
    setMemberProfile([
      {
        "id": members[memberDetail].mem_org_id,
        "fullname": members[memberDetail].fullname,
        "email": members[memberDetail].email,
        "phone": members[memberDetail].phone
      }
    ]);
    setVisible(true);
  }

  const editorTemplate = (props) => {
    return false;
  };

  return (
    <div>
      <Row gutter={[8, 24]}>
        <Col span={24}>
          <DivFilter>
            <Select defaultValue={thisMonth} value={thisMonth} style={{ width: 160 }} onChange={handleChangeMonth} >
              {listMonths}
            </Select>
            <Select defaultValue={thisYear} value={thisYear} style={{ width: 160 }} onChange={handleChangeYear} >
              {listYear}
            </Select>
          </DivFilter>
        </Col>
      </Row>
      <Row gutter={[8, 24]}>
        <Col span={24}>
          <ScheduleComponent width='100%' selectedDate={new Date(thisYear, thisMonth, thisDay)} 
            ref={scheduleObj}
            cssClass='schedule-cell-dimension-shift'
            dateHeaderTemplate={dateTemplate}
            group={{ resources: ['Resources'] }} 
            renderCell={onRenderCell}
            resourceHeaderTemplate={resourceHeaderTemplate}
            showHeaderBar={false} 
            showQuickInfo={true}
            editorTemplate={editorTemplate}
            popupOpen={onPopupOpen} 
            workDays={[0, 1, 2, 3, 4, 5, 6]} >
                    
            <ViewsDirective>
              <ViewDirective option='TimelineMonth'/>
            </ViewsDirective>

            <ResourcesDirective>
              <ResourceDirective field='ResourceId' title='Resource' name='Resources' allowMultiple={true} textField='Text' idField='Id' colorField='Color'
                dataSource={listMember}
              >
              </ResourceDirective>
            </ResourcesDirective>

            <Inject services={[TimelineMonth]}/>
          </ScheduleComponent>
        </Col>
      </Row>
      
      {/* <AddingShift visible={visible} onCancel={handleCancel} onCreate={() => { console.log(1) }} 
        memberProfile={memberProfile}

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
      /> */}
    </div>
  );
}