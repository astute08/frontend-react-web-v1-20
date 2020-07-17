import React, { useState } from 'react';
import { Button, Icon, Popover, Menu, Avatar } from 'antd';
import '../css/rightMenu.css';
import { useAppContext } from '../../../includes/indexProvider';
import _ from 'lodash';
import styled from 'styled-components';
import httpClient from '../../../components/axiosClient';

const LogoAvatar = styled(Avatar)`
  box-shadow: 0 0px 5px 0 rgba(215, 215, 215);
`;

const LabelCompanyName = styled.span`
  margin-left: 25px;
`;

export default (props) => {
  const app = useAppContext();
  const userId = app.state.userId;
  const fullName = app.state.fullName;
  const email = app.state.email;
  const comId = app.state.comId;
  const comName = app.state.comName;
  const companies = _.isObject(app.state.dataUser) ? app.state.dataUser.companies : [];
  
  // console.log('localStorage : ', app.state.dataUser);

  const CompanyMenu = () => {

    const handleSelectCompany = async ({ item, key }) => {
      const { id, name } = item.props;
      try {
        const response = await httpClient.post(`/v2/login`, {
          'user_id': userId,
          'user_name': fullName,
          'email': email,
          'company_id': id,
          'company_name': name
        });

        if(response.status === 200) {
          if(_.size(response.data) > 0) {
            console.log(response);
            localStorage.setItem('comId', key);
            localStorage.setItem('comName', name);
            localStorage.setItem('companyId', id);
            localStorage.setItem('memComId', response.data[0].mem_com_id);
            
            if(window.location.pathname.indexOf('/menu/users/') >= 0) {
              window.location.href = '/menu/user';
            }
            else {
              window.location.reload();
            }
            // console.log('handleSelectCompany : ', window.location.pathname);
          }
          else {
            console.log('handleSelectCompany : not found!');
          }
        }
      }
      catch (error) {
        console.log('handleSelectCompany : ', error);
      }
    };

    const list = companies.map((obj, i) => {
      return (
        <Menu.Item key={obj.com_id} name={obj.name} id={obj.keycloak_groups_id} style={{height: 45}}>
          {/* {!obj.logo ? <LogoAvatar>C</LogoAvatar> : <LogoAvatar src={`http://192.168.11.181:8200${obj.logo}`} />} */}
          {!obj.logo ? <LogoAvatar>C</LogoAvatar> : <LogoAvatar src={`${process.env.REACT_APP_URL_MANAGER_ADD_PORT}` + obj.logo} />}
          <LabelCompanyName>{obj.name}</LabelCompanyName>
        </Menu.Item>
      );
    });

    return (
      <Menu
        style={{ width: 224 }}
        defaultSelectedKeys={[comId]}
        mode={'vertical'}
        theme={'light'}
        onSelect={handleSelectCompany}
      >
        {list}
      </Menu>
    );
  };


  return (
    <Popover placement="bottomRight" content={<CompanyMenu />} trigger="click">
      <Button className="kgt-btn-style">
        <Icon type="appstore" className="icon-button" />
        {comName}
      </Button>
    </Popover>
  );
};
