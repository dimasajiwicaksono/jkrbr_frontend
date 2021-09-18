import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import styles from './style.module.scss'

const mapStateToProps = ({ user }) => ({
  user,
})
@withRouter
@connect(mapStateToProps)
class Footer extends Component {
  render() {
    const { user } = this.props
    const { token } = user
    const tokenData = JSON.parse(atob(token.split('.')[1]))
    return (
      <div className={styles.copyright}>
        <div className="row text-right">
          <div className="col-8 text-center">
            <span>© 2020 All rights reserved</span>
          </div>
          <div className="col-4 d-flex flex-row justify-content-lg-around">
            <span>{tokenData.compName}</span>
          </div>
        </div>
      </div>
    )
  }
}
export default Footer
