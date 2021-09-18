import React, { Component } from 'react'
import { Row, Col, Button, Icon } from 'antd'
import styles from './style.module.scss'

class ViewComponent extends Component {
  render() {
    const { handleView } = this.props
    const color = '#1890ff'
    return (
      <div>
        <Row type="flex" align="middle">
          <Col md={{ span: 18 }} xs={{ span: 12 }} className="my-2">
            <h5 className={`m-0 ${styles.profileDetail}`}>Profile Details</h5>
          </Col>
          <Col md={{ span: 6 }} xs={{ span: 12 }} className="d-flex justify-content-end">
            <Button type="link" icon="edit" className="pr-0" onClick={() => handleView(true)}>
              Edit Profile
            </Button>
          </Col>
        </Row>
        <Row className={styles.textProfile} type="flex" gutter={8}>
          <Col sm={{ span: 2 }} xs={{ span: 3 }}>
            <Icon type="user" style={{ color }} className="pr-3" />
          </Col>
          <Col sm={{ span: 22 }} xs={{ span: 21 }}>
            Dimas Aji Wicaksono
          </Col>
        </Row>
        <Row className={styles.textProfile} type="flex">
          <Col sm={{ span: 2 }} xs={{ span: 3 }}>
            <Icon type="mail" style={{ color }} className="pr-3" />
          </Col>
          <Col sm={{ span: 22 }} xs={{ span: 21 }}>
            dimaswicaksono002@gmail.com
          </Col>
        </Row>
        <Row className={styles.textProfile} type="flex">
          <Col sm={{ span: 2 }} xs={{ span: 3 }}>
            <Icon type="phone" style={{ color }} className="pr-3" />
          </Col>
          <Col sm={{ span: 22 }} xs={{ span: 21 }}>
            085601455686
          </Col>
        </Row>
        <Row className={styles.textProfile} type="flex">
          <Col sm={{ span: 2 }} xs={{ span: 3 }}>
            <Icon type="man" style={{ color }} className="pr-3" />
          </Col>
          <Col sm={{ span: 22 }} xs={{ span: 21 }}>
            Male
          </Col>
        </Row>
        <Row className={styles.textProfile} type="flex">
          <Col sm={{ span: 2 }} xs={{ span: 3 }}>
            <Icon type="home" style={{ color }} className="pr-3" />
          </Col>
          <Col sm={{ span: 22 }} xs={{ span: 21 }}>
            Jln.Jalak No.8 Rw 001 Rw 002 Kelurahan Pondok Aren Kecamatan Ciledug Tangerang Selatan
            Banten
          </Col>
        </Row>
      </div>
    )
  }
}

export default ViewComponent
