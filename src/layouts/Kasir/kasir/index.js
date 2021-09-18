import React from 'react'
import { Form } from 'antd'
import { GlobalHotKeys } from 'react-hotkeys'
import Kasir from './Kasir'

class HotKeysDemo extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      modalBayar: false,
      isBayar: false,
    }
  }

  hsGlobal = (state, val) => {
    this.setState({
      [state]: val,
    })
  }

  showBayar = () => {
    this.setState({
      modalBayar: true,
    })
  }

  showSave = () => {
    this.setState({
      isBayar: true,
    })
  }

  render() {
    const keyMap = {
      SHOW_DIALOG: {
        name: 'Show Payment Method',
        sequence: 'f9',
        action: 'keyup',
      },
      SAVE: {
        name: 'Save Transaction',
        sequence: 'f10',
        action: 'keyup',
      },
    }

    const handlers = {
      SHOW_DIALOG: this.showBayar,
      SAVE: this.showSave,
    }
    const { modalBayar, isBayar } = this.state

    return (
      <>
        <GlobalHotKeys keyMap={keyMap} handlers={handlers}>
          <Kasir
            hsGlobal={(state, val) => this.hsGlobal(state, val)}
            modalBayar={modalBayar}
            isBayar={isBayar}
          />
        </GlobalHotKeys>
      </>
    )
  }
}

export default Form.create('form_kasir')(HotKeysDemo)
