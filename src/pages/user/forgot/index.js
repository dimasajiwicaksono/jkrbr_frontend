import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Form, Input, Icon, Row, Col, Button } from 'antd'
import { Link } from 'react-router-dom'
import styles from './style.module.scss'
import Logo from '../../../assets/images/kidzooonaLogo.png'
import Image from '../../../assets/images/forgot.svg'
import actions from '../../../redux/user/actions'

const mapStateToProps = ({ user }) => ({
  user,
})

@connect(mapStateToProps)
class Forgot extends Component {

  constructor(props) {
    super(props)
    this.state = {}
  }

  onSubmit = e => {
    e.preventDefault()
    const { form, dispatch } = this.props
    form.validateFields((error, values) => {
      if (!error) {
        const payload = {
          email: values.email,
        }
        dispatch({
          type: actions.FORGOT,
          payload
        })
        form.resetFields()
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
                    <Col span={12}>
                      <p className={styles.formTitle}>Reset Password</p>
                    </Col>
                    <Col span={12} className="d-flex align-items-center justify-content-end">
                      <img
                        src={Logo}
                        alt="Logo"
                        className={styles.logo}
                      />
                    </Col>
                  </Row>
                  <p className={styles.desc}>Enter the registered e-mail. We will send you a verification link to reset your password.</p>
                  <Form.Item className="ant-form-item-custom mt-3" {...formItemLayout}>
                    {form.getFieldDecorator('email', {
                      initialValue: '',
                      rules: [{ required: true, message: 'Please input your email' }],
                    })(
                      <Input
                        prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
                        placeholder="Enter Your E-Mail"
                        type='email'
                      />
                    )}
                  </Form.Item>
                  <Row className={styles.heightBtn}>
                    <Col span={24} className="d-flex align-items-center">
                      <Button type="primary" icon="arrow-right" htmlType='submit' loading={user.loadingFrgt}>Send</Button>
                    </Col>
                  </Row>
                  <Link to="/login" className='utils__link--blue utils__link p-0 my-0 mr-1'>
                    Back To Login
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Form>
    )
  }
}

export default Form.create({ name: 'form_change_passowrd' })(Forgot)