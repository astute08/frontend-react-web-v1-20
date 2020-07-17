import React, { useState, useEffect, createContext, useContext } from 'react';
import httpClient from '../../components/axiosClient';
import _ from 'lodash';

const AppContext = createContext();

const AppProvider = (props) => {
  const { children, comId } = props;
  const [orgId, setOrgId] = useState();
  const [parentId, setParentId] = useState();
  const [organizations, setOrganizations] = useState([]);
  const [organizationsDetail, setOrganizationsDetail] = useState({});
  const [organizationsContacts, setOrganizationsContacts] = useState([]);
  const [organizationsApprovers, setOrganizationsApprovers] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [addNewOrganization, setAddNewOrganization] = useState(true);
  const [users, setUsers] = useState([]);
  const [requestType, setRequestType] = useState([]);
  const [members, setMembers] = useState([]);
  const [shifts, setShifts] = useState([]);

  useEffect(() => {
    getOrganization();
    getUsers();
    getRequestType();
  }, [orgId, refresh]);

  const getOrganization = async () => {
    const data = {
      com_id: comId,
      org_id: orgId,
      search_team: {
        name: '',
      },
      members: {
        conditional: [],
        order: 'fullname ASC',
        limit: '10',
        index_page: '1',
      },
      services: {},
      shift: {},
    };

    const response = await httpClient.post('/v2/organizationdetails', data);
    if (response.status === 200) {
      // console.log('organizationdetails : ', response);
      const data = [...response.data.treeTeams];
      const teamMember = _.isObject(response.data.members) ? response.data.members.data : [];
      const teamShift = _.isObject(response.data.shift) ? response.data.shift : [];
      const teamDetails = _.isObject(response.data.organization) ? response.data.organization.teamDetails[0] : response.data.teamDetails;
      const teamType = _.isObject(response.data.organization) ? response.data.organization.teamType : response.data.teamType;
      const detail = {
        ...teamDetails,
        teamType: [...teamType],
      };
      const contacts = _.isObject(response.data.organization) ? [...response.data.organization.teamContact] : [...response.data.teamContact];
      const approvers = _.isObject(response.data.organization) ? [...response.data.organization.teamApprover] : [...response.data.teamApprover];
      // console.log("approvers : ", approvers);
      setOrganizations(data);
      setOrganizationsDetail(detail);
      setOrganizationsContacts(contacts);
      setOrganizationsApprovers(approvers);
      setMembers(teamMember);
      setShifts(teamShift);
    }
  };

  const getUsers = async () => {
    try {
      const response = await httpClient.get(`/v2/users/${comId}`);
      if(response.status === 200) {
        // console.log('getUsers : ', response);
        setUsers(response.data);
      }
    }
    catch (error) {
      console.log(error);
    }
  };

  const getRequestType = async () => {
    try {
      const response = await httpClient.get(`/v2/request/type/${comId}`);
      // console.log('getRequestType : ', response);
      if(response.status === 200) {
        setRequestType([...response.data]);
      }
    }
    catch (error) {
      console.log(error);
    }
  }

  const getRefresh = () => {
    setRefresh(!refresh);
  };

  return (
    <AppContext.Provider
      value={{
        state: {
          comId,
          orgId,
          parentId,
          organizations,
          organizationsDetail,
          organizationsContacts,
          organizationsApprovers,
          refresh,
          addNewOrganization,
          users,
          requestType,
          members,
          shifts
        },
        fnc: {
          setOrgId,
          setParentId,
          setOrganizations,
          setOrganizationsDetail,
          setOrganizationsContacts,
          setOrganizationsApprovers,
          setRefresh,
          getRefresh,
          setAddNewOrganization,
          setUsers,
          setRequestType,
          setMembers,
          setShifts
        },
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

const useAppContext = () => useContext(AppContext);

export default {
  AppProvider,
  useAppContext,
};
