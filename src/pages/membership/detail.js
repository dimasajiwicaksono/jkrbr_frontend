import React, { Component } from 'react'
import { connect } from 'react-redux'
import {Icon, Spin, Form, Input, Button} from 'antd'
// import actions from '../../redux/user/actions'
import { Link } from 'react-router-dom'
import styles from './style.module.scss'
import SelectScap from '../../components/CleanUIComponents/Scap/SelectScap'

const mapStateToProps = ({ user, membership }) => ({
  user,
  provinceOption: membership.province,
  cityOption: membership.city,
  membership,
})

@connect(mapStateToProps)
class MembershipDetail extends Component {

  constructor(props) {
    super(props)
    this.state = {
      province: '',
      city: '',
      year: '2021'
    }
  }

  componentDidMount() {
    const { dispatch} = this.props
    dispatch({
      type: 'membership/GET_DATA_PROVINCE_LIST',
      payload: {},
    })
  }

  handleChangeProvince = id => {
    const { dispatch } = this.props
    dispatch({
      type: 'membership/GET_DATA_CITY_LIST',
      payload: {
        id,
      },
    })
  }

  render() {
    const {  province, city, year } = this.state
    const { form, provinceOption, cityOption, membership } = this.props

    const optProvince = provinceOption.map(el => ({
      value: el.id,
      title: el.name,
    }))

    const optCity = cityOption.map(el => ({
      value: el.id,
      title: el.name,
    }))

    const optTahun = [

      {value: '2018', title: '2018'},
      {value: '2019', title: '2019'},
      {value: '2020', title: '2020'},
      {value: '2021', title: '2021'},
      {value: '2022', title: '2022'},
      {value: '2023', title: '2023'},
      {value: '2024', title: '2024'},
      {value: '2025', title: '2025'},
      {value: '2026', title: '2026'},

    ]

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
                  <span style={{fontSize: '1.5em', margin: 10}}>Kasus Narkoba</span>
                </Link>
                <Spin spinning={false}>
                  <Form>
                    <Form.Item
                      className="ant-form-item-custom mb-0"
                      {...formItemLayout}
                      label={<span style={{ fontSize: '1.15em', fontWeight: 'bold' }}>Provinsi</span>}
                    >
                      {form.getFieldDecorator('province', {
                        initialValue: province,
                        rules: [{ required: true, message: 'Please input City' }],
                      })(
                        <SelectScap
                          loading={membership.loadingProvince}
                          datas={optProvince}
                          onChange={e => this.handleChangeProvince(e)}
                        />,
                      )}
                    </Form.Item>
                    <Form.Item
                      className="ant-form-item-custom mb-0"
                      {...formItemLayout}
                      label={<span style={{ fontSize: '1.15em', fontWeight: 'bold' }}>Kota/Kab</span>}
                    >
                      {form.getFieldDecorator('city', {
                        initialValue: city,
                        rules: [{ required: true, message: 'Please input City' }],
                      })(
                        <SelectScap
                          loading={membership.loadingCity}
                          datas={optCity}
                          onChange={e => this.setState({ city: e })}
                        />,
                      )}
                    </Form.Item>
                    <Form.Item
                      className="ant-form-item-custom mb-0"
                      {...formItemLayout}
                      label={<span style={{ fontSize: '1.15em', fontWeight: 'bold' }}>Kecamatan</span>}
                    >
                      {form.getFieldDecorator('city', {
                        initialValue: city,
                        rules: [{ required: true, message: 'Please input City' }],
                      })(
                        <SelectScap
                          loading={membership.loadingCity}
                          datas={optCity}
                          onChange={e => this.setState({ city: e })}
                        />,
                      )}
                    </Form.Item>

                    <Form.Item
                      className="ant-form-item-custom mb-0"
                      {...formItemLayout}
                      label={<span style={{ fontSize: '1.15em', fontWeight: 'bold' }}>Tahun</span>}
                    >
                      {form.getFieldDecorator('year', {
                        initialValue: year,
                        rules: [{ required: true, message: 'Please input City' }],
                      })(
                        <SelectScap
                          datas={optTahun}
                        />,
                      )}
                    </Form.Item>
                    <Form.Item
                      className="ant-form-item-custom mb-0"
                      {...formItemLayout}
                      label={<span style={{ fontSize: '1.15em', fontWeight: 'bold' }}>Bandar Narkoba</span>}
                    >
                      {form.getFieldDecorator('bandarNarkoba', {
                        initialValue: 0,
                        rules: [{ required: false, message: 'Please input City' }],
                      })(
                        <Input type='number' size='large' suffix='Orang' />
                      )}
                    </Form.Item>
                    <Form.Item
                      className="ant-form-item-custom mb-0"
                      {...formItemLayout}
                      label={<span style={{ fontSize: '1.15em', fontWeight: 'bold' }}>Jumlah Tersangka</span>}
                    >
                      {form.getFieldDecorator('jmlTersangka', {
                        initialValue: 0,
                        rules: [{ required: false, message: 'Please input City' }],
                      })(
                        <Input type='number' size='large' suffix='Orang' />
                      )}
                    </Form.Item>
                    <Form.Item
                      className="ant-form-item-custom mb-0"
                      {...formItemLayout}
                      label={<span style={{ fontSize: '1.15em', fontWeight: 'bold' }}>Barang Bukti Shabu</span>}
                    >
                      {form.getFieldDecorator('jmlShabu', {
                        initialValue: 0,
                        rules: [{ required: false, message: 'Please input City' }],
                      })(
                        <Input type='number' size='large' suffix='Gram' />
                      )}
                    </Form.Item>
                    <Form.Item
                      className="ant-form-item-custom mb-0"
                      {...formItemLayout}
                      label={<span style={{ fontSize: '1.15em', fontWeight: 'bold' }}>Ganja</span>}
                    >
                      {form.getFieldDecorator('jmlGanja', {
                        initialValue: 0,
                        rules: [{ required: false, message: 'Please input City' }],
                      })(
                        <Input type='number' size='large' suffix='Gram' />
                      )}
                    </Form.Item>
                    <Form.Item
                      className="ant-form-item-custom mb-0"
                      {...formItemLayout}
                      label={<span style={{ fontSize: '1.15em', fontWeight: 'bold' }}>Ekstasi</span>}
                    >
                      {form.getFieldDecorator('jmlEkstasi', {
                        initialValue: 0,
                        rules: [{ required: false, message: 'Please input City' }],
                      })(
                        <Input type='number' size='large' suffix='Butir' />
                      )}
                    </Form.Item>
                    <Form.Item
                      className="ant-form-item-custom mb-0"
                      {...formItemLayout}
                      label={<span style={{ fontSize: '1.15em', fontWeight: 'bold' }}>Gorilla</span>}
                    >
                      {form.getFieldDecorator('jmlGorilla', {
                        initialValue: 0,
                        rules: [{ required: false, message: 'Please input City' }],
                      })(
                        <Input type='number' size='large' suffix='Gram' />
                      )}
                    </Form.Item>
                    <Form.Item
                      className="ant-form-item-custom mb-0"
                      {...formItemLayout}
                      label={<span style={{ fontSize: '1.15em', fontWeight: 'bold' }}>Lainnya</span>}
                    >
                      {form.getFieldDecorator('jmlLainnya', {
                        initialValue:0,
                        rules: [{ required: false, message: 'Please input City' }],
                      })(
                        <Input type='number' size='large' suffix='Gram/Butir' />
                      )}
                    </Form.Item>
                  </Form>
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
                </Spin>
              </div>

            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Form.create()(MembershipDetail)
