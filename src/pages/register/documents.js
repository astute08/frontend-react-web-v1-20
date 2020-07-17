import React, { useState, useEffect } from 'react';
import AppProvider from './appProvider';
import moment from 'moment';
import ImageGallery from 'react-image-gallery';
import styled from 'styled-components';
import './css/documents.css';
import Resizer from 'react-image-file-resizer';
import {
  Card,
  List,
  Col,
  Upload,
  Icon,
  Modal,
  notification,
} from 'antd';
import Button from '../../components/v2/button';

export default (props) => {
  const app = AppProvider.useAppContext();
  const createStatus = props.createStatus ? true : false;
  const [showImageGallery, setShowImageGallery] = useState(false);
  const [titleGallery, setTitleGallery] = useState();
  const [imageGallery, setImageGallery] = useState([]);
  const [indexGallery, setIndexGallery] = useState(0);

  useEffect(() => {
    app.fnc.setDocumentsFormStatus(false);
  }, [app.state.documentsRef]);

  // console.log('arrImages:: ', arrImages);

  const propsUpload = {
    name: 'documentImage',
    showUploadList: false,
    beforeUpload: (file, fileList) => {
      return false;
    },
  };

  const handleChangeUploads = async (id, info) => {
    console.log('uploads::** ', info);
    let imgxx = new Image();

    const setSize = (width, height) => {
      let sizeWidth = [width, height]
      console.log('sizeWidth::: ', sizeWidth);
      return sizeWidth;
    }

    let kbytes;

    if (info.file.size < 92160 ) {
      const base64 = await app.fnc.getBase64(info.file,);
      console.log('base64xxxx not resize', base64);
      imageData(id, info, base64);
    } else {
      let mexQuality = 80;

      const img = await Resizer.imageFileResizer(
        info.file,
        // setSize[0] >= 600 ? 600 : 600,
        // setSize[1] >= 600 ? 600 : 600,
        500,
        500,
        'JPEG',
        70,
        0,
        uri => {
          console.log("uri:::: resize ", uri);

          // width height *****************************

          imgxx.setAttribute("src", uri);
          setTimeout(function(){
            console.log('width height**** ',  imgxx.width, imgxx.height);
            setSize(imgxx.width, imgxx.height);
          }, 0)

          // ******************************************

          let base64Str = uri.split(',');
          if (calculateImageSize(base64Str[1]) > 90) {
            alert("ขนาดรูปภาพใหญ่เกิน 90 kB");
            // mexQuality -= 10;
            // imageData(id, info, uri);
          } else {
            imageData(id, info, uri);
          }
          // console.log('currentQuality++++ ', mexQuality)
          // imageData(id, info, uri);
        },
        'base64'
      );
  
      const calculateImageSize = (base64String) => {
        let padding, inBytes, base64StringLength;
        if(base64String.endsWith("==")) padding = 2;
        else if (base64String.endsWith("=")) padding = 1;
        else padding = 0;
    
        base64StringLength = base64String.length;
        console.log('base64StringLength****** ', base64StringLength)
        inBytes =(base64StringLength / 4 ) * 3 - padding;
        // console.log('inBytes******* ', inBytes);
        kbytes = inBytes / 1000;
        console.log('kbytes******* ', kbytes);
        return kbytes;
      }
    }
  };

  const imageData = (id, info, uri) => {
    const index = app.state.documentsData.findIndex (
      (object) => object.id == id,
    );
    if (index >= 0) {
      let uid = moment().valueOf();
      const fileName = uid + '.png';
      const newFileList = [...app.state.documentsData];
      // console.log('newFileList 01 ', [...app.state.documentsData])
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

      // console.log('newFileList: ', newFileList);

      app.fnc.setDocumentsData(newFileList);
      // setArrImages(newFileList);

      try {
          newFileList.forEach((object) => {
            if (object.fileList.length > 0) {
              object.fileList.forEach((doc) => {
                // console.log('object::* ', object);
                // console.log("doc:* ", doc);
                const docImg = doc.url ? doc.url.split(',') : [];

                // console.log("docImg:* ", docImg);

                const dataDoc = {
                  user_id: app.userId.toString(),
                  created_by: app.userId.toString(),
                  doc_com_id: object.id.toString(),
                  base64: docImg.length > 1 ? `${docImg[1]}` : '',
                  type: '.jpg',
                };

                console.log("dataDoc:* ", [...app.state.dataDoc, dataDoc]);
                app.fnc.setDataDoc([...app.state.dataDoc, dataDoc]);
              });
            }
          });
      } catch (err) {
        console.log('error:::+++ ', err);
      }

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
    console.log('file++++ ', file);
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

    // *******************************************

    const filesDataDoc = [...app.state.dataDoc];
    let parentIdDataDoc = file.parentId;
    console.log('filesDataDoc++++ ', filesDataDoc);
    console.log('parentIdDataDoc++++ ', parentIdDataDoc);
    let parentIndexDataDoc = filesDataDoc.findIndex((object) => object.doc_com_id == parentIdDataDoc);
    console.log('parentIndex:: ', parentIndexDataDoc);
    if (parentIndex >= 0) {
      filesDataDoc.splice(parentIndexDataDoc, 1);
    }
    console.log('filesDataDoc:: ', filesDataDoc);
    app.fnc.setDataDoc(filesDataDoc);
  };

  const handleChange = (fileList) => {
    console.log('fileList:::*** ', fileList)
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
            onPreview={(item) => handlePreview(item)}
            onRemove={(item) => handleRemove(item)}            
          />
        </Col>
        <Col className="gutter-row" span={4} style={{ textAlign: 'right' }}>
          {createStatus ? (
            <Upload
              {...propsUpload}
              onChange={(info) => handleChangeUploads(item.id, info)}
              accept="image/*,.pdf"
            >
              <Button type="primary" size="large" style={{ marginTop: 0 }}>
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
        renderItem={(item, index) => (listView(item))}
      />
      <StyleModalRegister className="customized-modal-register"
        visible={showImageGallery}
        width={'100%'}
        onCancel={handleCancelPreview}
        cancelText={app.state.lang.close ? app.state.lang.close : 'Close'}
        footer={null}
      >
        <ImageGallery
          showFullscreenButton={false}
          items={imageGallery}
          showPlayButton={false}
          showIndex={true}
          startIndex={indexGallery}
        />
      </StyleModalRegister>
    </Card>
  );
};

const StyleModalRegister = styled(Modal)`
  height: 100%;
`;
