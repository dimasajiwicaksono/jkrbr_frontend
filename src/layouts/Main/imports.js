import React from 'react'
import vars from '../../utils/variable'
/* POS */
import ImportDataSales from '../../pages/pos/ImportDataSales'
import PointOfSales from '../../pages/pos/PointOfSales'
import Kasir from '../Kasir/kasir'

/** TOOL */
import ToolVoucher from '../../pages/tool/voucher'

export function getCompoent(key) {

  /* POS */
  if (key === vars.MENU_KEY_POS_IMPORT_DTA_SLS) {
    return <ImportDataSales />
  }
  if (key === vars.MENU_KEY_POS_POINT_OF_SLS) {
    return <PointOfSales />
  }
  if (key === vars.MENU_KEY_POS_KASIR) {
    return <Kasir />
  }

  /** TOOL */
  if (key === vars.MENU_KEY_TOOL_VOUCHER) {
    return <ToolVoucher />
  }

  return false
}

export const imports = {
  getCompoent,
}
