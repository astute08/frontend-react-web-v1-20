import React, { useState, useEffect, } from 'react';
import { BrowserRouter as Router, Route, Link, NavLink, Redirect, Switch} from "react-router-dom";
import Cookies from 'universal-cookie';
import * as moment from 'moment'
import { Form, Input, Button, Select, notification, Icon } from 'antd';
import httpClient from '../../components/axiosClient';
import AppButton from '../../components/button';
import LoginApi from '../../components/httpClient';
import GetLang from '../../includes/language';
import checkLogin from '../../components/checkLogin';
import Company from './company';
import './css/loginForm.css';
// import { register } from '../../serviceWorker';
// import { useParams } from 'react-router-dom';
const qs = require('query-string');
var jwt = require('jsonwebtoken');

let client = LoginApi();
const cookies = new Cookies();
checkLogin.checkLogin();
// cookies.remove('wfm_access_token_bak');

const ValidatedFields = ({ form }, props) => {
    const [username, setToUsername] = useState("");
    const [password, setToPassword] = useState("");
    const [email, setEmail] = useState("");
    const [userId, setUserId] = useState();
    const [expire, setExpire] = useState();
    const [accessToken, setAccessToken] = useState();
    const [switchLang, setSwicthLang] = useState({});
    const [name, setName] = useState();
    const [firstName, setFirstName] = useState();
    const [lastName, setLastName] = useState();

    // set ค่า userId เพื่อใช้ใน component อื่น
    localStorage.setItem("userId", userId);
    localStorage.setItem("username", username);
    localStorage.setItem("email", email);
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("name", name);
    localStorage.setItem("firstName", firstName);
    localStorage.setItem("lastName", lastName);

    //set data ที่เป็น obj
    localStorage.setItem("switchLang", JSON.stringify(switchLang));
    localStorage.setItem("Expire", expire);

    console.log("expire::::", expire);

    const { getFieldDecorator, validateFields } = form;

    // ส่วนของ function
    useEffect(() => {
        Lang();
        
    }, [])

    // ส่วนของการเรียกใช้ภาษา เพื่อ switch เป็นภาษาตามที่ user เลือก โดย import function มาจาก include
    const Lang = async () => {
        const res = await GetLang({ companyId: "0", lang: 'EN', pageCode: '000' });
        setSwicthLang(res);
    };

    // notification เมื่อ login สำเร็จ เป็น response เพื่อให้ user รู้
    const key = "updatable";

    const successNotification = (type) => {
        notification[type]({
          key,
          message: 'Success',
        });
      };

    const errorNotification = type => {
        notification[type]({
            message: 'Username or Password Incorrect',
            duration: 1.5,
        });

    };

    // ส่วนของการใช้ keycloak โดยการสร้างตัวแปร object ขึ้นมาเพื่อรับค่าจาก api แล้วจะนำไปเช็คกับค่าที่เรา input เข้าไปอีกที
    const handleRegister = async () => {
        const data = {
            "client_id": `${process.env.REACT_APP_KEYCLOAK_CLIENT_ID}`,
            "grant_type": "password",
            "client_secret": `${process.env.REACT_APP_KEYCLOAK_CLIENT_SECRET}`,
            username: username,
            password: password
        }

        const axiosConfig = {
            Header: {
                "Content-Type": "application/x-www-form-urlencoded",
                token : localStorage.getItem('Expire')
            }

        };

        try {
            client.defaults.baseURL = `${process.env.REACT_APP_KEYCLOAK_URL}`;
            client.defaults.headers = { "Content-Type": "application/x-www-form-urlencoded" }

            const res = await client.post(`auth/realms/${process.env.REACT_APP_KEYCLOAK_REALM}/protocol/openid-connect/token`, qs.stringify(data), axiosConfig);
            var decode1 = jwt.decode(res.data.access_token);
            // return;
            // console.log("expire::: ", res);
            // console.log("decode1.sub", decode1.sub);
            // console.log("moment().format('LT');", moment(decode1.exp * 1000).format('LT'));
            setAccessToken(res.data.access_token);
            // cookies.set('wfm_access_token', res.data.access_token );
            setName(decode1.name);
            setUserId(decode1.sub);
            setExpire(decode1.exp * 1000);
            setEmail(decode1.email);
            successNotification('success');
            getUsername(decode1.sub);
            getKeyCloakName(decode1.name);
            validateFields((err, values) => {
                if (!err) {
                    console.log('Received values of form: ', values);
    
                }
            });       
                 
            setTimeout(() => {
                window.location.href = "/company"
            },
                1000
            );

        } catch (error) {
            // console.log("error.response", error.response.status);
            // if (error.response.status === 401) {
                setToPassword('');
                errorNotification('error');
            // }
        }

    }

    //  ค่าในช่อง user
    const handleUserChange = (e) => {
        setToUsername(e.target.value);
    }
    //  ค่าในช่อง password
    const handlePassChange = (e) => {
        setToPassword(e.target.value)

    }

    // ใช้กับหน้า form ทั้งหมด เพื่อ validate form
    const handleSubmit = e => {
        e.preventDefault();
        validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);

            }
        });
    };

    const getUsername = (userId) =>{
    //   console.log("getUsername");
      httpClient.get(`/v2/member/profile/keycloak/${userId}`).then(
        (response) =>{
        //   console.log('getUsername : ', response);
          setFirstName(response.data.member.name);
          setLastName(response.data.member.lastname);
        },
        (error) =>{
          console.log(error);
        }
      )
    }

    const getKeyCloakName = (keyCloakName) =>{
      return(<Company keyCloakName = {keyCloakName}/>);
    }


    return (
        <div>
            <Form onSubmit={handleSubmit} className='login-form' >

                <Form.Item className='form-item'>
                    <div className='input-label-login'>{switchLang.username ? switchLang.username : "Username"}</div>
                    {getFieldDecorator('username', {
                        rules: [{ required: true, message: 'Please input your username!' }],
                    })(
                        <Input
                            placeholder="Username, email or phone number"
                            type="text"
                            name="username"
                            className="input"
                            value={username}
                            onChange={handleUserChange}
                        />
                    )}
                </Form.Item>

                <Form.Item className='form-item'>
                    <div className='input-label-login'> {switchLang.password ? switchLang.password : "Password"}</div>
                    {getFieldDecorator('password', {
                        rules: [{ required: true, message: 'Please input your password!' }],
                    })(
                        <Input.Password
                            placeholder="Password"
                            type="password"
                            name="password"
                            value={password}
                            onChange={handlePassChange}
                            className="input"
                        />
                    )}
                </Form.Item>

                <Button disabled={!username || !password} className='login-form-button' htmlType="submit"  onClick={handleRegister} >

                    Authenticate

                </Button>
                <Form.Item>
                    <div className='remember-forgot-row' style={{marginTop: '10px'}}>
                        <Link className="login-form-forgot" to="/forgotpassword"> Forgot password ?</Link>
                    </div>
                </Form.Item>

            </Form>

        </div>

    );
}

const onFieldsChange = (_, changedFiels) => {
    const { username } = changedFiels;
    if (username) {

    }
};

const LoginForm = Form.create({ onFieldsChange })(ValidatedFields);
export default LoginForm;