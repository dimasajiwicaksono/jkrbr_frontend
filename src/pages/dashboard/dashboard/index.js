import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Button, Skeleton } from 'antd'
import CardDashboard from './card'
import { sideMenuFilter, handleAccess } from '../../../utils/helper'

const mapStateToProps = ({ menu, dashboard }) => ({
  topMenu: menu.menuTopData,
  sideMenu: menu.menuSideData,
  dashboard,
  menu,
})
@withRouter
@connect(mapStateToProps)
class Dashboard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch({
      type: 'dashboard/GET_DATA_LIST',
    })
  }

  reloadData = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'dashboard/GET_DATA_LIST',
    })
  }

  render() {
    const { openSubModule, topMenu, sideMenu, dashboard, menu } = this.props
    const { loading, error, dashboardData } = dashboard
    let data = []
    const templateLoading = [
      [1, 2, 3],
      [4, 5, 6],
    ]

    if (error || (!topMenu.length && !sideMenu.length && !menu.loading)) {
      return (
        <>
          <div className="utils__title mb-3">
            <strong className="text-uppercase font-size-16">Network Error</strong>
            {topMenu.length && sideMenu.length && !menu.loading ? (
              <Button
                type="default"
                icon="reload"
                loading={loading}
                onClick={this.reloadData}
                style={{ marginLeft: 8, width: '100px' }}
                size="small"
              >
                Reload
              </Button>
            ) : null}
          </div>
          <div className="row">
            <div className="col-lg-4">
              <CardDashboard error />
            </div>
          </div>
        </>
      )
    }

    if (loading || menu.loading) {
      return (
        <>
          {templateLoading.map((el, index) => (
            <React.Fragment key={`wrap-card${index + 1}`}>
              <div className="utils__title mb-3">
                <Skeleton active title={false} paragraph={{ rows: 1, width: '20%' }} />
              </div>
              <div className="row">
                {el.map((val, idx) => (
                  <div className="col-lg-4" key={`col-cardDashboard${idx + 1}`}>
                    <CardDashboard loading />
                  </div>
                ))}
              </div>
            </React.Fragment>
          ))}
        </>
      )
    }

    if (dashboardData.length) {
      // COMPARE ACCESS TO TOP MENU
      const filterTopMenu = dashboardData.filter(dashProps =>
        topMenu.some(top => top.key === dashProps.header.key),
      )

      // GET DATA ACCESS MODULE
      const result = []
      filterTopMenu.map(topMenus => {
        const emptyArray = []
        topMenus.data.map(top =>
          emptyArray.push(
            sideMenuFilter(menu, topMenus.header.key, top.keyModule.key)
              ? sideMenuFilter(menu, topMenus.header.key, top.keyModule.key)
              : {},
          ),
        )
        result.push(emptyArray)
        return true
      })
      // console.log(result)

      // ASSIGNMENT STATUS ACCESS TO ARRAY RESULT
      result.map((res, index) =>
        res.map((r, idx) => {
          filterTopMenu[index].data[idx] = {
            ...filterTopMenu[index].data[idx],
            access: Object.prototype.hasOwnProperty.call(r, 'access') ? { ...r.access } : {},
          }
          return true
        }),
      )

      // ADD KEY TOTAL AMOUNT
      filterTopMenu.map((res, index) => {
        const numberTotal = res.data
          .filter(({ access }) => Object.keys(access).length)
          .reduce((a, { amount }) => a + amount, 0)
        filterTopMenu[index].header = { ...res.header, totalAmount: numberTotal }
        return true
      })

      // REMOVE ELEMENT NOT HAVE ACCESS DATA
      const removeDataNoAccess = filterTopMenu.filter((f, i) => {
        // FILTER DATA SUB MODULE YANG TIDAK ADA ACCESS SAMA SEKALI
        const hasAccess = filterTopMenu[i].data.filter(a => handleAccess(a.access, a.roleAccess))
        // console.log(hasAccess)
        return hasAccess.length
      })
      data = [...removeDataNoAccess]
      // console.log(data)
    }

    return (
      <>
        {data.length ? (
          data.map((el, index) => (
            <React.Fragment key={`wrap-card${index + 1}`}>
              <div className="utils__title mb-3">
                <strong className="text-uppercase font-size-16">
                  Reminder {el.header.nameModule} ({el.header.totalAmount})
                </strong>
                {index === 0 ? (
                  <Button
                    type="default"
                    icon="reload"
                    loading={loading}
                    onClick={this.reloadData}
                    style={{ marginLeft: 10, width: '100px' }}
                    size="small"
                  >
                    Refresh
                  </Button>
                ) : null}
              </div>
              <div className="row">
                {el.data.map(
                  (val, idx) =>
                    handleAccess(val.access, val.roleAccess) && (
                      <div className="col-lg-4" key={`col-cardDashboard${idx + 1}`}>
                        <CardDashboard
                          openSubModule={openSubModule}
                          keyCode={val.keyModule}
                          waitingApprove={val.status === 'approve'}
                          amount={val.amount}
                          info={val.title}
                        />
                      </div>
                    ),
                )}
              </div>
            </React.Fragment>
          ))
        ) : (
          // FOR IF USER ROLE NO ACCESS
          <>
            <div className="utils__title mb-3">
              <strong className="text-uppercase font-size-16">Reminder (-)</strong>
            </div>
            <div className="row">
              <div className="col-lg-4">
                <CardDashboard forbidden />
              </div>
            </div>
          </>
        )}
      </>
    )
  }
}

export default Dashboard
