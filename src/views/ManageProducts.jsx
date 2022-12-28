import React from "react";
import {
  Button,
  Table,
  Divider,
  Form,
  message,
  Popconfirm,
  Spin,
  Icon
} from "antd";
import { getProducts, deleteProduct } from "../actions/product_actions";
import { Link } from "react-router-dom";
import { auth } from "../actions/user_actions";
import { connect } from "react-redux";
import NotificationAlert from "react-notification-alert";
class ManageProducts extends React.Component {
  state = {
    loading: false,
    visible: false,
    edit: false,
    categories: [],
    id: "",
    allProducts: []
  };


  componentDidMount() {
    this.props.dispatch(getProducts()).then(res => {
      this.setState({ allProducts: res.payload });
      res.payload.forEach(item => {
        if (item.quantity == 0) {
          var options = {};
          options = {
            place: "tr",
            message: (
              <div>
                <div>
                  <b>Product {item.name} is out of stock!</b>
                </div>
              </div>
            ),
            type: "danger",
            icon: "tim-icons icon-bell-55",
            autoDismiss: 7
          };
          this.refs.notificationAlert.notificationAlert(options);
        }
      });
    });

    this.props.dispatch(auth()).then(res => {
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
  onconfirm = id => {
    this.props.dispatch(deleteProduct(id));
    setTimeout(() => {
      message.success("Delete Successfully");
    }, 180);
  };

  cancel = e => {
    console.log(e);
  };
  showImage = image => {
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
        key: "Name"
      },
      {
        title: "Hình ảnh",
        dataIndex: "Image",
        key: "Image"
      },
      {
        title: "Mô tả",
        dataIndex: "Description",
        key: "Description"
      },
      {
        title: "Giá",
        dataIndex: "Price",
        key: "Price"
      },
      {
        title: "SL bán",
        dataIndex: "Sold",
        key: "Sold"
      },
      {
        title: "Số lượng",
        dataIndex: "Quantity",
        key: "Quantity"
      },
      {
        title: "Thương hiệu",
        dataIndex: "Brand",
        key: "Brand"
      },
      {
        title: "Danh mục",
        dataIndex: "Category",
        key: "Category"
      },
      {
        title: "Tùy chọn",
        key: "operation",
        render: (text, record) => (
          <span>
            <Link to={`/admin/edit-product/${record.key}`}>
              {" "}
              <Button>Chỉnh sửa</Button>
              {" "}
            </Link>
            
            <Divider type="vertical" />
            <Popconfirm
              title={`Are you sure delete this product ${record.Name}`}
              onConfirm={() => this.onconfirm(record.key)}
              onCancel={this.cancel}
              okText="Yes"
              cancelText="No"
            >{" "}
              <Button style={{marginTop:"10px"}} type="danger">Xóa</Button>
            </Popconfirm>
          </span>
        )
      }
    ];
    const dataSource = this.state.allProducts
      ? this.state.allProducts.map(item => {
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
            Quantity: item.quantity
          };
        })
      : null;
    return (
      <>
        <div className="content">
          <div className="react-notification-alert-container">
            <NotificationAlert ref="notificationAlert" />
          </div>
          <div style={{ overflow: "hidden" }}>
            <Link to="/admin/add-Product">
              {" "}
              <Button
                style={{ float: "right", marginBottom: 20 }}
                icon="plus-square"
                onClick={this.showModal}
              >
                Thêm sản phẩm mới
              </Button>
            </Link>
          </div>
          {dataSource ? (
            <Table
              bordered
              style={{ background: "#e9ecef" }}
              dataSource={dataSource}
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
const mapStateToProps = state => {
  return {
    product: state.product
  };
};
const ManageProductsForm = Form.create()(ManageProducts);
export default connect(mapStateToProps)(ManageProductsForm);
