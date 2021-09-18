import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Button } from 'antd'
// import { handleSearchLabel, /* handleAccess */} from '../../../utils/helper'

const mapStateToProps = ({ toolVoucher }) => ({
  toolVoucher,
})

@withRouter
@connect(mapStateToProps)
class ToolContent extends Component {
  state = {
    expand: false,
  }

  handleContent(payload) {
    const { toolVoucher, action } = this.props
    if (toolVoucher.contentStatus !== payload) {
      action('contentStatus', payload)
    }
  }

  handleRefresh() {
    const { action, dispatch } = this.props
    const payload = {
      outletCode: '',
      settleCode: '',
      tenderName: '',
    }
    this.setState({
      ...payload,
    })
    dispatch({
      type: 'toolVoucher/GET_DATA_MENU_CATEGORY_LIST',
      payload,
    })
    action('toolVoucherSelectedRow', '')
    action('toolVoucherDetail', [])
  }

  handleEditDisable() {
    const { toolVoucher } = this.props
    if (
      toolVoucher.toolVoucherSelectedRow !== '' &&
      toolVoucher.toolVoucherSelectedRow !== undefined
    ) {
      return false
    }
    return true
  }

  handleToggle() {
    const { expand } = this.state
    this.setState({ expand: !expand })
  }

  render() {
    // const { access } = this.props
    // const { expand } = this.state

    // const formItemLayout = {
    //   labelCol: {
    //     xs: { span: 24 },
    //     sm: { span: 5 },
    //   },
    //   wrapperCol: {
    //     xs: { span: 24 },
    //     sm: { span: 12 },
    //   },
    // }

    return (
      <div>
        <div className="toolbar">
          {/* {handleAccess(access, 'isNew') && ( */}
          <Button
            className="mr-4"
            type="primary"
            icon="plus-circle"
            onClick={() => this.handleContent('isAdd')}
          >
            New
          </Button>
          {/* )} */}
          {/* {handleAccess(access, 'isEdit') && ( */}
          <Button
            className="mr-4"
            type="primary"
            icon="edit"
            disabled={this.handleEditDisable()}
            onClick={() => this.handleContent('isEdit')}
          >
            Update
          </Button>
          {/* )} */}
          <Button
            className="mr-4"
            type="primary"
            icon="reload"
            onClick={() => this.handleRefresh()}
          >
            Refresh
          </Button>
          {/* <Button className="mr-4" type="primary" icon="search" onClick={() => this.handleToggle()}>
            {handleSearchLabel(expand)}
          </Button> */}
        </div>
      </div>
    )
  }
}

export default ToolContent
