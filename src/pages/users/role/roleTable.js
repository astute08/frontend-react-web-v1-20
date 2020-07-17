import React, { useState, useEffect } from 'react';
import { Badge, Icon, message, Modal, Popover } from 'antd';
import Card from '../../../components/v2/card';
import Table from '../../../components/v2/table';
import httpClientDelete from '../../../components/httpClientRole2';
import httpClient from '../../../components/httpClientRole';


// import Badge from '../../../../components/v2/b'
import moment from 'moment';
import { data } from 'jquery';
import { isUndefined } from 'lodash';

const { confirm } = Modal;


export default (props) => {
  const pageSizeOptionsConst = [
    '2',
    '4',
    '8',
    '10',
    '16',
  ];
  const showSizeChangerConst = true;
  const defaultCurrentConst = 1;
  const addNew = props.addNew;
  // const onDataTable = props ? props.onDataTable : 0;
  const nameData = props.mockData;
  const [dataAdded, setDataAdded] = useState();
  const [okBtn, setOkBtn] = useState();
  const [deleteField, setDeleteField] = useState();
  const [onDataTable, setOnDataTable] = useState();
  const [totalItem, setTotalItem] = useState();

  const mockData = [];
  const dataAddedCheck = dataAdded ? 1 : 0;

  const text = 'Are you sure to delete this task?';

  console.log("deleteField", deleteField);


  const onDeleteOK = () => {
    console.log("onDeleteOK");
    showDeleteConfirm();
    // setVisible(false);
  }




  const showDeleteConfirm = (memPerGroId) => {
    confirm({
      title: 'Are you sure delete this task?',
      content: 'Some descriptions',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        console.log('OK', memPerGroId);
        setOkBtn(!okBtn);
        roleDelete(memPerGroId);
      },
      onCancel() {
        console.log('Cancel');
      },
    });


  }

  const roleTable = async () => {
    const response = await httpClient.get(`/company/1/permissionGroup/${props.perGroId}/member`);
    console.log("response.status", response);
    if (response.status === 200) {
      const data = response.data.data.length > 0 ? response.data.data : [];
      setOnDataTable(data);

      // console.log("response.status", data);

    } else {
      console.log("No data");
    }

    // console.log("AAAAAAAAAAAAAAAA", response.data.data);

  }

  const roleDelete = async (memPerGroId) => {
    const response = await httpClientDelete.delete(`/v2/role/1/${memPerGroId}`);
    console.log("roleDelete", response);
    if (response.data.status === 200) {
      setDeleteField(response.data.status);
    }


  }


  let optionItems = onDataTable ? onDataTable.map((item, key) => {
    return {
      key: `${key + 1}`,
      title: item.name,
      email: item.email,
      phone: item.phone,
      status: item.status == "Disable" ? <Badge status='default' text={item.status} /> : <Badge color="#004EFF" text={item.status} />,
      delete: <Icon type="delete" onClick={() => showDeleteConfirm(item.memPerGroId)} />

    }
  }) : null


  const dataTableMember = () => {
    if (props.onDataTable) {
      console.log("onDataTable true");

      props.onDataTable.map((item, key) => {
        return {
          key: key,
          title: item.name,
          email: "",
          phone: item.phone,
          status: item.status,
          delete: ""
        }
      })
    }
    else {
      console.log("onDataTable false");
      mockData.push({
        key: "",
        title: "",
        email: "",
        phone: "",
        status: "",
        delete: ""
        // disabled: i % 3 < 1,
      })
    }


  }


  const columns = [
    {
      title: '#',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: 'Name',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone number',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status'
    },
    {
      title: '',
      dataIndex: 'delete',
      key: 'delete'
    }

  ];

  const showTotal = (total) => {
    return (
      <p style={{ marginTop: '-1.5px' }}>{'Rows per page: '}</p>
    );
  };

  useEffect(() => {
    // alert(1);
    const data = props.dataSource ? props.dataSource : null;
    console.log("useEffect", data);
    setDataAdded(data);
    // dataTableMember();
    roleTable();
    setDeleteField(100);
    setTotalItem();
    
  }, [props, props.onDataTable === undefined,deleteField])


  return (
    <div >
      <Table
        size={'middle'}
        className={addNew === true || onDataTable ? 'role-member-add' : 'role-member-style'}
        pagination={{ position: 'none' }}
        dataSource={addNew === true ? null : optionItems}
        columns={columns}
        bordered={false}
        pagination={{
          total: 0,
          showTotal: showTotal,
          defaultCurrent: defaultCurrentConst,
          pageSizeOptions: pageSizeOptionsConst,
          showSizeChanger: showSizeChangerConst,
          locale: { items_per_page: '' },
        }}

      />

      <div
        style={{
          display: 'flex',
          position: 'relative',
          marginTop: '-40px',
          marginLeft: '40px',
        }}
      >
        {addNew === true ? null :

          <span>
            {/* put labelValue here */}
            {'Total'}
            {` ${onDataTable ? onDataTable.length : 0} `}
            {'items'}
          </span>}
      </div>
    </div>

  );
}
