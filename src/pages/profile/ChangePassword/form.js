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
      oldPassword: '',
      newPassword: '',
      confPassword: '',
    }
  }

  handleSubmit = e => {
    const { dispatch, form } = this.props
    const { oldPassword, newPassword, confPassword } = this.state
    e.preventDefault()
    form.validateFields(err => {
      if (err === null) {
        if (confPassword !== newPassword) {
          notification.warning({
            message: 'Failed',
            description: 'Confirm Password does not match New Password',
            ...notifConfig,
          })
        } else {
          dispatch({
            type: 'user/USER_CHANGE_PASSWORD',
            payload: {
              oldPassword: window.btoa(oldPassword),
              newPassword: window.btoa(newPassword),
              confPassword: window.btoa(confPassword),
            },
          })
        }
      }
    })
  }

  disabledButton() {
    const { oldPassword, newPassword, confPassword } = this.state
    if (oldPassword === '' || newPassword === '' || confPassword === '') {
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
              <Spin spinning={user.loadingChgPwd} delay={300}>
                <Form>
                  <Form.Item
                    className="ant-form-item-custom"
                    {...formItemLayout}
                    label="Current Password"
                  >
                    {form.getFieldDecorator('oldPassword', {
                      initialValue: '',
                      rules: [{ required: true, message: 'Please input Current Password' }],
                    })(
                      <Password
                        onChange={e => this.setState({ oldPassword: e.target.value })}
                        size="default"
                      />,
                    )}
                  </Form.Item>
                  <Form.Item
                    className="ant-form-item-custom"
                    {...formItemLayout}
                    label="New Password"
                  >
                    {form.getFieldDecorator('newPassword', {
                      initialValue: '',
                      rules: [{ required: true, message: 'Please input New Password' }],
                    })(
                      <Password
                        onChange={e => this.setState({ newPassword: e.target.value })}
                        size="default"
                      />,
                    )}
                  </Form.Item>
                  <Form.Item
                    className="ant-form-item-custom"
                    {...formItemLayout}
                    label="Confirm Password"
                  >
                    {form.getFieldDecorator('confPassword', {
                      initialValue: '',
                      rules: [{ required: true, message: 'Please input Confirm Password' }],
                    })(
                      <Password
                        onChange={e => this.setState({ confPassword: e.target.value })}
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
