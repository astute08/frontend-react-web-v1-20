import React, { useState, useEffect } from 'react';
import { Row, Col } from 'antd';
import Provider from './provider';
import OrganizationTree from './organizationTree';
import Tabs from './tabs';
import Helper from '../../modules/helper';

const helper = new Helper();

export default () => {
  // console.log('organization : ');
  const app = Provider.useAppContext();

  const [gData, setGData] = useState([]);
  const [organizationTree, setOrganizationTree] = useState([]);

  // console.log("organizationTree",gData);

  useEffect(() => {
    const count = app.state.organizations.length;
    if (count > 0) {
      const treeData = [...app.state.organizations];
      const newTreeData = helper.setSelectOrganization(treeData);
      const newData = helper.setOrganizationData(treeData);
      setOrganizationTree([...newTreeData]);
      setGData([...newData]);
    }
  }, [app.state.organizations]);

  return (
    <div className="organization">
      <Row gutter={[16, 16]} style={{ margin: 0 }}>
        <Col span={6}>
          <OrganizationTree data={organizationTree} gData={gData} />
        </Col>
        <Col span={18}>
          <Tabs newForm={app.state.addNewOrganization} />
        </Col>
      </Row>
    </div>
  );
};
