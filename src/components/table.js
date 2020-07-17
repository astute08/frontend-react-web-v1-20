import React from 'react';
import { Table } from 'antd';

const AppTable = (props) => {
  const {
    dataSource,
    size,
    style,
    columns,
    onChange,
    pagination,
    title,
    rowSelection,
    loading,
    footer,
    expandIcon,
    tableLayout,
  } = props;
  
  let uniqueId = 0;

  return (
    // กำหนด Key ให้ rowKey

    <Table
      rowKey={(record) => {
        if (!record.__uniqueId) record.__uniqueId = ++uniqueId;
        return record.__uniqueId;
      }}
      title={title}
      dataSource={dataSource}
      size={size}
      style={style}
      columns={columns}
      onChange={onChange}
      pagination={pagination}
      rowSelection={rowSelection}
      loading={loading}
      footer={footer}
      expandIcon={expandIcon}
      tableLayout={tableLayout}
    />
  );
};

export default AppTable;
