import React, { useState, useEffect, useRef } from 'react';
import { Menu, Dropdown, Icon, Checkbox, Button, Form } from 'antd';
import { columns1 } from '../pages/users/user/columns1';

// const defaultCheckedList = [columns1];

const ButtonGroup = Button.Group;

const dataColumns1 = [...columns1];
dataColumns1.splice(0, 1);
dataColumns1.splice(7, 1);

const SelectColumn = (props) => {
  const [checkedList, setCheckedList] = useState(dataColumns1);
  const [indeterminate, setIndeterminate] = useState(true);
  const [visible, setVisible] = useState(false);
  const [checkValue, setCheckValue] = useState();
  const [newColumns, setNewColumns] = useState([...columns1]);

  // ต้นแบบ
  const checkedValue = (checkedValue) => {
    setCheckValue(checkedValue);
    // console.log('value::: ', checkedValue)
    const setNewColumnsArr = [];

    if (checkedValue.length === 0) {
      setNewColumns(dataColumns1);
    } else {
      for (let i = 0; i < columns1.length; i++) {
        const found = checkedValue.find(
          (element) => element === columns1[i].key,
        );
        if (found !== undefined) {
          setNewColumnsArr.push(columns1[i]);
        }
      }
      setNewColumns(setNewColumnsArr);
      console.log('setNewColumnsArr::: ', setNewColumnsArr);
    }
  };

  // const handleOK = () => {
  //     setArryCheckbox([...arryCheckbox, checkValue]);
  //     console.log("arryCheckbox:::: ", [...arryCheckbox, checkValue])
  // }

  const handleOnVisibleChange = () => {
    setVisible(!visible);
    console.log();
  };

  const menu = () => {
    return (
      <Menu style={{}}>
        <Menu.Item style={{}}>
          <Checkbox.Group onChange={checkedValue}>
            {columns1.map((item, i) => (
              <div style={{ display: 'block', marginBottom: '10px' }}>
                <Checkbox key={i} value={item.key}>
                  {item.select}
                </Checkbox>
              </div>
            ))}
          </Checkbox.Group>
        </Menu.Item>

        <Menu.Item>
          <ButtonGroup>
            <Button onClick={handleOnVisibleChange}>OK</Button>
            <Button onClick={handleOnVisibleChange}>Reset</Button>
          </ButtonGroup>
        </Menu.Item>
      </Menu>
    );
  };

  return (
    <Dropdown overlay={menu} visible={visible}>
      <Button className="ant-dropdown-link" onClick={handleOnVisibleChange}>
        Columns <Icon type="down" />
      </Button>
    </Dropdown>
  );
};

export default SelectColumn;
