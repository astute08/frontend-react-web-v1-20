import React, { useState, useEffect } from 'react';
import './css/index.css';
import { Table, Popover, Icon, Modal, notification, Divider, Button } from 'antd';
import HttpClient from "../../../components/httpClient";
// import Table from '../../../components/v2/table';
import { debounce } from 'lodash';
import ActionServices from './actionServices';
import EditArea from './editArea';
import axios from 'axios';
import Provider from '../provider';

const client = HttpClient();

export default (props) => {
  // console.log('Servies props::: ', props);
  const app = Provider.useAppContext();

  const comId = props.comId;
  const orgId = props.orgId;

  const columns = [
    {
      title: '#',
      align: 'center',
      width: 70,
      dataIndex: 'index',
      key: 'index',
      render: (text, record, index) => index + 1
    },
    {
      title: 'Area',
      dataIndex: 'areaName',
      key: 'areaName',
      select: 'areaName',
    },
    {
      title: 'Task Type',
      align: 'center',
      dataIndex: 'taskTypesId',
      key: 'taskTypesId',
      select: 'taskTypesId',
      render: (text, record, index) => {
        return (
          record.taskTypesId = (
              <p className="task-types-p">{record.taskTypesId}</p>
          )
        )
      }
    },
    {
      title: 'Buffer (Hrs.)',
      align: 'center',
      dataIndex: 'buffer',
      key: 'buffer',
      select: 'buffer',
    },
    {
      title: '',
      key: 'options',
      dataIndex: 'options',
      align: 'center',
      width: '5%',
      render: (text, record, index) => {
        return (
          record.options = (
            <Popover key={index} content={actionPopover(record)} placement="leftTop" >
                <Icon type="more" />
            </Popover>
            // <Icon  key={index} onClick={() => handleDelete(record)} type="delete" />
          )
        )
      }
    }
  ];

  const setShowColumn = {
    index: true,
    areaName: true,
    taskTypesId: true,
    buffer: false,
    options: true
  };
  
  const setShowColumnArr = [
      'index',
      'areaName',
      'taskTypesId',
      'options'
  ];

  const dataColumns = [...columns];
  dataColumns.splice(3, 1);

  const [defaultShowColumn, setDefaultShowColumn] = useState({...setShowColumn});
  const [listArrayColumns, setListArrayColumns] = useState([...setShowColumnArr]);
  const [newDataColumns, setNewDataColumns] = useState([...dataColumns]);
  const [textErrorSelectColumn, setTextErrorSelectColumn] = useState('');

  const [servicesData, setServicesData] = useState([]);
  const [areaList, setAreaList] = useState([]);
  const [taskTypes, setTaskTypes] = useState([]);
  const [totalServices, setTotalServices] = useState();

  const [selectSearchData, setSelectSearchData] = useState("");
  const [fieldChang, setFieldChang] = useState("");

  const [refreshTable, setRefreshTable] = useState(false);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // console.log('areaList:::*** ', areaList);
  // console.log('taskTypes:::*** ', taskTypes);

  useEffect(() => {
    loadServices();
  }, [refreshTable]);

  useEffect(() => {
    refreshDataServices();
  }, [])

  const loadServices = async () => {
    setLoading(true);
    try {
      const url = `${process.env.REACT_APP_URL_MANAGER}`;
      const port = `${process.env.REACT_APP_RESOURCE_MANAGER_PORT}`;
      client.defaults.baseURL = `${url}:${port}`;
      const result = await client.get(`/organization/services/${comId}/${orgId}`);
      console.log('Servies::: ', result);
      setServicesData(result.data.services);
      setAreaList(result.data.areaList);
      setTaskTypes(result.data.taskTypes);
      setTotalServices(result.data.totalServices);
      setLoading(false);
    } catch (error) {
      console.log('Load Services::: ', error);
    }
  }

  // event input search
  const handleSearch = debounce((fieldChang) => {
    // console.log('handleSearch:::*', fieldChang);
    setFieldChang(fieldChang ? fieldChang : "");
  }, 500);

  // event select file 
  const handleSelectData = (value) => {
      // console.log('setSelect:::*', value);
      setSelectSearchData(value === undefined ? '' : value);
  }

  const handleOnVisiblecolumns = () => {
    setVisible(!visible);
  };

  const handleVisibleChange = flag => {
    // console.log('flag: ', flag)
    setVisible(flag);
  };

  const checkedValuecolumns = (e) => {
    let checked = e.target.checked;
    let val = e.target.value;
    let showColumn = { ...defaultShowColumn };
    if (checked === true) {
      const found = listArrayColumns.find((element) => element === val);
      if (found === undefined) {
        setListArrayColumns([...listArrayColumns, val]);
      }
      showColumn[val] = true;
      console.log('found::: ', found);
    } else {
      const newListArray = [...listArrayColumns];
      const found = listArrayColumns.findIndex((element) => element === val);
      // console.log('found::: ', found);
      if (found >= 0) {
        newListArray.splice(found, 1);
        setListArrayColumns(newListArray);
      }
      // console.log('newListArray::: ', newListArray);
      showColumn[val] = false;
    }
    console.log('showColumn::>> ', showColumn)
    setDefaultShowColumn(showColumn);
  };

  const handleCheckOk = () => {
    const setNewArr = [];
    
    if (listArrayColumns.length <= 2) {
      setTextErrorSelectColumn('Select at least 1 column.');
      return;
    } else {
      setTextErrorSelectColumn('');
    }
    for (let i = 0; i < columns.length; i++) {
      const found = listArrayColumns.find(
        (element) => element == columns[i].key,
      );
      if (found != undefined) {
        setNewArr.push(columns[i]);
      }
    }
    // console.log('setNewArr', setNewArr);
    // console.log('columns**', columns);
    console.log('listArrayColumns', listArrayColumns);
    setNewDataColumns(setNewArr);
    handleOnVisiblecolumns();
  };

  const handleReset = () => {
    const newListArrayColumns = [];
    dataColumns.forEach((element) => {
        newListArrayColumns.push(element.key);
    });
    setNewDataColumns(dataColumns);
    setListArrayColumns(newListArrayColumns);
    handleOnVisiblecolumns();
    setDefaultShowColumn(setShowColumn);
    setTextErrorSelectColumn('');
  };

  const actionPopover = (serviecs) => {
    console.log('delete serviecsID:: ', serviecs);
    const confirm = (serviecs) => {
      Modal.confirm({
        icon: <Icon type="delete" style={{ color: '#FF0000' }} />,
        title: 'Are you sure to delete ?',
        okText: 'OK',
        cancelText: 'Cancle',
        onOk () {
          deleteServices(serviecs.serviceCode);
        },
        onCancel() {
          console.log('Cancel');
          // editServices(serviecs.serviceCode);
        },
      });
    }

    return (
      <div>
        {/* <Button className="styledPopDelete" btnSize={"wd_df"} type="link" ghost onClick={() => editServices(serviecs)}>
          <p className="action-delete-p">Edit</p>
        </Button> */}
        <EditArea serviecsArea={serviecs} areaList={areaList} taskTypes={taskTypes} comId={comId} orgId={orgId} />
        {/* <br /> */}
        <Button className="styledPopDelete" btnSize={"wd_df"} type="link" ghost onClick={() => confirm(serviecs)}>
          <p className="action-delete-p">Delete</p> 
        </Button>
      </div> 
    );
  };


  const editServices = (serviecs) => {
    console.log('edit serviecsID:: ', serviecs);

  }

  const deleteServices = async (serviceCode) => {
    try {
      const url = `${process.env.REACT_APP_URL_MANAGER}`;
      const port = `${process.env.REACT_APP_RESOURCE_MANAGER_PORT}`;
      client.defaults.baseURL = `${url}:${port}`;
      const result = await client.delete(`/organization/services/${serviceCode}`);
      if (result.status === 200) {
        deletedNotification(result.data);
      }
      loadServices();
    } catch (error) {
      console.log(error);
    }
  }

  const deletedNotification = (message) => {
    notification.success({
      icon: <Icon type="check-circle" style={{ color: '#fe6202' }} />,
      message: message,
    });
  };

  const refreshDataServices = () => {
    setRefreshTable(!refreshTable);
    // loadMembers();
  }

  const showTotal = (total) => {
    return (
        <span>Rows per page: </span>
    );
  };

  return (
    <div className="services-card" >
      <ActionServices
        columns={columns}
        areaList={areaList}
        taskTypes={taskTypes}
        checked={defaultShowColumn}
        selectSearchData={selectSearchData}
        onSelect={handleSelectData}
        handleReset={handleReset}
        handleCheckOk={handleCheckOk}
        checkedValuecolumns={checkedValuecolumns}
        handleOnVisiblecolumns={handleOnVisiblecolumns}
        handleVisibleChange={handleVisibleChange}
        textErrorSelectColumn={textErrorSelectColumn}
        visible={visible}
        comId={comId}
        orgId={orgId}
        refreshDataServices={refreshDataServices}
      />
      <Table 
        className="services-table"
        size="middle"
        columns={newDataColumns}
        dataSource={servicesData}
        loading={loading}
        rowKey={record => record.id}
        pagination={{
          total: totalServices,
          showTotal: showTotal,
          // defaultPageSize: 5,
          defaultCurrent: 1,
          pageSizeOptions: ['10', '20', '50', '100'],
          showSizeChanger: true,
          locale: { items_per_page: '' },
        }}
      />

      <div style={{display: 'flex', position: 'relative', marginTop: '-38px', marginLeft: '10px'}}>
        <span>
            Total {`${totalServices}`} items
        </span>
      </div>
    </div>
  )
}
