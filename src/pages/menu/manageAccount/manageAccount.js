import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PersonalInformation from '../../users/user/personalInfomation';
import EmergencyContact from '../../users/user/emergencyContact';
import Team from '../../users/user/team';
import Skill from '../../users/user/skill';
import Role from '../../users/user/role';
import Document from '../../users/user/document';
import Location from '../../users/user/location';
import ChangePassword from './changePassword';
import GetLang from '../../../includes/language';

import { Row, Col, Layout } from 'antd';

import './css/manageAccount.css';
// import GetApi from '../../../components/httpClient';

// let client = GetApi();
const pageCode = '001';

export default (props) => {
  const [labelShow, setLabelShow] = useState({});
  // const params = useParams();
  const companyId = localStorage.getItem('companyId');
  const comId = localStorage.getItem('comId');
  const memComId = localStorage.getItem('memComId');
  const loginUser = localStorage.getItem('userId');
  const langValue = localStorage.getItem('langValue'); //เต้เพิ่มมา

  // console.log('memComId memComId memComId', memComId);
  // console.log('companyId companyId companyId', companyId);

  console.log("switchLang",labelShow);

  useEffect(() => {
    Lang();
  }, []);

  const Lang = async () => {
    const res = await GetLang({
      companyId: comId,
      lang: langValue ? langValue : 'EN',
      pageCode: pageCode,
    });
    setLabelShow(res);
  };


  return (
    <div>
      <Layout className="ant-layout">
        <Layout>
          <Row gutter={[10, 10]}>
            <Col span={18} gutter={[0, 48]}>
              <Row className="user-info">
                <PersonalInformation
                  companyId={companyId}
                  memComId={memComId}
                  langValue={langValue}
                  loginUser={loginUser}
                  labelShow={labelShow}
                />
              </Row>

              <Row className="child-column1">
                <EmergencyContact
                  companyId={companyId}
                  labelShow={labelShow}
                />
              </Row>

              <Row className="child-column1">
                <Location 
                  serId={memComId}
                  labelShow={labelShow}
                />
              </Row>
            </Col>

            <Col
              span={6}
              gutter={[15, 20]}
              style={{ paddingLeft: '10px', paddingTop: '0px' }}
            >
              <Row className="team-card">
                <ChangePassword
                  userId={loginUser}
                  companyId={companyId}
                  labelShow={labelShow}
                />
              </Row>

              <Row className="team-card">
                <Team
                  userId={memComId}
                  companyId={companyId}
                  createdBy={memComId}
                  labelShow={labelShow}
                />
              </Row>

              <Row span={6} className="mt-20">
                <Role
                  userId={memComId}
                  companyId={companyId}
                  createdBy={memComId}
                  labelShow={labelShow}
                />
              </Row>

              <Row span={6} className="mt-20">
                <Skill
                  userId={memComId}
                  companyId={companyId}
                  createdBy={memComId}
                  labelShow={labelShow}
                />
              </Row>

              <Row span={6} className="mt-20">
                <Document
                  memComId={memComId}
                  companyId={comId}
                  labelShow={labelShow}
                />
              </Row>
            </Col>
          </Row>
        </Layout>
      </Layout>
    </div>
  );
};
