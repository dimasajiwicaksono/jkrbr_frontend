import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Form, Input, Button, Icon, Checkbox, Spin } from 'antd'
import SelectScap from '../../../components/CleanUIComponents/Scap/SelectScap'

const mapStateToProps = ({ posMenuCategory, mstChartAccount, posMenuOutlet, posMenuGroup }) => ({
  posMenuCategory,
  mstChartAccount,
  posMenuOutlet,
  posMenuGroup,
  dataPosOutlet: posMenuCategory.posOutletOption,
  dataPosGroup: posMenuCategory.posGroupOption,
  dataChartAccount: posMenuCategory.chartAccountOption,
})

@withRouter
@connect(mapStateToProps)
class AddContent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      generateCode: true,
      categoryCode: '',
      categoryName: '',
      outletCode: '',
      groupCode: '',
      glSalesRevenue: '',
      glSalesDiscount: '',
      rules: {
        categoryCode: {
          required: true,
          message: 'Please input Category Code.',
        },
        categoryName: {
          required: true,
          message: 'Please input Category Name.',
        },
        outlet: {
          required: true,
          message: 'Please select Outlet.',
        },
        group: {
          required: true,
          message: 'Please select Group.',
        },
      },
    }
  }

  handleSubmit = e => {
    const { action, dispatch, form } = this.props
    const {
      generateCode,
      categoryCode,
      categoryName,
      glSalesRevenue,
      glSalesDiscount,
      groupCode,
      outletCode,
    } = this.state
    e.preventDefault()
    form.validateFields(err => {
      if (err === null) {
        const promise = new Promise(resolve => {
          dispatch(
            {
              type: 'posMenuCategory/GET_DATA_MENU_CATEGORY_SAVE',
              payload: {
                cateCode: categoryCode,
                cateName: categoryName,
                salesAcctNo: glSalesRevenue,
                discAcctNo: glSalesDiscount,
                groupCode,
                outletCode,
                generateCode: generateCode === true ? 1 : 0,
              },
            },
            setTimeout(() => {
              resolve(
                action('posMenuCategoryDetail', []),
                action('posMenuCategorySelectedRow', ''),
                dispatch({
                  type: 'posMenuCategory/GET_DATA_MENU_CATEGORY_LIST',
                  payload: {
                    groupCode: '',
                    cateCode: '',
                    cateName: '',
                    outletCode: '',
                  },
                }),
              )
            }, 300),
          )
        })
        promise.then(() => true)
      }
    })
  }

  handleReloadPosOutlet = () => {
    const { dispatch, moduleSet } = this.props
    dispatch({
      type: 'posMenuOutlet/GET_DATA_MENU_OUTLET_OPTION',
      payload: {
        moduleSet,
      },
    })
  }

  handleReloadPosGroup = () => {
    const { dispatch, moduleSet } = this.props
    const { outletCode } = this.state
    dispatch({
      type: 'posMenuGroup/GET_DATA_MENU_GROUP_OPTION',
      payload: {
        outletCode,
        moduleSet,
      },
    })
  }

  handleReloadChartAccount = () => {
    const { dispatch, moduleSet } = this.props
    dispatch({
      type: 'mstChartAccount/GET_DATA_CHART_ACCOUNT_OPTION',
      payload: {
        isHeader: '2',
        moduleSet,
      },
    })
  }

  handleOutletChange(value) {
    const { dispatch, moduleSet } = this.props
    const { outletCode } = this.state

    if (value !== outletCode) {
      const promise = new Promise(resolve => {
        this.setState({
          outletCode: '',
          groupCode: '',
        })
        dispatch(
          {
            type: 'posMenuGroup/GET_DATA_MENU_GROUP_OPTION',
            payload: {
              outletCode: !value ? '' : value,
              moduleSet,
            },
          },
          setTimeout(() => {
            resolve(
              this.setState({
                outletCode: !value ? '' : value,
              }),
            )
          }, 300),
        )
      })
      promise.then(() => true)
    }
  }

  handleContent(payload) {
    const { posMenuCategory, dispatch } = this.props
    if (posMenuCategory.contentStatus !== payload) {
      dispatch({
        type: 'posMenuCategory/HANDLE_CONTENT',
        payload,
      })
    }
  }

  render() {
    const {
      form,
      mstChartAccount,
      posMenuGroup,
      posMenuOutlet,
      dataChartAccount,
      dataPosGroup,
      dataPosOutlet,
      posMenuCategory,
    } = this.props
    const { rules, generateCode, outletCode, groupCode } = this.state
    const { getFieldDecorator } = form
    const optChartAccount = []
    const optPosOutlet = []
    const optPosGroup = []
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
    }

    if (dataChartAccount.length > 0) {
      dataChartAccount.map(val =>
        optChartAccount.push({
          value: val.glAcctNo,
          title: `${val.glAcctNo} | ${val.glAcctName}`,
        }),
      )
    }

    if (dataPosGroup.length > 0) {
      dataPosGroup.map(val =>
        optPosGroup.push({
          value: val.groupCode,
          title: val.groupName,
        }),
      )
    }

    if (dataPosOutlet.length > 0) {
      dataPosOutlet.map(val =>
        optPosOutlet.push({
          value: val.outletCode,
          title: val.outletName,
        }),
      )
    }

    return (
      <div>
        <Spin spinning={posMenuCategory.loadingProcess}>
          <Form onSubmit={this.handleSubmit}>
            <div className="row">
              <div className="col-md-6">
                <Form.Item
                  className="ant-form-item-custom"
                  {...formItemLayout}
                  label="Category Code"
                >
                  {generateCode && <Input disabled />}
                  {!generateCode &&
                    getFieldDecorator('groupCode', {
                      rules: [rules.categoryCode],
                    })(<Input onChange={e => this.setState({ categoryCode: e.target.value })} />)}
                  <div>
                    <Checkbox
                      checked={generateCode}
                      onChange={e => this.setState({ generateCode: e.target.checked })}
                    >
                      Auto Number
                    </Checkbox>
                  </div>
                </Form.Item>
                <Form.Item
                  className="ant-form-item-custom"
                  {...formItemLayout}
                  label="Category Name"
                >
                  {getFieldDecorator('categoryName', {
                    rules: [rules.categoryName],
                  })(<Input onChange={e => this.setState({ categoryName: e.target.value })} />)}
                </Form.Item>
              </div>
              <div className="col-md-6">
                <Form.Item className="ant-form-item-custom" {...formItemLayout} label="Outlet">
                  {posMenuOutlet.loadingOption && (
                    <div>
                      <Icon type="loading" /> Please wait
                    </div>
                  )}
                  {!posMenuOutlet.loadingOption && optPosOutlet.length < 1 && (
                    <div>
                      No data.
                      <Button
                        type="default"
                        icon="reload"
                        className="ml-4"
                        onClick={this.handleReloadPosOutlet}
                      >
                        Reload
                      </Button>
                    </div>
                  )}
                  {!posMenuOutlet.loadingOption &&
                    optPosOutlet.length > 0 &&
                    getFieldDecorator('outlet', {
                      rules: [rules.outlet],
                      initialValue: outletCode,
                    })(
                      <SelectScap
                        datas={optPosOutlet}
                        onChange={value => this.handleOutletChange(value)}
                      />,
                    )}
                </Form.Item>
                <Form.Item className="ant-form-item-custom" {...formItemLayout} label="Group">
                  {outletCode === '' && <SelectScap datas={optPosGroup} disabled />}
                  {outletCode !== '' && posMenuGroup.loadingOption && (
                    <div>
                      <Icon type="loading" /> Please wait
                    </div>
                  )}
                  {outletCode !== '' && !posMenuGroup.loadingOption && optPosGroup.length < 1 && (
                    <div>
                      No data.
                      <Button
                        type="default"
                        icon="reload"
                        className="ml-4"
                        onClick={this.handleReloadPosGroup}
                      >
                        Reload
                      </Button>
                    </div>
                  )}
                  {outletCode !== '' &&
                    !posMenuGroup.loadingOption &&
                    optPosGroup.length > 0 &&
                    getFieldDecorator('groupCode', {
                      rules: [rules.group],
                      initialValue: groupCode,
                    })(
                      <SelectScap
                        datas={optPosGroup}
                        onChange={value => this.setState({ groupCode: !value ? '' : value })}
                      />,
                    )}
                </Form.Item>
                <Form.Item
                  className="ant-form-item-custom"
                  {...formItemLayout}
                  label="G/L Sales Revenue"
                >
                  {mstChartAccount.loadingOption && (
                    <div>
                      <Icon type="loading" /> Please wait
                    </div>
                  )}
                  {!mstChartAccount.loadingOption && optChartAccount.length < 1 && (
                    <div>
                      No data.
                      <Button
                        type="default"
                        icon="reload"
                        className="ml-4"
                        onClick={this.handleReloadChartAccount}
                      >
                        Reload
                      </Button>
                    </div>
                  )}
                  {!mstChartAccount.loadingOption &&
                    optChartAccount.length > 0 &&
                    getFieldDecorator('glSalesRevenue')(
                      <SelectScap
                        datas={optChartAccount}
                        onChange={value => this.setState({ glSalesRevenue: !value ? '' : value })}
                      />,
                    )}
                </Form.Item>
                <Form.Item
                  className="ant-form-item-custom"
                  {...formItemLayout}
                  label="G/L Sales Discount"
                >
                  {mstChartAccount.loadingOption && (
                    <div>
                      <Icon type="loading" /> Please wait
                    </div>
                  )}
                  {!mstChartAccount.loadingOption && optChartAccount.length < 1 && (
                    <div>
                      No data.
                      <Button
                        type="default"
                        className="ml-4"
                        icon="reload"
                        onClick={this.handleReloadChartAccount}
                      >
                        Reload
                      </Button>
                    </div>
                  )}
                  {!mstChartAccount.loadingOption &&
                    optChartAccount.length > 0 &&
                    getFieldDecorator('glSalesDiscount')(
                      <SelectScap
                        datas={optChartAccount}
                        onChange={value => this.setState({ glSalesDiscount: !value ? '' : value })}
                      />,
                    )}
                </Form.Item>
              </div>
            </div>
            <div className="text-right mt-4">
              <Button className="ml-4" type="primary" icon="save" htmlType="submit">
                Save
              </Button>
              <Button
                className="ml-4"
                type="default"
                icon="close"
                onClick={() => this.handleContent('isView')}
              >
                Cancel
              </Button>
            </div>
          </Form>
        </Spin>
      </div>
    )
  }
}

export default Form.create({ name: 'form_add' })(AddContent)
