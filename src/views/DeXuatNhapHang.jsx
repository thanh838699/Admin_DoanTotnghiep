import React from "react";
import {
  Button,
  Table,
  Divider,
  Form,
  message,
  Popconfirm,
  Spin,
  Icon,
  DatePicker
} from "antd";
import { getProducts, deleteProduct } from "../actions/product_actions";
import { Link } from "react-router-dom";
import { auth } from "../actions/user_actions";
import { connect } from "react-redux";
import NotificationAlert from "react-notification-alert";
import { Card, CardHeader, CardBody, CardTitle, Row, Col } from "reactstrap";
import { Line, Bar, Pie, Doughnut } from "react-chartjs-2";
import { chartExample1, chartExample4 } from "variables/charts.jsx";
import {
    reportProducts,
  } from "../actions/report_actions";
  import moment from "moment";
const { RangePicker } = DatePicker;
class DeXuatNhapHang extends React.Component {
  state = {
    loading: false,
    visible: false,
    edit: false,
    categories: [],
    id: "",
    allProducts: [],
    toggleDateRangeProduct: false,
    dataDateRangeAllProduct: [],
  };

  componentDidMount() {
    this.props.dispatch(getProducts()).then((res) => {
      this.setState({ allProducts: res.payload });
      res.payload.forEach((item) => {
        if (item.quantity == 0) {
          var options = {};
          options = {
            place: "tr",
            message: (
              <div>
                <div>
                  <b>Product {item.name} đã hết hàng!</b>
                </div>
              </div>
            ),
            type: "danger",
            icon: "tim-icons icon-bell-55",
            autoDismiss: 7,
          };
          this.refs.notificationAlert.notificationAlert(options);
        }
      });
    });

    this.props.dispatch(auth()).then((res) => {
      if (!res.payload.isAdmin) {
        this.props.history.push("/login");
      }
    });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps && nextProps.product) {
      this.setState({ allProducts: nextProps.product.allProducts });
    }
  }
  onconfirm = (id) => {
    this.props.dispatch(deleteProduct(id));
    setTimeout(() => {
      message.success("Delete Successfully");
    }, 180);
  };
  onChangeDateRangeProduct = (date, dateString) => {
    let newdataDateRangeProduct = [];
    let newlabelDateRangeProduct = [];
    let newdataDateSoldProduct = [];
    let data = {
      start: dateString[0],
      end: dateString[1]
    };
    this.props.dispatch(reportProducts(data)).then(res => {
      this.setState({
        dataDateRangeAllProduct: res.payload.results
      });
      console.log(this.state.dataDateRangeAllProduct)
      if (res.payload.size > 0) {
        res.payload.results.map(item => {
          newlabelDateRangeProduct.unshift(`Sản phẩm ${item._id}`);
          newdataDateRangeProduct.unshift(item.amount); 
          newdataDateSoldProduct.unshift(item.sold)      
        });
      } else {
        newdataDateRangeProduct = [];
        newlabelDateRangeProduct = [];  
        newdataDateSoldProduct = [];
      }
      this.setState({
        labelDateRangeProduct: newlabelDateRangeProduct,
        dataDateRangeProduct: newdataDateRangeProduct, 
        DataDateSoldProduct: newdataDateSoldProduct,    
        dateStartProduct: dateString[0],
        dateEndProduct: dateString[1],
        toggleDateRangeProduct: true
      });
    });
  };
 
  cancel = (e) => {
    console.log(e);
  };
  showImage = (image) => {
    return (
      <img src={image} width={50} style={{ borderRadius: "10px" }} alt="" />
    );
  };
  render() {
    const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;
    const columns = [
      {
        title: "Tên",
        dataIndex: "Name",
        key: "Name",
      },
      {
        title: "Hình ảnh",
        dataIndex: "Image",
        key: "Image",
      },
      {
        title: "Mô tả",
        dataIndex: "Description",
        key: "Description",
      },
      {
        title: "Giá",
        dataIndex: "Price",
        key: "Price",
      },
      {
        title: "SL bán",
        dataIndex: "Sold",
        key: "Sold",
      },
      {
        title: "Số lượng",
        dataIndex: "Quantity",
        key: "Quantity",
      },
      {
        title: "Thương hiệu",
        dataIndex: "Brand",
        key: "Brand",
      },
      {
        title: "Danh mục",
        dataIndex: "Category",
        key: "Category",
      },
      {
        title: "Tùy chọn",
        key: "operation",
        render: (text, record) => (
          <span>
            <Link to={`/admin/edit-product/${record.key}`}>
              {" "}
              <Button>Chỉnh sửa</Button>{" "}
            </Link>

            <Divider type="vertical" />
            <Popconfirm
              title={`Bạn có chắc muốn xóa ${record.Name}`}
              onConfirm={() => this.onconfirm(record.key)}
              onCancel={this.cancel}
              okText="Yes"
              cancelText="No"
            >
              {" "}
              <Button style={{ marginTop: "10px" }} type="danger">
                Xóa
              </Button>
            </Popconfirm>
          </span>
        ),
      },
    ];
    const deXuat = [];

    this.state.allProducts
      && this.state.allProducts.forEach((item) => {
          if (item.quantity < 30 && item.sold > 10) {
            deXuat.push({
              key: item._id,
              Name: item.name,
              Image: item.images.length
                ? this.showImage(item.images[0].url)
                : "No Image",
              Description: `${item.description.slice(0, 50)}...`,
              Category: item.wood.name,
              Brand: item.brand.name,
              Price: item.price,
              Sold: item.sold,
              Quantity: item.quantity,
            });
          }
        });
      

      

    const dataSource = this.state.allProducts
      ? this.state.allProducts.map((item) => {
          return {
            key: item._id,
            Name: item.name,
            Image: item.images.length
              ? this.showImage(item.images[0].url)
              : "No Image",
            Description: `${item.description.slice(0, 50)}...`,
            Category: item.wood.name,
            Brand: item.brand.name,
            Price: item.price,
            Sold: item.sold,
            Quantity: item.quantity,
          };
        })
      : null;
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
              // {
              //   label: "Tổng: ",
              //   fill: true,
              //   backgroundColor: gradientStroke,
              //   borderColor: "#1f8ef1",
              //   borderWidth: 2,
              //   borderDash: [],
              //   borderDashOffset: 0.0,
              //   pointBackgroundColor: "#1f8ef1",
              //   pointBorderColor: "rgba(255,255,255,0)",
              //   pointHoverBackgroundColor: "#1f8ef1",
              //   pointBorderWidth: 20,
              //   pointHoverRadius: 4,
              //   pointHoverBorderWidth: 15,
              //   pointRadius: 4,
              //   data: this.state.dataDateRangeProduct 
              // },
              {
                label: "SL bán: ",
                fill: true,
                backgroundColor: gradientStroke,
                borderColor: "#ee141f",
                borderWidth: 2,
                borderDash: [],
                borderDashOffset: 0.0,
                pointBackgroundColor: "#f1501f",
                pointBorderColor: "rgba(255,255,255,0)",
                pointHoverBackgroundColor: "#f17e1f",
                pointBorderWidth: 20,
                pointHoverRadius: 4,
                pointHoverBorderWidth: 15,
                pointRadius: 4,
                data: this.state.DataDateSoldProduct 
              }
                          
            ]
            
          };
        }
      };
      const {
        toggleDateRangeProduct,
        dataDateRangeAllProduct,
        dateStartProduct,
        dateEndProduct,
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
                            Báo cáo số lượng sản phẩm đã bán:{" "}
                            <strong style={{ color: "black" }}>
                              {moment(new Date(dateStartProduct)).format("LL")}{" "}
                              {"- "}
                              {moment(new Date(dateEndProduct)).format("LL")}
                            </strong>
                          </>
                        ) : (
                          <>
                            Sản phẩm bán chạy :{" "}
                            <strong style={{ color: "black" }}>
                              {moment(new Date(Date.now())).format("LL")}
                            </strong>
                          </>
                        )}
                      </h5>

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
          <div className="react-notification-alert-container">
            <NotificationAlert ref="notificationAlert" />
          </div>
          <div style={{ overflow: "hidden" }}>
            {/* <Link to="/admin/add-Product">
              {" "}
              <Button
                style={{ float: "right", marginBottom: 20 }}
                icon="plus-square"
                onClick={this.showModal}
              >
                Thêm sản phẩm mới
              </Button>
            </Link> */}
          </div>
          {dataSource ? (
            <Table
              bordered
              style={{ background: "#e9ecef" }}
              dataSource={deXuat}
              columns={columns}
              pagination={{ pageSize: 8 }}
            />
          ) : (
            <Spin indicator={antIcon} />
          )}
        </div>
      </>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    product: state.product,
  };
};
const ManageProductsForm = Form.create()(DeXuatNhapHang);
export default connect(mapStateToProps)(ManageProductsForm);
