import React, { useState, useEffect } from 'react';
import { Row, Col, DatePicker, ConfigProvider} from 'antd';
import moment from 'moment';
import StatementTable from './statementTable';
import '../css/paydStatement.css';
import Item from 'antd/lib/list/Item';
import HttpClient from '../../../../components/httpClient';
import axios from 'axios'

import enUS from 'antd/es/locale/en_US';
import thTH from 'antd/es/locale/th_TH';
import 'moment/locale/th';
moment.locale('en');

const client = HttpClient();

const { MonthPicker } = DatePicker;

export default ({ statement, overall, onSelectDate, formatNumber, labelShow }) => {

  const langValue = localStorage.getItem('langValue');
  const [locale, setLocale] = useState('enUS');

  console.log('langValue**** ', langValue);

  const weeks = Object.values(statement.weeks);
  const withDrawRate = statement.withDrawRate || '0';
  const totalWithDraw = statement.totalWithDraw || '';
  const summaryBy = statement.summaryBy || '-';
  const monthFormat = 'MMMM YYYY';

  useEffect(() => {
    changeLocale();
  }, []);

  const progressBar = weeks.map((amount, index) => {
    const perWithdraw = ((amount / `${overall}`) * 100);
    // console.log('perWithdraw**** ', perWithdraw);
    const color = perWithdraw === 0 ? '#fff' : '#fe6202';
    const checkZero = perWithdraw === 0 ? 0 : perWithdraw;

    return (
      <div key={index}>
        <Row className="progress-row">
          {/* <Col className="span-col" span={1.9}>
            <span>{labelShow.lWeek ? labelShow.lWeek : "Week"} {index + 1}</span>
          </Col> */}
          <Col className="progress-col" span={12}>
            {/* <div style={{ width: `${perWithdraw * 35}px`, display: 'flex', alignItems: 'center', justifyContent: 'right' }}> */}
              {/* <Progress className='payd-bar' size='large' strokeWidth={14} strokeColor='#fe6202' percent={`${perWithdraw}`} showInfo={false} /> */}
              {/* <span className='week-withdraw'>{formatNumber(amount)}</span> */}
            {/* </div> */}

            {/* <Tag color={color} style={{width: `${perWithdraw}%`, height:'14px', borderRadius: '16px', marginLeft: '10px'}} /> */}
            <span>{labelShow.lWeek ? labelShow.lWeek : "Week"} {index + 1}</span>
            <span style={{width: `${perWithdraw}%`, backgroundColor: '#fe6202', height:'14px', borderRadius: '16px', marginLeft: '10px'}} />
            <span className='week-withdraw'>{formatNumber(amount)}</span>

          </Col>
          {/* <Col span={6}>
            <span className='week-withdraw'>{formatNumber(amount)}</span>
          </Col> */}
        </Row>
      </div>
    );
  });

  const disabledDate = (current) => {
    return current && current > moment().endOf('day');
  }

  const changeLocale = () => {
    // let codeLang = langValue ? langValue : 'EN';
    let codeLang = langValue === 'undefined' ? 'EN' : langValue;
    let changeLang = codeLang === 'EN' ? enUS : thTH;

    console.log('codeLang**** ', codeLang);

    setLocale(changeLang);
    if (!changeLang) {
      moment.locale('en');
    } else {
      moment.locale('th-th');
    }
  };

  return (
    <div className='content-space'>
      <Row className='statement-row'>
        <Col className='week' span={14} push={1}>
          {progressBar}
        </Col>

        <Col span={10} className='col2'>
          <Row className="monthPicker-row" >
            <Col span={24}>
              <span className='summary-text'>{labelShow.Summaryby || 'Summary by'}</span>
              <ConfigProvider locale={locale}>
                <MonthPicker
                  className='statement-date'
                  size='large'
                  format={monthFormat}
                  bordered={false}
                  defaultValue={moment(summaryBy, monthFormat)}
                  onChange={onSelectDate}
                  allowClear={false}
                  disabledDate={disabledDate}
                />
              </ConfigProvider>
            </Col>
          </Row>
          <Row>
            <Col span={8}><div className='withdraw-text'>{labelShow.WithdrawRate ? labelShow.WithdrawRate : "Withdraw Rate"}</div></Col>
            <Col span={16}><div className='withdraw-text'>{labelShow.TotalWithdraw ? labelShow.TotalWithdraw : "Total Withdraw (Baht)"}</div></Col>
          </Row>
          <Row>
            <Col span={8}><span className='withdraw'>{`${withDrawRate}%`}</span></Col>
            <Col span={16}><span className='withdraw'>{formatNumber(`${totalWithDraw ? totalWithDraw : 0}`)}</span></Col>
          </Row>
        </Col>
      </Row>

      <StatementTable transactions={statement.transactions} formatNumber={formatNumber} labelShow={labelShow} />
    </div>
  );
}
