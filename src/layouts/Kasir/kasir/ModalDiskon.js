import React, { Component } from 'react'
import { Form, Input, Modal, InputNumber, Row, Col } from 'antd'
import { currencyFormat } from '../../../utils/helper'

class ModalDiskon extends Component {
  constructor(props) {
    super(props)
    const { data } = this.props
    this.state = {
      disc1: data.disc1 || 0,
      disc2: data.disc2 || 0,
      disc3: data.disc3 || 0,
    }
  }

  hs = (state, val) => {
    this.setState({
      [state]: val,
    })
  }

  handleKeyDown = e => {
    if (e.keyCode === 13) {
      const { form } = e.target
      const index = Array.prototype.indexOf.call(form, e.target)
      form.elements[index + 2].focus()
    }
  }

  render() {
    const { onCancel, visible, data, onOk } = this.props
    const { disc1, disc2, disc3 } = this.state

    const formItemLayout = {
      labelCol: {
        style: { height: 30 },
        xs: { span: 24 },
        sm: { span: 7 },
        md: { span: 6 },
      },
      wrapperCol: {
        style: { height: 30 },
        xs: { span: 24 },
        sm: { span: 15 },
        md: { span: 18 },
      },
    }

    const propsInputText = {
      type: 'text',
      size: 'small',
      className: 'pb-1 pt-1',
      ref: this.refInput,
      onKeyDown: e => this.handleKeyDown(e),
    }

    const total = data.amount || 0

    const diskon1 = (total * +disc1) / 100
    const diskon2 = ((total - diskon1) * disc2) / 100
    const diskon3 = ((total - (diskon1 + diskon2)) * disc3) / 100
    const totalDiskon = diskon1 + diskon2 + diskon3

    const prc = (totalDiskon / total) * 100

    const renderCurr = val => currencyFormat(val)

    const payload = {
      no: data.no,
      disc: totalDiskon,
      disc1,
      disc2,
      disc3,
      totalDiscPrc: prc,
    }

    return (
      <div>
        <Modal
          visible={visible}
          onCancel={() => onCancel()}
          onOk={() => onOk(payload)}
          width="30vw"
          title="PEMBERIAN DISKON"
          bodyStyle={{ minHeight: '30vh' }}
        >
          <Form>
            <Form.Item className="ant-form-item-custom" {...formItemLayout} label="Total">
              <Input
                {...propsInputText}
                className="font-weight-bold text-dark"
                value={renderCurr(total)}
                disabled
              />
            </Form.Item>
            <Form.Item className="ant-form-item-custom" {...formItemLayout} label="Diskon 1">
              <Row gutter={8}>
                <Col span={12}>
                  <InputNumber
                    {...propsInputText}
                    value={disc1}
                    onChange={e => this.hs('disc1', e)}
                    style={{ width: '100%' }}
                    formatter={value => `${value}%`}
                    parser={value => value.replace('%', '')}
                    autoFocus
                    max={100}
                    min={0}
                  />
                </Col>
                <Col span={12}>
                  <Input
                    {...propsInputText}
                    value={renderCurr(diskon1)}
                    style={{
                      width: '100%',
                      textAlign: 'right',
                      fontWeight: 'bold',
                      color: 'black',
                    }}
                    disabled
                  />
                </Col>
              </Row>
            </Form.Item>
            <Form.Item className="ant-form-item-custom" {...formItemLayout} label="Diskon 2">
              <Row gutter={8}>
                <Col span={12}>
                  <InputNumber
                    {...propsInputText}
                    value={disc2}
                    onChange={e => this.hs('disc2', e)}
                    style={{ width: '100%' }}
                    formatter={value => `${value}%`}
                    parser={value => value.replace('%', '')}
                    max={100}
                    min={0}
                  />
                </Col>
                <Col span={12}>
                  <Input
                    {...propsInputText}
                    value={renderCurr(diskon2)}
                    style={{
                      width: '100%',
                      textAlign: 'right',
                      fontWeight: 'bold',
                      color: 'black',
                    }}
                    disabled
                  />
                </Col>
              </Row>
            </Form.Item>
            <Form.Item className="ant-form-item-custom" {...formItemLayout} label="Diskon 3">
              <Row gutter={8}>
                <Col span={12}>
                  <InputNumber
                    {...propsInputText}
                    value={disc3}
                    onChange={e => this.hs('disc3', e)}
                    style={{ width: '100%' }}
                    formatter={value => `${value}%`}
                    parser={value => value.replace('%', '')}
                    max={100}
                    min={0}
                  />
                </Col>
                <Col span={12}>
                  <Input
                    {...propsInputText}
                    value={renderCurr(diskon3)}
                    style={{
                      width: '100%',
                      textAlign: 'right',
                      fontWeight: 'bold',
                      color: 'black',
                    }}
                    disabled
                  />
                </Col>
              </Row>
            </Form.Item>
            <Form.Item className="ant-form-item-custom" {...formItemLayout} label="Total Diskon">
              <Input
                {...propsInputText}
                value={renderCurr(totalDiskon)}
                disabled
                style={{ width: '50%', fontWeight: 'bold', color: 'black' }}
              />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    )
  }
}

export default ModalDiskon
