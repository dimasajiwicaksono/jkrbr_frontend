import React, { Component } from 'react'
import { Tabs, Skeleton, Menu } from 'antd'
import { connect } from 'react-redux'
import { store as reduxStore } from 'index'
import { withRouter } from 'react-router-dom'
import Dashboard from '../../pages/dashboard/dashboard'
// import Dashboard from '../../pages/dashboard/gamma'
import { getCompoent } from './imports'

/*eslint-disable*/
const TabPane = Tabs.TabPane

const mapStateToProps = ({ menu, settings }) => ({
  menuLoading: menu.loading,
  topMenu: menu.menuTopData,
  sideMenu: menu.menuSideData,
  sideMenuSelected: menu.menuSideDataSelected,
  isMobileView: settings.isMobileView,
})

@withRouter
@connect(mapStateToProps)
class TabsComponent extends Component {
  constructor(props) {
    super(props)
    this.newTabIndex = 0
    const panes = [
      {
        title: 'Dashboard',
        content: <Dashboard openSubModule={(e, fromDashboard) => this.add(e, fromDashboard)} />,
        key: 'dashboard',
      },
    ]
    this.state = {
      activeKey: panes.length > 0 ? panes[0].key : '',
      panes,
      openKeys: ['sub1'],
      flowContent: 'hidden',
      flowSide: 'hidden',
    }
  }

  rootSubmenuKeys = ['sub1', 'sub2', 'sub4']

  onChange = activeKey => {
    this.setState({ activeKey })
    reduxStore.dispatch({
      type: 'content/SET_STATE',
      payload: {
        sideId: activeKey,
      },
    })
  }

  onEdit = (targetKey, action) => {
    targetKey !== 'dashboard' ? this[action](targetKey) : ''
  }

  add = (data, fromDashboard = false) => {
    const { panes } = this.state
    const activeKey = data.key
    // console.log(fromDashboard, 'DASHBOARRDDD')
    // console.log(getCompoent(data.key))
    const content = getCompoent(data.key, fromDashboard, this.add)
    if (panes.filter(val => val.key === activeKey).length > 0) {
      this.setState({ panes, activeKey })
    } else {
      panes.push({ title: data.title, content, key: activeKey })
      this.setState({ panes, activeKey })
    }
  }

  remove = targetKey => {
    let { activeKey } = this.state
    let lastIndex
    this.state.panes.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1
      }
    })
    const panes = this.state.panes.filter(pane => pane.key !== targetKey)
    if (panes.length && activeKey === targetKey) {
      if (lastIndex >= 0) {
        activeKey = panes[lastIndex].key
      } else {
        activeKey = panes[0].key
      }
    }
    this.setState({ panes, activeKey })
  }

  onOpenChange = opKeys => {
    const { openKeys } = this.state
    const latestOpenKey = opKeys.find(key => openKeys.indexOf(key) === -1)
    if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      this.setState({ opKeys })
    } else {
      this.setState({
        openKeys: latestOpenKey ? [latestOpenKey] : [],
      })
    }
  }

  getSideData() {
    const { topMenu, sideMenu, sideMenuSelected, location } = this.props
    const resSideData = []
    const path = location.pathname.split('/')
    let resTopMenu
    if (sideMenuSelected.length > 0) {
      return sideMenuSelected
    } else {
      topMenu.filter(val => val.url === '/' + path[1]).map(vals => (resTopMenu = vals.key))
      sideMenu.filter(x => x.key === resTopMenu).map(y => resSideData.push(y))
      return resSideData
    }
  }

  renderSideMenu = () => {
    const { dispatch, sideMenu } = this.props
    const { openKeys } = this.state
    const menuData = this.getSideData()
    const { Item, SubMenu } = Menu
    if (menuData.length > 0 && menuData[0].key !== '00') {
      return (
        <div>
          <Menu mode="inline" className="d-none d-md-block">
            {menuData[0].children.map(value => {
              if (
                (value.children === undefined || value.children.length === 0) &&
                value.access !== undefined &&
                value.access.isView === '1'
              ) {
                return (
                  <Item onClick={() => this.add(value)} key={value.key} title={value.title}>
                    {value.title}
                  </Item>
                )
              }
              if (value.children.length > 0) {
                return (
                  <SubMenu key={value.key} title={value.title}>
                    {value.children.map(val => {
                      return (
                        <Item onClick={() => this.add(val)} key={val.key} title={val.title}>
                          {val.title}
                        </Item>
                      )
                    })}
                  </SubMenu>
                )
              }
            })}
          </Menu>
        </div>
      )
    }
    if (menuData.length > 0 && menuData[0].key === '00') {
      return (
        <div>
          <Menu mode="inline" className="d-none d-md-block">
            {menuData[0].children.map(value => {
              return (
                <Item onClick={() => this.add(value)} key={value.key} title={value.title}>
                  {value.title}
                </Item>
              )
            })}
          </Menu>
        </div>
      )
    }
    return true
  }

  onMouseLeaveContent = () => {
    this.setState({
      flowContent: 'hidden',
    })
  }

  onMouseEnterContent = () => {
    this.setState({
      flowContent: 'auto',
    })
  }

  onMouseLeaveSide = () => {
    this.setState({
      flowSide: 'hidden',
    })
  }

  onMouseEnterSide = () => {
    this.setState({
      flowSide: 'auto',
    })
  }

  render() {
    const { menuLoading, isMobileView } = this.props
    const { panes, activeKey, flowContent, flowSide } = this.state
    return (
      <div>
        <div className="row">
          <div
            className={`col-md-2 ${!isMobileView}`}
            onMouseLeave={this.onMouseLeaveSide}
            onMouseEnter={this.onMouseEnterSide}
            style={{ paddingBottom: '2.3rem', overflow: flowSide, maxHeight: '80vh' }}
          >
            <div className="side-menu-custom">
              <Skeleton active loading={menuLoading} paragraph={true} />
              {this.renderSideMenu()}
            </div>
          </div>
          <div
            className="col-md-10"
            onMouseLeave={this.onMouseLeaveContent}
            onMouseEnter={this.onMouseEnterContent}
            style={{ overflow: flowContent, maxHeight: '80vh' }}
          >
            <section className="card">
              <div className="card-body">
                <Tabs
                  hideAdd
                  onChange={this.onChange}
                  activeKey={activeKey}
                  type="editable-card"
                  onEdit={this.onEdit}
                >
                  {panes.map(pane => (
                    <TabPane
                      tab={pane.title}
                      key={pane.key}
                      closable={pane.key === 'dashboard' ? false : true}
                    >
                      {pane.content}
                    </TabPane>
                  ))}
                </Tabs>
              </div>
            </section>
            {panes.map(pane => {
              pane.content
            })}
          </div>
        </div>
      </div>
    )
  }
}

export default TabsComponent
