export function callDispacth(dispatch, moduleSet) {
  dispatch({
    type: 'mstBrand/GET_DATA_BRAND_OPTION',
    payload: {
      moduleSet,
    },
  })
  dispatch({
    type: 'mstOutlet/GET_DATA_OUTLET_OPTION',
    payload: {
      moduleSet,
    },
  })
  dispatch({
    type: 'mstLocation/GET_DATA_LOCATION_OPTION',
    payload: {
      moduleSet,
    },
  })
}

export const dispacthAction = {
  callDispacth,
}
