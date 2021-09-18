import React, { Component } from 'react'
import { Modal, Form, Input, Button, Table } from 'antd'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import SelectScap from '../../../components/CleanUIComponents/Scap/SelectScap'

const mapStateToProps = ({ setInvOpeningBalance, mstItems }) => ({
  mstItems,
  dataItems: setInvOpeningBalance.itemsOption,
  dataGroupItem: setInvOpeningBalance.groupOption,
  dataCategoryItem: setInvOpeningBalance.categoryOption,
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
    const { dataItems } = this.props
    if (dataItems !== nextProps.dataItems) {
      this.setState({
        items: nextProps.dataItems,
      })
    }
  }

  onSelectChange(record, selected) {
    const { lastKey, rec } = this.props
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
        categoryName: record.categoryName,
        groupName: record.groupName,
        units: record.uomStock,
        qty: record.qty,
        qtyFrom: record.qtyFrom,
        unitPrice: record.unitPrice,
        amount: 0,
        index: lastKey,
        lastIndex: rec.index,
        key: rec.key,
      })
    }
  }

  onSelectAll(selected, selectedRows) {
    const { lastKey, rec } = this.props
    const { itemSelected } = this.state
    if (selected === false) {
      this.setState({ itemSelected: [] })
    } else {
      selectedRows.map(record =>
        itemSelected.push({
          itemCode: record.itemCode,
          itemName: record.itemName,
          categoryName: record.categoryName,
          groupName: record.groupName,
          units: record.uomStock,
          qty: record.qty,
          qtyFrom: record.qtyFrom,
          unitPrice: record.unitPrice,
          amount: 0,
          index: lastKey,
          lastIndex: rec.index,
          key: rec.key,
        }),
      )
    }
  }

  handleClear = () => {
    const { dataItems } = this.props
    this.setState({
      itemCode: '',
      itemName: '',
      groupCode: '',
      categoryCode: '',
    })
    this.setState({
      items: dataItems,
    })
  }

  handleGroupChange(param) {
    const { dispatch, moduleSet } = this.props
    const { groupCode } = this.state
    if (param !== undefined && param !== groupCode) {
      this.setState({
        groupCode: param,
        categoryCode: '',
      })
      dispatch({
        type: 'mstCategoryItem/GET_DATA_CATEGORY_ITEM_OPTION',
        payload: {
          categoryCode: '',
          categoryName: '',
          groupCode: param,
          moduleSet,
        },
      })
    } else {
      this.setState({
        groupCode: '',
        categoryCode: '',
      })
    }
  }

  handleCategoryChange(param) {
    if (param !== undefined) {
      this.setState({ categoryCode: param })
    } else {
      this.setState({ categoryCode: '' })
    }
  }

  handleReload() {
    const { dispatch, moduleSet, locationCode } = this.props
    dispatch({
      type: 'mstItems/GET_DATA_ITEMS_OPTION',
      payload: {
        moduleSet,
        locaCode: locationCode,
      },
    })
  }

  handleSearch() {
    const { dataItems } = this.props
    const { itemCode, itemName, groupCode, categoryCode } = this.state
    const filterData = dataItems.filter(
      val =>
        val.itemCode.indexOf(itemCode) >= 0 &&
        val.itemName.toLowerCase().indexOf(itemName.toLowerCase()) >= 0 &&
        val.groupCode.indexOf(groupCode) >= 0 &&
        val.cateCode.indexOf(categoryCode) >= 0,
    )
    this.setState({
      items: filterData,
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
    const { visible, onOk, onCancel, title, mstItems, dataGroupItem, dataCategoryItem } = this.props
    const { itemCode, itemName, itemSelected, items, groupCode, categoryCode } = this.state
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
          vals =>
            vals.itemCode.indexOf(itemCode) >= 0 &&
            vals.itemName.toLowerCase().indexOf(itemName.toLowerCase()) >= 0 &&
            vals.groupCode.indexOf(groupCode) >= 0 &&
            vals.cateCode.indexOf(categoryCode) >= 0,
        )
        .map((val, key) =>
          dataTable.push({
            key,
            itemCode: val.itemCode,
            itemName: val.itemName,
            groupName: val.groupName,
            categoryName: val.cateName,
            uomStock: val.uomStock,
            qty: 0,
            qtyFrom: 0,
            unitPrice: val.unitPrice,
          }),
        )
    }

    const rowSelection = {
      onSelect: (record, selected) => this.onSelectChange(record, selected),
      onSelectAll: (selected, selectedRows) => this.onSelectAll(selected, selectedRows),
    }

    return (
      <Modal
        title={title}
        visible={visible}
        onOk={() => onOk(itemSelected)}
        onCancel={() => onCancel()}
        width={1000}
        centered
        maskClosable={false}
      >
        <Form>
          <div className="row">
            <div className="col-md-6">
              <Form.Item className="ant-form-item-custom" {...formItemLayout} label="Group">
                <SelectScap
                  datas={optGroup}
                  value={groupCode}
                  onChange={value => {
                    this.handleGroupChange(value)
                  }}
                />
              </Form.Item>
              <Form.Item className="ant-form-item-custom" {...formItemLayout} label="Category">
                {groupCode === '' && <SelectScap disabled datas={optCategory} />}
                {groupCode !== '' && (
                  <SelectScap
                    datas={optCategory}
                    value={categoryCode}
                    onChange={value => this.handleCategoryChange(value)}
                  />
                )}
              </Form.Item>
            </div>
            <div className="col-md-6">
              <Form.Item className="ant-form-item-custom" {...formItemLayout} label="Item Code">
                <Input
                  name="itemCode"
                  value={itemCode}
                  onChange={value => this.setState({ itemCode: value.target.value })}
                />
              </Form.Item>
              <Form.Item className="ant-form-item-custom" {...formItemLayout} label="Item Name">
                <Input
                  name="itemName"
                  value={itemName}
                  onChange={value => this.setState({ itemName: value.target.value })}
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
        <Button type="default" icon="reload" onClick={() => this.handleReload()}>
          Reload
        </Button>
        <Table
          {...option}
          className="mt-4"
          rowSelection={rowSelection}
          columns={columns.dataTable}
          rowClassName={record => (itemSelected.itemCode === record.itemCode ? 'row-selected' : '')}
          dataSource={dataTable}
          loading={mstItems.loadingOption}
          scroll={{ x: false, y: 200 }}
        />
      </Modal>
    )
  }
}

export default ModalComponent
