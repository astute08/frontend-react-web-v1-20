import React, { useState, useEffect } from 'react';
import { Modal, Button, notification, Spin, Icon } from 'antd';
import Tag from './tag';
import Role from './role';
import ApiInvite from '../../../components/httpClient';
import GetLang from '../../../includes/language';

import '../css/inviteUser.css';

let client = ApiInvite();
const { confirm } = Modal;


export default (props) => {

    const [visible, setVisible] = useState(false);
    const [roleSelectOption, setRoleSelectOption] = useState([]);
    const [roleId, setRoleId] = useState([]);
    const [roleName, setRoleName] = useState([]);
    const [refreshState, setRefreshState] = useState();
    const [labelShow, setLabelShow] = useState({});

    const [roleSelected, setRoleSelected] = useState();
    const [tagSelected, setTagSelected] = useState();
    const [inviteData, setInviteData] = useState(true);
    const [data, setData] = useState();

    localStorage.setItem('roleSelect', JSON.stringify(roleSelectOption));
    localStorage.setItem('roleId', JSON.stringify(roleId));
    localStorage.setItem('roleName', JSON.stringify(roleName));

    // get data localStorage มาจาก component จากหน้า login เข้ามาตอนแรก func อยู่ที่ company
    const memComId = localStorage.getItem('memComId');
    const comId = localStorage.getItem('comId');

    const getRoleFunction = (role) => {
        console.log("data_from_role:::", role);
        setRoleSelected(role);
        checkValueSelected();

    }

    const getTagFunction = (tag) => {
        console.log("data_from_tag::::", tag);
        setTagSelected(tag);
        checkValueSelected();

    }

    // ฟังชันส์ ทำการเช็คข้อมูลที่ input เข้ามา เพื่อ disable/enable ปุ่ม invite
    const checkValueSelected = () => {
        if (roleSelected == undefined || roleSelected == "" || tagSelected == undefined || tagSelected == "") {
            setInviteData(true);
        }
        else {
            setInviteData(false);
        }
    }

    useEffect(() => {
        getRoleApi();
        Lang();

    }, [])

    useEffect(() => {
        checkValueSelected();
        // console.log("checkValueSelected:::=>", roleSelected, tagSelected);
    }, [roleSelected, tagSelected])

    // get data จาก button value เพื่อนำมาเปลี่ยนภาษา จากหน้า userMenu
    const langValue = localStorage.getItem('langValue');

    // console.log("Lang Body", props.comId, "DD", langValue, "ddd", props.pageCode);

    // ส่วนของการเรียกใช้ภาษา
    const Lang = async () => {
        const res = await GetLang({ companyId: props.comId, lang: langValue, pageCode: props.pageCode });
        setLabelShow(res);
    };

    const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;




    const getApi = async (email, role) => {
        console.log("Api email role.", email, role, comId, memComId);
        const data = {
            "company_id": comId,
            "created_by": memComId,
            "email": email,
            "role": role
        }

        client.defaults.headers = {
            'Content-Type': 'application/json',
        };
        //comid, mem_com_id
        const res = await client.post(`/v2/invite`, data);
        const reponseText = res.data.data;

        console.log("reponseText", res);
        if (res.data.status == 200) {
            successNotification('success', reponseText);
            setData(res);
            // window.location.reload();

            setTimeout(() => {
                window.location.reload();
            },
                1500
            );
        }
        else if (res.status == 202) {
            successNotification('error', reponseText ? reponseText : "These users have invited already");

        }

    };

    const getRoleApi = async (id) => {
        try {

            const res = await client.get(`/v2/permissiongroups/${memComId}`);

            let newCompany = [];
            let newCompanyId = [];
            let newCompanyName = [];
            for (let i = 0; i < res.data.length; i++) {

                newCompany.push(res.data[i]);
                newCompanyId.push(`${res.data[i].per_gro_id}`);
                newCompanyName.push(`${res.data[i].name}`);

            }
            setRoleSelectOption(newCompany);
            setRoleId(newCompanyId);
            setRoleName(newCompanyName);


        } catch (error) {
            console.log(error.response);

        }

    }
    // setUserDetail(res.data[0]);

    const showModal = () => {
        setVisible(true);
    };

    const handleOk = (e) => {
        setVisible(false);
        // setEmail(JSON.parse(localStorage.getItem('emailTag')));
        const email = JSON.parse(localStorage.getItem('emailTag'));
        const role = JSON.parse(localStorage.getItem('selectedRole'));

        getApi(email, role);
        setRefreshState("OK");

    }

    const handleCancel = (e) => {
        setVisible(false);
        setRoleSelected();
        setTagSelected();
    }

    // notification เมื่อ invite สำเร็จ เป็น response เพื่อให้ user รู้
    const successNotification = (type, e) => {
        notification[type]({
            message: e,
            duration: 4.5,
        });
    };

    return (
        
        <div style={{ textAlign: 'center' }}>
            <Button type="primary" onClick={showModal}>
                <span> {labelShow.invite_users ? labelShow.invite_users : "Invite Users"}</span>
            </Button>
            
            <Modal
                className={'modal-style'}
                title={<span className='title-modal-text'> {labelShow.invite_users ? labelShow.invite_users : "Invite Users"}</span>}
                visible={visible}
                onOk={handleOk}
                okText={<span> {labelShow.invite_button ? labelShow.invite_button : "Invite Users"}</span>}
                okButtonProps={{ disabled: inviteData }}
                onCancel={handleCancel}
                cancelText={<span> {labelShow.cancel_button ? labelShow.cancel_button : "Cancel"}</span>}
                cancelButtonProps='primary'
            >
                <span className='suggest-text-style'>{labelShow.advice_title ? labelShow.advice_title : "We'll invite your new users to the site and onboard them. During signup they'll enter their full name."}</span>

                <Tag comId={comId} lang={langValue} pageCode={props.pageCode} visible={visible} functionCallTag={getTagFunction} language={props.labelShow} />
                <p style={{ color: '#000000CC', marginBottom: '24px', marginTop: '10px' }}>{labelShow.suggestion_email ? labelShow.suggestion_email : "Enter up to 10 email addresses or phone numbers, separated by a comma."}</p>
                <span className='role-text-style'> {labelShow.roles ? labelShow.roles : "Roles"} </span>
                <Role comId={comId} lang={langValue} pageCode={props.pageCode} visible={visible} functionCallRole={getRoleFunction} />
                <p style={{ color: '#000000CC', fontSize: '14px',marginTop: '10px' }}>{labelShow.suggestion_role ? labelShow.suggestion_role : "Customized roles give users access to specific functions."}</p>

            </Modal>

        </div> 
    );
}
