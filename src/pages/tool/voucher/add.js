import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Form, Button, /* Spin, */ Table, notification, InputNumber } from 'antd'
// import NumericInput from '../../../components/CleanUIComponents/Input/NumericInput'

const mapStateToProps = ({ toolVoucher }) => ({
  toolVoucher,
  dataOutlet: toolVoucher.outletOption,
})

@withRouter
@connect(mapStateToProps)
class AddContent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      // compCode: '',
      discount: 0,
      qty: 0,
      itemSelected: [],
    }
  }

  handleSubmit = e => {
    const { /* dispatch, */ form } = this.props
    const { itemSelected, discount, qty } = this.state
    e.preventDefault()
    form.validateFields(err => {
      if (err === null && itemSelected.length > 0) {
        const payload = {
          data: itemSelected,
          discount,
          qty,
        }
        console.log(payload)
        // const promise = new Promise(resolve => {
        //   dispatch(
        //     {
        //       type: 'toolVoucher/GET_DATA_OUTLET_SAVE',
        //       payload,
        //     },
        //     setTimeout(() => {
        //       resolve(true)
        //     }, 300),
        //   )
        // })
        // promise.then(() => true)
      } else {
        notification.warn({
          message: 'FAILED',
          description: 'Please select Outlet First',
        })
      }
    })
  }

  handleContent(payload) {
    const { toolVoucher, dispatch } = this.props
    if (toolVoucher.contentStatus !== payload) {
      dispatch({
        type: 'toolVoucher/HANDLE_CONTENT',
        payload,
      })
    }
  }

  /** Select row per item or RefNo */
  onSelectChange = (record, selected) => {
    const { itemSelected } = this.state
    const { action } = this.props
    let i = 0
    if (!selected) {
      itemSelected.map(val => {
        if (val.outletCode === record.outletCode) {
          itemSelected.splice(i, 1)
        }
        i += 1
        action('toolVoucherSelectedData', [])
        return itemSelected
      })
    } else {
      itemSelected.push({
        outletCode: record.outletCode,
      })
      action('toolVoucherSelectedData', itemSelected)
    }
  }

  onSelectChangeAll = (selected, selectedRows) => {
    const { itemSelected } = this.state
    const { action } = this.props
    if (!selected) {
      this.setState({ itemSelected: [] })
      action('toolVoucherSelectedData', [])
    } else {
      selectedRows.map(record =>
        itemSelected.push({
          outletCode: record.outletCode,
        }),
      )
      action('toolVoucherSelectedData', itemSelected)
    }
  }

  render() {
    const { dataOutlet } = this.props
    const { discount, qty } = this.state
    const dataTable = []
    // const { getFieldDecorator } = form
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 10 },
      },
      wrapperCol: {
        xs: { span: 10 },
        sm: { span: 10 },
      },
    }

    // const pagination = { pageSize: 5 }
    const option = {
      bordered: true,
      pagination: false,
      size: 'small',
      hasData: true,
    }

    const columns = {
      dataTable: [
        {
          title: 'Outlet Code',
          dataIndex: 'outletCode',
          key: 'outletCode',
          width: 130,
        },
        {
          title: 'Outlet Name',
          dataIndex: 'outletName',
          key: 'outletName',
        },
      ],
    }

    if (dataOutlet !== undefined && dataOutlet.length) {
      dataOutlet.map(item =>
        dataTable.push({
          outletCode: item.outletCode,
          outletName: item.outletName,
        }),
      )
    }

    const rowSelection = {
      onSelect: this.onSelectChange,
      onSelectAll: this.onSelectChangeAll,
    }

    return (
      <div>
        {/* <Spin spinning={toolVoucher.loadingProcess}> */}
        <div>
          <Form>
            <div className="row">
              <div className="col-md-6">
                <Table
                  {...option}
                  columns={columns.dataTable}
                  dataSource={dataTable}
                  rowSelection={rowSelection}
                  scroll={{ x: false, y: 300 }}
                />
              </div>
              <div className="col-md-6">
                <Form.Item
                  className="ant-form-item-custom"
                  {...formItemLayout}
                  label="Qty Voucher per Outlet"
                >
                  <InputNumber
                    onChange={e => this.setState({ qty: e })}
                    value={qty}
                    min={0}
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                  />
                </Form.Item>
                <Form.Item className="ant-form-item-custom" {...formItemLayout} label="Discount">
                  <InputNumber
                    onChange={e => this.setState({ discount: e })}
                    min={0}
                    max={100}
                    defaultValue={discount}
                    formatter={value => `${value}%`}
                    parser={value => value.replace('%', '')}
                  />
                </Form.Item>
                <Button
                  className="ml-4 mt-4"
                  type="default"
                  icon="close"
                  onClick={() => this.handleContent('isView')}
                >
                  Cancel
                </Button>
                <Button className="ml-4 mt-4" type="primary" onClick={this.handleSubmit}>
                  GENERATE
                </Button>
              </div>
            </div>
            <div className="text-right mt-4" />
          </Form>
        </div>
        {/* </Spin> */}
      </div>
    )
  }
}

export default Form.create({ name: 'form_add' })(AddContent)
