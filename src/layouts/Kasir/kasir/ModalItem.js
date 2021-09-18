import React, { Component } from 'react'
import { Modal, Input, Form } from 'antd'
import ReactDataGrid from 'react-data-grid'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { currencyFormat } from '../../../utils/helper'

const mapStateToProps = ({ posKasir }) => ({
  posKasir,
  dataItem: posKasir.dataItem.data || [],
  loading: posKasir.loadingItem || [],
})

const currency = ({ value }) => <div>{currencyFormat(value)}</div>

@withRouter
@connect(mapStateToProps)
class ModalItem extends Component {
  constructor(props) {
    super(props)
    const { dataItem } = this.props
    this.refInput = React.createRef()
    this.refTable = React.createRef()
    this.state = {
      dataSource: dataItem,
      code: '',
      name: '',
      selected: '',
    }
  }

  hs = (state, val) => {
    this.setState({
      [state]: val,
    })
  }

  onCellSelected = ({ rowIdx }) => {
    this.setState({
      selected: rowIdx,
    })
  }

  // componentWillReceiveProps = np => {
  //   if(np.dataItem.length > 1) {
  //     console.log('di udpate lahh')
  //     this.setState({
  //       dataSource: np.dataItem
  //     })
  //   }
  // }

  render() {
    const { name, code, dataSource } = this.state
    const { visible, onCancel, onOk, loading } = this.props

    const columns = [
      {
        name: 'Item Code',
        dataIndex: 'itemCode',
        key: 'itemCode',
        width: 100,
        frozen: true,
      },
      {
        name: 'Item Name',
        dataIndex: 'itemName',
        key: 'itemName',
        width: 350,
      },
      {
        name: 'UOM ',
        dataIndex: 'uom',
        key: 'uom',
        width: 100,
      },
      {
        name: 'Unit Price',
        dataIndex: 'unitPrice',
        key: 'unitPrice',
        width: 150,
        formatter: currency,
      },
      {
        name: 'Stok',
        dataIndex: 'onHand',
        key: 'onHand',
        width: 100,
        formatter: currency,
      },
    ]

    const propsInputText = {
      type: 'text',
      size: 'small',
      className: 'pb-1 pt-1',
      // ref: this.refInput,
      // onKeyDown: e => this.handleKeyDown(e)
    }

    const dataTable = []
    if (dataSource.length > 0) {
      const filterData = dataSource.filter(
        x =>
          x.itemCode.indexOf(code) >= 0 &&
          x.itemName.toLowerCase().indexOf(name.toLowerCase()) >= 0,
      )
      const dataMap = filterData.map((el, idx) => ({
        ...el,
        uom: el.uomStock,
        index: idx + 1,
        unitPrice: el.salesPrice,
        qty: 1,
        amount: +el.salesPrice,
        cateCode: el.cateCode,
        groupCode: el.groupCode,
      }))
      dataTable.push(...dataMap)
    }

    const onGridKeyUp = e => {
      const { selected } = this.state
      if (e.keyCode === 13) {
        // console.log('masuk kesini yaa')
        const dataMap = dataTable.map((el, idx) => ({ index: idx + 1, ...el }))
        const filterData = dataMap.filter(el => el.index === selected + 1)
        // console.log(filterData, 'form modal Item')
        onOk(filterData.length ? filterData[0] : [])
      }
      if (e.keyCode === 83) {
        // focus in seacrh input
        this.refInput.current.input.focus()
      }
    }

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

    const handleKeyboard = e => {
      if (e.keyCode === 40) {
        const idx = 1
        const rowIdx = 1
        this.refInput.current.input.blur()
        this.grid.selectCell({ idx, rowIdx })
      }
    }

    return (
      <div>
        <Form>
          <Modal
            visible={visible}
            onCancel={() => onCancel()}
            width="70vw"
            title="MENU ITEM"
            bodyStyle={{ minHeight: '30vh' }}
          >
            <div role="none" onKeyDown={handleKeyboard}>
              <div className="row">
                <div className="col-md-6">
                  <Form.Item className="ant-form-item-custom" {...formItemLayout} label="Name">
                    <Input
                      {...propsInputText}
                      value={name}
                      onChange={e => this.hs('name', e.target.value)}
                      autoFocus
                      ref={this.refInput}
                    />
                  </Form.Item>
                </div>
                <div className="col-md-6">
                  <Form.Item className="ant-form-item-custom" {...formItemLayout} label="Code">
                    <Input
                      {...propsInputText}
                      value={code}
                      onChange={e => this.hs('code', e.target.value)}
                    />
                  </Form.Item>
                </div>
              </div>
            </div>
            <div className="mt-2">
              <ReactDataGrid
                /* eslint-disable */
                ref={grid => (this.grid = grid)}
                /* eslint-enable */
                columns={columns}
                rowGetter={i => dataTable[i]}
                rowsCount={dataTable.length}
                minHeight="30vh"
                enableCellSelect
                onCellSelected={this.onCellSelected}
                onGridKeyUp={onGridKeyUp}
                loading={loading}
              />
            </div>
          </Modal>
        </Form>
      </div>
    )
  }
}

export default Form.create('modalItem')(ModalItem)
