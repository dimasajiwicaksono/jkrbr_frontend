import React, { Component } from 'react'
import { Modal, Form, Input, Button, Table } from 'antd'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

const mapStateToProps = ({ prdConvertItems, mstItems }) => ({
  prdConvertItems,
  mstItems,
  locationItemsData: prdConvertItems.itemsLocationOption,
})

@withRouter
@connect(mapStateToProps)
class ModalComponent extends Component {
  constructor(props) {
    super(props)
    const { locationItemsData, valueDefault = '' } = this.props
    this.state = {
      code: valueDefault,
      name: '',
      itemsSelected: {
        code: '',
        name: '',
      },
      items: locationItemsData,
    }
  }

  componentWillReceiveProps(nextProps) {
    const { locationItemsData } = this.props
    if (locationItemsData !== nextProps.locationItemsData) {
      this.setState({
        items: nextProps.locationItemsData,
      })
    }
  }

  handleReload = () => {
    const { dispatch, locaCode, moduleSet } = this.props
    dispatch({
      type: 'mstItems/GET_DATA_ITEMS_LOCATION_LIST',
      payload: {
        locaCode,
        moduleSet,
      },
    })
  }

  handleClear = () => {
    const { locationItemsData } = this.props
    this.setState({
      code: '',
      name: '',
    })
    this.setState({
      items: locationItemsData,
    })
  }

  handleSearch() {
    const { locationItemsData } = this.props
    const { code, name } = this.state
    const filterData = locationItemsData.filter(
      val =>
        val.itemCode.indexOf(code) >= 0 &&
        val.itemName.toLowerCase().indexOf(name.toLowerCase()) >= 0,
    )
    this.setState({
      items: filterData,
    })
  }

  handleSearchDisable() {
    const { code, name } = this.state
    if (code === '' && name === '') {
      return true
    }
    return false
  }

  render() {
    const { mstItems, visible, onOk, onCancel, title } = this.props
    const { code, name, itemsSelected, items } = this.state
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
    const columns = {
      dataTable: [
        {
          title: 'Item Code',
          dataIndex: 'itemCode',
          key: 'itemCode',
          width: 120,
          defaultSortOrder: sort,
          sorter: (a, b) => a.itemCode.localeCompare(b.itemCode),
        },
        {
          title: 'Item Name',
          dataIndex: 'itemName',
          key: 'itemName',
          sortDirections: sort,
          sorter: (a, b) => a.itemName.localeCompare(b.itemName),
        },
        {
          title: 'Category',
          dataIndex: 'categoryName',
          key: 'categoryName',
          width: 180,
          sortDirections: sort,
          sorter: (a, b) => a.categoryName.localeCompare(b.categoryName),
        },
        {
          title: 'Group',
          dataIndex: 'groupName',
          key: 'groupName',
          width: 180,
          sortDirections: sort,
          sorter: (a, b) => a.groupName.localeCompare(b.groupName),
        },
      ],
    }

    /* MAPING DATA TABEL */
    if (items !== undefined) {
      items
        .filter(
          x =>
            x.itemCode.indexOf(code) >= 0 &&
            x.itemName.toLowerCase().indexOf(name.toLowerCase()) >= 0,
        )
        .map((val, key) =>
          dataTable.push({
            key,
            itemCode: val.itemCode,
            itemName: val.itemName,
            groupName: val.groupName,
            categoryName: val.categoryName,
            onHandQty: val.onHandQty,
            unitPrice: val.unitPrice,
            uomStock: val.units,
          }),
        )
    }

    const onRow = record => ({
      onClick: () => {
        this.setState({
          itemsSelected: {
            code: record.itemCode,
            name: record.itemName,
            qty: Number(record.onHandQty) >= 1 ? 1 : 0,
            onHandQty: Number(record.onHandQty),
            unitPrice: Number(record.unitPrice),
            uomStock: record.uomStock,
          },
        })
      },
    })

    return (
      <Modal
        title={title}
        visible={visible}
        onOk={() => onOk(itemsSelected)}
        onCancel={() => onCancel()}
        width={1000}
        centered
        okText="Select"
        maskClosable={false}
      >
        <Form>
          <div className="row">
            <div className="col-md-6">
              <Form.Item className="ant-form-item-custom" {...formItemLayout} label="Item Code">
                <Input
                  name="code"
                  value={code}
                  onChange={value => this.setState({ code: value.target.value })}
                  onKeyDown={e => (e.key === 'Enter' ? this.handleSearch() : '')}
                />
              </Form.Item>
            </div>
            <div className="col-md-6">
              <Form.Item className="ant-form-item-custom" {...formItemLayout} label="Item Name">
                <Input
                  name="name"
                  value={name}
                  onChange={value => this.setState({ name: value.target.value })}
                  onKeyDown={e => (e.key === 'Enter' ? this.handleSearch() : '')}
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
          className="mt-4"
          onRow={onRow}
          rowClassName={record => (itemsSelected.code === record.itemCode ? 'row-selected' : '')}
          columns={columns.dataTable}
          dataSource={dataTable}
          loading={mstItems.loadingOption}
          scroll={{ x: false, y: 200 }}
        />
      </Modal>
    )
  }
}

export default ModalComponent
