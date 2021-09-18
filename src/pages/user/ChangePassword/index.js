import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Form, Input, Icon, Row, Col, Button } from 'antd'
import { withRouter, Link } from 'react-router-dom'
import styles from './style.module.scss'
import { urlToArray } from '../../../utils/helper'
import Image from '../../../assets/images/authentication.svg'
import Logo from '../../../assets/images/kidzooonaLogo.png'
import actions from '../../../redux/user/actions'

const mapStateToProps = ({ user }) => ({
  user,
})

@withRouter
@connect(mapStateToProps)
class ChangePassword extends Component {

  constructor(props) {
    super(props)
    this.state = {}
  }

  componentWillReceiveProps(np) {
    const { dispatch, history, user } = this.props;
    if (np.user.isSuccessChgPwd && user.isSuccessChgPwd !== np.user.isSuccessChgPwd) {
      dispatch({
        type: actions.SET_STATE,
        payload: {
          isSuccessChgPwd: false,
        },
      })
      history.push('/login')
    }
  }

  hs = (state, value) => {
    this.setState({
      [state]: value
    })
  }

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback('The two passwords that you entered do not match!');
    } else {
      callback();
    }
  };

  onSubmit = e => {
    e.preventDefault()
    const { form, dispatch, location } = this.props
    const locationArray = urlToArray(location.search)
    form.validateFields((error, values) => {
      if (!error) {
        dispatch({
          type: actions.RESET_PASSWORD,
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
    const { form, user } = this.props
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
      },
      wrapperCol: {
        xs: { span: 24 },
        // sm: { span: 24 },
        md: { span: 18 }
      },
    }
    return (
      <Form onSubmit={this.onSubmit}>
        <div className={styles.container}>
          <div className={styles.child}>
            <div className={`${styles.cardLogin} card card--withShadow`}>
              <div className='row mx-0'>
                <div className={`col-lg-6 px-0 ${styles.containerImg}`}>
                  <img
                    src={Image}
                    alt="gambar"
                    className={styles.image}
                  />
                </div>
                <div className={`col-lg-6 col-md-12 ${styles.form}`}>
                  <Row className='d-flex align-items-center'>
                    <Col span={12} className={styles.iconWrapper}>
                      <p className={styles.formTitle}>Create New Password</p>
                    </Col>
                    <Col span={12} className="d-flex align-items-center justify-content-end">
                      <img
                        src={Logo}
                        alt="Logo"
                        className={styles.logo}
                      />
                    </Col>
                  </Row>
                  <p className={styles.desc}>Enter the new password. We will set password to your account.</p>
                  <Form.Item className="ant-form-item-custom mt-3" {...formItemLayout}>
                    {form.getFieldDecorator('password', {
                      initialValue: '',
                      rules: [{ required: true, message: 'Please input New Password' }],
                    })(
                      <Input.Password
                        prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                        type="password"
                        placeholder="Password"
                      />
                    )}
                  </Form.Item>
                  <Form.Item className="ant-form-item-custom mt-3" {...formItemLayout}>
                    {form.getFieldDecorator('confirmPassword', {
                      initialValue: '',
                      rules: [
                        { required: true, message: 'Please input Confirm Password' },
                        { validator: this.compareToFirstPassword },
                      ],
                    })(
                      <Input.Password
                        prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                        type="password"
                        placeholder="Confirm Password"
                      />
                    )}
                  </Form.Item>
                  <Row className={styles.heightBtn}>
                    <Col span={24} className="d-flex align-items-center">
                      <Button type="primary" icon="login" htmlType='submit' loading={user.loadingChgPwd}>Continue</Button>
                    </Col>
                  </Row>
                  <Link to="/login" className='utils__link--blue utils__link p-0 my-0 mr-1'>Back To Login</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Form>
    )
  }
}

export default Form.create({ name: 'form_change_passowrd' })(ChangePassword)