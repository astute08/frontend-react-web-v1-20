import React, { useState, useEffect } from 'react';
import { Select, Form, Button, Icon, notification } from 'antd';
import CompanyApi from '../../components/httpClient';
import { Link, Redirect } from 'react-router-dom';
import Cookies from 'universal-cookie';

import './css/company.css';
import GetLang from '../../includes/language';

const qs = require('query-string');
var jwt = require('jsonwebtoken');
const cookies = new Cookies();

let client = CompanyApi();

export default (props) => {
    const [tokenKey, setTokenKey] = useState([]);
    const [selectForm, setSelectForm] = useState([]);
    const [company, setCompany] = useState([]);
    const [userData, setUserData] = useState();
    const [comId, setComId] = useState();
    const [memComId, setMemComId] = useState()
    const [switchLang, setSwitchLang] = useState(JSON.parse(window.localStorage.getItem('switchLang')));
    const [adminName, setAdminName] = useState();
    const [userAvatar, setUserAvatar] = useState();

    // get const จาก component อื่นมาใช้
    const userId = localStorage.getItem('userId');
    const name = localStorage.getItem('name');
    const firstName = localStorage.getItem('firstName');
    const lastName = localStorage.getItem('lastName');
    const email = localStorage.getItem('email');
    const getLang = JSON.parse(window.localStorage.getItem('switchLang'));
    const expireInfo = localStorage.getItem('Expire');

    console.log("88888");
    // set const ไปใช้ที่ component อื่น
    localStorage.setItem('companyId', selectForm[0]);
    localStorage.setItem('comName', selectForm[1]);
    localStorage.setItem('comId', comId);
    localStorage.setItem('memComId', memComId);
    localStorage.setItem('adminName', adminName);
    localStorage.setItem('userAvatar', userAvatar);
    localStorage.setItem("tokenKey", tokenKey);
    localStorage.setItem("expireInfo", expireInfo);

    console.log("Company", props);
    useEffect(() => {
        console.log(company);
        if (company.length == 0) {
            handleTokenCompany();
        }

    }, [userId])

    useEffect(() => {
        if (tokenKey != '') {
            handleGetCompany();

        }
    }, [tokenKey])

    const Lang = async () => {
        const res = await GetLang({ companyId: "0", lang: 'EN', pageCode: '000' });
        setSwitchLang(res);
        // setSwitchLang
    };


    const errorNotification = type => {
        notification[type]({
            message: 'Username or Password Incorrect',
            duration: 1.5,
        });

    };

    // ส่วนของการใช้ keycloak โดยการสร้างตัวแปร object ขึ้นมาเพื่อรับค่าจาก api แล้วเอา token ทีไ่ด้ ไป get company 
    const handleTokenCompany = async () => {
        const data = {
            "client_id": "admin-cli",
            "grant_type": "password",
            username: "admin",
            password: "admin"
        }

        const axiosConfig = {
            Header: {
                "Content-Type": "application/x-www-form-urlencoded",
            }

        };

        try {
            client.defaults.baseURL = `${process.env.REACT_APP_KEYCLOAK_URL}`;
            const res = await client.post(`/auth/realms/${process.env.REACT_APP_KEYCLOAK_REALM}/protocol/openid-connect/token`, qs.stringify(data), axiosConfig);

            setTokenKey(res.data.access_token);

        } catch (error) {
            console.log(error);
        }

    }

    const handleGetCompany = async (id) => {

        try {
            client.defaults.baseURL = `${process.env.REACT_APP_KEYCLOAK_URL}`;
            client.defaults.headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
                "Authorization": `Bearer ${tokenKey}`,

            };

            const user1 = id
            const res = await client.get(`/auth/admin/realms/${process.env.REACT_APP_KEYCLOAK_REALM}/users/${userId}/groups`);

            let newCompany = [];
            for (let i = 0; i < res.data.length; i++) {

                newCompany.push(res.data[i]);
            }
            setCompany(newCompany);



        } catch (error) {
            console.log(error.response);

        }

    }

    const getUserData = async (data = {}) => {
        client.defaults.baseURL = `${process.env.REACT_APP_URL_MANAGER_ADD_PORT}`;
        client.defaults.headers = {
            'Content-Type': 'application/json',
        };


        await client
            .post(`/v2/login`, {
                "user_id": userId,
                "user_name": name,
                "email": email,
                "company_id": selectForm[0],
                "company_name": selectForm[1]
            })
            .then(respone => {
                if (respone.status === 200) {
                    const cookieData = {
                        comId: respone.data[0].com_id,
                        memComId: respone.data[0].mem_com_id,
                        name: respone.data[0].name + " " + respone.data[0].lastname,
                        profileImg: respone.data[0].profile_img,
                        exp: localStorage.getItem('Expire')
                    };
                    // var token = jwt.sign(cookieData, "wfm_access_token");
                    // cookies.set("wfm_access_token_bak", token);


                    setComId(respone.data[0].com_id);
                    setMemComId(respone.data[0].mem_com_id)
                    setAdminName(respone.data[0].name + " " + respone.data[0].lastname);
                    setUserAvatar(respone.data[0].profile_img);
                }
                else {
                    alert('empty');
                    console.log("Empty");
                }
            })
            .catch(error => {
                console.log("error", "Login fail.", error);
            });

    };

    const sendUserData = () => {
        let data = {
            "user_id": userId,
            "company_id": selectForm
        };
        getUserData(data);
    };


    const handleClick = () => {
        sendUserData();
        if (!selectForm) {
            errorNotification('error');

        }
        else {
            setTimeout(() => {
                window.location.href = '/menu';
            },
                500
            );
        }

    };

    const clearUserId = () => {
        console.log('userId', userId);
        localStorage.clear();

    }

    //  ค่าในช่อง select
    const handleSelectChange = (selected) => {
        setSelectForm(selected);
    }

    // select company เอาข้อมูล company ที่ได้จากการล็อคอิน user มาโชว์ให้เลือก
    let optionItems = company.map((item, index) =>
        <option key={item.id} value={[item.id, item.name]} >{item.name}</option>);



    return (
        <React.Fragment>
            <Form.Item>
                <div >
                    <Icon type="user" className='icon-style' /> <span className='username-style'> {firstName + " " + lastName} </span> <span className='icon-lock'><Icon type="lock" /></span>
                </div>
            </Form.Item>
            <Form className='form-item'>
                {/* <div className='input-label'> {switchLang.company ? switchLang.company : "COMPANY"}</div> */}
                <div className='input-label'> COMPANY</div>

                <Select
                    key={selectForm[1]}
                    placeholder="Company"
                    value={selectForm[1]}
                    onChange={handleSelectChange}
                    className='selection-style'

                >
                    {optionItems}
                </Select>
                <Button disabled={!selectForm[0]} className='login-form-button' onClick={handleClick} >
                    Login
                </Button>

            </Form>
            <Form.Item>
                <div className='remember-forgot-row'>
                    <a className="login-form-forgot " href="https://www.google.com/">
                        <Link to='/loginform' onClick={clearUserId} className="login-form-forgot "> Change Account </Link>

                    </a>
                </div>
            </Form.Item>

        </React.Fragment>

    );
}