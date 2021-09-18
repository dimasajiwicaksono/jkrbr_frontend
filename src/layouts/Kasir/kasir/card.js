import React, { Component } from 'react'
import { Card, Col, Row } from 'antd'
import { currencyFormat } from '../../../utils/helper'

const renderCurr = (val = 0) => currencyFormat(val)
class CardBayar extends Component {
  render() {
    const { sumTotalBayar, sumTotal, sumDiskon /* sumTax */ } = this.props
    const data = [
      {
        title: 'Total Tagihan',
        value: sumTotal,
        color: 'blue',
      },
      {
        title: 'Total Diskon',
        value: sumDiskon,
        color: 'green',
      },
      // {
      //   title: 'Total Tax',
      //   value: sumTax,
      //   color: 'orange',
      // },
      {
        title: 'Total Bayar',
        value: sumTotalBayar,
        color: 'red',
      },
    ]
    return <CardMap data={data} />
  }
}

const CardMap = ({ data }) => (
  <div style={{ background: '#ECECEC', padding: '15px' }} key="mapCard">
    <Row gutter={16}>
      {data.map((el, idx) => (
        <Col span={8} key={`col-${idx + 1}`}>
          <Card
            title={el.title}
            bordered={false}
            style={{ borderTop: `solid 4px ${el.color}` }}
            key={`card${idx + 1}`}
          >
            <span className="text-dark font-weight" key={`span-${idx + 1}`}>
              Rp {renderCurr(el.value)}
            </span>
          </Card>
        </Col>
      ))}
    </Row>
  </div>
)

export default CardBayar
