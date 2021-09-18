import React, { Component } from 'react'
import { Form, Input, Button } from 'antd'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import styles from './style.module.scss'
import { urlToArray } from '../../../utils/helper'

@Form.create()
@connect(({ user }) => ({
  user,
}))
class Forgot extends Component {
  componentWillMount() {
    const { dispatch, location } = this.props
    const locationArray = urlToArray(location.search)
    dispatch({
      type: 'user/CHECK_TOKEN',
      payload: {
        token: locationArray.token,
      },
    })
  }

  onSubmit = event => {
    event.preventDefault()
    const { form, dispatch, location } = this.props
    const locationArray = urlToArray(location.search)
    form.validateFields((error, values) => {
      if (!error) {
        dispatch({
          type: 'user/RESET_PASSWORD',
          payload: {
            password: window.btoa(values.password),
            repeatPassword: window.btoa(values.confirmPassword),
            token: locationArray.token,
          },
        })
      }
    })
  }

  render() {
    const {
      form,
      user: { loadingChgPwd },
    } = this.props
    const { Password } = Input
    return (
      <div>
        <Helmet title="Forgot" />
        <div className={styles.block}>
          <div className="row">
            <div className="col-xl-12">
              <div className={styles.inner}>
                <div className={styles.form}>
                  <h4 className="text-uppercase">
                    <strong>Reset Password</strong>
                  </h4>
                  <br />
                  <Form layout="vertical" hideRequiredMark onSubmit={this.onSubmit}>
                    <Form.Item label="New Password">
                      {form.getFieldDecorator('password', {
                        initialValue: '',
                        rules: [{ required: true, message: 'Please input New Password' }],
                      })(<Password size="default" />)}
                    </Form.Item>
                    <Form.Item label="Confirm Password">
                      {form.getFieldDecorator('confirmPassword', {
                        initialValue: '',
                        rules: [{ required: true, message: 'Please input Confirm Password' }],
                      })(<Password size="default" />)}
                    </Form.Item>
                    <div className="form-actions">
                      <div className="row">
                        <div className="col-6">
                          <Button
                            type="primary"
                            className="width-150"
                            htmlType="submit"
                            loading={loadingChgPwd}
                          >
                            Reset Password
                          </Button>
                        </div>
                        <div className="col-6 text-right pt-2">
                          <Link
                            to="/user/login"
                            className="utils__link--blue utils__link--underlined"
                          >
                            Back to login
                          </Link>
                        </div>
                      </div>
                    </div>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Forgot
