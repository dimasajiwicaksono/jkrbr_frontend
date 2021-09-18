/**
 * POS-RETAIL SCAP V1.1.0
 * Dibuat pada 29 November 2020
 * Update Fitur Terakhir 29 November 2020 (1)
 * Fix Bug Terakhir 29 November 2020 (0)
 * */

import React from 'react'
import { Layout, Menu, Icon } from 'antd'
import { withRouter, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import styles from './style.module.scss'
import Kasir from './kasir'
import actions from '../../redux/pos/posKasir/actions'

const mapStateToProps = ({ posKasir }) => ({ posKasir })

@withRouter
@connect(mapStateToProps)
export default class KasirLayout extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      collapsed: true,
    }
  }

  onCollapse = collapsed => {
    this.setState({ collapsed })
  }

  reload = () => {
    const { dispatch } = this.props
    dispatch({
      type: actions.GET_MST_ITEM_OPTION,
      payload: {},
    })
  }

  backOffice = () => (localStorage.getItem('otl') !== '' ? localStorage.removeItem('otl') : null)

  render() {
    const { collapsed } = this.state
    return (
      <>
        <div className={styles.layout}>
          <Layout>
            <Layout.Sider
              collapsible
              collapsed={collapsed}
              onCollapse={this.onCollapse}
              className="mr-4"
            >
              <div className="logo" />
              <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                <Menu.Item key="1" onClick={this.backOffice}>
                  <Link to={{ pathname: '/pos-module' }}>
                    <Icon type="home" />
                    <span className="text-light">Back Office</span>
                  </Link>
                </Menu.Item>

                <Menu.Item key="2">
                  <Icon type="shopping-cart" />
                  <span className="text-light">Sales</span>
                </Menu.Item>
                <Menu.Item key="3">
                  <Icon type="upload" />
                  <span className="text-light">Upload</span>
                </Menu.Item>
                <Menu.Item key="4" onClick={this.reload}>
                  <Icon type="sync" />
                  <span className="text-light">Sync</span>
                </Menu.Item>
              </Menu>
            </Layout.Sider>
            <Layout>
              <Layout.Content>
                <Kasir />
              </Layout.Content>
              <Layout.Footer className="text-center pt-2 pb-2">
                <p>Powered By POS SCAP</p>
              </Layout.Footer>
            </Layout>
          </Layout>
        </div>
      </>
    )
  }
}
