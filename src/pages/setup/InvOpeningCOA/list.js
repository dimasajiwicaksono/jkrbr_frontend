import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Table, Tag, Button } from 'antd'
import { currencyFormat } from '../../../utils/helper'
import vars from '../../../utils/variable'
import NumericInput from '../../../components/CleanUIComponents/Input/NumericInput'

const mapStateToProps = ({ setInvOpeningCOA, user }) => ({
  setInvOpeningCOA,
  opBalanceData: setInvOpeningCOA.setInvOpeningCOAData,
  dateOpening: user.config.dateOpening,
})

@withRouter
@connect(mapStateToProps)
class ListContent extends Component {
  constructor(props) {
    super(props)
    const { opBalanceData, dateOpening } = this.props
    this.state = {
      qtyForm: null,
      asOf: dateOpening,
      totalDebit: 0,
      totalCredit: 0,
      items: opBalanceData,
    }
  }

  handleEditForm(key) {
    this.setState({
      qtyForm: key,
    })
  }

  componentWillReceiveProps(nextProps) {
    const { items } = this.state
    if (items !== nextProps.opBalanceData) {
      const numDr = []
      const numCr = []
      nextProps.opBalanceData.map(val => {
        numDr.push(Number(val.ytdDr))
        numCr.push(Number(val.ytdCr))
        return false
      })
      /* eslint-disable */
      this.setState({
        items: nextProps.opBalanceData,
        totalDebit: numDr.reduce((a, b) => (a += b), 0),
        totalCredit: numCr.reduce((a, b) => (a += b), 0),
      })
      /* eslint-enable */
    }
  }

  getStatus = param => {
    let result = ''
    switch (param) {
      case '1':
        result = <Tag color={vars.TAG_COLOR_UNAPPROVE}>Unapprove</Tag>
        break
      case '2':
        result = <Tag color={vars.TAG_COLOR_APPROVE}>Posted</Tag>
        break
      default:
        result = ''
    }
    return result
  }

  handleItemChange(record, value, field) {
    /* eslint-disable */
    const { items } = this.state
    const numDr = []
    const numCr = []
    if (field === 'debit') {
      this.state.items[record.key].ytdDr = value
      items.map(val => numDr.push(Number(val.ytdDr)))
      this.setState({
        totalDebit: numDr.reduce((a, b) => (a += b), 0),
      })
    } else if (field === 'credit') {
      this.state.items[record.key].ytdCr = value
      items.map(val => numCr.push(Number(val.ytdCr)))
      this.setState({
        totalCredit: numCr.reduce((a, b) => (a += b), 0),
      })
    }
    /* eslint-enable */
  }

  handleSave() {
    const { dispatch } = this.props
    const { asOf, totalDebit, totalCredit, items } = this.state
    const list = []
    items.map(val =>
      list.push({
        glAcctNo: val.glAcctNo,
        dc: val.dc,
        ytdDr: Number(val.ytdDr),
        ytdCr: Number(val.ytdCr),
      }),
    )
    dispatch({
      type: 'setInvOpeningCOA/GET_DATA_INV_OPENING_COA_SAVE',
      payload: {
        refDate: asOf,
        totalDr: totalDebit,
        totalCr: totalCredit,
        openingGl: list,
      },
    })
  }

  disableSave() {
    const { totalDebit, totalCredit } = this.state
    if (Number(totalDebit) !== Number(totalCredit)) {
      return true
    }
    return false
  }

  renderFooter() {
    const { totalDebit, totalCredit } = this.state
    return (
      <table>
        <tr>
          <td align="right">
            <strong>Totals</strong>
          </td>
          <td width="150" align="right">
            <strong>{currencyFormat(totalDebit)}</strong>
          </td>
          <td width="150" align="right">
            <strong>{currencyFormat(totalCredit)}</strong>
          </td>
        </tr>
      </table>
    )
  }

  handlePrint() {
    console.log('handle print')
  }

  render() {
    const { setInvOpeningCOA } = this.props
    const { qtyForm, items } = this.state
    const sort = ['descend', 'ascend']
    const pagination = { pageSize: 50 }
    const dataTable = []
    const option = {
      bordered: true,
      pagination,
      size: 'small',
      hasData: true,
    }

    /* MAPING TABLE COLUMN */
    const columns = {
      dataTable: [
        {
          title: 'Account',
          dataIndex: 'account',
          key: 'account',
          width: 180,
          defaultSortOrder: sort,
          sorter: (a, b) => a.account.localeCompare(b.account),
          fixed: 'left',
        },
        {
          title: 'Account Name',
          dataIndex: 'accountName',
          key: 'accountName',
          sortDirections: sort,
          sorter: (a, b) => a.accountName.localeCompare(b.accountName),
        },
        {
          title: 'D/C',
          dataIndex: 'dc',
          key: 'dc',
          width: 70,
          sortDirections: sort,
          sorter: (a, b) => a.dc.localeCompare(b.dc),
        },
        {
          title: 'Debit',
          dataIndex: 'debit',
          key: 'debit',
          align: 'right',
          width: 150,
          sortDirections: sort,
          sorter: (a, b) => a.debit - b.debit,
          render: (text, record) =>
            record.key !== qtyForm ? (
              /* eslint-disable */
              <div>
                {record.index !== 99999999999 && (
                  <div onClick={() => this.handleEditForm(record.key)}>{currencyFormat(text)}</div>
                )}
              </div>
            ) : (
              /* eslint-enable */
              <div>
                <NumericInput
                  defaultValue={text}
                  onChange={value => this.handleItemChange(record, value, 'debit')}
                  onPressEnter={() => this.handleEditForm(null)}
                />
              </div>
            ),
        },
        {
          title: 'Credit',
          dataIndex: 'credit',
          key: 'credit',
          align: 'right',
          width: 150,
          sortDirections: sort,
          sorter: (a, b) => a.credit - b.credit,
          render: (text, record) =>
            record.key !== qtyForm ? (
              /* eslint-disable */
              <div>
                {record.index !== 99999999999 && (
                  <div onClick={() => this.handleEditForm(record.key)}>{currencyFormat(text)}</div>
                )}
              </div>
            ) : (
              /* eslint-enable */
              <div>
                <NumericInput
                  defaultValue={text}
                  onChange={value => this.handleItemChange(record, value, 'credit')}
                  onPressEnter={() => this.handleEditForm(null)}
                />
              </div>
            ),
        },
      ],
    }

    /* MAPING DATA TABEL */
    if (items.length > 0) {
      items.map((val, key) =>
        dataTable.push({
          key,
          account: val.glAcctNo,
          accountName: val.glAcctName,
          dc: val.dc,
          debit: val.ytdDr,
          credit: val.ytdCr,
        }),
      )
    }

    return (
      <div className="mt-4">
        <Table
          columns={columns.dataTable}
          dataSource={dataTable}
          loading={setInvOpeningCOA.loading}
          scroll={{ x: 900, y: 280 }}
          {...option}
          footer={() => this.renderFooter()}
        />
        <div className="mt-2">
          <Button
            className="btn-primary mr-2"
            disabled={this.disableSave()}
            onClick={() => this.handleSave()}
          >
            Save
          </Button>
          <Button className="btn-primary" onClick={() => this.handlePrint()}>
            Print
          </Button>
        </div>
      </div>
    )
  }
}

export default ListContent
