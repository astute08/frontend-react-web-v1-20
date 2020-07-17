import React from 'react';
import ImageGallery from 'react-image-gallery';

export default () => {

  const images = [
    {
      original: 'https://www.simummuangmarket.com/uploads/image-1580175806960.jpg',
      thumbnail: 'https://www.simummuangmarket.com/uploads/image-1580175806960.jpg',
    },
    {
      original: 'https://ak.picdn.net/shutterstock/videos/13041569/thumb/4.jpg',
      thumbnail: 'https://ak.picdn.net/shutterstock/videos/13041569/thumb/4.jpg',
    },
    {
      original: 'https://www.honestdocs.co/system/redactor2_assets/images/1040/content_%E0%B8%81%E0%B8%A5%E0%B9%89%E0%B8%A7%E0%B8%A2%E0%B8%AB%E0%B8%AD%E0%B8%A1.jpg',
      thumbnail: 'https://www.honestdocs.co/system/redactor2_assets/images/1040/content_%E0%B8%81%E0%B8%A5%E0%B9%89%E0%B8%A7%E0%B8%A2%E0%B8%AB%E0%B8%AD%E0%B8%A1.jpg',
    },
  ];

  return (
    <ImageGallery 
      items={images}
      showPlayButton={false}
      showFullscreenButton={false} />
  );
}