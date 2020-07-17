import React, { useState, useEffect } from 'react';
import Table from '../../../components/v2/table';
import ActionTable from './actionTable';
import { Icon, Popover, Modal, Badge, Transfer, notification, List } from 'antd';
import { Link } from 'react-router-dom';
import { debounce } from 'lodash';

import HttpClient from '../../../components/httpClient';
import modalMember from './modalMember';

let client = HttpClient();

export default (props) => {
    // console.log('Props Table:: ', props);
    const updated_by = 1
    // const [dataSource, setDataSource] = useState([]);
    // console.log('dataSource: ', dataSource);

    const columns = [
        {
            id: 0,
            title: '#',
            align: 'center',
            width: 70,
            dataIndex: 'row_index',
            key: 'row_index',
            render: (text, record, index) => {
              // console.log('record: ', record);
              return ((parseInt(record.pageCurrent - 1) * parseInt(record.pageSize)) + (index + 1));
            }
        },
        {
          title: 'Name',
          select: 'Name',
          dataIndex: 'fullname',
          key: 'fullname',
          sorter: (a, b) => a.fullname.length - b.fullname.length,
          sortDirections: ['descend', 'ascend'],
          render: (text, record, index) => {
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
          }
        },
        {
          title: 'Phone Number',
          select: 'Phone Number',
          dataIndex: 'phone',
          key: 'phone',
          sorter: (a, b) => a.phone.length - b.phone.length,
          sortDirections: ['descend', 'ascend'],
          render: (text, record, index) => {
            return (record.phone ? record.phone : '-');
          }
        },
        {
          title: 'Email',
          select: 'Email',
          dataIndex: 'email',
          key: 'email',
          sorter: (a, b) => a.email.length - b.email.length,
          sortDirections: ['descend', 'ascend'],
          render: (text, record, index) => {
            return (record.email ? record.email : '-');
          }
        },
        {
          title: 'Online',
          select: 'Online',
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
          title: 'Status',
          select: 'Status',
          key: 'status_work',
          dataIndex: 'status_work',
          sorter: (a, b) => a.status_work.length - b.status_work.length,
          sortDirections: ['descend', 'ascend'],
          render: (text, record, index) => {
            const resultsStatus = () => {
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
            return (
              resultsStatus()
            )
          }
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
                <Popover onClick={() => handleDelete(record)} placement="leftTop">
                    <Icon type="delete" />
                </Popover>
              )
            )
          }
        }
    ];

    const setShowColumn = {
        row_index: true,
        fullname: true,
        phone: true,
        email: true,
        status_connection: true,
        status_work: false,
        options: true
    };
      
    const setShowColumnArr = [
        'row_index',
        'fullname',
        'phone',
        'email',
        'status_connection',
        'options'
    ];

    const dataColumns = [...columns];
    dataColumns.splice(5, 1);

    const [comId, setComId] = useState();
    const [orgId, setOrgId] = useState();
    const [exdata, setData] = useState([]);
    const [dataSource, setDataSource] = useState([]);
    const [total, setTotal] = useState();
    const [loading, setLoading] = useState(false);

    const [visible, setVisible] = useState(false);
    const [defaultShowColumn, setDefaultShowColumn] = useState({...setShowColumn});
    const [listArrayColumns, setListArrayColumns] = useState([...setShowColumnArr]);
    const [textErrorSelectColumn, setTextErrorSelectColumn] = useState('');
    const [newDataColumns, setNewDataColumns] = useState([...dataColumns]);

    const [extraField, setExtraField] = useState('fullname');
    const [extraOrder, setExtraOrder] = useState('ASC');
    const [recordPerPage, setRecordPerPage] = useState(1000);
    const [defaultCurrentConst, setDefaultCurrentConst] = useState(1);
    const [pageSizeOptionsConst, setPageSizeOptionsConst] = useState(['2', '4', '8', '10']);
    const [showSizeChangerConst, setShowSizeChangerConst] = useState(true);
    const [selectSearchData, setSelectSearchData] = useState("");
    const [fieldChang, setFieldChang] = useState("");
    const [refreshTable, setRefreshTable] = useState(false);

    useEffect(() => {
        loadMembers();
        defaultColumns();
        setComId(props.comId);
        setOrgId(props.orgId);
      }, [props, fieldChang, refreshTable]);

    const loadMembers = async (field, order, pageSize, current) => {
      setLoading(true);
      let exField = field === undefined ? extraField : field;
      let exOrder = order === undefined ? extraOrder : order;
      const record = pageSize === undefined ? `${recordPerPage}` : pageSize;
      const checkCurrent = current === undefined ? `${defaultCurrentConst}` : current;
      
      let setSelect = selectSearchData === undefined ? '' : selectSearchData;
      let setValue = fieldChang === undefined ? '' : fieldChang;

      const key = setSelect
      const val = setValue.toLowerCase();

      // console.log('val:: ', val)
      
      const body = {
        "com_id": props.comId,
        "org_id": props.orgId,
        "search_team": {
            "name":""
        },
        "members":{
            "conditional": [],
            "order": `${exField} ${exOrder}`,
            "limit": '500',
            "index_page": '1'
        },
        "services":{},
        "shift":{}
      }

      // if (val) {
      //   if(setSelect === "") {
      //       let arr = Object.keys(defaultShowColumn)
      //       arr.forEach( col =>{
      //         if(defaultShowColumn[`${col}`] && col !== 'row_index' && col !== 'options'){
      //           body.members.conditional.push(
      //             { key: `${col}`, val: `${val}`, type: `like` }
      //           );
      //         }
      //       } )
            
      //   } else {
      //     body.members.conditional.push(
      //       { key: `${key}`, val: `${val}`, type: `like` }
      //     );
      //   }
      //   console.log(body, ">>>>>>>>>>>>>>>>")
      // } 

      if (val) {
        if(setSelect === 'status_connection') {      
          if ('active'.indexOf(val) !== -1) {
            body.members.conditional.push(
              { key: `${key}`, val: `Active`, type: `equal` }
            );
          } else if ('in active'.indexOf(val) !== -1) {
            body.members.conditional.push(
              { key: `${key}`, val: `In Active`, type: `equal` }
            );
          } else {
            body.members.conditional.push(
              { key: `${key}`, val: `${val}`, type: `equal` }
            );
          }
        } else if (setSelect === 'status_work') {      
          if ('enable'.indexOf(val) !== -1) {
            body.members.conditional.push(
              { key: `${key}`, val: `Enable`, type: `equal` }
            );
          } else if ('disable'.indexOf(val) !== -1) {
            body.members.conditional.push(
              { key: `${key}`, val: `Disable`, type: `equal` }
            );
          } else {
            body.members.conditional.push(
              { key: `${key}`, val: `${val}`, type: `equal` }
            );
          } 
        }
        else {
          body.members.conditional.push(
            { key: `${key}`, val: `${val}`, type: `like` }
          );
        }
      }

      try {
        const result = await client.post('/v2/organizationdetails', body);
        const members = result.data.members.data;
        // console.log('members::: ', result);
        setTotal(result.data.members.totalMembers);
        setLoading(false);
        if (result.data.reject !== undefined) {
          membersTable(exdata, pageSize, current);
        } else {
          membersTable(members, pageSize, current);
        }

      } catch (error) {
        console.log(error);
      }
    };

    const handleOnVisiblecolumns = () => {
      setVisible(!visible);
    };

    const handleVisibleChange = flag => {
      // console.log('flag: ', flag)
      setVisible(flag);
    };

    const hideLangMenu = () => {
      setVisible(false)
    }

    const membersTable = (members, pageSize, current) => {
      if (members) {
        members.map((item, key) => {
          return (
            item.pageSize = pageSize || 10,
            item.pageCurrent = current || 1
          )
        })
        setDataSource(members);
      }
    }

  const defaultColumns = () => {
    const setNewColumnsArr = [];
    for (let i = 0; i < dataColumns.length; i++) {
        if (dataColumns[i].dataIndex != 'status_work') {
        setNewColumnsArr.push(dataColumns[i].dataIndex);
        }
    }
  };

  const handleDelete = (member) => {
      // console.log('delete membersID:: ', member)
      Modal.confirm({
        icon: <Icon type="delete" style={{ color: '#FF0000' }} />,
        title: 'Are you sure to delete ?',
        okText: 'OK',
        cancelText: 'Cancle',
        onOk () {
          deleteMember(member.mem_org_id)
        },
        onCancel() {
          console.log('Cancel');
        },
      });
  };

  const deleteMember = async (mem_org_id) => {
    // console.log('Member Delete::**', dataSource);

    try {
        const result = await client.delete(`/v2/team/${updated_by}/${mem_org_id}`);
        // console.log('result delete:: ', result);
        deletedNotification(result.data.data);
        setRefreshTable(!refreshTable);
        // const update = dataSource.filter(dataUser => dataUser.mem_org_id !== mem_org_id);
        // console.log('update++:: ', update);
        // setDataSource(update);

    } catch (error) {
      console.log(error);
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
      // console.log('found::: ', found);
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
      // console.log('listArrayColumns', listArrayColumns);
    
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
      

    const handleCancel = (e) => {
        console.log(e);
    };

    const handleSave = (e) => {
        console.log(e);
    };

    const handleChange = (pagination, sorter, extra) => {
      let field = extra.field;
      let order = extra.order === 'descend' ? 'DESC' : 'ASC';
      let current = pagination.current;
      let pageSize = pagination.pageSize;
      loadMembers(field, order, pageSize, current);
    };

    const deletedNotification = (message) => {
      notification.success({
        icon: <Icon type="check-circle" style={{ color: '#fe6202' }} />,
        message: message,
      });
    };

    const showTotal = (total) => {
      return (
          <span>Rows per page: </span>
      );
    };

    return(
        <div>
            <ActionTable 
                columns={columns}
                onChange={handleSearch}
                onSelect={handleSelectData}
                selectSearchData={selectSearchData}
                checkedValuecolumns={checkedValuecolumns}
                checked={defaultShowColumn}
                handleReset={handleReset}
                handleCheckOk={handleCheckOk}
                visible={visible}
                handleOnVisiblecolumns={handleOnVisiblecolumns}
                handleVisibleChange={handleVisibleChange}
                textErrorSelectColumn={textErrorSelectColumn}
                // dataMembers={props.members.data}
                // dataMembers={dataMembers}
                dataMembers={dataSource}
                comId={props.orgId}
                // onBlur={hideLangMenu}
            />
            <Table
              size={'middle'}
              sizeWidth={'lg'}
              columns={newDataColumns} 
              dataSource={dataSource}
              onChange={handleChange}
              loading={loading}
              pagination={{
                total: total,
                showTotal: showTotal,
                defaultCurrent: defaultCurrentConst,
                // defaultPageSize: defaultPageSizeConst,
                pageSizeOptions: pageSizeOptionsConst,
                showSizeChanger: showSizeChangerConst,
                locale: { items_per_page: '' },
              }}
            />
            <div style={{display: 'flex', position: 'relative', marginTop: '-60px', marginLeft: '10px'}}>
              <span>
                  Total {`${total}`} items
              </span>
            </div>
        </div>
    )
}
