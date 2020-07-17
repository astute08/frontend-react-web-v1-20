import React from 'react';
import Provider from './provider';
import FormDetail from './organizationDetail/index';
import FormContacts from './contacts/index';
import FormApprover from './approver/index';

export default (props) => {
  const app = Provider.useAppContext();
  const { newForm } = props;

  return (
    <div>
      <FormDetail orgId={app.state.orgId} parentId={app.state.parentId} data={app.state.organizationsDetail} newForm={app.state.addNewOrganization} />
      { !newForm ? <FormContacts orgId={app.state.orgId} data={app.state.organizationsContacts} /> : '' }
      { !newForm ? <FormApprover orgId={app.state.orgId} dataSource={app.state.organizationsApprovers} dataUsers={app.state.users} /> : '' }
    </div>
  );
};
