import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { PDFViewer, Page, View, Text, Document, StyleSheet } from '@react-pdf/renderer'
import { Button } from 'antd'
import { currencyFormat } from '../../../utils/helper'

const mapStateToProps = ({ posPointOfSales, user }) => ({
  posPointOfSales,
  detailRequest: posPointOfSales.posPointOfSalesDetail,
  user,
})

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#FFF',
    margin: 10,
    padding: '25px 10px',
  },
  wrapBill: {
    width: 200,
  },
  header: {
    width: 'auto',
    marginBottom: 10,
    flexDirection: 'row',
  },
  headerLeft: {
    width: '50%',
  },
  headerRight: {
    width: '50%',
  },
  billNoWrap: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: '5px',
    fontSize: 9,
  },
  billNo: {
    marginRight: 30,
  },
  billDateWrap: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: '5px',
    fontSize: 9,
  },
  billDate: {
    marginRight: 21,
  },
  corporate: {
    fontSize: 18,
  },
  corporateAddress: {
    fontSize: 8,
  },
  title: {
    display: 'flex',
    flexDirection: 'row',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: '3vh',
  },
  detailInfo: {
    flexDirection: 'row',
    flexGrow: 1,
    width: '50%',
  },
  infoTitle: {
    flexGrow: 1,
    width: '10%',
  },
  infoContent: {
    flexGrow: 1,
    width: '50%',
    paddingRight: '15px',
  },
  infoGroup: {
    fontSize: 10,
  },
  infoGroupNumber: {
    fontSize: 10,
    textAlign: 'right',
  },
  table: {
    display: 'table',
    width: '97%',
    borderStyle: 'dashed',
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
  },
  tableRowHeader: {
    margin: 'auto',
    flexDirection: 'row',
    borderStyle: 'dashed',
    borderBottomWidth: 1,
  },
  tableColNo: {
    width: '5%',
  },
  tableItemName: {
    width: '43%',
  },
  tableColQty: {
    width: '8%',
  },
  tableColUnitPrice: {
    width: '15%',
    textAlign: 'right',
  },
  tableColDiscount: {
    width: '15%',
    textAlign: 'center',
  },
  tableColAmount: {
    width: '14%',
    textAlign: 'right',
  },
  tableCell: {
    margin: '5px',
    fontSize: 10,
  },
  tableCellHeader: {
    margin: '5px',
    fontSize: 11,
  },
  tableFooter: {
    display: 'flex',
    width: '97%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  tableFooterLeft: {
    width: '33%',
    display: 'flex',
    justifyContent: 'flex-start',
  },
  tableFooterRight: {
    width: '33%',
    display: 'flex',
    justifyContent: 'flex-start',
    marginLeft: '10px',
  },
  tableFooterRow: {
    flexDirection: 'row',
  },
  tableLabelFooter: {
    width: '30%',
  },
  tableColonFooter: {
    width: '5%',
    margin: '0px 2px',
  },
  tableValueFooter: {
    width: '65%',
    textAlign: 'right',
  },
})

@withRouter
@connect(mapStateToProps)
class MyDoc extends Component {
  handleContent(payload) {
    const { posPointOfSales, dispatch } = this.props
    if (posPointOfSales.contentStatus !== payload) {
      dispatch({
        type: 'posPointOfSales/HANDLE_CONTENT',
        payload,
      })
    }
  }

  render() {
    return (
      <div>
        <div className="mb-4">
          <Button type="primary" icon="arrow-left" onClick={() => this.handleContent('isView')}>
            Back
          </Button>
        </div>
        <PDFViewer style={{ height: '75vh', width: '100%', overflow: 'hidden' }}>
          <Document title="PDF">
            <Page size="A4" wrap style={styles.page}>
              <View style={styles.header} key="header">
                <View style={styles.headerLeft} key="headerLeft">
                  <Text style={styles.corporate}>PT.Mitra Selera Bersama</Text>
                  <Text style={styles.corporateAddress}>PLASA MUTIARA MEGA KUNINGAN JAKARTA</Text>
                  <View style={styles.wrapBill} key="wrapBill">
                    <View style={styles.billNoWrap} key="billNoWrap">
                      <Text style={styles.billNo}>Bill No</Text>
                      <Text>: SI/2003/00537</Text>
                    </View>
                    <View style={styles.billDateWrap} key="billDateWrap">
                      <Text style={styles.billDate}>Bill Date</Text>
                      <Text>: 19/05/2020</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.headerRight} key="headerRight">
                  <View style={styles.title} key="title">
                    <Text>Bill Reprint POS</Text>
                  </View>
                </View>
              </View>
              <View style={styles.table} key="table">
                <View style={styles.tableRowHeader} key="tableRowHeader">
                  <View style={styles.tableColNo} key="tableColNo">
                    <Text style={styles.tableCellHeader}>No</Text>
                  </View>
                  <View style={styles.tableItemName} key="tableColItemName">
                    <Text style={styles.tableCellHeader}>Item Name</Text>
                  </View>
                  <View style={styles.tableColQty} key="tableColQty">
                    <Text style={styles.tableCellHeader}>QTY</Text>
                  </View>
                  <View style={styles.tableColUnitPrice} key="tableColUnitPrice">
                    <Text style={styles.tableCellHeader}>Unit Price</Text>
                  </View>
                  <View style={styles.tableColDiscount} key="tableColDiscount">
                    <Text style={styles.tableCellHeader}>Discount</Text>
                  </View>
                  <View style={styles.tableColAmount} key="tableColAmount">
                    <Text style={styles.tableCellHeader}>Amount</Text>
                  </View>
                </View>
                <View style={styles.tableRow} key="tableRow">
                  <View style={styles.tableColNo} key="tableColNo">
                    <Text style={styles.tableCell}>1</Text>
                  </View>
                  <View style={styles.tableItemName} key="tableColItemName">
                    <Text style={styles.tableCell}>Mangga Mahatir</Text>
                  </View>
                  <View style={styles.tableColQty} key="tableColQty">
                    <Text style={styles.tableCell}>{currencyFormat(1)}</Text>
                  </View>
                  <View style={styles.tableColUnitPrice} key="tableColUnitPrice">
                    <Text style={styles.tableCell}>{currencyFormat(2)}</Text>
                  </View>
                  <View style={styles.tableColDiscount} key="tableColDiscount">
                    <Text style={styles.tableCell}>{}</Text>
                  </View>
                  <View style={styles.tableColAmount} key="tableColAmount">
                    <Text style={styles.tableCell}>{currencyFormat(1)}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.tableFooter} key="tableFooter">
                <View style={styles.tableFooterLeft} key="tableFooterLeft">
                  <View style={styles.tableFooterRow} key="tableFooterRow1">
                    <View style={styles.tableLabelFooter} key="tableColQty">
                      <Text style={styles.tableCell}>Sub Total</Text>
                    </View>
                    <View style={styles.tableColonFooter} key="tableColonFooter">
                      <Text style={styles.tableCell}>:</Text>
                    </View>
                    <View style={styles.tableValueFooter} key="tableValueFooter">
                      <Text style={styles.tableCell}>{currencyFormat(2000000000)}</Text>
                    </View>
                  </View>
                  <View style={styles.tableFooterRow} key="tableFooterRow2">
                    <View style={styles.tableLabelFooter} key="tableColQty">
                      <Text style={styles.tableCell}>Discount</Text>
                    </View>
                    <View style={styles.tableColonFooter} key="tableColonFooter">
                      <Text style={styles.tableCell}>:</Text>
                    </View>
                    <View style={styles.tableValueFooter} key="tableValueFooter">
                      <Text style={styles.tableCell}>0</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.tableFooterRight} key="tableFooterRight">
                  <View style={styles.tableFooterRow} key="tableFooterRow3">
                    <View style={styles.tableLabelFooter} key="tableColQty">
                      <Text style={styles.tableCell}>Service</Text>
                    </View>
                    <View style={styles.tableColonFooter} key="tableColonFooter">
                      <Text style={styles.tableCell}>:</Text>
                    </View>
                    <View style={styles.tableValueFooter} key="tableValueFooter">
                      <Text style={styles.tableCell}>0</Text>
                    </View>
                  </View>
                  <View style={styles.tableFooterRow} key="tableFooterRow4">
                    <View style={styles.tableLabelFooter} key="tableColQty">
                      <Text style={styles.tableCell}>Tax</Text>
                    </View>
                    <View style={styles.tableColonFooter} key="tableColonFooter">
                      <Text style={styles.tableCell}>:</Text>
                    </View>
                    <View style={styles.tableValueFooter} key="tableValueFooter">
                      <Text style={styles.tableCell}>0</Text>
                    </View>
                  </View>
                  <View style={styles.tableFooterRow} key="tableFooterRow5">
                    <View style={styles.tableLabelFooter} key="tableColQty">
                      <Text style={styles.tableCell}>Total</Text>
                    </View>
                    <View style={styles.tableColonFooter} key="tableColonFooter">
                      <Text style={styles.tableCell}>:</Text>
                    </View>
                    <View style={styles.tableValueFooter} key="tableValueFooter">
                      <Text style={styles.tableCell}>{currencyFormat(2000000000)}</Text>
                    </View>
                  </View>
                </View>
              </View>
            </Page>
          </Document>
        </PDFViewer>
      </div>
    )
  }
}

export default MyDoc
