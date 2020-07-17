import React, { useState, useEffect } from 'react';
import MemberTable from '.';

import HttpClient from '../../../components/httpClient';

let client = HttpClient();

const Member = (props) => {
    
    const [comId, setComId] = useState();
    const [orgId, setOrgId] = useState();
    const [members, setMembers] = useState();

    const [extraField, setExtraField] = useState('fullname');
    const [extraOrder, setExtraOrder] = useState('ASC');
    const [recordPerPage, setRecordPerPage] = useState(1000);
    const [defaultCurrentConst, setDefaultCurrentConst] = useState(1);
    const [pageSizeOptionsConst, setPageSizeOptionsConst] = useState(['2', '4', '8', '10']);
    const [showSizeChangerConst, setShowSizeChangerConst] = useState(true);

    useEffect(() => {
        setComId(props.comId);
        setOrgId(props.orgId);
        loadMembers();
    }, [props]);
    
    const loadMembers = async (field, order, pageSize, current) => {
        let exField = field == undefined ? extraField : field;
        let exOrder = order == undefined ? extraOrder : order;
        const record = pageSize == undefined ? `${recordPerPage}` : pageSize;
        const checkCurrent = current == undefined ? `${defaultCurrentConst}` : current;

        const body = {
            "com_id": comId || '',
            "org_id": orgId || '',
            "search_team":{
                "name":"e"
            },
            "members":{
                "conditional":[],
                "order": `${exField || ''} ${exOrder || ''}`,
                "limit": '500',
                "index_page": '1'
            },
            "services":{},
            "shift":{}
        }
        // console.log('body::: ', body)
        const result = await client.post('/v2/organizationdetails', body);

        console.log('result::: ', result)
        const members = result.data.members ? result.data.members : [];
        setMembers(members);
    }


    const handleChange = (pagination, sorter, extra) => {
        let order = extra.order == 'descend' ? 'DESC' : 'ASC';
        let field = extra.field;
        // console.log('field & order**', field, order)
        let current = pagination.current;
        let pageSize = pagination.pageSize;
        console.log('current', current);
        console.log('pageSize', pageSize);
        loadMembers(field, order, pageSize, current);
    };

    return(
        <>
            <MemberTable members={members ? members : {data: []}} orgId={orgId} onChange={handleChange} />
        </>
    )
}

export default Member;
