import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './css/personalInfomation.css';
import * as moment from 'moment';
// import phoneFormatter from 'phone-formatter';
import NumberFormat from 'react-number-format';
import { Card, Row, Col, Typography, Icon, List, Form } from 'antd';
import AppAvatar from '../../../components/avatar';
import AppSwitch from '../../../components/switch';
import styled from 'styled-components';
import HttpClient from '../../../components/httpClient';

const client = HttpClient();
const { Title } = Typography;

export default (props) => {

    const [personalData, setPersonalData] = useState([]);
    const [getStatus, setGetStatus] = useState(false);
    const [imageProfile, setImageProfile] = useState('');

    const today = moment(new Date());
    const dateFormat = 'DD/MM/YYYY';

    // รับค่าภาษามาแสดง
    const labelShow = props.labelShow;

    // รับ user_id มาจากหน้า user
    const param = useParams();
    const userId = param.user_id;
    
    // get api data user ใช้ใน card personal Infomation
    useEffect(() => {
        const fetchData = async () => {
            let result = await client.get(`/v2/users/${props.memComId}/${userId}/`);
            const user = result.data;
            if(user.length > 0) {
              setData(user)
              setGetStatus(user[0].status_work === 'Enable' ? true : false)
              setImageProfile(user[0].profile_img)
            }
        };
        fetchData();
    }, []);

    const setData = (users) => {
        for (let i = 0; i < users.length; i++) {

            users[i].fullname = users[i].fullname == null ? '-' : users[i].fullname;

            users[i].birthday = users[i].birthday == null ? '-' : users[i].birthday = (
                <span>{moment(`${users[i].birthday}`).format('D MMMM YYYY')}</span>
            )

            users[i].gender = users[i].gender == null ? '-' : users[i].gender;

            users[i].phone = users[i].phone == null ? '-' : users[i].phone;
        
            users[i].id_card = users[i].id_card == null ? '-' : users[i].id_card = (
                <span>
                    <NumberFormat value={`${users[i].id_card }`} displayType={'text'} format="#-####-#####-##-#"/>
                 </span>
            )
            
        }
        setPersonalData(users)
    }

    // Up date status_work 
    const handleChange = async (checked) => {
        setGetStatus(checked);
        let status_work = checked ? 'Enable' : 'Disable';
        let dataSwitch = {
            "user_id": userId,
            "updated_by": props.memComId,
            "status_work": status_work
        };
        const result = await client.post('/v2/update/status/', dataSwitch);
    }
    
    // data.map function Property
    let mapUser = personalData.map ((item, key) => {

        let gender = item.gender.toLowerCase() === "male" ? "man" : "woman";

        return(
            <div key={key}>
                    <Title className="title-name" level={4}>{item.name + " " + item.lastname}</Title>

                    <Row>
                        <Col span={12}>
                            <StyledList className="list-item" >
                                <StyledIcon type="solution" className="style-icon" />
                                <P className="p-style">{item.emp_code}</P>
                            </StyledList>

                            <StyledList className="list-item" >
                                <StyledIcon type="mail" className="style-icon" />
                                <P className="p-style" >{item.email}</P>
                            </StyledList>

                        </Col>
                        <Col span={12}>
                            <StyledList className="list-item" >
                                <StyledIcon type="calendar" className="style-icon" />
                                <P className="p-style">{item.start_and_resign_date}</P>
                            </StyledList>
                            <StyledList className="list-item" >

                            <StyledIcon type="phone" className="style-icon" />
                                <P className="p-style">{item.phone}</P>
                            </StyledList>
                        </Col>
                    </Row>
                    <hr className="hr" />
                    <Row>
                        <Col span={12}>
                            <StyledList className="list-item" >
                                <StyledIcon type="idcard" className="style-icon" />
                                <P className="p-style">{item.id_card}</P>
                            </StyledList>
                            
                            <StyledList className="list-item" >
                                <StyledIcon type={`${gender}`} className="style-icon" />
                                <P className="p-style">{item.gender}</P>
                            </StyledList>
                        </Col>
                        <Col span={12}>
                            <StyledList className="list-item" >
                                <StyledIcon type="gift" className="style-icon"  />
                                <P className="p-style">{item.birthday}</P>
                            </StyledList>
                        </Col>
                    </Row>
            </div>
        )
    })

    return (
        <>
            <Form >
                <Card className="card-personal" title={labelShow.personalInformationTitle ? labelShow.personalInformationTitle : "Personal Information"} extra={<AppSwitch className='ant-switch-checked' onChange={handleChange} checked={getStatus}  />} >
                    <Row>
                        <Col span={8}>
                            <div className="col-md-8">
                                <AppAvatar size={150} icon={"user"}
                                    src={`${process.env.REACT_APP_IMG_HOST}` + imageProfile}
                                />
                            </div>
                        </Col>

                        <Col span={16}>
                            {/* รับ props data.map function */}
                            {mapUser}
                        </Col>
                    </Row>
                </Card>
            </Form>
        </>
    )
}


// styled Component

const StyledList = styled(List.Item)`
  padding: 0px;
  text-align: 'center';
`;

const StyledIcon = styled(Icon)`
  margin: 8px;
  padding: 0px 10px 0px 0px;
  font-size: 16px;
  /* color: '#707070'; */
`;

const P = styled.p`
  margin: 5px;
  padding-top: 0px;
`;
