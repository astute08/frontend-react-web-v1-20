import React, { useState, useEffect } from 'react';
import AppProvider from './appProvider';
import moment from 'moment';
import ImageGallery from 'react-image-gallery';
import Gallery from 'react-grid-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';
import Jimp from 'jimp';
import Resizer from 'react-image-file-resizer';

import {
  Card,
  List,
  Col,
  Upload,
  Button,
  Icon,
  Modal,
  notification,
  Row,
} from 'antd';

export default (props) => {
  const app = AppProvider.useAppContext();
  const createStatus = props.createStatus ? true : false;
  const stepCurrant = app.state.stepCurrant;
  const [showImageGallery, setShowImageGallery] = useState(false);
  const [titleGallery, setTitleGallery] = useState();
  const [imageGallery, setImageGallery] = useState([]);
  const [indexGallery, setIndexGallery] = useState(0);
  const [base, setBase] = useState();
  const [arrImages, setArrImages] = useState([]);

  useEffect(() => {
    app.fnc.setDocumentsFormStatus(false);
    
  }, [app.state.documentsRef]);


  console.log('step currant:: ', app.state.stepCurrant);
  console.log('documentsData:: ', app.state.documentsData);
  console.log('base:: ', base);

  const propsUpload = {
    name: 'documentImage',
    showUploadList: false,
    beforeUpload: (file, fileList) => {
      return false;
    },
  };

  const handleChangeUploads = async (id, info) => {
    console.log('uploads::** ', id, ':', info)

    // if (info.file.size > 100 && false) {
    //   // set max file size
    //   notification.open({
    //     message: 'Upload file',
    //     description: 'File max size error!',
    //     icon: <Icon type="close-circle" style={{ color: '#FF0000' }} />,
    //   });
    //   return false;
    // }

    const img = await Resizer.imageFileResizer(
      info.file,
      720,
      720,
      'JPEG',
      100,
      0,
      uri => {
          // console.log("uri:::: ", uri);
          imageData(id, info, uri);
      },
      'base64'
    );

    // console.log("resizedImage:::: ", img);
    
    // const index = app.state.documentsData.findIndex (
    //   (object) => object.id == id,
    // );
    // if (index >= 0) {
    //   let uid = moment().valueOf();
    //   const fileName = uid + '.png';
    //   const newFileList = [...app.state.documentsData];
    //   const base64 = await app.fnc.getBase64(info.file);
    //   // console.log("base64:::: ", base64);
    //   const newFile = {
    //     uid: `${uid}`,
    //     name: `${fileName}`,
    //     status: 'done',
    //     url: `${base64}`,
    //     parentId: id,
    //     thumbnail: `${base64}`,
    //     src: `${base64}`,
    //     original: `${base64}`,
    //     thumbnailWidth: 85,
    //     thumbnailHeight: 85,
    //   };

    //   const checkDuplicate = app.state.documentsData[index].fileList.findIndex(
    //     (object) => object.url == base64,
    //   );
    //   if (checkDuplicate >= 0) {
    //     notification.open({
    //       message: app.state.lang.uploadFile
    //         ? app.state.lang.uploadFile
    //         : 'Upload file',
    //       description: app.state.lang.fileDuplicate
    //         ? app.state.lang.fileDuplicate
    //         : 'File duplicate!',
    //       icon: <Icon type="close-circle" style={{ color: '#FF0000' }} />,
    //     });
    //     return false;
    //   }

    //   newFileList[index].fileList.push(newFile);

    //   console.log('newFileList: ', newFileList);
    //   app.fnc.setDocumentsData(newFileList);
    //   // setArrImages(newFileList);
    // }
  };

  const imageData = (id, info, uri) => {
    const index = app.state.documentsData.findIndex (
      (object) => object.id == id,
    );
    if (index >= 0) {
      let uid = moment().valueOf();
      const fileName = uid + '.png';
      const newFileList = [...app.state.documentsData];
      // const base64 = await app.fnc.getBase64(info.file);
      // console.log("base64:::: ", base64);
      const newFile = {
        uid: `${uid}`,
        name: `${fileName}`,
        status: 'done',
        url: `${uri}`,
        parentId: id,
        thumbnail: `${uri}`,
        src: `${uri}`,
        original: `${uri}`,
        thumbnailWidth: 85,
        thumbnailHeight: 85,
      };

      const checkDuplicate = app.state.documentsData[index].fileList.findIndex (
        (object) => object.url == uri,
      );
      if (checkDuplicate >= 0) {
        notification.open({
          message: app.state.lang.uploadFile
            ? app.state.lang.uploadFile
            : 'Upload file',
          description: app.state.lang.fileDuplicate
            ? app.state.lang.fileDuplicate
            : 'File duplicate!',
          icon: <Icon type="close-circle" style={{ color: '#FF0000' }} />,
        });
        return false;
      }

      newFileList[index].fileList.push(newFile);

      console.log('newFileList: ', newFileList);
      app.fnc.setDocumentsData(newFileList);
      // setArrImages(newFileList);
    }
  }

  const handlePreview = (item) => {
    // console.log('item:: ', item);
    let setTitle = '';
    let setIndex = 0;
    const setGallery = [];
    let parentId = item.parentId;
    let index = app.state.documentsData.findIndex(
      (object) => object.id == parentId,
    );

    if (index >= 0) {
      setTitle = app.state.documentsData[index].name;
      app.state.documentsData[index].fileList.forEach((element, index) => {
        setIndex = element.uid == item.uid ? index : 0;
        const image = {
          src: element.url,
          original: element.url,
          thumbnail: element.url,
        };
        setGallery.push(image);
      });
    }
    console.log('imageGallery:: ',setTitle,':', setGallery);
    setTitleGallery(setTitle);
    setImageGallery(setGallery);
    setIndexGallery(setIndex);
    setShowImageGallery(true);
  };

  const handleCancelPreview = () => {
    setShowImageGallery(false);
  };

  const handleRemove = (file) => {
    const files = [...app.state.documentsData];
    let parentId = file.parentId;
    let parentIndex = files.findIndex((object) => object.id == parentId);
    if (parentIndex >= 0) {
      let fileIndex = files[parentIndex].fileList.findIndex(
        (object) => object.uid == file.uid,
      );
      if (fileIndex >= 0) {
        files[parentIndex].fileList.splice(fileIndex, 1);
      }
    }

    app.fnc.setDocumentsData(files);
  };

  const handleChange = (item) => {
    console.log('fileList:::*** ', item.name,':', item.fileList)
  };


  const listView = (item) => {
    return (
      <List.Item style={{ alignItems: 'end' }}>
        <Col className="gutter-row" span={4} style={{ textAlign: 'left' }}>
          {item.name}
        </Col>
        <Col className="gutter-row" span={16} style={{ textAlign: 'left' }}>
          <Upload
            listType="picture-card"
            fileList={item.fileList}
            showUploadList={{
              showDownloadIcon: false,
              showRemoveIcon: createStatus,
            }}
            // onPreview={(item) => handlePreview(item)}
            // onPreview={<Gallery className="gallery" rowHeight={56} images={item.fileList} isOpen={false} showLightboxThumbnails={true} enableImageSelection={false}/>}
            onRemove={(item) => handleRemove(item)}            
          />
          {/* <Gallery className="gallery" rowHeight={56} images={imageGallery} isOpen={false} showLightboxThumbnails={true} enableImageSelection={false}/> */}
        </Col>
        <Col className="gutter-row" span={4} style={{ textAlign: 'right' }}>
          {createStatus ? (
            // <Upload
            //   {...propsUpload}
            //   onChange={(info) => handleChangeUploads(item.id, info)}
            //   accept="image/*,.pdf"
            // >
            //   <Button type="danger" size="large" style={{ marginTop: 0 }}>
            //     <Icon type="cloud-upload" />{' '}
            //     {app.state.lang.upload ? app.state.lang.upload : 'Upload'}
            //   </Button>
            // </Upload>
            <Upload >
              <Button type="danger" size="large" style={{ marginTop: 0 }}>
                <Icon type="cloud-upload" />{' '}
                {app.state.lang.upload ? app.state.lang.upload : 'Upload'}
              </Button>
            </Upload>
          ) : null}
        </Col>
      </List.Item>
    );
  };



  return (
    <Card
      title={app.state.lang.document ? app.state.lang.document : 'Document'}
    >
      <List
        size="large"
        style={{ margin: 10 }}
        dataSource={app.state.documentsData}
        renderItem={(item, index) => (
          <List.Item key={index} style={{ alignItems: 'end' }}>
            <Col className="gutter-row" span={4} style={{ textAlign: 'left' }}>
              {item.name}
            </Col>
            <Col className="gutter-row" span={16} style={{ textAlign: 'left' }}>
              {/* <Upload
                listType="picture-card"
                fileList={item.fileList}
                showUploadList={{
                  showDownloadIcon: false,
                  showRemoveIcon: createStatus,
                }}
                onRemove={(item) => handleRemove(item)}  
                // onChange={(item) => handleChange(item)}
                onPreview={(item) => handlePreview(item)}          
              />
              <Modal
                // title={titleGallery}
                visible={showImageGallery}
                // onOk={handleCancelPreview}
                width={824}
                onCancel={handleCancelPreview}
                cancelText={app.state.lang.close ? app.state.lang.close : 'Close'}
                footer={null}
              >
                <ImageGallery
                  items={imageGallery}
                  showPlayButton={false}
                  showIndex={true}
                  startIndex={indexGallery}
                />
              </Modal> */}
              {/* <Gallery className="gallery" rowHeight={56} images={item.fileList} isOpen={false} showLightboxThumbnails={true} enableImageSelection={false}/> */}

              {createStatus ? (
                <div>
                  <Upload
                    listType="picture-card"
                    fileList={item.fileList}
                    showUploadList={{
                      showDownloadIcon: false,
                      showRemoveIcon: createStatus,
                    }}
                    onRemove={(item) => handleRemove(item)}  
                    // onChange={(item) => handleChange(item)}
                    onPreview={(item) => handlePreview(item)}
                  />
                  <Modal
                    // title={titleGallery}
                    visible={showImageGallery}
                    // onOk={handleCancelPreview}
                    // width={824}
                    onCancel={handleCancelPreview}
                    cancelText={app.state.lang.close ? app.state.lang.close : 'Close'}
                    footer={null}
                  >
                    <ImageGallery
                      items={imageGallery}
                      showPlayButton={false}
                      showIndex={true}
                      startIndex={indexGallery}
                    />
                  </Modal>
                </div>
              ) : null}
              {!createStatus ? (
                <Gallery className="register-gallery" rowHeight={56} images={item.fileList} isOpen={false} showLightboxThumbnails={true} enableImageSelection={false}/>
              ) : null}
            </Col>
            <Col className="gutter-row" span={4} style={{ textAlign: 'right' }}>
              {createStatus ? (
                <Upload 
                  {...propsUpload}
                  onChange={(info) => handleChangeUploads(item.id, info)}
                  accept="image/*,.pdf"
                >
                  <Button type="danger" size="large" style={{ marginTop: 0 }}>
                    <Icon type="cloud-upload" />{' '}
                    {app.state.lang.upload ? app.state.lang.upload : 'Upload'}
                  </Button>
                </Upload>
              ) : null}
            </Col>
          </List.Item>
        )}
      />
    </Card>
  );
};
