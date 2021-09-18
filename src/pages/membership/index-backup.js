import React, { Component } from 'react'
import { connect } from 'react-redux'
import { List, Button, Divider, Icon, Row, Col } from 'antd'
import { Link } from 'react-router-dom'
import actions from '../../redux/user/actions'
import styles from './style.module.scss'
import Logo from '../../assets/images/kidzooonaLogo.png'
import { datePeriod } from '../../utils/helper'

const mapStateToProps = ({ user }) => ({
  user,
})

@connect(mapStateToProps)
class Membership extends Component {
  handleLogout = () => {
    const { dispatch } = this.props
    dispatch({
      type: actions.LOGOUT,
    })
  }

  render() {
    const username = localStorage.getItem('username')

    const dummyData = []
    const randomNumber = num => Math.floor(Math.random() * Math.floor(num))
    for (let i = 0; i <= 15; i += 1) {
      dummyData.push({
        date: datePeriod.todayFullDate,
        store: 'CIBINONG',
        desc: `
          Order
          ${randomNumber(9)}${randomNumber(9)}${randomNumber(9)}${randomNumber(9)}${randomNumber(
          9,
        )}${randomNumber(9)}${randomNumber(9)}${randomNumber(9)}${randomNumber(9)}${randomNumber(
          9,
        )}${randomNumber(9)}${randomNumber(9)}`,
        point: randomNumber(100),
      })
    }

    return (
      <div>
        <div className={styles.container}>
          <div className={styles.child}>
            <div className={`${styles.cardLogin}`}>
              <div className="p-4 m-0 card card--withShadow">
                <Row type="flex" gutter={10}>
                  <Col span={6} className={styles.child}>
                    <img src={Logo} alt="Logo" className={styles.image} />
                  </Col>
                  <Col span={18}>
                    <Row type="flex">
                      <Col span={18} xs={{ span: 14 }}>
                        <p className={styles.username}>{username}</p>
                        <p className={styles.totalTitle}>Total Reward Point</p>
                        <div className={styles.points}>
                          <Icon type="star" theme="filled" style={{ color: '#ffcd19' }} />{' '}
                          {dummyData.reduce((a, { point }) => a + point, 0)} Point
                        </div>
                      </Col>
                      <Col span={6} xs={{ span: 10 }}>
                        <Row>
                          <Col span={24} className="d-flex justify-content-end">
                            <Link to="/profile">
                              <Button className="pr-1" type="link" icon="user">
                                Profile
                              </Button>
                            </Link>
                          </Col>
                          <Col span={24} className="d-flex justify-content-end">
                            {/* LOGOUT NYA NANTI KASIH NOTIF LAGI YAKIN LOGOUT ATAU NGK  */}
                            <Button
                              className="pr-0"
                              type="link"
                              onClick={this.handleLogout}
                              icon="logout"
                            >
                              Logout
                            </Button>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                    <Row type="flex">
                      <Col span={12} xs={{ span: 24 }}>
                        <div className={styles.points}>ID : 085601455686050420</div>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Divider className="mt-2 mb-0" />
                <List
                  size="small"
                  header={
                    <div className="col-12">
                      <h6 className="font-weight-bold">History Point</h6>
                    </div>
                  }
                  footer={false}
                  dataSource={dummyData}
                  renderItem={el => (
                    <List.Item>
                      <div className="col-md-3 col-sm-3 col-xs-12 p-1">{el.date}</div>
                      <div className="col-md-3 col-sm-3 col-xs-12 p-1">{el.store}</div>
                      <div className="col-md-3 col-sm-6 col-xs-12 p-1 font-weight-bold">
                        {el.desc}
                      </div>
                      <div className="col-md-3 col-sm-3 col-xs-12 p-1">
                        <Icon type="star" theme="filled" style={{ color: '#ffcd19' }} /> +{el.point}{' '}
                        Point
                      </div>
                    </List.Item>
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Membership
