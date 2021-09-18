import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import * as moment from 'moment'
import { Form, Input, Button, Table, DatePicker, Row, Col, notification, Spin } from 'antd'
import ModalComponentItems from './modalListItem'
import { getUnique, dateFormat, currencyFormat, notifConfig } from '../../../utils/helper'

const mapStateToProps = ({
  setInvOpeningBalance,
  mstBrand,
  mstOutlet,
  mstLocation,
  mstItems,
  user,
  settings,
}) => ({
  setInvOpeningBalance,
  mstBrand,
  mstOutlet,
  mstLocation,
  mstItems,
  convertItemsDetail: setInvOpeningBalance.setInvOpeningBalanceDetail,
  dataImport: setInvOpeningBalance.setInvOpeningBalanceImportData,
  dataItem: setInvOpeningBalance.itemsLocationOption,
  dataItems: setInvOpeningBalance.itemsOption,
  dataBrand: setInvOpeningBalance.brandOption,
  dataOutlet: setInvOpeningBalance.outletOption,
  dataLocation: setInvOpeningBalance.locationOption,
  user,
  setPeriode: settings.setPeriode,
})

@withRouter
@connect(mapStateToProps)
class EditContent extends Component {
  constructor(props) {
    super(props)
    const { convertItemsDetail } = this.props
    const { header, data } = convertItemsDetail
    const listItem = []
    data.map((val, key) =>
      listItem.push({
        index: key + 1,
        itemCode: val.itemCode,
        itemName: val.itemName,
        units: val.uomStock,
        qty: val.qty,
        unitPrice: val.unitPrice,
        amount: val.amount,
      }),
    )
    this.state = {
      refNo: header.refNo,
      refDate: moment(header.refDate).format(dateFormat.formatDateID),
      locationName: header.locaName,
      remark: header.Remark,
      files: '',
      sheet: '',
      // amount: Number(header.qtyOut) * Number(header.unitPriceReal),
      items: listItem,
      modalItems: {
        valueDefault: '',
        record: '',
        visible: false,
      },
      rules: {
        refDate: {
          required: true,
          message: 'Please select the Date.',
        },
        brand: {
          required: true,
          message: 'Please select the Brand.',
        },
        outlet: {
          required: true,
          message: 'Please select the Outlet.',
        },
        location: {
          required: true,
          message: 'Please select the Location.',
        },
        item: {
          required: true,
          message: 'Please select the Item.',
        },
      },
    }
  }

  componentWillReceiveProps(nextProps) {
    const { items } = this.state
    if (nextProps.dataImport.data && items !== nextProps.dataImport.data) {
      const list = []
      nextProps.dataImport.data.map((val, key) =>
        list.push({
          index: key,
          itemNo: val.itemNo,
          itemCode: val.itemCode,
          itemName: val.itemName,
          uomStock: val.uomStock,
          qty: val.qty,
          unitPrice: val.unitPrice,
          amount: val.amount,
        }),
      )
      this.setState({
        items: list,
      })
    }
  }

  handleSubmit = e => {
    const { dispatch, form, setPeriode, action } = this.props
    const { refNo, refDate, remark, items } = this.state
    e.preventDefault()
    form.validateFields(err => {
      if (err === null) {
        const list = []
        items
          .filter(x => x.itemCode !== '')
          .map(val =>
            list.push({
              itemCode: val.itemCode,
              itemName: val.itemName,
              qty: Number(val.qty),
              uomStock: val.uomStock,
              unitPrice: Number(val.unitPrice),
            }),
          )
        const promise = new Promise(resolve => {
          dispatch(
            {
              type: 'setInvOpeningBalance/GET_DATA_INV_OPENING_BLC_UPDATE',
              payload: {
                refNo,
                refDate,
                remark,
                details: list,
              },
            },
            setTimeout(() => {
              resolve(
                action('setInvOpeningBalanceImportData', []),
                action('setInvOpeningBalanceDetail', []),
                dispatch({
                  type: 'setInvOpeningBalance/GET_DATA_INV_OPENING_BLC_LIST',
                  payload: {
                    refDateFrom: setPeriode.currentStartMonth,
                    refDateTo: setPeriode.currentEndMonth,
                  },
                }),
                dispatch({
                  type: 'setInvOpeningBalance/GET_DATA_INV_OPENING_BLC_LIST',
                  payload: {
                    fdate: setPeriode.startMonthID,
                    tdate: setPeriode.endMonthID,
                  },
                }),
              )
            }, 300),
          )
        })
        promise.then(() => true)
      }
    })
  }

  disabledStartDate = current => {
    const { refDate } = this.state
    const ciDate = moment(refDate, dateFormat.formatDateID)
    return (
      (current && current < moment(ciDate).startOf('month')) ||
      current > moment(ciDate).endOf('month')
    )
  }

  handleReloadItems = () => {
    const { dispatch, moduleSet } = this.props
    dispatch({
      type: 'mstItems/GET_DATA_ITEMS_OPTION',
      payload: {
        moduleSet,
      },
    })
  }

  handleKeyPress(e, record) {
    const { dataItems } = this.props
    const { items } = this.state
    const { value } = e.target
    const nextIndex = items.length
    if (e.key === 'Enter') {
      if (dataItems.length > 0) {
        /* KETIKA DIKETIK DAN DITEMUKAN */
        const filterData = dataItems.filter(val => val.itemCode.indexOf(value) === 0)
        if (filterData.length === 1) {
          const itemRes = {
            index: nextIndex,
            itemCode: filterData[0].itemCode,
            itemName: filterData[0].itemName,
            categoryName: filterData[0].groupName,
            groupName: filterData[0].groupName,
            units: filterData[0].uomStock,
            qty: 0,
            qtyFrom: 0,
            amount: 0,
            unitPrice: filterData[0].unitPrice,
            lastIndex: record.index,
            key: record.key,
          }
          this.handleOk(itemRes)
        } else {
          /* KETIKA DIKETIK DAN TIDAK DITEMUKAN */
          this.handleModalItems(value, record)
        }
      } else {
        notification.error({
          message: 'Failed',
          description: 'Something went wrong. Please reload the page.',
          ...notifConfig,
        })
      }
    }
  }

  handleOk(e) {
    const { items, item } = this.state
    if (e) {
      if (e.lastIndex && e.lastIndex !== 99999999999) {
        items[e.key] = {
          index: e.lastIndex,
          itemCode: e.itemCode,
          itemName: e.itemName,
          categoryName: e.categoryName,
          groupName: e.groupName,
          units: e.uomStock,
          qty: e.qty,
          amount: e.amount,
          qtyFrom: e.qtyFrom,
          unitPrice: e.unitPrice,
        }
      }
      const newData = items.concat(e)
      const itemsFinal = getUnique(newData, 'itemCode')
      if (item.code !== '') {
        this.setState({
          modalItems: {
            visible: false,
          },
          items: itemsFinal.filter(x => x.itemCode !== item.code),
        })
      } else {
        this.setState({
          modalItems: {
            visible: false,
          },
          items: itemsFinal,
        })
      }
    }
    this.setState({
      modalItems: {
        visible: false,
      },
    })
    this.handleEditForm(null)
  }

  handleModalItems(value, record) {
    this.setState({
      modalItems: {
        valueDefault: value,
        record,
        visible: true,
      },
    })
  }

  handleDelete(e) {
    const { items } = this.state
    const newItems = items.filter((val, key) => key !== e.key)
    const num = []
    newItems.map(val => num.push(Number(val.amount)))
    /* eslint-disable */
    const sum = num.reduce((a, b) => (a += b), 0)
    /* eslint-enable */
    this.setState({
      items: newItems,
    })
  }

  // handleEditForm(key) {
  //   this.setState({
  //     qtyForm: key,
  //   })
  // }

  handleCancel() {
    this.setState({
      modalItems: {
        visible: false,
      },
    })
  }

  handleItemChange(record, value, field) {
    /* eslint-disable */
    const { items } = this.state
    if (field === 'qty') {
      this.state.items[record.key].qty = value
      this.state.items[record.key].amount = Number(value) * Number(record.unitPrice)
    } else if (field === 'qtyFrom') {
      this.state.items[record.key].qtyFrom = value
    }
    /* eslint-enable */
  }

  handleQtyChange(value) {
    const { onHandQty, item } = this.state
    if (Number(value) > Number(onHandQty)) {
      notification.warning({
        message: 'Failed: Qty',
        description: `${item.name} on hand qty ${onHandQty}`,
        ...notifConfig,
      })
    } else {
      this.setState({
        // qty: value,
        // amount: Number(unitPrice) * Number(value)
      })
    }
  }

  handleImport() {
    const { dispatch, action } = this.props
    const { files, sheet } = this.state
    if (files === '') {
      notification.error({
        message: 'Failed: Files',
        description: 'Files not found.',
        ...notifConfig,
      })
    } else if (sheet === '') {
      notification.error({
        message: 'Failed: Files',
        description: 'Sheet not found.',
        ...notifConfig,
      })
    } else {
      this.setState({
        items: [],
      })
      action('setInvOpeningBalanceImportData', [])
      dispatch({
        type: 'setInvOpeningBalance/GET_DATA_INV_OPENING_BLC_IMPORT',
        payload: {
          files,
          sheet,
        },
      })
    }
  }

  handleContent(payload) {
    const { action } = this.props
    action('itemsLocationOption', [])
    action('setInvOpeningBalanceImportData', [])
    action('contentStatus', payload)
  }

  render() {
    const { form, setInvOpeningBalance, moduleSet } = this.props
    const { rules, modalItems, items, refNo, refDate, locationName, remark } = this.state
    const { getFieldDecorator } = form
    const { TextArea } = Input
    const pagination = { pageSize: 50 }
    const dataTable = []
    const option = {
      bordered: true,
      pagination,
      size: 'small',
      hasData: true,
    }
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 15 },
      },
    }
    const columns = {
      itemsDataTable: [
        {
          title: 'Item Code',
          dataIndex: 'itemCode',
          key: 'itemCode',
          width: 150,
        },
        {
          title: 'Item Name',
          dataIndex: 'itemName',
          key: 'itemName',
        },
        {
          title: 'Qty',
          dataIndex: 'qty',
          key: 'qty',
          width: 120,
          align: 'left',
          render: (text, record) => (
            <div>{record.index !== 99999999999 && <div>{currencyFormat(text)}</div>}</div>
          ),
        },
        {
          title: 'UOM',
          dataIndex: 'uomFrom',
          key: 'uomFrom',
          align: 'left',
          width: 100,
        },
        {
          title: 'Unit Price',
          dataIndex: 'unitPrice',
          key: 'unitPrice',
          width: 150,
          align: 'right',
          render: text => <div>{currencyFormat(text)}</div>,
        },
        {
          title: 'Amount',
          dataIndex: 'amount',
          key: 'amount',
          width: 150,
          align: 'right',
          render: (text, record) => (
            // / eslint-disable /
            <div>{record.index !== 99999999999 && <div>{currencyFormat(text)}</div>}</div>
            // / eslint-enable /
          ),
        },
      ],
    }

    /* MAPPING DATA ITEMS */
    if (items.length > 0) {
      items.sort((a, b) => a.index - b.index)
      items.map((val, key) =>
        dataTable.push({
          key,
          index: val.index,
          itemCode: val.itemCode,
          itemName: val.itemName,
          uomFrom: val.uomStock,
          qty: val.qty,
          unitPrice: val.unitPrice,
          amount: val.amount,
        }),
      )
    }

    return (
      <div>
        <Spin spinning={setInvOpeningBalance.loadingProcess}>
          <Form>
            <div className="row">
              <div className="col-md-6">
                <Form.Item className="ant-form-item-custom" {...formItemLayout} label="Ref No.">
                  <Input value={refNo} disabled />
                </Form.Item>
                <Form.Item className="ant-form-item-custom" {...formItemLayout} label="Date">
                  {getFieldDecorator('refDate', {
                    rules: [rules.refDate],
                    initialValue: moment(refDate, dateFormat.formatDateID),
                  })(
                    <DatePicker
                      allowClear={false}
                      // disabledDate={this.disabledStartDate}
                      format={dateFormat.formatDateID}
                      onChange={(fullDate, dateString) => this.setState({ refDate: dateString })}
                    />,
                  )}
                </Form.Item>
                <Form.Item className="ant-form-item-custom" {...formItemLayout} label="Location">
                  <Input disabled value={locationName} />
                </Form.Item>
              </div>
              <div className="col-md-6">
                <Form.Item className="ant-form-item-custom" {...formItemLayout} label="File Upload">
                  <Input type="file" onChange={e => this.setState({ files: e.target.files[0] })} />
                </Form.Item>
                <Form.Item className="ant-form-item-custom" {...formItemLayout} label="Sheet">
                  <Row gutter={8}>
                    <Col span={12}>
                      <Input onChange={e => this.setState({ sheet: e.target.value })} />
                    </Col>
                    <Col span={8}>
                      <Button
                        className="btn-success"
                        style={{ width: '100%' }}
                        onClick={() => this.handleImport()}
                      >
                        Upload
                      </Button>
                    </Col>
                  </Row>
                </Form.Item>
                <Form.Item className="ant-form-item-custom" {...formItemLayout} label="Remark">
                  {getFieldDecorator('remark', {
                    initialValue: remark,
                  })(<TextArea onChange={e => this.setState({ remark: e.target.value })} />)}
                </Form.Item>
                {/* <Form.Item className="ant-form-item-custom" {...formItemLayout} label="Unit Price">
                  <Input disabled value={currencyFormat(unitPrice)} />
                </Form.Item>
                <Form.Item className="ant-form-item-custom" {...formItemLayout} label="Amount">
                  <Input disabled value={currencyFormat(amount)} />
                </Form.Item> */}
              </div>
            </div>
            <div className="mt-4">
              <Table
                {...option}
                columns={columns.itemsDataTable}
                dataSource={dataTable}
                loading={false}
                scroll={{ x: 900, y: 280 }}
              />
            </div>
            <div className="text-right mt-4">
              <Button
                className="ml-4"
                type="primary"
                icon="save"
                htmlType="submit"
                onClick={this.handleSubmit}
              >
                Save
              </Button>
              <Button
                className="ml-4"
                type="default"
                icon="close"
                onClick={() => this.handleContent('isView')}
              >
                Cancel
              </Button>
            </div>
          </Form>
          {modalItems.visible === true && (
            <ModalComponentItems
              visible={modalItems.visible}
              onOk={val => this.handleOk(val)}
              onCancel={() => this.handleCancel()}
              rec={modalItems.record}
              nextIndex={items.length}
              title="Select Items"
              valueDefault={modalItems.valueDefault}
              lastKey={items.length}
              moduleSet={moduleSet}
            />
          )}
        </Spin>
      </div>
    )
  }
}

export default Form.create({ name: 'form_edit' })(EditContent)
