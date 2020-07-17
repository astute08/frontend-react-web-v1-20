import React from 'react';

export default (props) => {
  const handleClcik = () => {
    props.fnc('TEST2');
  };
  return (
    <div>
      <button onClick={handleClcik}>Click</button>
    </div>
  );
};
