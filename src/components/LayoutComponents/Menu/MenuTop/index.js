import React from 'react'
import { connect } from 'react-redux'
import { Menu, Popconfirm, DatePicker, message } from 'antd'
import { Link, withRouter } from 'react-router-dom'
import { store as reduxStore } from 'index'
import * as moment from 'moment'
import store from 'store'
import _ from 'lodash'
import styles from './style.module.scss'
import './style.css'
import { datePeriod, dateFormat } from '../../../../utils/helper'

const { SubMenu, Divider } = Menu

const mapStateToProps = ({ menu, settings }) => ({
  menuData: menu.menuTopData,
  menuSideData: menu.menuSideData,
  isLightTheme: settings.isLightTheme,
  isSettingsOpen: settings.isSettingsOpen,
  currentMonthNum: settings.setPeriode.currentMonthNum,
  currentMonthName: settings.setPeriode.currentMonthName,
})

@withRouter
@connect(mapStateToProps)
class MenuTop extends React.Component {
  state = {
    selectedKeys: store.get('app.menu.selectedKeys') || [],
  }

  componentWillMount() {
    this.setSelectedKeys(this.props)
  }

  componentWillReceiveProps(newProps) {
    this.setSelectedKeys(newProps)
  }

  setSelectedKeys = props => {
    const { menuData } = this.props
    const flattenItems = (items, key) =>
      items.reduce((flattenedItems, item) => {
        flattenedItems.push(item)
        if (Array.isArray(item[key])) {
          return flattenedItems.concat(flattenItems(item[key], key))
        }
        return flattenedItems
      }, [])
    const selectedItem = _.find(flattenItems(menuData, 'children'), [
      'url',
      props.location.pathname,
    ])
    this.setState({
      selectedKeys: selectedItem ? [selectedItem.key] : [],
    })
  }

  handleClick = e => {
    const { dispatch, isSettingsOpen } = this.props
    store.set('app.menu.selectedKeys', [e.key])
    if (e.key === 'settings') {
      dispatch({
        type: 'settings/CHANGE_SETTING',
        payload: {
          setting: 'isSettingsOpen',
          value: !isSettingsOpen,
        },
      })
      return
    }
    this.setState({
      selectedKeys: [e.key],
    })
  }

  logout = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'user/LOGOUT',
    })
  }

  getSideMenu = key => {
    const { dispatch, menuSideData } = this.props
    dispatch({
      type: 'menu/GET_SIDEDATA',
      payload: { menuSideData, key },
    })
  }

  confirm = e => {
    console.log(e)
    message.success('Click on Yes')
  }

  cancel = e => {
    console.log(e)
    message.error('Click on No')
  }

  generateMenuItems = () => {
    const { menuData = [] } = this.props
    const generateItem = item => {
      const { key, title, url, icon, disabled } = item
      if (item.divider) {
        return <Divider key={Math.random()} />
      }
      if (item.url) {
        return (
          <Menu.Item key={key} disabled={disabled} className="custom-menuTop">
            {item.target ? (
              <a
                href={url}
                target={item.target}
                rel="noopener noreferrer"
                onClick={() => this.getSideMenu(key)}
              >
                {icon && <span className={`${icon} ${styles.icon}`} />}
                <span className={styles.title}>{title}</span>
              </a>
            ) : (
              <Link to={url} onClick={() => this.getSideMenu(key)}>
                {icon && <span className={`${icon} ${styles.icon}`} />}
                <span className={styles.title}>{title}</span>
              </Link>
            )}
          </Menu.Item>
        )
      }
      if (item.key === 'logout') {
        return false
      }
      return (
        <Menu.Item key={key} disabled={disabled}>
          <span className={styles.title}>{title}</span>
          {icon && <span className={`${icon} ${styles.icon}`} />}
        </Menu.Item>
      )
    }
    const generateSubmenu = items =>
      items.map(menuItem => {
        if (menuItem.children) {
          const subMenuTitle = (
            <span className={styles.menu} key={menuItem.key}>
              <span className={styles.title}>{menuItem.title}</span>
              {menuItem.icon && <span className={`${menuItem.icon} ${styles.icon}`} />}
            </span>
          )
          return (
            <SubMenu title={subMenuTitle} key={menuItem.key}>
              {generateSubmenu(menuItem.children)}
            </SubMenu>
          )
        }
        return generateItem(menuItem)
      })
    return menuData.map(menuItem => {
      if (menuItem.children) {
        const subMenuTitle = (
          <span className={styles.menu} key={menuItem.key}>
            <span className={styles.title}>{menuItem.title}</span>
            {menuItem.icon && <span className={`${menuItem.icon} ${styles.icon}`} />}
          </span>
        )
        return (
          <SubMenu title={subMenuTitle} key={menuItem.key}>
            {generateSubmenu(menuItem.children)}
          </SubMenu>
        )
      }
      return generateItem(menuItem)
    })
  }

  handlePeriode = val => {
    reduxStore.dispatch({
      type: 'settings/CHANGE_SETTING',
      payload: {
        setting: 'setPeriode',
        value: {
          currentMonthName: val,
          currentMonthNum: moment(val, dateFormat.formatMonthNameID).format(
            dateFormat.formatMonthNumID,
          ),
          currentDate: datePeriod.todayID,
          currentStartMonth: moment(val, dateFormat.formatMonthNameID)
            .startOf('month')
            .format(dateFormat.formatDateID),
          currentEndMonth: moment(val, dateFormat.formatMonthNameID)
            .endOf('month')
            .format(dateFormat.formatDateID),
        },
      },
    })
  }

  render() {
    const { selectedKeys } = this.state
    const { isLightTheme, currentMonthName, menuData } = this.props
    const { MonthPicker } = DatePicker

    return (
      <div style={{ position: 'fixed', zIndex: 100, width: '100%' }}>
        <div className={styles.logo}>
          <div className={styles.logoContainer}>
            <img src="resources/images/Logo SCAP.png" alt="logo" />
          </div>
        </div>
        <Menu
          theme={isLightTheme ? 'light' : 'dark'}
          onClick={this.handleClick}
          selectedKeys={selectedKeys}
          mode="horizontal"
        >
          {this.generateMenuItems()}
          {menuData.length > 0 && (
            <Menu.Item key="profile">
              <Link to="profile" onClick={() => this.getSideMenu('00')}>
                <span className={styles.icon} />
                <span className={styles.title}>Profile</span>
              </Link>
            </Menu.Item>
          )}
          <Menu.Item key="logout">
            <Popconfirm
              placement="bottomRight"
              title="Are you sure to logout ?"
              onConfirm={() => this.logout()}
              okText="Yes"
              cancelText="No"
            >
              <span className={styles.title}>Logout</span>
            </Popconfirm>
          </Menu.Item>
          <MonthPicker
            allowClear={false}
            defaultValue={moment(currentMonthName, dateFormat.formatMonthNameID)}
            onChange={(a, b) => this.handlePeriode(b)}
            format={dateFormat.formatMonthNameID}
            className="float-right mt-2 mr-2"
          />
        </Menu>
      </div>
    )
  }
}

export default MenuTop
