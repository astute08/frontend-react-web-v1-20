import React from 'react';

const AppImage = (props) => {
  return (
    // รอรับรูปภาพ
    <div className="image">
      <image src={props.icon} />
      <span>{props.icon}</span>
    </div>
  );
};

export default AppImage;
