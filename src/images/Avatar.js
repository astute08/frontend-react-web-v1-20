import React from 'react';

export default (props) => {
  const { stroke } = props;

  return (
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 44 44">
      <defs>
        <pattern id="pattern" width="1" height="1" viewBox="22.104 1.843 22.492 22.492">
          <image preserveAspectRatio="xMidYMid slice" width="59.946" height="44" />
        </pattern>
        <ref id="paramStroke" param="outline" default="navy"/>
      </defs>
      <g id="Ellipse_386" data-name="Ellipse 386" class="cls-1" stroke={stroke}>
        <circle class="cls-2" cx="22" cy="22" r="22"/>
        <circle class="cls-3" cx="22" cy="22" r="20.5"/>
      </g>
    </svg>
  );
}