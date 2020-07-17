import React, { useState, useEffect } from 'react';
import './css/actionServies.css';
import AddArea from './addArea';
import { Row, Col, List, Input, Select, Icon, Dropdown, Button, Checkbox, Menu } from 'antd';
import Buttons from '../../../components/v2/button';

const { Option } = Select;


export default (props) => {
  // console.log('Action Servies::: ', props);

  const {
    columns,
    areaList,
    taskTypes,
    checked, 
    selectSearchData,
    onSelect,
    handleReset, 
    handleCheckOk, 
    checkedValuecolumns, 
    handleOnVisiblecolumns, 
    handleVisibleChange, 
    textErrorSelectColumn,
    visible,
    comId,
    orgId,
    refreshDataServices
  } = props;

  const columnSelect = [...columns];
  columnSelect.splice(0, 1);
  columnSelect.splice(3, 1);

  const menuColumn = () => {
    return (
      <Menu>
        <Menu.Item>
          {columnSelect.map((item, i) => (
            <div key={i} style={{ display: 'block', marginBottom: '10px' }}> 
              <Checkbox 
                value={item.key}
                onChange={checkedValuecolumns}
                checked={checked[item.key] ? true : false}
              >
                {item.select}
              </Checkbox>
            </div>
          ))}
        </Menu.Item>

        <Menu.Item style={{ color: '#FF1C00', textAlign: 'left' }}>
          {textErrorSelectColumn}
        </Menu.Item>

        <Menu.Item>
          <Button.Group style={{ display: 'flex', justifyContent: 'center' }}>
            <Button onClick={handleCheckOk}>
                OK
            </Button>
            <Button onClick={handleReset}>
                Reset
            </Button>
          </Button.Group>
        </Menu.Item>
      </Menu>
    )
  }

  return (
    <div>
        <Row>
          <Col span={12} style={{ margin: 0}}>
            <Row>
              <List.Item>
                <Input  
                  className="input-search"
                  placeholder={'Search'}
                  prefix={<Icon type="search" />}
                />
                <Select className="services-select" onSelect={(value) => onSelect(value)} value={selectSearchData}>
                  <Option value="">All columns</Option>
                  {columnSelect.map((item, i) => (
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
              <Dropdown overlay={menuColumn} trigger={['click']} onVisibleChange={handleVisibleChange} visible={visible}>
                  <Buttons type="primary" onClick={handleOnVisiblecolumns}> 
                    columns
                    <Icon type="down" />
                  </Buttons>
                </Dropdown>
                
                <AddArea areaList={areaList} taskTypes={taskTypes} comId={comId} orgId={orgId} refreshDataServices={refreshDataServices} />

              </List.Item>
            </Row>
          </Col>
        </Row>
    </div>
  )
}
