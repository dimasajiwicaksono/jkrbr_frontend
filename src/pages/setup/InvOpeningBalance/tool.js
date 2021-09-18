import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import * as moment from 'moment'
import { Form, Input, Button, Icon, Popconfirm, DatePicker } from 'antd'
import { dateFormat, handleSearchLabel, handleAccess } from '../../../utils/helper'
import SelectScap from '../../../components/CleanUIComponents/Scap/SelectScap'
import ExcelFormat from './excel'

const mapStateToProps = ({ setInvOpeningBalance, settings }) => ({
  setInvOpeningBalance,
  detailOpeningBalance: setInvOpeningBalance.setInvOpeningBalanceDetail,
  dataHeader: setInvOpeningBalance.setInvOpeningBalanceDetail.header,
  dataLocation: setInvOpeningBalance.locationOption,
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
      refNo: '',
      fdate: setPeriode.currentStartMonth,
      tdate: setPeriode.currentEndMonth,
      locaCode: '',
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      fdate: nextProps.setPeriode.currentStartMonth,
      tdate: nextProps.setPeriode.currentEndMonth,
    })
  }

  handleClear = () => {
    const { setPeriode } = this.props
    this.setState({
      refNo: '',
      fdate: setPeriode.currentStartMonth,
      tdate: setPeriode.currentEndMonth,
      locaCode: '',
    })
  }

  handleDatePickerChange(date, dateString, field) {
    this.setState({ [field]: dateString })
  }

  handleSearch() {
    const { action, dispatch } = this.props
    const { refNo, fdate, tdate, locaCode } = this.state
    dispatch({
      type: 'setInvOpeningBalance/GET_DATA_INV_OPENING_BLC_LIST',
      payload: {
        refNo,
        fdate,
        tdate,
        locaCode,
      },
    })
    action('loadingDetail', false)
    action('setInvOpeningBalanceSelectedRow', '')
    action('setInvOpeningBalanceDetail', [])
  }

  handleRefresh() {
    const { dispatch, action, setPeriode } = this.props
    const payload = {
      refNo: '',
      fdate: setPeriode.currentStartMonth,
      tdate: setPeriode.currentEndMonth,
      locaCode: '',
    }
    this.setState({
      refNo: '',
      fdate: setPeriode.currentStartMonth,
      tdate: setPeriode.currentEndMonth,
      locaCode: '',
    })
    dispatch({
      type: 'setInvOpeningBalance/GET_DATA_INV_OPENING_BLC_LIST',
      payload,
    })
    action('loadingDetail', false)
    action('setInvOpeningBalanceSelectedRow', '')
    action('setInvOpeningBalanceDetail', [])
  }

  handleEditDisable() {
    const { setInvOpeningBalance, dataHeader } = this.props
    if (
      setInvOpeningBalance.setInvOpeningBalanceSelectedRow !== '' &&
      setInvOpeningBalance.setInvOpeningBalanceSelectedRow !== undefined &&
      setInvOpeningBalance.loadingDetail === false &&
      dataHeader !== undefined &&
      dataHeader.oBStatus === '1'
    ) {
      return false
    }
    return true
  }

  handlePostingDisable() {
    const { setInvOpeningBalance, dataHeader } = this.props
    if (
      setInvOpeningBalance.setInvOpeningBalanceSelectedRow !== '' &&
      setInvOpeningBalance.setInvOpeningBalanceSelectedRow !== undefined &&
      setInvOpeningBalance.loadingDetail === false &&
      dataHeader !== undefined &&
      dataHeader.oBStatus === '1'
    ) {
      return false
    }
    return true
  }

  handleUnpostingDisable() {
    const { setInvOpeningBalance, dataHeader } = this.props
    if (
      setInvOpeningBalance.setInvOpeningBalanceSelectedRow !== '' &&
      setInvOpeningBalance.setInvOpeningBalanceSelectedRow !== undefined &&
      setInvOpeningBalance.loadingDetail === false &&
      dataHeader !== undefined &&
      dataHeader.oBStatus === '2'
    ) {
      return false
    }
    return true
  }

  handleExcelDisable() {
    const { setInvOpeningBalance } = this.props
    return !(
      setInvOpeningBalance.setInvOpeningBalanceSelectedRow !== '' &&
      setInvOpeningBalance.setInvOpeningBalanceSelectedRow !== undefined &&
      setInvOpeningBalance.loadingDetail === false
    )
  }

  handleToggle() {
    const { expand } = this.state
    this.setState({ expand: !expand })
  }

  handleContent(payload) {
    const { setInvOpeningBalance, action } = this.props
    if (setInvOpeningBalance.contentStatus !== payload) {
      action('contentStatus', payload)
    }
  }

  handleDelete() {
    const { dispatch, setInvOpeningBalance } = this.props
    const payload = {
      refNo: setInvOpeningBalance.setInvOpeningBalanceSelectedRow,
    }
    const promise = new Promise(resolve => {
      let result = false
      dispatch(
        {
          type: 'setInvOpeningBalance/GET_DATA_INV_OPENING_BLC_DELETE',
          payload,
        },
        setTimeout(() => {
          result = true
          resolve(result)
        }, 300),
      )
    })
    promise.then(val => {
      if (val) {
        this.handleRefresh()
      }
    })
  }

  handleApprove() {
    const { dispatch, setInvOpeningBalance, setPeriode } = this.props
    const payload = {
      refNo: setInvOpeningBalance.setInvOpeningBalanceSelectedRow,
    }
    const promise = new Promise(resolve => {
      dispatch(
        {
          type: 'setInvOpeningBalance/GET_DATA_INV_OPENING_BLC_APPROVE',
          payload,
        },
        setTimeout(() => {
          resolve(
            dispatch({
              type: 'setInvOpeningBalance/GET_DATA_INV_OPENING_BLC_DETAIL',
              payload,
            }),
            dispatch({
              type: 'setInvOpeningBalance/GET_DATA_INV_OPENING_BLC_LIST',
              payload: {
                refNo: '',
                fdate: setPeriode.currentStartMonth,
                tdate: setPeriode.currentEndMonth,
              },
            }),
          )
        }, 300),
      )
    })
    promise.then(() => true)
  }

  handleUnapprove() {
    const { dispatch, setInvOpeningBalance, setPeriode } = this.props
    const payload = {
      refNo: setInvOpeningBalance.setInvOpeningBalanceSelectedRow,
    }
    const promise = new Promise(resolve => {
      dispatch(
        {
          type: 'setInvOpeningBalance/GET_DATA_INV_OPENING_BLC_UNAPPROVE',
          payload,
        },
        setTimeout(() => {
          resolve(
            dispatch({
              type: 'setInvOpeningBalance/GET_DATA_INV_OPENING_BLC_DETAIL',
              payload,
            }),
            dispatch({
              type: 'setInvOpeningBalance/GET_DATA_INV_OPENING_BLC_LIST',
              payload: {
                refNo: '',
                fdate: setPeriode.currentStartMonth,
                tdate: setPeriode.currentEndMonth,
              },
            }),
          )
        }, 300),
      )
    })
    promise.then(() => true)
  }

  render() {
    const { access, dataLocation, dataHeader } = this.props
    const { expand, refNo, fdate, tdate, locaCode } = this.state
    const optLocation = []
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
    }

    if (dataLocation.length > 0) {
      dataLocation.map(val =>
        optLocation.push({
          value: val.locationCode,
          title: val.locationName,
        }),
      )
    }

    return (
      <div>
        <div className="toolbar d-none d-sm-block">
          {handleAccess(access, 'isNew') && (
            <Button
              className="mr-4"
              type="primary"
              icon="plus-circle"
              onClick={() => this.handleContent('isAdd')}
            >
              New
            </Button>
          )}
          {handleAccess(access, 'isEdit') && (
            <Button
              className="mr-4"
              type="primary"
              icon="edit"
              disabled={this.handleEditDisable()}
              onClick={() => this.handleContent('isEdit')}
            >
              Update
            </Button>
          )}
          {handleAccess(access, 'isDelete') && !this.handleEditDisable() && (
            <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete()}>
              <Button className="mr-4" type="danger" icon="delete">
                Delete
              </Button>
            </Popconfirm>
          )}
          {handleAccess(access, 'isDelete') && this.handleEditDisable() && (
            <Button className="mr-4" type="danger" disabled icon="delete">
              Delete
            </Button>
          )}
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
          {handleAccess(access, 'isPosting') && (
            <Button
              className="mr-4"
              type="primary"
              icon="check"
              disabled={this.handlePostingDisable()}
              onClick={() => this.handleApprove()}
            >
              Approve
            </Button>
          )}
          {handleAccess(access, 'isUnPosting') && (
            <Button
              className="mr-4"
              type="primary"
              icon="clock-circle"
              disabled={this.handleUnpostingDisable()}
              onClick={() => this.handleUnapprove()}
            >
              UnApprove
            </Button>
          )}
          {dataHeader !== undefined ? <ExcelFormat disabled={this.handleExcelDisable()} /> : null}
        </div>
        <div className="toolbar d-block d-sm-none text-right">
          <Button className="mr-1" type="primary" onClick={() => this.handleContent('isAdd')}>
            <Icon type="plus-circle" />
          </Button>
          <Button
            className="mr-1"
            type="primary"
            disabled={this.handleEditDisable()}
            onClick={() => this.handleContent('isEdit')}
          >
            <Icon type="edit" />
          </Button>
          <Button className="mr-1" type="primary" onClick={() => this.handleRefresh()}>
            <Icon type="reload" />
          </Button>
          <Button className="mr-1" type="primary" onClick={() => this.handleToggle()}>
            <Icon type="search" />
          </Button>
          <Button className="mr-1" type="danger">
            <Icon type="delete" />
          </Button>
        </div>
        <div style={{ display: expand ? 'block' : 'none' }}>
          <Form>
            <div className="row">
              <div className="col-md-6">
                <Form.Item className="ant-form-item-custom" {...formItemLayout} label="Ref No">
                  <Input
                    value={refNo}
                    onChange={value => this.setState({ refNo: value.target.value })}
                  />
                </Form.Item>
                <Form.Item className="ant-form-item-custom" {...formItemLayout} label="Location">
                  <SelectScap
                    datas={optLocation}
                    value={locaCode}
                    onChange={value => this.setState({ locaCode: !value ? '' : value })}
                  />
                </Form.Item>
              </div>
              <div className="col-md-6">
                <Form.Item className="ant-form-item-custom" {...formItemLayout} label="Date From">
                  <DatePicker
                    allowClear={false}
                    value={fdate !== '' ? moment(fdate, dateFormat.formatDateID) : null}
                    format={dateFormat.formatDateID}
                    onChange={(fullDate, dateString) => this.setState({ fdate: dateString })}
                  />
                </Form.Item>
                <Form.Item className="ant-form-item-custom" {...formItemLayout} label="Date To">
                  <DatePicker
                    allowClear={false}
                    value={tdate !== '' ? moment(tdate, dateFormat.formatDateID) : null}
                    format={dateFormat.formatDateID}
                    onChange={(fullDate, dateString) => this.setState({ tdate: dateString })}
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
      </div>
    )
  }
}

export default ToolContent
