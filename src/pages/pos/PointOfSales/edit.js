import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import * as moment from 'moment'
import { Form, DatePicker, Input, Button, Table, Popconfirm, notification, Spin } from 'antd'
import ModalPriceQuoteComponent from './modalPriceQuote'
import ModalMRComponent from './modalMarketList'
import NumericInput from '../../../components/CleanUIComponents/Input/NumericInput'
import SelectScap from '../../../components/CleanUIComponents/Scap/SelectScap'
import {
  currencyFormat,
  getUnique,
  dateFormat,
  datePeriod,
  notifConfig,
} from '../../../utils/helper'

const mapStateToProps = ({ posPointOfSales, user, mstItems }) => ({
  posPointOfSales,
  prLoading: posPointOfSales.loading,
  prDetailLoading: posPointOfSales.posPointOfSalesDetail.loading,
  posPointOfSalesDetail: posPointOfSales.posPointOfSalesDetail,
  user,
  mstItems,
  dataOutlet: posPointOfSales.outletOption,
  dataLocation: posPointOfSales.locationOption,
  dataItems: posPointOfSales.itemsOption,
  dataMR: posPointOfSales.marketDetailOption,
})

@withRouter
@connect(mapStateToProps)
class EditContent extends Component {
  constructor(props) {
    super(props)
    const { posPointOfSalesDetail } = this.props
    const { header } = posPointOfSalesDetail
    const dataArray = [
      {
        index: 99999999999,
        itemCode: '',
        itemName: '',
        qty: 0,
        units: '',
        remark: '',
      },
    ]
    posPointOfSalesDetail.data.map((val, key) =>
      dataArray.push({
        index: key,
        itemCode: val.itemCode,
        itemName: val.itemName,
        qty: Number(val.qty),
        units: val.unit,
        remark: val.remark,
      }),
    )
    this.state = {
      qtyForm: null,
      modalItems: {
        valueDefault: '',
        indexEdit: '',
        visible: false,
      },
      modalTitle: '',
      endDisable: true,
      marketCode: header.marketCode,
      prNo: header.prNo,
      prDate: moment(header.prDate).format(dateFormat.formatDateID),
      delivDate: moment(header.delivDate, dateFormat.formatDateID),
      requestBy: header.requestby,
      locaCode: header.locaCode,
      note: header.prNote,
      deptHead: header.deptHead,
      departID: header.outletCode,
      items: dataArray,
      prSource: 'PR',
      rules: {
        outlet: {
          required: true,
          message: 'Please select outlet.',
        },
        prDate: {
          required: true,
          message: 'Please select date.',
        },
        delivDate: {
          required: true,
          message: 'Please select date.',
        },
        requestBy: {
          required: true,
          message: 'Please input this form.',
        },
        location: {
          required: true,
          message: 'Please select Location.',
        },
        source: {
          required: true,
          message: 'Please select Source.',
        },
      },
    }
  }

  componentWillMount() {
    const { dispatch, moduleSet, posPointOfSalesDetail } = this.props
    const { header } = posPointOfSalesDetail
    dispatch({
      type: 'prMarketList/GET_DATA_MARKET_LIST_DETAIL_OPTION',
      payload: {
        moduleSet,
        marketCode: header.marketCode,
      },
    })
  }

  getItemValue(keys, field) {
    const { items } = this.state
    let res
    items.map(val => {
      if (val.itemCode === keys) {
        if (field === 'qty') {
          res = val.qty
        } else if (field === 'remark') {
          res = val.remark
        }
      }
      return res
    })
    return res
  }

  handleStartOpenChange = dateString => {
    if (dateString !== '') {
      this.setState({ endDisable: false })
    }
  }

  // disabledStartDate = current => {
  //   const { posPointOfSalesDetail } = this.props
  //   return (
  //     moment(current, dateFormat.formatDateID).startOf('month') <
  //     moment(posPointOfSalesDetail.header.prDate.split(' ')[0]).startOf('month')
  //   )
  // }

  disabledEndDate = endDate => {
    const { prDate } = this.state
    const ciDate = moment(prDate, dateFormat.formatDateID)
    if (!ciDate) {
      return moment().endOf('day')
    }
    return endDate.valueOf() < ciDate.valueOf()
  }

  disabledStartDate = current => {
    const { prDate } = this.state
    const ciDate = moment(prDate, dateFormat.formatDateID)
    return (
      (current && current < moment(ciDate).startOf('month')) ||
      current > moment(ciDate).endOf('month')
    )
  }

  handleSubmit = e => {
    const { form } = this.props
    const { items } = this.state
    e.preventDefault()
    form.validateFields(err => {
      if (err === null) {
        if (items.length > 0) {
          this.handleSave()
        } else {
          notification.error({
            message: 'Failed',
            description: 'Please select item.',
            ...notifConfig,
          })
        }
      }
    })
  }

  handleSave() {
    const { dispatch } = this.props
    const {
      prNo,
      prDate,
      delivDate,
      requestBy,
      locaCode,
      note,
      deptHead,
      items,
      prSource,
      departID,
    } = this.state
    const payload = {
      prNo,
      prDate,
      delivDate,
      requestBy,
      locaCode,
      note,
      deptHead,
      prSource,
      departID,
      items,
    }
    const promise = new Promise(resolve => {
      dispatch(
        {
          type: 'posPointOfSales/GET_DATA_POS_UPDATE',
          payload,
        },
        setTimeout(() => {
          resolve(
            dispatch({
              type: 'posPointOfSales/GET_DATA_POS_LIST',
              payload: {
                // billNo,
                // sales,
                fDate: datePeriod.startMonthID,
                tDate: datePeriod.endMonthID,
              },
            }),
            dispatch({
              type: 'posPointOfSales/GET_DATA_PURCHASE_REQUEST_DETAIL',
              payload: {
                refNo: prNo,
              },
            }),
          )
        }, 300),
      )
    })
    promise.then(() => true)
  }

  handleKeyPress(e, record) {
    const { dataItems, dataMR } = this.props
    const { items, prSource } = this.state
    const { value } = e.target
    const nextIndex = items.length
    if (e.key === 'Enter') {
      if (prSource === 'PR') {
        if (dataItems.length > 0) {
          const filterData = dataItems.filter(val => val.itemCode === value)
          if (filterData.length === 1) {
            const itemRes = {
              index: nextIndex,
              itemCode: filterData[0].itemCode,
              itemName: filterData[0].itemName,
              qty: 0,
              units: filterData[0].uomPurch,
              remark: '',
              lastIndex: record.index,
              key: record.key,
            }
            this.handleOk(itemRes)
          } else {
            this.handleModal(value, record)
          }
        } else {
          notification.error({
            message: 'Failed',
            description: 'Data not found.',
            ...notifConfig,
          })
        }
      } else if (prSource === 'MR') {
        if (dataMR.length > 0) {
          const filterData = dataMR.filter(val => val.itemCode === value)
          if (filterData.length === 1) {
            const itemRes = {
              index: nextIndex,
              itemCode: filterData[0].itemCode,
              itemName: filterData[0].itemName,
              qty: 0,
              units: filterData[0].uomPurch,
              remark: '',
              lastIndex: record.index,
              key: record.key,
            }
            this.handleOk(itemRes)
          } else {
            this.handleModal(value, record)
          }
        } else {
          notification.error({
            message: 'Failed',
            description: 'Data not found.',
            ...notifConfig,
          })
        }
      } else {
        notification.error({
          message: 'Failed',
          description: 'Please select Source.',
          ...notifConfig,
        })
      }
    }
  }

  handleDatePickerChange(date, dateString, field) {
    const { delivDate } = this.state
    this.handleChange(field, dateString)
    if (field === 'prDate') {
      if (moment(date).isAfter(delivDate)) {
        this.setState({
          delivDate: dateString,
        })
      }
    }
    if (field === 'prDate' && dateString === '') {
      this.setState({
        endDisable: true,
        prDate: null,
        delivDate: null,
      })
    }
  }

  handleEditForm(key) {
    this.setState({
      qtyForm: key,
    })
  }

  handleItemChange(record, value, field) {
    /* eslint-disable */
    if (field === 'qty') {
      this.state.items[record.key].qty = value
    } else {
      this.state.items[record.key].remark = value
    }
    /* eslint-enable */
  }

  handleDeleteItem(e) {
    const { items } = this.state
    this.setState({
      items: items.filter((val, key) => key !== e.key),
    })
  }

  handleChange(field, value) {
    this.setState({
      [field]: value,
    })
  }

  handleContent(payload) {
    const { posPointOfSales, dispatch } = this.props
    if (posPointOfSales.contentStatus !== payload) {
      dispatch({
        type: 'posPointOfSales/HANDLE_CONTENT',
        payload,
      })
    }
  }

  handleCancel() {
    const { dispatch } = this.props
    this.setState({
      modalItems: {
        valueDefault: '',
        indexEdit: '',
        visible: false,
      },
    })
    dispatch({
      type: 'prPriceQuote/HANDLE_STATE',
      field: 'prPriceQuoteData',
      value: [],
    })
  }

  handleOk(e) {
    const { dispatch } = this.props
    const { items } = this.state
    if (e) {
      if (e.lastIndex && e.lastIndex !== 99999999999) {
        items[e.key] = {
          index: e.lastIndex,
          itemCode: e.itemCode,
          itemName: e.itemName,
          qty: e.qty,
          units: e.units,
          remark: e.remark,
        }
      }
      const newData = items.concat(e)
      const itemsFinal = getUnique(newData, 'itemCode')
      this.setState({
        modalItems: {
          valueDefault: '',
          indexEdit: '',
          visible: false,
        },
        items: itemsFinal,
      })
    }
    this.setState({
      modalItems: {
        valueDefault: '',
        indexEdit: '',
        visible: false,
      },
    })
    dispatch({
      type: 'prPriceQuote/HANDLE_STATE',
      field: 'prPriceQuoteData',
      value: [],
    })
  }

  handleModal(value, edit) {
    this.setState({
      modalItems: {
        valueDefault: value,
        indexEdit: edit,
        visible: true,
      },
      modalTitle: 'Select Items',
    })
  }

  render() {
    const {
      prLoading,
      moduleSet,
      form,
      posPointOfSalesDetail,
      dataOutlet,
      dataLocation,
      posPointOfSales,
    } = this.props
    const {
      items,
      endDisable,
      qtyForm,
      rules,
      modalTitle,
      modalItems,
      prNo,
      prDate,
      delivDate,
      prSource,
      marketCode,
    } = this.state
    const { getFieldDecorator } = form
    const { header } = posPointOfSalesDetail
    const columns = [
      {
        title: 'Delete',
        dataIndex: 'delete',
        key: 'delete',
        width: 100,
        align: 'center',
        render: (text, record) => (
          <span>
            {record.index !== 99999999999 && (
              <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDeleteItem(record)}>
                <Button type="danger">Delete</Button>
              </Popconfirm>
            )}
          </span>
        ),
      },
      {
        title: 'Item Code',
        dataIndex: 'itemCode',
        key: 'itemCode',
        width: 200,
        render: (text, record) =>
          record.key !== qtyForm && record.index !== 99999999999 ? (
            /* eslint-disable */
            <div onClick={() => this.handleEditForm(record.key)}>
              {record.itemCode === '' ? (
                <span style={{ color: '#b8beca' }}>Click to edit</span>
              ) : (
                record.itemCode
              )}
            </div>
          ) : (
            /* eslint-enable */
            <div>
              <Group>
                <Input
                  defaultValue={text}
                  onKeyDown={e => this.handleKeyPress(e, record)}
                  onPressEnter={() => this.handleEditForm(null)}
                />
                <div className="ant-input-group-wrap">
                  <Button
                    className="btn-success"
                    style={{ borderRadius: '0 4px 4px 0' }}
                    onClick={() => this.handleModal('', record)}
                  >
                    Search
                  </Button>
                </div>
              </Group>
            </div>
          ),
      },
      {
        title: 'Item Name',
        dataIndex: 'itemName',
        key: 'itemName',
        width: 300,
      },
      {
        title: 'Qty',
        dataIndex: 'qty',
        key: 'qty',
        width: 100,
        align: 'right',
        render: (text, record) =>
          record.key !== qtyForm ? (
            /* eslint-disable */
            <div>
              {record.index !== 99999999999 && (
                <div onClick={() => this.handleEditForm(record.key)}>{currencyFormat(text)}</div>
              )}
            </div>
          ) : (
            /* eslint-enable */
            <NumericInput
              defaultValue={Number(text)}
              onChange={value => this.handleItemChange(record, value, 'qty')}
              onPressEnter={() => this.handleEditForm(null)}
            />
          ),
      },
      {
        title: 'Unit',
        dataIndex: 'unit',
        key: 'unit',
        width: 100,
      },
      {
        title: 'Note',
        dataIndex: 'note',
        key: 'note',
        render: (text, record) =>
          record.key !== qtyForm ? (
            /* eslint-disable */
            <div>
              {record.index !== 99999999999 && (
                <div onClick={() => this.handleEditForm(record.key)}>
                  {text === '' ? <span style={{ color: '#b8beca' }}>Click to edit</span> : text}
                </div>
              )}
            </div>
          ) : (
            /* eslint-enable */
            <Input
              defaultValue={text}
              onChange={value => this.handleItemChange(record, value.target.value, 'note')}
              onPressEnter={() => this.handleEditForm(null)}
            />
          ),
      },
    ]
    const dataTable = []
    const option = {
      bordered: true,
      pagination: false,
      size: 'small',
      hasData: true,
    }
    const { TextArea, Group } = Input
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
    }
    const optOutlet = []
    const optLocation = []
    const optSource = [
      {
        title: 'PR',
        value: 'PR',
      },
      {
        title: 'MR',
        value: 'MR',
      },
    ]
    /* MAPPING OUTLET */
    if (dataOutlet.length > 0) {
      dataOutlet.map(val =>
        optOutlet.push({
          title: val.outletName,
          value: val.outletCode,
        }),
      )
    }

    /* MAPPING OUTLET */
    if (dataLocation.length > 0) {
      dataLocation.map(val =>
        optLocation.push({
          title: val.locationName,
          value: val.locationCode,
        }),
      )
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
          qty: val.qty,
          unit: val.units,
          note: val.remark,
        }),
      )
    }

    return (
      <div>
        <Spin spinning={posPointOfSales.loadingProcess}>
          <Form>
            <div className="row">
              <div className="col-md-6">
                <Form.Item className="ant-form-item-custom" {...formItemLayout} label="PR No">
                  <Input disabled value={prNo} />
                </Form.Item>
                <Form.Item className="ant-form-item-custom" {...formItemLayout} label="Outlet">
                  {getFieldDecorator('outlet', {
                    rules: [rules.outlet],
                    initialValue: header.outletCode,
                  })(<SelectScap disabled datas={optOutlet} />)}
                </Form.Item>
                <Form.Item className="ant-form-item-custom" {...formItemLayout} label="Location">
                  {getFieldDecorator('location', {
                    rules: [rules.location],
                    initialValue: header.locaCode,
                  })(<SelectScap disabled datas={optLocation} />)}
                </Form.Item>
                <Form.Item className="ant-form-item-custom" {...formItemLayout} label="Request By">
                  {getFieldDecorator('requestBy', {
                    rules: [rules.requestBy],
                    initialValue: header.requestby,
                  })(
                    <Input
                      style={{ width: 240 }}
                      onChange={value => this.setState({ requestBy: value.target.value })}
                    />,
                  )}
                </Form.Item>
              </div>
              <div className="col-md-6">
                <Form.Item className="ant-form-item-custom" label="Date" {...formItemLayout}>
                  {getFieldDecorator('prDate', {
                    rules: [rules.prDate],
                    initialValue: moment(prDate, dateFormat.formatDateID),
                  })(
                    <DatePicker
                      allowClear={false}
                      disabledDate={this.disabledStartDate}
                      format={dateFormat.formatDateID}
                      onChange={(date, dateString) =>
                        this.handleDatePickerChange(date, dateString, 'prDate')
                      }
                      onOpenChange={this.handleStartOpenChange}
                    />,
                  )}
                </Form.Item>
                <Form.Item
                  className="ant-form-item-custom"
                  label="Delivery Date"
                  {...formItemLayout}
                >
                  {getFieldDecorator('delivDate', {
                    rules: [rules.delivDate],
                    initialValue: moment(delivDate, dateFormat.formatDateID),
                  })(
                    <DatePicker
                      allowClear={false}
                      disabledDate={this.disabledEndDate}
                      format={dateFormat.formatDateID}
                      onChange={(date, dateString) =>
                        this.handleDatePickerChange(date, dateString, 'delivDate')
                      }
                      disabled={endDisable}
                    />,
                  )}
                </Form.Item>
                <Form.Item className="ant-form-item-custom" {...formItemLayout} label="Note">
                  <TextArea
                    autosize={{ minRows: 4, maxRows: 6 }}
                    defaultValue={header.prNote}
                    onChange={value => this.setState({ note: value.target.value })}
                  />
                </Form.Item>
                <Form.Item className="ant-form-item-custom" {...formItemLayout} label="P/R Source">
                  {getFieldDecorator('source', {
                    rules: [rules.source],
                    initialValue: prSource,
                  })(
                    <SelectScap
                      datas={optSource}
                      onChange={value => this.setState({ prSource: value })}
                    />,
                  )}
                </Form.Item>
              </div>
            </div>
          </Form>
          <div>
            <Table
              {...option}
              className="mt-4"
              columns={columns}
              dataSource={dataTable}
              loading={prLoading}
              scroll={{ y: 500 }}
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
          {modalItems.visible === true && prSource === 'PR' && (
            <ModalPriceQuoteComponent
              visible={modalItems.visible}
              onOk={val => this.handleOk(val)}
              onCancel={() => this.handleCancel()}
              title={modalTitle}
              valueDefault={modalItems.valueDefault}
              indexEdit={modalItems.indexEdit}
              lastKey={items.length}
              moduleSet={moduleSet}
              prSource={prSource}
              marketCode={marketCode}
            />
          )}
          {modalItems.visible === true && prSource === 'MR' && (
            <ModalMRComponent
              visible={modalItems.visible}
              onOk={val => this.handleOk(val)}
              onCancel={() => this.handleCancel()}
              title={modalTitle}
              valueDefault={modalItems.valueDefault}
              indexEdit={modalItems.indexEdit}
              lastKey={items.length}
              moduleSet={moduleSet}
              prSource={prSource}
              marketCode={marketCode}
            />
          )}
        </Spin>
      </div>
    )
  }
}

export default Form.create({ name: 'form_edit' })(EditContent)
