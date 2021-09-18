import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Form, Row, Col, Input, Icon,Button, Divider } from 'antd'
import { Link } from 'react-router-dom'
import styles from './style.module.scss'

import Logo from '../../../assets/images/bnn.png'
import actions from '../../../redux/user/actions'

const mapStateToProps = ({ user }) => ({
  user,
})

@connect(mapStateToProps)
class Register extends Component {


  onSubmit = event => {
    event.preventDefault()
    const { form, dispatch } = this.props
    form.validateFields((error, values) => {
      if (!error) {
        dispatch({
          type: actions.REGISTER,
          payload: {...values},
        })
        form.resetFields()
      }
    })
  }

  hs = (state, value) => {
    this.setState({
      [state]: value,
    })
  }

  render() {
    const { form, user } = this.props
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
      },
      wrapperCol: {
        lg: { span: 24 },
      },
    }
    return (
      <Form onSubmit={this.onSubmit}>
        <div className={styles.container}>
          <div className={styles.child}>
            <div className={`${styles.cardLogin} card card--withShadow`}>
              <div className="row mx-0">
                <div className={`col-lg-6 col-md-12 ${styles.form}`}>
                  <Row className="d-flex align-items-center">
                    <Col span={24} className="d-flex align-items-center justify-content-center">
                      <img src={Logo} alt="Logo" className={styles.logo} />
                    </Col>
                  </Row>

                  <Form.Item className="ant-form-item-custom mb-1 mt-3" {...formItemLayout}>
                    {form.getFieldDecorator('username', {
                      initialValue: '',
                      rules: [{ required: true, message: 'Mohon Input User Name' }],
                    })(
                      <Input
                        prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                        placeholder="User Name"
                      />,
                    )}
                  </Form.Item>
                  <Form.Item className="ant-form-item-custom mb-1 mt-3" {...formItemLayout}>
                    {form.getFieldDecorator('password', {
                      initialValue: '',
                      rules: [{ required: true, message: 'Mohon Input User Name' }],
                    })(
                      <Input.Password
                        prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                        placeholder="Password"
                      />,
                    )}
                  </Form.Item>
                  <Form.Item className="ant-form-item-custom mb-1" {...formItemLayout}>
                    {form.getFieldDecorator('full_name', {
                      initialValue: '',
                      rules: [{ required: true, message: 'Mohon Isi Nama Lengkap Anda' }],
                    })(
                      <Input
                        prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                        placeholder="Nama Lengkap"
                      />,
                    )}
                  </Form.Item>
                  <Form.Item className="ant-form-item-custom mb-1" {...formItemLayout}>
                    {form.getFieldDecorator('email', {
                      initialValue: '',
                      rules: [{ required: true, message: 'Please input your email' }],
                    })(
                      <Input
                        prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
                        placeholder="Email"
                        type="Email"
                      />,
                    )}
                  </Form.Item>
                  <Form.Item className="ant-form-item-custom mb-1" {...formItemLayout}>
                    {form.getFieldDecorator('city', {
                      initialValue: '',
                      rules: [{ required: true, message: 'Please input City' }],
                    })(
                      <Input
                        prefix={<Icon style={{ color: 'rgba(0,0,0,.25)' }} />}
                        placeholder="City"
                      />,
                    )}
                  </Form.Item>

                  <Form.Item className="ant-form-item-custom mb-1" {...formItemLayout}>
                    {form.getFieldDecorator('address', {
                      initialValue: '',
                      rules: [{ required: false }],
                    })(
                      <Input.TextArea
                        prefix={<Icon type="home" style={{ color: 'rgba(0,0,0,.25)' }} />}
                        placeholder="Address"
                      />,
                    )}
                  </Form.Item>

                  <Divider className="mt-3 mb-0" />
                  <Button
                    type="primary"
                    className="my-3"
                    style={{ width: '100%' }}
                    htmlType="submit"
                    loading={user.loadingRegister}
                  >
                    Register
                  </Button>
                  <p className={styles.textFooter}>
                    Already have an account?{' '}
                    <Link to="/login" className="utils__link--blue utils__link mt-2 mr-1">
                      Log in
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Form>
    )
  }
}

export default Form.create({ name: 'form_register' })(Register)
