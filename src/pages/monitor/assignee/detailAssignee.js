import React, { useState, useEffect } from 'react';
import * as moment from 'moment';
import _ from 'lodash';
import { Tabs, Badge, Row, Col, Timeline, Tag } from 'antd';
import '../css/assignees.css'
import Avatar from '../../../components/v2/avatar'

const { TabPane } = Tabs;

export default (props) => {
    console.log('detailAssignee:* ', props);

    // let details = props.details;
    // let profile = props.profile;
    // let imagesProfile = props.imagesProfile;

    const profile = _.get(props, 'profile');
    const imagesProfile = _.get(props, 'imagesProfile');

    const candidate = _.get(props, 'details.datasource');
    const type = _.get(props, 'details.datasource.task_type_code[0]');
    const status = _.get(props, 'details.datasource.status_code');
    const customer = _.get(props, 'details.datasource.customer_code');

    // const [candidate , setCandidate] = useState([]);
    // const [type , setType] = useState([]);
    // const [status , setStatus] = useState([]);
    // const [customer, setCustomer] = useState([]);

    useEffect(() => {
        // if (details.datasource) {
            // setCandidate(details.datasource);
            // setCustomer(details.datasource.customer_code);
            // setType(details.datasource.task_type_code[0]);
            // setStatus(details.datasource.status_code);
        // }
    }, []);

    const DetailsMember = () => {
        // console.log('profile+++++: ', profile);
        if (profile === "") {
            return (
                <h2 className="title-h2">No Assignee</h2>
            )
        } else {
            return (
                <div>
                    <div>
                        <h2 className="title-h2">{`${profile.profile.name} ${profile.profile.lastname}`}</h2> 
                    </div>
                    <div className="avatar-row-data-div">
                        <Tag className="text-phone-modal">{profile.profile.phone === null ? "" : profile.profile.phone}</Tag> 
                    </div>
                </div>
            )
        }
    }

    const AvatarModal = () => {
        // console.log('imagesProfile*****: ', imagesProfile);
        if (profile == "") {
            return(
                <Avatar size={48} bkColor={status.color} />
            )
        } else {
            return (
                <Avatar size={48} color={status.color} bkColor={status.color} src={`${process.env.REACT_APP_IMG_HOST}` + imagesProfile.profile_img}  />
            )
        }
    }

    const styleStatus = {
        backgroundColor:`${status.color}`,
    };

    return (
        <div>
            {/* <div className="content-avatar"> */}
                <Row className="content-avatar">
                    <Col span={5} className="content-avatar">
                        <AvatarModal />
                        {/* {profile } */}
                    </Col>
                    <Col span={19}>
                        <DetailsMember />
                    </Col> 
                </Row>
            {/* </div> */}
            <div>
                <span>
                    <h3 className="title-h3">{customer.name}</h3>
                </span>  
                <div className="div-details">
                    <span>เบอร์โทร:</span> 
                    <p className='container-detail-p'>{customer.phone}</p>
                </div>
                <div className="div-details">
                    <span>Address:</span> 
                    <p className='container-detail-p'>{candidate.delivery_address}</p>
                </div>
                <div className="div-details">
                    <span>Area:</span> 
                    <p className='container-detail-p'>Ratchada</p>
                </div>
                <div className="div-details">
                    <span>Plan start date:</span> 
                    <p className='container-detail-p'>{moment(candidate.planed_start_date).format("D MMM YYYY")}</p>
                </div>
                <div className="div-details">
                    <span>Deadline:</span> 
                    <p className='container-detail-p'>{moment(candidate.planed_finish_date).format('LT')}</p>
                </div>
                <div className="div-details">
                    <span>Task type:</span> 
                    <p className='container-detail-p'>{type.name}</p>
                </div>
                <div className="div-details">
                    <span>Remark:</span> 
                    <p className='container-detail-p'>{type.remark}</p>
                </div>
                <div className="div-details">
                    <span>Status:</span> 
                    <Tag className="div-details-tag-status" style={styleStatus}>{status.value}</Tag>
                </div>
                <hr />
                <div className="div-details">
                    <span className='container-detail'>Timeline</span> 
                </div>
                <div className="detail-timeline">
                    <Timeline>
                        <Timeline.Item color="green">
                            <span className='container-moment'>{moment(candidate.planed_start_date).format('L', 'LT')}</span>
                            <span className='container-moment'>{moment(candidate.planed_finish_date).format('LT')}</span>
                        </Timeline.Item>
                    </Timeline>
                </div> 
            </div>
        </div>
    )
}
