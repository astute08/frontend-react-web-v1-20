import React, { useState, useEffect } from 'react';
import { Row, Col, DatePicker, Icon, Input, Select } from 'antd';
import HttpClient from '../../../components/axiosClient';
import SelectOrganization from './selectOrganization';
import Gantt from './gantt';
import Helper from '../../../modules/helper';
import moment from 'moment';

const InputGroup = Input.Group;
const { Option } = Select;

const helper = new Helper();
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;

export default (props) => {

  const comId = 1;
  const [orgId, setOrgId] = useState(3);
  const [treeData, setTreeData] = useState([]);
  const [resource, setResource] = useState([]);
  const [task, setTask] = useState([]);
  const [selected, setSelected] = useState();
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    getOrganization();
    getResource();
    getTask();
  }, []);

  const getResource = async (args) => {
    const newData = [];
    if(args) {
      try {
        const response = await HttpClient.get(`v2/resource/organization/${args}`);
        if(response.status === 200) {
          console.log('getResource v2/resource/organization/ : ', response.data);
          let data = [...response.data];
          data.forEach(element => {
            newData.push({
              Id: element.mem_com_id,
              Text: element.name + ' ' + element.lastname,
              pathImage: element.profile_img,
              // Color: '#7499e1' 
            });
          });
        }
      }
      catch (error) {
        console.log(error);
      }
    }
    else {
      const response = await HttpClient.get(`/v2/users/${comId}`);
      if(response.status === 200) {
        console.log('getResource /v2/users/ : ', response);
        let data = [...response.data];
        data.forEach(element => {
          newData.push({
            Id: element.mem_com_id,
            Text: element.name + ' ' + element.lastname,
            pathImage: element.profile_img,
            // Color: '#7499e1' 
          });
        });
      }
    }
    setResource(newData);
  };

  const getTask = async () => {
    const newData = [];
    try {
      const body = {
        com_code: comId,
        org_code: orgId,
        language: 'ENG',
        search: [
          // { key: 'planed_start_date', val: ['2020-04-16', '2020-04-16'], type: 'date' }
        ]
      };
      const response = await HttpClient.post('/tasks/monitor', body);
      console.log('getTask', response);
      if(response.status === 200) {
        let data = [...response.data.data.list];
        data.forEach(element => {
          newData.push({
            Id: element.tracking_id,
            Subject: element.tracking_id,
            StartTime: moment(element.planed_start_date).format('YYYY-MM-DD HH:mm'),
            EndTime: moment(element.planed_finish_date).format('YYYY-MM-DD HH:mm'),
            Color: element.status_code.color,
            ResourceId: element.assignee.assignee
          });
        });
      }
    }
    catch (error) {
      console.log(error);
    }
    setTask(newData);
  };

  const getOrganization = async () => {
    const body = {
      com_id: comId,
      // org_id: orgId,
      search_team: {
        name: '',
      },
      members: {
        conditional: [],
        order: 'fullname ASC',
        limit: '10',
        index_page: '1',
      },
      services: {},
      shift: {},
    };

    
    try {
      const response = await HttpClient.post('/v2/organizationdetails', body);
      console.log(response);
      if(response.status === 200) {
        const treeData = [...response.data.treeTeams];
        const newTreeData = helper.setSelectOrganization(treeData);
        // const newData = helper.setOrganizationData(treeData);
        setTreeData(newTreeData);
      }
    }
    catch (error) {
      console.log(error);
    }
  };

  const handlerChangeSelected = (value) => {
    setTimeout(function(){
      getResource(value);
    }, 500);
    
  };

  const handlerChangeDate = (dateMoment, dateString) => {
    const date = moment().format('YYYY-MM-DD'); 
    setDate(date ? date : new Date());
  };

  const dateFormatList = 'DD/MM/YYYY';

  return (
    <div>
      <Row type="flex" justify="space-between" className='p-10'>
        <Col span={8}>
          <InputGroup compact>
            <Input
              placeholder="Search"
              prefix={<Icon type="search" style={{ color: 'rgba(0,0,0,.25)' }} />}
              style={{
                  width: '70%'
              }}
            />
            <Select style={{ width: '30%' }} defaultValue="Task ID">
              <Option value="taskID">Task ID</Option>
            </Select>
        </InputGroup>
        </Col>
        <Col span={4}></Col>
        <Col span={4}></Col>
        <Col span={4} style={{ textAlign: 'right' }}>
          {/* <DatePicker defaultValue={moment(date, 'YYYY-MM-DD')} onChange={handlerChangeDate} /> */}
          <DatePicker className="date-picker" defaultValue={moment(date, dateFormatList)} format={dateFormatList} onChange={handlerChangeDate} />
        </Col>
        <Col span={4}>
          <SelectOrganization dataSource={treeData} onChange={handlerChangeSelected} />
        </Col>
      </Row>
      <Row type="flex" justify="start">
        <Col span={24}>
          <Gantt dataSource={resource} dataTask={task} dataDate={date} />
        </Col>
      </Row>
      
    </div>
  );
}