import React from 'react';
import AppProvider from './appProvider';
import { Avatar } from 'antd';

export default () => {
  const app = AppProvider.useAppContext();

  return (
    <div style={{ marginBottom: 15 }}>
      {app.state.filePreview ? (
        <Avatar src={`${app.state.filePreview}`} size={192} />
      ) : (
        <Avatar size={192} style={{ fontSize: 36, fontWeight: 'bold' }}>
          {app.state.lang.photo ? app.state.lang.photo : 'Photo'}
        </Avatar>
      )}
    </div>
  );
};
