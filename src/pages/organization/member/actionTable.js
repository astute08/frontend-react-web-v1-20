import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import HttpClient from '../../../components/httpClient';
import { Icon, Row, Col, Select, List, Dropdown, Menu, Checkbox, Button, Popover } from 'antd';
import Buttons from '../../../components/v2/button'
import Input from '../../../components/v2/input';
import Modalmember from './modalMember';
import _ from 'lodash';

let client = HttpClient();
const { Option } = Select;

export default (props) => {
  // console.log('Props Action:: ', props);

  // const refreshTable = _.get(props, 'refreshDataMembers');
  const column = props.columns;
  const columns = [...column];
  columns.splice(0, 1);
  columns.splice(5, 1);
  const [result, setResult] = useState();

  const functionCallSave = (result) =>{
    setResult(result);
    console.log("BBBB",result);
    props.functionCallSave(result);
  }

    const menuColumn = () => {
      return (
        <Menu>
          <Menu.Item>
            {columns.map((item, i) => (
              <div key={i} style={{ display: 'block', marginBottom: '10px' }}> 
                <Checkbox 
                  value={item.key}
                  onChange={props.checkedValuecolumns}
                  checked={props.checked[item.key] ? true : false}
                >
                  {item.select}
                </Checkbox>
              </div>
            ))}
          </Menu.Item>

          <Menu.Item style={{ color: '#FF1C00', textAlign: 'left' }}>
            {props.textErrorSelectColumn}
          </Menu.Item>

          <Menu.Item>
            <Button.Group style={{ display: 'flex', justifyContent: 'center' }}>
              <Button onClick={props.handleCheckOk}>
                  OK
              </Button>
              <Button onClick={props.handleReset}>
                  Reset
              </Button>
            </Button.Group>
          </Menu.Item>
        </Menu>
      )
    }

    return(
      <div>
        <Row>
          <Col span={12} style={{ margin: 0}}>
            <Row>
              <List.Item>
                <Input
                  onChange={(e) => props.onChange(e.target.value)}
                  placeholder={'Search'}
                  prefix={<Icon type="search" />}
                />
                <Select 
                    className="member-select"
                    onSelect={(value) => props.onSelect(value)}
                    value={props.selectSearchData}
                >
                  <Option value="">All columns</Option>
                  {columns.map((item, i) => (
                    <Option key={i} value={item.key}>
                      {item.select}
                    </Option>
                  ))}
                </Select>
              </List.Item>
            </Row>
          </Col>
          <Col span={12} style={{ margin: 0, paddingRight: 24 }}>
            <Row>
              <List.Item style={{ float: 'right' }} >
                <Dropdown overlay={menuColumn} trigger={['click']} onVisibleChange={props.handleVisibleChange} visible={props.visible}>
                  <Buttons type="primary" onClick={props.handleOnVisiblecolumns}> 
                    columns
                    <Icon type="down" />
                  </Buttons>
                </Dropdown>

                <Modalmember dataMembers={props.dataMembers} orgId={props.comId} refreshDataMembers={props.refreshDataMembers}/>
              </List.Item>
            </Row>
          </Col>
        </Row>
      </div>
    )
};
