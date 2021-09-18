import React from 'react'
import { connect } from 'react-redux'
import {
  Dropdown,
  Avatar,
  // Badge,  Menu,
} from 'antd'
// import { FormattedMessage } from 'react-intl'
import styles from './style.module.scss'

@connect(({ user }) => ({ user }))
class ProfileMenu extends React.Component {
  state = {}

  logout = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'user/LOGOUT',
    })
  }

  render() {
    const {
      // user,
      menu,
    } = this.props
    return (
      <Dropdown overlay={menu} trigger={['click']}>
        <div className={`${styles.dropdown} m-1`}>
          <Avatar className={styles.avatar} shape="circle" size="large" icon="user" />
        </div>
      </Dropdown>
    )
  }
}

export default ProfileMenu
