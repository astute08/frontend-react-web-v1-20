import React, { useState, useEffect } from 'react';
import { Tabs, Avatar, Radio } from 'antd';
import Table from '../../../components/v2/table'
import HttpClient from '../../../components/httpClient';
const client = HttpClient();
const { TabPane } = Tabs;

export default (props) => {
    // console.log('modal++', props);

    const members = props.members || [];
    const compare = (a, b) => {
        if (a.name > b.name) return 1;
        if (b.name > a.name) return -1;
        return 0
    }
    members.sort(compare);

    const [candidate, setCandidate] = useState([]);
    const [onGoings, setOnGoings] = useState([]);

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [record, setRecord] = useState([]);
    // const [total, setTotal] = useState(7);
    
    const columns = [
        {   
            width: '5%',
            dataIndex: 'profile_img',
            key: 'profile_img',
            render: (text, record, index) => <Avatar src={`${process.env.REACT_APP_IMG_HOST}` + record.profile_img} />
        },
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
          render: (text, record, index) => (`${record.name} ${record.lastname}`),
        //   defaultSortOrder: "ascend",
        //   sorter: (a, b) => a.name.localeCompare(b.name)

        },
        {
          title: 'Phone number',
          dataIndex: 'phone',
          key: 'phone',
          render: (text, record, index) => {
            return (record.phone ? record.phone : '-');
          }
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

    const showTotal = (total) => {
        return (
            <span>Rows per page: </span>
            // `Total ${total} items`
        );
    };

    return (
        <div >
            <Tabs defaultActiveKey="1" onChange={callback}>
                <TabPane tab="Candidate" key="1">
                    <Table size="middle" sizeWidth={'lg'} dataSource={candidate} columns={columnsA} />
                </TabPane>
                <TabPane tab="Available" key="2">
                    <Table size="middle" sizeWidth={'lg'} dataSource={members} columns={columnsA}
                        pagination={{
                            // total: members.length,
                            showTotal: showTotal,
                            // defaultPageSize: 5,
                            defaultCurrent: 1,
                            pageSizeOptions: ['2', '4', '8', '10'],
                            showSizeChanger: true,
                            locale: { items_per_page: '' },
                        }}
                        rowSelection={props.rowSelection}
                        onRow={props.onRow}
                        rowKey={props.rowKey}
                    />
                    <div style={{display: 'flex', position: 'relative', marginTop: '-54px', marginLeft: '5px'}}>
                        <span>
                            Total {`${members.length}`} items
                        </span>
                    </div>
                </TabPane>
                <TabPane tab="On Going" key="3">
                    <Table size="middle" sizeWidth={'lg'} dataSource={onGoings} columns={columnsB}/>
                </TabPane>
            </Tabs>
        </div>
    )
}
