import React, { useState } from 'react';
import { Radio } from 'antd'
import HttpClient from "../../../../components//httpClient";
import styled from 'styled-components';

let client = HttpClient();

const SendChangPassword = (props) => {
    const loadUser = props.user
    const labelShow = props.labelShow

    const [value, setValue] = useState(loadUser.email);

    const strPhone = loadUser.phone;
    const phone = strPhone.replace(/(\+?\d{1})(\d+)(\d{2})/g, function(match, start, middle, end) {
        return start + "*".repeat(middle.length) + end;
    });
    // console.log('phone:: ', phone);

    let strEmail = loadUser.email;
    let findMiddle = strEmail.split("").indexOf("@");
    const email = strEmail.split("").map((e, i) => i < (findMiddle - 1) && i !== 0 ? '*' : e).join('')

    const onChange = e => {
        setValue(e.target.value);
        props.onChange(e.target.value);
    };
    
    return (
        <div value={value}>
            <span>{labelShow.textExplainChangePassword ? labelShow.textExplainChangePassword : "How would you like to receive the code to reset your password?"}</span>
            <Radio.Group onChange={onChange} value={value}>
                <Radio style={radioStyle} value={loadUser.email}>
                    {labelShow.sendMsgEmail ? labelShow.sendMsgEmail : "Send message to your "} <span style={{color: '#FE6202'}}>{labelShow.email ? labelShow.email : "Email"}</span> 
                </Radio>
                <div style={{paddingLeft: '25px'}}>
                    <span>{email}</span>
                </div>
                <Radio style={radioStyle} value={loadUser.phone}>
                    {labelShow.sendMsgSms ? labelShow.sendMsgSms : "Send message to your "} <span style={{color: '#FE6202'}}>{labelShow.sms ? labelShow.sms : "SMS"}</span>  
                </Radio>
                <div style={{paddingLeft: '25px'}}>
                    <span>{phone}</span>
                </div>
                {/* {textError} */}
            </Radio.Group> 
        </div>
    );
};

const radioStyle = {
  display: 'block',
  height: '30px',
  lineHeight: '30px',
};

export default SendChangPassword;
