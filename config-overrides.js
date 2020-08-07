const { override, fixBabelImports, addLessLoader } = require('customize-cra');

module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true,
  }),
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: { 
      '@primary-color': '#FE6202',
      '@link-color': '#FE6202',
      '@border-radius-base': '1px',
      '@select-item-selected-bg': '#FFEFE5',
      '@tree-title-height' : '40px',
      '@tree-directory-selected-color': '#000000',
      '@tree-directory-selected-bg': '#FFEFE5',
      // Progress
      // '@success-color':'#FE6202'
      // '@progress-default-color': '#FFD7B5',
      // '@progress-remaining-color': '#FE6202',
      // --
    },
  }),
);
