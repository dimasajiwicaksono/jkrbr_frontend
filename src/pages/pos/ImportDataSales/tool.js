import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Form, Input, Button, notification } from 'antd'
import axios from 'axios'
import { notifConfig } from '../../../utils/helper'
import vars from '../../../utils/variable'

const mapStateToProps = ({ slsDeliveryOrder }) => ({
  slsDeliveryOrder,
})

@withRouter
@connect(mapStateToProps)
class ToolContent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isVerified: false,
      dataForm: [],
    }
  }

  handleClear = () => {
    this.setState({
      isVerified: false,
      dataForm: [],
    })
  }

  handleSubmit = () => {
    const { isVerified, dataForm } = this.state
    if (isVerified) {
      const url = `http://35.166.224.143:8181/core-production/api/sales_pos/upload`
      const config = {
        headers: {
          'content-type': 'multipart/form-data',
        },
      }
      try {
        const result = axios.post(url, dataForm, config)

        if (result.acknowledge === 1) {
          notification.success({
            message: 'Success',
            description: result.message,
            ...notifConfig,
          })
        } else {
          notification.error({
            message: 'Failed',
            description: 'Encounter error caused by duplicate data',
            ...notifConfig,
          })
        }
      } catch (e) {
        notification.error({
          message: 'Failed',
          description: 'Please check files.',
          ...notifConfig,
        })
      }
    } else {
      notification.error({
        message: 'Failed',
        description: 'Please check files.',
        ...notifConfig,
      })
    }
  }

  errorComp(erroList) {
    return (
      <div>
        <span>Unfounded file:</span>
        <ul>
          {erroList.map(e => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      </div>
    )
  }

  setFile(files) {
    const formData = new FormData()
    const fileNeeded = [
      'SLPOSA.CSV',
      'SLPOSB.CSV',
      'SLPOSC.CSV',
      'SLPOSD.CSV',
      'SLPOSE.CSV',
      'SLPOSF.CSV',
      'SLPOSG.CSV',
    ]
    const allFileName = Object.keys(files).map(e => {
      switch (files[e].name) {
        case 'SLPOSA.CSV':
          formData.append('A', files[e])
          break
        case 'SLPOSB.CSV':
          formData.append('B', files[e])
          break
        case 'SLPOSC.CSV':
          formData.append('C', files[e])
          break
        case 'SLPOSD.CSV':
          formData.append('D', files[e])
          break
        case 'SLPOSE.CSV':
          formData.append('E', files[e])
          break
        case 'SLPOSF.CSV':
          formData.append('F', files[e])
          break
        case 'SLPOSG.CSV':
          formData.append('G', files[e])
          break
        default:
          break
      }
      return files[e].name
    })

    const fileNotFound = fileNeeded.filter(e => allFileName.indexOf(e) < 0)
    if (fileNotFound.length > 0) {
      notification.error({
        message: vars.ERROR,
        description: this.errorComp(fileNotFound),
        ...notifConfig,
      })
    } else {
      this.setState({ dataForm: formData, isVerified: true })
    }
  }

  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 15 },
      },
    }
    const { isVerified } = this.state
    return (
      <div>
        <Form>
          <div className="row">
            <div className="col-md-6">
              <Form.Item
                className="ant-form-item-custom"
                {...formItemLayout}
                label="Upload File"
                required
              >
                <Input type="file" multiple onChange={e => this.setFile(e.target.files)} />
              </Form.Item>
              <div className="text-right mt-4">
                <Button
                  disabled={!isVerified}
                  className="ml-4"
                  type="primary"
                  icon="save"
                  htmlType="submit"
                  onClick={this.handleSubmit}
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        </Form>
      </div>
    )
  }
}

export default ToolContent
