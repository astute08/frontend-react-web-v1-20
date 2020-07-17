import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PersonalInformation from './personalInfomation';
import PayD from './payD/index';
import EmergencyContact from './emergencyContact';
import Classification from './payD/classification';
import Team from './team';
import Skill from './skill';
import Role from './role';
import Document from './document_Ex';
import Location from './location';
import GetLang from '../../../includes/language';
import httpClient from '../../../components/axiosClient';
import { Row, Col, Layout } from 'antd';
import './css/index.css';

const pageCode = '001';

export default (props) => {
  const params = useParams();
  const companyId = localStorage.getItem('companyId');
  const memComId = localStorage.getItem('memComId'); // monitoring id (admin)
  const loginUser = localStorage.getItem('userId');
  const userId = params.user_id; // user on table id
  const [paydSource, setPaydSource] = useState();
  const [paydDefault, setPaydDefault] = useState();
  const [selectSource, setSelectSource] = useState();
  const [dataCall, setDataCall] = useState();
  const [deleteClass, setDeleteClass] = useState();
  const [memClassAmount, setMemClassAmount] = useState();
  const [checkPayDShow, setCheckPaydShow] = useState();

  // ภาษา
  const comId = localStorage.getItem('comId');
  const langValue = localStorage.getItem('langValue');
  const [labelShow, setLabelShow] = useState({});

  // console.log("Index::::***", langValue);

  localStorage.setItem("language",JSON.stringify(labelShow));


  useEffect(() => {
    const checkPaydDefault = paydDefault ? paydDefault[1] : null;
    setCheckPaydShow(checkPaydDefault);
  }, [paydSource])

  useEffect(() => {
    Lang();
    paydData();

    // paydSelectData();
  }, [dataCall, deleteClass]);

  console.log("Lang Data", comId, langValue, pageCode)
  const Lang = async () => {
    const res = await GetLang({
      companyId: comId,
      lang: langValue ? langValue : 'EN',
      pageCode: pageCode,
    });
    console.log("RRRRRRRR", res);
    setLabelShow(res);
  };

  const paydData = async () => {

    const dataSource = await httpClient.get(`/company/user/${userId}`);
    console.log("dataSource",dataSource);

    const defaultClassId = dataSource.data.PayDSummary ? dataSource.data.PayDSummary.memClassId : "Disable";
    const defaultClassName = dataSource.data.PayDSummary ? dataSource.data.PayDSummary.class : "Disable";
    const defaultMemClassAmount = dataSource.data.PayDSummary ? dataSource.data.PayDSummary.memClassAmount : "";
    console.log("defaultMemClassAmount",dataSource);
 
    setPaydDefault([defaultClassId, defaultClassName]);
    setPaydSource(dataSource);
    setSelectSource(dataSource.data.companyClasses);
    setMemClassAmount(defaultMemClassAmount);
  }

  const functionCallCreate = (value) => {
    const checkValue = value ? value[0] : null;

    setDataCall(checkValue);
  }

  const functionCallDelete = (value) => {
    const deleteData = value[1] !== "Disable" ? true : false;

    setDeleteClass(deleteData);

  }

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
                  loginUser={loginUser}
                  labelShow={labelShow}
                />
              </Row>

              {checkPayDShow === "Class A" || checkPayDShow === "Class B" ?
                <Row className="user-info">

                  <PayD
                    paydSource={paydSource}
                    memComId={memComId}
                    comId={comId}
                    labelShow={labelShow}
                    langValue={langValue}

                  />

                </Row> : null
              }

              <Row className="child-column1">
                <EmergencyContact
                  companyId={companyId}
                  labelShow={labelShow}
                  className="emergency-contact"

                />
              </Row>

              <Row className="child-column1">
                <Location
                  userId={params.user_id}
                  memComId={memComId}
                  labelShow={labelShow}

                />
              </Row>
            </Col>

            <Col
              span={6}
              gutter={[15, 20]}
              style={{ paddingLeft: '10px', paddingTop: '0px' }}
            >

              <Row className="mt-20">
                <Classification
                  userId={params.user_id}
                  paydSource={paydSource}
                  selectSource={selectSource}
                  createdBy={memComId}
                  paydDefault={paydDefault}
                  memClassAmount={memClassAmount}
                  functionCallCreate={functionCallCreate}
                  functionCallDelete={functionCallDelete}
                  labelShow={labelShow}
                />
              </Row>

              <Row className="mt-20">
                <Team
                  userId={params.user_id}
                  companyId={companyId}
                  createdBy={params.user_id}
                  labelShow={labelShow}

                />
              </Row>

              <Row span={6} className="mt-20">
                <Role
                  userId={params.user_id}
                  companyId={companyId}
                  createdBy={params.user_id}
                  labelShow={labelShow}

                />
              </Row>

              <Row span={6} className="mt-20">
                <Skill
                  userId={params.user_id}
                  companyId={companyId}
                  createdBy={params.user_id}
                  labelShow={labelShow}

                />
              </Row>

              <Row span={6} className="mt-20">
                <Document
                  userId={params.user_id}
                  companyId={companyId}
                  memComId={params.user_id}
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
