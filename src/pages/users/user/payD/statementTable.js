import React from 'react';
import Card from '../../../../components/v2/card';
import Table from '../../../../components/v2/table';
// import Badge from '../../../../components/v2/b'
import moment from 'moment';
import '../css/paydStatement.css';

export default ({ transactions, formatNumber, labelShow }) => {
  console.log('transactions:::++ ', transactions);

  // const transactions = props.transactions;

  const columns = [
    {
      title: labelShow.lTransactions ? labelShow.lTransactions : "Transaction",
      key: 'staType',
      dataIndex: 'staType',
    },
    {
      title: <div>{labelShow.lDate ? labelShow.lDate : "Date"}</div>,
      key: 'createdAt',
      dataIndex: 'createdAt',
    },
    {
      title: <div>{labelShow.lEffective ? labelShow.lEffective : "Effective"}</div>,
      key: 'effective_date_val',
      dataIndex: 'effective_date_val',
    },
    {
      title: labelShow.lAmount ? labelShow.lAmount : "Amount(Baht)",
      key: 'staAmount',
      dataIndex: 'staAmount',
      render: (text, record, index) => {
        return (record.staAmount ? formatNumber(record.staAmount) : '-');
      }
    },
    {
      title: labelShow.lFee ? labelShow.lFee : "Fee(Baht)",
      key: 'free',
      dataIndex: 'free',
    },

  ];

  return (
    <div >
      <Table
        size={'middle'}
        className='statement-table'
        pagination={{ position: 'none' }}
        dataSource={transactions}
        columns={columns}
        bordered={false}
      />
    </div>

  );
}