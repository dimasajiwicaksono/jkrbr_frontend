import React, { Component } from 'react'
import { Modal, Form, Button } from 'antd'
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import SelectScap from '../../../components/CleanUIComponents/Scap/SelectScap'
import actions from '../../../redux/pos/posKasir/actions'

const mapStateToProps = ({ posPointOfSales }) => ({
  posPointOfSales,
  accessOutlet: posPointOfSales.outletAccess || [],
})

@withRouter
@connect(mapStateToProps)
class ModalOutlet extends Component {
  constructor(props) {
    super(props)
    const { accessOutlet } = this.props
    this.state = {
      loading: false,
      outlet: accessOutlet.length > 0 ? accessOutlet[0].outletCode : '',
    }
  }

  handleOk = () => {
    const { outlet } = this.state
    const { onCancel, dispatch } = this.props
    this.setState({ loading: true })
    setTimeout(() => {
      this.setState({ loading: false })
      onCancel()
      dispatch({
        type: actions.HANDLE_OUTLET,
        payload: {
          outletCode: outlet,
        },
      })
      localStorage.setItem('otl', outlet)
    }, 3000)
  }

  render() {
    const formItemLayout = {
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

    const { visible, onCancel, accessOutlet } = this.props
    const { loading, outlet } = this.state
    const optOutlet = accessOutlet.map(el => ({
      value: el.outletCode,
      title: el.outletName,
    }))

    return (
      <div>
        <Modal
          visible={visible}
          onCancel={() => onCancel()}
          width="30vw"
          centered
          footer={[
            <Button icon="arrow-left" className="mr-2" key="back" onClick={() => onCancel()}>
              Back
            </Button>,
            <Link to={{ pathname: '/kasir' }}>
              <Button
                className="ml-2"
                key="submit"
                type="primary"
                loading={loading}
                onClick={this.handleOk}
                disabled={outlet === ''}
                icon="key"
              >
                Access
              </Button>
            </Link>,
          ]}
        >
          <Form>
            <h4 className="text-center">Please Choose your Outlet Access</h4>
            <Form.Item className="ant-form-item-custom" {...formItemLayout} label="Outlet">
              <SelectScap
                datas={optOutlet}
                onChange={value => this.setState({ outlet: !value ? '' : value })}
                value={outlet}
              />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    )
  }
}

export default Form.create('form_modal_outlet')(ModalOutlet)
