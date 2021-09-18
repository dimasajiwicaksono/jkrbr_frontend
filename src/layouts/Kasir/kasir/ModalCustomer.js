import React, { Component } from 'react'
import { Modal, Form, Input, Button, Table } from 'antd'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

const mapStateToProps = ({ posKasir, mstCustomer }) => ({
  posKasir,
  mstCustomer,
  dataCustomer: posKasir.customerOption,
})

@withRouter
@connect(mapStateToProps)
class ModalCustomer extends Component {
  constructor(props) {
    super(props)
    const { dataCustomer, valueDefault = '' } = this.props
    this.state = {
      code: valueDefault,
      name: '',
      customerSelected: {
        code: '',
        name: '',
      },
      items: dataCustomer,
    }
  }

  componentWillReceiveProps(nextProps) {
    const { items } = this.state
    if (items !== nextProps.posKasir.customerOption) {
      this.setState({
        items: nextProps.posKasir.customerOption,
      })
    }
  }

  handleClear = () => {
    this.setState({
      code: '',
      name: '',
    })
  }

  handleReload = () => {
    const { dispatch, moduleSet } = this.props
    dispatch({
      type: 'mstCustomer/GET_DATA_CUSTOMER_OPTION',
      payload: {
        moduleSet,
      },
    })
  }

  handleChange(field, value) {
    this.setState({
      [field]: value,
    })
  }

  handleSearch() {
    const { dataCustomer } = this.props
    const { code, name } = this.state
    const filterData = dataCustomer.filter(
      val =>
        val.custCode.toLowerCase().indexOf(code) >= 0 &&
        val.custName.toLowerCase().indexOf(name) >= 0,
    )
    this.setState({
      items: filterData,
    })
  }

  handleSearchDisable() {
    const { code, name } = this.state
    return code === '' && name === ''
  }

  render() {
    const { visible, onOk, onCancel, title, mstCustomer } = this.props
    const { code, name, customerSelected, items } = this.state
    const sort = ['descend', 'ascend']
    const pagination = { pageSize: 50 }
    const dataTable = []
    const option = {
      bordered: true,
      pagination,
      size: 'small',
      hasData: true,
    }
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
    }

    /* MAPING TABLE COLUMN */
    const columns = [
      {
        title: 'Code',
        dataIndex: 'code',
        key: 'code',
        width: 120,
        defaultSortOrder: sort,
        sorter: (a, b) => a.code.localeCompare(b.code),
        fixed: 'left',
      },
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        sortDirections: sort,
        sorter: (a, b) => a.name.localeCompare(b.name),
      },
      {
        title: 'Country',
        dataIndex: 'country',
        key: 'country',
        width: 150,
        sortDirections: sort,
        sorter: (a, b) => a.country.localeCompare(b.country),
      },
      {
        title: 'Currency',
        dataIndex: 'currency',
        key: 'currency',
        width: 150,
        sortDirections: sort,
        sorter: (a, b) => a.currency.localeCompare(b.currency),
      },
    ]

    /* MAPING DATA TABEL */
    if (items.length > 0) {
      items
        .filter(
          x =>
            x.custCode.toLowerCase().indexOf(code) >= 0 &&
            x.custName.toLowerCase().indexOf(name) >= 0,
        )
        .map(val =>
          dataTable.push({
            key: val.custCode,
            code: val.custCode,
            name: val.custName,
            country: val.country,
            currency: val.crcCode,
          }),
        )
    }

    const onRow = record => ({
      onClick: () => {
        this.setState({
          customerSelected: {
            code: record.code,
            name: record.name,
          },
        })
      },
      onDoubleClick: () => onOk(customerSelected),
    })

    return (
      <Modal
        maskClosable={false}
        title={title}
        visible={visible}
        onOk={() => onOk(customerSelected)}
        onCancel={() => onCancel()}
        width={1000}
        centered
        okText="Select"
      >
        <Form>
          <div className="row">
            <div className="col-md-6">
              <Form.Item className="ant-form-item-custom" {...formItemLayout} label="Code">
                <Input
                  name="code"
                  value={code}
                  onChange={value => this.handleChange('code', value.target.value)}
                />
              </Form.Item>
            </div>
            <div className="col-md-6">
              <Form.Item className="ant-form-item-custom" {...formItemLayout} label="Name">
                <Input
                  name="name"
                  value={name}
                  onChange={value => this.handleChange('name', value.target.value)}
                />
              </Form.Item>
              <div className="mb-4">
                {this.handleSearchDisable() && (
                  <Button className="mr-4" disabled>
                    Search
                  </Button>
                )}
                {!this.handleSearchDisable() && (
                  <Button className="mr-4 btn-success" onClick={() => this.handleSearch()}>
                    Search
                  </Button>
                )}
                <Button className="mr-4" type="default" onClick={this.handleClear}>
                  Clear
                </Button>
              </div>
            </div>
          </div>
        </Form>
        <Button type="default" icon="reload" onClick={this.handleReload}>
          Reload
        </Button>
        <Table
          {...option}
          onRow={onRow}
          className="mt-4"
          rowClassName={record => (customerSelected.code === record.code ? 'row-selected' : '')}
          columns={columns}
          dataSource={dataTable}
          loading={mstCustomer.loadingOption}
          scroll={{ x: 1000, y: 200 }}
        />
      </Modal>
    )
  }
}

export default ModalCustomer
