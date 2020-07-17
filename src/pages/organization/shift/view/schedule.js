import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { Avatar, Icon } from 'antd';
import { TimelineMonth,
  ScheduleComponent, 
  ViewsDirective, 
  ViewDirective, 
  ResourcesDirective, 
  ResourceDirective, 
  Inject,
  HeaderRowsDirective,
  HeaderRowDirective
} from '@syncfusion/ej2-react-schedule';
import { Internationalization, isNullOrUndefined } from '@syncfusion/ej2-base';
import { DropDownListComponent, MultiSelectComponent } from '@syncfusion/ej2-react-dropdowns';
import { DateRangePickerComponent } from '@syncfusion/ej2-react-calendars';
import styled from 'styled-components';
import httpClient from '../../../../components/axiosClient';
import Provider from '../../provider';
import notification from '../../../../components/v2.1.0/notification';
import moment from 'moment';

const instance = new Internationalization();

const CustomDateHeader = styled.div`
  width: 100%;
  text-align: center;
  background-color: #F5F5F5;
  padding: 5px;
`;

const CustomDateHeaderText = styled.p`
  padding: 0;
  margin: 0;
`;

export default (props) => {
  // console.log('schedule : ', props);
  const app = Provider.useAppContext();
  const { day, month, year, resources, resourcesArr, handleClickPopupOpen, shifts } = props;
  const [shiftType, setShiftType] = useState([]);

//   const shifts = [{
//     Color: "#0000",
// EndTime: "2020-05-15 00:00",
// Id: 103,
// IsAllDay: true,
// ResourceId: 51,
// StartTime: "2020-05-15 00:00",
// Subject: "gg"
//   }];

  // console.log(shifts);

  useEffect(() => {

    const getShiftType = async () => {
      try {
        const response = await httpClient.get(`/companies/${app.state.comId}/shift-types`);
        console.log('getShiftType : ', response);
        if(response.status === 200) {
          setShiftType(response.data);
        }
      }
      catch (error) {
        console.log(error);
      }
      
    };

    getShiftType();

  }, []);

  

  const customDateHeaderTemplate = (props) => {
    const { date } = props;
    return (
      <CustomDateHeader>
        <CustomDateHeaderText>{getDateHeaderText(date)}</CustomDateHeaderText>
        <CustomDateHeaderText>{getDateHeaderTextUnder(date)}</CustomDateHeaderText>
      </CustomDateHeader>
    );
  };

  const customRenderCell = (args) => {
    if (args.elementType === 'emptyCells' && args.element.classList.contains('e-resource-left-td')) {
      let target = args.element.querySelector('.e-resource-text');
      target.innerHTML = '<div style="padding: 5px 15px;"><b>Resources (' + resources.length + ')</b></div>';
    }
  };

  const customResourceHeaderTemplate = (props) => {
    const pathImage = getPathImage(props);
    return (
      <div className='template-wrap'>
        {pathImage == '' ? <Avatar className='avatar-border' icon='user' /> : <Avatar className='avatar-border' src={`${process.env.REACT_APP_IMG_HOST}` + pathImage} />}
        <span className='p-l-10'>{getName(props)}</span>
      </div>
    );
  };

  const getPathImage = (value) => {
    return value.resourceData.pathImage;
  };

  const getName = (value) => {
    return value.resourceData[value.resource.textField];
  };

  const getDateHeaderText = (val) => {
    return instance.formatDate(val, { skeleton: 'E' }).toUpperCase();
  };

  const getDateHeaderTextUnder = (val) => {
    return instance.formatDate(val, { skeleton: 'd' });
  };

  const handlePopupOpen = (args) => {
    
    if (args.type === 'Editor') {
      let statusElement = args.element.querySelector('#EventType');
      statusElement.setAttribute('name', 'EventType');
      if (!isNullOrUndefined(document.getElementById("EventType_Error"))) {
          document.getElementById("EventType_Error").style.display = "none";
          // document.getElementById("EventType_Error").style.left = "651px";
      }
      let formElement = args.element.querySelector('.e-schedule-form');
      let validator = formElement.ej2_instances[0];
      validator.addRules('EventType', { required: true });
      validator.addRules('DateRange', { required: true });

    }
  };

  const handlePopupClose = async (args) => {
    if (args.type === 'Editor') {
      if(args.data) {
        console.log('handlePopupClose : ', args.data);
        console.log('shiftType : ', shiftType);
        const resourceIndex = _.findIndex(resources, function(o) { return o.Id === parseInt(args.data.ResourceId); });
        const resourceDetail = {...resourcesArr[resourceIndex]};
        
        const dateArr = args.data.DateRange.split(' - ');
        const dateToArr = dateArr[0].split('/');
        const dateFromArr = dateArr[1].split('/');

        const shiftIndex = _.findIndex(shiftType, function(o) { return o.name === args.data.EventType; });
        const shiftDetail = shiftType[shiftIndex];
        
        try {
          const payload = {
            comId: app.state.comId,
            orgId: app.state.orgId,
            memId: resourceDetail.mem_id,
            memOrgId: resourceDetail.mem_org_id,
            shiftId: shiftDetail.shift_id,
            from: dateToArr[2] + '-' + dateToArr[1] + '-' + dateToArr[0],
            to: dateFromArr[2] + '-' + dateFromArr[1] + '-' + dateFromArr[0]
          }

          const response = await httpClient.post('members-shifts', payload);
          console.log(response);
          if(response.status === 200) {
            notification({ status: 'success', message: 'message'});

            if(_.isArray(response.data)) {
              app.fnc.getRefresh();
            }
          }
          else {

          }
        }
        catch(error) {
          console.log(error);
        }

      }
    }
  };

  const editorTemplate = (props) => {

    // console.log('editorTemplate : ', props);
    const { ResourceId, StartTime, EndTime } = props;
    const resourceIndex = _.findIndex(resources, function(o) { return o.Id === ResourceId; });
    const resourceDetail = {...resourcesArr[resourceIndex]};

    return (
      <div>
        <table className="custom-event-editor" style={{ width: '100%', cellpadding: '5' }}>
          <tbody>
            <tr>
              <td colSpan={6}>
                <Avatar size={130} src={`${process.env.REACT_APP_IMG_HOST}` + resourceDetail.profile_img} />
              </td>
            </tr>
            <tr>
              <td colSpan={6}>
                <h2>{resourceDetail.fullname}</h2>
              </td>
            </tr>
            <tr>
              <td className="e-textlabel">
                <Icon type="mail" />   
              </td>
              <td colSpan={4}>
                {resourceDetail.email}
              </td>
            </tr>
            <tr>
              <td className="e-textlabel">
                <Icon type="phone" />   
              </td>
              <td colSpan={4}>
                {resourceDetail.phone}
              </td>
            </tr>
            <tr>
              <td className="e-textlabel">
                <Icon type="calendar" />   
              </td>
              <td colSpan={4}>
                <DateRangePickerComponent 
                  id="DateRange" 
                  placeholder='Select a range' 
                  data-name="DateRange" 
                  className="e-field" 
                  format='dd/MM/yyyy' 
                  startDate={StartTime} 
                  endDate={StartTime}
                  required={true} />
              </td>
            </tr>
            <tr>
              <td className="e-textlabel">
                <Icon type="menu" />   
              </td>
              <td colSpan={4}>
                <DropDownListComponent 
                  id="EventType" 
                  placeholder='Choose status' 
                  data-name="EventType" 
                  className="e-field" 
                  style={{ width: '100%' }} 
                  dataSource={shiftType.map((element) => element.name)} 
                  value={props.EventType || null}
                  required={true}>
                </DropDownListComponent>
              </td>
            </tr>
          </tbody>
        </table>
        <input type='hidden' className="e-field" id='ResourceId' name='ResourceId' defaultValue={ResourceId} value={ResourceId} />
      </div>
    );
  }

  return (
    <div>
      <ScheduleComponent 
        width='100%' 
        cssClass='schedule-cell-dimension-shift'
        selectedDate={new Date(year, month, day)} 
        showHeaderBar={false} 
        showQuickInfo={false}
        rowAutoHeight={true}
        workDays={[0, 1, 2, 3, 4, 5, 6]} 
        group={{ resources: ['Resources'] }} 
        // dateHeaderTemplate={customDateHeaderTemplate}
        renderCell={customRenderCell}
        resourceHeaderTemplate={customResourceHeaderTemplate}
        popupOpen={handlePopupOpen} 
        popupClose={handlePopupClose}
        editorTemplate={editorTemplate}
        eventSettings={{ dataSource: shifts }}
        >
                
        <ViewsDirective>
          <ViewDirective option='TimelineMonth'/>
        </ViewsDirective>

        <ResourcesDirective>
          <ResourceDirective 
            field='ResourceId' 
            title='Resource' 
            name='Resources' 
            allowMultiple={true} 
            textField='Text' 
            idField='Id' 
            colorField='Color'
            dataSource={resources}
          >
          </ResourceDirective>
        </ResourcesDirective>

        <Inject services={[TimelineMonth]}/>
      </ScheduleComponent>
    </div>
  );
}