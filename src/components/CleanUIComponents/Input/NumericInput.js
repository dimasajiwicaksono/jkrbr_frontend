import React from 'react'
import { Input } from 'antd';

class NumericInput extends React.Component {
  handleOnChange(e) {
    const { onChange } = this.props
    const { value } = e.target;
    const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
    if ((!Number.isNaN(value) && reg.test(value)) || value === '' || value === '-') {
      onChange(value);
    }
  };

  render() {
    return (
      <Input
        {...this.props}
        onChange={(e) => this.handleOnChange(e)}
      />
    );
  }
}

export default NumericInput
