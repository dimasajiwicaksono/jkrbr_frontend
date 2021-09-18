import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { store as reduxStore } from 'index'
import * as moment from 'moment'
import {
  Form,
  DatePicker,
  Input,
  Button,
  Table,
  Popconfirm,
  Icon,
  Checkbox,
  notification,
  Spin,
} from 'antd'
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

const mapStateToProps = ({
  posPointOfSales,
  user,
  mstLocation,
  mstOutlet,
  mstBrand,
  mstItems,
}) => ({
  posPointOfSales,
  user,
  mstBrand,
  mstOutlet,
  mstLocation,
  mstItems,
  dataBrand: posPointOfSales.brandOption,
  dataOutlet: posPointOfSales.outletOption,
  dataLocation: posPointOfSales.locationOption,
  dataItems: posPointOfSales.itemsOption,
  dataMR: posPointOfSales.marketDetailOption,
})

@withRouter
@connect(mapStateToProps)
class AddContent extends Component {
  constructor(props) {
    super(props)
    const { user } = this.props
    this.state = {
      startDate: moment(datePeriod.todayID, dateFormat.formatDateID),
      qtyForm: null,
      modalItems: {
        valueDefault: '',
        indexEdit: '',
        visible: false,
      },
      modalTitle: '',
      brandCode: '',
      outletCode: '',
      prDate: moment(datePeriod.todayID, dateFormat.formatDateID),
      delivDate: moment(datePeriod.todayID, dateFormat.formatDateID),
      requestBy: user.username,
      prSource: 'PR',
      locaCode: '',
      departID: '',
      note: '',
      marketCode: '',
      entryName: user.username,
      entryDate: moment().format(dateFormat.formatDateTimeID),
      deptHead: '',
      items: [
        {
          index: 99999999999,
          itemCode: '',
          itemName: '',
          qty: 0,
          units: '',
          remark: '',
        },
      ],
      rules: {
        brand: {
          required: true,
          message: 'Please select Outlet.',
        },
        outlet: {
          required: true,
          message: 'Please select Outlet.',
        },
        prDate: {
          required: true,
          message: 'Please select Date.',
        },
        delivDate: {
          required: true,
          message: 'Please select Date.',
        },
        requestBy: {
          required: true,
          message: 'Please input Request By.',
        },
        location: {
          required: true,
          message: 'Please select location.',
        },
        source: {
          required: true,
          message: 'Please select Source.',
        },
      },
    }
  }

  disabledStartDate = current => current && current < moment().startOf('day')

  disabledEndDate = endDate => {
    const { startDate } = this.state
    if (!startDate) {
      return moment().endOf('day')
    }
    return endDate.valueOf() < startDate.valueOf()
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

  handleReloadBrand = () => {
    const { dispatch, moduleSet } = this.props
    dispatch({
      type: 'mstBrand/GET_DATA_BRAND_OPTION',
      payload: {
        moduleSet,
      },
    })
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

  handleSave() {
    const { dispatch } = this.props
    const {
      outletCode,
      prDate,
      delivDate,
      requestBy,
      entryName,
      prSource,
      locaCode,
      departID,
      note,
      entryDate,
      deptHead,
      items,
    } = this.state
    const details = items.filter(x => x.itemCode !== '')
    const payload = {
      prDate,
      delivDate,
      outletCode,
      prSource,
      locaCode,
      departID,
      note,
      entryName,
      entryDate,
      requestBy,
      deptHead,
      details,
    }

    dispatch({
      type: 'posPointOfSales/GET_DATA_POS_SAVE',
      payload,
    })
  }

  handleDatePickerChange(date, dateString, field) {
    const { delivDate } = this.state
    this.handleChange(field, dateString)
    if (field === 'prDate') {
      this.setState({ startDate: date })
      if (moment(date).isAfter(delivDate)) {
        this.setState({
          delivDate: dateString,
        })
      }
    }
    if (field === 'prDate' && dateString === '') {
      this.setState({
        startDate: null,
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

  handleBrandChange(value) {
    const { dispatch, moduleSet } = this.props
    const { brandCode } = this.state

    if (value !== brandCode) {
      const promise = new Promise(resolve => {
        this.setState({
          brandCode: '',
          outletCode: '',
          locaCode: '',
        })
        dispatch(
          {
            type: 'mstOutlet/GET_DATA_OUTLET_OPTION',
            payload: {
              brandCode: value,
              outletCode: '',
              outletName: '',
              moduleSet,
            },
          },
          setTimeout(() => {
            resolve(true)
          }, 300),
        )
      })
      promise.then(() => {
        this.setState({
          brandCode: value,
        })
      })
    }
  }

  handleOutletChange(value) {
    const { dispatch, moduleSet } = this.props
    const { outletCode } = this.state

    if (value !== outletCode) {
      const promise = new Promise(resolve => {
        this.setState({
          outletCode: '',
          locaCode: '',
        })
        dispatch(
          {
            type: 'mstLocation/GET_DATA_LOCATION_OPTION',
            payload: {
              locationCode: '',
              locationName: '',
              outletCode: value,
              outletName: '',
              moduleSet,
            },
          },
          setTimeout(() => {
            resolve(true)
          }, 300),
        )
      })
      promise.then(() => {
        this.setState({
          outletCode: value,
        })
      })
    }
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
          salesPrice: e.salesPrice,
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

  handleContent(payload) {
    const { posPointOfSales, dispatch } = this.props
    if (posPointOfSales.contentStatus !== payload) {
      dispatch({
        type: 'posPointOfSales/HANDLE_CONTENT',
        payload,
      })
    }
  }

  handleChange(field, value) {
    this.setState({
      [field]: value,
    })
  }

  handleLocationChange(value) {
    const { dataLocation, moduleSet } = this.props
    const locaSelected = dataLocation.filter(x => x.locationCode === value)
    this.setState({
      locaCode: value,
      marketCode: locaSelected[0].marketCode,
    })
    reduxStore.dispatch({
      type: 'prMarketList/GET_DATA_MARKET_LIST_DETAIL_OPTION',
      payload: {
        marketCode: locaSelected[0].marketCode,
        moduleSet,
      },
    })
  }

  handleSourceChange(value) {
    this.setState({
      prSource: value,
    })
  }

  handleDeleteItem(e) {
    const { items } = this.state
    this.setState({
      items: items.filter((val, key) => key !== e.key),
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

  render() {
    const {
      mstBrand,
      mstOutlet,
      mstItems,
      dataLocation,
      form,
      dataOutlet,
      dataBrand,
      dataItems,
      moduleSet,
      posPointOfSales,
    } = this.props
    const {
      items,
      qtyForm,
      prDate,
      rules,
      modalItems,
      modalTitle,
      brandCode,
      outletCode,
      prSource,
      marketCode,
    } = this.state
    const { getFieldDecorator } = form
    const optOutlet = []
    const optBrand = []
    const optLocation = []
    const dataTable = []
    const { Group } = Input
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
    const option = {
      bordered: true,
      pagination: false,
      size: 'small',
      hasData: true,
    }
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
              {prSource === 'PR' && mstItems.loadingOption && (
                <div>
                  <Icon type="loading" /> Please wait
                </div>
              )}
              {prSource === 'PR' && mstItems.loadingOption === false && dataItems.length < 1 && (
                <div>
                  No data.
                  <Button
                    type="default"
                    icon="reload"
                    className="ml-4"
                    onClick={this.handleReloadItems}
                  >
                    Reload
                  </Button>
                </div>
              )}
              {mstItems.loadingOption === false && dataItems.length >= 1 && (
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
              )}
            </div>
          ),
      },
      {
        title: 'Item Name',
        dataIndex: 'itemName',
        key: 'itemName',
        width: 150,
      },
      {
        title: 'Price',
        dataIndex: 'salesPrice',
        key: 'salesPrice',
        width: 150,
        sorter: (a, b) => a.salesPrice.localeCompare(b.salesPrice),
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
              defaultValue={text}
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
    /* MAPPING SELECT */
    if (dataBrand.length > 0) {
      dataBrand.map(val =>
        optBrand.push({
          title: val.brandName,
          value: val.brandCode,
        }),
      )
    }

    if (dataOutlet.length > 0) {
      dataOutlet.map(val =>
        optOutlet.push({
          title: val.outletName,
          value: val.outletCode,
        }),
      )
    }

    if (dataLocation.length > 0) {
      dataLocation.map(val =>
        optLocation.push({
          value: val.locationCode,
          title: val.locationName,
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
          salesPrice: val.salesPrice,
        }),
      )
    }

    return (
      <div>
        <Spin spinning={posPointOfSales.loadingProcess}>
          <Form onSubmit={e => e.preventDefault()}>
            <div className="row">
              <div className="col-md-6">
                <Form.Item className="ant-form-item-custom" {...formItemLayout} label="Brand">
                  {mstBrand.loadingOption && (
                    <div>
                      <Icon type="loading" /> Please wait
                    </div>
                  )}
                  {mstBrand.loadingOption === false && dataBrand.length < 1 && (
                    <div>
                      No data.
                      <Button
                        type="default"
                        icon="reload"
                        className="ml-4"
                        onClick={this.handleReloadBrand}
                      >
                        Reload
                      </Button>
                    </div>
                  )}
                  {mstBrand.loadingOption === false &&
                    dataBrand.length >= 1 &&
                    getFieldDecorator('brand', {
                      rules: [rules.brand],
                      initialValue: brandCode,
                    })(
                      <SelectScap
                        datas={optBrand}
                        onChange={value => this.handleBrandChange(value)}
                      />,
                    )}
                </Form.Item>
                <Form.Item className="ant-form-item-custom" {...formItemLayout} label="Outlet">
                  {brandCode === '' && <SelectScap datas={optOutlet} disabled />}
                  {brandCode !== '' && mstOutlet.loadingOption && (
                    <div>
                      <Icon type="loading" /> Please wait
                    </div>
                  )}
                  {brandCode !== '' && mstOutlet.loadingOption === false && dataOutlet.length < 1 && (
                    <div>
                      No data.
                      <Button
                        type="default"
                        icon="reload"
                        className="ml-4"
                        onClick={this.handleReloadOutlet}
                      >
                        Reload
                      </Button>
                    </div>
                  )}
                  {brandCode !== '' &&
                    mstOutlet.loadingOption === false &&
                    dataOutlet.length >= 1 &&
                    getFieldDecorator('outlet', {
                      rules: [rules.outlet],
                      initialValue: outletCode,
                    })(
                      <SelectScap
                        datas={optOutlet}
                        onChange={value => this.handleOutletChange(value)}
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
                <Form.Item className="ant-form-item-custom" label="Sales" {...formItemLayout}>
                  <Checkbox />
                </Form.Item>
              </div>
            </div>
          </Form>
          <div>
            <Table
              {...option}
              columns={columns}
              className="mt-4"
              dataSource={dataTable}
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

export default Form.create({ name: 'form_add' })(AddContent)
