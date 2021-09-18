import React, {Component} from 'react';
import {Link} from "react-router-dom";
import {Icon, List, Spin, Card, Row, Col} from "antd";
import styles from "../membership/style.module.scss";

class P2M extends Component {

  getColor = status => {
    let color
    switch (status) {
      case '0':
        color = 'rgba(255,145,115,0.2)'
        break
      case '1':
        color = 'rgba(86,140,165,0.2)'
        break
      default:
        color = 'rgba(86,140,165,0.1)'
    }
    return color
  }

  getColorText = status => {
    let color
    switch (status) {
      case '0':
        color = 'rgba(255,145,115,1)'
        break
      case '1':
        color = 'rgba(86,140,165,1)'
        break
      default:
        color = 'rgba(255,145,115,1)'
    }
    return color
  }


  render() {
    const data = [
      {
        form: "Permohonan Test Urine",
        link:'test_urine'
      },
      {
        form: "Permohonan Sosialisasi",
        link:'sosialisasi'
      }
    ]


    const DATA = data.map(el => ({
      ...el,
      color: this.getColor(el.status),
      colorText: this.getColorText(el.status),
    }))

    const resultData = [...DATA]



    return (
      <div>
        <div className={styles.container}>
          <div className={styles.child}>
            <div className={`${styles.cardLogin}`}>
              <div className="p-4 m-0">
                <Spin spinning={false}>
                  <Link to="/membership/layanan_masyarakat" className='utils__link--blue utils__link mt-2 mr-1'>
                    <Icon type="arrow-left" style={{fontSize: '1.5em'}} />
                    <span style={{fontSize: '1.5em', margin: 10}}>P2M</span>
                  </Link>

                  <Card
                    hoverable
                    style={{
                      border: 'none',
                      height: '20vh',
                      marginBottom: '1.5em',
                      backgroundColor: `#3a99ff`
                    }}
                  >
                    <h5 className='font-weight-bold text-white'>Layanan Masyarakat BNN</h5>
                    <p className='text-white'>Sekarang Lebih mudah dan online</p>
                  </Card>
                  <List
                    grid={{
                      gutter: 16,
                      xs: 2,
                      sm: 2,
                      md: 2,
                      lg: 2,
                      xl: 2,
                      xxl: 2,
                    }}
                    dataSource={resultData}
                    renderItem={el => (
                      <List.Item>
                        {!el.isAdd && (
                          <Link to={`/membership/layanan_masyarakat/p2m/${el.link}`}>
                            <Card
                              loading={false}
                              hoverable
                              style={{
                                borderRadius: 20,
                                border: 'none',
                                height: '20vh',
                                backgroundColor: el.color,
                              }}
                            >
                              <Row>
                                <Col span={24} className='text-center'>
                                  <span style={{ padding: '0.75rem'}}>
                                    <Icon type='home' style={{fontSize: 30}} />
                                  </span>
                                </Col>
                              </Row>
                              {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/interactive-supports-focus */}
                              <div
                                // role="button"
                                style={{
                                  // backgroundColor: el.colorText,
                                  borderRadius: 8,
                                  textAlign: 'center',
                                }}
                              >

                                <Row gutter={8}>
                                  <Col span={24}>
                                    <h4 className='text-center'>{el.form}</h4>
                                  </Col>
                                </Row>

                              </div>
                            </Card>
                          </Link>
                        )}
                      </List.Item>
                    )}
                  />
                </Spin>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default P2M;
