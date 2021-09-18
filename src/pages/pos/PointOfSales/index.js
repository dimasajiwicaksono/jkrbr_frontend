import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import ListContent from './list'
import ToolContent from './tool'
import EditContent from './edit'
// import Document from './myDoc'
import vars from '../../../utils/variable'
import { sideMenuFilter } from '../../../utils/helper'
import actions from '../../../redux/pos/posPointOfSales/actions'

const mapStateToProps = ({ posPointOfSales, menu, settings }) => ({
  posPointOfSales,
  posPointOfSalesConfig: sideMenuFilter(menu, vars.MENU_KEY_POS, vars.MENU_KEY_POS_POINT_OF_SLS),
  setPeriode: settings.setPeriode,
  dataBrand: posPointOfSales.brandOption,
})

const moduleSet = 'posPointOfSales'
@withRouter
@connect(mapStateToProps)
class PointOfSales extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentWillMount() {
    const { dispatch } = this.props
    dispatch({
      type: actions.GET_DATA_POS_LIST,
      payload: {},
    })
    dispatch({
      type: actions.GET_DATA_OUTLET,
      payload: {
        moduleSet,
      },
    })
  }

  handleState(property, value) {
    const { dispatch } = this.props
    dispatch({
      type: actions.HANDLE_STATE,
      field: property,
      value,
    })
  }

  render() {
    const { posPointOfSales, posPointOfSalesConfig } = this.props
    const { access } = posPointOfSalesConfig
    const ACTION = (prop, val) => this.handleState(prop, val)

    if (posPointOfSales.contentStatus === 'isEdit' && access.isEdit === '1') {
      return <EditContent action={ACTION} moduleSet={moduleSet} />
    }

    return (
      <div>
        <ToolContent action={ACTION} access={access} moduleSet={moduleSet} />
        <ListContent action={ACTION} moduleSet={moduleSet} />
      </div>
    )
  }
}

export default PointOfSales
