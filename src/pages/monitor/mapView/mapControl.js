import React, { useState } from "react";
import { Icon, Card } from 'antd';
import '../css/mapControl.css';
const MapControl = props => {
  const gridStyle = {
    width: '50%',
    textAlign: 'center',
    // position: "fixed",
  };

  const [reourceShow, setResourceShow] = useState(true);
  const [taskShow, setTaskShow] = useState(true);
  const [resourceActive, setResourceActive] = useState("icon-focus");
  const [taskActive, setTaskActive] = useState("icon-focus");

  const onResourceClick = () => {
    if(reourceShow===false){
      setResourceShow(true);
      setResourceActive("icon-focus");
    }
    else if (reourceShow === true) {
      setResourceShow(false);
      setResourceActive("");
    }
    props.callOnResourceClick(reourceShow);
  }

  const onTaskClick = (e) => {
    if(taskShow===false){
      setTaskShow(true);
      setTaskActive("icon-focus");
    }
    else if (taskShow === true) {
      setTaskShow(false);
      setTaskActive("");
    }
    props.callOnTaskClick(taskShow);

    
  }

  return (
    <Card
      bg="white"
      bordered={false}
      style={props.googleMapStyle}
    >
      <Card.Grid hoverable={false} style={gridStyle} className='monitor'>
        <Icon className= {resourceActive} type="user" onClick={onResourceClick} />
      </Card.Grid>
      <Card.Grid hoverable={false} style={gridStyle}>
        <Icon className= {taskActive} type="shopping" onClick={onTaskClick} />
      </Card.Grid>

    </Card>
  );
};

export default MapControl;
