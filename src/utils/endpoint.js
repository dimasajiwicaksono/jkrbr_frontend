const Endpoint = {
  EP_MENUDATA: 'users/newaccess',
  EP_LOGIN: 'login',
  EP_REGISTER: 'register',
  EP_FORGOT: 'resetPassword',
  EP_FORGOT_CHECK_TOKEN: 'auth/checkToken',
  EP_RESET_PASSWORD: 'newPassword',
  EP_OUTLET: 'outlets',
  EP_COMPANY: 'company',
  EP_OUTLET_BY_COMPANY: 'outlet/byCompany',
  EP_CHANGE_COMPANY: 'change_company',
  EP_MODULE_MASTER: 'role/masterModule',
  EP_DASHBOARD: 'approvel',

  EP_MST_COMPANY_LIST: 'company/list',

  EP_MST_ROLE_LIST: 'role/list',

  EP_MST_USER_LIST: 'users/list',
  EP_MST_USER_DETAIL: 'users/detail',
  EP_MST_USER_SAVE: 'users/store',
  EP_MST_USER_UPDATE: 'users/update',
  EP_MST_USER_MODULE_LIST: 'users/list_user_module',
  EP_MST_USER_SUB_MODULE_LIST: 'users/list_user_submodule',



  EP_MST_ITEMS_LIST: 'item/list',
  EP_MST_ITEMS_SUPPLIER_LIST: 'item_supplier/list',
  EP_MST_ITEMS_LOCATION_LIST: 'item/item_location',
  EP_MST_ITEMS_DETAIL: 'item/detail',

  EP_MST_CUSTOMER_LIST: 'customer/list',

  EP_POS_TENDER_MEDIA_LIST: 'fb_tender_media/list',
  EP_POS_TENDER_MEDIA_SAVE: 'fb_tender_media/store',
  EP_POS_TENDER_MEDIA_UPDATE: 'fb_tender_media/update',
  EP_POS_TENDER_MEDIA_DELETE: 'fb_tender_media/delete',

  EP_POS_POINT_OF_SALES_LIST: 'pos',
  EP_POS_POINT_OF_SALES_DETAIL: 'pos/detail',
  EP_POS_POINT_OF_SALES_SAVE: 'pos',

  // PROFILE
  EP_CHANGE_PASSWORD: 'users/updatePassword',
  EP_CHANGE_PIN: 'users/updatePIN',


  UPLOAD_CSV_FILE_POS: 'sales_pos/upload',

  POS: 'pos/list',

  EP_PROVINCE: 'http://www.emsifa.com/api-wilayah-indonesia/api/provinces.json',
  EP_CITY: 'http://www.emsifa.com/api-wilayah-indonesia/api/regencies',
  EP_DISTRICT : "http://www.emsifa.com/api-wilayah-indonesia/api/districts"

}

export default Endpoint
