import React, { Component } from 'react'
import { Modal, Form, Input, Button, Table } from 'antd'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

const mapStateToProps = ({ posPointOfSales, prMarketList }) => ({
  prMarketList,
  dataMR: posPointOfSales.marketDetailOption,
})

@withRouter
@connect(mapStateToProps)
class ModalComponent extends Component {
  constructor(props) {
    super(props)
    const { valueDefault } = this.props
    this.state = {
      valueDefault,
      itemCode: '',
      itemName: '',
      itemSelected: [],
    }
  }

  onSelectChange(record, selected) {
    const { lastKey, indexEdit } = this.props
    const { itemSelected } = this.state
    let i = 0
    if (selected === false) {
      itemSelected.map(val => {
        if (val.itemCode === record.itemCode) {
          itemSelected.splice(i, 1)
        }
        i += 1
        return itemSelected
      })
    } else {
      itemSelected.push({
        itemCode: record.itemCode,
        itemName: record.itemName,
        qty: 0,
        units: record.unit,
        remark: '',
        index: lastKey,
        lastIndex: indexEdit.index,
        keyEdit: indexEdit.key,
      })
    }
  }

  onSelectAll(selected, selectedRows) {
    const { itemSelected } = this.state
    if (selected === false) {
      this.setState({ itemSelected: [] })
    } else {
      selectedRows.map(record =>
        itemSelected.push({
          itemCode: record.itemCode,
          itemName: record.itemName,
          qty: 0,
          units: record.unit,
          remark: '',
        }),
      )
    }
  }

  handleClear = () => {
    this.setState({
      itemCode: '',
      itemName: '',
    })
  }

  handleReload() {
    const { dispatch, marketCode, moduleSet } = this.props
    this.setState({
      valueDefault: '',
    })
    dispatch({
      type: 'prMarketList/GET_DATA_MARKET_LIST_DETAIL_OPTION',
      payload: {
        marketCode,
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
    const { dispatch, dataMR } = this.props
    const { itemCode, itemName } = this.state
    const listData = dataMR.filter(
      val =>
        val.itemCode.indexOf(itemCode) === 0 &&
        val.itemName.toLowerCase().indexOf(itemName.toLowerCase()) >= 0,
    )
    dispatch({
      type: 'posPointOfSales/HANDLE_STATE',
      field: 'marketDetailOption',
      value: listData,
    })
  }

  handleSearchDisable() {
    const { itemCode, itemName } = this.state
    if (itemCode === '' && itemName === '') {
      return true
    }
    return false
  }

  render() {
    const { prMarketList, dataMR, visible, onOk, onCancel, title } = this.props
    const { itemCode, itemName, itemSelected, valueDefault } = this.state
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
        title: 'Item Code',
        dataIndex: 'itemCode',
        key: 'itemCode',
        width: 120,
        defaultSortOrder: sort,
        sorter: (a, b) => a.itemCode.localeCompare(b.itemCode),
        fixed: 'left',
      },
      {
        title: 'Item Name',
        dataIndex: 'itemName',
        key: 'itemName',
        sortDirections: sort,
        sorter: (a, b) => a.itemName.localeCompare(b.itemName),
      },
      {
        title: 'Group Name',
        dataIndex: 'groupName',
        key: 'groupName',
        width: 150,
        sortDirections: sort,
        sorter: (a, b) => a.groupName.localeCompare(b.groupName),
      },
      {
        title: 'Category Name',
        dataIndex: 'categoryName',
        key: 'categoryName',
        width: 250,
        sortDirections: sort,
        sorter: (a, b) => a.categoryName.localeCompare(b.categoryName),
      },
      {
        title: 'Unit',
        dataIndex: 'unit',
        key: 'unit',
        width: 150,
        sortDirections: sort,
        sorter: (a, b) => a.unit.localeCompare(b.unit),
      },
    ]

    /* MAPING DATA TABEL */
    if (dataMR.length > 0) {
      dataMR
        .filter(val => val.itemCode.indexOf(valueDefault) >= 0)
        .map((val, key) =>
          dataTable.push({
            key,
            itemCode: val.itemCode,
            itemName: val.itemName,
            groupName: val.groupName,
            categoryName: val.categoryName,
            unit: val.uomPurch,
          }),
        )
    }

    const rowSelection = {
      onSelect: (record, selected) => this.onSelectChange(record, selected),
      onSelectAll: (selected, selectedRows) => this.onSelectAll(selected, selectedRows),
    }

    return (
      <Modal
        maskClosable={false}
        title={title}
        visible={visible}
        onOk={() => onOk(itemSelected)}
        onCancel={() => {
          this.handleReload()
          onCancel()
        }}
        width={1000}
        centered
      >
        <Form>
          <div className="row">
            <div className="col-md-6">
              <Form.Item className="ant-form-item-custom" {...formItemLayout} label="Item Code">
                <Input
                  name="itemCode"
                  value={itemCode}
                  onChange={value => this.handleChange('itemCode', value.target.value)}
                />
              </Form.Item>
              <Button type="default" icon="reload" onClick={() => this.handleReload()}>
                Reload
              </Button>
            </div>
            <div className="col-md-6">
              <Form.Item className="ant-form-item-custom" {...formItemLayout} label="Item Name">
                <Input
                  name="itemName"
                  value={itemName}
                  onChange={value => this.handleChange('itemName', value.target.value)}
                />
              </Form.Item>
              <div>
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
        <Table
          className="mt-4"
          {...option}
          rowSelection={rowSelection}
          columns={columns}
          dataSource={dataTable}
          loading={prMarketList.loadingOption}
          scroll={{ x: 1100, y: 200 }}
        />
      </Modal>
    )
  }
}

export default ModalComponent
