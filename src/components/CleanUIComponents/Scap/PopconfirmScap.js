import React from 'react'
import { Button, Input, Popconfirm } from 'antd'
import vars from '../../../utils/variable'

class PopconfirmScap extends React.Component {
  handleChange = e => {
    const { onChange } = this.props
    onChange(e)
  }

  handleConfirm = e => {
    const { onConfirm } = this.props
    onConfirm(e)
  }

  renderReason() {
    return (
      <div>
        {vars.TXT_REASONS}
        <div>
          <Input style={{ width: 'auto' }} onChange={this.handleChange} reqired />
        </div>
      </div>
    )
  }

  render() {
    return (
      <Popconfirm okText="Delete" title={this.renderReason()} onConfirm={this.handleConfirm}>
        <Button className="mr-4" type="danger" icon="delete">
          Delete
        </Button>
      </Popconfirm>
    )
  }
}

export default PopconfirmScap
