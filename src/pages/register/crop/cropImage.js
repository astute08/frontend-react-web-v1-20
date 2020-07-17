import React from 'react';
import AvatarEditor from 'react-avatar-editor'
 
export default ({ imageSrc, onCrop, setEditorRef, scaleValue, onScaleChange }) => {

  return (
    <div>
      <AvatarEditor image={imageSrc} border={50} scale={scaleValue} rotate={0} ref={setEditorRef} />
      <input style={{ width: '50%' }} type="range" value={scaleValue} name="points" min="1" max="10" onChange={onScaleChange} />
      <button onClick={onCrop}>Crop it</button>
    </div>
  )
}
