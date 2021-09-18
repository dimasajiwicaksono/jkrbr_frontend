import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import React, { Component } from 'react'
import { Button, Col, Form, Input, Modal, notification, Row, Spin } from 'antd'
import * as moment from 'moment'
import ID from 'moment/locale/id'
import ReactDataGrid from 'react-data-grid'
import SelectScap from '../../../components/CleanUIComponents/Scap/SelectScap'
import actions from '../../../redux/pos/posKasir/actions'
import { currencyFormat } from '../../../utils/helper'
import CardBayar from './card'
import ModalItem from './ModalItem'
import ModalDiskon from './ModalDiskon'
import ModalPembayaran from './ModalPembayaran'

const mapStateToProps = ({ posKasir, posPointOfSales }) => ({
  posKasir,
  optCustomer: posKasir.optCustomer,
  dataItem: posKasir.dataItem.data || [],
  loading:
    posKasir.loadingItem ||
    posKasir.loadingTenderMedia ||
    posKasir.loadingOption ||
    posKasir.loadingOutlet ||
    false,
  isSuccess: posKasir.isSuccess || false,
  billNo: posKasir.billNo || '',
  outletCode: posKasir.outletCode || '',
  selectedOutlet: posKasir.selectedOutlet || '',
  outletSelected: posPointOfSales.outletSelected || '',
})

// const moduleSet = 'posKasir'
const initData = [
  {
    no: 1,
    itemCode: '',
    itemName: '',
    unitPrice: 0,
    uom: '',
    disc: '',
    amount: '',
    tax: '',
    qty: 0,
    amountDiskon: 0,
    amountBeforeDisc: 0,
    totalDiscPrc: 0,
  },
]

const initDataPembayaran = [
  {
    no: 1,
    code: '',
    jumlah: 0,
    remark: '',
    noKartu: '',
    nama: '',
  },
]

const currency = ({ value }) => <div>{currencyFormat(value)}</div>

@withRouter
@connect(mapStateToProps)
class Kasir extends Component {
  constructor(props) {
    super(props)
    const { dataItem } = this.props
    this.refInput = React.createRef()
    this.state = {
      dataItem,
      // dataItem:[],
      dataSource: initData,
      dataPembayaran: initDataPembayaran,
      isModalItem: false,
      isModalDiskon: false,
      selectedRow: '',
      selected: '',
      selectedRowPembayaran: '',
      selectedPembayaran: '',
      dataRow: [],
      dataRowPembayaran: [],
      customer: 'C001',
      isSelected: true,
      // value:''
    }
  }

  static getDerivedStateFromProps = pp => {
    if (pp.isSuccess) {
      return {
        dataSource: initData,
        dataPembayaran: initDataPembayaran,
      }
    }
    if (pp.dataItem.length) {
      return {
        dataItem: pp.dataItem,
      }
    }
    return null
  }

  handleStateKasir(property, value) {
    const { dispatch } = this.props
    dispatch({
      type: actions.HANDLE_STATE,
      field: property,
      value,
    })
  }

  handleTitle(title) {
    const { dispatch } = this.props
    dispatch({
      type: 'content/HANDLE_TITLE',
      payload: title,
    })
  }

  onGridRowsUpdated = ({ fromRow, toRow, updated }) => {
    // console.log('FROM ROW:',fromRow, 'TO ROW: ', toRow)
    const { dataItem } = this.state
    // const { dataItem } = this.props
    const { dataSource: data, selected, selectedRow } = this.state
    const dataSelected = dataItem.filter(el => el.itemCode === updated.itemCode)

    const isExist = obj => data.some(el => el.itemCode === obj)
    // console.log(dataSelected, 'data select')
    // jika data ditemukan
    if (dataSelected.length === 1 && selected === 1) {
      // console.log('DATA DITEMUKAN')
      const dataMap = dataSelected.map(el => ({
        itemCode: el.itemCode || '',
        itemName: el.itemName,
        unitPrice: el.salesPrice,
        uom: el.uomStock,
        disc: 0,
        disc1: 0,
        disc2: 0,
        disc3: 0,
        totalDiscPrc: 0,
        amount: +el.salesPrice,
        tax: 0,
        qty: 1,
        amountDiskon: 0,
        amountBeforeDisc: 0,
        cateCode: el.cateCode,
        groupCode: el.groupCode,
      }))

      if ((selectedRow <= 1 ? 0 : selectedRow - 1) === fromRow) {
        // console.log(data[fromRow].itemCode, 'ITEM CODE ')
        if (dataSelected[0].itemCode === data[fromRow].itemCode) {
          // console.log('NGGAK USAH DIUPDATE')
          data[fromRow] = {
            ...data[fromRow],
          }
        }

        if (dataSelected[0].itemCode !== data[fromRow].itemCode) {
          // console.log('MSUK KE UPDATE-AN')
          const arrAppend = [
            // data dari state (dataSource) difilter jangan ada itemCode !== ''
            ...data.filter(el => el.itemCode !== ''),
            isExist(dataSelected[0].itemCode) ? { itemCode: '' } : dataMap[0],
          ].filter(el => el.itemCode !== '') // filter lagi jika ada itemCode === ''

          const idx = 1
          const rowIdx = arrAppend.length
          this.grid.selectCell({ idx, rowIdx })

          this.setState({
            isSelected: true,
            dataSource: [...arrAppend, ...initData],
          })
        }
      }
    }

    if (dataSelected.length === 0 && selected === 1) {
      // console.log('DTA TIDAK DITEMUKAN')
      this.setState({
        isModalItem: true,
      })
    }

    const fnItemCode = (args1, args2) => (args1 === args2 ? args1 : '')

    this.setState(state => {
      // console.log('DATA DIGANTI YAAAAH')
      const dataSource = state.dataSource.slice()
      for (let i = fromRow; i <= toRow; i += 1) {
        dataSource[i] = {
          ...dataSource[i],
          ...updated,
          // check jika itemCode duplikat => duplikat maka itemCode jadiin string kosong
          itemCode: isExist(updated.itemCode)
            ? fnItemCode(updated.itemCode, dataSource[i].itemCode)
            : dataSource[i].itemCode,
          amount: (+updated.qty || dataSource[i].qty) * +dataSource[i].unitPrice,

          amountBeforeDisc: +dataSource[i].unitPrice * (+updated.qty || dataSource[i].qty),
          disc:
            (+updated.qty || dataSource[i].qty) *
            +dataSource[i].unitPrice *
            (+dataSource[i].totalDiscPrc / 100),
        }
      }
      return {
        dataSource,
        isSelected: true,
      }
    })
  }

  onGridRowsPembayaran = ({ fromRow, toRow, updated }) => {
    this.setState(state => {
      // console.log('DATA DIGANTI YAAAAH')
      const dataPembayaran = state.dataPembayaran.slice()
      for (let i = fromRow; i <= toRow; i += 1) {
        dataPembayaran[i] = {
          ...dataPembayaran[i],
          ...updated,
          jumlah: +updated.jumlah || dataPembayaran[i].jumlah,
        }
      }
      return {
        dataPembayaran,
      }
    })
  }

  handleCancel = () => {
    const { hsGlobal } = this.props
    this.setState({
      isModalItem: false,
      isModalDiskon: false,
    })
    hsGlobal('modalBayar', false)
  }

  handleOk = val => {
    const { dataSource } = this.state
    const isExist = obj => dataSource.some(el => el.itemCode === obj)
    const dataAppend = [
      ...dataSource.filter(e => e.itemCode !== ''),
      isExist(val.itemCode)
        ? { itemCode: '' }
        : {
            ...val,
            totalDiscPrc: 0,
            tax: 0,
            amountBeforeDisc: 0,
            amountDiskon: 0,
            itemCode: val.itemCode || '',
            itemName: val.itemName,
            unitPrice: val.salesPrice,
            uom: val.uomStock,
            disc: 0,
            disc1: 0,
            disc2: 0,
            disc3: 0,
            amount: +val.salesPrice,
            cateCode: val.cateCode,
            groupCode: val.groupCode,
          },
    ].filter(el => el.itemCode !== '')

    const idx = 1
    const rowIdx = dataAppend.length
    this.grid.selectCell({ idx, rowIdx })

    this.setState({
      dataSource: [...dataAppend, ...initData],
    })
    this.handleCancel()
  }

  onCellSelected = ({ rowIdx, idx }) => {
    this.setState({
      selected: idx,
      selectedRow: rowIdx + 1,
    })
  }

  onCellSelectedPembayaran = ({ rowIdx, idx }) => {
    this.setState({
      selectedPembayaran: idx,
      selectedRowPembayaran: rowIdx + 1,
    })
  }

  hs = (state, value) => {
    this.setState({
      [state]: value,
    })
  }

  handleCancelBayar = () => {
    this.setState({
      dataSource: initData,
      dataPembayaran: initDataPembayaran,
    })
    this.handleCancel()
  }

  handleSubmit = lnBayar => {
    const { dataSource, dataPembayaran } = this.state
    const { dispatch, hsGlobal, billNo, outletCode } = this.props
    const { confirm } = Modal
    confirm({
      title: 'Apakah anda yakin menyimpan?',
      content: '',
      okButtonProps: {
        disabled: lnBayar === 0,
      },
      async onOk() {
        try {
          const sumDiskon = dataSource.reduce((a, { disc }) => a + +disc, 0)
          const sumTotal = dataSource.reduce((a, { amount }) => a + amount, 0) - sumDiskon
          const sumTax = dataSource.reduce((a, { tax }) => a + +tax, 0)
          const totalBayar = sumTotal - (sumDiskon + sumTax)
          // pembulatan ke bawah
          const round = Math.floor(totalBayar)
          const roundedVal = totalBayar - round

          const grandTotal = totalBayar - roundedVal

          const details = dataSource
            .map(el => ({
              salesPrice: el.unitPrice || 0,
              qty: el.qty || 0,
              itemName: el.itemName || '',
              itemCode: el.itemCode || '',
              cateCode: el.cateCode || '',
              groupCode: el.groupCode || '',
            }))
            .filter(el => el.itemName !== '')

          const settles = dataPembayaran.map(el => ({
            settleCode: (el.code || '').trim(),
            tenderName: (el.nama || '').trim(),
            amount: +el.jumlah,
            cardNumber: el.noKartu || '',
            cardName: el.pemegangKartu || '',
          }))

          const payload = {
            prDate: moment(new Date()).format('YYYY-MM-DD'),
            outletCode,
            SubTotal: sumTotal,
            Discount: sumDiskon,
            ServValue: 0,
            TaxValue: sumTax,
            Rounded: roundedVal,
            GrandTotal: grandTotal,
            TransNetto: grandTotal,
            details,
            settles,
          }
          dispatch({
            type: actions.HANDLE_SAVE,
            isSuccess: true,
            noBill: billNo,
            payload,
          })
        } catch (err) {
          notification.error({
            message: 'ERROR',
          })
        }
        hsGlobal('isBayar', false)
        return true
      },
      onCancel() {
        return hsGlobal('isBayar', false)
      },
    })
  }

  // CALL WHEN YOU PRESS F10 will directly execute
  executeBayar = (otl, lnItem, lnBayar) => {
    const { isBayar } = this.props
    const isConditional = otl !== '' && isBayar && lnItem > 0
    return isConditional ? this.handleSubmit(lnBayar) : null
  }

  handleOkDiskonCell = no => {
    const idx = 6
    const rowIdx = no
    return this.grid.selectCell({ idx, rowIdx })
  }

  render() {
    const {
      optCustomer,
      posKasir /* dataItem */,
      loading,
      hsGlobal,
      modalBayar,
      selectedOutlet,
      billNo,

      // isBayar
    } = this.props
    const {
      dataSource,
      isModalItem,
      isModalDiskon,
      dataRow,
      dataRowPembayaran,
      customer,
      isSelected,
      dataPembayaran,
      // value
    } = this.state

    const ln = dataSource.filter(el => el.itemCode !== '').length
    const lnBayar = dataPembayaran.filter(el => el.code !== '').length

    this.executeBayar(billNo, ln, lnBayar)

    const noBill = billNo !== '' ? `${billNo}` : ''

    const formItemUp = {
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

    const columns = [
      {
        name: 'No',
        key: 'no',
        width: 60,
      },
      {
        name: 'Kode Barang',
        dataIndex: 'itemCode',
        key: 'itemCode',
        width: 100,
        editable: true,
      },
      {
        name: 'Nama Barang',
        dataIndex: 'itemName',
        key: 'itemName',
        width: 400,
      },
      {
        name: 'Qty',
        dataIndex: 'qty',
        key: 'qty',
        width: 100,
        editable: true,
      },
      {
        name: 'UOM',
        dataIndex: 'uom',
        key: 'uom',
        width: 100,
      },
      {
        name: '@ Harga',
        dataIndex: 'unitPrice',
        key: 'unitPrice',
        width: 100,
        formatter: currency,
      },
      {
        name: 'Diskon',
        dataIndex: 'disc',
        key: 'disc',
        width: 100,
        formatter: currency,
      },
      {
        name: 'Tax (%)',
        dataIndex: 'tax',
        key: 'tax',
        width: 100,
        // editable: true,
        formatter: currency,
      },
      {
        name: 'Total Harga',
        dataIndex: 'amount',
        key: 'amount',
        width: 100,
        formatter: currency,
      },
    ].map(el => ({ ...el, resizable: true }))

    const renderInput = (val = 0) => (
      <Row gutter={8}>
        <Col span={4}>
          <p>Rp</p>
        </Col>
        <Col span={20}>
          <Input
            {...propsInputText}
            value={currencyFormat(val)}
            className="text-dark font-weight-bold"
            disabled
          />
        </Col>
      </Row>
    )

    // const totalSblmDisc = dataSource.reduce((a, { amountBeforeDisc }) => a + +amountBeforeDisc, 0)
    const sumDiskon = dataSource.reduce((a, { disc }) => a + +disc, 0)
    const sumTax = dataSource.reduce((a, { tax }) => a + +tax, 0)
    const sumTotal = dataSource.reduce((a, { amount }) => a + amount, 0) - sumDiskon
    const totalBayar = sumTotal - (sumDiskon + sumTax)

    // pembulatan ke bawah
    const round = Math.floor(totalBayar)
    const roundedVal = totalBayar - round

    const grandTotal = totalBayar - roundedVal

    const dataRender = dataSource.map((el, idx) => ({ ...el, no: idx + 1 }))
    const dataPembayaranRender = dataPembayaran.map((el, idx) => ({ ...el, no: idx + 1 }))

    const sumTotalBayar = dataPembayaranRender.reduce((a, { jumlah }) => a + +jumlah, 0)
    const sisaTagihan = grandTotal - sumTotalBayar

    const item = dataRender.length - 1
    const jumlahItem = dataRender.reduce((a, { qty }) => a + +qty, 0)

    const onGridKeyUp = e => {
      const { selected, selectedRow } = this.state
      if (e.keyCode === 13) {
        // for enter
        if (selected === 1 && !isSelected) {
          this.setState({
            isModalItem: true,
          })
        }
        if (selected === 6) {
          const dataSelected = dataRender.filter(el => el.no === selectedRow)
          this.setState({
            isModalDiskon: true,
            dataRow: dataSelected.length > 0 ? dataSelected[0] : [],
          })
        }
      }
      if (e.keyCode === 46 && selected === 0) {
        const dataSelected = dataRender.filter(el => el.no !== selectedRow)
        this.setState({
          dataSource: dataSelected,
        })
      }
    }

    /** UNTUK HANDLE PEMBAYARAN KETIKA DI KLIK */

    const onGridKeyUpPembayaran = e => {
      const { selectedPembayaran, selectedRowPembayaran } = this.state
      if (e.keyCode === 46 && selectedPembayaran === 0) {
        const dataSelected = dataPembayaranRender
          .filter(el => el.no !== selectedRowPembayaran)
          .map((el, idx) => ({ ...el, no: idx }))
        this.setState({
          dataPembayaran: dataSelected,
        })
      }

      if (e.keyCode === 13 && selectedPembayaran === 2) {
        const dataSelected = dataPembayaranRender.filter(el => el.no === selectedRowPembayaran)
        this.setState({
          dataRowPembayaran: dataSelected.length > 0 ? dataSelected[0] : [],
        })
        return hsGlobal('modalBayar', true)
      }
      return null
    }

    const handleOkDiskon = val => {
      dataSource[val.no - 1] = {
        ...dataSource[val.no - 1],
        disc: val.disc,
        disc1: val.disc1,
        disc2: val.disc2,
        disc3: val.disc3,
        totalDiscPrc: val.totalDiscPrc,
      }

      this.handleOkDiskonCell(val.no - 1)
      return this.handleCancel()
    }

    const handleOkPembayaran = val => {
      const isExist = () => dataPembayaran.some(el => el.code === val.code)
      const dataAppend = [
        ...dataPembayaran.filter(e => e.code !== ''),
        isExist()
          ? { code: '' }
          : {
              ...val,
              jumlah: val.jumlah,
              nama: val.nama,
              code: val.code,
              metodeBayar: val.metodeBayar,
              remark: val.remark,
              noKartu: val.noKartu,
              pemegangKartu: val.pemegangKartu,
            },
      ]
        .filter(el => el.code !== '')
        .map((el, idx) => ({ ...el, no: idx }))

      const index = dataAppend.findIndex(el => el.code === val.code)

      dataAppend[index] = {
        ...dataAppend[index],
        jumlah: val.jumlah,
        nama: val.nama,
        code: val.code,
        metodeBayar: val.metodeBayar,
        remark: val.remark,
        noKartu: val.noKartu,
        pemegangKartu: val.pemegangKartu,
      }

      this.setState({
        dataPembayaran: dataAppend,
      })
      this.handleCancel()
    }

    const tablePembayaran = [
      {
        name: 'No',
        title: 'No',
        key: 'no',
        dataIndex: 'no',
        width: 60,
      },
      {
        name: 'Nama Pembayaran',
        title: 'Nama Pembayaran',
        key: 'nama',
        dataIndex: 'nama',
        width: 200,
      },
      {
        name: 'Jumlah',
        title: 'Jumlah',
        key: 'jumlah',
        dataIndex: 'jumlah',
        width: 200,
        formatter: currency,
      },
    ].map(el => ({ ...el, resizable: true }))

    const isButtonDisabled = billNo === '' || grandTotal <= 0 || dataPembayaranRender.length < 1

    return (
      <React.Fragment>
        <Spin spinning={loading}>
          <Form>
            <div className="row">
              <div className="col-md-6">
                <Form.Item
                  className="ant-form-item-custom mt-0 mb-0"
                  {...formItemUp}
                  label="Customer"
                >
                  <SelectScap
                    datas={optCustomer.length > 0 ? optCustomer : []}
                    value={customer}
                    onChange={e => this.hs('customer', e)}
                    loading={posKasir.loadingOption}
                  />
                </Form.Item>
                <Form.Item
                  className="ant-form-item-custom mt-0 mb-0"
                  {...formItemUp}
                  label="No Bill"
                >
                  <Input
                    {...propsInputText}
                    value={noBill}
                    disabled
                    style={{ fontWeight: 'bold', color: 'black' }}
                  />
                </Form.Item>
                <Form.Item
                  className="ant-form-item-custom mt-0 mb-0"
                  {...formItemUp}
                  label="Tgl Transaksi"
                >
                  <Input
                    {...propsInputText}
                    value={moment()
                      .locale('id', ID)
                      .format('LL')}
                    style={{ width: '50%', fontWeight: 'bold', color: 'black' }}
                    disabled
                  />
                </Form.Item>
              </div>
              <div className="col-md-6">
                <Form.Item
                  className="ant-form-item-custom mt-0 mb-0 "
                  {...formItemUp}
                  label="Outlet"
                >
                  <Input
                    {...propsInputText}
                    className="font-weight-bold text-dark"
                    value={selectedOutlet}
                    disabled
                  />
                </Form.Item>
                <Form.Item
                  className="ant-form-item-custom mt-0 mb-0"
                  {...formItemUp}
                  label="Lokasi"
                >
                  <Input
                    {...propsInputText}
                    className="font-weight-bold text-dark"
                    value=""
                    disabled
                  />
                </Form.Item>
                <Form.Item className="ant-form-item-custom" {...formItemUp} label="Grand Total">
                  {renderInput(grandTotal)}
                </Form.Item>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6" />
              <div className="col-md-6">
                <div className="text-right m-2">
                  <h3>{`${item} Item (qty: ${jumlahItem})`}</h3>
                </div>
              </div>
            </div>

            <div className="mt-3">
              <ReactDataGrid
                /* eslint-disable */
                ref={grid => (this.grid = grid)}
                /* eslint-enable */
                columns={columns}
                rowGetter={i => (dataRender.length < 1 ? initData[i] : dataRender[i])}
                rowsCount={dataRender.length < 1 ? 1 : dataRender.length + 1}
                minHeight={200}
                onGridRowsUpdated={this.onGridRowsUpdated}
                enableCellSelect
                onCellSelected={this.onCellSelected}
                onGridKeyUp={onGridKeyUp}
              />
            </div>
            <div className="row">
              <div className="col-md-5 mt-4">
                <ReactDataGrid
                  columns={tablePembayaran}
                  rowGetter={i =>
                    dataPembayaranRender.length < 1
                      ? initDataPembayaran[i]
                      : dataPembayaranRender[i]
                  }
                  rowsCount={dataPembayaranRender.length < 1 ? 1 : dataPembayaranRender.length + 1}
                  minHeight={150}
                  onGridRowsUpdated={this.onGridRowsPembayaran}
                  enableCellSelect
                  onCellSelected={this.onCellSelectedPembayaran}
                  onGridKeyUp={onGridKeyUpPembayaran}
                />
                <div className="mt-3 d-flex flex-column">
                  <strong>F9: Pilih Pembayaran</strong>
                  <strong>F10: Simpan Transaksi</strong>
                  <strong>F11: Fullscreen</strong>
                </div>
              </div>
              <div className="col-md-7 mt-4">
                <div className="ml-4">
                  <CardBayar
                    sumTotalBayar={sumTotalBayar}
                    sumDiskon={sumDiskon}
                    sumTotal={grandTotal}
                    sumTax={0}
                  />
                </div>
                <div className="toolbar mt-2 text-right">
                  <Button
                    type={isButtonDisabled ? 'default' : 'primary'}
                    icon="save"
                    className="mr-4"
                    onClick={() => this.handleSubmit(lnBayar)}
                    disabled={isButtonDisabled}
                  >
                    Simpan
                  </Button>
                  <Button
                    type="default"
                    icon="reload"
                    onClick={this.handleCancelBayar}
                    disabled={isButtonDisabled}
                  >
                    Batal
                  </Button>
                </div>
              </div>
            </div>
          </Form>
        </Spin>
        {isModalItem && (
          <ModalItem
            visible={isModalItem}
            onCancel={() => this.handleCancel()}
            onOk={val => this.handleOk(val)}
          />
        )}
        {isModalDiskon && (
          <ModalDiskon
            visible={isModalDiskon}
            onCancel={() => this.handleCancel()}
            data={dataRow}
            onOk={val => handleOkDiskon(val)}
          />
        )}

        {modalBayar && (
          <ModalPembayaran
            visible={modalBayar}
            onCancel={() => this.handleCancel()}
            data={dataRowPembayaran}
            dataPembayaran={dataPembayaran}
            sisaTagihan={sisaTagihan}
            grandTotal={{ grandTotal }}
            onOk={val => handleOkPembayaran(val)}
          />
        )}
      </React.Fragment>
    )
  }
}

export default Kasir
