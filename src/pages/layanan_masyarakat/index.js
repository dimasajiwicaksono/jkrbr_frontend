import React, { Component } from 'react'
import { connect } from 'react-redux'
import { List, /* Divider,  */ Icon, Row, Col, Card, Spin /* notification */ } from 'antd'
import { Link } from 'react-router-dom'
// import actions from '../../redux/user/actions'
import styles from '../membership/style.module.scss'

const mapStateToProps = ({ user, membership }) => ({
  user,
  membershipData: membership.layananMasyarakatList,
  membership,
})

@connect(mapStateToProps)
class Membership extends Component {


  componentDidMount() {
    const { dispatch } = this.props
    dispatch({
      type: 'membership/GET_DATA_LAYANAN_MASYARAKAT_LIST',
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
      color: this.getColor(el.status),
      colorText: this.getColorText(el.status),
    }))

    const resultData = [...DATA]

    return (
      <div>
        <div className={styles.container}>
          <div className={styles.child}>
            <div className={`${styles.cardLogin}`}>
              <div className="p-4 m-0">
                <Spin spinning={membership.loading}>
                  <Link to="/membership" className='utils__link--blue utils__link mt-2 mr-1'>
                    <Icon type="arrow-left" style={{fontSize: '1.5em'}} />
                    <span style={{fontSize: '1.5em', margin: 10}}>Layanan Masyarakat</span>
                  </Link>

                  <Card
                    hoverable
                    style={{
                      border: 'none',
                      height: '20vh',
                      marginBottom: '1.5em',
                      backgroundColor: `#3a99ff`
                    }}
                  >
                    <h5 className='font-weight-bold text-white'>Layanan Masyarakat BNN</h5>
                    <p className='text-white'>Sekarang Lebih mudah dan online</p>
                  </Card>


                  <List
                    grid={{
                      gutter: 16,
                      xs: 1,
                      sm: 1,
                      md: 1,
                      lg: 1,
                      xl: 1,
                      xxl: 1,
                    }}
                    dataSource={resultData}
                    renderItem={el => (
                      <List.Item>
                        {!el.isAdd && (
                          <Link to={`/membership/layanan_masyarakat/${el.link}`}>
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
                              {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/interactive-supports-focus */}
                              <div
                                // role="button"
                                style={{
                                  // backgroundColor: el.colorText,
                                  borderRadius: 8,
                                  textAlign: 'left',
                                }}
                              >

                                <Row gutter={8}>
                                  <Col span={8}>
                                    <Icon type='home' style={{fontSize: '4em'}} />
                                  </Col>
                                  <Col span={16}>
                                    <h4 className='font-weight-bold text-dark'>{el.form}</h4>
                                    <h5 className='font-weight-bold' style={{color: `#3a99ff`}}>
                                      Lihat Detail
                                      <span> <Icon type="arrow-right" style={{fontSize: '1em'}} /></span>
                                    </h5>
                                  </Col>
                                </Row>

                              </div>
                            </Card>
                          </Link>
                        )}
                      </List.Item>
                    )}
                  />
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
