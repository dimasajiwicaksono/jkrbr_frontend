import React, { Component } from 'react'
import { Form, Input, Icon, Button, Divider, Row, Col } from 'antd'
import styles from './style.module.scss'

class EditComponent extends Component {
  render() {
    const { form, handleView } = this.props
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 24 },
        lg: { span: 18 },
        xl: { span: 16 },
      },
    }

    return (
      <div>
        <h5 className={`my-2 ${styles.profileDetail}`}>Edit Profile</h5>
        <Form.Item className="ant-form-item-custom mb-2 mt-3" {...formItemLayout}>
          {form.getFieldDecorator('name', {
            initialValue: 'Dimas Aji Wicaksono',
            rules: [{ required: true, message: 'Please input your name' }],
          })(
            <Input
              size="large"
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Name"
            />,
          )}
        </Form.Item>
        <Form.Item className="ant-form-item-custom mb-2" {...formItemLayout}>
          {form.getFieldDecorator('email', {
            initialValue: 'dimaswicaksono002@gmail.com',
            rules: [{ required: true, message: 'Please input your email' }],
          })(
            <Input
              size="large"
              prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Email"
            />,
          )}
        </Form.Item>
        <Form.Item className="ant-form-item-custom mb-2" {...formItemLayout}>
          {form.getFieldDecorator('phone', {
            initialValue: '085601455686',
            rules: [{ required: true, message: 'Please input your phone number' }],
          })(
            <Input
              size="large"
              prefix={<Icon type="phone" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Phone Number"
              type="tel"
            />,
          )}
        </Form.Item>
        <Form.Item className="ant-form-item-custom mb-2" {...formItemLayout}>
          {form.getFieldDecorator('address', {
            initialValue:
              'Jln.Jalak No.8 Rw 001 Rw 002 Kelurahan Pondok Aren Kecamatan Ciledug Tangerang Selatan Banten',
            rules: [{ required: false }],
          })(
            <Input.TextArea
              size="large"
              prefix={<Icon type="home" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Address"
            />,
          )}
        </Form.Item>
        <Row>
          <Col
            xs={{ span: 24 }}
            sm={{ span: 24 }}
            lg={{ span: 18 }}
            xl={{ span: 16 }}
            className="mb-2"
          >
            <Divider className="my-2" />
          </Col>
        </Row>
        <Button type="primary" icon="save" onClick={this.handleSubmit}>
          Save
        </Button>
        <Button className="ml-3" type="default" icon="close" onClick={() => handleView(false)}>
          Cancel
        </Button>
      </div>
    )
  }
}

export default Form.create({ name: 'form_edit' })(EditComponent)
