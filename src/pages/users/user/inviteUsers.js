import React, { useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import AppCard from '../../../components/card';
import AppButton from '../../../components/button';
import TagsInput from '../../../components/textArea';
import $ from 'jquery';
import TagEditor from 'react-tageditor';
import { Select, Input, Row, Col, Tag } from 'antd';
import '../css/tagEditor.scss';
import '../css/tagEditor.css';

const { TextArea } = Input;

const InviteUsers = () => {
  const textInput = useRef();
  const [inputData, setInputData] = useState('');
  const [setTag, setSetTag] = useState([]);
  const [tags, setTags] = useState([]);

  function log(e) {
    console.log(e);
  }

  // ***********ต้นแบบ***********
  // const handlerChange = (e) => {
  //     const val = e.target.value;
  //     setInputData(val)

  //     $('#textarea').on('keyup', function(e){
  //         var key = e.which;
  //         if(key === 188){
  //             console.log('keyup: ', key)
  //             setSetTag([...setTag, inputData])
  //         };
  //      });
  //     //  console.log('Input: ', setTag)
  // }

  const handlerChange = (e) => {
    const val = e.target.value;
    setInputData(val);

    $('#textarea').on('keyup', function(e) {
      var key = e.which;
      if (key === 188) {
        setSetTag([...setTag, inputData]);
        $('<button />').text($(setTag).slice(0, -1));
      }
    });
    //  console.log('Input: ', setTag)
  };
  console.log('Input: ', setTag);

  const handleTagsChange = (tagsChanged, allTags, action) => {
    setTags(allTags);
  };
  // console.log('Tags:: ', tags)

  return (
    <>
      <AppCard
        title={'Invite Users'}
        actions={[
          <Row>
            <Col style={{ float: 'right', paddingRight: '22px' }}>
              <AppButton textButton={'Cancel'}></AppButton>
              <AppButton textButton={'Invite'}></AppButton>
            </Col>
          </Row>,
        ]}
      >
        <p>
          We'll Invite your new users to the site and onboard them. During
          signup they'll enter their full name.
        </p>

        {/* ต้นแบบ */}
        {/* <TextArea id='textarea' style={{height: '150px'}} 
                ref={textInput}
                placeholder="Input tags..."
                onChange={handlerChange}
                value={inputData}
            /> */}

        <div id="textarea">
          <input
            type="text"
            placeholder="Input tags..."
            onChange={handlerChange}
            value={inputData}
          />
        </div>

        {/* <StyleTagEditor 
                ref={textInput}
                tags={tags}
                delimiters={[13, ',']}
                onChange={handleTagsChange} 
                placeholder="Input tags, split by comma" 
                // value={tags}
            />   */}

        {/* <div contenteditable="true">
                <Tag color="magenta">magenta</Tag>
            </div> */}

        <p>
          Enter up to 10 email addresses or phone numbers, separated by a comma.
        </p>
        <p>Roles</p>
        <Select style={{ width: '100%' }} />
        <p>Customized roles give users access to specific functions.</p>
      </AppCard>
    </>
  );
};

const StyleTagEditor = styled(TagEditor)``;

export default InviteUsers;
