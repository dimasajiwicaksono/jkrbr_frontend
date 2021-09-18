import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import * as moment from 'moment'
import { Form, Input, Button, Table, Icon, DatePicker, Row, Col, notification, Spin } from 'antd'
import ModalComponentItems from './modalListItem'
import ModalItem from './modalItem'
import {
  getUnique,
  datePeriod,
  dateFormat,
  currencyFormat,
  notifConfig,
} from '../../../utils/helper'
import SelectScap from '../../../components/CleanUIComponents/Scap/SelectScap'

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
class AddContent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      refDate: datePeriod.todayID,
      brandCode: '',
      outletCode: '',
      locationCode: '',
      remark: '',
      files: '',
      sheet: '',
      // amount: 0,
      item: {
        code: '',
        name: '',
      },
      items: [],
      modalItems: {
        valueDefault: '',
        record: '',
        visible: false,
      },
      modalItem: {
        visible: false,
        valueDefault: '',
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
        sheet: {
          required: true,
          message: 'Please input the Sheet.',
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
    const { dispatch, form, user, setPeriode, action } = this.props
    const { refDate, items, locationCode, remark } = this.state
    e.preventDefault()
    form.validateFields(err => {
      if (err === null) {
        const list = []
        items
          .filter(x => x.itemCode !== '')
          .map(val =>
            list.push({
              itemNo: val.itemNo,
              itemCode: val.itemCode,
              itemName: val.itemName,
              qty: Number(val.qty),
              uomStock: val.uomStock,
              unitPrice: Number(val.unitPrice),
              amount: Number(val.amount),
            }),
          )
        const promise = new Promise(resolve => {
          dispatch(
            {
              type: 'setInvOpeningBalance/GET_DATA_INV_OPENING_BLC_SAVE',
              payload: {
                refDate,
                locaCode: locationCode,
                userEntry: user.username,
                timeEntry: datePeriod.todayID,
                remark,
                details: list,
              },
            },
            setTimeout(() => {
              resolve(
                action('setInvOpeningBalanceImportData', []),
                dispatch({
                  type: 'setInvOpeningBalance/GET_DATA_CONVERT_ITEMS_LIST',
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

  disabledStartDate = current => current && current < moment().startOf('month')

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

  handleReloadOutlet = () => {
    const { dispatch, moduleSet } = this.props
    const { brandCode } = this.state
    dispatch({
      type: 'mstOutlet/GET_DATA_OUTLET_OPTION',
      payload: {
        brandCode,
        moduleSet,
      },
    })
  }

  handleReloadLocation = () => {
    const { dispatch, moduleSet } = this.props
    const { outletCode } = this.state
    dispatch({
      type: 'mstLocation/GET_DATA_LOCATION_OPTION',
      payload: {
        outletCode,
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
          message: 'Failed: Items',
          description: 'Item not found.',
          ...notifConfig,
        })
      }
    }
  }

  handelSelectItem(evt, e) {
    const { dataItem } = this.props
    const { value } = e.target
    if (evt === 'Enter' || evt === 'Blur') {
      if (dataItem.length > 0) {
        const filterData = dataItem.filter(val => val.itemCode.indexOf(value) === 0)
        if (filterData.length === 1) {
          const itemRes = {
            code: filterData[0].itemCode,
            name: filterData[0].itemName,
          }
          this.setState({
            item: itemRes,
          })
        } else {
          this.handleModalItem(value)
        }
      } else {
        notification.error({
          message: 'Failed: Items',
          description: 'Item not found.',
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

  handleOkItem(e) {
    if (e.code !== '') {
      this.setState({
        modalItem: {
          visible: false,
        },
        item: {
          code: e.code,
          name: e.name,
        },
      })
    }
    this.setState({
      modalItem: {
        visible: false,
      },
    })
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

  handleModalItem(value) {
    this.setState({
      modalItem: {
        visible: true,
        valueDefault: value,
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
      modalItem: {
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

  handleBrandChange(param) {
    const { dispatch, moduleSet } = this.props
    const { brandCode } = this.state
    if (param !== brandCode) {
      const promise = new Promise(resolve => {
        this.setState({
          brandCode: '',
          outletCode: '',
        })
        dispatch(
          {
            type: 'mstOutlet/GET_DATA_OUTLET_OPTION',
            payload: {
              brandCode: !param ? '' : param,
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
          brandCode: !param ? '' : param,
        })
      })
    }
  }

  handleOutletChange(param) {
    const { dispatch, moduleSet } = this.props
    const { outletCode } = this.state
    if (param !== outletCode) {
      const promise = new Promise(resolve => {
        this.setState({
          outletCode: '',
          locationCode: '',
        })
        dispatch(
          {
            type: 'mstLocation/GET_DATA_LOCATION_OPTION',
            payload: {
              outletCode: !param ? '' : param,
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
          outletCode: !param ? '' : param,
        })
      })
    }
  }

  handleLocationChange(param) {
    const { dispatch, moduleSet } = this.props
    dispatch({
      type: 'mstItems/GET_DATA_ITEMS_LOCATION_LIST',
      payload: {
        locaCode: !param ? '' : param,
        moduleSet,
      },
    })
    this.setState({
      locationCode: !param ? '' : param,
    })
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
    const {
      form,
      setInvOpeningBalance,
      mstBrand,
      mstOutlet,
      mstLocation,
      moduleSet,
      dataBrand,
      dataOutlet,
      dataLocation,
    } = this.props
    const {
      rules,
      modalItems,
      items,
      refDate,
      brandCode,
      item,
      modalItem,
      locationCode,
      outletCode,
    } = this.state
    const { getFieldDecorator } = form
    const { TextArea } = Input
    const pagination = { pageSize: 50 }
    const optBrand = []
    const optOutlet = []
    const optLocation = []
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
          align: 'right',
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

    if (dataBrand.length > 0) {
      dataBrand.map(val =>
        optBrand.push({
          value: val.brandCode,
          title: val.brandName,
        }),
      )
    }

    if (dataOutlet.length > 0) {
      dataOutlet.map(val =>
        optOutlet.push({
          value: val.outletCode,
          title: val.outletName,
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
                        className="ml-4"
                        type="default"
                        icon="reload"
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
                  {mstOutlet.loadingOption && (
                    <div>
                      <Icon type="loading" /> Please Wait
                    </div>
                  )}
                  {brandCode !== '' && !mstOutlet.loadingOption && optOutlet.length < 1 && (
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
                  {brandCode === '' && !mstOutlet.loadingOption && (
                    <SelectScap datas={optOutlet} disabled />
                  )}
                  {brandCode !== '' &&
                    !mstOutlet.loadingOption &&
                    optOutlet.length >= 1 &&
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
                <Form.Item className="ant-form-item-custom" {...formItemLayout} label="Location">
                  {mstLocation.loadingOption && (
                    <div>
                      <Icon type="loading" /> Please Wait
                    </div>
                  )}
                  {outletCode !== '' &&
                    outletCode !== undefined &&
                    !mstLocation.loadingOption &&
                    optLocation.length < 1 && (
                      <div>
                        No data.
                        <Button
                          type="default"
                          icon="reload"
                          className="ml-4"
                          onClick={this.handleReloadLocation}
                        >
                          Reload
                        </Button>
                      </div>
                    )}
                  {(outletCode === '' || outletCode === undefined) &&
                    !mstLocation.loadingOption && <SelectScap datas={optLocation} disabled />}
                  {outletCode !== '' &&
                    outletCode !== undefined &&
                    !mstLocation.loadingOption &&
                    optLocation.length >= 1 &&
                    getFieldDecorator('location', {
                      rules: [rules.location],
                      initialValue: locationCode,
                    })(
                      <SelectScap
                        datas={optLocation}
                        onChange={value => this.handleLocationChange(value)}
                      />,
                    )}
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
                  <TextArea onChange={e => this.setState({ remark: e.target.value })} />
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
              item={item}
              locationCode={locationCode}
            />
          )}
          {modalItem.visible === true && (
            <ModalItem
              visible={modalItem.visible}
              onOk={val => this.handleOkItem(val)}
              onCancel={() => this.handleCancel()}
              valueDefault={modalItem.valueDefault}
              locaCode={locationCode}
              title="Select Item"
              moduleSet={moduleSet}
            />
          )}
        </Spin>
      </div>
    )
  }
}

export default Form.create({ name: 'form_add' })(AddContent)
