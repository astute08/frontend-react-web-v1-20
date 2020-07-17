import React, { useState, useEffect } from "react";
import Map from "./new";


export default (props) => {
    const locationValue = props.locationValue;
    const taskData = props.taskValue;
    const resourceData = props.resourceValue;
    const handleRefresh = props.handleRefresh;
    const popupChange = props.popupChange;

    // const onUpdateClick = () => {
    //     console.log("Morning");
    //     setMarkerLat(13.912557);
    //     setMarkerLng(100.359398);
    // }

    const MapFunc = () => {
        console.log("1208", props);

        if (taskData !== undefined) {
            return (
                <Map
                    // center={{ lat: 40.6451594, lng: -74.0850826 }}
                    zoom={12}
                    resourceData = {resourceData}
                    taskData = {taskData}
                    handleRefresh = {handleRefresh}
                    popupChange = {popupChange}
                />
            );
        }

        else{
            return console.log("Map Component Loading Error");;
        }
    }

    return (
        <div>
            {MapFunc()}
        </div>
    );
}