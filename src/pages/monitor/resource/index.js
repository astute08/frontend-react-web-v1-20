import React, { useState, useEffect } from 'react';
import Resource  from './resource '
import HttpClient from '../../../components/httpClient';

let client = HttpClient();

export default (props) => {
    console.log('Resource ::** ', props);

    let name = props.name;
    let lastname = props.lastname;
    let phone = props.phone;
    let imgPath = props.imgPath;

    console.log("Image", imgPath);

    const [resource, setResource] = useState();

    useEffect(() => {
        // loadResource();
      }, [props]);
    

    // const loadResource = async () => {
    //     const result = await client.get(`/v2/resource/organization/3`);
    //     console.log('loadResource:* ', result.data)
    //     setResource({...result.data[0]})
    // }

    return(
        // <Resource resource={resource} />
        <Resource name={name} lastname={lastname} phone={phone} imgPath={imgPath} />
    )
}