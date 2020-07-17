import React, { useEffect, useState } from 'react';
import Card from '../../../../components/v2/card';
import TeamSelect from './treeSelect';
import httpClient from '../../../../components/axiosClient';

export default (props) => {

    const [datasource, setDataSource] = useState([]);
    const [selected, setSelected] = useState();
    
    useEffect(() => {
        treeData();
    }, [])

    const onSelected =(value)=>{
        props.callSelectedValue(value);
        // setSelected(value);
        

    }

    const treeData = () => {
        const data = {
            "com_id": "1",
            "org_id": selected ? selected : 3,
            "search_team": {
                "name": ""
            },
            "members": {
                "conditional": [
                ],
                "order": "fullname ASC",
                "limit": "10",
                "index_page": "1"
            }
        }

        httpClient.post('/v2/organizationdetails', data).then(
            (response) => {
                setDataSource(response.data.treeTeams);

            },
            (error) => {
                console.log(error);
            }
        )
    }
    return (
            <TeamSelect datasource={datasource} functionCallSelected = {onSelected}/>
    );
}
