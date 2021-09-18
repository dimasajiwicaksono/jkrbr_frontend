import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Table } from 'antd'

const mapStateToProps = ({ toolVoucher }) => ({
  toolVoucher,
  dataaToolVoucher: toolVoucher.toolVoucherData,
  dataSelected: toolVoucher.toolVoucherSelectedRow,
  dataDetail: toolVoucher.toolVoucherDetail,
})

@withRouter
@connect(mapStateToProps)
class ListContent extends Component {
  render() {
    const { action, toolVoucher /* dataaToolVoucher */ } = this.props
    const sort = ['descend', 'ascend']
    const pagination = { pageSize: 50 }
    const dataTable = []
    const dataTableDetail = []
    const option = {
      bordered: true,
      pagination,
      size: 'small',
      hasData: true,
    }

    /* MAPING TABLE COLUMN */
    const columns = {
      dataTable: [
        {
          title: 'Ref No',
          dataIndex: 'refNo',
          key: 'refNo',
          width: 150,
          defaultSortOrder: sort,
          sorter: (a, b) => a.refNo.localCompare(b.refNo),
          fixed: 'left',
        },
        {
          title: 'Date',
          dataIndex: 'refDate',
          key: 'refDate',
          width: 150,
        },
        {
          title: 'Qty Total',
          dataIndex: 'qtyTotal',
          key: 'qtyTotal',
          sortDirections: sort,
          sorter: (a, b) => a.qtyTotal - b.qtyTotal,
        },
        {
          title: 'Approved By',
          dataIndex: 'approvedBy',
          key: 'approvedBy',
          width: 150,
          sortDirections: sort,
          sorter: (a, b) => a.approvedBy.localeCompare(b.approvedBy),
        },
        {
          title: 'Entry By',
          dataIndex: 'entryBy',
          key: 'entryBy',
          width: 150,
          sortDirections: sort,
          sorter: (a, b) => a.entryBy.localeCompare(b.entryBy),
        },
        {
          title: 'Entry Date',
          dataIndex: 'dateEntry',
          key: 'dateentry',
          width: 150,
          sortDirections: sort,
        },
      ],
      dataTableDetail: [
        {
          title: 'Outlet Code',
          dataIndex: 'outletCode',
          key: 'outletCode',
          width: 100,
          defaultSortOrder: sort,
          sorter: (a, b) => a.outletCode.localCompare(b.outletCode),
        },
        {
          title: 'Outlet Name',
          dataIndex: 'outletName',
          key: 'outletName',
          width: 100,
          defaultSortOrder: sort,
          sorter: (a, b) => a.outletName.localCompare(b.outletName),
        },
        {
          title: 'Qty',
          dataIndex: 'qty',
          key: 'qty',
          width: 100,
          defaultSortOrder: sort,
          sorter: (a, b) => a.qty - b.qty,
        },
        {
          title: 'Voucher Code',
          dataIndex: 'voucherCode',
          key: 'voucherCode',
          width: 600,
          // sortDirections: sort,
          // sorter: (a, b) => a.tenderName.localeCompare(b.tenderName),
        },
      ],
    }

    const onRow = record => ({
      onClick: () => {
        action('toolVoucherSelectedRow', record.refNo)
        action('toolVoucherDetail', { data: record })
      },
    })

    return (
      <div>
        <Table
          columns={columns.dataTable}
          dataSource={dataTable}
          // loading={toolVoucher.loading}
          onRow={onRow}
          rowClassName={record =>
            toolVoucher.toolVoucherSelectedRow === record.refNo
              ? // &&
                // toolVoucher.toolVoucherDetail.data.outletCode === record.refNo
                'row-selected'
              : ''
          }
          scroll={{ x: false, y: 280 }}
          {...option}
        />
        <Table
          columns={columns.dataTableDetail}
          dataSource={dataTableDetail}
          // loading={toolVoucher.loading}
          scroll={{ x: 900, y: 280 }}
          {...option}
        />
      </div>
    )
  }
}

export default ListContent
