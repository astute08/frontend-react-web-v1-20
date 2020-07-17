import React, { useState, useEffect } from 'react';
import { Card } from 'antd';
import Provider from './provider';
import Details from './details';
import Member from './member/index';
import Shift from './shift/view/index';
import Services from './services/index';

export default (props) => {
  const app = Provider.useAppContext();

  const [key, setKey] = useState();
  const [tabsDisabled, setTabsDisabled] = useState(false);

  const tabList = [
    {
      key: 'details',
      tab: 'Details',
    },
    {
      key: 'member',
      tab: 'Member',
      disabled: tabsDisabled
    },
    {
      key: 'services',
      tab: 'Services',
      disabled: tabsDisabled
    },
    {
      key: 'shift',
      tab: 'Shift',
      disabled: tabsDisabled
    },
  ];

  const tabDetail = {
    details: <Details newForm={props.newForm} />,
    member: <Member comId={app.state.comId} orgId={app.state.orgId} />,
    services: <Services comId={app.state.comId} orgId={app.state.orgId} />,
    shift: <Shift resources={app.state.members || []} shifts={app.state.shifts} />,
  };

  const handleChangeTab = (key) => {
    setKey(key);
  };

  useEffect(() => {
    if(key != undefined && key != 'details' && app.state.addNewOrganization === false) {
      setKey(key);
    }
    else {
      setKey('details');
    }
  }, [app.state.orgId]);

  useEffect(() => {
    if(props.newForm) {
      setTabsDisabled(true);
    }
    else {
      setTabsDisabled(false);
    }
    
  }, [props.newForm]);

  return (
    <div>
      <Card
        style={{ width: '100%' }}
        tabList={tabList}
        activeTabKey={key}
        onTabChange={handleChangeTab}
      >
        {tabDetail[key]}
      </Card>
    </div>
  );
};
