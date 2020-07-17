import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, List, Icon, Upload, Row, Col, Typography } from 'antd';
import GetLang from '../../../includes/language';
import Api from '../../../components/httpClient';
import ImageGallery from 'react-image-gallery';
import ReactBnbGallery from 'react-bnb-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';
import './css/cssCard.css';

let client = Api();
const { Title } = Typography;


const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

// const photos = [{
//   photo: "https://source.unsplash.com/aZjw7xI3QAA/1144x763",
//   caption: "Viñales, Pinar del Río, Cuba",
//   subcaption: "Photo by Simon Matzinger on Unsplash",
//   thumbnail: "https://source.unsplash.com/aZjw7xI3QAA/100x67",
// }, {
//   photo: "https://source.unsplash.com/c77MgFOt7e0/1144x763",
//   caption: "La Habana, Cuba",
//   subcaption: "Photo by Gerardo Sanchez on Unsplash",
//   thumbnail: "https://source.unsplash.com/c77MgFOt7e0/100x67",
// }, {
//   photo: "https://source.unsplash.com/QdBHnkBdu4g/1144x763",
//   caption: "Woman smoking a tobacco",
//   subcaption: "Photo by Hannah Cauhepe on Unsplash",
//   thumbnail: "https://source.unsplash.com/QdBHnkBdu4g/100x67",
// }];

export default (props) => {
  const { memComId } = props;
  const companyId = localStorage.getItem('comId');
  const [stateModal, setStateModal] = useState(false);
  const [galleryOpened, setGalleryOpened] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [previewImage, setPreviewImage] = useState('');
  const [modalView, setModalView] = useState();
  const [arrImages, setArrImages] = useState();
  const [startIndexGallery, setStartIndexGallery] = useState(0);
  const [labelShow, setLabelShow] = useState({});
  const [photos, setPhotos] = useState([]);

  // console.log('arrImages:++ ', arrImages);
  // console.log('modalView:++ ', modalView);

  const langValue = localStorage.getItem('langVale');
  useEffect(() => {
    getCompanyDoc();
  }, []);

  const Lang = async () => {
    const res = await GetLang({
      companyId: props.comId,
      lang: langValue,
      pageCode: props.pageCode,
    });
    setLabelShow(res);
  };

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
          thumbnail: `${process.env.REACT_APP_URL_MANAGER_ADD_PORT}` + getUserDoc.data[i].path,
          url: `${process.env.REACT_APP_URL_MANAGER_ADD_PORT}` + getUserDoc.data[i].path,
          photo: `${process.env.REACT_APP_URL_MANAGER_ADD_PORT}` + getUserDoc.data[i].path,
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

    setArrImages(arrImages);
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

  const toggleGallery = (files, name) => {
    console.log('files****s** ', files)
    setPhotos(files);
    setGalleryOpened(prevState => (!prevState.galleryOpened));
    // setGalleryOpened(true);
  }


  return (
    <Card
      title={
        <Col offset={1}>
          <Title
            style={{ marginTop: '5px', fontSize: '15px', fontWeight: 400 }}
          >
            {labelShow.documentTitle ? labelShow.documentTitle : 'Document'}
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
              </Col>
            </Row>
          </List.Item>
        )}
      />

      <ReactBnbGallery
        show={galleryOpened}
        photos={photos}
        onClose={(e) => setGalleryOpened(false)}
        wrap={false}
        backgroundColor='#000000'
      />

    </Card>
  );
};



********************************************

import React, { useState, useEffect } from 'react';

import ReactBnbGallery from 'react-bnb-gallery';
import Gallery from 'react-grid-gallery';


// const photos = [{
//   photo: "https://source.unsplash.com/aZjw7xI3QAA/1144x763",
//   caption: "Viñales, Pinar del Río, Cuba",
//   subcaption: "Photo by Simon Matzinger on Unsplash",
//   thumbnail: "https://source.unsplash.com/aZjw7xI3QAA/100x67",
// }, {
//   photo: "https://source.unsplash.com/c77MgFOt7e0/1144x763",
//   caption: "La Habana, Cuba",
//   subcaption: "Photo by Gerardo Sanchez on Unsplash",
//   thumbnail: "https://source.unsplash.com/c77MgFOt7e0/100x67",
// }, {
//   photo: "https://source.unsplash.com/QdBHnkBdu4g/1144x763",
//   caption: "Woman smoking a tobacco",
//   subcaption: "Photo by Hannah Cauhepe on Unsplash",
//   thumbnail: "https://source.unsplash.com/QdBHnkBdu4g/100x67",
// }];

const IMAGES = [{
        src: "https://c2.staticflickr.com/9/8817/28973449265_07e3aa5d2e_b.jpg",
        thumbnail: "https://c2.staticflickr.com/9/8817/28973449265_07e3aa5d2e_n.jpg",
        thumbnailWidth: 320,
        thumbnailHeight: 174,
        isSelected: true,
        caption: "After Rain (Jeshu John - designerspics.com)"
},
{
        src: "https://c2.staticflickr.com/9/8356/28897120681_3b2c0f43e0_b.jpg",
        thumbnail: "https://c2.staticflickr.com/9/8356/28897120681_3b2c0f43e0_n.jpg",
        thumbnailWidth: 320,
        thumbnailHeight: 212,
        tags: [{value: "Ocean", title: "Ocean"}, {value: "People", title: "People"}],
        caption: "Boats (Jeshu John - designerspics.com)"
},

{
        src: "https://c4.staticflickr.com/9/8887/28897124891_98c4fdd82b_b.jpg",
        thumbnail: "https://c4.staticflickr.com/9/8887/28897124891_98c4fdd82b_n.jpg",
        thumbnailWidth: 320,
        thumbnailHeight: 212
}]

export default (props) => {

  const [galleryOpened, setGalleryOpened] = useState(false);

 const toggleGallery = () => {
  setGalleryOpened(prevState => (!prevState.galleryOpened));
  }


  return (
    <div>
      <button onClick={toggleGallery}>Open photo gallery</button>
      {/* <ReactBnbGallery
        show={galleryOpened}
        photos={photos}
        onClose={(e) => setGalleryOpened(false)} 
      /> */}
      <Gallery images={IMAGES} showLightboxThumbnails={true} enableImageSelection={false}/>,
    </div>
  )
}