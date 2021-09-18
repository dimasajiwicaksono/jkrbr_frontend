import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import ListContent from './list'
import ToolContent from './tool'
import vars from '../../../utils/variable'
import { sideMenuFilter } from '../../../utils/helper'

const mapStateToProps = ({ setInvOpeningCOA, menu, settings }) => ({
  setInvOpeningCOA,
  openingBalanceConfig: sideMenuFilter(
    menu,
    vars.MENU_KEY_SETUP,
    vars.MENU_KEY_SET_OPENING_BLC,
    vars.MENU_KEY_SET_INV_OPENING_COA,
  ),
  setPeriode: settings.setPeriode,
})

const moduleSet = 'setInvOpeningCOA'

@withRouter
@connect(mapStateToProps)
class OpeningBalance extends Component {
  handleState(property, value) {
    const { dispatch } = this.props
    dispatch({
      type: 'setInvOpeningCOA/HANDLE_STATE',
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
    const { openingBalanceConfig } = this.props
    const { access } = openingBalanceConfig
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
