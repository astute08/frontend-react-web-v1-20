import React, { useState, useEffect } from 'react';
import { Card } from 'antd';
import { useParams } from 'react-router-dom';
import AppTable from '../../../components/v2/table';
import HttpClient from '../../../components/httpClient';
import Language from '../../../includes/language';
import './css/table.css';

const comId = localStorage.getItem('comId');
const pageCode = localStorage.getItem('pageCode');
const langValue = localStorage.getItem('langValue');

export default (props) => {
  const [dataUsers, setDataUsers] = useState();
  // ภาษา
  const [switchLang, setSwicthLang] = useState({});
  const [labelShow, setLabelShow] = useState({});

  useEffect(() => {
    getUsers();
    Lang();
  }, []);

  const param = useParams();
  const userId = param.user_id;

  // ส่วนของการเรียกใช้ภาษา
  const Lang = async () => {
    const res = await Language({
      companyId: comId,
      lang: langValue,
      pageCode: pageCode,
    });
    setSwicthLang(res);
    setLabelShow(res);
  };

  const getUsers = async () => {
    let result = await client.get(`/v2/contacts/${userId}/`);
    setDataUsers(result.data);
  };

  let client = HttpClient();

  const columns = [
    {
      title: '#',
      align: 'center',
      width: 70,
      dataIndex: 'row_index',
      key: 'row_index',
    },
    {
      title: labelShow.columnName ? labelShow.columnName : 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: labelShow.columnRelation ? labelShow.columnRelation : 'Relation',
      dataIndex: 'relation',
      key: 'relation',
    },
    {
      title: labelShow.columnPhone ? labelShow.columnPhone : 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
  ];

  return (
    <Card className="card-emergency"
      title={
        labelShow.emergencyContactTitle
          ? labelShow.emergencyContactTitle
          : 'Emergency Contact'
      }
    >
      <AppTable sizeWidth={'lg'}
        size={'middle'}
        columns={columns}
        dataSource={dataUsers}
        className="table"
        pagination={{ position: 'none' }}
      />
    </Card>
  );
};

