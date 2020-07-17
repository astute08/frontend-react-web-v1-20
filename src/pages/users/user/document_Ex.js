import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, List, Icon, Upload, Row, Col, Typography } from 'antd';
import GetLang from '../../../includes/language';
import Api from '../../../components/httpClient';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';
import './css/cssCard.css';
import styled from 'styled-components';


let client = Api();
const { Title } = Typography;

export default (props) => {
  console.log('Document:++ ', props);



  const { memComId, labelShow } = props;
  const companyId = localStorage.getItem('comId');

  const [stateModal, setStateModal] = useState(false);
  const [title, setTitle] = useState('');
  const [modalView, setModalView] = useState();
  const [arrImages, setArrImages] = useState();
  const [startIndexGallery, setStartIndexGallery] = useState(0);

  console.log('arrImages:++ ', arrImages);
  console.log('labelShow:++ ', labelShow);

  const langValue = localStorage.getItem('langVale');

  useEffect(() => {
    checkApi();
    // Lang();
  }, []);

  // const Lang = async () => {
  //   const res = await GetLang({
  //     companyId: props.comId,
  //     lang: langValue,
  //     pageCode: props.pageCode,
  //   });
  //   setLabelShow(res);
  // };

  const checkApi = async () => {
    // let data = {
    //   user_id: userId,
    //   organization_id: "ae3138d3-6b6c-4dcd-a6f0-95111e9646c4"
    // };
    // const api = `/v1/mysql/getuserdocuments`;
    // let check = await client.post(api, data);

    // if (check.data.length > 0) {
    getCompanyDoc();
    // }
  };

  const getCompanyDoc = async () => {
    let arrImages = {};
    const api = `/v2/documents/${companyId}/${memComId}`;
    let getUserDoc = await client.get(api);
    console.log('getUserDoc : ', getUserDoc);
    for (let i = 0; i < getUserDoc.data.length; i++) {
      if (getUserDoc.data[i].doc_id) {
        const a = {
          uid: i + 1,
          document_id: getUserDoc.data[i].doc_id,
          document_name: getUserDoc.data[i].name,
          // original: `http://192.168.11.181:8200${getUserDoc.data[i].path}`,
          // thumbnail: `http://192.168.11.181:8200${getUserDoc.data[i].path}`,
          // url: `http://192.168.11.181:8200${getUserDoc.data[i].path}`,
          original: `${process.env.REACT_APP_URL_MANAGER_ADD_PORT}` + getUserDoc.data[i].path,
          thumbnail: `${process.env.REACT_APP_URL_MANAGER_ADD_PORT}` + getUserDoc.data[i].path,
          url: `${process.env.REACT_APP_URL_MANAGER_ADD_PORT}` + getUserDoc.data[i].path,
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
    // console.log("showModal : item ", item, title);
    // console.log("showModal : ", e);
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

  const HandlerModal = (item) => {
    console.log(item);
    return (
      <div>
        <StyleModal className="customized-modal"
          // title={title}
          visible={stateModal}
          // onOk={handleOk}
          onCancel={handleCancel}
          footer={null}
          width={'100%'}
        >
          <ImageGallery className="customized-imageGallery"
            items={modalView}
            showPlayButton={false}
            showIndex={true}
            startIndex={startIndexGallery}
            showFullscreenButton={false}
          />
        </StyleModal>
      </div>
    );
  };

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
            <Row className="content-document">
              <Col span={24}>
                <List.Item.Meta description={item.name} />
              </Col>

              {/* {index.length > 0  ? ( */}
              <Col span={24} style={{ paddingTop: '20px' }}>
                <Upload
                  listType="picture-card"
                  fileList={item.files}
                  onPreview={(e) => showModal(item.files, item.name, e)}
                  showUploadList={{
                    showDownloadIcon: false,
                    showRemoveIcon: false,
                  }}
                />
              </Col>

              {/* ) : (
                <Icon type="cloud-upload" key={item.id} />
              )} */}
            </Row>
          </List.Item>
        )}
      />
      <HandlerModal />
    </Card>
  );
};


const StyleModal = styled(Modal)`
  height: 100%;
`;
