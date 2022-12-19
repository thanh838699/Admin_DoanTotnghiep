import React from "react";
import {
  Button,
  Table,
  Divider,
  Modal,
  Form,
  Input,
  message,
  Popconfirm,
  Spin,
  Icon
} from "antd";
import {
  getTypes,
  deleteType,
  addType,
  editType
} from "../actions/category_actions";
import { auth } from "../actions/user_actions";
import { connect } from "react-redux";
class Categories extends React.Component {
  state = {
    loading: false,
    visible: false,
    edit: false,
    categories: [],
    id: ""
  };

  componentDidMount() {
    this.props.dispatch(getTypes());
    this.props.dispatch(auth()).then(res => {
      console.log(res.payload);
      if (!res.payload.isAdmin) {
        this.props.history.push("/login");
      }
    });
  }
  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
  }

  showModal = () => {
    this.props.form.setFields({ name: { value: "" } });
    this.setState({
      visible: true
    });
  };
  handleCancel = e => {
    this.setState({
      visible: false,
      edit: false
    });
  };
  findName = (categories, name) => {
    var result = -1;
    categories.forEach((category, index) => {
      if (category.name === name) {
        result = index;
      }
    });
    return result;
  };
  onEdit = id => {
    this.setState({ visible: true, edit: true, id });
    const { form, category } = this.props;
    if (category.types) {
      category.types.forEach(item => {
        if (item._id === id) {
          form.setFields({ name: { value: item.name } });
        }
      });
    }
  };
  onconfirm = id => {
    this.props.dispatch(deleteType(id));
    setTimeout(() => {
      message.success("Xóa thành công");
    }, 180);
  };
  handleSubmit = e => {
    const { category, dispatch, form } = this.props;
    const { edit, id } = this.state;
    e.preventDefault();

    form.validateFields((err, values) => {
      if (values.name !== undefined) {
        this.setState({
          loading: true
        });
      }
      if (!err) {
        if (category.types) {
          if (edit) {
            let index = this.findName(category.types, values.name);
            if (index === -1) {
              dispatch(editType(id, values));
              setTimeout(() => {
                this.setState({ loading: false, visible: false, edit: false });
                dispatch(getTypes());
                message.success("Cập nhật thành công");
                form.resetFields();
              }, 1000);
            } else {
              this.setState({ loading: false });
              message.error("Tên danh mục đã tồn tại!!!");
            }
          } else {
            let index = this.findName(category.types, values.name);
            if (index === -1) {
              dispatch(addType(values));
              setTimeout(() => {
                this.setState({ loading: false });
                dispatch(getTypes());
                message.success("Thêm danh mục thành công");
                form.resetFields();
              }, 1000);
            } else {
              this.setState({ loading: false });
              message.error("Danh mục đã tồn tại");
            }
          }
        }
      }
    });
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
        title: "Tùy chọn",
        key: "action",
        render: (text, record) => (
          <span>
            <Button onClick={() => this.onEdit(record.key)}>Sửa</Button>
            <Divider type="vertical" />
            <Popconfirm
              title={`Bạn có chắc muốn xóa ${record.Name}`}
              onConfirm={() => this.onconfirm(record.key)}
              onCancel={this.cancel}
              okText="Yes"
              cancelText="No"
            >
              <Button type="danger">Xóa</Button>
            </Popconfirm>
          </span>
        )
      }
    ];
    const dataSource = this.props.category.types
      ? this.props.category.types.map(item => {
          return {
            key: item._id,
            Name: item.name
          };
        })
      : null;
    const { getFieldDecorator } = this.props.form;
    return (
      <>
        <div className="content">
          <div style={{ overflow: "hidden" }}>
            <Button
              style={{ float: "right", marginBottom: 20 }}
              icon="plus-square"
              onClick={this.showModal}
            >
              Thêm danh mục mới
            </Button>
          </div>
          {dataSource ? (
            <Table
              bordered
              style={{ background: "#e9ecef" }}
              dataSource={dataSource}
              columns={columns}
            />
          ) : (
            <Spin indicator={antIcon} />
          )}
        </div>
        <Modal
          title={this.state.edit ? "Sửa danh mục" : "Thêm danh mục mới"}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          footer={[
            <Button key="back" onClick={this.handleCancel}>
              Cancel
            </Button>,
            <Button
              key="submit"
              type="primary"
              htmlType="submit"
              loading={this.state.loading}
              onClick={this.handleSubmit}
            >
              Submit
            </Button>
          ]}
        >
          <Form onSubmit={this.handleSubmit} className="login-form">
            <Form.Item>
              {getFieldDecorator("name", {
                rules: [
                  { required: true, message: "Please input your username!" }
                ]
              })(<Input placeholder="Name" />)}
            </Form.Item>
            <Form.Item />
          </Form>
        </Modal>
      </>
    );
  }
}
const mapStateToProps = state => {
  return {
    category: state.category
  };
};
const CategoriesForm = Form.create()(Categories);
export default connect(mapStateToProps)(CategoriesForm);
