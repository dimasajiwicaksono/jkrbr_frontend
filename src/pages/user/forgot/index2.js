import React, { Component } from 'react'
import { Form, Input, Button } from 'antd'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import styles from './style.module.scss'

@Form.create()
@connect(({ user }) => ({
  user,
}))
class Forgot extends Component {
  onSubmit = event => {
    event.preventDefault()
    const { form, dispatch } = this.props
    form.validateFields((error, values) => {
      if (!error) {
        const payload = {
          email: values.email,
        }
        dispatch({
          type: 'user/FORGOT',
          payload,
        })
      }
    })
  }

  render() {
    const {
      form,
      user: { loading },
    } = this.props
    return (
      <div>
        <Helmet title="Forgot" />
        <div className={styles.block}>
          <div className="row">
            <div className="col-xl-12">
              <div className={styles.inner}>
                <div className={styles.form}>
                  <h4 className="text-uppercase">
                    <strong>Restore Password</strong>
                  </h4>
                  <br />
                  <Form layout="vertical" hideRequiredMark onSubmit={this.onSubmit}>
                    <Form.Item label="Email">
                      {form.getFieldDecorator('email', {
                        initialValue: '',
                        rules: [{ required: true, message: 'Please input email' }],
                      })(<Input type="email" size="default" />)}
                    </Form.Item>
                    <div className="form-actions">
                      <div className="row">
                        <div className="col-6">
                          <Button
                            type="primary"
                            className="width-150"
                            htmlType="submit"
                            loading={loading}
                          >
                            Send Email
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
