import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, List, Icon, Upload, Row, Col, Typography } from 'antd';
import GetLang from '../../../includes/language';
import Api from '../../../components/httpClient';
import ImageGallery from 'react-image-gallery';
import ReactBnbGallery from 'react-bnb-gallery';
import Gallery from 'react-grid-gallery';
import $ from 'jquery';
import 'react-image-gallery/styles/css/image-gallery.css';
import './css/cssCard.css';
import './css/document.css';


let client = Api();
const { Title } = Typography;

export default (props) => {
  const { memComId } = props;
  const companyId = localStorage.getItem('comId');
  const [stateModal, setStateModal] = useState(false);
  const [title, setTitle] = useState('');
  const [modalView, setModalView] = useState();
  const [arrImages, setArrImages] = useState();
  const [startIndexGallery, setStartIndexGallery] = useState(0);
  const [photos, setPhotos] = useState([]);
  const [galleryOpened, setGalleryOpened] = useState(false);
  const [ifRunMovePaging, setIfRunMovePaging] = useState(false);
  const [openGallery, setOpenGallery] = useState(false);
  const [currentPhotos, setCurrentPhotos] = useState(null);

  // รับค่าภาษา
  const labelShow = props.labelShow;



  console.log('arrImages:++ ', labelShow);
  // console.log('modalView:++ ', modalView);

  useEffect(() => {
    getCompanyDoc();
   
  }, []);

  const getCompanyDoc = async () => {
    let arrImages = {};
    const api = `/v2/documents/${companyId}/${memComId}`;
    const getUserDoc = await client.get(api);
    console.log('getUserDoc : ', getUserDoc);
    for (let i = 0; i < getUserDoc.data.length; i++) {
      if (getUserDoc.data[i].doc_id) {
        const a = {
          uid: i + 1,
          document_id: getUserDoc.data[i].doc_id,
          document_name: getUserDoc.data[i].name,
          // thumbnail: `http://192.168.11.181:8200${getUserDoc.data[i].path}`,
          // url: `http://192.168.11.181:8200${getUserDoc.data[i].path}`,
          // photo: `http://192.168.11.181:8200${getUserDoc.data[i].path}`,
          // src: `http://192.168.11.181:8200${getUserDoc.data[i].path}`,
          thumbnail: `${process.env.REACT_APP_URL_MANAGER_ADD_PORT}` + getUserDoc.data[i].path,
          url: `${process.env.REACT_APP_URL_MANAGER_ADD_PORT}` + getUserDoc.data[i].path,
          photo: `${process.env.REACT_APP_URL_MANAGER_ADD_PORT}` + getUserDoc.data[i].path,
          src: `${process.env.REACT_APP_URL_MANAGER_ADD_PORT}` + getUserDoc.data[i].path,
          thumbnailWidth: 56,
          thumbnailHeight: 56,

        };

        if (!arrImages[getUserDoc.data[i].doc_com_id]) {
          arrImages[getUserDoc.data[i].doc_com_id] = {
            name: getUserDoc.data[i].name,
            files: [],
          };
        }
        arrImages[getUserDoc.data[i].doc_com_id].files.push(a);
      }
    }
    arrImages = Object.values(arrImages);
    // console.log('arrImages:::*** ', arrImages)
    setArrImages(arrImages);

    // if(!ifRunMovePaging)test();
  };

  const showModal = (item, title, e) => {
    console.log("showModal : item ", item, title);
    const found = item.findIndex((element) => element.uid === e.uid);
    setTitle(title);
    setModalView(item);
    setStartIndexGallery(found);
    setStateModal(!stateModal);
  };

  const handleCancel = () => {
    setStateModal(false);
  };

  const handleOk = (value) => {
    setStateModal(false);
  };

  const handlerModal = (files, name) => {
    console.log('files xxzzzxx: ', files);
    // setPreviewVisible(true);
    return (
      <div>
          {/* {files.map((item, i) => { */}
            <ReactBnbGallery
              show={galleryOpened}
              photos={files}
              onClose={(e) => setGalleryOpened(false)}
              wrap={false}
              backgroundColor='#000000'
            />
          {/* })} */}
      </div>
    
    )
  }
  const test = () =>{
    let paging = $('.footerCount_lkhc9u');
    $('.footerCount_lkhc9u').remove();
    $('.paginatedThumbnails_qxqfp1').prepend(paging); 
    setIfRunMovePaging(true);
  }

  const toggleGallery = (files, name) => {
    setOpenGallery(prevState => !prevState.galleryOpened);

    // setGalleryOpened(true);
  }

  const closeGallery = () => {
      setOpenGallery(false);
      setCurrentPhotos(null);
  }

  return (
    <Card
      title={
        <Col offset={1}>
          <Title
            style={{ marginTop: '5px', fontSize: '15px', fontWeight: 400 }}
          >
            {labelShow.tDocument ? labelShow.tDocument : 'Document'}
          </Title>
        </Col>
      }
      size="small"
      style={{ width: '100%' }}
    >
      <List
        dataSource={arrImages}
        renderItem={(item, index) => (
          <List.Item>
            <Row>
              <Col span={24}>
                <List.Item.Meta description={item.name} />
              </Col>
              <Col span={24} style={{ paddingTop: '20px' }}>
                <Upload 
                  listType="picture-card" 
                  fileList={item.files} 
                  onPreview={(e) => toggleGallery(item.files, item.name)}
                  // onPreview={handlePreview}
                  showUploadList={{
                    showDownloadIcon: false,
                    showRemoveIcon: false,
                  }}
                />

                {/* <Gallery className="gallery" rowHeight={56} images={item.files} showLightboxThumbnails={true} enableImageSelection={false}/> */}
                {/* <Button
                  onPress={toggleGallery}
                  primary
                >
                  View demo gallery
                </Button>
                <ReactBnbGallery
                  show={openGallery}
                  photos={item.files}
                  onClose={closeGallery}
                  wrap={false}
                  backgroundColor='#000000'
                /> */}
              </Col>
            </Row>
          </List.Item>
        )}
      />

        {/* <ReactBnbGallery
          show={galleryOpened}
          photos={photos}
          onClose={(e) => setGalleryOpened(false)}
          wrap={false}
          backgroundColor='#000000'
        />  */}
    </Card>
  );
};

