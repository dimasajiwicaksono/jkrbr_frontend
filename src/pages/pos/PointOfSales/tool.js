import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter /* Link */ } from 'react-router-dom'
import * as moment from 'moment'
import { Form, Input, Button, DatePicker, Popconfirm, notification } from 'antd'
import { handleSearchLabel, handleAccess, dateFormat, notifConfig } from '../../../utils/helper'
import SelectScap from '../../../components/CleanUIComponents/Scap/SelectScap'
import ModalOutlet from './modalOutlet'

const mapStateToProps = ({ posPointOfSales, mstOutlet, settings }) => ({
  posPointOfSales,
  mstOutlet,
  dataOutlet: posPointOfSales.fbOutletOption,
  dataHeader: posPointOfSales.posPointOfSalesDetail.header,
  setPeriode: settings.setPeriode,
})

@withRouter
@connect(mapStateToProps)
class ToolContent extends Component {
  constructor(props) {
    super(props)
    const { setPeriode } = this.props
    this.state = {
      expand: false,
      billNo: '',
      sales: 'Y',
      outletCode: '',
      fDate: setPeriode.currentStartMonth,
      tDate: setPeriode.currentEndMonth,
      isModalOutlet: false,
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      fDate: nextProps.setPeriode.currentStartMonth,
      tDate: nextProps.setPeriode.currentEndMonth,
    })
  }

  handleClear = () => {
    const { fDate, tDate, billNo, sales } = this.state
    this.setState({
      billNo,
      outletCode: '',
      fDate,
      tDate,
      sales,
    })
  }

  handleDelete = () => {
    const { dispatch, posPointOfSales } = this.props
    const payload = {
      prNo: posPointOfSales.posPointOfSalesSelectedRow,
    }
    const promise = new Promise(resolve => {
      dispatch({
        type: 'posPointOfSales/GET_DATA_POS_DELETE',
        payload,
      })
      setTimeout(() => {
        resolve(true)
      }, 300)
    })
    promise.then(() => this.handleRefresh())
  }

  handlePdf() {
    const { dispatch } = this.props
    dispatch({
      type: 'posPointOfSales/GET_DATA_POS_PDF',
    })
  }

  handleContent(payload) {
    const { posPointOfSales, action, dataHeader } = this.props
    if (posPointOfSales.contentStatus !== payload) {
      if (
        payload === 'isEdit' &&
        dataHeader.prStatus !== undefined &&
        (dataHeader.prStatus === '2' || dataHeader.prStatus === '3')
      ) {
        notification.error({
          message: 'Failed',
          description: 'This data was released.',
          ...notifConfig,
        })
      } else {
        action('contentStatus', payload)
      }
    }
  }

  handleRefresh() {
    const { dispatch, action } = this.props
    this.setState({
      billNo: '',
      outletCode: '',
      sales: 'Y',
    })
    dispatch({
      type: 'posPointOfSales/GET_DATA_POS_LIST',
      payload: {},
    })
    dispatch({
      type: 'posPointOfSales/HANDLE_STATE',
      field: 'posPointOfSalesDetail',
      value: {
        loading: false,
      },
    })
    action('posPointOfSalesDetail', { loading: false })
    action('posPointOfSalesSelectedRow', '')
  }

  handleEditDisable() {
    const { posPointOfSales /* dataHeader */ } = this.props
    return !(
      posPointOfSales.posPointOfSalesSelectedRow !== '' &&
      posPointOfSales.posPointOfSalesSelectedRow !== undefined &&
      posPointOfSales.loadingDetail === false
    )
  }

  handleToggle() {
    const { expand } = this.state
    this.setState({ expand: !expand })
  }

  handleSearch() {
    const { dispatch, action } = this.props
    const { billNo, outletCode, fDate, tDate, sales } = this.state
    const payload = {
      // prNo,
      outletCode,
      fDate,
      tDate,
      billNo,
      sales,
    }
    dispatch({
      type: 'posPointOfSales/GET_DATA_POS_LIST',
      payload,
    })
    dispatch({
      type: 'posPointOfSales/HANDLE_STATE',
      field: 'posPointOfSalesDetail',
      value: {
        loading: false,
      },
    })
    action('posPointOfSalesSelectedRow', '')
  }

  renderTools() {
    const { dataHeader } = this.props
    if (dataHeader && dataHeader.prStatus === '1') {
      return (
        <Popconfirm title="Sure to delete?" onConfirm={this.handleDelete}>
          <Button className="mr-4" type="danger" icon="delete">
            Delete
          </Button>
        </Popconfirm>
      )
    }
    return (
      <Button className="mr-4" type="danger" icon="delete" disabled>
        Delete
      </Button>
    )
  }

  render() {
    const { dataOutlet, access } = this.props
    const { expand, billNo, outletCode, fDate, tDate, sales, isModalOutlet } = this.state
    const { formatDateID } = dateFormat
    const optOutlet = []
    const optStatus = [
      {
        value: 'Y',
        title: 'Yes',
      },
      {
        value: 'N',
        title: 'No',
      },
    ]
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

    if (dataOutlet.length > 0) {
      dataOutlet.map(val =>
        optOutlet.push({
          title: val.outletName,
          value: val.outletCode,
        }),
      )
    }

    return (
      <div>
        <div className="toolbar">
          {handleAccess(access, 'isNew') && (
            // <Link to={{ pathname: '/kasir' }}>
            <Button
              className="mr-4"
              type="primary"
              icon="plus-circle"
              onClick={() => this.setState({ isModalOutlet: true })}
            >
              New
            </Button>
            // </Link>
          )}
          {handleAccess(access, 'isEdit') && (
            <Button
              className="mr-4"
              type="primary"
              icon="edit"
              // disabled={this.handleEditDisable()}
              disabled
              onClick={() => this.handleContent('isEdit')}
            >
              Update
            </Button>
          )}
          {handleAccess(access, 'isDelete') && this.renderTools()}
          <Button
            className="mr-4"
            type="primary"
            icon="reload"
            onClick={() => this.handleRefresh()}
          >
            Refresh
          </Button>
          <Button className="mr-4" type="primary" icon="search" onClick={() => this.handleToggle()}>
            {handleSearchLabel(expand)}
          </Button>
          {handleAccess(access, 'isDownload') && (
            <Button
              className="mr-4"
              type="primary"
              icon="file-pdf"
              // disabled={this.handleEditDisable()}
              disabled
              onClick={() => this.handleContent('isPdf')}
            >
              PDF
            </Button>
          )}
        </div>
        <div style={{ display: expand ? 'block' : 'none' }}>
          <Form>
            <div className="row">
              <div className="col-md-6">
                <Form.Item className="ant-form-item-custom" {...formItemLayout} label="Outlet">
                  <SelectScap
                    datas={optOutlet}
                    value={outletCode}
                    onChange={value => this.setState({ outletCode: value })}
                  />
                </Form.Item>
                <Form.Item
                  className="ant-form-item-custom"
                  label="First Period"
                  {...formItemLayout}
                >
                  <DatePicker
                    allowClear={false}
                    format={formatDateID}
                    value={moment(fDate, formatDateID)}
                    onChange={(date, dateString) => this.setState({ fDate: dateString })}
                  />
                </Form.Item>
                <Form.Item className="ant-form-item-custom" label="Last Period" {...formItemLayout}>
                  <DatePicker
                    allowClear={false}
                    format={formatDateID}
                    value={tDate !== '' ? moment(tDate, formatDateID) : null}
                    onChange={(date, dateString) => this.setState({ tDate: dateString })}
                  />
                </Form.Item>
              </div>
              <div className="col-md-6">
                <Form.Item className="ant-form-item-custom" {...formItemLayout} label="Bill No">
                  <Input
                    value={billNo}
                    onChange={value => this.setState({ billNo: value.target.value })}
                  />
                </Form.Item>
                <Form.Item className="ant-form-item-custom" {...formItemLayout} label="Sales">
                  <SelectScap
                    datas={optStatus}
                    value={sales}
                    onChange={value => this.setState({ sales: value })}
                  />
                </Form.Item>
                <div>
                  <Button className="mr-4 btn-success" onClick={() => this.handleSearch()}>
                    Search
                  </Button>
                  <Button className="mr-4" type="default" onClick={this.handleClear}>
                    Clear
                  </Button>
                </div>
              </div>
            </div>
          </Form>
        </div>
        {isModalOutlet && (
          <ModalOutlet
            visible={isModalOutlet}
            onCancel={() => this.setState({ isModalOutlet: false })}
          />
        )}
      </div>
    )
  }
}

export default ToolContent
