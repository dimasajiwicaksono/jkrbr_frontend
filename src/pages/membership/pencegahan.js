import React, { Component } from 'react'
import { connect } from 'react-redux'
import {Icon, Spin, Form, Input, Button} from 'antd'
// import actions from '../../redux/user/actions'
import { Link } from 'react-router-dom'
import styles from './style.module.scss'

const mapStateToProps = ({ user, membership }) => ({
  user,
  membership,
})

@connect(mapStateToProps)
class Pemberdayaan extends Component {

  render() {
  const { form} = this.props

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
      },
      wrapperCol: {
        lg: { span: 24 },
      },
    }
    return (
      <div>
        <div className={styles.container}>
          <div className={styles.child}>
            <div className={`${styles.cardLogin}`}>
              <div className="p-4 m-0">
                <Link to="/membership" className='utils__link--blue utils__link mt-2 mr-1'>
                  <Icon type="arrow-left" style={{fontSize: '1.5em'}} />
                  <span style={{fontSize: '1.5em', margin: 10}}>Pencegahan</span>
                </Link>
                <Spin spinning={false}>
                  <Form>


                    <Form.Item
                      className="ant-form-item-custom mb-0"
                      {...formItemLayout}
                      label={<span style={{ fontSize: '1.15em', fontWeight: 'bold' }}>Nama Kegiatan</span>}
                    >
                      {form.getFieldDecorator('namaKegiatan', {
                        initialValue: '',
                        rules: [{ required: true, message: 'Please input City' }],
                      })(
                        <Input />,
                      )}
                    </Form.Item>
                    <Form.Item
                      className="ant-form-item-custom mb-0"
                      {...formItemLayout}
                      label={<span style={{ fontSize: '1.15em', fontWeight: 'bold' }}>Tanggal</span>}
                    >
                      {form.getFieldDecorator('date', {
                        initialValue: '',
                        rules: [{ required: false, message: 'Please input City' }],
                      })(
                        <Input type='date' size='large' />
                      )}
                    </Form.Item>
                    <Form.Item
                      className="ant-form-item-custom mb-0"
                      {...formItemLayout}
                      label={<span style={{ fontSize: '1.15em', fontWeight: 'bold' }}>Tempat Pelaksanaa</span>}
                    >
                      {form.getFieldDecorator('tempatPenyelenggaraan', {
                        initialValue: 0,
                        rules: [{ required: false, message: 'Please input City' }],
                      })(
                        <Input size='large' />
                      )}
                    </Form.Item>
                    <Form.Item
                      className="ant-form-item-custom mb-0"
                      {...formItemLayout}
                      label={<span style={{ fontSize: '1.15em', fontWeight: 'bold' }}>Jumlah Peserta</span>}
                    >
                      {form.getFieldDecorator('jmlShabu', {
                        initialValue: 0,
                        rules: [{ required: false, message: 'Please input City' }],
                      })(
                        <Input type='number' size='large' suffix='Orang' />
                      )}
                    </Form.Item>
                    <Form.Item
                      className="ant-form-item-custom mb-0"
                      {...formItemLayout}
                      label={<span style={{ fontSize: '1.15em', fontWeight: 'bold' }}>Tujuan/Manfaat</span>}
                    >
                      {form.getFieldDecorator('jmlGanja', {
                        initialValue: 0,
                        rules: [{ required: false, message: 'Please input City' }],
                      })(
                        <Input.TextArea size='large' />
                      )}
                    </Form.Item>
                    <Form.Item
                      className="ant-form-item-custom mb-0"
                      {...formItemLayout}
                      label={<span style={{ fontSize: '1.15em', fontWeight: 'bold' }}>Foto Kegiatan</span>}
                    >
                      {form.getFieldDecorator('jmlGanja', {
                        initialValue: 0,
                        rules: [{ required: false, message: 'Please input City' }],
                      })(
                        <Input.TextArea size='large' />
                      )}
                    </Form.Item>
                    <div className='mt-4'>
                      <Button
                        block
                        size='large'
                        style={{backgroundColor: `#3a99ff`, color: 'white', borderRadius: 8, fontWeight: 'bold'}}
                      >
                        Simpan
                      </Button>
                      <Button
                        block
                        size='large'
                        className='mt-4'
                        style={{color: 'black', borderRadius: 8, fontWeight: 'bold'}}
                      >
                        Batal
                      </Button>
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

export default Form.create()(Pemberdayaan)
