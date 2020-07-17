import React, { useState, } from 'react';
import _ from 'lodash';
import Carousel, { Modal, ModalGateway } from 'react-images';
import Slider from 'react-slick';
import { Upload } from 'antd';
import styled from 'styled-components';

const CustomUpload = styled(Upload)`
  
`;

const SlickImg = styled.img`
  max-width: 100%;
`;

export default (props) => {

  const { images } = props;
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState();

  const carouselCustomStyles = {
    view: (base) => ({
      ...base,
      maxHeight: 480,
      overflow: 'hidden',
    }),
  };

  const modalCustomStyles = {
    dialog: (base) => ({
      ...base,
      maxWidth: 1280,
    }),
  };

  const fileList = images.map((url, i) => {
    return {
      uid: i,
      url: url,
      status: 'done'
    };
  });

  const viewList = images.map((url, i) => {
    return { source: url };
  });

  const sliderSettings = {
    customPaging: (i) =>  {
      return (
        <a>
          <img src={images[i]} />
        </a>
      );
    },
    dots: true,
    dotsClass: 'slick-dots slick-thumb',
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  const sliderList = images.map((url, i) => {
    return (
      <div>
        <img src={url} />
      </div>
    );
  });

  const handleClose = () => {
    setModalIsOpen(false);
  };

  const handlePreview = (file) => {
    const { uid } = file;

    let index = _.findIndex(fileList, ['uid', uid]);

    setCurrentIndex(index);
    setModalIsOpen(true);
  };

  const handleChange = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className='clearfix'>
      <CustomUpload
        listType='picture-card'
        fileList={fileList}
        showUploadList={{
          showRemoveIcon: false
        }}
        onPreview={handlePreview}
      />

      <ModalGateway>
        {modalIsOpen ? (
          <Modal 
            onClose={handleClose}
            styles={modalCustomStyles} 
            allowFullscreen={false} >
            <Carousel 
              styles={carouselCustomStyles}
              views={viewList} 
              isFullscreen={false}
              trackProps={{
                onViewChange: handleChange
              }}
              currentIndex={currentIndex} />
          </Modal>
        ) : null}
      </ModalGateway>

      <Slider {...sliderSettings}>
        {sliderList}
      </Slider>
    </div>
  );  
}