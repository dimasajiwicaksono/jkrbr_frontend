import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Table, Tag } from 'antd'
import * as moment from 'moment'
import vars from '../../../utils/variable'
import { currencyFormat, dateFormat } from '../../../utils/helper'

const mapStateToProps = ({ posPointOfSales }) => ({
  posPointOfSales,
  dataRequest: posPointOfSales.posPointOfSalesData.data || [],
  detailRequest: posPointOfSales.posPointOfSalesDetail || [],
})

const sort = ['descend', 'ascend']

@withRouter
@connect(mapStateToProps)
class ListContent extends Component {
  getRequestStatus = param => {
    let result = ''

    switch (param) {
      case '1':
        result = <Tag color={vars.TAG_COLOR_PENDING}>Pending</Tag>
        break
      case '2':
        result = <Tag color={vars.TAG_COLOR_APPROVE}>Approved</Tag>
        break
      case '3':
        result = <Tag color={vars.TAG_COLOR_CLOSE}>Closed</Tag>
        break
      case '4':
        result = <Tag color={vars.TAG_COLOR_CANCEL}>Canceled</Tag>
        break
      default:
        result = ''
    }
    return result
  }

  render() {
    const { dataRequest, posPointOfSales, dispatch, action } = this.props
    const dataTableDetail = []
    const pagination = { pageSize: 50 }
    const option = {
      bordered: true,
      // pagination: false,
      pagination,
      size: 'small',
      hasData: true,
    }

    /* MAPING TABLE COLUMN */
    const columns = {
      dataTable: [
        {
          title: 'Outlet Code',
          dataIndex: 'outletCode',
          key: 'outletCode',
          width: 100,
          defaultSortOrder: sort,
          fixed: 'left',
        },
        {
          title: 'Bill No',
          dataIndex: 'billNo',
          key: 'billNo',
          width: 150,
          defaultSortOrder: sort,

          fixed: 'left',
        },
        {
          title: 'Bill Date',
          dataIndex: 'billDate',
          key: 'billDate',
          width: 150,
          sortDirections: sort,
          render: text => <div>{moment(text).format(dateFormat.formatDateID)}</div>,
        },
        {
          title: 'Sales',
          dataIndex: 'sales',
          key: 'sales',
          width: 100,
          sortDirections: sort,
        },
        {
          title: 'Sub Total',
          dataIndex: 'subTotal',
          key: 'subTotal',
          width: 100,
          sortDirections: sort,
          align: 'right',

          render: text => <div>{currencyFormat(text)}</div>,
        },
        {
          title: 'Discount',
          dataIndex: 'discount',
          key: 'discount',
          width: 100,
          sortDirections: sort,
          align: 'right',

          render: text => <div>{currencyFormat(text)}</div>,
        },
        {
          title: 'Service',
          dataIndex: 'service',
          key: 'service',
          width: 100,
          align: 'right',
          sortDirections: sort,

          render: text => <div>{currencyFormat(text)}</div>,
        },
        {
          title: 'Tax',
          dataIndex: 'tax',
          key: 'tax',
          width: 100,
          align: 'right',
          sortDirections: sort,
          sorter: (a, b) => a.tax - b.tax,
          render: text => <div>{currencyFormat(text)}</div>,
        },
        {
          title: 'Rounded',
          dataIndex: 'rounded',
          key: 'rounded',
          width: 100,
          sortDirections: sort,
          align: 'right',
          render: text => <div>{currencyFormat(text)}</div>,
        },
        {
          title: 'Grand Total',
          dataIndex: 'grandTotal',
          key: 'grandTotal',
          width: 150,
          sortDirections: sort,
          align: 'right',
          render: text => <div>{currencyFormat(text)}</div>,
        },
      ],
      dataTableDetail: [
        {
          title: 'Menu Code',
          dataIndex: 'menuCode',
          key: 'menuCode',
          width: 150,
          defaultSortOrder: sort,
          fixed: 'left',
        },
        {
          title: 'Menu Name',
          dataIndex: 'menuName',
          key: 'menuName',
          sortDirections: sort,
        },
        {
          title: 'Qty',
          dataIndex: 'qty',
          align: 'right',
          key: 'qty',
          width: 150,
          sortDirections: sort,
          render: text => <div>{currencyFormat(text)}</div>,
        },
        {
          title: 'Unit Price',
          dataIndex: 'unitPrice',
          key: 'unitPrice',
          align: 'right',
          width: 150,
          sortDirections: sort,
          render: text => <div>{currencyFormat(text)}</div>,
        },
        {
          title: 'Discount',
          dataIndex: 'discount',
          key: 'discount',
          align: 'right',
          width: 150,
          sortDirections: sort,
          render: text => <div>{currencyFormat(text)}</div>,
        },
        {
          title: 'Amount',
          dataIndex: 'amount',
          key: 'amount',
          align: 'right',
          width: 150,
          sortDirections: sort,
          render: text => <div>{currencyFormat(text)}</div>,
        },
      ],
    }

    /* MAPING DATA TABEL */

    const dataTable = (dataRequest || []).map((val, key) => ({
      key,
      refNo: val.RefNo,
      outletCode: val.OutletCode,
      outletName: val.OutletName,
      billNo: val.BillNo,
      billDate: val.BillDate,
      sales: val.FgSls,
      subTotal: +val.SubTotal || 0,
      discount: +val.Discount || 0,
      service: +val.ServValue || 0,
      tax: +val.TaxValue || 0,
      rounded: +val.Rounded || 0,
      grandTotal: +val.GrandTotal || 0,
    }))

    const onRow = record => ({
      onClick: () => {
        action('posPointOfSalesSelectedRow', record.refNo)
        dispatch({
          type: 'posPointOfSales/GET_DATA_POS_DETAIL',
          payload: { refNo: record.refNo },
        })
      },
    })

    return (
      <div>
        <Table
          {...option}
          columns={columns.dataTable}
          dataSource={dataTable}
          loading={posPointOfSales.loading}
          onRow={onRow}
          rowClassName={record =>
            posPointOfSales.posPointOfSalesSelectedRow === record.refNo ? 'row-selected' : ''
          }
          scroll={{ x: columns.dataTable.reduce((a, { width }) => a + width, 0), y: 280 }}
        />
        {dataTableDetail && (
          <Table
            {...option}
            columns={columns.dataTableDetail}
            dataSource={dataTableDetail}
            loading={posPointOfSales.loadingDetail}
            scroll={{ x: 1000, y: 250 }}
          />
        )}
      </div>
    )
  }
}

export default ListContent
