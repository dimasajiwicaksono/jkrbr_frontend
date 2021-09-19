import React, { Component } from 'react'
import { connect } from 'react-redux'
import { List,/* Divider,  */ Icon, Row, Col, Card, Spin, Carousel, Button} from 'antd'
import { Link } from 'react-router-dom'
import actions from '../../redux/user/actions'
import styles from './style.module.scss'
import logo from '../../assets/images/logo.svg'


const mapStateToProps = ({ user, membership }) => ({
  user,
  membershipData: membership.membershipData,
  membership,
})

@connect(mapStateToProps)
class Membership extends Component {
  handleLogout = () => {
    const { dispatch } = this.props
    dispatch({
      type: actions.LOGOUT,
    })
  }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch({
      type: 'membership/GET_DATA_LIST',
      payload: {},
    })
  }

  getColor = status => {
    let color
    switch (status) {
      case '0':
        color = 'rgba(255,145,115,0.2)'
        break
      case '1':
        color = 'rgba(86,140,165,0.2)'
        break
      default:
        color = 'rgba(86,140,165,0.1)'
    }
    return color
  }

  getColorText = status => {
    let color
    switch (status) {
      case '0':
        color = 'rgba(255,145,115,1)'
        break
      case '1':
        color = "rgba(58, 153, 255, 1)"
        break
      default:
        color = "rgba(58, 153, 255, 1)"
    }
    return color
  }

  logout = () => {
    const {dispatch} = this.props
    dispatch({
      type:actions.LOGOUT,
      payload:{}
    })
  }

  render() {
    const { membershipData, membership } = this.props
    const DATA = membershipData.map(el => ({
      ...el,
      isAdd: false,
      // color: this.getColor(el.status),
      colorText: this.getColorText(el.status),
    }))

    const resultData = [...DATA, { isAdd: true }]

    return (
      <div>
        <div className={styles.container}>
          <div className={styles.child}>
            <div className={`${styles.cardLogin}`}>
              <div className="p-4 m-0">
                <Row style={{height: '8vh'}}>
                  <Col span={12}>
                    <img src={logo} alt='logo' style={{width: '100%' }} />
                  </Col>
                  <Col span={12} className="d-flex align-items-center justify-content-end">
                    <Icon type="customer-service" style={{fontSize: '2em'}} />
                  </Col>
                </Row>


                <Spin spinning={membership.loading}>
                  <Carousel
                    style={{
                      backgroundColor: `#3a99ff`,
                      height:'20vh',
                      borderRadius: 12,
                      marginBottom: '2vh'
                    }}
                  >
                    <div>
                      <h3>1</h3>
                    </div>
                    <div>
                      <h3>2</h3>
                    </div>
                    <div>
                      <h3>3</h3>
                    </div>
                  </Carousel>
                  <List
                    grid={{
                      gutter: 8,
                      xs: 3,
                      sm: 3,
                      md: 3,
                      lg: 3,
                      xl: 3,
                      xxl: 3,
                    }}
                    dataSource={resultData}
                    renderItem={el => (
                      <List.Item>
                        {!el.isAdd && (
                          <Link to={`/membership/${el.link}`}>
                            <Card
                              loading={membership.loading}
                              hoverable
                              style={{
                                borderRadius: 20,
                                border: 'none',
                                height: '15vh',
                                backgroundColor: el.color,
                              }}
                            >
                              <Row>
                                <Col span={24} className='text-center'>
                                  <span style={{ padding: '0.5rem'}}>
                                    <Icon type={el.icon} style={{fontSize: '2em', color:el.colorText}} />
                                  </span>
                                </Col>
                              </Row>
                              {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/interactive-supports-focus */}
                              <div
                                // role="button"
                                style={{
                                  // backgroundColor: el.colorText,
                                  borderRadius: 8,
                                  textAlign: 'center',
                                  marginTop: '0.5em'
                                }}
                              >

                                <Row gutter={8}>
                                  <Col span={24}>
                                    <h5 className='text-center' style={{color: el.colorText, fontSize: '0.8em'}}>{el.form}</h5>
                                  </Col>
                                </Row>

                              </div>
                            </Card>
                          </Link>
                        )}
                      </List.Item>
                    )}
                  />
                  <Button
                    block
                    style={{
                      position: "fixed",
                      bottom: 0,
                      zIndex: 2,
                      left: 0,
                      right: 0,
                      height: '10vh',
                      borderRadius: 12,
                      backgroundColor:  'white',
                      outline: "none",
                      borderColor: 'white',
                    }}
                  >
                    <Row gutter={8}>
                      <Col span={5}>
                        <Button style={{border: 'none'}} type='circle'>
                          <Icon type='home' style={{fontSize: '1.5em'}} />
                          <p>Beranda</p>
                        </Button>
                      </Col>
                      <Col span={5}>
                        <Button style={{border: 'none'}} type='circle'>
                          <Icon type='user' style={{fontSize: '1.5em'}} />
                          <p>Aktivitas</p>
                        </Button>
                      </Col>
                      <Col span={4}>
                        <Link to='membership/lapor'>
                          <Button
                            style={{
                              border: 'none',
                              bottom: '5vh',
                              width: 50,
                              height: 50,
                              zIndex: 2,
                              left: 0,
                              right: 0,
                              backgroundColor: "rgba(58,153,255,0.8)"
                            }}
                            type='circle'
                          >
                            <Icon type='camera' style={{fontSize: '1.5em', color: 'white'}} />
                          </Button>
                        </Link>

                      </Col>
                      <Col span={5}>
                        <Button style={{border: 'none'}} type='circle'>
                          <Icon type='bell' style={{fontSize: '1.5em'}} />
                          <p>Notifikasi</p>
                        </Button>
                      </Col>
                      <Col span={5}>
                        <Button style={{border: 'none'}} type='circle' onClick={this.logout}>
                          <Icon type='logout' style={{fontSize: '1.5em'}} />
                          <p>Keluar</p>
                        </Button>

                      </Col>
                    </Row>
                  </Button>
                </Spin>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Membership
