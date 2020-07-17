import React, {useState, useEffect} from 'react';
import { Row, Col, DatePicker, Table, ConfigProvider } from 'antd';
import AppTable from '../../../../components/v2/table';
import HttpClient from '../../../../components/httpClient';
import './css/paydMyHours.css';
import axios from 'axios';
import moment from 'moment';

import enUS from 'antd/es/locale/en_US';
import thTH from 'antd/es/locale/th_TH';
import 'moment/locale/th';
moment.locale('en');

const client = HttpClient();
const { MonthPicker } = DatePicker;


export default ({ memComId, userId, labelShow }) => {

  const langValue = localStorage.getItem('langValue');


  // console.log('langValue:: ', langValue);

  const monthFormat = 'MMMM YYYY';
  const date = moment().format('YYYY-MM-DD');
  const today = new Date();   
  const tokenKey = localStorage.getItem('tokenKey');
  const [dataMyHours, setDataMyHours] = useState([]);
  const [total, setTotal] = useState();
  const [actual, setActual] = useState();
  const [capacity, setCapasity] = useState();
  const [utilization, setUtilization] = useState();
  const [colorActual, setColorActual] = useState();
  const [locale, setLocale] = useState('enUS');


  // console.log('memComId*: ', memComId);
  // console.log('locale****: ', locale);

  const columns = [
    {
      title: labelShow.timeAttendance ? labelShow.timeAttendance : "Time Attendance",
      dataIndex: 'timeAttendace',
      key: 'timeAttendace',
    },
    {
      title: labelShow.lActual ? labelShow.lActual : "Actual",
      dataIndex: 'actual',
      key: 'actual',
      render: ((text, record, index) => 
        <p style={{color: `${record.color}`, margin: '0px'}}>{record.actual}</p>
      )
    },
  ];

  useEffect(() => {
    loadMyHours();
    changeLocale();
  }, []);


  const loadMyHours = async () => {

    const url = `${process.env.REACT_APP_URL_MANAGER}`;
    const port = `${process.env.REACT_APP_RESOURCE_MANAGER_PORT}`;
    client.defaults.baseURL = `${url}:${port}`;

    // axios({
    //   method: 'get',
    //   url: `http://192.168.11.181:8203/companies/members/${userId}/times-sheet/on-month/${date}`,
    //   headers: {
    //     'accesstoken': `${tokenKey}`,
    //   },
    // }).then(response => {
    //   // console.log("response: ", response);
    //   setDataMyHours(response.data.timesLists);
    //   setTotal(response.data.total);
    //   setActual(response.data.actual);
    //   setCapasity(response.data.capacity);
    //   setUtilization(response.data.utilization);
    // }).catch(err => {
    //   console.error(err);
    // }) 

    try {
      const response = await client.get(`/companies/members/${userId}/times-sheet/on-month/${date}`);
      // console.log("response: ", response);
      setDataMyHours(response.data.timesLists);
      setTotal(response.data.total);
      setActual(response.data.actual);
      setCapasity(response.data.capacity);
      setUtilization(response.data.utilization);
    } catch {
      console.error();
    }



  }

  const onSelectDate = async (selected) => {
    // console.log("selected+++++: ", selected);
    const dateData = moment(selected).format("YYYY-MM-DD");

    const url = `${process.env.REACT_APP_URL_MANAGER}`;
    const port = `${process.env.REACT_APP_RESOURCE_MANAGER_PORT}`;
    client.defaults.baseURL = `${url}:${port}`;

    // axios({
    //   method: 'get',
    //   url: `http://192.168.11.181:8203/companies/members/${userId}/times-sheet/on-month/${dateData}`,
    //   headers: {
    //     'accesstoken': `${tokenKey}`,
    //   },
    // }).then(response => {
    //   // console.log("response+++++: ", response);
    //   setDataMyHours(response.data.timesLists);
    //   setTotal(response.data.total);
    //   setActual(response.data.actual);
    //   setCapasity(response.data.capacity);
    //   setUtilization(response.data.utilization);
    // }).catch(err => {
    //   console.error(err)
    // })
    
    try {
      const response = await client.get(`/companies/members/${userId}/times-sheet/on-month/${dateData}`);
      //   console.log("response+++++: ", response);
      setDataMyHours(response.data.timesLists);
      setTotal(response.data.total);
      setActual(response.data.actual);
      setCapasity(response.data.capacity);
      setUtilization(response.data.utilization);
    } catch {
      console.error();
    }
  }

  const disabledDate = (current) => {
    return current && current > moment().endOf('day');
  }

  const showTotal = (total) => {
    return (
        <span>{labelShow.pageSize ? labelShow.pageSize : 'Rows per page: '}</span>
    );
  };

  const changeLocale = () => {
    // let codeLang = langValue ? langValue : 'EN';
    let codeLang = langValue === 'undefined' ? 'EN' : langValue;
    let changeLang = codeLang === 'EN' ? enUS : thTH;

    setLocale(changeLang);
    if (!changeLang) {
      moment.locale('en');
    } else {
      moment.locale('th-th');
    }
  };

  const Page = ({ req }) => {
    return (
        // <MonthPicker className='monthPicker-date' size='large' />
        <div>
          {req ? 
            <MonthPicker
              className='monthPicker-date'
              size='large'
              format={monthFormat}
              bordered={false}
              defaultValue={moment(today, monthFormat)}
              onChange={onSelectDate}
              allowClear={false}
              disabledDate={disabledDate}
            /> : null
          }
        </div>
    )
  }

  return (
    <div className="payd-MyHours">
      <Row className="month-row">
        <ConfigProvider locale={locale}>
          <MonthPicker
            key={locale ? locale.locale : 'en'}
            className='monthPicker-date'
            size='large'
            format={monthFormat}
            bordered={false}
            defaultValue={moment(today, monthFormat)}
            onChange={onSelectDate}
            allowClear={false}
            disabledDate={disabledDate}
          />
        </ConfigProvider>
      </Row>
      <Row className="details-myHours">
        <Col span={8} className="details-capacity">
          <p>{labelShow.lCapacity ? labelShow.lCapacity : "Capacity"}</p>
          <p className="font-p">{`${capacity || 0}`}</p>
        </Col>
        <Col span={8} className="details-actual">
          <p>{labelShow.lActual ? labelShow.lActual : "Actual"}</p>
          <p className="font-p">{`${actual || 0}`}</p>
        </Col>
        <Col span={8} className="details-utilization">
          <p>{labelShow.lUtilization ? labelShow.lUtilization : "Utilization"}</p>
          <p className="font-p">{`${utilization  || 0} %`}</p>
        </Col>
      </Row>
      <Table
        className="table-myHours"
        size={'middle'}
        columns={columns} 
        dataSource={dataMyHours} 
        pagination={{
          total: total,
          showTotal: showTotal,
          defaultCurrent: 1,
          pageSizeOptions: ['2', '4', '8', '10'],
          showSizeChanger: true,
          locale: { items_per_page: '' },
        }}
      />
      <div style={{display: 'flex', position: 'relative', marginTop: '-37px'}}>
          <span>
              {labelShow.total ? labelShow.total : 'Total'}
              {` ${total} `}
              {labelShow.items ? labelShow.items : 'items'}
          </span>
      </div>
    </div>
  )
}