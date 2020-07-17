import React, { useState, useEffect } from 'react';
import Autocomplete from 'react-google-autocomplete';
import _, { isUndefined } from 'lodash';
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow,
  Circle,
  MarkerClusterer
} from 'react-google-maps';
import { compose, withProps, withStateHandlers } from "recompose";
import Avatar from '../../../components/v2/avatar';
import Assignee from '../assignee/assignee';
import Resource from '../resource/index';
import MapControls from "./mapControl";
import MyMarker from './marker';
import pinIcon from './avatar-367.png';

import '../css/mapView.css';
import { isImageUrl } from 'antd/lib/upload/utils';

const getPixelPositionOffset = (width, height) => ({
  x: -(width / 2),
  y: -(height / 2),
})

const BaseGoogleMap = _.flowRight(
  withStateHandlers(
    (props) => ({
      iconUrl: "https://maps.google.com/mapfiles/ms/icons/red.png",
      infoTask: props.taskData.map((p) => {
        return { isOpen: false };
      }),
      infoWindows: props.resourceData.map((p) => {
        return { isOpen: false };
      }),
    }),
    {
      onTaskOpen: ({ infoTask, infoWindows }) => (selectedIndex) => ({
        infoTask: infoTask.map((iw, i) => {
          iw.isOpen = selectedIndex === i;
          return (iw);
        }),
        infoWindows: infoWindows.map((iw, i) => {
          iw.isOpen = false;
          return (iw);
        }),
      }),

      onResourceOpen: ({ infoWindows, infoTask }) => (selectedIndex) => ({
        infoWindows: infoWindows.map((iw, i) => {
          iw.isOpen = selectedIndex === i;
          return (iw);
        }),
        infoTask: infoTask.map((iw, i) => {
          iw.isOpen = false;
          return (iw);
        }),

      }),

      onMapOpen: ({ infoWindows, infoTask }) => (selectedIndex) => ({
        infoWindows: infoWindows.map((iw, i) => {
          iw.isOpen = selectedIndex === i;
          return (iw);
        }),

        infoTask: infoTask.map((iw, i) => {
          iw.isOpen = selectedIndex === i;
          return (iw);
        }),
      }),

    },



  ),
  withScriptjs,
  withGoogleMap
)(props => {
  const { center, markers, onDragEnd } = props;
  const [taskShow, setTaskShow] = useState(true);
  const [resourceShow, setResourceShow] = useState(true);
  const handleRefresh = props.handleRefresh;
  const isOpenResource = props.infoWindows;
  const isOpenTask = props.infoTask;


  const defaultMapOptions = {
    fullscreenControl: false,
    fullscreenControlOptions: false,
    streetViewControl: false,
    zoomControl: false,
    mapTypeControl: false
  };

  var buttonStyle = {
    position: "absolute",
    // left: "0",
    top: "10px",
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

  useEffect(() => {
    props.onMapOpen();
  }, [props.popupChange])

  const onResourceClick = (e) => {
    if (resourceShow === true && taskShow === true) {
      setResourceShow(!resourceShow);
      // setTaskShow(false);
    }
    else if (resourceShow === true && taskShow === false) {
      setResourceShow(!resourceShow);
      // setTaskShow(false);
    }
    else if (resourceShow === false && taskShow === true) {
      setResourceShow(true);
      // setTaskShow(true);
    }
    else if (resourceShow === false && taskShow === false) {
      setResourceShow(true);
    }
  }

  const onTaskClick = (e) => {
    if (resourceShow === true && taskShow === true) {
      // setResourceShow(false);
      setTaskShow(!taskShow);
    }
    else if (resourceShow === true && taskShow === false) {
      setTaskShow(true);
      // setResourceShow(true);
    }
    else if (resourceShow === false && taskShow === true) {
      setTaskShow(!taskShow);
      // setResourceShow(false);
    }
    else if (resourceShow === false && taskShow === false) {
      setTaskShow(true);
    }

  }


  return (
    <div>
      <GoogleMap
        defaultZoom={10}
        defaultCenter={center}
        options={defaultMapOptions}
        onClick={props.onMapOpen.bind()}

      >
        {props.isMarkerShown &&
          props.taskData.map((marker, index) => {

            const taskLat = parseFloat(marker.lat, 10);
            const taskLng = parseFloat(marker.lng, 10);
            const statusCode = marker.status_code.color;
            const datasource = props.markers[index];
            // const imgPath = `http://192.168.11.181:8200${marker.profile_img}`;


            const iconStyle = {
              path: 'M16,0A11.6,11.6,0,0,0,4.411,11.589c0,7.931,10.371,19.573,10.813,20.065a1.044,1.044,0,0,0,1.553,0c.442-.492,10.813-12.134,10.813-20.065A11.6,11.6,0,0,0,16,0Zm0,17.42a5.831,5.831,0,1,1,5.831-5.831A5.837,5.837,0,0,1,16,17.42Z',
              // fillColor: color,
              // fillOpacity: 100,
              // scale: 0.017,
              fillColor: statusCode,
              fillOpacity: 1,

              strokeColor: statusCode,
              strokeWeight: 0.1,
              // path: 'M10,1.375c-3.17,0-5.75,2.548-5.75,5.682c0,6.685,5.259,11.276,5.483,11.469c0.152,0.132,0.382,0.132,0.534,0c0.224-0.193,5.481-4.784,5.483-11.469C15.75,3.923,13.171,1.375,10,1.375 M10,17.653c-1.064-1.024-4.929-5.127-4.929-10.596c0-2.68,2.212-4.861,4.929-4.861s4.929,2.181,4.929,4.861C14.927,12.518,11.063,16.627,10,17.653 M10,3.839c-1.815,0-3.286,1.47-3.286,3.286s1.47,3.286,3.286,3.286s3.286-1.47,3.286-3.286S11.815,3.839,10,3.839 M10,9.589c-1.359,0-2.464-1.105-2.464-2.464S8.641,4.661,10,4.661s2.464,1.105,2.464,2.464S11.359,9.589,10,9.589',
              // strokeColor: '#00F',
              // fillOpacity: 0.8,
              // // strokeWeight: 14,
              scale: 1.3,
              // rotation: 45

            };

            const iconStyle2 = {
              path: "M-20,0a20,20 0 1,0 40,0a20,20 0 1,0 -40,0",
              fillColor: 'white',
              fillOpacity: 1,
              strokeColor: statusCode,
              strokeWeight: 0.1,
              anchor: new window.google.maps.Point(-48, -36),
              scale: 0.43,

            };

            return (
              <div>
                {taskShow ?
                  <Marker
                    id={marker.tracking_id}
                    position={{ lat: taskLat, lng: taskLng }}
                    onClick={props.onTaskOpen.bind(this, index)}
                    icon={iconStyle}
                  >
                    {props.infoTask[index].isOpen && (
                      <InfoWindow >
                        <Assignee datasource={datasource} handleRefresh={handleRefresh} />
                      </InfoWindow>

                    )

                    }
                  </Marker>
                  : null}

                {taskShow ?
                  <Marker
                    id={marker.tracking_id}
                    position={{ lat: taskLat, lng: taskLng }}
                    onClick={props.onTaskOpen.bind(this, index)}
                    icon={iconStyle2}
                  >

                  </Marker>
                  : null}

              </div>

            );

          })

        }
        {props.isMarkerShown &&
          props.resourceData.map((marker, index) => {
            // const [imagePathCheck, setImagePathCheck] = useState(); // check image path existed
            // const [resourceInfo, setResouceInfo] = useState("");
            // const imagePathExisted = imagePathCheck ? true : false; // true false
            const lat = marker.current_lat ? marker.current_lat : "";
            const lng = marker.current_lng ? marker.current_lng : "";

            const name = marker.name;
            const lastname = marker.lastname;
            const phone = marker.phone ? marker.phone : "";
            const defaultImage = 'data:image/jpeg;base64,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';
            const imgPath = `${process.env.REACT_APP_IMG_HOST}` + marker.profile_img;

            console.log("Marker Resource" , marker);
            console.log("props.infoWindows",props.infoWindows);
            console.log("props.index", index);


            // check image path existed or not found
            const imageExists = (url, callback) => {
              var img = new Image();
              img.onload = function () { callback(true); };
              img.onerror = function () { callback(false); };
              img.src = url;
            }

            // useEffect(() => {
            //   imageExists(imgPath, function (exists) {
            //     setImagePathCheck(exists);
            //   });
            //   if (isOpenTask[index].isOpen === true) {
            //     setResouceInfo(true)
            //   }

            //   // setResouceInfo(resourceInfoOpen);

            // }, [props, isOpenTask])


            // const imgPathonCircle = imagePathExisted === true ? `${process.env.REACT_APP_IMG_HOST}` + marker.profile_img : defaultImage;
            // const newResourceInfo = [];
            // const resourceInfoOpen = isOpenResource[index].isOpen === true ? newResourceInfo.push(isOpenResource[index].isOpen) : false;

            marker.circle = {
              radius: 3000,
              options: {
                strokeColor: "#ff0000"
              }
            };

            const shape = {
              coords: [60, 60, 60],
              type: 'circle'
            };


            const iconStyle = {
              // path: 'M768 512q0-106-75-181t-181-75t-181 75t-75 181t75 181t181 75t181-75t75-181zm256 0q0 109-33 179l-364 774q-16 33-47.5 52t-67.5 19t-67.5-19t-46.5-52L33 691Q0 621 0 512q0-212 150-362T512 0t362 150t150 362z',
              // path: 'M858.5 763.6a374 374 0 0 0-80.6-119.5 375.63 375.63 0 0 0-119.5-80.6c-.4-.2-.8-.3-1.2-.5C719.5 518 760 444.7 760 362c0-137-111-248-248-248S264 225 264 362c0 82.7 40.5 156 102.8 201.1-.4.2-.8.3-1.2.5-44.8 18.9-85 46-119.5 80.6a375.63 375.63 0 0 0-80.6 119.5A371.7 371.7 0 0 0 136 901.8a8 8 0 0 0 8 8.2h60c4.4 0 7.9-3.5 8-7.8 2-77.2 33-149.5 87.8-204.3 56.7-56.7 132-87.9 212.2-87.9s155.5 31.2 212.2 87.9C779 752.7 810 825 812 902.2c.1 4.4 3.6 7.8 8 7.8h60a8 8 0 0 0 8-8.2c-1-47.8-10.9-94.3-29.5-138.2zM512 534c-45.9 0-89.1-17.9-121.6-50.4S340 407.9 340 362c0-45.9 17.9-89.1 50.4-121.6S466.1 190 512 190s89.1 17.9 121.6 50.4S684 316.1 684 362c0 45.9-17.9 89.1-50.4 121.6S557.9 534 512 534z',
              // fillColor: color,
              // path: imgPath,
              fillOpacity: 100,
              scale: 0.02,
              // strokeColor: 'blue',
              // strokeWeight: 0.1
              path: 'M10,1.375c-3.17,0-5.75,2.548-5.75,5.682c0,6.685,5.259,11.276,5.483,11.469c0.152,0.132,0.382,0.132,0.534,0c0.224-0.193,5.481-4.784,5.483-11.469C15.75,3.923,13.171,1.375,10,1.375 M10,17.653c-1.064-1.024-4.929-5.127-4.929-10.596c0-2.68,2.212-4.861,4.929-4.861s4.929,2.181,4.929,4.861C14.927,12.518,11.063,16.627,10,17.653 M10,3.839c-1.815,0-3.286,1.47-3.286,3.286s1.47,3.286,3.286,3.286s3.286-1.47,3.286-3.286S11.815,3.839,10,3.839 M10,9.589c-1.359,0-2.464-1.105-2.464-2.464S8.641,4.661,10,4.661s2.464,1.105,2.464,2.464S11.359,9.589,10,9.589',
              // strokeColor: '#00F',
              // fillColor: 'blue',
              // fillOpacity: 0.8,
              // // strokeWeight: 14,
              // scale: 1,
              // rotation: 45

            };

            const circleOptions = {
              path: 'M10,1.375c-3.17,0-5.75,2.548-5.75,5.682c0,6.685,5.259,11.276,5.483,11.469c0.152,0.132,0.382,0.132,0.534,0c0.224-0.193,5.481-4.784,5.483-11.469C15.75,3.923,13.171,1.375,10,1.375 M10,17.653c-1.064-1.024-4.929-5.127-4.929-10.596c0-2.68,2.212-4.861,4.929-4.861s4.929,2.181,4.929,4.861C14.927,12.518,11.063,16.627,10,17.653 M10,3.839c-1.815,0-3.286,1.47-3.286,3.286s1.47,3.286,3.286,3.286s3.286-1.47,3.286-3.286S11.815,3.839,10,3.839 M10,9.589c-1.359,0-2.464-1.105-2.464-2.464S8.641,4.661,10,4.661s2.464,1.105,2.464,2.464S11.359,9.589,10,9.589',
              fillColor: `#ffff00`,
              fillOpacity: 0.2,
              strokeWeight: 1,

              radius: 20000

            };

            var lineSymbol = {
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 21.5,
              size: 22,
              strokeColor: '#393',
              strokeWeight: 3.5,
              fillColor: 'white',
              fillOpacity: 0.1,
              labelAnchor: { x: 0, y: 0 },
              popupAnchor: [0, 15],
              shadowAnchor: [13, 28],
              anchor: new window.google.maps.Point(0, 0.7),

            };

            var lineSymbol2 = {
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 20,
              size: 30,
              strokeColor: 'white',
              strokeWeight: 6.7,
              fillColor: 'white',
              fillOpacity: 0.1,
              labelAnchor: { x: 0, y: 0 },
              popupAnchor: [0, 15],
              shadowAnchor: [13, 28],
              anchor: new window.google.maps.Point(0, 0.75),

            };

            let iconShape = {
              coords: [25, 25, 25],
              type: 'circle'
            };
            var myCity = new window.google.maps.Circle({
              path: "M-20,0a20,20 0 1,0 40,0a20,20 0 1,0 -40,0",
              fillColor: '#ff0000',
              fillOpacity: .6,
              anchor: new window.google.maps.Point(0, 0),
              strokeWeight: 0,
              scale: 1,
            });
            var memId = marker.mem_pro_id;

            return (
              <div>
                {resourceShow ?
                  <Marker
                    // id={marker.mem_pro_id}
                    // key={marker.mem_pro_id}
                    position={{ lat: parseFloat(lat, 10), lng: parseFloat(lng, 10) }}
                    // onClick={props.onResourceOpen.bind(this, index)}
                    optimized={false}
                    icon={{
                      url: imgPath,
                      labelOrigin: { x: 32, y: -10 },
                      scaledSize: {
                        width: 32,
                        height: 32
                      },

                    }}
                  >
                  </Marker>
                  : null}

                {resourceShow ?
                  <Marker
                    // id={marker.mem_pro_id}
                    // key={marker.mem_pro_id}
                    position={{ lat: parseFloat(lat, 10), lng: parseFloat(lng, 10) }}
                    // onClick={props.onResourceOpen.bind(this, index)}

                    optimized={false}
                    // icon={{
                    //   url: imgPath,
                    //   // labelOrigin: { x: 32, y: -10 },
                    //   scaledSize: {
                    //     width: 30,
                    //     height: 30
                    //   },
                    //   scale: 0.5

                    // }}
                    // label= {<img src="paris.jpg" alt="Paris" width="300" height="300" />}
                    icon={lineSymbol2}


                  />
                  : null
                }

                {resourceShow ?
                  <Marker
                    id={marker.mem_pro_id}
                    key={marker.mem_pro_id}
                    position={{ lat: parseFloat(lat, 10), lng: parseFloat(lng, 10) }}
                    onClick={props.onResourceOpen.bind(this, index, )}

                    optimized={false}
                    // icon={{
                    //   url: imgPath,
                    //   // labelOrigin: { x: 32, y: -10 },
                    //   scaledSize: {
                    //     width: 30,
                    //     height: 30
                    //   },
                    //   scale: 0.5

                    // }}
                    // label= {<img src="paris.jpg" alt="Paris" width="300" height="300" />}
                    icon={lineSymbol}


                  >
                    {props.infoWindows[index].isOpen && (
                      <InfoWindow onCloseClick={props.onResourceOpen.bind(index)}>
                        <Resource name={name} lastname={lastname} phone={phone} imgPath={imgPath} />
                      </InfoWindow>
                    )}
                  </Marker>
                  : null
                }


              </div>
            );

          })

        }

        <div ><MapControls googleMapStyle={buttonStyle} callOnTaskClick={onTaskClick} callOnResourceClick={onResourceClick} /></div>
      </GoogleMap>

    </div >
  );
});

const defaultMapProps = {
  googleMapURL: `https://maps.googleapis.com/maps/api/js?libraries=geometry,drawing,places&key=AIzaSyAxYYHQFD8gwBC5XV6Ql6ZcX1E1mGlR_VY`,
  loadingElement: <div style={{ height: `100%` }} />,
  containerElement: <div style={{ height: '100vh', width: '100%' }} />,
  mapElement: <div style={{ height: '100%' }} />,
};

const Map = props => {
  return (
      <BaseGoogleMap {...defaultMapProps} {...props} />
  );
};

export default props => {


  const [marker, setMarker] = useState({});
  const [center, setCenter] = useState({ lat: 13.917585, lng: 100.496687 });
  // const markerData = props.places;
  const taskData = props.taskData;
  const resourceData = props.resourceData;
  const handleRefresh = props.handleRefresh;
  const popupChange = props.popupChange;

  console.log("prop.resourceData",resourceData);
  // resourceData[2].circle = {
  //   radius: 2000,
  //   options: {
  //     strokeColor: "#ff0000"
  //   }
  // };
  return (
    <Map
      markers={taskData || center}
      center={center}
      isMarkerShown
      taskData={taskData}
      resourceData={resourceData}
      handleRefresh={handleRefresh}
      popupChange={popupChange}
    />

  );
};
