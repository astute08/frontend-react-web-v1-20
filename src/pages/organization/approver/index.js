import React, { useState, useEffect } from 'react';
import { Row, Col } from 'antd';
import ApproverList from './list';

export default (props) => {
  // console.log('ApproverList props::: ', props);

  const [orgId, setOrgId] = useState();
  const [dataSource, setDataSource] = useState([]);
  const [dataUsers, setDataUsers] = useState([]);


  useEffect(() => {
    setOrgId(props.orgId);
  }, [props.orgId]);
  
  useEffect(() => {
    setDataSource([...props.dataSource]);
    setDataUsers([...props.dataUsers]);
  }, [props.dataSource]);

  return (
    <div>
      <Row gutter={[8, 8]}>
        <Col span={12} />
        <Col span={12} />
      </Row>
      <Row gutter={[8, 8]}>
        <Col span={24}>
          <ApproverList orgId={props.orgId} dataSource={dataSource} dataUsers={dataUsers} />
        </Col>
      </Row>
    </div>
  );
}