import React, { Component } from 'react'
import { Input } from 'antd'

class NumericInput2 extends Component {
  onChange = e => {
    const { onChange } = this.props
    const { value } = e.target
    const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/
    if ((!Number.isNaN(value) && reg.test(value)) || value === '' || value === '-') {
      onChange(value)
    }
  }

  // '.' at the end or only '-' in the input box.
  onBlur = () => {
    const { value, onBlur, onChange } = this.props
    console.log(value, 'value')
    if (value.charAt(value.length - 1) === '.' || value === '-') {
      onChange(value.slice(0, -1))
    }
    if (onBlur) {
      onBlur()
    }
  }

  render() {
    return <Input {...this.props} onChange={this.onChange} onBlur={this.onBlur} />
  }
}

export default NumericInput2
