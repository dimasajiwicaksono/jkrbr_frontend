import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import * as moment from 'moment'
import { Form, Button, DatePicker } from 'antd'
import { dateFormat } from '../../../utils/helper'

const mapStateToProps = ({ setInvOpeningCOA, user }) => ({
  setInvOpeningCOA,
  dateOpening: user.config.dateOpening,
})

@withRouter
@connect(mapStateToProps)
class ToolContent extends Component {
  constructor(props) {
    super(props)
    const { dateOpening } = this.props
    this.state = {
      asOf: dateOpening,
    }
  }

  handleSearch() {
    const { dispatch } = this.props
    const { asOf } = this.state
    dispatch({
      type: 'setInvOpeningCOA/GET_DATA_INV_OPENING_COA_LIST',
      payload: {
        refDate: asOf,
      },
    })
  }

  render() {
    const { asOf } = this.state
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    }

    return (
      <div>
        <div className="toolbar">
          <Form>
            <div className="row">
              <div className="col-md-8">
                <Form.Item className="ant-form-item-custom" {...formItemLayout} label="As Of">
                  <DatePicker
                    allowClear={false}
                    disabled
                    value={asOf !== '' ? moment(asOf, dateFormat.formatDateID) : null}
                    format={dateFormat.formatDateID}
                    onChange={(fullDate, dateString) => this.setState({ asOf: dateString })}
                    className="mr-4"
                  />
                  <Button className="btn-success" onClick={() => this.handleSearch()}>
                    Load Accounts
                  </Button>
                </Form.Item>
              </div>
            </div>
          </Form>
        </div>
      </div>
    )
  }
}

export default ToolContent
