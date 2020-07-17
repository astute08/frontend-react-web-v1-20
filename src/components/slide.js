import React from 'react';
import { Slider, Divider, Popconfirm, Button, Icon } from 'antd';
import AppIcon from './icon';
import '../pages/css/card.css';

const AppSlide = (props) => {
  const formatter = (value) => {
    return `${value}%`;
  };
  const text = 'Are you sure to delete this task?';
  const confirm = () => {};
  return (
    <div>
      <h4 className="text-card">
        Truck 10 W <strong className="value-slider-10">{props.value1}</strong>
        <Popconfirm
          placement="leftBottom"
          title={text}
          onConfirm={confirm}
          okText="Yes"
          cancelText="No"
        >
          <Icon marginLeft={'10px'} type="more" />
        </Popconfirm>
      </h4>

      <Slider tipFormatter={formatter} value={props.value1} />
      <Divider />
    </div>
  );
};
export default AppSlide;
