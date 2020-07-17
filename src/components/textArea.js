import React, { useState } from 'react';
import { Tag, Input } from 'antd';
import './css/tagsInput.css'; // style textarea and tag
// const AppTextArea = props => {
//     //const [emails, setEmails] = useState(false);
//     const [todos, setTodos] = useState([]);

//     const { TextArea } = Input;
//     const re =/^((([^*%<>$!=&+()\[\]\\.#,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{2,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,3}))[,]*)+$/g;
//     //const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,})+\s?,)*(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,})+)$/g;
//     console.log(re.test(String('Harid.c@kgcorp.com')));
//     const addArray = (mail)=>{
//         //console.log( re.test(String(mail)) );
//         if( re.test(String(mail)) ){
//             //todos.empty();
//             let val = mail.split(",");
//             setTodos(val);
//             console.log(todos);
//         }
//     }

const TagsInput = (props) => {
  const [tags, setTags] = React.useState(props.tags);
  const removeTags = (indexToRemove) => {
    setTags([...tags.filter((_, index) => index !== indexToRemove)]);
  };
  const addTags = (event) => {
    const re = /^((([^*%<>$!=&+()\[\]\\.#,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{2,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,3}))[,]*)+$/g;
    if (event.target.value !== '') {
      let email = event.target.value;
      if (email.indexOf(',') == -1) {
        if (re.test(email)) {
          setTags([...tags, email]);
          //props.selectedTags([...tags, email]);
          event.target.value = '';
        }
      } else {
        let arrayEmails = email.split(',');
        //console.log(arrayEmails);
        for (let i = 0; i < arrayEmails.length; i++) {
          console.log(i);

          if (re.test(arrayEmails[i])) {
            setTags([...tags, arrayEmails[i]]);
            console.log(arrayEmails[i]);
            //props.selectedTags([...tags, arrayEmails[i]]);
            event.target.value = '';
          }
          console.log(tags);
        }
      }
    }
  };
  const indents = [];

  const gg = (arrayEmails) => {
    for (var i = 0; i < arrayEmails.lenght; i++) {
      indents.push(
        <span className="indent" key={i}>
          arrayEmails[i]
        </span>,
      );
    }
    return indents;
  };
  return (
    <div className="tags-input">
      <ul id="tags">
        <li>
          {tags.map((tag, index) => (
            <li key={index}>
              <Tag
                className="tag-title"
                closable
                onClose={() => removeTags(index)}
              >
                {tag}
              </Tag>
              {/* <span className='tag-close-icon'
                                onClick={() => removeTags(index)}
                            >
                                x
                            </span> */}
            </li>
          ))}
        </li>
      </ul>
      <input
        type="text"
        onKeyUp={(event) => (event.key === 'Enter' ? addTags(event) : null)}
        placeholder="Press enter to add tags"
      />
      {/* <li className={"input-tag__tags__input"}>
                <TextArea placeholder={"Enter email or phone number"} maxLength={3000} onKeyUp={(e) => addArray(e.target.value)} row={10}>
            
                </TextArea>
            </li> */}
    </div>
  );
};
export default TagsInput;
