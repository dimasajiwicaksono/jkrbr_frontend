import React from 'react'
import { connect } from 'react-redux'
import { Menu, Popconfirm, DatePicker, message, Drawer, Radio } from 'antd'
import { Link, withRouter } from 'react-router-dom'
import { store as reduxStore } from 'index'
import * as moment from 'moment'
import store from 'store'
import _ from 'lodash'
import styles from './style.module.scss'
import './style.css'
import { datePeriod, dateFormat } from '../../../../utils/helper'
import SelectScap from '../../../CleanUIComponents/Scap/SelectScap'
import ProfileMenu from '../../TopBar/ProfileMenu/indexVer2'
import actions from '../../../../redux/user/actions'

const { SubMenu, Divider } = Menu

const mapStateToProps = ({ menu, settings, user }) => ({
  menuData: menu.menuTopData,
  menuSideData: menu.menuSideData,
  isLightTheme: settings.isLightTheme,
  isSettingsOpen: settings.isSettingsOpen,
  currentMonthNum: settings.setPeriode.currentMonthNum,
  currentMonthName: settings.setPeriode.currentMonthName,
  dataCompany: user.mstCompanyData,
  user,
})

@withRouter
@connect(mapStateToProps)
class MenuTop extends React.Component {
  constructor() {
    super()
    this.state = {
      selectedKeys: store.get('app.menu.selectedKeys') || [],
      compCode: localStorage.getItem('compCode'),
      userName: localStorage.getItem('username'),
      visibleDrawer: false,
      statusCode: 200,
      locale: 'id-ID',
    }
  }

  componentWillMount() {
    this.setSelectedKeys(this.props)
    const { dispatch } = this.props
    dispatch({
      type: actions.GET_MST_COMPANY,
      payload: {
        compCode: '',
        compName: '',
      },
    })
  }

  componentWillReceiveProps(newProps) {
    const { statusCode } = this.state
    const { status } = newProps.user
    this.setSelectedKeys(newProps)
    if (statusCode !== status) {
      this.setState({
        statusCode: status,
      })
    }
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
      type: actions.LOGOUT,
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

  handleCompany(e) {
    const { dispatch, user } = this.props
    const promise = new Promise(resolve => {
      const payload = {
        compCode: e,
      }
      dispatch({
        type: actions.CHANGE_COMPANY,
        payload,
      })
      setTimeout(() => {
        resolve(true)
      }, 1000)
    })
    promise.then(res => {
      if (res) {
        const { token } = user
        const { statusCode } = this.state
        const tokenData = JSON.parse(atob(token.split('.')[1]))
        this.setState({
          compCode: statusCode === 200 ? e : tokenData.compCode,
          visibleDrawer: false,
        })
      }
    })
  }

  setDrawer = () => {
    this.setState({ visibleDrawer: true })
  }

  onClose = () => {
    this.setState({
      visibleDrawer: false,
    })
  }

  changeLocale = e => {
    const { dispatch } = this.props
    const localeValue = e.target.value

    dispatch({
      type: 'settings/CHANGE_SETTING',
      payload: {
        setting: 'locale',
        value: localeValue,
      },
    })
    this.setState({ locale: localeValue })
  }

  render() {
    const { selectedKeys, compCode, userName, visibleDrawer, locale } = this.state
    const { isLightTheme, currentMonthName, menuData, dataCompany } = this.props
    const { MonthPicker } = DatePicker
    const optCompany = []

    if (dataCompany.data !== undefined) {
      const { data } = dataCompany
      data.map((val, key) =>
        optCompany.push({
          key,
          value: val.compCode,
          title: val.compName,
        }),
      )
    }

    const menu = (
      <Menu onClick={this.handleClick} selectedKeys={selectedKeys}>
        {menuData.length > 0 && (
          <Menu.Item key="profile">
            <Link to="profile" onClick={() => this.getSideMenu('00')}>
              <span className={styles.icon} />
              <span className={styles.title}>Profile</span>
            </Link>
          </Menu.Item>
        )}
        <Menu.Item key="setting" onClick={this.setDrawer}>
          <span>Setting</span>
        </Menu.Item>
        <Menu.Item key="logout">
          <Popconfirm
            placement="topLeft"
            title="Are you sure to logout ?"
            onConfirm={() => this.logout()}
            okText="Yes"
            cancelText="No"
          >
            <span className={styles.title}>Logout</span>
          </Popconfirm>
        </Menu.Item>
      </Menu>
    )

    const DARK = '#001529'
    const LIGHT = '#fffff'

    const name = (userName || '').trim().split(' ')[0] || ''

    return (
      <div style={{ position: 'fixed', zIndex: 100, width: '100%' }} className="row ml-0">
        <div className="col-9" style={{ backgroundColor: isLightTheme ? LIGHT : DARK }}>
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
          </Menu>
        </div>
        <div
          className="col-3 d-flex flex-row justify-content-around"
          style={{
            width: '100%',
            backgroundColor: isLightTheme ? LIGHT : DARK,
            textAlign: 'end',
            justifyContent: 'center',
          }}
        >
          <p className="text-light m-auto">{name}</p>
          <MonthPicker
            style={{ width: 125 }}
            allowClear={false}
            defaultValue={moment(currentMonthName, dateFormat.formatMonthNameID)}
            onChange={(a, b) => this.handlePeriode(b)}
            format={dateFormat.formatMonthNameID}
            className="mt-2 mr-4 ml-2"
          />
          <ProfileMenu menu={menu} />
          <Drawer
            title="Setting"
            placement="right"
            closable={false}
            onClose={this.onClose}
            visible={visibleDrawer}
          >
            <h6>Select Company</h6>
            <SelectScap
              datas={optCompany}
              onChange={val => this.handleCompany(val)}
              value={compCode}
              style={{ width: '100%' }}
            />

            <div className="change-locale mt-3">
              <span>Change Language </span>
              <Radio.Group
                className="mt-2"
                value={locale}
                onChange={this.changeLocale}
                buttonStyle="solid"
              >
                <Radio.Button key="en" value="en-US" disabled>
                  EN
                </Radio.Button>
                <Radio.Button key="id" value="id-ID">
                  ID
                </Radio.Button>
                <Radio.Button key="zh" value="zh-CN" disabled>
                  中文
                </Radio.Button>
              </Radio.Group>
            </div>
          </Drawer>
        </div>
      </div>
    )
  }
}

export default MenuTop
