import React from "react";

import {
  List,
  Icon,
  Badge,
  Popover,
  Modal,
  Button
} from 'antd';
import * as moment from "moment";
import { Link } from 'react-router-dom';
import HttpClient from "../../../components/httpClient";

const content = (users, labelShow, memComId, deleteId) => {
  console.log('deleteId:: ', deleteId)

  const confirm = (users) => {
    if (users.mem_com_id == memComId) {
      Modal.warning({
        title: labelShow.deleteUser
          ? labelShow.deleteUser
          : 'You cannot delete your account.',
        okText: labelShow.ok ? labelShow.ok : 'OK',
      });
    } else {
      Modal.confirm({
        icon: <Icon type="delete" style={{ color: '#FF0000' }} />,
        title: labelShow.delete_text
          ? labelShow.delete_text
          : 'Are you sure to delete ?',
        okText: labelShow.ok ? labelShow.ok : 'OK',
        cancelText: labelShow.cancel ? labelShow.cancel : 'Cancel',
        onOk() {
          deleteId(users.mem_com_id);
        },
        onCancel() {
          console.log('Cancel');
        },
      });
    }
  };

  return (
    <div>
      <Button className="styledPopDelete">
        {labelShow.edit ? labelShow.edit : 'Edit'}
      </Button>
      <br />
      <Button className="styledPopDelete" onClick={() => confirm(users)}>
        {labelShow.delete ? labelShow.delete : 'Delete'}
      </Button>
    </div> 
  );
};

export const fnColumn = ({labelShow}) => [
  {
    id: 0,
    title: '#',
    select: 'Index',
    align: 'center',
    width: 70,
    dataIndex: 'row_index',
    key: 'row_index',
    render: (text, record, index) => {
      return ((parseInt(record.pageCurrent - 1) * parseInt(record.pageSize)) + (index + 1));
    }
  },
  {
    id: 1,
    title: labelShow.columnName ? labelShow.columnName : 'Name',
    select: 'Name',
    width: 400,
    dataIndex: 'fullname',
    key: 'fullname',
    sorter: (a, b) => {
      if (!a.fullname) return -1
      if (!b.fullname) return 1
      return a.fullname > b.fullname
    },
    sortDirections: ['descend', 'ascend'],
    render: (text, record, index) => {
      if (record.fullname) {
        return ( 
            <List.Item.Meta
              key={index}
              title={
                <Link to={'/menu/users/' + record.mem_com_id}>
                  {record.fullname}
                </Link>
              }
          />
        )
      } else {
        return ('-');
      }
    }
  },
  {
    id: 2,
    title: labelShow.columnGender ? labelShow.columnGender : 'Gender',
    select: 'Gender',
    width: 200,
    dataIndex: 'gender',
    key: 'gender',
    sorter: (a, b) => {
      if (!a.gender) return -1
      if (!b.gender) return 1
      return a.gender > b.gender
    },
    sortDirections: ['descend', 'ascend'],
    render: (text, record, index) => {return (record.gender ? record.gender : '-')}
  },
  {
    id: 3,
    title: labelShow.columnPhoneNumber ? labelShow.columnPhoneNumber : 'Phone Number',
    select: 'Phone Number',
    width: 230,
    dataIndex: 'phone',
    key: 'phone',
    filterMultiple: false,
    onFilter: (value, record) => record.address.indexOf(value) === 0,
    sorter: (a, b) => {
      if (!a.phone) return -1
      if (!b.phone) return 1
      return a.phone > b.phone
    },
    sortDirections: ['descend', 'ascend'],
    render: (text, record, index) => {return (record.phone ? record.phone : '-')}
  },
  {
    id: 4,
    title: labelShow.columnEmail ? labelShow.columnEmail : 'Email',
    select: 'Email',
    width: 300,
    dataIndex: 'email',
    key: 'email',
    filterMultiple: false,
    onFilter: (value, record) => record.address.indexOf(value) === 0,
    sorter: (a, b) => a.email.length - b.email.length,
    sortDirections: ['descend', 'ascend'],
    render: (text, record, index) => {return (record.email ? record.email : '-')}
  },
  {
    id: 5,
    title: labelShow.columnOnline ? labelShow.columnOnline : 'Online',
    select: 'Online',
    width: 200,
    dataIndex: 'status_connection',
    key: 'status_connection',
    sorter: (a, b) => a.status_connection.length - b.status_connection.length,
    sortDirections: ['descend', 'ascend'],
    render: (text, record, index) => {
      const resultsOnline = () => {
        if (record.status_connection === "Active") {
          return (
            <Badge text="Active" status="success" />
          )
        } else {
          return (
            <Badge style={{ color: '#A9A9A9' }} text="In Active" status="default" />
          )
        }
      }
      return (
        resultsOnline()
      )
    }
  },
  {
    id: 6,
    title: labelShow.columnStatus ? labelShow.columnStatus : 'Status',
    select: 'Status',
    width: 200,
    dataIndex: 'status_work',
    key: 'status_work',
    sorter: (a, b) => a.status_work.length - b.status_work.length,
    sortDirections: ['descend', 'ascend'],
    render: (text, record, index) => {
      if (record.status_work === "Enable") {
        return (
          <Badge text="Enable" status="processing" />
        )
      } else {
        return (
          <Badge style={{ color: '#A9A9A9' }} text="Disable" status="default" />
        )
      }
    }
  },
  {
    id: 7,
    title: labelShow.columnLastActivity ? labelShow.columnLastActivity : 'Last Activity',
    select: 'Last Activity',
    width: 250,
    dataIndex: 'last_activity',
    key: 'last_activity',
    sorter: (a, b) => a.last_activity.length - b.last_activity.length,
    render: (text, record, index) => {
      return (record.last_activity ? <span>{moment(`${record.last_activity}`).format('LLL')}</span> : '-');
    }
  },
  {
    select: 'Delete',
    align: 'center',
    width: 70,
    dataIndex: 'operation',
    key: 'operation',
    render: (text, record, index) => {
      return (
        <Popover trigger="click" content={content(record, labelShow)} placement="leftTop">
          <Icon type="more" />
        </Popover>
      )
    }
  },
];