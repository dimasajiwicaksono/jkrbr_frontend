import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import ListContent from './list'
import ToolContent from './tool'
import AddContent from './add'
import EditContent from './edit'
import vars from '../../../utils/variable'
import { sideMenuFilter } from '../../../utils/helper'

const mapStateToProps = ({ setInvOpeningBalance, menu, settings }) => ({
  setInvOpeningBalance,
  openingBalanceConfig: sideMenuFilter(
    menu,
    vars.MENU_KEY_SETUP,
    vars.MENU_KEY_SET_OPENING_BLC,
    vars.MENU_KEY_SET_INV_OPENING_BLC,
  ),
  setPeriode: settings.setPeriode,
})

const moduleSet = 'setInvOpeningBalance'

@withRouter
@connect(mapStateToProps)
class OpeningBalance extends Component {
  componentWillMount() {
    const { dispatch, setPeriode } = this.props
    dispatch({
      type: 'setInvOpeningBalance/GET_DATA_INV_OPENING_BLC_LIST',
      payload: {
        refNo: '',
        fdate: setPeriode.currentStartMonth,
        tdate: setPeriode.currentEndMonth,
        locaCode: '',
        outlet: '',
        brand: '',
      },
    })
    dispatch({
      type: 'mstBrand/GET_DATA_BRAND_OPTION',
      payload: {
        moduleSet,
      },
    })
    dispatch({
      type: 'mstItems/GET_DATA_ITEMS_OPTION',
      payload: {
        moduleSet,
      },
    })
    dispatch({
      type: 'mstGroupItem/GET_DATA_GROUP_ITEM_OPTION',
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

  handleState(property, value) {
    const { dispatch } = this.props
    dispatch({
      type: 'setInvOpeningBalance/HANDLE_STATE',
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

  render() {
    const { setInvOpeningBalance, openingBalanceConfig } = this.props
    const { access } = openingBalanceConfig
    if (setInvOpeningBalance.contentStatus === 'isAdd' && access.isNew === '1') {
      return (
        <div>
          <AddContent action={(prop, val) => this.handleState(prop, val)} moduleSet={moduleSet} />
        </div>
      )
    }
    if (setInvOpeningBalance.contentStatus === 'isEdit' && access.isEdit === '1') {
      return (
        <div>
          <EditContent action={(prop, val) => this.handleState(prop, val)} moduleSet={moduleSet} />
        </div>
      )
    }
    return (
      <div>
        <ToolContent
          action={(prop, val) => this.handleState(prop, val)}
          moduleSet={moduleSet}
          access={access}
        />
        <ListContent action={(prop, val) => this.handleState(prop, val)} moduleSet={moduleSet} />
      </div>
    )
  }
}

export default OpeningBalance
