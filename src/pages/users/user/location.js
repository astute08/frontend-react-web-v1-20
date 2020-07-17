import React, { useState, useEffect } from 'react';
import Autocomplete from 'react-google-autocomplete';
import { useParams } from 'react-router-dom';
import { Card, Col } from 'antd';
import _ from 'lodash';
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} from 'react-google-maps';
import Geocode from 'react-geocode';
import GetApi from '../../../components/httpClient';

let client = GetApi();

const BaseGoogleMap = _.flowRight(
  withScriptjs,
  withGoogleMap
)(props => {
  const { center, marker, onDragEnd, onPlaceSelected, place, ref, value } = props;
  return (
    <div>
      <Autocomplete
        {...props}

        style={{ width: '100%' }}
        onPlaceSelected={onPlaceSelected}
        types={['(regions)']}
        componentRestrictions={{ country: 'th' }}
        defaultValue={props.place}

      />
      <GoogleMap zoom={12} center={center}>
        {marker && (
          <Marker position={marker} draggable onDragEnd={onDragEnd} ref={ref} />
        )}
      </GoogleMap>
    </div>
  );
});

const defaultMapProps = {
  googleMapURL: `https://maps.googleapis.com/maps/api/js?libraries=geometry,drawing,places&key=AIzaSyAxYYHQFD8gwBC5XV6Ql6ZcX1E1mGlR_VY`,
  loadingElement: <div style={{ height: `100%` }} />,
  containerElement: <div style={{ height: `400px` }} />,
  mapElement: <div style={{ height: `100%`, width: '100%' }} />,
};

const Map = (props) => {
  return (
    <div>
      <BaseGoogleMap {...defaultMapProps} {...props} />
    </div>
  );
};

export default (props) => {
  const [marker, setMarker] = useState();
  const [place, setPlace] = useState();
  const [dataSourceId, setToDatasourceId] = useState([]);
  const [center, setCenter] = useState({ lat: 19.9104798, lng: 99.840576 });
  const [addressShow, setAddressShow] = useState();
  //เรียกใช้ค่าภาษา
  const labelShow = props.labelShow;

  console.log("place", place);


  const param = useParams();
  const memComId = props.memComId;
  // console.log('memComId:::', memComId);

  // get data จาก button value เพื่อนำมาเปลี่ยนภาษา จากหน้า userMenu
  console.log("LocationLang", props);

  // console.log("Props", props);
  // console.log(props.comId, langValue, props.pageCode);

  useEffect(() => {
    getLocation();
  }, []);


  const getLocation = async (id) => {
    try {
      client.defaults.baseURL = `${process.env.REACT_APP_URL_MANAGER_ADD_PORT}`;
      client.defaults.headers = {
        'Content-Type': 'application/json',
      };

      const res = await client.get(`/v2/users/${memComId}/${param.user_id}`);
      console.log('Get user data:::', res);

      // setCenter(res.location_lat, res.location_lng);
      const responseDataCheck = res.data.length ?
        setCenter({
          lat: parseFloat(res.data[0].location_lat),
          lng: parseFloat(res.data[0].location_lng),
        }) : setCenter({ lat: parseFloat(13.853906), lng: parseFloat(100.514944) });

      setAddressShow(res);


      Geocode.setApiKey("AIzaSyAxYYHQFD8gwBC5XV6Ql6ZcX1E1mGlR_VY");
      console.log("responseData", res.data.length ? "Yes" : "No");
      // const latlngCheck = res.data.length ? 
      res.data.length ? Geocode.fromLatLng(res.data[0].location_lat, res.data[0].location_lng).then(
        response => {
          const address = response.results[0].formatted_address;
          console.log("aaaaaaaaaaaaa", address);
          setPlace(address);
        },
        (error) => {
          console.error("errorerrorerrorerror");
        },
      ) : Geocode.fromLatLng(13.853906, 100.514944 ).then(
        response => {
          // const address = ({ lat: parseFloat(13.853906), lng: parseFloat(100.514944) });
          const address = response.results[0].formatted_address ? response.results[0].formatted_address : ({ lat: parseFloat(13.853906), lng: parseFloat(100.514944) });

          console.log("5555555555", address);
          setPlace(address);
        },
        (error) => {
          console.error("errorerrorerrorerror");
        },
      )
    } catch (error) {
      console.log('error', error.response);
    }
  };

  const getLocationData = async (lat, lng, address) => {
    // client.defaults.baseURL = 'http://192.168.11.181:8200';
    client.defaults.baseURL = `${process.env.REACT_APP_URL_MANAGER_ADD_PORT}`;
    client.defaults.headers = {
      'Content-Type': 'application/json',
    };

    // console.log('Lat, Lng', lat, lng);

    ////////////////////////////////////////////////////
    await client
      .post(`/v2/update/user`, {
        user_id: param.user_id,
        updated_by: memComId,
        location_lat: lat,
        location_lng: lng,
      })
      .then((respone) => {
        if (respone.status === 200) {
          console.log('Success');
          console.log('Resss', respone);
        } else {
          console.log('Empty');
        }
      })
      .catch((error) => {
        console.log('error');
      });
  };

  // send userId, companyId, Location infomation w/api
  // create body

  const handlePlaceChanged = (place) => {
    const { lat, lng } = place.geometry.location;
    const location = { lat: lat(), lng: lng() };

    setPlace(place.formatted_address);
    setMarker(location);
    setCenter(location);
    getLocationData(location.lat, location.lng, place.formatted_address);
    setAddressShow(place.formatted_address);

    // var latLng = new google.maps.LatLng(location); //Makes a latlng
    // defaultMapProps.panTo(latLng); //Make map global

    // latlong
  };

  const handleDragEnd = async (e) => {
    const resp = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${e.latLng.lat()},${e.latLng.lng()}&key=AIzaSyAxYYHQFD8gwBC5XV6Ql6ZcX1E1mGlR_VY`,
    );

    // console.log('Response Lat Lng', resp);

    const json = await resp.json();
    // console.log('Response json json', json);

    // setMarker(loc);
    if (json.results.length) setPlace(json.results[0].formatted_address);
    // console.log("place", place);
    getLocationData(e.latLng.lat(), e.latLng.lng(), json.results[0].formatted_address);
    setAddressShow(place);
  };
  return (
    <Card title={labelShow.cSetdefaultloc ? labelShow.cSetdefaultloc : "Set Default Location"} style={{ height: '546px', padding: '5px 24px 24px 24px' }}>

      <Map
        marker={marker || center}
        onDragEnd={handleDragEnd}
        center={center}
        onPlaceSelected={handlePlaceChanged}
        ref={(map) => map && map.panTo({ lat: 13.859011, lng: 100.4646249 })}
        getLocation
        place={place}
      />
    </Card>
  );
};
