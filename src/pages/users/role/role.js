import React, { useState, useEffect } from 'react';
import { Row, Col } from 'antd';
// import RoleModal from './memberModal';
import RoleTree from './roleTree';
import RoleDetail from './roleDetail';
import { add } from 'lodash';
import httpClient from '../../../components/httpClientRole';


export default () => {

  const [gData, setGData] = useState([]);
  const [organizationTree, setOrganizationTree] = useState([]);
  const [addNew, setAddNew] = useState();
  const [menu, setMenu] = useState();
  const [objMenu, setObjMenu] = useState();
  const [name, setName] = useState(false);
  const [onDataTable, setOnDataTable] = useState();
  const [onDataTransfer, setOnDataTransfer] = useState();
  const perGroId = objMenu ? objMenu.eventKey : 0;
  const comId = localStorage.getItem("comId"); // get company id 

  // console.log("perGroId", addNew);
  console.log("objMenu", objMenu ? objMenu.eventKey : "");


  const roleData = async () => {
    const response = await httpClient.get('/company/1/role');
    setMenu(response.data.data);
  }

  const roleUpdate = async (roleName) => {
    const data = {
      "name": roleName,
      "description": ""

    }
    const response = await httpClient.put(`/company/1/role/${perGroId}`, data);
    if (response.status === 200) {
      setTimeout(() => {
        window.location.reload();
      },
        1000
      );

    }
  }

  const roleCreate = async (roleName) => {
    const data = {
      "name": roleName,
      "description": ""
    }
    const response = await httpClient.post('/company/1/role', data);
    if (response.status === 200) {
      setTimeout(() => {
        window.location.reload();
      },
        1000
      );

    }

  }

  const roleTable = async (per_gro_id) => {
    const response = await httpClient.get(`/company/1/permissionGroup/${per_gro_id}/member`);

    if (response.status === 200) {
      const data = response.data.data.length > 0 ? response.data.data : [];
      setOnDataTable(data);

      console.log("response.status", data);

    } else {
      console.log("No data");
    }

    // console.log("AAAAAAAAAAAAAAAA", response.data.data);

  }

  const roleTransfer = async (per_gro_id) => {
    const response = await httpClient.get(`company/1/permissionGroup/${per_gro_id}/member/add`);
    if (response.status === 200) {
      // console.log("AAAAAAAAAAAAAAAA", response.data.data);
      setOnDataTransfer(response.data.data);

    }
  }

  const roleTransferCreate = async (member) => {
    console.log("member",member);
    const data = {
      "member": member
    }
    const response = await httpClient.post(`company/1/permissionGroup/${perGroId}/member/create`, data);
    if (response.status === 200) {
      console.log("AAAAAAAAAAAAAAAA", response.data.data);
      setOnDataTransfer(response.data.data);
    }
  }


  useEffect(() => {
    // alert("Hello");
    roleData();
  }, [name == true])

  useEffect(() => {
    roleTransfer();
  }, [])

  const onAddNewClick = (value) => {
    setAddNew(value);
  }

  const callFuncOnClick = (value) => {
    setObjMenu(value.item.props);
    setAddNew(false);
    roleTable(value.item.props.eventKey);
    roleTransfer(value.item.props.eventKey);

    console.log("setObjMenu", value.item.props.eventKey);
  }

  const callOnSaveRoleName = (value) => {
    setName(true);
    // window.location.reload();
    roleCreate(value);

  }

  const callFuncShowModal = (value) => {
    console.log("callFuncShowModal", value);
  }

  const callHandleOk = (value) => {
    console.log("callHandleOk", value);
    roleTransferCreate(value);

  }


  return (
    <div className="organization">
      <Row gutter={[16, 16]} style={{ margin: 0 }}>
        <Col span={6}>
          <RoleTree handleName={onAddNewClick} menu={menu} name={name} callFuncOnClick={callFuncOnClick} />
        </Col>
        <Col span={18}>
          {perGroId ? <RoleDetail perGroId = {perGroId} addNew={addNew} objMenu={objMenu} onDataTransfer={onDataTransfer} callOnSaveRoleName={callOnSaveRoleName} callFuncShowModal={callFuncShowModal} onDataTable={onDataTable} callHandleOk={callHandleOk} /> : null}
        </Col>

      </Row>
    </div>
  );
}