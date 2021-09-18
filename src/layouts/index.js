import React, { Fragment } from 'react'
import { withRouter, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import NProgress from 'nprogress'
import { Helmet } from 'react-helmet'
import Loader from 'components/LayoutComponents/Loader'
import PublicLayout from './Public'
import LoginLayout from './Login'
// import MainLayout from './Main'
import KasirLayout from './Kasir'
import RegisterLayout from './Register'
import MembershipLayout from './Membership'
import ForgotPassword from './Forgot'
import ChangePassword from './ChangePassword'

const Layouts = {
  public: PublicLayout,
  forgot: ForgotPassword,
  change: ChangePassword,
  login: LoginLayout,
  main: MembershipLayout,
  kasir: KasirLayout,
  register: RegisterLayout
}

@withRouter
@connect(({ user, menu, posPointOfSales }) => ({
  user,
  menuTopData: menu.menuTopData,
  outletSelected: posPointOfSales.outletSelected || '',
}))
class IndexLayout extends React.PureComponent {
  previousPath = ''

  componentDidUpdate(prevProps) {
    const { location } = this.props
    const { prevLocation } = prevProps
    if (location !== prevLocation) {
      window.scrollTo(0, 0)
    }
  }

  render() {
    const {
      children,
      location: { pathname, search },
      user,
      // menuTopData,
      outletSelected,
    } = this.props
    // NProgress Management
    const currentPath = pathname + search
    if (currentPath !== this.previousPath) {
      NProgress.start()
    }

    setTimeout(() => {
      NProgress.done()
      this.previousPath = currentPath
    }, 300)

    // Layout Rendering
    const getLayout = () => {
      if (pathname === '/') {
        return 'public'
      }
      if (pathname === '/kasir') {
        return 'kasir'
      }
      if (pathname === '/register') {
        return 'register'
      }
      if (pathname === '/change-password') {
        return 'change'
      }
      if (pathname === '/forgot') {
        return 'forgot'
      }
      if (pathname === '/login') {
        return 'login'
      }
      return 'main'
    }

    // const getMenu = () => {
    //   if (menuTopData.length > 0) {
    //     return menuTopData[0]
    //   }
    //   return '/master'
    // }

    const Container = Layouts[getLayout()]
    const isUserAuthorized = user.authorized
    const isUserLoading = user.loading
    const isLoginLayout = getLayout() === 'login'
    const isRegisterLayout = getLayout() === 'register'
    const isForgotLayout = getLayout() === 'forgot'
    const isChangePasswordLayout = getLayout() === 'change'
    const isKasir = getLayout() === 'kasir' && outletSelected !== ''
    // const isDefaultMenu = getLayout() === 'main'

    const BootstrappedLayout = () => {
      // show loader when user in check authorization process, not authorized yet and not on login pages
      if (isUserLoading && !isUserAuthorized && !isLoginLayout) {
        return <Loader />
      }
      // redirect to login page if current is not login page and user not authorized
      if (!isUserAuthorized && isRegisterLayout) {
        return <Container>{children}</Container>
      }
      if (!isUserAuthorized && isForgotLayout) {
        return <Container>{children}</Container>
      }
      if (!isUserAuthorized && isChangePasswordLayout) {
        return <Container>{children}</Container>
      }
      if (!isLoginLayout && !isUserAuthorized) {
        return <Redirect to={{ pathname: '/login' }} />
      }
      // redirect to main dashboard when user on login page and authorized
      if (isLoginLayout && isUserAuthorized) {
        return <Redirect to={{ pathname: '/membership' }} />
      }
      if (isLoginLayout && isUserAuthorized && isKasir) {
        return <Redirect to={{ pathname: '/kasir' }} />
      }
      // IF USER AUTHORIZED & ACCESS REGISTER
      if (isUserAuthorized && isRegisterLayout) {
        return <Redirect to={{ pathname: '/membership' }} />
      }
      if (isUserAuthorized && isForgotLayout) {
        return <Redirect to={{ pathname: '/membership' }} />
      }
      if (isUserAuthorized && isChangePasswordLayout) {
        return <Redirect to={{ pathname: '/membership' }} />
      }
      // in other case render previously set layout
      return <Container>{children}</Container>
    }

    return (
      <Fragment>
        <Helmet titleTemplate="SCAP Solution" title="" />
        {BootstrappedLayout()}
      </Fragment>
    )
  }
}

export default IndexLayout
