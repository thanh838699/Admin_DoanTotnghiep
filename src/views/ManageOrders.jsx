import React from "react";
import {
  Button,
  Badge,
  message,
  Popconfirm,
  DatePicker
} from "antd";
import {
  getOrders,
  updatePayment,
  deleteOrder,
} from "../actions/report_actions";
import { auth } from "../actions/user_actions";
import { connect } from "react-redux";
import moment from "moment";
import MUIDataTable from "mui-datatables";
import NumberFormat from "react-number-format";
import { Link } from "react-router-dom";


class ManageOrders extends React.Component {
  state = {
    loading: false,
    visible: false,
    skip: 0,
    take: 10,
    categories: [],
    id: "",
    arrivaltime: ""
   
  };

  componentDidMount() {
    this.props.dispatch(getOrders());
    this.props.dispatch(auth()).then((res) => {
      console.log(res.payload);
      if (!res.payload.isAdmin) {
        this.props.history.push("/login");
      }
    });
    console.log(this.state.dateCome)
  }
  onEditDate = (date, dateString) => {
    // console.log(dateString)
    this.setState({arrivaltime: dateString})
   
    
  };

  onEditStatus = (id) => {
    if (id) {
      this.props
        .dispatch(updatePayment(id, { status: "Active", arrivaltime: this.state.arrivaltime}))
        .then((res) => {
          if (res.payload.success) {
            setTimeout(() => {
              this.props.dispatch(getOrders());
              message.success("Cật nhật thành công!!!");
            }, 100);
          }
        });
    }
  };
  cancelOrder = (id) => {
    this.setState({ visible: false });
    this.props.dispatch(deleteOrder(id));
    message.success("Cancel Successfully");
  };
  showdata = () => {
    let newData = [];
    if (this.props.report.allOrders) {
      newData = this.props.report.allOrders.map((item, i) => {
        return [
          item.user
            ? item.user.map((item) => {
                return item.name;
              })
            : "",
          `${moment(new Date(item.date)).format("LL")}`,
          <NumberFormat
            value={item.amount}
            displayType={"text"}
            thousandSeparator={true}
            prefix={"$"}
          />,
          <>
            {" "}
            {item.status === "Pending" ? (
              <>
              
              <DatePicker onChange={this.onEditDate} />
              </>
            ) : (
              <p>{item.arrivaltime}</p>
            )}
          </>,

          item.status === "Pending" ? (
            <>
              <Badge status="processing" /> Đang chờ
            </>
          ) : (
            <>
              <Badge status="success" />
              Duyệt
            </>
          ),
          <>
            {item.status === "Pending" ? (
              <Button
                type="primary"
                onClick={() => {
                  this.onEditStatus(item._id);
                }}
              >
                Duyệt
              </Button>
            ) : (
              " "
            )}
            &nbsp;
            <Link to={`orderdetail/${item._id}`}>
              <Button style={{ background: "#ff8250" }}>Chi tiết</Button>
            </Link>
            &nbsp;
            <Popconfirm
              title={`Are you sure canel this order?`}
              onConfirm={() => this.cancelOrder(item._id)}
              onCancel={this.cancel}
              okText="Yes"
              cancelText="No"
            >
              <Button type="danger">Xóa</Button>
            </Popconfirm>
          </>,
        ];
      });
    }
    return newData;
  };
  render() {
    const columns = [
      "Tên khách hàng",
      "Thời gian",
      "Giá",
      "Ngày đến",
      "Trạng thái",
      "Tùy chọn",
    ];
    const options = {
      filterType: "dropdown",
      responsive: "scroll",
      selectableRows: false,
    };
    
    return (
      <>
        <div className="content">
          <MUIDataTable
            title={"Manage Orders"}
            data={this.showdata()}
            columns={columns}
            options={options}
          />
        </div>
      </>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    report: state.report,
  };
};

export default connect(mapStateToProps)(ManageOrders);
