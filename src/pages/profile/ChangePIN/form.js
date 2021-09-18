import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Form, Input, Button, Spin, notification } from 'antd'
import styles from './style.module.scss'
import { notifConfig } from '../../../utils/helper'

const mapStateToProps = ({ user }) => ({ user })

@withRouter
@connect(mapStateToProps)
class FormContent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      newPIN: '',
      confPIN: '',
    }
  }

  handleSubmit = e => {
    const { dispatch, form } = this.props
    const { newPIN, confPIN } = this.state
    e.preventDefault()
    form.validateFields(err => {
      if (err === null) {
        if (confPIN !== newPIN) {
          notification.warning({
            message: 'Failed',
            description: 'Confirm PIN does not match New PIN',
            ...notifConfig,
          })
        } else {
          dispatch({
            type: 'user/USER_CHANGE_PIN',
            payload: {
              newPIN: window.btoa(newPIN),
              confPIN: window.btoa(confPIN),
            },
          })
        }
      }
    })
  }

  disabledButton() {
    const { newPIN, confPIN } = this.state
    if (newPIN === '' || confPIN === '') {
      return true
    }
    return false
  }

  render() {
    const { form, user } = this.props
    const { Password } = Input
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 10 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
    }

    return (
      <div>
        <div className="row">
          <div className="col-md-8">
            <div className={styles.form}>
              <Spin spinning={user.loadingChgPIN} delay={300}>
                <Form>
                  <Form.Item className="ant-form-item-custom" {...formItemLayout} label="New PIN">
                    {form.getFieldDecorator('newPIN', {
                      initialValue: '',
                      rules: [{ required: true, message: 'Please input New PIN' }],
                    })(
                      <Password
                        onChange={e => this.setState({ newPIN: e.target.value })}
                        size="default"
                      />,
                    )}
                  </Form.Item>
                  <Form.Item
                    className="ant-form-item-custom"
                    {...formItemLayout}
                    label="Confirm PIN"
                  >
                    {form.getFieldDecorator('confPIN', {
                      initialValue: '',
                      rules: [{ required: true, message: 'Please input Confirm PIN' }],
                    })(
                      <Password
                        onChange={e => this.setState({ confPIN: e.target.value })}
                        size="default"
                      />,
                    )}
                  </Form.Item>
                </Form>
                <div className="text-right mt-4">
                  <Button
                    type="primary"
                    className="mr-4"
                    icon="save"
                    htmlType="submit"
                    onClick={this.handleSubmit}
                    disabled={this.disabledButton()}
                  >
                    Save
                  </Button>
                </div>
              </Spin>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Form.create({ name: 'form' })(FormContent)
