import React, { Component } from 'react'
import { Row, Col, Icon, Divider } from 'antd'
import { Link } from 'react-router-dom'
import EditComponent from './edit'
import ViewComponent from './view'
import styles from './style.module.scss'
import Logo from '../../../assets/images/kidzooonaLogo.png'
import MalePict from '../../../assets/images/male.svg'

class Profile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isEdit: false,
    }
  }

  handleView = val => {
    this.setState({
      isEdit: val
    })
  }

  render() {
    const { isEdit } = this.state

    // const formItemLayout = {
    //   labelCol: {
    //     xs: { span: 24 },
    //   },
    //   wrapperCol: {
    //     xs: { span: 24 }
    //   },
    // }

    return (
      <div className={styles.container}>
        <div className={styles.child}>
          <div className={`${styles.cardLogin}`}>
            <div className='m-0 card card--withShadow p-5'>
              <Row type="flex">
                <Col span={18} className={styles.headerLeft}>
                  <Link to="/membership" className='utils__link--blue utils__link mt-2 mr-1'>
                    <Icon type="arrow-left" /> BACK
                  </Link>
                </Col>
                <Col span={6} className='d-flex align-items-center justify-content-end'>
                  <img
                    src={Logo}
                    alt="Logo"
                    className={styles.image}
                  />
                </Col>
              </Row>
              <Row type="flex" className='mt-2'>
                <Col md={{ span: 8 }} sm={{ span: 24 }} xs={{ span: 24 }} className={`${styles.wrapperPict}`}>
                  <img
                    src={MalePict}
                    alt="Pict"
                    className={styles.pict}
                  />
                </Col>
                <Divider className={`mb-1 ${styles.divider}`} />
                <Col md={{ span: 16 }} sm={{ span: 24 }} xs={{ span: 24 }}>
                  {isEdit
                    ? <EditComponent handleView={e => this.handleView(e)} />
                    : <ViewComponent handleView={e => this.handleView(e)} />
                  }
                </Col>
              </Row>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Profile