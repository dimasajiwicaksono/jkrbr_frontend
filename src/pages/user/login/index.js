import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Form, Input, Icon, Row, Col, Button } from 'antd'
import { Link } from 'react-router-dom'
import styles from './style.module.scss'
import login from '../../../assets/images/login.svg'
import Logo from '../../../assets/images/bnn.png'
import actions from '../../../redux/user/actions'
import config from '../../../utils/config'

const mapStateToProps = ({ user }) => ({
  user,
})

@connect(mapStateToProps)
class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  hs = (state, value) => {
    this.setState({
      [state]: value,
    })
  }

  onSubmit = e => {
    e.preventDefault()
    const { form, dispatch } = this.props
    form.validateFields((error, values) => {
      if (!error) {
        dispatch({
          type: actions.LOGIN,
          payload: {
            username: values.username,
            password: values.password,
          },
        })
      }
    })
  }

  render() {
    const { form, user } = this.props
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
      },
      wrapperCol: {
        xs: { span: 24 },
        // sm: { span: 24 },
        md: { span: 18 },
      },
    }
    return (
      <Form onSubmit={this.onSubmit}>
        <div className={styles.container}>
          <div className={styles.child}>
            <div className={`${styles.cardLogin} card card--withShadow`}>
              <div className="row mx-0">
                <div className={`col-lg-6 px-0 ${styles.containerImg}`}>
                  <img src={login} alt="gambar" className={styles.image} />
                </div>

                <div className={`col-lg-6 col-md-12 ${styles.form}`}>
                  <Row className="d-flex align-items-center">
                    <Col span={24} className="d-flex align-items-center justify-content-center">
                      <img src={Logo} alt="Logo" className={styles.logo} />
                    </Col>
                  </Row>
                  <Form.Item className="ant-form-item-custom mt-3" {...formItemLayout}>
                    {form.getFieldDecorator('username', {
                      initialValue: '',
                      rules: [{ required: true, message: 'Please input your email' }],
                    })(
                      <Input
                        // value={username}
                        // onChange={e => this.hs('username', e.target.value)}
                        prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                        placeholder="Username"
                        size="large"
                      />,
                    )}
                  </Form.Item>
                  <Form.Item className="ant-form-item-custom mt-3" {...formItemLayout}>
                    {form.getFieldDecorator('password', {
                      initialValue: '',
                      rules: [{ required: true, message: 'Please input your password' }],
                    })(
                      <Input.Password
                        prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                        type="password"
                        placeholder="Password"
                        size="large"
                      />,
                    )}
                  </Form.Item>
                  <Row className={styles.heightBtn}>
                    <Col span={12} className="d-flex align-items-center">
                      <Button
                        type="primary"
                        icon="login"
                        htmlType="submit"
                        loading={user.loading}
                        size="large"
                      >
                        Login
                      </Button>
                    </Col>
                    <Col span={12} className="d-flex align-items-center justify-content-end">
                      <Link to="/forgot" className="utils__link--blue utils__link mt-2 mr-1">
                        Forgot Pasword?
                      </Link>
                    </Col>
                  </Row>
                  <p className={styles.textFooter}>
                    Dont have an account?{' '}
                    <Link to="/register" className="utils__link--blue utils__link mt-2 mr-1">
                      Register here
                    </Link>
                  </p>
                  <p>V{config.BUILD_VERSION}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Form>
    )
  }
}

export default Form.create({ name: 'form_login' })(Login)
