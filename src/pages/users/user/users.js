import React, { useState, useEffect, useRef } from "react";
import * as moment from "moment";
import HttpClient from "../../../components/httpClient";
import qs from "qs";
import { debounce } from 'lodash';
import AppTable from "../../../components/table";
import styled from "styled-components";
import "../css/users.css";
import "../user/css/pagination.css";
import "./modalDelete.css";
import Language from '../../../includes/language';
import InviteUsers from '../inviteUser/index';
import { Link } from 'react-router-dom';
import {
  Row,
  Card,
  Col,
  List,
  Icon,
  Select,
  Badge,
  Button,
  Menu,
  Dropdown,
  Popover,
  Modal,
  Checkbox,
  DatePicker,
  notification,
  Input,
} from 'antd';
import { fnColumn } from "./columns1";
import AppButton from '../../../components/v2/button';

const ButtonGroup = Button.Group;
const { Option } = Select;
const { Search } = Input;
const { RangePicker } = DatePicker;
let client = HttpClient();

const setShowColumn = {
  row_index: true,
  fullname: true,
  gender: true,
  phone: true,
  email: true,
  status_connection: true,
  status_work: true,
  operation: true,
  last_activity: false,
};

const setShowColumnArr = [
  'row_index',
  'fullname',
  'gender',
  'phone',
  'email',
  'status_connection',
  'status_work',
  'operation',
];

const AppUsers = () => {
  const [labelShow, setLabelShow] = useState({});
  // console.log('labelShow:: ', labelShow);

  // const allColumns = fnColumn({labelShow});
  let allColumns = [
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

  const selectableColumns = [...allColumns];
  selectableColumns.splice(0, 1);
  selectableColumns.splice(7, 1);

  const searchColumns = [...allColumns];
  searchColumns.splice(0, 1);
  searchColumns.splice(6, 2);

  const dataColumns1 = [...allColumns];
  dataColumns1.splice(7, 1);

  const [dataUsers, setDataUsers] = useState([]);
  const [dataUsersRefresh, setDataUsersRefresh] = useState();
  const [loading, setLoading] = useState(false);
  const [selectSearchData, setSelectSearchData] = useState('');
  const [selectValue1, setSelectValue1] = useState('');
  // console.log("dataUsersRefresh",dataUsersRefresh);
  const [usersLength, setUsersLength] = useState();
  const extraField ='fullname';
  const extraOrder = 'ASC';
  const [visibleColumns, setVisibleColumns] = useState(false);

  const [newDataColumns1, setNewDataColumns1] = useState([]);
  // const [displayColumns, setDisplayColumns] = useState([...setShowColumnArr]);
  console.log("usersLength",usersLength);

  const [currentDisplayColumns, setCurrentDisplayColumns] = useState([...setShowColumnArr]);
  const [defaultShowColumn, setDefaultShowColumn] = useState({...setShowColumn});
  
  const [textErrorSelectColumn, setTextErrorSelectColumn] = useState('');
  const [recordPerPage, setRecordPerPage] = useState(1000);
  const [defaultCurrentConst, setDefaultCurrentConst] = useState(1);
  const [pageSizeOptionsConst, setPageSizeOptionsConst] = useState([
    '2',
    '4',
    '8',
    '10',
    '16',
  ]);
  const [showSizeChangerConst, setShowSizeChangerConst] = useState(true);
  const [keyword, setKeyword] = useState();
  const [refreshTable, setRefreshTable] = useState(false);

  useEffect( () => {
    const fetchData = async () => {
    await Lang();
    }
    fetchData() 
  }, [keyword, refreshTable]);

  useEffect(() => {
    setNewDataColumns1(dataColumns1);
  }, [labelShow, dataUsersRefresh]);

  // get data จาก button value เพื่อนำมาเปลี่ยนภาษา จากหน้า userMenu
  localStorage.getItem('newColumns2');
  const memComId = localStorage.getItem('memComId');
  const comId = localStorage.getItem('comId');
  const pageCode = localStorage.getItem('pageCode');
  const langValue = localStorage.getItem('langValue');

  // ส่วนของการเรียกใช้ภาษา
  const Lang = async () => {
    const res = await Language({
      companyId: comId,
      lang: langValue,
      pageCode: pageCode,
    });
    setLabelShow(res);
    loadContent();
  };

  const loadContent = async (field, order, pageSize, current) => {
    setLoading(true);
    const exField = field === undefined ? extraField : field;
    const exOrder = order === undefined ? extraOrder : order;
    // const exField = field ? field : 'fullname';
    // const exOrder = order ? order : 'ASC';
    const record = pageSize == undefined ? `${recordPerPage}` : pageSize;
    const checkCurrent = current == undefined ? `${defaultCurrentConst}` : current;

    let setSelect = selectSearchData == undefined ? '' : selectSearchData;
    let setValue = keyword == undefined ? '' : keyword;

    const key = setSelect;
    const val = setValue.toLowerCase();

    const bodyData = {
      user_id: memComId,
      like: [],
      equal: [],
      date: [],
      order: `${exField} ${exOrder}`,
      limit: `${record}`,
      index_page: `${checkCurrent}`,
    };

    if (val) {
      if(key === 'status_connection') {      
        if ('active'.indexOf(val) !== -1) {
          bodyData.equal.push(
            { key: `${key}`, val: `Active` }
          );
        } else if ('in active'.indexOf(val) !== -1) {
          bodyData.equal.push(
            { key: `${key}`, val: `In active` }
          );
        } else {
          bodyData.equal.push(
            { key: `${key}`, val: `${val}` }
          );
        }
      } 
      else {
        bodyData.like.push(
          { key: `${key}`, val: `${val}` }
        );
      }
    }

    try {
        const axiosConfig = {
          headers: {
            'content-type': 'application/json',
          },
        };
        client.defaults.baseURL = `${process.env.REACT_APP_URL_MANAGER}`;
        const result = await client.post("/v2/searchusers", bodyData, axiosConfig);
        const users = result.data.data;
        const usersTotal = result.data.total_record ? result.data.total_record : 0;
        setLoading(false);
        if (users) {
          setDataTable(users, pageSize, current);
          setUsersLength(usersTotal);
        } else {
          setDataTable([], pageSize, current);
          setUsersLength(usersTotal);
        }
    } catch (error) {
      console.log(error);
    }
  };

  const setDataTable = (users, pageSize, current) => {
    if (users) {
      users.map((item, key) => {
        return (
          item.pageSize = pageSize || 10,
          item.pageCurrent = current || 1
        )
      })
      setDataUsers(users);
    }
  };

  const handleChange = (pagination, sorter, extra) => {
    let field = extra.field;   
    let order = extra.order === 'descend' ? 'DESC' : 'ASC';
    let current = pagination.current;
    let pageSize = pagination.pageSize;
    loadContent(field, order, pageSize, current);
  };

  const successNotification = (message) => {
    notification.success({
      icon: <Icon type="check-circle" style={{ color: '#fe6202' }} />,
      message: message,
    });
  };

  const deleteId = async (mem_com_id) => {
    const data = {
      client_id: 'admin-cli',
      grant_type: 'password',
      username: 'admin',
      password: 'admin',
    };
    const axiosConfig = {
      Header: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    };
    client.defaults.baseURL = `${process.env.REACT_APP_KEYCLOAK_URL}`;
    const res = await client.post(
      `/auth/realms/${process.env.REACT_APP_KEYCLOAK_REALM}/protocol/openid-connect/token`,
      qs.stringify(data),
      axiosConfig,
    );
    
    let tokens = res.data.access_token;
    try {
      client.defaults.baseURL = `${process.env.REACT_APP_URL_MANAGER}`;
      const reset = await client.delete(`/v2/user/${memComId}/${mem_com_id}/`);

      if (reset.status === 200) {
        client.defaults.baseURL = `${process.env.REACT_APP_KEYCLOAK_URL}`;
        client.defaults.headers = {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Bearer ${tokens}`,
        };
        successNotification(reset.data.data);
        setRefreshTable(!refreshTable);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // event input search
  const handleSearch = debounce((keyword) => {
    setKeyword(keyword);
  }, 500);

  // event SelectData
  const handleSelectData = (value) => {
    setSelectSearchData(value);
    setSelectValue1(value);
  };

  const showTotal = (total) => {
    return (
      <span>{labelShow.pageSize ? labelShow.pageSize : 'Rows per page:'}</span>
    );
  };

  const checkedValueColumns = (e) => { 
    let checked = e.target.checked;
    let val = e.target.value;
    let showColumn = { ...defaultShowColumn };
    if (checked == true) {
      const found = currentDisplayColumns.find((element) => element == val);
      if (found == undefined) {
        setCurrentDisplayColumns([...currentDisplayColumns, val]);
      }
      showColumn[val] = true;
    } else {
      const newListArray = [...currentDisplayColumns];
      const found = currentDisplayColumns.findIndex((element) => element == val);
      if (found >= 0) {
        newListArray.splice(found, 1);
        setCurrentDisplayColumns(newListArray);
      }
      showColumn[val] = false;
    }
    setDefaultShowColumn(showColumn);
  };

  const handleOnVisibleColumns = () => {
    console.log('visibleColumns***** ', !visibleColumns)
    setVisibleColumns(!visibleColumns);
  };

  const handleCheckOk = () => {
    const setNewArr = [];
    if (currentDisplayColumns.length <= 2) {
      setTextErrorSelectColumn(labelShow.errorSelectColumn ? labelShow.errorSelectColumn : 'Select at least 1 column.');
      return;
    } else {
      setTextErrorSelectColumn('');
    }

    for (let i = 0; i < allColumns.length; i++) {
      const found = currentDisplayColumns.find(
        (element) => element == allColumns[i].key,
      );
      if (found != undefined) {
        setNewArr.push(allColumns[i]);
      }
    }
    console.log('setNewArr: ', setNewArr)

    setNewDataColumns1(setNewArr);
    handleOnVisibleColumns();
  };

  const handleReset = () => {
    const newListArrayColumns = [];
    dataColumns1.forEach((element) => {
      newListArrayColumns.push(element.key);
    });
    setNewDataColumns1(dataColumns1);
    setCurrentDisplayColumns(newListArrayColumns);
    handleOnVisibleColumns();
    setDefaultShowColumn(setShowColumn);
    setTextErrorSelectColumn('');
  };

  const functionCallOK = (value) => {
      setDataUsersRefresh(value);
  }

  const menuColumn = () => {
    return (
      <Menu>
        <Menu.Item>
          {selectableColumns.map((item, i) => (
            <div key={i} style={{ display: 'block', marginBottom: '10px' }}>
              <Checkbox
                value={item.key}
                onChange={checkedValueColumns}
                checked={defaultShowColumn[item.key] ? true : false}
              >
                {item.title}
              </Checkbox>
            </div>
          ))}
        </Menu.Item>

        <Menu.Item style={{ color: '#FF1C00', textAlign: 'left' }}>
          {textErrorSelectColumn}
          {/* {labelShow.rrorSelectColumn ? labelShow.ok : 'OK'} */}
        </Menu.Item>

        <Menu.Item>
          <ButtonGroup style={{ display: 'flex', justifyContent: 'center' }}>
            <Button onClick={handleCheckOk}>
              {labelShow.ok ? labelShow.ok : 'OK'}
            </Button>
            <Button onClick={handleReset}>
              {labelShow.reset ? labelShow.reset : 'Reset'}
            </Button>
          </ButtonGroup>
        </Menu.Item>
      </Menu>
    );
  };

  const content = (users, labelShow) => {
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
      // <div>
      //   <Button className="styledPopDelete">
      //     {labelShow.edit ? labelShow.edit : 'Edit'}
      //   </Button>
      //   <br />
      //   <Button className="styledPopDelete" onClick={() => confirm(users)}>
      //     {labelShow.delete ? labelShow.delete : 'Delete'}
      //   </Button>
      // </div> 

      <Menu style={{ width: 100 }} align='center'>
        <Menu.Item >
          {labelShow.edit ? labelShow.edit : 'Edit'}
        </Menu.Item>
        <Menu.Item onClick={() => confirm(users)}>
          {labelShow.delete ? labelShow.delete : 'Delete'}
        </Menu.Item>
      </Menu>
    );
  };

  return (
    <div className="componentUsers" style={{ marginTop: 10}}>
      <Card className="card" style={{ padding: 10}} title={labelShow.user ? labelShow.user : "User"} >
        <Row className="styled-row">
          <Col span={12} className="styled-col-input">
            <Row>
              <List.Item>
                <Input
                  className="styledAppInput"
                  onChange={e => handleSearch(e.target.value)}
                  placeholder={labelShow.search ? labelShow.search : 'Search'}
                  prefix={<Icon type="search" />}
                />
                <Select
                  className="styledAppSelect"
                  onChange={handleSelectData}
                  value={selectValue1}
                >
                  <Option value="">
                    {labelShow.allColumns
                      ? labelShow.allColumns
                      : 'All columns'}
                  </Option>
                  {searchColumns.map((item, i) => (
                    <Option key={i} value={item.key}>
                      {item.title}
                    </Option>
                  ))}
                </Select>
              </List.Item>
            </Row>
          </Col>
          <Col span={12} className="styled-col-select">
            <Row>
              <List.Item style={{ float: 'right' }}>
                <Dropdown overlay={menuColumn} visible={visibleColumns}>
                  <StyledButton
                    type="primary"
                    className="ant-dropdown-link"
                    onClick={handleOnVisibleColumns}
                  >
                    {labelShow.columns ? labelShow.columns : 'Columns'}{' '}
                    <Icon type="down" />
                  </StyledButton>
                </Dropdown>
                <InviteUsers comId={comId} lang="TH" pageCode={pageCode} labelShow={labelShow}/>
              </List.Item>
            </Row>
          </Col>
        </Row>
        {/* Table dataSource ของ User ทั้งหมด */}
        <AppTable
          style={{ marginTop: 10 }}
          size={'middle'}
          columns={newDataColumns1}
          dataSource={dataUsers}
          loading={loading}
          onChange={handleChange}
          pagination={{
            total: usersLength,
            showTotal: showTotal,
            defaultCurrent: defaultCurrentConst,
            // defaultPageSize: defaultPageSizeConst,
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
            marginLeft: '5px',
          }}
        >
          <span>
            {labelShow.total ? labelShow.total : 'Total'}
            {` ${usersLength} `}
            {labelShow.items ? labelShow.items : 'items'}
          </span>
        </div>
      </Card>
    </div>
  );
};

const StyledButton = styled(Button)`
  margin: 5px;
  border-radius: 5%;
  box-shadow: 'none';
  height: 32px;
  background-color: #fe6202;
  border-color: #fe6202;
  color: #ffffff;
`;

export default AppUsers;
