import React, { useState } from 'react';
import { Upload, Button, Icon } from 'antd';

const AppUpload = (props) => {
  const upload = {
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    onChange({ file, fileList }) {
      if (file.status !== 'uploading') {
        console.log(file, fileList);
      }
    },
  };
  return (
    <Upload {...upload}>
      <Button>
        <Icon type="upload" /> Upload
      </Button>
    </Upload>
  );
};
export default AppUpload;
