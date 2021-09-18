import React, { Component } from 'react'
import { Button } from 'antd'
import { withRouter } from 'react-router-dom'
import { saveAs } from 'file-saver'
import { connect } from 'react-redux'
import * as xls from 'xlsx'
import * as moment from 'moment'
import { dateFormat } from '../../../utils/helper'

const mapStateToProps = ({ setInvOpeningBalance }) => ({
  setInvOpeningBalance,
  dataDetail: setInvOpeningBalance.setInvOpeningBalanceDetail,
})

@withRouter
@connect(mapStateToProps)
class ExcelFormat extends Component {
  exportToExcel(data) {
    /*  GET NEW WORK BOOK */
    const wb = xls.utils.book_new()
    wb.Props = {
      Title: 'INVENTORY OPENING BALANCE',
      Subject: 'INVENTORY OPENING BALANCE EXCEL',
      Author: 'SCAP',
      CreatedDate: new Date(),
    }

    /* NAME OF SHEET ex: Sheet1 */
    wb.SheetNames.push('Sheet1')

    const { refNo, locaName, refDate } = data.header
    const wsData = []
    const tokenData = JSON.parse(atob(localStorage.getItem('token').split('.')[1]))
    const date = moment(refDate).format(dateFormat.formatDateID)

    /* TEMPLATE DATA CELL IN WORKSHEET
    wsDATA[0] means cell placed on ROW 1 (index + 1)
    ["", "", ""] means Place of Coloumn (A, B, C, ...)
    */
    wsData[0] = ['', '', '', '', '', '', '']
    wsData[1] = [`${tokenData.compName}`, '', '', '', '', '', '']
    wsData[2] = ['INVENTORY OPENING BALANCE', '', '', '', '', '', '']
    wsData[3] = ['Ref No:', '', `${refNo}`, '', '', '', '']
    wsData[4] = [`Date :`, '', `${date}`, '', '', '', '']
    wsData[5] = [`Location :`, '', `${locaName}`, '', '', '', '']
    wsData[6] = ['', '', '', '', '', '', '']
    wsData[7] = ['', '', '', '', '', '', '']
    wsData[8] = ['No', 'Item Code', 'Item Name', 'Qty', 'Unit', 'Unit Price', 'Amount']
    data.data.forEach(e => {
      const item = {
        No: e.itemNo,
        ItemCode: e.itemCode,
        /* REMOVE space START and END from sentences */
        itemName: e.itemName.trim(),
        Qty: Number(e.qty),
        Unit: e.uomStock,
        /* unit price and amount return STRING
          so, we convert them with Number() method.
          Sometimes it’s an integer. Other times it’s a point number.
          And if you pass in a string with random text in it,
          you’ll get NaN, an acronym for “Not a Number.”
        */
        UnitPrice: Number(e.unitPrice),
        Amount: Number(e.amount),
      }

      wsData.push(Object.values(item))
    })

    /* CONVERT ARRAY OF ARRAY WORKSHEET */
    const ws = xls.utils.aoa_to_sheet(wsData)
    ws['!merges'] = [
      /* MERGE CELL
        s: START, e: END, r: ROW, c: COL
      */
      { s: { r: 1, c: 0 }, e: { r: 1, c: 6 } }, // TITLE (A2: G2)
      { s: { r: 2, c: 0 }, e: { r: 2, c: 6 } }, // HEADER MODULE (A3: G3)
      { s: { r: 3, c: 0 }, e: { r: 3, c: 1 } }, // SI No (A4: B4)
      { s: { r: 4, c: 0 }, e: { r: 4, c: 1 } }, // DATE (A5: B5)
      { s: { r: 5, c: 0 }, e: { r: 5, c: 1 } }, // Customer (A6:B6)
    ]
    ws['!cols'] = [
      /* STYLING COLUMN */
      { width: 5 }, // A
      { width: 10 }, // B
      { width: 50 }, // C
      { width: 5 }, // D
      { width: 5 }, // E
      { width: 15 }, // F
      { width: 15 }, // G
    ]
    wb.Sheets.Sheet1 = ws
    const wbout = xls.write(wb, { bookType: 'xlsx', type: 'binary' })

    /* SAVE NEW BLOB */
    saveAs(
      new Blob([this.s2ab(wbout)], { type: 'application/octet-stream' }),
      `INVENTORY OPENING BALANCE_${refNo}_${tokenData.compName}.xlsx`,
      // 'INVENTORY OPENING BALANCE.xlsx'
    )
  }

  /* eslint-disable */
  s2ab(s) {
    const buffer = new ArrayBuffer(s.length)
    const view = new Uint8Array(buffer)

    for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff

    return buffer
  }
  /* eslint-enable */

  render() {
    const { dataDetail, disabled } = this.props
    return (
      <Button
        className="mr-4"
        type="primary"
        icon="file-excel"
        onClick={() => this.exportToExcel(dataDetail)}
        disabled={disabled}
      >
        Excel
      </Button>
    )
  }
}

export default ExcelFormat
