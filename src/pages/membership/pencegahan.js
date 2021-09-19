import React, { Component } from 'react'
import { connect } from 'react-redux'
import {Icon, Spin, Form, Input, Button,DatePicker} from 'antd'
import * as moment from 'moment'
// import actions from '../../redux/user/actions'
import { Link } from 'react-router-dom'
import styles from './style.module.scss'

const mapStateToProps = ({ user, membership }) => ({
  user,
  membership,
})

@connect(mapStateToProps)
class Pencegahan extends Component {

  componentDidMount() {
    const { dispatch } = this.props
    dispatch({
      type: 'membership/GET_DATA_LIST',
      payload: {},
    })
  }

  onSubmit = e => {
    e.preventDefault()
    const { form, dispatch } = this.props
    form.validateFields((error, values) => {
      if (!error) {
        const payload = {
          "nama_kegiatan":values.nama_kegiatan,
          "date":moment(values.date).format("YYYY-MM-DD"),
          "tempat_pelaksanaan":values.tempat_pelaksanaan,
          "jumlah_peserta":values.jumlah_peserta,
          "tujuan":values.tujuan,
          "img":values.img
        }

        // console.log(payload)

        dispatch({
          type: 'pencegahan/ADD_PENCEGAHAN',
          payload
        })

        form.resetFields()
      }
    })
  }



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
                  <Form onSubmit={this.onSubmit}>
                    <Form.Item
                      className="ant-form-item-custom mb-0"
                      {...formItemLayout}
                      label={<span style={{ fontSize: '1.15em', fontWeight: 'bold' }}>Nama Kegiatan</span>}
                    >
                      {form.getFieldDecorator('nama_kegiatan', {
                        initialValue: '',
                        rules: [{ required: true, message: 'Mohon Isi Nama Kegiatan' }],
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
                        rules: [{ required: false, message: 'Mohon Isi Tanggal' }],
                      })(
                        <DatePicker size='large' />
                      )}
                    </Form.Item>
                    <Form.Item
                      className="ant-form-item-custom mb-0"
                      {...formItemLayout}
                      label={<span style={{ fontSize: '1.15em', fontWeight: 'bold' }}>Tempat Pelaksanaan</span>}
                    >
                      {form.getFieldDecorator('tempat_pelaksanaan', {
                        initialValue: '',
                        rules: [{ required: false, message: 'Mohon Isi Tempat Pelaksanaan' }],
                      })(
                        <Input size='large' />
                      )}
                    </Form.Item>
                    <Form.Item
                      className="ant-form-item-custom mb-0"
                      {...formItemLayout}
                      label={<span style={{ fontSize: '1.15em', fontWeight: 'bold' }}>Jumlah Peserta</span>}
                    >
                      {form.getFieldDecorator('jumlah_peserta', {
                        initialValue: 0,
                        rules: [{ required: false, message: 'Mohon Isi  Jumlah Peserta' }],
                      })(
                        <Input type='number' size='large' suffix='Orang' />
                      )}
                    </Form.Item>
                    <Form.Item
                      className="ant-form-item-custom mb-0"
                      {...formItemLayout}
                      label={<span style={{ fontSize: '1.15em', fontWeight: 'bold' }}>Tujuan/Manfaat</span>}
                    >
                      {form.getFieldDecorator('tujuan', {
                        initialValue: 0,
                        rules: [{ required: false, message: 'Mohon Isi Tujuan/Manfaat' }],
                      })(
                        <Input.TextArea size='large' />
                      )}
                    </Form.Item>
                    <Form.Item
                      className="ant-form-item-custom mb-0"
                      {...formItemLayout}
                      label={<span style={{ fontSize: '1.15em', fontWeight: 'bold' }}>Foto Kegiatan</span>}
                    >
                      {form.getFieldDecorator('img', {
                        initialValue: "",
                        rules: [{ required: false, message: 'Mohon Isi Foto Kegiatan' }],
                      })(
                        <Input type='file' size='large' />
                      )}
                    </Form.Item>

                    <div className='mt-4'>
                      <Button
                        htmlType="submit"
                        block
                        size='large'
                        style={{backgroundColor: `#3a99ff`, color: 'white', borderRadius: 8, fontWeight: 'bold'}}
                      >
                        Simpan
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

export default Form.create()(Pencegahan)
