import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { Form, Modal, InputNumber, Row, Col, Input } from 'antd'
import SelectScap from '../../../components/CleanUIComponents/Scap/SelectScap'
import { currencyFormat } from '../../../utils/helper'

const mapStateToProps = ({ posKasir }) => ({
  posKasir,
  optTenderMedia: posKasir.optTenderMedia || [],
})

@withRouter
@connect(mapStateToProps)
class ModalPembayaran extends Component {
  constructor(props) {
    super(props)
    const { data /* sisaTagihan */ } = this.props
    this.state = {
      metodeBayar: data.metodeBayar || 'T01 | CASH IDR | 1 | 0',
      nominal: data.jumlah || 0,
      remark: data.remark || '',
      noKartu: data.noKartu || '',
      pemegangKartu: data.pemegangKartu || '',
    }
  }

  hs = (state, val) => {
    if (state === 'metodeBayar') {
      this.setState({
        noKartu: '',
        [state]: val,
      })
    }
    this.setState({
      [state]: val,
    })
  }

  // handleKeyDown = e => {
  //   if (e.keyCode === 13) {
  //     console.log('TRIGGER')
  //     const { form } = e.target
  //     const index = Array.prototype.indexOf.call(form, e.target)
  //     console.log(index, 'index')
  //     form.elements[index + 1].focus()
  //   }
  // }

  render() {
    const {
      onCancel,
      visible,
      onOk,
      sisaTagihan,
      optTenderMedia,
      dataPembayaran,
      grandTotal,
    } = this.props
    const { metodeBayar, nominal, remark, noKartu, pemegangKartu } = this.state

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
      // ref: this.refInput,
      // onKeyDown: e => this.handleKeyDown(e)
    }

    const renderCurr = (val = 0) => currencyFormat(val)

    const payload = {
      jumlah: nominal,
      nama: metodeBayar.split('|')[1].trim(),
      code: metodeBayar.split('|')[0].trim(),
      noKartu,
      metodeBayar,
      remark,
      pemegangKartu,
    }

    const formTextArea = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
        md: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 15 },
        md: { span: 18 },
      },
    }

    const isCard = () => (metodeBayar.split('|')[2] || '').trim() === '2'
    const isCash = () => (metodeBayar.split('|')[2] || '').trim() === '1'

    const sumBayar = dataPembayaran.reduce((a, { jumlah }) => a + +(jumlah || 0), 0)

    const tagihan = grandTotal.grandTotal - sumBayar

    const kembalian = Math.abs(tagihan - nominal)

    return (
      <div>
        <Modal
          visible={visible}
          onCancel={() => onCancel()}
          onOk={() => onOk(payload)}
          width="30vw"
          title="METODE PEMBAYARAN"
          bodyStyle={{ minHeight: '30vh' }}
        >
          <Form>
            <Form.Item className="ant-form-item-custom" {...formItemLayout} label="Sisa Tagihan">
              <Input
                {...propsInputText}
                value={currencyFormat(sisaTagihan)}
                disabled
                className="text-dark font-weight-bold"
              />
            </Form.Item>
            <Form.Item className="ant-form-item-custom" {...formItemLayout} label="Metode">
              <SelectScap
                datas={optTenderMedia}
                value={metodeBayar}
                onChange={e => this.hs('metodeBayar', e)}
                size="small"
                autoFocus
              />
            </Form.Item>
            {isCard() && (
              <Form.Item className="ant-form-item-custom" {...formItemLayout} label="No.Kartu">
                <Input
                  {...propsInputText}
                  onChange={e => this.hs('noKartu', e.target.value)}
                  value={noKartu}
                />
              </Form.Item>
            )}
            {isCard() && (
              <Form.Item
                className="ant-form-item-custom"
                {...formItemLayout}
                label="Pemegang Kartu"
              >
                <Input
                  {...propsInputText}
                  onChange={e => this.hs('pemegangKartu', e.target.value)}
                  value={pemegangKartu}
                />
              </Form.Item>
            )}
            <Form.Item className="ant-form-item-custom" {...formItemLayout} label="Nominal">
              <Row gutter={8}>
                <Col span={4}>
                  <p>Rp</p>
                </Col>
                <Col span={20}>
                  <InputNumber
                    {...propsInputText}
                    className="font-weight-bold text-dark"
                    defaultValue={0}
                    value={nominal}
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                    onChange={e => this.hs('nominal', e)}
                    style={{ width: '100%', textAlign: 'left' }}
                  />
                </Col>
              </Row>
            </Form.Item>
            {isCash() && (
              <Form.Item className="ant-form-item-custom" {...formItemLayout} label="Kembalian">
                <Row gutter={8}>
                  <Col span={4}>Rp</Col>
                  <Col span={20}>
                    <Input
                      {...propsInputText}
                      className="text-dark"
                      value={renderCurr(kembalian)}
                      disabled
                    />
                  </Col>
                </Row>
              </Form.Item>
            )}
            <Form.Item
              className="ant-form-item-custom mb-0 mt-2"
              {...formItemLayout}
              label="Remark"
            >
              <Input.TextArea
                {...formTextArea}
                autoSize
                value={remark}
                onChange={e => this.hs('remark', e.target.value)}
              />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    )
  }
}

export default Form.create('modal_pembayaran')(ModalPembayaran)
