import React, { useState, useEffect, useCallback } from 'react';
import './css/addArea.css';
import { Table, Modal, Form, Select } from 'antd';
import Button from '../../../components/v2/button';
import AreaFrom from './areaForm';

export default ({areaList, taskTypes}) => {
  // console.log('Area props::: ', props);

  // const taskTypes = props.taskTypes;

  const coords = [
    {
      "code": "bangkok",
      "name": "Bangkok",
      "area": [
        {
          code: "BANGKOK01",
          name: "พญาไท",
          type: "polygon", // polygon, point,
          color: "#FF0000",
          coordinates: [
            {lat: 100.4940888, lng: 13.7841716},
            {lat: 100.4883601, lng: 13.7809077},
            {lat: 100.4689624, lng: 13.7585662},
            {lat: 100.4710223, lng: 13.735889},
            {lat: 100.4742839, lng: 13.7297191},
            {lat: 100.4775454, lng: 13.7315535},
            {lat: 100.4809787, lng: 13.7368896},
            {lat: 100.4845836, lng: 13.7378901},
            {lat: 100.5005481, lng: 13.7470612},
            {lat: 100.5043246, lng: 13.7467277},
            {lat: 100.5154826, lng: 13.7383903},
            {lat: 100.5587413, lng: 13.7200471},
            {lat: 100.5606296, lng: 13.7245496},
            {lat: 100.5594279, lng: 13.7327207},
            {lat: 100.5611445, lng: 13.7363893},
            {lat: 100.5630328, lng: 13.7490621},
            {lat: 100.5659511, lng: 13.7599001},
            {lat: 100.5731608, lng: 13.7704042},
            {lat: 100.5748774, lng: 13.8054143},
            {lat: 100.5618312, lng: 13.8130825},
            {lat: 100.5589129, lng: 13.8137493},
            {lat: 100.5580546, lng: 13.8125824},
            {lat: 100.556853, lng: 13.8087483},
            {lat: 100.5510165, lng: 13.7980793},
            {lat: 100.5458667, lng: 13.7975791},
            {lat: 100.5431201, lng: 13.8017468},
            {lat: 100.5338504, lng: 13.8057477},
            {lat: 100.5307605, lng: 13.8060811},
            {lat: 100.5257823, lng: 13.8065812},
            {lat: 100.5192592, lng: 13.8064145},
            {lat: 100.5117061, lng: 13.803914},
            {lat: 100.5111911, lng: 13.8009133},
            {lat: 100.502608, lng: 13.7897437},
            {lat: 100.4940888, lng: 13.7841716}
          ]
        },
        {
          code: "BANGKOK02",
          name: "ยานนาวา",
          type: "polygon", // polygon, point,
          color: "#FFFF00",
          coordinates: [
            {lat: 100.5584945, lng: 13.7199533},
            {lat: 100.5152359, lng: 13.7382965},
            {lat: 100.5040779, lng: 13.7466339},
            {lat: 100.5003013, lng: 13.7469673},
            {lat: 100.4843368, lng: 13.7377962},
            {lat: 100.4807319, lng: 13.7367957},
            {lat: 100.4772987, lng: 13.7314596},
            {lat: 100.4740371, lng: 13.7296253},
            {lat: 100.476073, lng: 13.724878},
            {lat: 100.4768026, lng: 13.7206673},
            {lat: 100.4779184, lng: 13.716248},
            {lat: 100.4786909, lng: 13.7118287},
            {lat: 100.4794633, lng: 13.7095773},
            {lat: 100.4819524, lng: 13.7067422},
            {lat: 100.4878747, lng: 13.7029898},
            {lat: 100.4945695, lng: 13.6993207},
            {lat: 100.496372, lng: 13.6974861},
            {lat: 100.5036676, lng: 13.6900643},
            {lat: 100.5099332, lng: 13.6894806},
            {lat: 100.5146539, lng: 13.6883965},
            {lat: 100.5200612, lng: 13.6858113},
            {lat: 100.5261552, lng: 13.6926495},
            {lat: 100.5390298, lng: 13.6974027},
            {lat: 100.542978, lng: 13.7037403},
            {lat: 100.5463254, lng: 13.7054914},
            {lat: 100.5577409, lng: 13.7170819},
            {lat: 100.5584945, lng: 13.7199533}
          ]
        },
        {
          code: "BANGKOK03",
          name: "บางเขน",
          type: "point", // polygon, point,
          coordinates: { 
            lat: 13.736717, 
            lng: 100.523186, 
          }
        }
      ]
    },
    {
      "code": "nonthaburi",
      "name": "Nonthaburi",
      "area": [
        {
          code: "nonthaburi01",
          name: "จังหวัดนนทบุรี",
          type: "polygon", // polygon, point,
          color: "#FFD700",
          coordinates: [
            {lat: 100.5384128, lng: 13.9564865},
            {lat: 100.4869144, lng: 13.9498226},
            {lat: 100.4642551, lng: 13.9718126},
            {lat: 100.4525821, lng: 13.9698136},
            {lat: 100.3825443, lng: 13.9997968},
            {lat: 100.3804843, lng: 13.9891366},
            {lat: 100.3585117, lng: 13.995133},
            {lat: 100.3317325, lng: 14.0524245},
            {lat: 100.3440921, lng: 14.1143631},
            {lat: 100.3289859, lng: 14.1263493},
            {lat: 100.2974002, lng: 14.1403324},
            {lat: 100.2802341, lng: 14.1270152},
            {lat: 100.2623813, lng: 13.9984643},
            {lat: 100.2974002, lng: 13.9638165},
            {lat: 100.2678745, lng: 13.9218324},
            {lat: 100.3262393, lng: 13.8038362},
            {lat: 100.4656284, lng: 13.797168},
            {lat: 100.4649417, lng: 13.7878322},
            {lat: 100.5136936, lng: 13.8111711},
            {lat: 100.5054538, lng: 13.8198392},
            {lat: 100.5123203, lng: 13.8251733},
            {lat: 100.543906, lng: 13.8498419},
            {lat: 100.5665653, lng: 13.9518218},
            {lat: 100.5384128, lng: 13.9564865},
          ] 
        },
        {
          code: "nonthaburi02",
          name: "เทศบาลนนทบุรี",
          type: "point", // polygon, point,
          coordinates: { 
            lat: 13.8638418, 
            lng: 100.5212467, 
          }
        }
      ]
    }
  ]


  const [visible, setVisible] = useState(false);
  const [formRef, setFormRef] = useState(null);
  const [selectAreaList, setSelectAreaList] = useState([]);

  useEffect(() => {

  }, []);

  const onChange = (value) => {
    console.log('selected value:::++ ', value);

    if (value) {
      areaList.forEach((element, index, array) => {
        setSelectAreaList(element.area);
      })
    }

    // if (value) {
    //   coords.filter((element) => {
    //     if (element.code === value) {
    //       setAreaList(element.area);
    //     }
    //   })
    // } else (console.error())
  }


  const handleCreate = async () => {
    formRef.validateFields( async (err, values) => {
      if (err) {
        return;
      }
      console.log('Received values of form: ', values);
      formRef.resetFields();
      setVisible(false);
    });
  };

  const saveFormRef = useCallback((node) => {
    if (node !== null) {
      setFormRef(node);
    }
  }, []);

  const showModal = () => {
    setVisible(true);
  };

  const handleCancel = e => {
    formRef.validateFields(async (err, values) => {
      if (err) {
        return;
      }
      formRef.resetFields();
    })
    formRef.resetFields();
    setVisible(false);
  };

  return (
    <div>
      <Button type="primary" fontSize="md" btnSize="wd_lg" onClick={showModal}>
        Add Area
      </Button>

      <AreaFrom
        areaList={areaList}
        taskTypes={taskTypes}
        onChange={onChange}
        ref={saveFormRef}
        visible={visible}
        onCancel={() => handleCancel()}
        onCreate={() => handleCreate()}
      />
    </div>
  )
}
