import React, { Component, Fragment } from 'react'
import { Select, Button, Icon } from 'antd'
import SelectScap from './SelectScap'

class SelectOutlet extends Component {
  handleChange = e => {
    const { onChange } = this.props
    onChange(e)
  }

  render() {
    const { datas, mstOutlet, brandCode } = this.props
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
      <Fragment>
        {mstOutlet.loadingOption && (
          <div>
            <Icon type="loading" /> Please wait
          </div>
        )}
        {brandCode === '' && mstOutlet.loadingOption === false && (
          <SelectScap datas={optData} disabled />
        )}
        {brandCode !== '' && mstOutlet.loadingOption === false && datas.length < 1 && (
          <div>
            No data.
            <Button className="ml-4" type="default" icon="reload" onClick={this.handleReloadOutlet}>
              Reload
            </Button>
          </div>
        )}
        {brandCode !== '' && mstOutlet.loadingOption === false && datas.length >= 1 && (
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
        )}
      </Fragment>
    )
  }
}

export default SelectOutlet
