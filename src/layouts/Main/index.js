import React from 'react'
import { BackTop, Layout } from 'antd'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import classNames from 'classnames'
import Menu from 'components/LayoutComponents/Menu'
import Footer from 'components/LayoutComponents/Footer'
import TabsComponent from './tabs'

const mapStateToProps = ({ settings, menu }) => ({
  isBorderless: settings.isBorderless,
  isSquaredBorders: settings.isSquaredBorders,
  isFixedWidth: settings.isFixedWidth,
  isMenuShadow: settings.isMenuShadow,
  isMenuTop: settings.isMenuTop,
  isMobileView: settings.isMobileView,
  menuLoading: menu.loading,
})

@withRouter
@connect(mapStateToProps)
class MainLayout extends React.PureComponent {
  componentDidMount() {
    const { dispatch } = this.props
    dispatch({
      type: 'menu/GET_DATA',
    })
    dispatch({
      type: 'menu/GET_MODULE_MASTER',
    })
  }

  render() {
    const {
      children,
      isBorderless,
      isSquaredBorders,
      isFixedWidth,
      isMenuShadow,
      isMenuTop,
      isMobileView,
      menuLoading,
    } = this.props
    return (
      <Layout
        className={classNames({
          settings__borderLess: isBorderless,
          settings__squaredBorders: isSquaredBorders,
          settings__fixedWidth: isFixedWidth,
          settings__menuShadow: isMenuShadow,
          settings__menuTop: isMenuTop,
        })}
      >
        <BackTop />
        <Menu />
        <Layout>
          <Layout.Content style={{ paddingTop: '50px', height: '100%', position: 'relative' }}>
            {!isMobileView && (
              <div className="utils__content" style={{ padding: '0 15px' }}>
                <TabsComponent content={children} />
              </div>
            )}
            {isMobileView && (
              <div className="utils__content" style={{ paddingTop: '5rem' }}>
                {!menuLoading && children}
              </div>
            )}
          </Layout.Content>
          <Layout.Footer style={{ borderTop: '1px solid #dcddde' }} className="pt-2 pb-1">
            <Footer />
          </Layout.Footer>
        </Layout>
      </Layout>
    )
  }
}

export default MainLayout
