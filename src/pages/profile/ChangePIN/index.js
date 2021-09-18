import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import FormContent from './form'

const mapStateToProps = ({ user }) => ({
  user,
})

@withRouter
@connect(mapStateToProps)
class ChangePassword extends Component {
  handleState(property, value) {
    const { dispatch } = this.props
    dispatch({
      type: 'user/HANDLE_STATE',
      field: property,
      value,
    })
  }

  render() {
    return (
      <div>
        <FormContent action={(prop, val) => this.handleState(prop, val)} />
      </div>
    )
  }
}

export default ChangePassword
