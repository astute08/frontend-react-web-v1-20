import React, { useState, useEffect } from 'react';
import Role from './role';
export default () => {
  
  const comId = localStorage.getItem('comId');

  return (
      <Role />
  );
}