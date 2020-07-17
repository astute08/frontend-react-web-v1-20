import React, { useState, useEffect } from "react";
import ReactDOM from 'react-dom';
import {
  withGoogleMap,
  GoogleMap,
  withScriptjs,
  Marker,
  InfoWindow,
  Circle

} from "react-google-maps";
import { Button, Popover, Input } from 'antd';
import { compose, withProps, withStateHandlers } from "recompose";
import Team from '../../users/user/team';
import Assignee from '../assignee/assignee';
import MapControls from "./mapControl";

import '../css/mapView.css';

// remove control option on GoogleMap
const defaultMapOptions = {
  fullscreenControl: false,
  fullscreenControlOptions: false,
  streetViewControl: false,
  zoomControl: false,
  mapTypeControl: false
};

var buttonStyle = {
  position: "fixed",
  // left: "0",
  top: "5px",
  // width: "180px",
  height: '30px',
  // border: "thin solid #ddd",
  // borderLeft: "none",
  // padding: "1000px",
  right: '10px',
  // borderRadius: "0px 4px 4px 0px",
  opacity: "1",
  textAlign: 'center',

};



const MapWithPlaces = compose(
  withProps({
    googleMapURL:
      'https://maps.googleapis.com/maps/api/js?libraries=geometry,drawing,places&key=AIzaSyAxYYHQFD8gwBC5XV6Ql6ZcX1E1mGlR_VY',
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: '100vh', width: '100%' }} />,
    mapElement: <div style={{ height: '100%' }} />,

  }),
  withStateHandlers(
    (props) => ({
      infoWindows: props.places.map((p) => {
        return { isOpen: false };

      }),
    }),
    {
      onToggleOpen: ({ infoWindows }) => (selectedIndex) => ({
        infoWindows: infoWindows.map((iw, i) => {
          iw.isOpen = selectedIndex === i;
          return (iw);
        }),
      }),

      onMarkerClustererClick: () => markerClusterer => {
        const [showMarker, setShowMarker] = useState(true);
        const onClickControlMarker = (e) => {
            setShowMarker(false);
        }

        return(showMarker);
      }
    },

  ),
  withScriptjs,
  withGoogleMap
)(props => (

  <div>
    {/* {props.infoWindows.isOpen && ( */}
    <GoogleMap defaultZoom={props.zoom} defaultCenter={{ lat: 13.748763, lng: 100.527127 }} onClick = {props.onToggleOpen.bind()}>

    {props.places &&
      props.places.map((place, i) => {

        const httpPath = '192.168.11.181:8200';
        const datasource = props.places[i];
        let lat = parseFloat(place.lat, 10);
        let lng = parseFloat(place.lng, 10);
        const imageProfile = (httpPath + place.assignee.profile.profile_img);

        // let lat = parseFloat(place.latitude, 10);
        // let lng = parseFloat(place.longitude, 10);
        // const lat1 = place.location_lat;
        // const lng2 = place.locationlng;
        var goldStar = {
          path: 'M768 512q0-106-75-181t-181-75t-181 75t-75 181t75 181t181 75t181-75t75-181zm256 0q0 109-33 179l-364 774q-16 33-47.5 52t-67.5 19t-67.5-19t-46.5-52L33 691Q0 621 0 512q0-212 150-362T512 0t362 150t150 362z',
          fillColor: datasource.status_code.color,
          fillOpacity: 100,
          scale: 0.017,
          // strokeColor: 'blue',
          // strokeWeight: 0.1
          // path: 'M10,1.375c-3.17,0-5.75,2.548-5.75,5.682c0,6.685,5.259,11.276,5.483,11.469c0.152,0.132,0.382,0.132,0.534,0c0.224-0.193,5.481-4.784,5.483-11.469C15.75,3.923,13.171,1.375,10,1.375 M10,17.653c-1.064-1.024-4.929-5.127-4.929-10.596c0-2.68,2.212-4.861,4.929-4.861s4.929,2.181,4.929,4.861C14.927,12.518,11.063,16.627,10,17.653 M10,3.839c-1.815,0-3.286,1.47-3.286,3.286s1.47,3.286,3.286,3.286s3.286-1.47,3.286-3.286S11.815,3.839,10,3.839 M10,9.589c-1.359,0-2.464-1.105-2.464-2.464S8.641,4.661,10,4.661s2.464,1.105,2.464,2.464S11.359,9.589,10,9.589',
          // strokeColor: '#00F',
          // fillColor: 'blue',
          // fillOpacity: 0.8,
          // // strokeWeight: 14,
          // scale: 1,
          // rotation: 45
      
        };
      
        return (
          // <Popover placement="top" title={text} content={content} trigger="click">
          <Marker
            id={place.id}
            key={place.id}
            position={{ lat: lat, lng: lng }}
            title="Click to zoom"
            onClick={props.onToggleOpen.bind(this, i)}

            // icon={{
            //   url: 'https://sv1.picz.in.th/images/2020/04/08/Qmibfn.png',
            //   // url: `http://192.168.11.181:8200${place.assignee.profile.profile_img}`,

            //   // size: { width: 20, height: 50 },
            //   // anchor: { x: 10, y: 40 },
            //   scaledSize: {
            //     width: 20,
            //     height: 32
            //   }
            // }}

            icon = {goldStar}

          >
            {props.infoWindows[i].isOpen && (
              <InfoWindow onCloseClick={props.onToggleOpen.bind(i)}>
                <Assignee datasource = {datasource} places={props.places} />
              </InfoWindow>
            )}

          </Marker>
          // </Popover>
        );
      })}

    </GoogleMap>
    {/* )} */}
  </div >
));

export default MapWithPlaces;
