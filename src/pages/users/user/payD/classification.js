import React, { useState, useEffect } from 'react';
import Card from '../../../../components/v2/card';
import { Typography, Row, Col, Button, Icon, Select, Modal } from 'antd';
import { notificationWithIcon } from '../../../../components/notification';
// import Modal from '../../../../components/v2/modal';
// import Select from '../../../../components/v2/select';
import httpClient from '../../../../components/payApi';
import '../css/cssCard.css';
import '../css/payD.css';
const { Option } = Select;
const { Title } = Typography;
const { confirm } = Modal;

const formatNumber = (num) => {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

export default (props) => {
  console.log("props PayD : ", props);
  //เรียกใช้ภาษา
  const labelShow = props.labelShow;
  const disableText = labelShow.lDisable ? labelShow.lDisable : "Disable";
  const { paydDefault, memClassAmount } = props;
  const checkPaydDefault = paydDefault ? paydDefault[1] : null;
  const checkMemDisable = checkPaydDefault == "Class A" || checkPaydDefault == "Class B" ? " Baht" : "";
  const langValue = localStorage.getItem('langValue');
  const textClass = checkPaydDefault == "Disable" && disableText ? disableText : checkPaydDefault;

  console.log("textClass", paydDefault);

  const setPayDefault = checkPaydDefault === "Class A" || checkPaydDefault === "Class B" ? true : false;
  const checkMemClassAmount = memClassAmount ? memClassAmount : "";
  const userId = props.userId;
  const createdBy = props.createdBy;
  const tokenKey = localStorage.getItem('tokenKey');
  const defaultSelectValue = paydDefault ? paydDefault[1] + " " + formatNumber(checkMemClassAmount) + checkMemDisable : null;

  const [stateModalAssign, setStateModalAssign] = useState(false);
  const [selectSource, setSelectSource] = useState();
  const [selectedValue, setSelectedValue] = useState(defaultSelectValue);
  const [defaultClassName, setDefaultClassName] = useState();
  const [disableButt, setDisableButt] = useState();
  const [memClassAmountClass, setMemClassAmountClass] = useState();
  const [deleteShowDisable, setDeleteShowDisable] = useState(defaultSelectValue);
  const [selectOptions, setSelectOptions] = useState(defaultSelectValue);

  const [dimensions, setDimensions] = useState({});

  console.log("dimensions", dimensions);


  useEffect(() => {
    const resetSelectedValue = paydDefault ? paydDefault[1] + " " + formatNumber(checkMemClassAmount) + checkMemDisable : null;
    setSelectSource(props.selectSource);
  }, [stateModalAssign])

  useEffect(() => {
    setSelectOptions(defaultSelectValue);
  }, [defaultSelectValue]);

  useEffect(() => {
    // const memClassAmountClass = props.selectSource === undefined ? "" : props.selectSource;
    setDefaultClassName(props.paydDefault);
    setDisableButt(setPayDefault);
    setMemClassAmountClass(memClassAmountClass);
    setDeleteShowDisable(defaultSelectValue);
  }, [paydDefault, defaultSelectValue])

var base64string ="data:image/png;base64,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"


var img = document.createElement("img")
img.setAttribute("src", base64string)
setTimeout(function(){
   console.log("whaaaaaaaa",img.height, img.width);
},0)

  const createClass = async () => {
    const data = {
      "classId": selectedValue, // select class get id
      "memComId": userId, // user id on user table
      "createdBy": createdBy // create by user id of admin
    }
    const axiosConfig = {
      Header: {
        tokenKey

      }

    };

    const dataSource = await httpClient.post(`/companies/members/classes`, data, axiosConfig);
    if (dataSource.status === 200) {
      notificationWithIcon('success', dataSource.data);
      setDeleteShowDisable(defaultSelectValue);

    }
    setStateModalAssign(false);
    props.functionCallCreate([selectedValue, disableButt]);

  }

  const showModalAssign = async () => {
    setStateModalAssign(!stateModalAssign);
  };

  const showModalDelete = async (id, index) => {
    const deleteData = defaultClassName ? defaultClassName[0] : labelShow.lDisable ? labelShow.lDisable : "Disable";
    confirm({
      title: <div>{labelShow.delete_text ? labelShow.delete_text : "Are you sure delete ?"}</div>,
      okText: labelShow.btnYes ? labelShow.btnYes : "Yes",
      cancelText: labelShow.btnNo ? labelShow.btnNo : "No",
      okType: 'danger',
      onOk() {
        Delete(deleteData, index);
      },
    });

  };

  const Delete = async (id, index) => {
    const todoNew = [...defaultClassName];
    todoNew.splice(index, 1);
    setDefaultClassName(todoNew);
    const axiosConfig = {
      Header: {
        tokenKey
      }
    };

    await httpClient
      .delete(`/companies/members/classes/${id}`, axiosConfig)
      .then((response) => {
        if (response.status === 200) {
          notificationWithIcon('success', response.data);
          setDeleteShowDisable("");
          // setTimeout(() => {
          //   window.location.reload();
          // },
          //   1000
          // );

        }
      })
      .catch((error) => {
        notificationWithIcon('success', error);
      });
    setDisableButt(false);
    props.functionCallDelete(defaultClassName);

  };

  const handleCancel = () => {
    setStateModalAssign(false);
    setSelectOptions(defaultSelectValue);
    // setSelectedValue();
  };

  const onChangeSelected = (selected, option) => {
    console.log('onChangeSelected : ', option);
    // const defaultVal = selected === undefined || checkMemClassAmount == "Disable" ? 'Disable' : selected;
    setSelectedValue(selected);
    setSelectOptions(option.props.children);
  }

  // const checkSelectSourceDisable = checkSelectSource[0].classId === 0 ? "" : " Baht";
  const classItems = selectSource === undefined ? "" : selectSource.map((item, index) => {
    const unit = item.classId === 0 ? '' : 'Baht';
    const value = item.classId === 0 ? '' : item.classAmount;
    const textShow = item.className + ' ' + formatNumber(value) + ' ' + unit;

    return (
      <Option key={item.classId} value={item.classId} >
        {textShow}

      </Option>
    );
  });
  console.log("classItems::: ", classItems);

  return (
    <Card
      title={
        <Row>
          <Col offset={1}>
            <text
              className='card-header-font'
            >
              {labelShow.PayDClassification ? labelShow.PayDClassification : "PayD Classification"}
            </text>
          </Col>
        </Row>
      }
      size="small"
      extra={
        <Button onClick={showModalAssign} className="button-card">
          {labelShow.btnAssign ? labelShow.btnAssign : "Assign"}
        </Button>
      }
      className='classification'
    >
      <div>
        <Row>
          <Col offset={1} style={{ marginTop: 5 }}>

            {/* {selectedClassName ? selectedClassName : defaultArr} */}
            {paydDefault ? textClass + " " + formatNumber(checkMemClassAmount) + checkMemDisable : null}
            {disableButt === true ?
              <Icon
                type="more"
                style={{ float: 'right' }}
                onClick={showModalDelete}
              /> : null
            }
          </Col>
        </Row>
      </div>

      <Modal
        className='button-modal'
        visible={stateModalAssign}
        onCancel={handleCancel}
        onOk={createClass}
        okText={labelShow.saveBig ? labelShow.saveBig : "Save"}
        cancelText={labelShow.cancel_button ? labelShow.cancel_button : "Cancel"}
        title={
          <Title style={{ fontSize: '15px', fontWeight: 400 }}>
            <div> {labelShow.PayDClassification ? labelShow.PayDClassification : "PayD Classification"} </div>
          </Title>
        }
      >
        <Select
          placeholder="Please Select"
          onChange={onChangeSelected}
          value = {selectOptions}
          defaultValue={deleteShowDisable}
          size='lg'
          style={{ width: '100%' }}
        >
          {classItems}
        </Select>
      </Modal>
    </Card>
  );
}
