import React, { Component } from 'react'
import { Form, Input, Button, Select } from 'antd'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import styles from './style.module.scss'

@Form.create()
@connect(({ user }) => ({
  user,
  optCompany: user.company,
}))
class Login extends Component {
  componentWillMount() {
    const { dispatch } = this.props
    dispatch({
      type: 'user/GET_COMPANY',
    })
  }

  onSubmit = event => {
    event.preventDefault()
    const { form, dispatch } = this.props
    form.validateFields((error, values) => {
      if (!error) {
        const payload = {
          company: values.company,
          password: window.btoa(values.password),
          username: values.username,
        }
        dispatch({
          type: 'user/LOGIN',
          payload,
        })
      }
    })
  }

  render() {
    const {
      form,
      optCompany,
      user: { loading },
    } = this.props
    const { Option } = Select
    const { Password } = Input
    return (
      <div>
        <Helmet title="Login" />
        <div className={styles.block}>
          <div className="row">
            <div className="col-xl-12">
              <div className={styles.inner}>
                <div className={styles.form}>
                  <h4 className="text-uppercase text-center">
                    <strong>WELCOME TO SCAP</strong>
                  </h4>
                  <br />
                  <Form layout="vertical" hideRequiredMark onSubmit={this.onSubmit}>
                    <Form.Item label="Username">
                      {form.getFieldDecorator('username', {
                        initialValue: '',
                        rules: [{ required: true, message: 'Please input your username' }],
                      })(<Input size="default" />)}
                    </Form.Item>
                    <Form.Item label="Password">
                      {form.getFieldDecorator('password', {
                        initialValue: '',
                        rules: [{ required: true, message: 'Please input your password' }],
                      })(<Password size="default" />)}
                    </Form.Item>
                    <Form.Item label="Company">
                      {form.getFieldDecorator('company', {
                        rules: [{ required: true, message: 'Please select company' }],
                      })(
                        <Select
                          showSearch
                          onChange={e => localStorage.setItem('compCode', e)}
                          filterOption={(input, opt) =>
                            opt.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }
                        >
                          {optCompany.map(val => (
                            <Option key={val.compCode} value={val.compCode}>
                              {val.compName}
                            </Option>
                          ))}
                        </Select>,
                      )}
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
                            Login
                          </Button>
                        </div>
                        <div className="col-6 text-right pt-2">
                          <Link
                            to="/user/forgot"
                            className="utils__link--blue utils__link--underlined"
                          >
                            Forgot password
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

export default Login
