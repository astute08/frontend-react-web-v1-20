import React, { useState, useEffect } from 'react';
import TreeSelect from '../../../../components/v2/treeSelect';
import Helper from '../../../../modules/helper';
const helper = new Helper();

export default (props) => {

    const [value, setValue] = useState(undefined);
    const [datasource, setDatasource] = useState([props.datasource]);

    useEffect(() => {

        if (props.datasource.length) {
            const newTree = helper.setSelectOrganization(props.datasource);
            setDatasource(newTree);
        }

    }, [props])

    const onChange = value => {
        props.functionCallSelected(value);
        // setValue(value);
        
      };

    return (
        <TreeSelect
            size='xxs'
            treeData={datasource}
            // value={value}
            onChange={onChange}
        />
    );
}
