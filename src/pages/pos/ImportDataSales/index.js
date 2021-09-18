import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import ToolContent from './tool'

const mapStateToProps = ({ posImportDataSales }) => ({
  posImportDataSales,
})

@withRouter
@connect(mapStateToProps)
class ImportDataSales extends Component {
  handleState(property, value) {
    const { dispatch } = this.props
    dispatch({
      type: 'posImportDataSales/HANDLE_STATE',
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
    return (
      <div>
        <ToolContent action={(prop, val) => this.handleState(prop, val)} />
      </div>
    )
  }
}

export default ImportDataSales
