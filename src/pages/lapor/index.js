import React, { Component } from 'react'
import { connect } from 'react-redux'
import {Icon, Spin, Form, Button} from 'antd'
// import actions from '../../redux/user/actions'
import { Link } from 'react-router-dom'
import styles from '../membership/style.module.scss'

const mapStateToProps = ({ user, membership }) => ({
  user,
  membership,
})

@connect(mapStateToProps)
class Lapor extends Component {

  componentDidMount() {
    const { dispatch } = this.props
    dispatch({
      type: 'membership/GET_DATA_LIST',
      payload: {},
    })
  }

  onSubmit = () => {
    console.log('laporan')
  }




  render() {

    return (
      <div>
        <div className={styles.container}>
          <div className={styles.child}>
            <div className={`${styles.cardLogin}`}>
              <div className="p-4 m-0">
                <Link to="/membership" className='utils__link--blue utils__link mt-2 mr-1'>
                  <Icon type="arrow-left" style={{fontSize: '1.5em'}} />
                  <span style={{fontSize: '1.5em', margin: 10}}>Buat Lapor</span>
                </Link>
                <Spin spinning={false}>
                  <Form onSubmit={this.onSubmit}>
                    <div className='mt-4' style={{height: '60vh'}}>
                      <p>Laporan ini akan disembunyikan di aplikasi Jakarta Bersinar
                        namun, tetap masuk dalam sistem kami. Foto dan Identitas kamu tidak
                        akan terlihat dan bersifat rahasia.
                      </p>
                    </div>


                    <div className='mt-4'>
                      <Button
                        htmlType="submit"
                        block
                        size='large'
                        style={{backgroundColor: `#3a99ff`, color: 'white', borderRadius: 8, fontWeight: 'bold'}}
                      >
                        Buat Laporan
                      </Button>
                      <Link to="/membership">
                        <Button
                          block
                          size='large'
                          className='mt-4'
                          style={{color: 'black', borderRadius: 8, fontWeight: 'bold'}}
                        >
                          Batal
                        </Button>
                      </Link>

                    </div>
                  </Form>
                </Spin>
              </div>

            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Form.create()(Lapor)
