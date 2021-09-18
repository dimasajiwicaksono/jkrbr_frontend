import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as moment from 'moment'
import { Form, Row, Col, Input, Icon, DatePicker, Radio, Button, Divider } from 'antd'
// import { Link } from 'react-router-dom'
import { Link } from 'react-router-dom'
import styles from './style.module.scss'
import { dateFormat } from '../../utils/helper'
// import actions from '../../redux/user/actions'

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
          type: 'user/REGISTE',
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
              <div className="row m-4">
                <div className={`col-lg-6 col-md-12 ${styles.form}`}>
                  <div className="text-center">
                    <h4>Join with us and get the benefits.</h4>
                  </div>

                  <Form.Item
                    className="ant-form-item-custom mb-1 mt-3"
                    {...formItemLayout}
                    label={<span style={{ fontSize: '1.25em', fontWeight: 'bold' }}>Name</span>}
                  >
                    {form.getFieldDecorator('name', {
                      initialValue: '',
                      rules: [{ required: true, message: 'Please input Children Name' }],
                    })(
                      <Input
                        size="large"
                        prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                        placeholder="Please input your children name"
                      />,
                    )}
                  </Form.Item>
                  <Row gutter={12}>
                    <Col xl={{ span: 10 }} lg={{ span: 24 }} md={{ span: 12 }}>
                      <Form.Item
                        className="ant-form-item-custom mb-1"
                        {...formItemLayout}
                        label={
                          <span style={{ fontSize: '1.25em', fontWeight: 'bold' }}>Birth Date</span>
                        }
                        required
                      >
                        {/* BLM REQUIREDDDDD */}
                        <DatePicker
                          style={{ width: '100%' }}
                          format={dateFormat.formatDateID}
                          placeholder="Birth Date"
                          value={birthDate ? moment(birthDate, dateFormat.formatDateID) : null}
                          allowClear={false}
                          size="large"
                          onChange={(date, dateString) => this.hs('birthDate', dateString)}
                        />
                      </Form.Item>
                    </Col>
                    <Col xl={{ span: 14 }} lg={{ span: 24 }} md={{ span: 12 }} xs={{ span: 24 }}>
                      <Form.Item
                        className="ant-form-item-custom mb-1"
                        {...formItemLayout}
                        label={
                          <span style={{ fontSize: '1.25em', fontWeight: 'bold' }}>Gender</span>
                        }
                      >
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

                  <Form.Item
                    className="ant-form-item-custom mb-1"
                    {...formItemLayout}
                    label={
                      <span style={{ fontSize: '1.25em', fontWeight: 'bold' }}>Phone Number</span>
                    }
                  >
                    {form.getFieldDecorator('phone', {
                      initialValue: '',
                      rules: [{ required: false, message: 'Please input your phone number' }],
                    })(
                      <Input
                        maxLength={13}
                        size="large"
                        prefix={<Icon type="phone" style={{ color: 'rgba(0,0,0,.25)' }} />}
                        placeholder="Handphone Number"
                        type="tel"
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
                    size="large"
                  >
                    Register
                  </Button>
                  <Link to="/membership">
                    <Button type="default" className="my-3" style={{ width: '100%' }} size="large">
                      Cancel
                    </Button>
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

export default Form.create({ name: 'form_register' })(Register)
