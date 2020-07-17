import React, { uesRef } from 'react';
import { Avatar, Icon } from 'antd';
import { TimelineViews, 
  ScheduleComponent, 
  ViewsDirective, 
  ViewDirective, 
  ResourcesDirective, 
  ResourceDirective, 
  Inject,
  HeaderRowsDirective,
  HeaderRowDirective,
  DragAndDrop
} from '@syncfusion/ej2-react-schedule';
import { Internationalization, extend } from '@syncfusion/ej2-base';
import httpClient from '../../../components/axiosClient';
import moment from 'moment';
import notification from '../../../components/v2.1.0/notification';
import styled from 'styled-components';
import '../css/gantt.css';

const instance = new Internationalization();

const DivTask = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const DivTaskText = styled.div`
  margin-left: 10px;
  font-size: 14px;
`;

export default ({ dataSource, dataTask, dataDate }) => {

  console.log('dataTask : ', dataTask);
  
  const getName = (value) => {
    return value.resourceData[value.resource.textField];
  };

  const getPathImage = (value) => {
    return value.resourceData.pathImage;
  };

  const onRenderCell = (args) => {
    if (args.elementType === 'emptyCells' && args.element.classList.contains('e-resource-left-td')) {
      let target = args.element.querySelector('.e-resource-text');
      target.innerHTML = '<div style="padding: 5px 15px;"><b>Name</b></div>';
    }
  };

  const resourceHeaderTemplate = (props) => {
    const pathImage = getPathImage(props);
    return (
      <div className='template-wrap'>
        {pathImage == '' ? <Avatar className='avatar-border' icon='user' /> : <Avatar className='avatar-border' src={`${process.env.REACT_APP_IMG_HOST}` + pathImage} />}
        
        <span className='p-l-10'>{getName(props)}</span>
      </div>
    );
  };

  const getTimeString = (value) => {
    return instance.formatDate(value, { skeleton: 'Hm' });
  };

  const eventTemplate = (props) => {
    return (
      <div className="e-appointment-details" style={{ background: props.Color, orderRadius: 2 }}>
        <DivTask>
          <DivTaskText>{props.Subject}</DivTaskText>
          {/* <div className="time" >
            Time: {getTimeString(props.StartTime)} - {getTimeString(props.EndTime)}
          </div> */}
        </DivTask>
      </div>
    );
  };

  const majorSlotTemplate = (props) => {
    return (
      <div style={{ textAlign: 'center' }}>
        {instance.formatDate(props.date, { skeleton: 'Hm' })}
      </div>);
  };

  const handleDrop = async (args) => {
    const action = args.name;
    console.log('args : ', args);
    // alert();

    if(action == 'dragStop') {
      const { Id, StartTime, EndTime, ResourceId } = args.data;

      const payload = {
        tracking_id: Id,
        planed_start_date: moment(StartTime).format('YYYY-MM-DD hh:mm:ss'),
        planed_finish_date: moment(EndTime).format('YYYY-MM-DD hh:mm:ss'),
        assignee: ResourceId,
        updated_by: 1,
      };

      console.log('payload : ', payload);
      const response = await httpClient.post('/tasks/monitor/update', payload);
      if(response.status === 200) {
        notification({status: 'success', message: response.data.message});
      }
      else {
        notification({status: 'error', message: response.data.message});
      }

      console.log(response);

    }
  }

  return (
    <ScheduleComponent 
      cssClass='schedule-cell-dimension'
      // cssClass='virtual-scrolling' 
      showQuickInfo={false}
      showHeaderBar={false}
      width='100%' 
      // height='595px' 
      // cellHeight='30px'
      selectedDate={dataDate} 
      group={{ resources: ['Resources'] }} 
      timeScale={{ 
        enable: true, 
        interval: 60, 
        slotCount: 4,
        majorSlotTemplate: majorSlotTemplate
      }}
      renderCell={onRenderCell}
      resourceHeaderTemplate={resourceHeaderTemplate}
      // startHour='08:00' 
      // endHour='24:00'
      workHours={{
        highlight: true, 
        start: '00:00', 
        end: '23:59'
      }}
      rowAutoHeight={true}
      eventSettings={{ dataSource: dataTask, template: eventTemplate }}
      dragStop={handleDrop}
    >
      <HeaderRowsDirective>
        {/* <HeaderRowDirective option='Date'/> */}
        <HeaderRowDirective option='Hour'/>
      </HeaderRowsDirective>
      
      <ViewsDirective>
        <ViewDirective option='TimelineDay'/>
      </ViewsDirective>

      <ResourcesDirective>
        <ResourceDirective field='ResourceId' title='Resource' name='Resources' allowMultiple={true} textField='Text' idField='Id' colorField='Color'
          dataSource={dataSource}
        >
        </ResourceDirective>
      </ResourcesDirective>

      <Inject services={[TimelineViews, DragAndDrop]}/>
    </ScheduleComponent>
  );
}