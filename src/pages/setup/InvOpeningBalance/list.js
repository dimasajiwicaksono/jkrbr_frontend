import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import * as moment from 'moment'
import { Table, Tag } from 'antd'
import { currencyFormat, dateFormat } from '../../../utils/helper'
import vars from '../../../utils/variable'

const mapStateToProps = ({ setInvOpeningBalance }) => ({
  setInvOpeningBalance,
  opBalanceData: setInvOpeningBalance.setInvOpeningBalanceData,
  opBalanceDetail: setInvOpeningBalance.setInvOpeningBalanceDetail,
})

@withRouter
@connect(mapStateToProps)
class ListContent extends Component {
  getStatus = param => {
    let result = ''
    switch (param) {
      case '1':
        result = <Tag color={vars.TAG_COLOR_UNAPPROVE}>Unapprove</Tag>
        break
      case '2':
        result = <Tag color={vars.TAG_COLOR_APPROVE}>Posted</Tag>
        break
      default:
        result = ''
    }
    return result
  }

  render() {
    const { action, dispatch, setInvOpeningBalance, opBalanceData, opBalanceDetail } = this.props
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
          width: 180,
          defaultSortOrder: sort,
          sorter: (a, b) => a.refNo.localeCompare(b.refNo),
          fixed: 'left',
        },
        {
          title: 'Status',
          dataIndex: 'status',
          key: 'status',
          width: 150,
          sortDirections: sort,
          sorter: (a, b) => a.status.localeCompare(b.status),
          render: text => <div>{this.getStatus(text)}</div>,
        },
        {
          title: 'Date',
          dataIndex: 'date',
          key: 'date',
          width: 150,
          sortDirections: sort,
          sorter: (a, b) => a.date.localeCompare(b.date),
          render: text => <div>{moment(text).format(dateFormat.formatDateID)}</div>,
        },
        {
          title: 'Location',
          dataIndex: 'locaName',
          key: 'locaName',
          sortDirections: sort,
          sorter: (a, b) => a.locaName.localeCompare(b.locaName),
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
          dataIndex: 'entryDate',
          key: 'entryDate',
          width: 150,
          sortDirections: sort,
          sorter: (a, b) => a.entryDate.localeCompare(b.entryDate),
          render: text => <div>{moment(text).format(dateFormat.formatDateTimeID)}</div>,
        },
      ],
      dataTableDetail: [
        {
          title: 'Item Code',
          dataIndex: 'itemCode',
          key: 'itemCode',
          width: 150,
          defaultSortOrder: sort,
          sorter: (a, b) => a.itemCode.localeCompare(b.itemCode),
        },
        {
          title: 'Item Name',
          dataIndex: 'itemName',
          key: 'itemName',
          sortDirections: sort,
          sorter: (a, b) => a.itemName.localeCompare(b.itemName),
        },
        {
          title: 'Qty',
          dataIndex: 'qty',
          key: 'qty',
          width: 100,
          sortDirections: sort,
          sorter: (a, b) => a.qty.localeCompare(b.qty),
          align: 'right',
          render: text => <div>{currencyFormat(text)}</div>,
        },
        {
          title: 'Uom',
          dataIndex: 'uom',
          key: 'uom',
          width: 150,
          sortDirections: sort,
          sorter: (a, b) => a.uom.localeCompare(b.uom),
        },
      ],
    }

    /* MAPING DATA TABEL */
    if (opBalanceData !== undefined) {
      opBalanceData.map((val, key) =>
        dataTable.push({
          key,
          refNo: val.refNo,
          date: val.refDate,
          locaName: val.locaName,
          status: val.oBStatus,
          entryBy: val.userEntry,
          entryDate: val.timeEntry,
        }),
      )
    }
    if (opBalanceDetail.data !== undefined) {
      opBalanceDetail.data.map((val, key) =>
        dataTableDetail.push({
          key,
          itemCode: val.itemCode,
          itemName: val.itemName,
          qty: val.qty,
          uom: val.uomStock,
        }),
      )
    }

    const onRow = record => ({
      onClick: () => {
        action('setInvOpeningBalanceSelectedRow', record.refNo)
        dispatch({
          type: 'setInvOpeningBalance/GET_DATA_INV_OPENING_BLC_DETAIL',
          payload: { refNo: record.refNo },
        })
      },
    })

    return (
      <div className="mt-4">
        <Table
          columns={columns.dataTable}
          dataSource={dataTable}
          loading={setInvOpeningBalance.loading}
          onRow={onRow}
          rowClassName={record =>
            setInvOpeningBalance.setInvOpeningBalanceSelectedRow === record.refNo
              ? 'row-selected'
              : ''
          }
          scroll={{ x: 900, y: 280 }}
          {...option}
        />
        <Table
          columns={columns.dataTableDetail}
          dataSource={dataTableDetail}
          loading={setInvOpeningBalance.loadingDetail}
          scroll={{ x: 950, y: 250 }}
          {...option}
        />
      </div>
    )
  }
}

export default ListContent
