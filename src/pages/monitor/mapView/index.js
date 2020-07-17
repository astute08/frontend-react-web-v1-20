// import React, { useState, useEffect } from 'react';
// import Card from '../../../components/v2/card';
// import httpClient from '../../../components/axiosClient';
// import SelectTeam from './selectTeam/index';
// import { Col, Row, List } from 'antd';
// import Input from '../../../components/v2/input';
// import Select from '../../../components/v2/select';
// import CallMapApi from './callMapApi';
// import '../css/mapView.css';

// export default () => {
//     const [taskValue, setTaskValue] = useState();
//     const [resourceValue, setResourceValue] = useState([]);
//     // const [selected, setSelected] = useState();
//     const [refresh, setRefresh] = useState(false);

//     useEffect(() => {
//         onTaskApi();
//         const interval = setInterval(() => {
//             onResourceApi();
//         }, 60000);
//     }, []);

//     useEffect(() => {
//         onResourceApi();
//     }, [])

//     const onTaskApi = () => {

//         const data = {
//             "org_code": "3",
//             "com_code": "1",
//             "language": "ENG",
//             "search": [{ "key": "tracking_id", "val": "00", "type": "like" }]
//         }

//         httpClient.post('/tasks/monitor', data).then(
//             (reponse) => {
//                 console.log("task", reponse.data.data.list);

//                 setTaskValue(reponse.data.data.list);

//             },
//             (error) => {
//                 console.log(error);
//             }
//         )
//     }

//     const onResourceApi = async (orgId = "3") => {
//         console.log("orgId", orgId);

//         const newData = [];

//         try {
//             const response = await httpClient.get(`/v2/resource/organization/${orgId}`);
//             console.log("response", response);
//             if (response.status == 200) {
//                 setResourceValue(response.data);
//             }
//         }
//         catch (e) {
//             console.log('Error : ', e);
//         }
//     }

//     const onSelected = (value) => {
//         onResourceApi(value);

//     }

//     return (
//         <Card>
//             <Row>
//                 <Col span={12}>
//                         <List.Item className = 'col-1'>
//                             <Input
//                                 placeholder={'Search'}
//                             />

//                             <Select

//                             />

//                         </List.Item>

//                 </Col>
//                 <Col span = {8} >
//                     <SelectTeam className = 'selected-style' callSelectedValue={onSelected} />

//                 </Col>
//             </Row>

//             <CallMapApi taskValue={taskValue} resourceValue={resourceValue} />
//         </Card>

//     );
// }

import React, { useState, useEffect } from 'react';
import Card from '../../../components/v2/card';
import httpClient from '../../../components/axiosClient';
import SelectTeam from './selectTeam/index';
import { Col, Row } from 'antd';
import CallMapApi from './callMapApi';
import '../css/mapView.css';
import { isUndefined } from 'lodash';

export default () => {
    const [taskValue, setTaskValue] = useState();
    const [resourceValue, setResourceValue] = useState([]);
    const [selected, setSelected] = useState(3);
    const [refresh, setRefresh] = useState(false);
    const [popupChange, setPopupChange] = useState(false);
    const [timeout, setTimeout] = useState(true);
    const [teamValue, setTeamValue] = useState();

    console.log("aaaaaa", resourceValue);

    // useEffect(() => {
    //     onTaskApi();

    // }, [refresh]);

    useEffect(() => {
        onResourceApi();
    }, [teamValue])

    useEffect(() => {
        const interval = setInterval(() => {
            onResourceApi();
            setPopupChange(!!popupChange);
        }, 60000);
        return () => clearInterval(interval);
    }, [selected, timeout])

    const handleRefresh = () => {
        setRefresh(!refresh);
    }

    const onTaskApi = () => {

        const data = {
            "org_code": "3",
            "com_code": "1",
            "language": "ENG",
            "search": [{ "key": "tracking_id", "val": "00", "type": "like" }]
        }

        httpClient.post('/tasks/monitor', data).then(
            (response) => {
                setTaskValue(response.data.data.list);

            },
            (error) => {
                console.log(error);
            }
        )
    }

    const onResourceApi = async (orgId) => {
        const team = orgId === undefined ? 3 : selected;
        const team2 = orgId === undefined ? selected : orgId;
        const teamCheck = team2 == 2 || team2 == 1 ? orgId : team2;
        console.log("orgIdTeam", team);
        console.log("orgId=>", orgId);
        console.log("teamCheck=>", teamCheck);

        try {
            const response = await httpClient.get(`/v2/resource/organization/${teamCheck}`);
            if (response.status == 200) {

                console.log("Mapppppp",response.data);
                if (response.data.length > 0) {
                    const data = response.data.length ? response.data : [];
                    // console.log("Mapppppp", data);

                    setResourceValue(data);
                    setPopupChange(!popupChange);
                }
            }
            onTaskApi();

        }
        catch (e) {
            console.log('Error : ', e);
        }
    }

    const onSelected = (value) => {
        onResourceApi(value);
        setSelected(value);
        setTeamValue(value);
    }

    return (
        <Card className="card-map-View">
            <Row className='selected-style' ><SelectTeam callSelectedValue={onSelected} /> </Row>
            <Row><CallMapApi resourceValue={resourceValue} taskValue={taskValue} handleRefresh={handleRefresh} popupChange={popupChange} /> </Row>
        </Card>
    );
};

