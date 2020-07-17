import React, { useState, useEffect } from 'react';
import '../css/resource.css';
import * as moment from "moment";
import { Row, Col, Tag } from 'antd';
import Avatar from '../../../components/v2/avatar';
import Button from '../../../components/v2/button';
import Card from '../../../components/v2/card'
import HttpClient from '../../../components/httpClient';

let client = HttpClient();
const { Meta } = Card;

export default (props) => {
    console.log('Resource ::** ', props);

    const [resource, setResource] = useState([]);
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        // getResource();
    }, [props]);


    // const getResource = () => {
    //     if (props.resource) {
    //         setTasks(resource.tasks ? resource.tasks : {data: []});
    //         setResource(props.resource);
    //     }
    // }


    const Title = () => {
        return (
            <div className="title" >
                <Row className="row">
                    <Col span={5}>
                        <Row className="avatar-row">
                            <Avatar size={48} src={props.imgPath} />
                        </Row>
                    </Col>
                    <Col span={11}>
                        <Row className="avatar-row-data">
                            <div>
                                <p className="text-name">{props.name + " " + props.lastname}</p> 
                            </div>
                            <div className="avatar-row-data-div">
                                <Tag className="text-phone">{props.phone}</Tag> 
                            </div>
                        </Row>
                    </Col>
                    <Col span={8}>
                        <Row className="button-row">
                            <Button className="button" primary size={"small"} >Assign</Button>
                        </Row>
                    </Col>
                </Row>
            </div>
        )
    };

    const content = (
        <div className="content">
            <div className="text-task">
                <span>
                    <p className="text-p">Task #2016232383939</p> 
                </span>
            </div>
            <div className="content-container">
                <span>
                    <p>Area: Ratchada</p>
                </span>
                <span>
                    <p>Type: Sand Delivery 4W</p> 
                </span>
                <span>
                    <p>Priority: High</p>
                </span>
                <span>
                    <p>Plan start date: 15 Jun 20</p>
                </span>
                <span>
                    <p>Deadline: 9:00 AM</p>
                </span>
                <span>
                    <p>Status: New</p>
                </span>
                <hr />
                <span>
                    <p>Address: 471/4 Tumbon moo baan Theerin tanon knew ngeun Bangkok 10220</p>
                </span>
            </div>
        </div>
    );

    const extraButton = (
        <Button primary className="button-row" size={"small"}>Assign</Button>
    );

    // const data = [...tasks];
    const data = [];
    
    return(
        // <List
        //     header={title}
        //     bordered
        //     dataSource={data}
        //     renderItem={item => (
        //         <List.Item key={item.id}>
        //             {/* <Typography.Text mark>[ITEM]</Typography.Text> {item} */}
        //             <List.Item.Meta
        //                 title={<p>{item.tracking_id}</p>}
        //             />
        //             {/* <div>{item.planed_start_date}</div> */}
        //             <div>{moment(item.planed_start_date).format('LT')}</div>
        //         </List.Item>
        //     )}
        // />

        // <Card style={{ width: 300, marginTop: 16 }}>
        //     <Meta
        //     avatar={
        //         <Avatar size={48} color={'#64FE2E'} src={'http://192.168.11.181:8200' + resource.profile_img} />
        //     }
        //     title="Card title"
        //     description="This is the description"
        //     />
        // </Card>

        <Card className="card-resource">
            <Title />
        </Card>

    )
}