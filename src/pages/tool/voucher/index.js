import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import ListContent from './list'
import ToolContent from './tool'
import AddContent from './add'
// import EditContent from './edit'
// import vars from '../../../utils/variable'
// import { sideMenuFilter } from '../../../utils/helper'

const mapStateToProps = ({ toolVoucher }) => ({
  toolVoucher,
})

const moduleSet = 'toolVoucher'

@withRouter
@connect(mapStateToProps)
class ToolVoucher extends Component {
  componentWillMount() {
    const { dispatch } = this.props
    dispatch({
      type: 'mstOutlet/GET_DATA_OUTLET_OPTION',
      payload: {
        moduleSet,
      },
    })
  }

  handleState(property, value) {
    const { dispatch } = this.props
    dispatch({
      type: 'toolVoucher/HANDLE_STATE',
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
    const { toolVoucher } = this.props
    // const { access } = toolVoucherConfig
    if (toolVoucher.contentStatus === 'isAdd') {
      return (
        <div>
          <AddContent action={(prop, val) => this.handleState(prop, val)} moduleSet={moduleSet} />
        </div>
      )
    }
    // if (toolVoucher.contentStatus === 'isEdit' && access.isEdit === '1') {
    //   return (
    //     <div>
    //       <EditContent action={(prop, val) => this.handleState(prop, val)} moduleSet={moduleSet} />
    //     </div>
    //   )
    // }
    return (
      <div>
        <ToolContent
          action={(prop, val) => this.handleState(prop, val)}
          moduleSet={moduleSet}
          // access={access}
        />
        <ListContent action={(prop, val) => this.handleState(prop, val)} moduleSet={moduleSet} />
      </div>
    )
  }
}

export default ToolVoucher
