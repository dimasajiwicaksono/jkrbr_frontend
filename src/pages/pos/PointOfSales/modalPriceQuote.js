import React, { Component } from 'react'
import { Modal, Form, Input, Button, Table, Icon } from 'antd'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import SelectScap from '../../../components/CleanUIComponents/Scap/SelectScap'
import { currencyFormat } from '../../../utils/helper'

const mapStateToProps = ({ posPointOfSales, mstItems, mstGroupItem, mstCategoryItem }) => ({
  mstItems,
  mstGroupItem,
  mstCategoryItem,
  dataItems: posPointOfSales.itemsOption,
  dataGroupItem: posPointOfSales.groupOption,
  dataCategoryItem: posPointOfSales.categoryOption,
})

@withRouter
@connect(mapStateToProps)
class ModalComponent extends Component {
  constructor(props) {
    super(props)
    const { dataItems, valueDefault = '' } = this.props
    this.state = {
      itemCode: valueDefault,
      itemName: '',
      groupCode: '',
      categoryCode: '',
      items: dataItems,
      itemSelected: [],
    }
  }

  componentWillReceiveProps(nextProps) {
    const { items } = this.state
    if (items !== nextProps.dataItems) {
      this.setState({ items: nextProps.dataItems })
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
        salesPrice: record.salesPrice,
        cateCode: record.categoryCode,
        groupCode: record.groupCode,
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
      groupCode: '',
      categoryCode: '',
    })
  }

  handleReloadGroup = () => {
    const { dispatch, moduleSet } = this.props
    dispatch({
      type: 'mstGroupItem/GET_DATA_GROUP_ITEM_OPTION',
      payload: {
        moduleSet,
      },
    })
  }

  handleReloadCategory = () => {
    const { dispatch, moduleSet } = this.props
    const { groupCode } = this.state
    dispatch({
      type: 'mstCategoryItem/GET_DATA_CATEGORY_ITEM_OPTION',
      payload: {
        groupCode,
        moduleSet,
      },
    })
  }

  handleReload() {
    const { dispatch, moduleSet } = this.props
    this.handleClear()
    dispatch({
      type: 'mstItems/GET_DATA_ITEMS_OPTION',
      payload: {
        moduleSet,
      },
    })
  }

  handleGrouopChange(param) {
    const { dispatch, moduleSet } = this.props
    this.setState({ groupCode: param !== undefined ? param : '' })
    dispatch({
      type: 'mstCategoryItem/GET_DATA_CATEGORY_ITEM_OPTION',
      payload: {
        categoryCode: '',
        categoryName: '',
        groupCode: param,
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
    const { dataItems } = this.props
    const { itemCode, itemName, groupCode, categoryCode } = this.state
    const itemsFilter = dataItems.filter(
      x =>
        x.itemCode.toLowerCase().indexOf(itemCode.toLowerCase()) >= 0 &&
        x.itemName.toLowerCase().indexOf(itemName.toLowerCase()) >= 0 &&
        x.groupCode.toLowerCase().indexOf(groupCode.toLowerCase()) >= 0 &&
        x.cateCode.toLowerCase().indexOf(categoryCode.toLowerCase()) >= 0,
    )
    this.setState({
      items: itemsFilter,
    })
  }

  handleSearchDisable() {
    const { itemCode, itemName, groupCode, categoryCode } = this.state
    if (itemCode === '' && itemName === '' && groupCode === '' && categoryCode === '') {
      return true
    }
    return false
  }

  render() {
    const {
      mstItems,
      visible,
      onOk,
      onCancel,
      title,
      mstCategoryItem,
      dataGroupItem,
      dataCategoryItem,
    } = this.props
    const { itemCode, itemName, groupCode, categoryCode, itemSelected, items } = this.state
    const sort = ['descend', 'ascend']
    const pagination = { pageSize: 50 }
    const dataTable = []
    const optGroup = []
    const optCategory = []
    const option = {
      bordered: true,
      pagination,
      size: 'small',
      hasData: true,
    }
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 15 },
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
        title: 'Price',
        dataIndex: 'salesPrice',
        key: 'salesPrice',
        width: 150,
        sorter: (a, b) => a.salesPrice.localeCompare(b.salesPrice),
        align: 'right',
        render: text => <div>{currencyFormat(text)}</div>,
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

    /* MAPING GROUP */
    if (dataGroupItem.length > 0) {
      dataGroupItem.map(val =>
        optGroup.push({
          value: val.groupCode,
          title: val.groupName,
        }),
      )
    }

    /* MAPING CATEGORY */
    if (dataCategoryItem.length > 0) {
      dataCategoryItem.map(val =>
        optCategory.push({
          value: val.cateCode,
          title: val.cateName,
        }),
      )
    }

    /* MAPING DATA TABEL */
    if (items.length > 0) {
      items
        .filter(
          x =>
            x.itemCode.toLowerCase().indexOf(itemCode.toLowerCase()) >= 0 &&
            x.itemName.toLowerCase().indexOf(itemName.toLowerCase()) >= 0 &&
            x.groupCode.toLowerCase().indexOf(groupCode.toLowerCase()) >= 0 &&
            x.cateCode.toLowerCase().indexOf(categoryCode.toLowerCase()) >= 0,
        )
        .map(val =>
          dataTable.push({
            key: val.itemCode,
            itemCode: val.itemCode,
            itemName: val.itemName,
            groupCode: val.groupCode,
            groupName: val.groupName,
            categoryCode: val.cateCode,
            categoryName: val.cateName,
            unit: val.uomPurch,
            salesPrice: val.unitPrice,
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
        onCancel={() => onCancel()}
        width={1000}
        centered
      >
        <Form>
          <div className="row">
            <div className="col-md-6">
              <Form.Item className="ant-form-item-custom" {...formItemLayout} label="Group">
                {optGroup.length < 1 && (
                  <div>
                    No data.
                    <Button icon="reload" className="ml-4" onClick={this.handleReloadGroup}>
                      Reload
                    </Button>
                  </div>
                )}
                {optGroup.length >= 1 && (
                  <SelectScap
                    datas={optGroup}
                    value={groupCode}
                    onChange={value => this.handleGrouopChange(value)}
                  />
                )}
              </Form.Item>
              <Form.Item className="ant-form-item-custom" {...formItemLayout} label="Category">
                {mstCategoryItem.loadingOption && (
                  <div>
                    <Icon type="loading" /> Please wait
                  </div>
                )}
                {!mstCategoryItem.loadingOption && groupCode !== '' && optCategory.length < 1 && (
                  <div>
                    No data.
                    <Button icon="reload" className="ml-4" onClick={this.handleReloadCategory}>
                      Reload
                    </Button>
                  </div>
                )}
                {!mstCategoryItem.loadingOption && groupCode !== '' && optCategory.length >= 1 && (
                  <SelectScap
                    datas={optCategory}
                    value={categoryCode}
                    onChange={value => this.setState({ categoryCode: value })}
                  />
                )}
                {((groupCode === '' && optCategory.length >= 1) ||
                  (groupCode === '' && optCategory.length < 1)) &&
                  !mstCategoryItem.loadingOption && <SelectScap datas={optCategory} disabled />}
              </Form.Item>
              <Button type="default" icon="reload" onClick={() => this.handleReload()}>
                Reload
              </Button>
            </div>
            <div className="col-md-6">
              <Form.Item className="ant-form-item-custom" {...formItemLayout} label="Item Code">
                <Input
                  name="itemCode"
                  value={itemCode}
                  onChange={value => this.handleChange('itemCode', value.target.value)}
                />
              </Form.Item>
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
          loading={mstItems.loadingOption}
          scroll={{ x: 1100, y: 200 }}
        />
      </Modal>
    )
  }
}

export default ModalComponent
