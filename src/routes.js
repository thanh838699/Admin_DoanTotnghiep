import Dashboard from "views/Dashboard.jsx";

import AddProduct from "views/Product.jsx";
import Category from "views/Category.jsx";
import Brand from "views/Brand.jsx";

import ManageProducts from "views/ManageProducts.jsx";
import ManageOrders from "views/ManageOrders.jsx";
import OrderDetail from "views/OrderDetail.jsx";
import ManageCustomers from "views/Customer.jsx";
import DeXuatNhapHang from "./views/DeXuatNhapHang";
var routes = [
  {
    path: "/edit-product/:id",
    name: "Edit Product",
    rtlName: "لوحة القيادة",
    icon: "tim-icons icon-chart-pie-36",
    component: AddProduct,
    layout: "/admin"
  },
  {
    path: "/dashboard",
    name: "Xem thống kê",
    rtlName: "لوحة القيادة",
    icon: "tim-icons icon-chart-pie-36",
    component: Dashboard,
    layout: "/admin"
  },
  {
    path: "/orderdetail/:id",
    name: "Order Detail",
    rtlName: "لوحة القيادة",
    icon: "tim-icons icon-chart-pie-36",
    component: OrderDetail,
    layout: "/admin"
  },
  {
    path: "/manage-products",
    name: "Quản lý sản phẩm",
    rtlName: "لوحة القيادة",
    icon: "tim-icons icon-single-copy-04",
    component: ManageProducts,
    layout: "/admin"
  },
  {
    path: "/manage-orders",
    name: "Quản lý đơn hàng",
    rtlName: "لوحة القيادة",
    icon: "tim-icons icon-single-copy-04",
    component: ManageOrders,
    layout: "/admin"
  },
  {
    path: "/add-Product",
    name: "Add-Product",
    rtlName: "خرائط",
    icon: "tim-icons icon-pin",
    component: AddProduct,
    layout: "/admin"
  },
  {
    path: "/brands",
    name: "Quản lý thương hiệu",
    rtlName: "قائمة الجدول",
    icon: "tim-icons icon-puzzle-10",
    component: Brand,
    layout: "/admin"
  },
  {
    path: "/types",
    name: "Quản lý danh mục",
    rtlName: "قائمة الجدول",
    icon: "tim-icons icon-puzzle-10",
    component: Category,
    layout: "/admin"
  },
  {
    path: "/customers",
    name: "Quản lý người dùng",
    rtlName: "قائمة الجدول",
    icon: "tim-icons icon-puzzle-10",
    component: ManageCustomers,
    layout: "/admin"
  },
  {
    path: "/propose",
    name: "Đề xuất nhập hàng",
    rtlName: "قائمة الجدول",
    icon: "tim-icons icon-puzzle-10",
    component: DeXuatNhapHang,
    layout: "/admin"
  }
];
export default routes;
