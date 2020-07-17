import React, { useState, useEffect } from 'react';
import Provider from '../provider';
import {
    Form,
    Input,
    Select,
    DatePicker,
    Switch,
    Col,
    Row,
    Card,
    notification
} from 'antd';
import * as moment from 'moment';
import httpClient from '../../../components/axiosClient';
import Button from '../../../components/v2/button';
// import './css/index.css';
import styled from 'styled-components'
import _ from 'lodash';

const DivDetail = styled.div`
  padding: 0px 24px;
`;

const LabelRequire = styled.label`
  color: #FF1010;
`;

const { Option } = Select;

const dateFormat = 'DD MMMM YYYY';

const ValidatedFields = (props) => {

    // console.log('props : ', props);
    const app = Provider.useAppContext();
    const { getFieldDecorator, validateFields } = props.form;
    const { newForm } = props;

    // const defaultTeamName = newForm ? '' : props.data.name;
    const defaultTeamType = newForm ? '' : props.data.team_type_id;
    const startDate = newForm ? undefined : props.data.start_date;
    const endDate = newForm ? undefined : props.data.end_date;
    // const test = JSON.stringify(props.data.created_at);
    // const [teamName, setTeamName] = useState();
    const [teamType, setTeamType] = useState([]);
    // const [selectTeamType, setSelectTeamType] = useState([]);
    const [selectTeamTypeId, setSelectTeamTypeId] = useState();
    const [dateStartValue, setDateStartValue] = useState();
    const [dateStartString, setDateStartString] = useState();
    const [dateEndValue, setDateEndValue] = useState();
    const [dateEndString, setDateEndString] = useState();
    const [description, setDescription] = useState("");
    // const [switchBtn, setSwitchBtn] = useState(false);


    // รับ props parent id มาจาก provider
    const parentId = props.parentId;
    const orgId = props.data.org_id;
    const comId = props.data.com_id;

    useEffect(() => {
        const newTeamType = props.data.teamType ? props.data.teamType : [];
        // setTeamName(newForm ? undefined : props.data.name);
        setTeamType(newTeamType);
        // setSelectTeamType(newForm ? undefined : props.data.team_type_id);
    }, [props]);

    const openNotificationWithIcon = (type, message) => {
        notification[type]({
            message: message,
            duration: 1.7,
        });
    };

    const sendTeamDetail = () => {
        const error = validateFields();
        error.then(
            (response) => {


                if (!newForm) {
                    const data = {
                        "org_id": orgId,
                        "name": response.teamName,
                        "team_type_id": response.teamType,
                        "start_date": moment(response.startDate._d.valueOf()).format('YYYY-MM-DD'),
                        "end_date": moment(response.endDate._d.valueOf()).format('YYYY-MM-DD'),
                        "description": response.description,
                        "updated_by": orgId
                    }

                    httpClient.post('/v2/update/organization', data).then(
                        (response) => {
                            if (response.status === 200) {
                                openNotificationWithIcon('success', response.data.data);

                                // app.fnc.getRefresh();
                            }
                            else {
                                openNotificationWithIcon('error', response.data.data);

                            }
                        },
                        (error) => {
                            console.log("error", error);
                            openNotificationWithIcon('error');
                        }
                    );
                }
                else {
                    const data = {
                        "created_by": orgId,
                        "com_id": comId,
                        "name": response.teamName,
                        "parent_lavel": "1",
                        "parent_id": parentId ? parentId : "",
                        "team_type_id": selectTeamTypeId,
                        "start_date": dateStartString,
                        "end_date": dateEndString,
                        "description": description
                    }


                    httpClient.post('/v2/create/organization', data).then(
                        (response) => {
                            console.log("New organization success : ", response);
                            if (response.status === 200) {
                                openNotificationWithIcon('success', response.data.data);

                                app.fnc.setOrgId(orgId);
                                app.fnc.setParentId();
                                app.fnc.setAddNewOrganization(false);
                                // app.fnc.getRefresh();
                            }
                            else {
                                openNotificationWithIcon('error', response.data.data);

                            }
                        },
                        (error) => {
                            console.log("error", error);
                            openNotificationWithIcon('error');
                        }
                    );
                }
            },
            (error) => {
                console.log("sendTeamDetail error : ", error);
            }
        );

    }

    const handleTeamNameChange = (e) => {
        console.log("Team Name:::", e.target.value);

        // setTeamName(e.target.value);
    }

    const handleSelectTeamType = (select) => {
        // setSelectTeamType(select);
        setSelectTeamTypeId(select);
    }

    const handleDateStart = (value, dateString) => {
        setDateStartValue(value);
        setDateStartString(value.format('YYYY-MM-DD'));
    }

    const handleDateEnd = (value, dateString) => {
        setDateEndValue(value);
        setDateEndString(value.format('YYYY-MM-DD'));
    }

    const disabledStartDate = (current) => {
        // const newCurrent = current <= moment().endOf('day');
        const newCurrent = current >= dateEndValue;
        return newCurrent;
    };

    const disableEndDate = (current) => {
        const newEndDate = current < dateStartValue;
        return newEndDate;
    }

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    }

    const onSwitchChange = (checked) => {
        // setSwitchBtn(checked);
        let status_work = checked ? 1 : 0;

        let data = {
            "org_id": "15",
            "updated_by": "20",
            "status": status_work
        };

        httpClient.post('/v2/update/organization/', data).then(
            (response) => {
                if (response.status === 200) {
                    openNotificationWithIcon('success', response.data.data);
                }

                else {
                    openNotificationWithIcon('error', response.data.data);

                }
            },
            (error) => {
                openNotificationWithIcon('error', error);
            }
        );
    }

    const optionItems = teamType.map((item, index) => {
        return (
            <Option key={index} value={item.team_type_id}>
                {item.name}
            </Option>
        );
    });

    // const defaultTeamTypeValue = teamType.length > 0 ? teamType[props.data.team_type_id].name : "";
    const defaultTeamTypeValue = defaultTeamType;

    const handleChangeEndDate = (rule, value, callback) => {
        const errors = [];
        if (value && dateStartString) {
            let startDate = moment(dateStartString)._d.valueOf();
            let endDate = value._d.valueOf();
            if (endDate < startDate) {
                errors.push('End date is less than the start date.');
            }
        }

        callback(errors);
    };

    const LabeRequire = (props) => {
        const { text, req } = props;
        return (
            <span>
                {text}&nbsp;
                {req ? <LabelRequire>*</LabelRequire> : ''}
            </span>
        );
    };

    return (
        <DivDetail>
            <Form colon={false} hideRequiredMark={true}>
                <Row gutter={[16, 16]} align='middle'>
                    <Col className="gutter-row" span={24} style={{ textAlign: 'right' }}>
                        <Switch
                            // style={{
                            //     display: 'block',
                            //     marginLeft: 'auto',
                            //     marginRight: 'auto',
                            // }}
                            onChange={onSwitchChange}
                            // value={switchBtn}
                        />

                        <Button
                            primary="primary"
                            fontSize="md"
                            btnSize="wd_df"
                            onClick={sendTeamDetail}
                        >
                            Save
                        </Button>
                    </Col>
                </Row>
                <Row gutter={[16, 16]}>
                    <Col className="gutter-row" span={8}>
                        <Form.Item className="rules" label={<LabeRequire text="TEAM NAME" req={true} />}>
                            {getFieldDecorator('teamName', {
                                // initialValue: teamName,
                                rules: [
                                    {
                                        required: true,
                                        message: 'Please input Team Name'
                                    },
                                    {
                                        max: 30,
                                        message: 'Team Name cannot be longer than 30 characters'
                                    },

                                ],
                            })(
                                <Input
                                    placeholder="Team Name"
                                    className="input"
                                    onChange={handleTeamNameChange}
                                    autoComplete="off"
                                />,
                            )}
                        </Form.Item>
                    </Col>
                    <Col className="gutter-row" span={8} offset={1}>
                        <Form.Item className="rules" label={<LabeRequire text="TEAM TYPE" req={true} />}>
                            {getFieldDecorator('teamType', {
                                // initialValue: selectTeamType,
                                rules: [
                                    {
                                        required: true,
                                        message: 'Please select team Type'
                                    }
                                ],
                            })(
                                <Select
                                    showSearch
                                    style={{ width: '100%' }}
                                    placeholder="Select Team Type"
                                    onChange={handleSelectTeamType}
                                >
                                    {optionItems}
                                </Select>
                            )}
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={[16, 16]}>
                    <Col className="gutter-row" span={8}>
                        <Form.Item className="normal-rules" label={<LabeRequire text="Start Date" req={true} />}>
                            {getFieldDecorator('startDate', {
                                initialValue: startDate ? moment(startDate, 'YYYY-MM-DD') : undefined,
                                rules: [
                                    {
                                        required: true,
                                        message: 'Please select start date'
                                    }
                                ]
                            })(
                                <DatePicker
                                    format={dateFormat}
                                    placeholder="Start"
                                    onChange={handleDateStart}
                                    style={{ width: '100%' }}
                                />
                            )}
                        </Form.Item>
                    </Col>
                    <Col className="gutter-row" span={8} offset={1}>
                        <Form.Item className="normal-rules" label={<LabeRequire text="End Date" req={true} />}>
                            {getFieldDecorator('endDate', {
                                initialValue: endDate ? moment(endDate, 'YYYY-MM-DD') : undefined,
                                rules: [
                                    { 
                                        required: true, 
                                        message: 'Please select end date' 
                                    },
                                    {
                                        validator: handleChangeEndDate,
                                    },
                                ]
                            })(
                                <DatePicker
                                    format={dateFormat}
                                    placeholder="End"
                                    onChange={handleDateEnd}
                                    style={{ width: '100%' }}
                                />
                            )}
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={[16, 16]}>
                    <Col className="gutter-row" span={17}>
                        <Form.Item className="normal-rules" label={<LabeRequire text="DESCRIPTION" />}>
                            {getFieldDecorator('description', {
                                // initialValue: description
                            })(
                                <Input
                                    autosize={{ minRows: 1, maxRows: 1 }}
                                    // value={description}
                                    onChange={handleDescriptionChange}
                                    autoComplete="off"
                                />,
                            )}
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </DivDetail>        
    );
};

const onFieldsChange = (_, changedFiels) => {
    const { username } = changedFiels;
    if (username) {
    }
};

const DetailForm = Form.create({ onFieldsChange,
    mapPropsToFields(props) {
        const orgId = props.orgId;
        const { name, team_type_id, description } = props.data;
        
        // const setStartDate = _.isUndefined(start_date) ? moment().format('YYYY-MM-DD') : moment(start_date.substring(0, 10), dateFormat);  

        const teamName = _.isUndefined(orgId) ? '' : name;
        const teamType = _.isUndefined(orgId) ? '' : team_type_id;
        const descriptions = _.isUndefined(orgId) ? '' : description;
        // const startDate = _.isUndefined(orgId) ? '' : setStartDate;

        // console.log('start_date : ', startDate);

        

        return {
            teamName: Form.createFormField({ value: teamName }),
            teamType: Form.createFormField({ value: teamType }),
            // startDate: Form.createFormField({ value: startDate }),
            // endDate: Form.createFormField({ value: end_date }),
            description: Form.createFormField({ value: descriptions }),
        };
    }
})(ValidatedFields);
export default DetailForm;
