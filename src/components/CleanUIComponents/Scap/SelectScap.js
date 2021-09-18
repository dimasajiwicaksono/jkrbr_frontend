import React, { Component } from 'react'
import { Select } from 'antd'

class SelectScap extends Component {
  handleChange = e => {
    const { onChange } = this.props
    onChange(e)
  }

  render() {
    const { datas } = this.props
    const { Option } = Select
    const optData = []

    if (datas !== undefined) {
      datas.map(val =>
        optData.push({
          title: val.title,
          value: val.value,
        }),
      )
    }

    return (
      <Select
        {...this.props}
        showSearch
        allowClear
        onChange={this.handleChange}
        filterOption={(input, opt) =>
          opt.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        {optData.map(val => (
          <Option key={val.value} value={val.value}>
            {val.title}
          </Option>
        ))}
      </Select>
    )
  }
}

export default SelectScap
