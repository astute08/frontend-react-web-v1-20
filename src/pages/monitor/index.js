import React, {useState, useEffect} from "react";
import ReactDOM from "react-dom";
import Map from "./mapView/index";
import places from "./mapView/places.json";
import Summary from "./summary/summary";
import TaskListView from './taskListView/index';
import Gantt from './gantt/index';
import {Button, Row, Col, Card} from 'antd';

const tabList = [
  {
    key: 'calendarView',
    tab: 'Calendar View',
  },
  {
    key: 'ganttView',
    tab: 'Gantt View',
  },
  {
    key: 'mapView',
    tab: 'Map View',
  },
  {
    key: 'listView',
    tab: 'List View',
  },
];

export default (props) => {

    const [key, setKey] = useState();
    const [markerLat, setMarkerLat] = useState(14.080680);
    const [markerLng, setMarkerLng] = useState(100.610223);
    const [show, setShow] = useState(true);
    const [span, setSpan] = useState(18);


    const onUpdateClick = () =>{
        console.log("Morning");
        setMarkerLat(13.912557);
        setMarkerLng(100.359398);
    }

    const tabDetail = {
      calendarView: '',
      ganttView: <Gantt />,
      mapView: <Map
                // center={{ lat: 40.6451594, lng: -74.0850826 }}
                zoom={10}
                places={places}
                markerLat = {markerLat}
                markerLng = {markerLng}
              />,
      listView: <TaskListView />
    };

    const handleChangeTab = (key) => {
      // console.log('key:: ', key)
      if (key === 'listView') {
        setShow(false);
        setSpan(24);
      } else {
        setShow(true);
        setSpan(18);
      }
      setKey(key);
    };

    useEffect(() => {
      if(key != undefined && key != 'mapView') {
        setKey(key);
      }
      else {
        setKey('mapView');
      }
    }, []);

    return (
      <div className="monitor">
        <Row gutter={[16, 16]} style={{ margin: 0 }}>
          {show === true ? (
              <Col span={6}>
                <Summary />
              </Col>
          ) : null}
          <Col span={span}>
            <Card
              style={{ width: '100%' }}
              tabList={tabList}
              activeTabKey={key}
              onTabChange={handleChangeTab}
            >
              {tabDetail[key]}
            </Card>
          </Col>
        </Row>
      </div>
    );
}
