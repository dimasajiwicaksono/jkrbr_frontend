import React from 'react'
import { Layout } from 'antd'
import { withRouter } from 'react-router-dom'
import styles from './style.module.scss'

@withRouter
export default class ChangePasswordLayout extends React.PureComponent {
  render() {
    const { children } = this.props
    return (
      <Layout>
        <Layout.Content>
          <div className={styles.layout}>
            <div className={styles.content}>{children}</div>
          </div>
        </Layout.Content>
      </Layout>
    )
  }
}
