import React from 'react';
import { TreeSelect } from 'antd';

export default (props) => {
    const theme = {
        space: {
            xxs: '10%',
            xs: '20%',
            sm: '30%',
            md: '45%',
            default: '70%',
            lg: '100%'
        }
    }
    const spaceTreeSelect = props.size ? theme.space[props.size] : theme.space.lg;

    const TreeKg = {
        width: `${spaceTreeSelect}`,
    }
    return (
        <TreeSelect {...props} style = {TreeKg}/>

    );
}