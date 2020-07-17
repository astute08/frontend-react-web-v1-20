import React, { useState, useEffect } from 'react';
import { Select, Button } from 'antd';
import ApiRole from '../../../components/httpClient';
import GetLang from '../../../includes/language';

import '../css/inviteUser.css';

let client = ApiRole();
const { Option } = Select;

export default (props) => {

    const [selectedItem, setSelectedItem] = useState();
    const [labelShow, setLabelShow] = useState({});

    console.log("selectedItem", selectedItem);

    //get data มาจาก component อื่น
    const roleSelect = JSON.parse(localStorage.getItem('roleSelect'));
    const roleId = JSON.parse(localStorage.getItem('roleId'));
    const roleName = JSON.parse(localStorage.getItem('roleName'));
    // get data จาก button value เพื่อนำมาเปลี่ยนภาษา จากหน้า userMenu
    const langValue = localStorage.getItem('langValue');
    const memComId = localStorage.getItem('memComId');


    // set data ไว้ใช้ใน component อื่น
    // localStorage.setItem("selectedRole", selectedItem);
    localStorage.setItem('selectedRole', JSON.stringify(selectedItem));


    useEffect(() => {
        Lang();
    }, [])

    useEffect(() => {
        setSelectedItem();
    }, [props.visible])


    // ส่วนของการเรียกใช้ภาษา
    const Lang = async () => {
        const res = await GetLang({ companyId: props.comId, lang: langValue, pageCode: props.pageCode });
        setLabelShow(res);
    };

    const children = [];
    for (let i = 0; i < roleName.length; i++) {
        children.push(<Option key={roleId[i]} value={roleId[i]}>{roleName[i]}</Option>);
    }

    const handleChange = (value) => {
        setSelectedItem(value);
        props.functionCallRole(value);
    }


    // select company เอาข้อมูล company ที่ได้จากการล็อคอิน user มาโชว์ให้เลือก
    let optionItems = roleSelect.map((item, index) =>
        <option key={index} value={item.per_gro_id.toString()} >{item.name}</option>);
    // const filteredOptions = roleId.filter(o => !selectedItem.includes(o));


    return (
        <div>
            <Select
                placeholder={<span> {labelShow.role_holder ? labelShow.role_holder : "Add role of users"}</span>}
                onChange={handleChange}
                style={{ width: '100%', marginTop: '10px' }}
                mode='multiple'
                allowClear='true'
                key={roleId}
                value={selectedItem}
            >
                {/* {filteredOptions.map((item, i) => (
                    <Select.Option key={item} value={item}>
                        {item}
                    </Select.Option>
                ))} */}
                {/* {optionItems} */}
                {children}
            </Select>
        </div>
  );
};
