import React from 'react';
import Gallery from './Gallery';

export default () => {

  const images = [
    'https://www.emailthaisignup.com/wp-content/uploads/2019/08/facebook-page-disappear.png',
    'https://miro.medium.com/max/760/1*m0IbMlYA2-gW1P5FCKG3Jg.jpeg',
    'https://pic1.zhimg.com/v2-d86c51579b78bd5e1ea2ffc86e5d811c_1200x500.jpg',
    'https://lh3.googleusercontent.com/proxy/k0XkzkU9ewvfBkqhKFIQ8y4uY8azz_EvHsfKcQeOkc77HvETiDYGSBsO9xzjSlpVkDKzACn1iqovXtHl4-xFkUzAPYovWEVSvbPhG__6FejMPeCp3ABTf_2HoeK1ahfHbPBzoFgowg'
  ];

  return (
    <Gallery images={images} />
  );
}