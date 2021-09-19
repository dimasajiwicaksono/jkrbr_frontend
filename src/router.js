import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { ConnectedRouter } from 'connected-react-router'
import Loadable from 'react-loadable'

import Loader from 'components/LayoutComponents/Loader'
import IndexLayout from 'layouts'
import NotFoundPage from 'pages/404'

const loadable = loader =>
  Loadable({
    loader,
    delay: false,
    loading: () => <Loader />,
  })

const routes = [
  // System Pages
  {
    path: '/login',
    component: loadable(() => import('pages/user/login')),
    exact: true,
  },
  {
    path: '/register',
    component: loadable(() => import('pages/user/register')),
    exact: true,
  },
  {
    path: '/forgot',
    component: loadable(() => import('pages/user/forgot')),
    exact: true,
  },
  {
    path: '/profile',
    component: loadable(() => import('pages/user/profile')),
    exact: true,
  },
  {
    path: '/membership',
    component: loadable(() => import('pages/membership')),
    exact: true,
  },
  {
    path: '/membership/kasus_narkoba',
    component: loadable(() => import('pages/membership/detail')),
    exact: true,
  },
  {
    path: '/membership/pemberdayaan',
    component: loadable(() => import('pages/pemberdayaan')),
    exact: true,
  },
  {
    path: '/membership/pencegahan',
    component: loadable(() => import('pages/membership/pencegahan')),
    exact: true,
  },
  {
    path: '/membership/lapor',
    component: loadable(() => import('pages/lapor')),
    exact: true,
  },
  {
    path: '/membership/layanan_masyarakat',
    component: loadable(() => import('pages/layanan_masyarakat')),
    exact: true,
  },
  {
    path: '/membership/layanan_masyarakat/p2m',
    component: loadable(() => import('pages/layanan_masyarakat/p2m')),
    exact: true,
  },
  {
    path: '/membership/layanan_masyarakat/p2m/test_urine',
    component: loadable(() => import('pages/layanan_masyarakat/p2m_test_urine')),
    exact: true,
  },
  {
    path: '/membership/layanan_masyarakat/p2m/sosialisasi',
    component: loadable(() => import('pages/layanan_masyarakat/p2m_sosialisasi')),
    exact: true,
  },
  {
    path: '/member-register/',
    component: loadable(() => import('pages/membership/newRegister')),
    exact: true,
  },
  {
    path: '/change-password',
    component: loadable(() => import('pages/user/ChangePassword')),
    exact: true,
  },
  // Dashboards
  // {
  //   path: '/master',
  //   component: loadable(() => import('pages/dashboard/alpha')),
  // },
  // {
  //   path: '/dashboard/alpha',
  //   component: loadable(() => import('pages/dashboard/alpha')),
  // },
  // {
  //   path: '/dashboard/crypto',
  //   component: loadable(() => import('pages/dashboard/crypto')),
  //   exact: true,
  // },
  // {
  //   path: '/dashboard/gamma',
  //   component: loadable(() => import('pages/dashboard/gamma')),
  //   exact: true,
  // },

  // // Charts
  // {
  //   path: '/charts/chartist',
  //   component: loadable(() => import('pages/charts/chartist')),
  //   exact: true,
  // },
  // {
  //   path: '/charts/chart',
  //   component: loadable(() => import('pages/charts/chart')),
  //   exact: true,
  // },
  // {
  //   path: '/charts/peity',
  //   component: loadable(() => import('pages/charts/peity')),
  //   exact: true,
  // },
  // {
  //   path: '/charts/c3',
  //   component: loadable(() => import('pages/charts/c3')),
  //   exact: true,
  // },

  // // AntDesign/sales/sales-intercompany
  // {
  //   path: '/antd',
  //   component: loadable(() => import('pages/antd')),
  //   exact: true,
  // },
]

class RouterComponent extends React.Component {
  render() {
    const { history } = this.props

    return (
      <ConnectedRouter history={history}>
        <IndexLayout>
          <Switch>
            <Route exact path="/" render={() => <Redirect to="/membership" />} />
            {routes.map(route => (
              <Route
                path={route.path}
                component={route.component}
                key={route.path}
                exact={route.exact}
              />
            ))}
            <Route component={NotFoundPage} />
          </Switch>
        </IndexLayout>
      </ConnectedRouter>
    )
  }
}

export default RouterComponent
