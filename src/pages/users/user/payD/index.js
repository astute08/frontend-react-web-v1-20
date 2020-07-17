import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Tabs, DatePicker, Badge } from 'antd';
// import client from '../../../../components/axiosClient';
import HttpClient from "../../../../components/httpClient";

import _ from 'lodash';
import moment from 'moment';
import axios from 'axios'
import PaydSummary from './paydSummary';
import PaydMyHours from './paydMyHours';
import PaydStatement from './paydStatement';
import './../css/payD.css';
import './css/index.css';

const client = HttpClient();

const { TabPane } = Tabs;
const pageCode = '001';

export default (props) => {
  const param = useParams();
  const userId = param.user_id;
  const memComId = props.memComId;
  const tokenKey = localStorage.getItem('tokenKey');
  const paydSummary = _.get(props, 'paydSource.data.PayDSummary');
  const defaultStatement = _.get(props, 'paydSource.data.PayDStatement');
  const overall = _.get(props, 'paydSource.data.PayDSummary.memClassAmount');
  const labelShow = props.labelShow;
  // const langValue = props.langValue;

  console.log("userId*****", userId);

  const [statement, setStatement] = useState();

  useEffect(() => {
    setStatement(defaultStatement);
  }, [defaultStatement]);

  const callback = (key) => {
    // console.log('callback::++', key);
  }

  const onSelectDate = async (selected) => {
    const dateData = moment(selected).format("YYYY-MM-DD");
    const url = `${process.env.REACT_APP_URL_MANAGER}`;
    const port = `${process.env.REACT_APP_RESOURCE_MANAGER_PORT}`;
    client.defaults.baseURL = `${url}:${port}`;
    try {
      const result = await client.get(`/payd-statements/${dateData}/members/${userId}`);
      console.log('result::: ', result);
      setStatement(result.data);
    } catch {
      console.error();
    }

  }

  const formatNumber = (num) => {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  }

  return (
    <Tabs className="tabs" size={'large'} defaultActiveKey="1" onChange={callback} >
      <TabPane  tab={labelShow.PayDSummary ? labelShow.PayDSummary : "PayD Summary"} key="1" className='content-tabs-summary'>
        <PaydSummary paydSummary={paydSummary} formatNumber={formatNumber} labelShow={labelShow} />
      </TabPane>
      <TabPane  tab={labelShow.lStatement ? labelShow.lStatement : "Statement"} key="2" className='content-tabs-statement'>
        <PaydStatement statement={statement} overall={overall} onSelectDate={onSelectDate} formatNumber={formatNumber} labelShow={labelShow} />
      </TabPane>
      <TabPane  tab={labelShow.MyHours ? labelShow.MyHours : "Hours"} key="3" className='content-tabs-myHours' >
        <PaydMyHours memComId={memComId} userId={userId} labelShow={labelShow} />
      </TabPane>
      {/* <TabPane  tab={<Badge className='request-badge' count={2}><div>{labelShow.lRequest ? labelShow.lRequest : "Request"}</div></Badge>} key="4" className='content-tabs' >
        Request
      </TabPane> */}
    </Tabs>
  )
}