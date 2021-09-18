import React, { Component } from 'react'
import { Modal, Form, Input, Button, Table } from 'antd'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import SelectScap from '../../../components/CleanUIComponents/Scap/SelectScap'

const mapStateToProps = ({ posPointOfSales, mstItems, mstGroupItem, mstCategoryItem }) => ({
  mstItems,
  mstGroupItem,
  mstCategoryItem,
  dataItems: posPointOfSales.itemsOption,
  dataMR: posPointOfSales.marketDetailOption,
  dataGroupItem: posPointOfSales.groupOption,
  dataCategoryItem: posPointOfSales.categoryOption,
})

@withRouter
@connect(mapStateToProps)
class ModalComponent extends Component {
  constructor(props) {
    super(props)
    const { valueDefault, dataMR } = this.props
    this.state = {
      valueDefault,
      itemCode: '',
      itemName: '',
      groupCode: '',
      categoryCode: '',
      itemSelected: [],
      items: dataMR,
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
      groupCode: '',
      categoryCode: '',
    })
  }

  handleReload() {
    const { dispatch, moduleSet, prSource, marketCode } = this.props
    this.setState({
      valueDefault: '',
    })
    if (prSource === 'PR') {
      dispatch({
        type: 'mstItems/GET_DATA_ITEMS_OPTION',
        payload: {
          moduleSet,
        },
      })
    } else if (prSource === 'MR') {
      dispatch({
        type: 'prMarketList/GET_DATA_MARKET_LIST_DETAIL_OPTION',
        payload: {
          moduleSet,
          marketCode,
        },
      })
    }
  }

  handleGrouopChange(param) {
    const { dispatch, moduleSet } = this.props
    this.setState({ groupCode: param })
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
    const { dispatch, prSource, moduleSet } = this.props
    const { itemCode, itemName, groupCode, categoryCode, items } = this.state
    const filter = {
      itemCode,
      itemName,
      groupCode,
      categoryCode,
      moduleSet,
    }
    if (prSource === 'PR') {
      dispatch({
        type: 'mstItems/GET_DATA_ITEMS_OPTION',
        payload: filter,
      })
    } else if (prSource === 'MR') {
      const listData = items.filter(
        val =>
          val.itemCode.indexOf(itemCode) === 0 &&
          val.itemName.toLowerCase().indexOf(itemName.toLowerCase()) >= 0,
      )
      this.setState({
        items: listData,
      })
    }
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
      dataItems,
      visible,
      onOk,
      onCancel,
      title,
      dataGroupItem,
      dataCategoryItem,
      prSource,
    } = this.props
    const {
      itemCode,
      itemName,
      groupCode,
      categoryCode,
      itemSelected,
      items,
      valueDefault,
    } = this.state
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
    if (prSource === 'PR') {
      if (dataItems.length > 0) {
        dataItems
          .filter(val => val.itemCode.indexOf(valueDefault) === 0)
          .map((val, key) =>
            dataTable.push({
              key,
              itemCode: val.itemCode,
              itemName: val.itemName,
              groupCode: val.groupCode,
              groupName: val.groupName,
              categoryCode: val.cateCode,
              categoryName: val.cateName,
              unit: val.uomPurch,
            }),
          )
      }
    } else if (prSource === 'MR') {
      if (items.length > 0) {
        items
          .filter(val => val.itemCode.indexOf(valueDefault) === 0)
          .map((val, key) =>
            dataTable.push({
              key,
              itemCode: val.itemCode,
              itemName: val.itemName,
              groupCode: val.groupCode,
              groupName: val.groupName,
              categoryCode: val.cateCode,
              categoryName: val.categoryName,
              unit: val.uomPurch,
            }),
          )
      }
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
              {prSource === 'MR' && (
                <Form.Item className="ant-form-item-custom" {...formItemLayout} label="Item Code">
                  <Input
                    name="itemCode"
                    value={itemCode}
                    onChange={value => this.handleChange('itemCode', value.target.value)}
                  />
                </Form.Item>
              )}
              {prSource === 'PR' && (
                <div>
                  <Form.Item className="ant-form-item-custom" {...formItemLayout} label="Group">
                    <SelectScap
                      datas={optGroup}
                      value={groupCode}
                      onChange={value => this.handleGrouopChange(value)}
                    />
                  </Form.Item>
                  <Form.Item className="ant-form-item-custom" {...formItemLayout} label="Category">
                    <SelectScap
                      datas={optCategory}
                      value={categoryCode}
                      onChange={value => this.setState({ categoryCode: value })}
                    />
                  </Form.Item>
                  )
                </div>
              )}
              <Button type="default" icon="reload" onClick={() => this.handleReload()}>
                Reload
              </Button>
            </div>
            <div className="col-md-6">
              {prSource === 'PR' && (
                <Form.Item className="ant-form-item-custom" {...formItemLayout} label="Item Code">
                  <Input
                    name="itemCode"
                    value={itemCode}
                    onChange={value => this.handleChange('itemCode', value.target.value)}
                  />
                </Form.Item>
              )}
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
