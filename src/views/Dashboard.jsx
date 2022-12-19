import React from "react";
import { DatePicker, Spin, Button, Table, Icon, Modal } from "antd";
// nodejs library that concatenates classes
// react plugin used to create charts
import { Line, Bar, Pie, Doughnut } from "react-chartjs-2";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import NumberFormat from "react-number-format";
import YearPicker from "react-year-picker";
import { auth } from "../actions/user_actions";
import {
  reportMonths,
  reportDate,
  reportProducts,
  reportCustomer
} from "../actions/report_actions";
import moment from "moment";
// reactstrap components
import { Card, CardHeader, CardBody, CardTitle, Row, Col } from "reactstrap";
// core components
import { chartExample1, chartExample4 } from "variables/charts.jsx";
import TextArea from "antd/lib/input/TextArea";
import currency from "currency-formatter";
const { RangePicker } = DatePicker;
class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bigChartData: "data1",
      total: 0,
      dataMonthAll: [],
      labelMonth: [],
      dataMonth: [],
      dataDateRangeAll: [],
      labelDateRange: [],
      dataDateRange: [],
      dataDateRangeAllProduct: [],
      labelDateRangeProduct: [],
      dataDateRangeProduct: [],
      dataDateRangeAllCustomer: [],
      labelDateRangeCustomer: [],
      dataDateRangeCustomer: [],
      dateStart: "",
      dateEnd: "",
      dateStartProduct: "",
      dateEndProduct: "",
      dateStartCustomer: "",
      dateEndCustomer: "",
      newYear: "",
      toggleDateRangeProduct: false,
      toggleDateRange: false,
      toggleDateRangeCustomer: false,
      toggleYear: false,
      oneYearAgo: [],
      twoYearAgo: [],
      yearNow: [],
      visible: false
    };
  }
  componentDidMount() {
    const yearNow = new Date().getFullYear();
    this.props
      .dispatch(reportMonths({ year: `${yearNow - 1}-01-01` }))
      .then(res => this.setState({ oneYearAgo: res.payload.results }));
    this.props
      .dispatch(reportMonths({ year: `${yearNow - 2}-01-01` }))
      .then(res => this.setState({ twoYearAgo: res.payload.results }));
    this.props
      .dispatch(reportMonths({ year: `${yearNow}-01-01` }))
      .then(res => this.setState({ yearNow: res.payload.results }));
    this.props.dispatch(reportCustomer()).then(res => {
      if (res.payload.size > 0) {
        this.setState({ dataDateRangeAllCustomer: res.payload.results });
        res.payload.results.reverse().map(item => {
          this.state.labelDateRangeCustomer.push(`Customer ${item._id}`);
          this.state.dataDateRangeCustomer.push(item.amount);
        });
      }
    });
    this.props.dispatch(reportDate()).then(res => {
      if (res.payload.size > 0) {
        this.setState({ dataDateRangeAll: res.payload.results });
        res.payload.results.reverse().map(item => {
          this.state.labelDateRange.push(`Date ${item._id}`);
          this.state.dataDateRange.push(item.amount);
        });
      }
    });
    this.props.dispatch(reportProducts()).then(res => {
      if (res.payload.size > 0) {
        this.setState({ dataDateRangeAllProduct: res.payload.results });
        res.payload.results.reverse().map(item => {
          this.state.labelDateRangeProduct.push(`Product ${item._id}`);
          this.state.dataDateRangeProduct.push(item.amount);
        });
      }
    });
    this.props.dispatch(reportMonths()).then(res => {
      if (res.payload.size > 0) {
        this.setState({ dataMonthAll: res.payload.results });
        res.payload.results.reverse().map(item => {
          this.state.labelMonth.push(`Month ${item._id}`);
          this.state.dataMonth.push(item.amount);
        });
      }
    });
    this.props.dispatch(auth()).then(res => {
      if (!res.payload.isAdmin) {
        this.props.history.push("/login");
      }
    });
  }
  handleCancel = () => {
    this.setState({ visible: false });
  };
  showModalRevenue = () => {
    this.setState({ visible: true });
  };
  setBgChartData = name => {
    this.setState({
      bigChartData: name
    });
  };
  totalAmount = data => {
    let total = 0;
    data.forEach(item => {
      total += parseInt(item.amount, 10);
    });

    return total;
  };
  onChangeDateRangeProduct = (date, dateString) => {
    let newdataDateRangeProduct = [];
    let newlabelDateRangeProduct = [];
    let data = {
      start: dateString[0],
      end: dateString[1]
    };
    this.props.dispatch(reportProducts(data)).then(res => {
      this.setState({
        dataDateRangeAllProduct: res.payload.results
      });
      if (res.payload.size > 0) {
        res.payload.results.map(item => {
          newlabelDateRangeProduct.unshift(`Product ${item._id}`);
          newdataDateRangeProduct.unshift(item.amount);
        });
      } else {
        newdataDateRangeProduct = [];
        newlabelDateRangeProduct = [];
      }
      this.setState({
        labelDateRangeProduct: newlabelDateRangeProduct,
        dataDateRangeProduct: newdataDateRangeProduct,
        dateStartProduct: dateString[0],
        dateEndProduct: dateString[1],
        toggleDateRangeProduct: true
      });
    });
  };
  onChangeDateRange = (date, dateString) => {
    let newdataDateRange = [];
    let newlabelDateRange = [];
    let data = {
      start: dateString[0],
      end: dateString[1]
    };
    this.props.dispatch(reportDate(data)).then(res => {
      this.setState({
        dataDateRangeAll: res.payload.results
      });
      if (res.payload.size > 0) {
        res.payload.results.forEach(item => {
          newlabelDateRange.unshift(`Date ${item._id}`);
          newdataDateRange.unshift(item.amount);
        });
      } else {
        newdataDateRange = [];
        newlabelDateRange = [];
      }
      this.setState({
        labelDateRange: newlabelDateRange,
        dataDateRange: newdataDateRange,
        dateStart: dateString[0],
        dateEnd: dateString[1],
        toggleDateRange: true
      });
    });
  };
  onChangeDateRangeCustomer = (date, dateString) => {
    let newdataDateRangeCustomer = [];
    let newlabelDateRangeCustomer = [];
    let data = {
      start: dateString[0],
      end: dateString[1]
    };
    this.props.dispatch(reportCustomer(data)).then(res => {
      this.setState({
        dataDateRangeAllCustomer: res.payload.results
      });
      if (res.payload.size > 0) {
        res.payload.results.map(item => {
          newlabelDateRangeCustomer.unshift(`Customer ${item._id}`);
          newdataDateRangeCustomer.unshift(item.amount);
        });
      } else {
        newdataDateRangeCustomer = [];
        newlabelDateRangeCustomer = [];
      }
      this.setState({
        labelDateRangeCustomer: newlabelDateRangeCustomer,
        dataDateRangeCustomer: newdataDateRangeCustomer,
        dateStartCustomer: dateString[0],
        dateEndCustomer: dateString[1],
        toggleDateRangeCustomer: true
      });
    });
  };
  handleChangeYear = date => {
    let newdataMonth = [];
    let newlabelMonth = [];
    let newDate = `${date}-01-01`;
    this.props.dispatch(reportMonths({ year: newDate })).then(res => {
      this.setState({
        dataMonthAll: res.payload.results,
        newYear: date,
        toggleYear: true
      });
      if (res.payload.size > 0) {
        res.payload.results.map(item => {
          newlabelMonth.unshift(`Month ${item._id}`);
          newdataMonth.unshift(item.amount);
        });
      } else {
        newlabelMonth = [];
        newdataMonth = [];
      }
      this.setState({
        labelMonth: newlabelMonth,
        dataMonth: newdataMonth
      });
    });
  };
  render() {
    const yearNow = new Date().getFullYear();
    const revenue = [
      {
        title: "Year",
        dataIndex: "Year",
        key: "Year"
      },
      {
        title: "Total",
        dataIndex: "Total",
        key: "Total"
      }
    ];
    const dataSourceRevenue = [
      {
        Year: `${yearNow}`,
        Total: (
          // <NumberFormat
          //   value={this.totalAmount(this.state.yearNow)}
          //   displayType={"text"}
          //   thousandSeparator={true}
          //   prefix={"$"}
          // />
          `${currency.format(this.totalAmount(this.state.yearNow), {code:"VND"})}`
        )
      },
      {
        Year: `${yearNow - 1}`,
        Total: (
          // <NumberFormat
          //   value={this.totalAmount(this.state.oneYearAgo)}
          //   displayType={"text"}
          //   thousandSeparator={true}
          //   prefix={"$"}
          // />
          `${currency.format(this.totalAmount(this.state.oneYearAgo), {code:"VND"})}`
        )
      },
      {
        Year: `${yearNow - 2}`,
        Total: (
          // <NumberFormat
          //   value={this.totalAmount(this.state.twoYearAgo)}
          //   displayType={"text"}
          //   thousandSeparator={true}
          //   prefix={"$"}
          // />
          `${currency.format(this.totalAmount(this.state.twoYearAgo), {code:"VND"})}`
        )
      }
    ];

    let optionsPie = {
      maintainAspectRatio: false,
      responsive: true,
      legend: {
        position: "left",
        labels: {
          boxWidth: 10
        }
      }
    };
    let chartMonth = {
      data: canvas => {
        let ctx = canvas.getContext("2d");

        let gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);

        gradientStroke.addColorStop(1, "rgba(72,72,176,0.1)");
        gradientStroke.addColorStop(0.4, "rgba(72,72,176,0.0)");
        gradientStroke.addColorStop(0, "rgba(119,52,169,0)"); //purple colors

        return {
          labels: this.state.labelMonth,
          datasets: [
            {
              label: "Sale",
              fill: true,
              backgroundColor: gradientStroke,
              hoverBackgroundColor: gradientStroke,
              borderColor: "#d048b6",
              borderWidth: 2,
              borderDash: [],
              borderDashOffset: 0.0,
              data: this.state.dataMonth
            }
          ]
        };
      },
      options: {
        maintainAspectRatio: false,
        legend: {
          display: false
        },
        tooltips: {
          backgroundColor: "#f5f5f5",
          titleFontColor: "#333",
          bodyFontColor: "#666",
          bodySpacing: 4,
          xPadding: 12,
          mode: "nearest",
          intersect: 0,
          position: "nearest"
        },
        responsive: true,
        scales: {
          yAxes: [
            {
              gridLines: {
                drawBorder: false,
                color: "rgba(225,78,202,0.1)",
                zeroLineColor: "transparent"
              },
              ticks: {
                suggestedMin: 60,
                suggestedMax: 120,
                padding: 20,
                fontColor: "#9e9e9e"
              }
            }
          ],
          xAxes: [
            {
              gridLines: {
                drawBorder: false,
                color: "rgba(225,78,202,0.1)",
                zeroLineColor: "transparent"
              },
              ticks: {
                padding: 20,
                fontColor: "#9e9e9e"
              }
            }
          ]
        }
      }
    };
    let chartDateProducts = {
      data: canvas => {
        let ctx = canvas.getContext("2d");

        let gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);

        gradientStroke.addColorStop(1, "rgba(29,140,248,0.2)");
        gradientStroke.addColorStop(0.4, "rgba(29,140,248,0.0)");
        gradientStroke.addColorStop(0, "rgba(29,140,248,0)"); //blue colors

        return {
          labels: this.state.labelDateRangeProduct,
          datasets: [
            {
              label: "Amount: ",
              fill: true,
              backgroundColor: gradientStroke,
              borderColor: "#1f8ef1",
              borderWidth: 2,
              borderDash: [],
              borderDashOffset: 0.0,
              pointBackgroundColor: "#1f8ef1",
              pointBorderColor: "rgba(255,255,255,0)",
              pointHoverBackgroundColor: "#1f8ef1",
              pointBorderWidth: 20,
              pointHoverRadius: 4,
              pointHoverBorderWidth: 15,
              pointRadius: 4,
              data: this.state.dataDateRangeProduct
            }
          ]
        };
      }
    };
    let chartDate = {
      data: canvas => {
        let ctx = canvas.getContext("2d");

        let gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);

        gradientStroke.addColorStop(1, "rgba(29,140,248,0.2)");
        gradientStroke.addColorStop(0.4, "rgba(29,140,248,0.0)");
        gradientStroke.addColorStop(0, "rgba(29,140,248,0)"); //blue colors

        return {
          labels: this.state.labelDateRange,
          datasets: [
            {
              label: "Amount: ",
              fill: true,
              backgroundColor: gradientStroke,
              borderColor: "#1f8ef1",
              borderWidth: 2,
              borderDash: [],
              borderDashOffset: 0.0,
              pointBackgroundColor: "#1f8ef1",
              pointBorderColor: "rgba(255,255,255,0)",
              pointHoverBackgroundColor: "#1f8ef1",
              pointBorderWidth: 20,
              pointHoverRadius: 4,
              pointHoverBorderWidth: 15,
              pointRadius: 4,
              data: this.state.dataDateRange
            }
          ]
        };
      }
    };
    const chartCustomer = {
      data: canvas => {
        return {
          labels: this.state.labelDateRangeCustomer,

          datasets: [
            {
              label: "Amount: ",
              fill: true,
              backgroundColor: [
                "#F7464A",
                "#46BFBD",
                "#FDB45C",
                "#949FB1",
                "#4D5360"
              ],
              data: this.state.dataDateRangeCustomer
            }
          ]
        };
      },
      options: {
        maintainAspectRatio: true,
        responsive: true,
        legend: {
          position: "left",
          labels: {
            boxWidth: 10
          }
        }
      }
    };
    const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;
    const {
      toggleDateRangeProduct,
      toggleDateRangeCustomer,
      dataDateRangeAllProduct,
      dataDateRangeAll,
      dataDateRangeAllCustomer,
      dataMonthAll,
      dateStart,
      dateEnd,
      toggleDateRange,
      dateStartProduct,
      dateEndProduct,
      dateStartCustomer,
      dateEndCustomer,
      toggleYear,
      newYear
    } = this.state;
    return (
      <>
        <div className="content">
          <Row>
            <Col xs="12">
              <Card className="card-chart">
                <CardHeader>
                  <Row>
                    <Col className="text-left" sm="6">
                      <h5
                        className="card-category"
                        style={{ fontSize: "15px" }}
                      >
                        {toggleDateRangeProduct ? (
                          <>
                            Report Products Date Range:{" "}
                            <strong style={{ color: "black" }}>
                              {moment(new Date(dateStartProduct)).format("LL")}{" "}
                              {"- "}
                              {moment(new Date(dateEndProduct)).format("LL")}
                            </strong>
                          </>
                        ) : (
                          <>
                            Sản phẩm bán chạy hôm nay:{" "}
                            <strong style={{ color: "black" }}>
                              {moment(new Date(Date.now())).format("LL")}
                            </strong>
                          </>
                        )}
                      </h5>

                      <CardTitle tag="h3">
                        <i className="tim-icons icon-delivery-fast text-primary" />{" "}
                        {/* <NumberFormat
                          value={this.totalAmount(dataDateRangeAllProduct)}
                          displayType={"text"}
                          thousandSeparator={true}
                          prefix={"$"}
                        /> */}
                        `${currency.format(this.totalAmount(dataDateRangeAllProduct), {code:"VND"})}`
                      </CardTitle>
                      {dataDateRangeAllProduct.length ? (
                        " "
                      ) : (
                        <h5 style={{ textAlign: "center" }}>Không có dữ liệu để hiển thị</h5>
                      )}
                    </Col>
                    <Col sm="6">
                      <RangePicker onChange={this.onChangeDateRangeProduct} />
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <div className="chart-area">
                    <Line
                      data={chartDateProducts.data}
                      options={chartExample1.options}
                    />
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col lg="4">
              <Card className="card-chart">
                <CardHeader>
                  <h5 className="card-category" style={{ fontSize: "15px" }}>
                    {toggleDateRangeCustomer ? (
                      <>
                        Báo cáo khách hàng:{" "}
                        <strong style={{ color: "black" }}>
                          {moment(new Date(dateStartCustomer)).format("LL")}{" "}
                          {"- "}
                          {moment(new Date(dateEndCustomer)).format("LL")}
                        </strong>
                      </>
                    ) : (
                      <>
                        Báo cáo khách hàng:{" "}
                        <strong style={{ color: "black" }}>
                          {moment(new Date(Date.now())).format("LL")}
                        </strong>
                      </>
                    )}
                    <Col sm="6" style={{ marginLeft: "6em" }}>
                      <RangePicker onChange={this.onChangeDateRangeCustomer} />
                    </Col>
                  </h5>
                  {dataDateRangeAllCustomer.length ? (
                    " "
                  ) : (
                    <h5 style={{ textAlign: "center" }}>Không có dữ liệu để hiển thị</h5>
                  )}
                  <CardTitle tag="h3">
                    <i className="tim-icons icon-delivery-fast text-primary" />{" "}
                    {/* <NumberFormat
                      value={this.totalAmount(dataDateRangeAllCustomer)}
                      displayType={"text"}
                      thousandSeparator={true}
                      prefix={"$"}
                    /> */}
                    `${currency.format(this.totalAmount(dataDateRangeAllCustomer), {code:"VND"})}`
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  {this.state.dataDateRangeCustomer.length ? (
                    <div className="chart-area">
                      <Doughnut
                        data={chartCustomer.data}
                        options={optionsPie}
                      />
                    </div>
                  ) : (
                    <div className="chart-area" style={{ textAlign: "center" }}>
                      <Spin />
                    </div>
                  )}
                </CardBody>
              </Card>
            </Col>

            <Col lg="4">
              <Card className="card-chart">
                <CardHeader>
                  <h5 className="card-category" style={{ fontSize: "15px" }}>
                   Báo cao doanh thu tháng trong năm{" "}
                    <strong style={{ color: "black" }}>
                      {toggleYear
                        ? newYear
                        : moment(new Date(Date.now())).format("YYYY")}
                    </strong>
                    &nbsp; &nbsp; &nbsp; &nbsp;
                    <Button onClick={this.showModalRevenue} type="primary">
                      Đánh giá doanh thu
                    </Button>
                  </h5>
                  <YearPicker onChange={this.handleChangeYear} />

                  <CardTitle tag="h3">
                    <i className="tim-icons icon-delivery-fast text-primary" />{" "}
                    {/* <NumberFormat
                      value={this.totalAmount(dataMonthAll)}
                      displayType={"text"}
                      thousandSeparator={true}
                      prefix={"$"}
                    /> */}
                      `${currency.format(this.totalAmount(dataMonthAll), {code:"VND"})}`
                  </CardTitle>
                </CardHeader>
                {dataMonthAll.length ? (
                  " "
                ) : (
                  <h5 style={{ textAlign: "center" }}>Không có dữ liệu </h5>
                )}
                <CardBody>
                  <div className="chart-area">
                    <Bar data={chartMonth.data} options={chartMonth.options} />
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col lg="4">
              <Card className="card-chart">
                <CardHeader>
                  <h5 className="card-category">
                    {toggleDateRange ? (
                      <>
                        Report Date Range:{" "}
                        <strong style={{ color: "black" }}>
                          {moment(new Date(dateStart)).format("LL")} {"- "}
                          {moment(new Date(dateEnd)).format("LL")}
                        </strong>
                      </>
                    ) : (
                      <>
                        Báo cáo ngày hôm nay:{" "}
                        <strong style={{ color: "black" }}>
                          {moment(new Date(Date.now())).format("LL")}
                        </strong>
                      </>
                    )}
                    <Col sm="6" style={{ marginLeft: "6em" }}>
                      <RangePicker onChange={this.onChangeDateRange} />
                    </Col>
                  </h5>
                  {dataDateRangeAll.length ? (
                    " "
                  ) : (
                    <h5 style={{ textAlign: "center" }}>Không có dữ liệu để hiển thị</h5>
                  )}
                  <CardTitle tag="h3">
                    <i className="tim-icons icon-delivery-fast text-primary" />{" "}
                    {/* <NumberFormat
                      value={this.totalAmount(dataDateRangeAll)}
                      displayType={"text"}
                      thousandSeparator={true}
                      prefix={"đ"}
                    /> */}
                    `${currency.format(this.totalAmount(dataDateRangeAll), {code:"VND"})}`
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <div className="chart-area">
                    <Line
                      data={chartDate.data}
                      options={chartExample4.options}
                    />
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Modal
            title="Revenue Assessment"
            visible={this.state.visible}
            onCancel={this.handleCancel}
            footer={false}
          >
            {this.state.dataMonthAll ? (
              <Table
                bordered
                style={{
                  background: "#e9ecef",
                  maxHeight: "30em",
                  overflowY: "auto"
                }}
                dataSource={dataSourceRevenue}
                columns={revenue}
              />
            ) : (
              <Spin indicator={antIcon} />
            )}
            <br />
            <p>
              Conclude:{" "}
              <TextArea
                disabled
                style={{ color: "red", height: "10em" }}
                value={
                  this.totalAmount(this.state.yearNow) >
                  (this.totalAmount(this.state.oneYearAgo) &&
                    this.totalAmount(this.state.twoYearAgo))
                    ? "Tính đến thời điểm hiện tại năm nay cửa hàng mình đạt doanh thu cao hơn so với 2 năm trước nên nhập thêm nhiều mặt hàng để phục vụ nhu cầu của khách hàng"
                    : "Tính đến thời điểm hiện tại, năm nay cửa hàng chúng tôi có doanh thu ít hơn so với hai năm trước. Cần nhập hàng mới hoặc có chiến lược kinh doanh tốt hơn để cải thiện tổng doanh thu năm nay. Ngoài ra, để cải thiện doanh thu cửa hàng cần giảm giá một số sản phẩm và tạo các sự kiện mới để thu hút khách hàng."
                }
              />
            </p>
          </Modal>
        </div>
      </>
    );
  }
}
const mapStateToProps = state => {
  return {
    report: state.report
  };
};
export default connect(mapStateToProps)(withRouter(Dashboard));
