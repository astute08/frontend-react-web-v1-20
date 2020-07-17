import React from "react";
import '../css/mapView.css';

export default ({emoji,text}) => (
  <div>
    <span role="img" className="h5" title={text}>
      {emoji}
    </span>
  </div>
);

