import React, { useState, useEffect } from 'react';
import httpClient from '../../../components/axiosClient';
import '../css/listViwe.css'
import { Table, Icon, Tag, Row, Col, Input, Select, Divider } from 'antd';
import Card from '../../../components/v2/card';
import styled from 'styled-components';

const NewTags = styled(Tag)`
    /* width: 100px; */
`;

const InputGroup = Input.Group;
const { Option } = Select;

const columns = [
    {
        title: 'Task ID',
        dataIndex: 'taskId',
        key: 'taskId',
        defaultSortOrder: 'ascend',
        sorter: (a, b) => a.taskId.length - b.taskId.length,
        sortDirections: ['descend', 'ascend'],
    },
    {
        title: 'Task type',
        dataIndex: 'taskType',
        key: 'taskType',
        sorter: (a, b) => a.taskType.length - b.taskType.length,
        sortDirections: ['descend', 'ascend'],
    },
    {
        title: 'Customer',
        dataIndex: 'customer',
        key: 'customer',
        sorter: (a, b) => a.customer.length - b.customer.length,
        sortDirections: ['descend', 'ascend'],
    },
    {
        title: 'Location',
        dataIndex: 'location',
        key: 'location',
        sorter: (a, b) => a.location.length - b.location.length,
        sortDirections: ['descend', 'ascend'],
    },
    {
        title: 'Delivery date - time',
        dataIndex: 'deliveryDateTime',
        key: 'deliveryDateTime',
        sorter: (a, b) => a.deliveryDateTime.length - b.deliveryDateTime.length,
        sortDirections: ['descend', 'ascend'],
    },
    {
        title: 'Driver',
        dataIndex: 'driver',
        key: 'driver',
        sorter: (a, b) => a.driver.length - b.driver.length,
        sortDirections: ['descend', 'ascend'],
    },
    {
        title: 'Vehicle',
        dataIndex: 'vehicle',
        key: 'vehicle',
        sorter: (a, b) => a.vehicle.length - b.vehicle.length,
        sortDirections: ['descend', 'ascend'],
    },
    {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (object, record) => (
            <Tag className="tags-status" color={object.color} >
                {object.text.substring(1,0).toUpperCase() + object.text.substring(1)}
            </Tag>
        ),
        sorter: (a, b) => a.status.length - b.status.length,
        sortDirections: ['descend', 'ascend'],
    },
    {
        title: '',
        dataIndex: 'options',
        key: 'options',
        align: 'center',
        render: (text, record) => (
            <Icon type="delete" />
        ),
    }
];


export default (props) => {
    // console.log('List View:: ', props);

    const [task, setTask] = useState(0);
    const [completed, setCompleted] = useState(0);
    const [warning, setWarning] = useState(0);
    const [timeout, setTimeout] = useState(0);
    const [data, setData] = useState([]);
    const [total, setTotal] = useState();

    const list = () => {

        const body = {
            com_code: 1,
            org_code: 3,
            language: 'ENG',
            search: []
        };

        httpClient.post('/tasks/monitor', body).then(
            (response) => {
                if(response.status === 200) {
                    // console.log('response.status : ', response);
                    const newData = [];
                    response.data.data.list.forEach((object, index) => {
                        const newObject = {
                            taskId: object.tracking_id,
                            taskType: object.task_type_code[0].name,
                            customer: object.customer_code.name,
                            location: object.delivery_address,
                            deliveryDateTime: object.delivery_date_time,
                            driver: (object.assignee ? object.assignee.profile.name : '') + ' ' + (object.assignee ? object.assignee.profile.lastname : ''),
                            vehicle: object.vehicle.value,
                            status: {
                                text: object.status_code.value,
                                color: object.status_code.color
                            }
                        };
                        newData.push(newObject);
                    });
                    // console.log('data list viwe::+ ', response);
                    setTask(response.data.data.task);
                    setCompleted(response.data.data.completed);
                    setWarning(response.data.data.warning);
                    setTimeout(response.data.data.timeout);
                    setData([...newData]);
                    // setTotal(response.data.data)
                }
            },
            (error) => {
                console.log('error: ', error)
            }
        );
    };

    useEffect(() => {
        list();
    }, [props]);

    return (
        <Card className="card-list-view">
            <Row gutter={[16, 16]} style={{ margin: 0, textAlign: 'center' }}>
                <Col span={6}>
                    <h2>{`Task    ${task}`}</h2>
                </Col>
                <Col span={6}>
                    <h2 style={{ color: '#3C840F' }}>{`Completed    ${completed}`}</h2>
                </Col>
                <Col span={6}>
                    <h2 style={{ color: '#F6BE26' }}>{`Warning    ${warning}`}</h2>
                </Col>
                <Col span={6}>
                    <h2 style={{ color: '#F5604D' }}>{`Timeout    ${timeout}`}</h2>
                </Col>
            </Row>
            
            <Divider />

            <Row gutter={[16, 16]} style={{ marginTop: 20, marginBottom: 20, marginLeft: 1, marginRight: 1, textAlign: 'center' }}>
                <Col span={6}>
                    <InputGroup compact>
                        <Input
                            placeholder="Search"
                            prefix={<Icon type="search" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            style={{
                                width: '70%'
                            }}
                        />
                        <Select style={{ width: '30%' }} defaultValue="Home">
                            <Option value="Home">Home</Option>
                            <Option value="Company">Company</Option>
                        </Select>
                    </InputGroup>
                </Col>
                <Col span={12}></Col>
                <Col span={6} style={{ textAlign: 'right' }}>
                    <Select style={{ width: '30%' }} defaultValue="Home">
                        <Option value="Home">Home</Option>
                        <Option value="Company">Company</Option>
                    </Select>
                    <Select style={{ width: '30%' }} defaultValue="Home">
                        <Option value="Home">Home</Option>
                        <Option value="Company">Company</Option>
                    </Select>
                </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ margin: 0, textAlign: 'center' }}>
                <Col span={24}>
                    <Table
                        rowKey="uid"
                        columns={columns} 
                        dataSource={data} 
                        pagination={{
                            total: task,
                            showTotal: ((total) => <span>Rows per page: </span>),
                            showSizeChanger: true,
                            locale: { items_per_page: '' },
                        }}
                    />
                    <div className="total-items">
                        <span>
                            Total {`${task}`} items
                        </span>
                    </div>
                </Col>
            </Row>
        </Card>
    );
}