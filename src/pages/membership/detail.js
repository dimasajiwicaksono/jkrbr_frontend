import React, { Component } from 'react'
import { connect } from 'react-redux'
import {Icon, Spin, Form, Input, Button} from 'antd'
// import actions from '../../redux/user/actions'
import { Link } from 'react-router-dom'
import styles from './style.module.scss'
import SelectScap from '../../components/CleanUIComponents/Scap/SelectScap'
// import actions from '../../redux/user/actions'

const mapStateToProps = ({ user, membership }) => ({
  user,
  provinceOption: membership.province,
  cityOption: membership.city,
  districtOption: membership.district,
  token: user.tokenRajaAPI || '',
  membership,
})

@connect(mapStateToProps)
class MembershipDetail extends Component {

  constructor(props) {
    super(props)
    this.state = {
      province: {id: "", name:""},
      city: {id: "", name:""},
      district: {id: "", name:""},
      year: '2021'
    }
    this.initState = this.state
  }

  componentDidMount() {
    const { dispatch, token} = this.props

    dispatch({
      type: 'membership/GET_DATA_PROVINCE_LIST',
      token: token === "" ? localStorage.getItem('tokenRajaAPI') : token
    })
  }

  onSubmit = e => {
    e.preventDefault()
    const { form, dispatch } = this.props
    const { district, city, province} = this.state
    form.validateFields((error, values) => {
      if (!error) {

        const payload = {
          "provinsi_id":province.id,
          "provinsi_name":province.name,
          "kota_id":city.id,
          "kota_name":city.name,
          "kecamatan_id":district.id,
          "kecamatan_name":district.name,
          "tahun":values.year,
          "qty_bandar":values.bandarNarkoba,
          "qty_tersangka":values.jmlTersangka,
          "qty_sabu":values.jmlShabu,
          "qty_ganja":values.jmlGanja,
          "qty_ekstasi":values.jmlEkstasi,
          "qty_gorilla":values.jmlGorilla,
          "qty_lainnya":values.jmlLainnya
        }

        // console.log(payload)

        dispatch({
          type: 'membership/ADD_KASUS_NARKOBA',
          payload
        })

        form.resetFields()
        this.setState(this.initState)
      }
    })
  }

  handleChangeProvince = id => {
    const { dispatch,provinceOption, token } = this.props
    const province = provinceOption.find(el => el.id === id)
    this.setState({
      province
    })

    dispatch({
      type: 'membership/GET_DATA_CITY_LIST',
      payload: {
        id:province.id,
        token: token === "" ? localStorage.getItem('tokenRajaAPI') : token
      },
    })
  }

  handleChangeCity = id => {
    const { dispatch,cityOption, token } = this.props
    const city = cityOption.find(el => el.id === id)
    this.setState({
      city
    })

    dispatch({
      type: 'membership/GET_DATA_KECAMATAN_LIST',
      payload: {
        id:city.id,
        token: token === "" ? localStorage.getItem('tokenRajaAPI') : token
      },
    })
  }

  handleChangeKecamatan = id => {
    const {districtOption } = this.props
    const district = districtOption.find(el => el.id === id)
    this.setState({
      district
    })
  }

  render() {
    const {  province, city, district, year } = this.state
    const { form, provinceOption, cityOption, districtOption, membership } = this.props

    const optProvince = (provinceOption || []).map(el => ({
      value: el.id,
      title: el.name,
    }))

    const optCity = (cityOption || []).map(el => ({
      value: el.id,
      title: el.name,
    }))

    const optDistrict = (districtOption || []).map(el => ({
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
                  <Form onSubmit={this.onSubmit}>
                    <Form.Item
                      className="ant-form-item-custom mb-0"
                      {...formItemLayout}
                      label={<span style={{ fontSize: '1.15em', fontWeight: 'bold' }}>Provinsi</span>}
                    >
                      {form.getFieldDecorator('province', {
                        initialValue: province.id,
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
                        initialValue: city.id,
                        rules: [{ required: true, message: 'Please input City' }],
                      })(
                        <SelectScap
                          loading={membership.loadingCity}
                          datas={optCity}
                          onChange={e => this.handleChangeCity(e)}
                        />,
                      )}
                    </Form.Item>
                    <Form.Item
                      className="ant-form-item-custom mb-0"
                      {...formItemLayout}
                      label={<span style={{ fontSize: '1.15em', fontWeight: 'bold' }}>Kecamatan</span>}
                    >
                      {form.getFieldDecorator('district', {
                        initialValue: district.id,
                        rules: [{ required: true, message: 'Please input Kecamatan' }],
                      })(
                        <SelectScap
                          loading={membership.loadingKecamatan}
                          datas={optDistrict}
                          onChange={e => this.handleChangeKecamatan(e)}
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

export default Form.create()(MembershipDetail)
