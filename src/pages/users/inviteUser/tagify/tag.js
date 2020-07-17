import React, { useState, useEffect } from 'react';
import Tags from "@yaireo/tagify/dist/react.tagify";
import Language from '../../../../includes/language';

export default (props) => {
  const [switchLang, setSwicthLang] = useState({});
  const [labelShow, setLabelShow] = useState({});

  useEffect(() => {
    Lang();
  }, []);

  const comId = localStorage.getItem('comId');
  const pageCode = localStorage.getItem('pageCode');
  const langValue = localStorage.getItem('langValue');

  const Lang = async () => {
    const res = await Language({
      companyId: comId,
      lang: langValue,
      pageCode: pageCode,
    });
    setSwicthLang(res);
    setLabelShow(res);
    console.log('Language ::', res);
  };

    const Lang = async () => {
        const res = await Language({ companyId: comId, lang: langValue, pageCode: pageCode });
        setSwicthLang(res);
        setLabelShow(res);
        console.log("Language ::", res);
    };

    const baseTagifySettings = {
        blacklist: [],
        maxTags: 10,
        backspace: "edit",
        placeholder: labelShow.tagPlaceholder ? labelShow.tagPlaceholder : "Enter email or phone number",
        editTags: 1,
        delimiters: ",| ",         
        dropdown: {
            enabled: 0
        },
        callbacks: {},
    }

    function TagField({ label, name,className,style, initialValue = [], suggestions = [] }) {
        const handleChange = e => {
            console.log(`%c ${e.type}: `, "background: #222; color: #bada55", e.detail);
            console.log(e.type, " ==> ", e.detail.tagify.value.map(item => item.value));
        };

        const settings = {
            ...baseTagifySettings,
            whitelist: suggestions,
            callbacks: {
                add: handleChange,
                remove: handleChange,
                blur: handleChange,
                edit: handleChange,
                invalid: handleChange,
                click: handleChange,
                focus: handleChange,
                "edit:updated": handleChange,
                "edit:start": handleChange
            },
            pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,

  
    };

    console.log('InitialValue', initialValue);

    return (
      <div className="form-group">
        <label htmlFor={'field-' + name}>{label}</label>
        <Tags
          settings={settings}
          initialValue={initialValue}
          className={props.className}
          style={props.style}
        />
      </div>
    );
  }

  return (
    <div>
      <div style={{ width: '100%' }}>
        <TagField
          initialValue={['foo', 'brazil']}
          style={{ height: '150px' }}
        ></TagField>
      </div>
    </div>
  );
};
