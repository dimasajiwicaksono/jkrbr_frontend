const Variable = {
  RTO: 'Request Timeout. Please try again.',
  ERROR: 'Error',
  SUCCESS: 'Success',

  FLD_DASHBOARD: 'Failed: Dashboard',
  FLD_MARKET_LIST: 'Failed: Market List',
  FLD_COMPANY: 'Failed: Company',
  FLD_BRAND: 'Failed: Brand',
  FLD_OUTLET: 'Failed: Outlet',
  FLD_LOCATION: 'Failed: Location',
  FLD_COA: 'Failed: Chat Account',
  FLD_ROLE: 'Failed: Role',
  FLD_RECIPE: 'Failed: Recipe',
  FLD_CURRENCY: 'Failed: Curreccy',
  FLD_CATEGORY: 'Failed: Category Item',
  FLD_CUSTOMER: 'Failed: Customer',
  FLD_GROUP: 'Failed: Group Item',
  FLD_UNIT_MEASURE: 'Failed: Unit Measure',
  FLD_ITEMS: 'Failed: Master Items',
  FLD_CONVERT_ITEMS: 'Failed: Convert Items',
  FLD_DEPARTMENT: 'Failed: Department',
  FLD_TERM: 'Failed: Term Payment',
  FLD_SHIPMENT_METHOD: 'Failed: Shipment Method',
  FLD_TAX_TABLE: 'Failed: Tax Table',
  FLD_SALES_PERSON: 'Failed: Sales Person',
  FLD_SALES_DELIVERY_ORDER: 'Failed: Sales Delivery Order',
  FLD_SALES_INVOICE: 'Failed: Sales Invoice',
  FLD_CHARGE: 'Failed: Charge',
  FLD_BANK_CODE: 'Failed: Bank Code',
  FLD_BANK_ACCOUNT: 'Failed: Bank Account',
  FLD_POSTING_GROUP: 'Failed: Posting Group',
  FLD_COUNTRY: 'Failed: Country',
  FLD_SUPPLIER: 'Failed: Supplier',
  FLD_USER: 'Failed: User',
  FLD_BANK_BOOK_RECEIPT: 'Failed: Bank Book Receipt',
  FLD_BANK_BOOK_LEDGER: 'Failed: Bank Book Ledger',
  FLD_BANK_BOOK_PAYMENT: 'Failed: Bank Book Payment',
  FLD_PRICE_QUOTE: 'Failed: Price Quote',
  FLD_REQUEST: 'Failed: Purchase Request',
  FLD_REQUEST_FOR_APPROVE: 'Failed: Request for Approval',
  FLD_MNG_OREDER_REQUEST: 'Failed: Manage Order Request',
  FLD_PURCHASE_ORDER: 'Failed: Purchase Order',
  FLD_GOOD_RECEIVING: 'Failed: Good Receiving',
  FLD_REPORT_RECEIVING: 'Failed: Report Receiving',
  FLD_RECEIVING: 'Failed: Receiving',
  FLD_PURCHASE_INVOICE: 'Failed: Purchase Invoice',
  FLD_PACKING_LIST: 'Failed: Packing List',
  FLD_PURCHASE_RETURN: 'Failed: Purchase Return',
  FLD_OUTLET_REQUEST: 'Failed: Outlet Request',
  FLD_SALES_RETURN: 'Failed: Sales Return',
  FLD_OUTLET_REQUEST_OVR: 'Failed: Outlet Request Overview',
  FLD_DOR: 'Failed: Delivery Order Request',
  FLD_ADJUSTMENT_IN: 'Failed: Adjustment In',
  FLD_ADJUSTMENT_OUT: 'Failed: Adjustment Out',
  FLD_TRANSFER_OUT: 'Failed:  Transfer Out',
  FLD_WHM: 'Failed: Warehouse Mutation',
  FLD_STOCK_OPNAME: 'Failed: Stock Opname',
  FLD_STOCK_CARD: 'Failed: Stock Card',
  FLD_STOCK_DTL_QTY: 'Failed: Stock Detail by Quantity',
  FLD_STOCK_DTL_PRC: 'Failed: Stock Detail by Price',
  FLD_AP_VOUCHER: 'Failed: AP Voucher',
  FLD_PAYMENT_VOUCHER: 'Failed: Payment Voucher',
  FLD_POS_OUTLET: 'Failed: POS Menu Outlet',
  FLD_POS_POINT_OF_SALES: 'Failed: POS Point of Sales',
  FLD_POS_GROUP: 'Failed: POS Menu Group',
  FLD_INV_OPENING_BLC: 'Failed: Opening Balance',
  FLD_DEBIT_NOTE: 'Failed: Debit Note',

  TXT_REASONS: 'Reasons for deleting data',

  TAG_COLOR_UNDELIVERED: 'blue',
  TAG_COLOR_DELIVERED: 'green',
  TAG_COLOR_UNPOSTED: 'blue',
  TAG_COLOR_POSTED: 'green',
  TAG_COLOR_PENDING: 'blue',
  TAG_COLOR_UNAPPROVE: 'blue',
  TAG_COLOR_APPROVE: 'green',
  TAG_COLOR_CLOSE: 'red',
  TAG_COLOR_CANCEL: 'red',
  TAG_COLOR_ACTIVE: 'green',
  TAG_COLOR_NONACTIVE: 'red',
  TAG_COLOR_OPEN: 'blue',
  TAG_COLOR_RELEASE: 'green',
  TAG_COLOR_RECEIVE: 'green',
  TAG_COLOR_PARSIAL: 'orange',
  TAG_COLOR_ISSUED: 'orange',
  TAG_COLOR_RECONCILE: 'yellow',

  MENU_KEY_PROFILE: '00',
  MENU_KEY_MASTER: '01',
  MENU_KEY_ACCOUNTING: '02',
  MENU_KEY_FINANCE: '03',
  MENU_KEY_INVENTORY: '04',
  MENU_KEY_PURCHASE: '05',
  MENU_KEY_PRODUCTION: '06',
  MENU_KEY_SALES: '07',
  MENU_KEY_TOOL: '08',
  MENU_KEY_POS: '10',
  MENU_KEY_SETUP: '11',

  MENU_KEY_PRF_FORGOT: '0001',
  MENU_KEY_PRF_PIN: '0002',

  MENU_KEY_MST_COMPANY: '0101',
  MENU_KEY_MST_OUTLET: '0102',
  MENU_KEY_MST_LOCATION: '0103',
  MENU_KEY_MST_USER: '0104',
  MENU_KEY_MST_CURRENCY: '0105',
  MENU_KEY_MST_COA: '0106',
  MENU_KEY_MST_UOM: '0107',
  MENU_KEY_MST_GROUP: '0108',
  MENU_KEY_MST_CATEGORY: '0109',
  MENU_KEY_MST_ITEM: '0110',
  MENU_KEY_MST_TERM: '0111',
  MENU_KEY_MST_TAX: '0112',
  MENU_KEY_MST_SUPPLIER: '0113',
  MENU_KEY_MST_CUSTOMER: '0114',
  MENU_KEY_MST_ADJUSTMENT: '0115',
  MENU_KEY_MST_BRAND: '0116',
  MENU_KEY_MST_POSTING_GROUP_CUSTOMER: '0117',
  MENU_KEY_MST_POSTING_GROUP_SUPPLIER: '0119',
  MENU_KEY_MST_ROLE: '0118',
  MENU_KEY_MST_SALES_PERSON: '0120',

  MENU_KEY_ACC_GENERAL_JOURNAL: '0201',
  MENU_KEY_ACC_JOURNAL_UNBALANCE: '0202',
  MENU_KEY_ACC_BUDGET: '0203',
  MENU_KEY_ACC_CLOSING_PERIOD: '0204',
  MENU_KEY_ACC_REPORT: '0299',
  MENU_KEY_ACC_REPORTS_SUB_LGR: '0205',
  MENU_KEY_ACC_REPORTS_ALL_JNL: '0206',
  MENU_KEY_ACC_REPORTS_PRF_LOS: '0207',
  MENU_KEY_ACC_REPORTS_NRC_SLD: '0208',
  MENU_KEY_ACC_REPORTS_NRC_STD: '0209',

  MENU_KEY_FIN_BANK_ACCOUNT: '0300',
  MENU_KEY_FIN_AP_VOUCHER: '0301',
  MENU_KEY_FIN_PAYMENT_VOUCHER: '0302',
  MENU_KEY_FIN_ISSUED_AP: '0303',
  MENU_KEY_FIN_RECONCIALE_AP: '0304',
  MENU_KEY_FIN_CREDIT_NOTE: '0307',
  MENU_KEY_FIN_DEBIT_NOTE: '0308',
  MENU_KEY_FIN_BANK_BOOK: '0305',
  MENU_KEY_FIN_BANK_BOOK_PAYMENT: '0310',
  MENU_KEY_FIN_BANK_BOOK_RECEIPT: '0311',
  MENU_KEY_FIN_BANK_BOOK_LEDGER: '0312',
  MENU_KEY_FIN_REPORTS_OUTSTD_BY_INV: '0313',
  MENU_KEY_FIN_REPORTS_OUTSTD_CHK_BLC: '0319',
  MENU_KEY_FIN_REPORTS_AGING: '0314',
  MENU_KEY_FIN_REPORTS_BLNC_BY_COA: '0315',
  MENU_KEY_FIN_REPORTS_BALANCE: '0316',
  MENU_KEY_FIN_REPORTS_AR_AGING: '0320',
  MENU_KEY_FIN_REPORTS_HIS_BY_CUST: '0321',
  MENU_KEY_FIN_REPORTS_HISTORY: '0317',
  MENU_KEY_FIN_REPORTS_TRL_BLC: '0318',
  MENU_KEY_FIN_REPORTS_BANK_MUT: '0322',

  MENU_KEY_INV_OUTLET_REQUEST: '0401',
  MENU_KEY_INV_DELIVERY_OUTLET_REQUEST: '0402',
  MENU_KEY_INV_ADJUSTMENT_IN: '0403',
  MENU_KEY_INV_ADJUSTMENT_OUT: '0404',
  MENU_KEY_INV_TRANSFER_OUT: '0405',
  MENU_KEY_INV_WAREHOUSE_MUTATION: '0406',
  MENU_KEY_INV_STOCK_OPNAME: '0409',
  MENU_KEY_INV_STOCK_CARD: '0410',
  MENU_KEY_INV_STOCK_DETAIL_QTY: '0411',
  MENU_KEY_INV_STOCK_DETAIL_PRC: '0412',
  MENU_KEY_INV_OUTLET_REQUEST_OVERVIEW: '0413',
  MENU_KEY_INV_STOCK_DETAIL_CSM: '0414',
  MENU_KEY_INV_INVENTORY_REPORTS: '0499',
  MENU_KEY_INV_REPORTS_ADJ_OUT: '0415',
  MENU_KEY_INV_REPORTS_TFO_BY_LOC: '0416',
  MENU_KEY_INV_REPORTS_STOCK_DETAIL_CSM_BY_MUT: '0430',
  MENU_KEY_INV_REPORTS_STOCK_DETAIL_CSM_BY_SUPPL: '0420',
  MENU_KEY_INV_REPORTS_TFO_BY_CUST: '0421',
  MENU_KEY_INV_REPORTS_ITEM_MASTER_LIST: '0431',
  MENU_KEY_INV_REPORTS_STOCK_DETAIL_RECAP: '0422',
  MENU_KEY_INV_REPORTS_STOCK_DETAIL_RECAP_BY_LOC: '0423',
  MENU_KEY_INV_REPORT: '0499',
  MENU_KEY_INV_REPORTS_INVENTORY: '0418',
  MENU_KEY_INV_REPORTS_WAREHOUSE: '0419',


  MENU_KEY_POS_IMPORT_DTA_SLS: '1001',
  MENU_KEY_POS_POINT_OF_SLS: '1002',
  MENU_KEY_POS_SLS_JOURNAL: '1004',
  MENU_KEY_POS_SETUP: '1098',
  MENU_KEY_POS_MENU_OUTLET: '1008',
  MENU_KEY_POS_MENU_GROUP: '1005',
  MENU_KEY_POS_MENU_CATEGORY: '1006',
  MENU_KEY_POS_MENU_ITEM: '1007',
  MENU_KEY_POS_EDIT_PAYMENT: '1003',
  MENU_KEY_POS_TENDER_MEDIA: '1009',
  MENU_KEY_POS_SALES_BY_ITEM: '1011',
  MENU_KEY_POS_BILLSUMMARY: '1010',
  MENU_KEY_POS_PAGE_MENU: '1012',
  MENU_KEY_POS_TABLE_GROUP: 'NONE',
  MENU_KEY_POS_PC_TABLE: 'NONE',
  MENU_KEY_POS_MENU_SERVICE_LEVEL: 'NONE',
  MENU_KEY_POS_MENU_BUSINESS_GROUP: 'NONE',
  MENU_KEY_POS_SALES_BALANCE: 'NONE',
  MENU_KEY_POS_KASIR: '1097',

  MENU_KEY_SET_OPENING_BLC: '1102',
  MENU_KEY_SET_INV_OPENING_BLC: '1104',
  MENU_KEY_SET_INV_OPENING_COA: '1105',

  MENU_KEY_TOOL_VOUCHER: '0806',
}

export default Variable
