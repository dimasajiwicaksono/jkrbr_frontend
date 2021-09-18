import React, { Component } from 'react'
import { connect } from 'react-redux'
import { List,/* Divider,  */ Icon, Row, Col, Card, Spin /* notification */ , Carousel, Button} from 'antd'
import { Link } from 'react-router-dom'
import actions from '../../redux/user/actions'
import styles from './style.module.scss'


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
        color = 'rgba(86,140,165,1)'
        break
      default:
        color = 'rgba(255,145,115,1)'
    }
    return color
  }

  render() {
    const { membershipData, membership } = this.props
    const DATA = membershipData.map(el => ({
      ...el,
      isAdd: false,
      color: this.getColor(el.status),
      colorText: this.getColorText(el.status),
    }))

    const resultData = [...DATA, { isAdd: true }]

    return (
      <div>
        <div className={styles.container}>
          <div className={styles.child}>
            <div className={`${styles.cardLogin}`}>
              <div className="p-4 m-0">
                <Spin spinning={membership.loading}>
                  <Carousel
                    style={{
                      backgroundColor: `#3a99ff`,
                      height:'20vh'

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
                    <div>
                      <h3>4</h3>
                    </div>
                  </Carousel>,
                  <List
                    grid={{
                      gutter: 16,
                      xs: 2,
                      sm: 2,
                      md: 2,
                      lg: 2,
                      xl: 2,
                      xxl: 2,
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
                                height: '18vh',
                                backgroundColor: el.color,
                              }}
                            >
                              <Row>
                                <Col span={24} className='text-center'>
                                  <span style={{ padding: '0.75rem'}}>
                                    <Icon type='home' style={{fontSize: 25}} />
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
                                    <h5 className='text-center'>{el.form}</h5>
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
                      borderColor: 'white'
                    }}
                  >
                    <Row gutter={8}>
                      <Col span={6}>
                        <Icon type='home' style={{fontSize: '2em'}} />
                      </Col>
                      <Col span={6}>
                        <Icon type='home' style={{fontSize: '2em'}} />
                      </Col>
                      <Col span={6}>
                        <Icon type='home' style={{fontSize: '2em'}} />
                      </Col>
                      <Col span={6}>
                        <Icon type='user' style={{fontSize: '2em'}} />
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
