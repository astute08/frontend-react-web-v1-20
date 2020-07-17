import React, { useEffect, useState } from 'react';
import './css/topBar.css';
import { Breadcrumb, Card } from 'antd';
import RightMenuTopbar from '../pages/menu/index';
import GetLang from './language';

export default (props) => {
  // get data จาก button value เพื่อนำมาเปลี่ยนภาษา จากหน้า userMenu 
  const langValue = localStorage.getItem('langValue');
  const [labelShow, setLabelShow] = useState({});
  const [switchLang, setSwicthLang] = useState({});


  useEffect(() => {
    Lang();
  }, []);

  const Lang = async () => {
    const res = await GetLang({
      companyId: props.comId,
      lang: langValue ? langValue : 'EN',
      pageCode: props.pageCode,
    });
    setSwicthLang(res);
    setLabelShow(res);
  };

  return (
    <Card
      style={{
        background: '#ffffff',
        overflow: 'initial',
      }}
      size="small"
      title={<span> {labelShow.user ? labelShow.user : 'User'}</span>}
      extra={<RightMenuTopbar labelShow = {labelShow}/>}
      className="header-shadow"
    >
      <Breadcrumb separator=">">
        <Breadcrumb.Item>
          {' '}
          <span> {labelShow.nHome ? labelShow.nHome : 'Home'}</span>{' '}
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          {' '}
          <span>
            {' '}
            {labelShow.menuDashboard
              ? labelShow.menuDashboard
              : 'Dashboard'}
          </span>{' '}
        </Breadcrumb.Item>
      </Breadcrumb>
    </Card>
  );
};
