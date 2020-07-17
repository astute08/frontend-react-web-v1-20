import React from 'react';
// import Card from '../../../components/v2/card';
import { Card, Col, Row } from 'antd';
import Status from './status';
import task from "./task.json";
import '../css/summary.css';
export default () => {
    const data = [
        'Task',
        'Warning',
        'Timout',
    ];

    console.log("task:::=>", task);

    let CardItems = task.map((item, index) => (
        <Card.Grid style={gridStyle}> {item.quantity} </Card.Grid>
    ));

    return (
        <Card
            size="default"
            title='Summary'
            className="summary"
        >
            <Col span={24}>
                <Card.Grid style={taskStyle} hoverable={false} bordered = {false}> <b>87</b> <br /> Task </Card.Grid>
                <Card.Grid style={warningStyle} hoverable={false}> <b>52</b> <br /> Warning </Card.Grid>
                <Card.Grid style={timeoutStyle} hoverable={false} > <b>3</b> <br /> Timeout </Card.Grid>
            </Col>

            <Col span={24}>
                <Card
                    type="inner"
                    title = "status"
                    bordered = {false}
                    style={gridStyle2}
                >
                    <Status />
                </Card>
            </Col>




        </Card>
    );
}

const gridStyle = {
    width: "33.33%",
    textAlign: "center",
    borderBottpm: "0px"
};

const taskStyle = {
    width: "33.33%",
    textAlign: "center",
    borderBottom: "0px",
    color: "#000000CC",
    // borderWidth: 1,
    // borderRadius: 0,
    // borderColor: '#000',
    // borderBottomWidth: 0,
 
};
const warningStyle = {
    width: "33.33%",
    textAlign: "center",
    borderBottom: "0px",
    color: "#F5B300"
};
const timeoutStyle = {
    width: "33.33%",
    textAlign: "center",
    borderBottom: "0px",
    color: "#FF2B10CC"
};

const gridStyle2 = {
    width: "100%",
    paddingTop: "0px",
    paddingRight: "0px"
}