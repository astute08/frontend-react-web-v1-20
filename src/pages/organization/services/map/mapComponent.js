import React, { useState, useEffect } from "react";
import { compose, withProps } from "recompose";
import { withScriptjs, withGoogleMap, GoogleMap, Marker, Polygon } from "react-google-maps";
import _, { map } from 'lodash';

// const coords = [
//       {lat: 100.4940888, lng: 13.7841716},
//       {lat: 100.4883601, lng: 13.7809077},
//       {lat: 100.4689624, lng: 13.7585662},
//       {lat: 100.4710223, lng: 13.735889},
//       {lat: 100.4742839, lng: 13.7297191},
//       {lat: 100.4775454, lng: 13.7315535},
//       {lat: 100.4809787, lng: 13.7368896},
//       {lat: 100.4845836, lng: 13.7378901},
//       {lat: 100.5005481, lng: 13.7470612},
//       {lat: 100.5043246, lng: 13.7467277},
//       {lat: 100.5154826, lng: 13.7383903},
//       {lat: 100.5587413, lng: 13.7200471},
//       {lat: 100.5606296, lng: 13.7245496},
//       {lat: 100.5594279, lng: 13.7327207},
//       {lat: 100.5611445, lng: 13.7363893},
//       {lat: 100.5630328, lng: 13.7490621},
//       {lat: 100.5659511, lng: 13.7599001},
//       {lat: 100.5731608, lng: 13.7704042},
//       {lat: 100.5748774, lng: 13.8054143},
//       {lat: 100.5618312, lng: 13.8130825},
//       {lat: 100.5589129, lng: 13.8137493},
//       {lat: 100.5580546, lng: 13.8125824},
//       {lat: 100.556853, lng: 13.8087483},
//       {lat: 100.5510165, lng: 13.7980793},
//       {lat: 100.5458667, lng: 13.7975791},
//       {lat: 100.5431201, lng: 13.8017468},
//       {lat: 100.5338504, lng: 13.8057477},
//       {lat: 100.5307605, lng: 13.8060811},
//       {lat: 100.5257823, lng: 13.8065812},
//       {lat: 100.5192592, lng: 13.8064145},
//       {lat: 100.5117061, lng: 13.803914},
//       {lat: 100.5111911, lng: 13.8009133},
//       {lat: 100.502608, lng: 13.7897437},
//       {lat: 100.4940888, lng: 13.7841716}
// ]

  // const coords = [
  //   {
  //     code: "NON",
  //     name: "นนทบุรี",
  //     type: "polygon", // polygon, point,
  //     coordinates: [
  //       {lat: 100.4940888, lng: 13.7841716},
  //       {lat: 100.4883601, lng: 13.7809077},
  //       {lat: 100.4689624, lng: 13.7585662},
  //       {lat: 100.4710223, lng: 13.735889},
  //       {lat: 100.4742839, lng: 13.7297191},
  //       {lat: 100.4775454, lng: 13.7315535},
  //       {lat: 100.4809787, lng: 13.7368896},
  //       {lat: 100.4845836, lng: 13.7378901},
  //       {lat: 100.5005481, lng: 13.7470612},
  //       {lat: 100.5043246, lng: 13.7467277},
  //       {lat: 100.5154826, lng: 13.7383903},
  //       {lat: 100.5587413, lng: 13.7200471},
  //       {lat: 100.5606296, lng: 13.7245496},
  //       {lat: 100.5594279, lng: 13.7327207},
  //       {lat: 100.5611445, lng: 13.7363893},
  //       {lat: 100.5630328, lng: 13.7490621},
  //       {lat: 100.5659511, lng: 13.7599001},
  //       {lat: 100.5731608, lng: 13.7704042},
  //       {lat: 100.5748774, lng: 13.8054143},
  //       {lat: 100.5618312, lng: 13.8130825},
  //       {lat: 100.5589129, lng: 13.8137493},
  //       {lat: 100.5580546, lng: 13.8125824},
  //       {lat: 100.556853, lng: 13.8087483},
  //       {lat: 100.5510165, lng: 13.7980793},
  //       {lat: 100.5458667, lng: 13.7975791},
  //       {lat: 100.5431201, lng: 13.8017468},
  //       {lat: 100.5338504, lng: 13.8057477},
  //       {lat: 100.5307605, lng: 13.8060811},
  //       {lat: 100.5257823, lng: 13.8065812},
  //       {lat: 100.5192592, lng: 13.8064145},
  //       {lat: 100.5117061, lng: 13.803914},
  //       {lat: 100.5111911, lng: 13.8009133},
  //       {lat: 100.502608, lng: 13.7897437},
  //       {lat: 100.4940888, lng: 13.7841716}
  //     ]
  //   },
  //   {
  //     code: "BANGKOK",
  //     name: "ยานนาวา",
  //     type: "polygon", // polygon, point,
  //     coordinates: [
  //       {lat: 100.5584945, lng: 13.7199533},
  //       {lat: 100.5152359, lng: 13.7382965},
  //       {lat: 100.5040779, lng: 13.7466339},
  //       {lat: 100.5003013, lng: 13.7469673},
  //       {lat: 100.4843368, lng: 13.7377962},
  //       {lat: 100.4807319, lng: 13.7367957},
  //       {lat: 100.4772987, lng: 13.7314596},
  //       {lat: 100.4740371, lng: 13.7296253},
  //       {lat: 100.476073, lng: 13.724878},
  //       {lat: 100.4768026, lng: 13.7206673},
  //       {lat: 100.4779184, lng: 13.716248},
  //       {lat: 100.4786909, lng: 13.7118287},
  //       {lat: 100.4794633, lng: 13.7095773},
  //       {lat: 100.4819524, lng: 13.7067422},
  //       {lat: 100.4878747, lng: 13.7029898},
  //       {lat: 100.4945695, lng: 13.6993207},
  //       {lat: 100.496372, lng: 13.6974861},
  //       {lat: 100.5036676, lng: 13.6900643},
  //       {lat: 100.5099332, lng: 13.6894806},
  //       {lat: 100.5146539, lng: 13.6883965},
  //       {lat: 100.5200612, lng: 13.6858113},
  //       {lat: 100.5261552, lng: 13.6926495},
  //       {lat: 100.5390298, lng: 13.6974027},
  //       {lat: 100.542978, lng: 13.7037403},
  //       {lat: 100.5463254, lng: 13.7054914},
  //       {lat: 100.5577409, lng: 13.7170819},
  //       {lat: 100.5584945, lng: 13.7199533}
  //     ]
  //   },
  //   {
  //     code: "BANGKOK",
  //     name: "บางเขน",
  //     type: "point", // polygon, point,
  //     coordinates: { 
  //       lat: 100.61459, 
  //       lng: 13.86453, 
  //     }
  //   }
  // ]
  
  // const reversedCoords = coords.map( ll => {
  //   return { lat: ll.lng, lng: ll.lat }
  // });


  // const reversedCoords = coords.forEach((element, index, array) => {
  //   const polygon = [];
  //   const point = [];
  //   if(element.type === 'polygon') {
  //     polygon.push(element.coordinates);
  //   }
  //   else if(element.type === 'point') {
  //     point.push(element.coordinates);
  //   }

  // // console.log('coords ', coords);
  // // console.log('polygon ', polygon);
  // // console.log('point ', point);

  // });

  // const mapPolygon = polygon.forEach((item, key) => {
  //   return (
  //     <div key={key}>
  //       <Polygon
  //         path={item}
  //         //key={1}
  //         options={{
  //             fillColor: "#FF0000",
  //             fillOpacity: 0.4,
  //             strokeColor: "#FF0000",
  //             strokeOpacity: 1,
  //             strokeWeight: 1
  //         }} 
  //       />
  //     </div>
  //   )
  // })

const MapComponent = compose(
  withProps({
      googleMapURL: "https://maps.googleapis.com/maps/api/js?&key=AIzaSyAxYYHQFD8gwBC5XV6Ql6ZcX1E1mGlR_VY",
      loadingElement: <div style={{ height: `100%` }} />,
      containerElement: <div style={{ height: `400px` }} />,
      mapElement: <div style={{ height: `100%` }} />,
  }),
  withScriptjs,
  withGoogleMap
)(( props ) => {
  console.log('props++++ ', props);

  const polygon = _.get(props, 'polygon');
  const point = _.get(props, 'point');
  const coords = _.get(props, 'coords');

  // ************************Polygon*****************************************
  const mapPolygon = polygon.map((item, key) => {
    console.log('polygon item****', item);
    const reversedCoordsTest = item.coordinates.map( ll => {
      return { lat: ll.lng, lng: ll.lat }
    });

    return (
      <Polygon
        path={reversedCoordsTest}
        key={key}
        options={{
            fillColor: item.color,
            fillOpacity: 0.4,
            strokeColor: item.color,
            strokeOpacity: 1,
            strokeWeight: 1
        }} 
      />
    )
  });

// ************************Point*****************************************
  const mapPoint = point.map((item, key) => {
    // console.log('item****', item);
    return (
      <Marker key={key} position={item} />
    )
  });

  return(
    <GoogleMap defaultZoom={11} defaultCenter={{ lat: 13.736717, lng: 100.523186 }}>
      {/* {props.isMarkerShown && <Marker position={{ lat: 13.86453, lng: 100.61459 }} />} */}
      {props.isMarkerShown && mapPoint}

      {mapPolygon}

    </GoogleMap>
  )
}
);


export default MapComponent;