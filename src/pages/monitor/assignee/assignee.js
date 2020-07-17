import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import '../css/assignees.css';
import styled from 'styled-components';
import * as moment from 'moment';
import AssigneeModal from './modal';
import DetailAssignee from './detailAssignee';
import { Row, Col, Modal, Badge, Tabs, notification, Icon, Tag } from 'antd';
// import Table from '../../../components/v2/table';
import Avatar from '../../../components/v2/avatar';
import Button from '../../../components/v2/button';
import Card from '../../../components/v2/card';
// import button from '../../../components/v2/button';
import HttpClient from '../../../components/httpClient';
import HttpClient2 from '../../../components/axiosClient';
let client = HttpClient();
const { TabPane } = Tabs;

export default (props) => {
    console.log('assignee::* ', props);
    
    const {handleRefresh} = props
    const assignee = _.get(props, 'datasource');
    const type = _.get(props, 'datasource.task_type_code[0]');
    const status = _.get(props, 'datasource.status_code');
    const profile = _.get(props, 'datasource.assignee');
    const imagesProfile =  _.get(props, 'datasource.assignee.profile');
    // const assignProfile = props.datasource.assignee || '';

    // console.log('status:::++', status);

    const comId = localStorage.getItem('comId');

    const [visible, setVisible] = useState(false);

    const [members, setMembers] = useState([]);
    const [candidate, setCandidate] = useState([]);
    const [onGoings, setOnGoings] = useState([]);

    const [disabled, setDisabled] = useState(false);

    const [record, setRecord]= useState();
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [rowID ,setRowId] = useState("");

    // console.log('profile: ', profile);
 
    useEffect(() => {
        loadCandidate();
        disabledButton();
    }, [disabled]);

    const loadCandidate = async () => {
        const result = await client.get(`/v2/resource/organization/candidate/${assignee.org_code}`);
        // console.log('result:>> ', result)
        setMembers(result.data.members);
        setCandidate(result.data.candidate);
        setOnGoings(result.data.onGoings);
    }

    const columns = [
        {
            dataIndex: 'profile_img',
            key: 'profile_img',
            width: '5%',
        },
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: 'Phone number',
          dataIndex: 'phone',
          key: 'phone',
        },
        {
          title: 'Address',
          dataIndex: 'address',
          key: 'address',
        },
        {
            title: 'Shift',
            dataIndex: 'shift',
            key: 'shift',
        },
        {
            title: 'Distance',
            dataIndex: 'distance',
            key: 'distance',
        },
        {
            title: 'Truck',
            dataIndex: 'truck',
            key: 'truck',
        },
        {
            title: 'Task',
            dataIndex: 'task',
            key: 'task',
        },
    ];

    let columnsA = [...columns];
    columnsA.splice(6, 1);

    let columnsB = [...columns];
    columnsB.splice(4, 1);

    const callback = (key) => {
        console.log(key);
    }

    const HeaderModal = () => {
        // console.log('profile+++++: ', profile)
        if (profile.length === 0) {
            return(
                <h3 className="no-assignee">No Assignee</h3>
            )
        } else {
            return (
                <div>
                    <div>
                        <p className="text-name">{`${profile.profile.name} ${profile.profile.lastname}`}</p> 
                    </div>
                    <div className="avatar-row-data-div">
                        <Tag className="text-phone">{profile.profile.phone}</Tag> 
                    </div>
                </div>
            )
        }
    }

    const AvatarModal = () => {
        if (profile === "") {
            return(
                <Avatar size={48} bkColor={status.color} />
            )
        } else {
            return (
                <Avatar size={48} src={`${process.env.REACT_APP_IMG_HOST}` + imagesProfile.profile_img} />
            )
        }
    }
    
    const Title = () => {
        return (
        <Row className="row">
            <Col span={6}>
                <Row className="avatar-row">
                    <AvatarModal />
                </Row>
            </Col>
            <Col span={18}>
                <Row className="avatar-row-data">
                    <HeaderModal />
                </Row>
            </Col>
        </Row>
        )
    };

    const showModal = () => {
        setVisible(true);
      };

    const handleCancel = () => {
        setSelectedRowKeys([]);
        setVisible(false);
    };

    const handleOk = async () => {
        try {
            const body = {
                "tracking_id": `${assignee.tracking_id}`,
                "updated_by": `${comId}`,
                "assignee": `${record[0].mem_com_id}`
            }
            console.log('body:: ', body)
            const result = await HttpClient2.post('/tasks/monitor/update', body);
            console.log('handleOk:: ', result);
            if (result.status === 200) {
                setTimeout(() => {
                    handleRefresh();
                    successNotification('success');
                    setVisible(false);
                    setSelectedRowKeys([]);
                }, 500);
            } else console.error();
        } catch (error) {
            console.log(error);
        }
        
    };

    const successNotification = (message) => {
        notification.success({
          icon: <Icon type="check-circle" style={{ color: '#fe6202' }} />,
          message: message,
        });
      };

    const rowSelection = {
        selectedRowKeys,
        type: 'radio',
    }

    const onRow = (record, index) => {
        return {
            onClick: (event) => {
                setSelectedRowKeys([record.mem_pro_id]);
                setRecord([record]);             
            }
        }
    }

    const titleModal = (
        <Badge className="title-modal" status="processing" text={assignee.tracking_id} color={status.color} />
    )

    // const actionButton = () => {
    //     if (profile === "") {
    //         return(
    //             <span className="span-assign">Assign</span>
    //         )
    //     } else {
    //         return (
    //             <span className="span-assign">Re-assign</span>
    //         )
    //     } 
    // }

    const disabledButton = () => {
        if (profile) {
            setDisabled(status.reassign === 0);
        } else {
            setDisabled(status.assign === 0);
        }
    }

    const extraButton = (
        <div>
            <Button type="primary" className="button-row" size={"small"} onClick={showModal}  disabled={disabled}>
                {/* {actionButton()} */}
                <span className="span-assign">{profile ? 'Re-Assign' : 'Assign' }</span>
            </Button>
            <Modal
                // className="modalAssignee"
                // size={'small'}
                visible={visible}
                title={titleModal}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={null}
                width={1168}
            >
                <Row> 
                    <Col span={15} className="col-assign">
                        <Row>
                            <Col span={24}>
                                <AssigneeModal 
                                    assign={props} 
                                    members={members} 
                                    onRow={onRow}
                                    rowSelection={rowSelection}
                                    rowKey={(record, index) => record.mem_pro_id}
                                />
                            </Col>
                        </Row> 
                        <Row className="col-button">
                            <Col span={24}>
                                <Button btnSize="wd_df" key="back" onClick={handleCancel}>Cancel</Button>
                                <Button btnSize="wd_df" type="primary" key="submit" onClick={handleOk}>
                                    {/* {actionButton()} */}
                                    <span className="span-assign">{profile ? 'Re-Assign' : 'Assign' }</span>
                                </Button>
                            </Col>
                        </Row> 
                    </Col>
                    <Col span={9} className="col-detil">
                        <DetailAssignee details={props} profile={profile} imagesProfile={imagesProfile} />
                    </Col>
                </Row>
            </Modal>
        </div>
    );

    const styleStatus = {
        backgroundColor:`${status.color}`,
    };
    
    return (
        <Card
            title={<Title />}
            extra={extraButton} size={'lg'}
            bordered={false}
            actions={[<span className='detail-text'>Address: <span className = 'container-detail'>{assignee.delivery_address}</span></span>]}
            className='assignee'
        >
            <div className="content" >
                <div className="text-task">
                    <span>
                        <p className="text-p">{assignee.tracking_id}</p>
                    </span>
                </div>
                <div className="content-container">
                    <div className="styte-details">
                        <span>Area:</span> 
                        <p className='container-detail'>Ratchada</p>
                    </div>
                    <div className="styte-details">
                        <span>Type:</span>
                        <p className='container-detail'>{type.name}</p>
                    </div>
                    <div className="styte-details">
                        <span>Priority: </span>
                        <p className='container-detail'>{assignee.priority}</p>
                    </div>
                    <div className="styte-details">
                        <span>Plan start date: </span>
                        <p className='container-detail'>{moment(assignee.planed_start_date).format("D MMM YYYY")}</p>
                    </div>
                    <div className="styte-details">
                        <span>Deadline: </span>
                        <p className='container-detail'>{moment(assignee.planed_finish_date).format('LT')}</p>
                    </div>
                    <div className="styte-details">
                        <span>Status: </span>
                        <Tag className="div-details-tag-status" style={styleStatus}>{status.value}</Tag>
                    </div>
                </div>
            </div>
        </Card>  
    )
}

