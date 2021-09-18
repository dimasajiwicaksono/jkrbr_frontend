import React, { Component } from 'react'
import { connect } from 'react-redux'
import {Icon, Spin, Form, Input, Button} from 'antd'
// import actions from '../../redux/user/actions'
import { Link } from 'react-router-dom'
import styles from '../membership/style.module.scss'

const mapStateToProps = ({ user, membership }) => ({
  user,
  membership,
})

@connect(mapStateToProps)
class PermohonanSosialisasi extends Component {

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
                <Link to="/membership/layanan_masyarakat/p2m" className='utils__link--blue utils__link mt-2 mr-1'>
                  <Icon type="arrow-left" style={{fontSize: '1.5em'}} />
                  <span style={{fontSize: '1.5em', margin: 10}}>Permohonan Sosialisasi</span>
                </Link>
                <Spin spinning={false}>
                  <Form>


                    <Form.Item
                      className="ant-form-item-custom mb-0"
                      {...formItemLayout}
                      label={<span style={{ fontSize: '1.15em', fontWeight: 'bold' }}>Pemohon Instansi</span>}
                    >
                      {form.getFieldDecorator('pemohonInstansi', {
                        initialValue: "",
                        rules: [{ required: true, message: 'Mohon Input Pemohon Instansi' }],
                      })(
                        <Input />,
                      )}
                    </Form.Item>
                    <Form.Item
                      className="ant-form-item-custom mb-0"
                      {...formItemLayout}
                      label={<span style={{ fontSize: '1.15em', fontWeight: 'bold' }}>Peserta Test Urine</span>}
                    >
                      {form.getFieldDecorator('pesertaTest', {
                        initialValue: "",
                        rules: [{ required: true, message: 'Mohon Input Peserta Test' }],
                      })(
                        <Input size='large' />
                      )}
                    </Form.Item>
                    <Form.Item
                      className="ant-form-item-custom mb-0"
                      {...formItemLayout}
                      label={<span style={{ fontSize: '1.15em', fontWeight: 'bold' }}>Nama PIC</span>}
                    >
                      {form.getFieldDecorator('namaPIC', {
                        initialValue: "",
                        rules: [{ required: false, message: 'Mohon Input Nama PIC' }],
                      })(
                        <Input size='large' />
                      )}
                    </Form.Item>
                    <Form.Item
                      className="ant-form-item-custom mb-0"
                      {...formItemLayout}
                      label={<span style={{ fontSize: '1.15em', fontWeight: 'bold' }}>Telp. PIC</span>}
                    >
                      {form.getFieldDecorator('telpPIC', {
                        initialValue: "",
                        rules: [{ required: false, message: 'Mohon Input Telp PIC' }],
                      })(
                        <Input size='large' type='telp' />
                      )}
                    </Form.Item>
                    <Form.Item
                      className="ant-form-item-custom mb-0"
                      {...formItemLayout}
                      label={<span style={{ fontSize: '1.15em', fontWeight: 'bold' }}>Tempat Pelaksanaan</span>}
                    >
                      {form.getFieldDecorator('tempatPelaksanaan', {
                        initialValue: "",
                        rules: [{ required: false, message: 'Mohon Input Tempat Pelaksanaan' }],
                      })(
                        <Input size='large' />
                      )}
                    </Form.Item>
                    <Form.Item
                      className="ant-form-item-custom mb-0"
                      {...formItemLayout}
                      label={<span style={{ fontSize: '1.15em', fontWeight: 'bold' }}>Tanggal Pelaksanaan</span>}
                    >
                      {form.getFieldDecorator('tanggalPelaksanaan', {
                        initialValue: "",
                        rules: [{ required: false, message: 'Mohon Input Tgl. Pelaksanaan' }],
                      })(
                        <Input type='date' size='large' />
                      )}
                    </Form.Item>
                    <Form.Item
                      className="ant-form-item-custom mb-0"
                      {...formItemLayout}
                      label={<span style={{ fontSize: '1.15em', fontWeight: 'bold' }}>Alamat</span>}
                    >
                      {form.getFieldDecorator('alamat', {
                        initialValue: "",
                        rules: [{ required: false, message: 'Mohon Input Alamat' }],
                      })(
                        <Input.TextArea size='large' />
                      )}
                    </Form.Item>
                    <Form.Item
                      className="ant-form-item-custom mb-0"
                      {...formItemLayout}
                      label={<span style={{ fontSize: '1.15em', fontWeight: 'bold' }}>Upload Surat Permohonan</span>}
                    >
                      {form.getFieldDecorator('file', {
                        initialValue: "",
                        rules: [{ required: false, message: 'Mohon Input City' }],
                      })(
                        <Input type='file' size='large' />
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

export default Form.create()(PermohonanSosialisasi)
