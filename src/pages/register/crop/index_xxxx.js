import React, { useState } from 'react';
import { Upload, message } from 'antd';
import ImageCrop from './cropImage';
 
export default () => {

  const [userProfilePic, setUserProfilePic] = useState('');
  const [editor, setEditor] = useState(null);
  const [scaleValue, setScaleValue] = useState(1);
  const [selectedImage, setSelectedImage] = useState();
  const [fileUploadErrors, setFileUploadErrors] = useState();
  const [openCropper, setOpenCropper] = useState(false);

  const setEditorRef = editor => setEditor(editor);

  // const profileImageChange = (fileChangeEvent) => {
  //   const file = fileChangeEvent.target.files[0];
  //   const { type } = file;
  //   if (type.endsWith('jpeg') || type.endsWith('png') || type.endsWith('jpg')) {
  //     setScaleValue(file);
  //   }
  // };

  const onCrop = () => {
    if (editor !== null) {
      const url = editor.getImageScaledToCanvas().toDataURL();
      console.log('url::::** ', url)
      setUserProfilePic(url);
    }
  }

  const onScaleChange = (scaleChangeEvent) => {
    const scaleValue = parseFloat(scaleChangeEvent.target.value);
    setScaleValue(scaleValue);
  }

  const DataURLtoFile = (dataurl, filename) => {
    let arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

 const profilePicChange = (fileChangeEvent) => {
   console.log('fileChangeEvent:+++ ', fileChangeEvent.target.files[0])
    const file = fileChangeEvent.target.files[0];
    const { type } = file;
    if (!(type.endsWith('jpeg') || type.endsWith('png') || type.endsWith('jpg') || type.endsWith('gif'))) {
    } else {
      // setScaleValue(file);
      setOpenCropper(true)
      setSelectedImage(fileChangeEvent.target.files[0]);
      setFileUploadErrors([]);
    }
  };



  return (
    <div>
      {/* <DataURLtoFile /> */}
      <input type="file" accept="image/png, image/jpeg" onChange={profilePicChange} />
      <ImageCrop 
        imageSrc={selectedImage} 
        setEditorRef={setEditorRef} 
        onCrop={onCrop} 
        scaleValue={scaleValue} 
        onScaleChange={onScaleChange} 
      />
      
      <img src={userProfilePic} alt="Profile" />
    </div>
  )
}
