import React, { useState, useEffect } from 'react';
import Tags from "@yaireo/tagify/dist/react.tagify";

import GetLang from '../../../includes/language';
import './tagify/tagify.scss';
import '../css/tag.css';

export default (props) => {
    // console.log('props Lang:: ', props);

    const labelShow = props.language;
    const [addTag, setAddTag] = useState(["paerw@gmail.com"]);

    // get local data มาจาก component อื่น
    localStorage.setItem("emailTag", JSON.stringify(addTag));
    const langValue = localStorage.getItem('langValue');

    // console.log("Lang Body Tag", props.comId, "DD", langValue, "ddd", props.pageCode);

    useEffect(() =>{
        setAddTag([]);
    },[props.visible])

    const { label, name, className, style, initialValue = [], suggestions = [], value } = props;

    const handleChange = e => {

        setAddTag(e.detail.tagify.value.map(item => item.value));
        props.functionCallTag(e.detail.tagify.value.map(item => item.value));
        // setAddTag(e.type, " ==> ", e.detail.tagify.value.map(item => item.value));
    };

    // check place holder data
    const emailPlaceholder = labelShow.email_holder ? labelShow.email_holder : "Enter email or phone number";
    console.log('emailPlaceholder: ', emailPlaceholder);

    const settings = {
        blacklist: [],
        maxTags: 10,
        backspace: "edit",
        editTags: 1,
        dropdown: {
            enabled: 0
        },
        whitelist: suggestions,
        callbacks: {
            add: handleChange,
            remove: handleChange,
            // blur: handleChange,
            // edit: handleChange,
            // invalid: handleChange,
            // click: handleChange,
            // focus: handleChange,
            "edit:updated": handleChange,
            "edit:start": handleChange
        },
        pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        placeholder: labelShow.email_holder || "Enter email or phone number"
    };

    const ThisTags = () => {
        return (
            <Tags initialValue={initialValue}
                className={props.className}
                style={props.style}
                settings={settings}
                addTag
                class={labelShow.email_holder ? labelShow.email_holder : "Enter email or phone number"} />
        );
    };

    console.log("settings", settings);
    return (
        <div className="form-group">
            <label htmlFor={"field-" + name}>{label}</label>
            <Tags
                initialValue={initialValue}
                // style={props.style}
                settings={settings}
                value={addTag}
            />
        </div>
    );
}

