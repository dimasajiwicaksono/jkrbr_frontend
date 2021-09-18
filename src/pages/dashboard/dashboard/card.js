import React from 'react'
import { Skeleton, Icon } from 'antd'
import styles from './style.module.scss'

class CardDashboard extends React.Component {
  render() {
    const {
      waitingApprove,
      amount,
      info,
      loading,
      error,
      openSubModule,
      keyCode,
      forbidden,
    } = this.props

    // IF PAGE LOADING
    if (loading) {
      return (
        <div className={`${styles.loading} card card--withShadow`}>
          <div className="row">
            <Skeleton active paragraph={{ rows: 1, width: '90%' }} />
          </div>
          <div className={styles.footer}>
            Please Wait <Icon type="loading" />
          </div>
        </div>
      )
    }

    // IF ERROR
    if (error) {
      return (
        <div className={`${styles.error} card card--withShadow`}>
          <div className={styles.icon}>
            <i className="lnr lnr-cross-circle" />
          </div>
          <div>
            <span className={styles.titleError}>ERROR</span>
            <div className={styles.info}>Please Try Again</div>
          </div>
          <div className={styles.footer} />
        </div>
      )
    }

    if (forbidden) {
      return (
        <div className={`${styles.error} card card--withShadow`}>
          <div className={styles.icon}>
            <i className="lnr lnr-lock" />
          </div>
          <div>
            <span className={styles.titleError}>Access Denied</span>
            <div className={styles.info}>No Access for this role</div>
          </div>
          <div className={styles.footer} />
        </div>
      )
    }

    return (
      <div
        className={`${styles.cardDashboard} card card--withShadow ${
          waitingApprove ? styles.waitingApprove : styles.alertStock
        }`}
      >
        <div className={styles.icon}>
          <i className={waitingApprove ? 'lnr lnr-alarm' : 'lnr lnr-warning'} />
        </div>
        <div>
          <span className={styles.amount}>{amount}</span>
          <div className={styles.info}>{info}</div>
        </div>
        <button
          className={styles.footer}
          onClick={() => openSubModule(keyCode, true)}
          type="submit"
        >
          See Detail <i className="lnr lnr-arrow-right-circle" />
        </button>
      </div>
    )
  }
}

CardDashboard.defaultProps = {
  waitingApprove: false,
  amount: '',
  info: '',
  loading: false,
  error: false,
  openSubModule: function empty() {
    return null
  },
  keyCode: {},
}

export default CardDashboard
