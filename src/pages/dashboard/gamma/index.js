/* eslint-disable */
import React from 'react'
import ChartistGraph from 'react-chartist'
import Chartist from 'chartist'
import ChartistTooltip from 'chartist-plugin-tooltips-updated'
import { Table } from 'antd'
import ProgressCard from 'components/CleanUIComponents/ProgressCard'
import ShortItemInfo from 'components/CleanUIComponents/ShortItemInfo'
import Donut from 'components/CleanUIComponents/Donut'

import {
  progressCardsData,
  newUsersData,
  inboundBandwidthData,
  outboundBandwidthData,
  topPhotosData,
  topPhotosGraphData,
  financeStatsData,
  supportCasesTableData,
  supportCasesPieData,
} from './data.json'

import styles from './style.module.scss'

const boundChartistOptions = {
  lineSmooth: Chartist.Interpolation.none({
    fillHoles: false,
  }),
  showPoint: true,
  showLine: true,
  showArea: true,
  fullWidth: true,
  showLabel: false,
  axisX: {
    showGrid: false,
    showLabel: false,
    offset: 0,
  },
  axisY: {
    showGrid: false,
    showLabel: false,
    offset: 0,
  },
  chartPadding: 0,
  low: 0,
  plugins: [
    ChartistTooltip({
      anchorToPoint: false,
      appendToBody: true,
      seriesName: false,
    }),
  ],
}

const supportCasesPieOptions = {
  donut: true,
  donutWidth: 35,
  showLabel: false,
  plugins: [
    ChartistTooltip({
      anchorToPoint: false,
      appendToBody: true,
      seriesName: false,
    }),
  ],
}

const supportCasesTableColumns = [
  {
    title: 'Type',
    dataIndex: 'type',
    key: 'type',
  },
  {
    title: 'Amount',
    key: 'amount',
    dataIndex: 'amount',
    render: amount => {
      if (amount === 'Negative') {
        return <span className="text-danger font-weight-bold">{amount}</span>
      }
      return <span className="text-primary font-weight-bold">{amount}</span>
    },
  },
]

class DashboardGamma extends React.Component {
  render() {
    return (
      <div className="row">
        <div className="col-xl-8">
          <div className="utils__title utils__title--flat mb-3">
            <strong className="text-uppercase font-size-16">Progress Information</strong>
          </div>
          <div className="row">
            {progressCardsData.map(item => (
              <div className="col-lg-6" key={item.title}>
                <ProgressCard
                  title={item.title}
                  note={item.note}
                  currentValue={item.currentValue}
                  percent={item.percent}
                  dataColor={item.dataColor}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card card--fullHeight">
            <div className="card-header">
              <div className="utils__title utils__title--flat">
                <strong className="text-uppercase font-size-16">Finance Stats</strong>
              </div>
            </div>
            <div className="card-body">
              {financeStatsData.map(item => {
                const actionData = (
                  <span style={{ color: item.actionDataColor }}>{item.actionData}</span>
                )
                return (
                  <ShortItemInfo
                    key={item.name}
                    img={item.img}
                    name={item.name}
                    note={item.note}
                    actionData={actionData}
                    size="large"
                  />
                )
              })}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default DashboardGamma
