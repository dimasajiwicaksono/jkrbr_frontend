import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as moment from 'moment'
import { Form, Row, Col, Input, Icon, DatePicker, Radio, Button, Divider } from 'antd'
import { Link } from 'react-router-dom'
import styles from './style.module.scss'
import { dateFormat } from '../../../utils/helper'
import register from '../../../assets/images/register.svg'
import Logo from '../../../assets/images/kidzooonaLogo.png'
import actions from '../../../redux/user/actions'

const mapStateToProps = ({ user }) => ({
  user,
})

@connect(mapStateToProps)
class Register extends Component {
  constructor(props) {
    super(props)
    this.state = {
      gender: 0,
      birthDate: null,
    }
  }

  onSubmit = event => {
    event.preventDefault()
    const { form, dispatch } = this.props
    const { birthDate, gender } = this.state
    form.validateFields((error, values) => {
      if (!error) {
        const payload = {
          username: values.name,
          parentName: values.parentName,
          email: values.email,
          phone: values.phone,
          address: values.address,
          ttl: birthDate,
          city: values.city,
          gender,
        }
        dispatch({
          type: actions.REGISTER,
          payload,
        })
        form.resetFields()
        this.setState({
          gender: 0,
          birthDate: null,
        })
      }
    })
  }

  hs = (state, value) => {
    this.setState({
      [state]: value,
    })
  }

  render() {
    const { gender, birthDate } = this.state
    const { form, user } = this.props
    const hoverGender = val => {
      if (gender === val) {
        return '#fff'
      }
      return '#595959'
    }
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
                <div className={`col-lg-6 px-0 ${styles.containerImg}`}>
                  <img src={register} alt="gambar" className={styles.image} />
                </div>
                <div className={`col-lg-6 col-md-12 ${styles.form}`}>
                  <Row className="d-flex align-items-center">
                    <Col span={12} className={styles.iconWrapper}>
                      <p className={styles.formTitle}>Create Account</p>
                    </Col>
                    <Col span={12} className="d-flex align-items-center justify-content-end">
                      <img src={Logo} alt="Logo" className={styles.logo} />
                    </Col>
                  </Row>
                  <p className={styles.desc}>Join with us and get the benefits.</p>

                  <Form.Item className="ant-form-item-custom mb-1 mt-3" {...formItemLayout}>
                    {form.getFieldDecorator('name', {
                      initialValue: '',
                      rules: [{ required: true, message: 'Please input Children Name' }],
                    })(
                      <Input
                        prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                        placeholder="Children Name"
                      />,
                    )}
                  </Form.Item>
                  <Row gutter={12}>
                    <Col xl={{ span: 10 }} lg={{ span: 24 }} md={{ span: 12 }}>
                      <Form.Item className="ant-form-item-custom mb-1" {...formItemLayout}>
                        {/* BLM REQUIREDDDDD */}
                        <DatePicker
                          format={dateFormat.formatDateID}
                          placeholder="Birth Date"
                          value={birthDate ? moment(birthDate, dateFormat.formatDateID) : null}
                          allowClear={false}
                          onChange={(date, dateString) => this.hs('birthDate', dateString)}
                        />
                      </Form.Item>
                    </Col>
                    <Col xl={{ span: 14 }} lg={{ span: 24 }} md={{ span: 12 }}>
                      <Form.Item className="ant-form-item-custom mb-1" {...formItemLayout}>
                        <Radio.Group
                          buttonStyle="solid"
                          value={gender}
                          onChange={e => this.hs('gender', e.target.value)}
                        >
                          <Radio.Button value={0}>
                            <Icon
                              type="man"
                              style={{ color: hoverGender(0), marginRight: '0.5vw' }}
                            />
                            Male
                          </Radio.Button>
                          <Radio.Button value={1}>
                            <Icon
                              type="woman"
                              style={{ color: hoverGender(1), marginRight: '0.5vw' }}
                            />
                            Female
                          </Radio.Button>
                        </Radio.Group>
                      </Form.Item>
                    </Col>
                  </Row>
                  <Form.Item className="ant-form-item-custom mb-1" {...formItemLayout}>
                    {form.getFieldDecorator('parentName', {
                      initialValue: '',
                      rules: [{ required: true, message: 'Please input Parent Name' }],
                    })(
                      <Input
                        prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                        placeholder="Parent Name"
                      />,
                    )}
                  </Form.Item>
                  <Form.Item className="ant-form-item-custom mb-1" {...formItemLayout}>
                    {form.getFieldDecorator('phone', {
                      initialValue: '',
                      rules: [{ required: true, message: 'Please input your phone number' }],
                    })(
                      <Input
                        prefix={<Icon type="phone" style={{ color: 'rgba(0,0,0,.25)' }} />}
                        placeholder="Handphone Number"
                        type="tel"
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
