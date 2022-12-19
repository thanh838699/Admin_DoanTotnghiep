import * as Types from "../constants/types";
import axios from "axios";

export const reportMonths = (year) => {
  const request = axios.post("/api/payment/year",year).then(res => res.data);
  return {
    type: Types.GET_PRODUCTS,
    payload: request
  };
};
export const reportDate = data => {
  const request = axios
    .post("/api/payment/dateRange", data)
    .then(res => res.data);
  return {
    type: Types.REPORT_DATE,
    payload: request
  };
};
export const getOrders = () => {
  const request = axios.get("/api/payments/getall").then(res => res.data);
  return {
    type: Types.GET_ORDERS,
    payload: request
  };
};
export const updatePayment = (id, status, arrivaltime) => {
  const request = axios
    .post(`/api/payment/update/${id}`, status, arrivaltime)
    .then(res => res.data);
  return {
    type: Types.UPDATE_PAYMENT,
    payload: request
  };
};
export const reportProducts = data => {
  const request = axios
    .post("/api/payment/product", data)
    .then(res => res.data);
  return {
    type: Types.REPORT_PRODUCT,
    payload: request
  };
};
export const reportCustomer = data => {
  const request = axios
    .post("/api/payment/customer", data)
    .then(res => res.data);
  return {
    type: Types.REPORT_CUSTOMER,
    payload: request
  };
};
export const deleteOrder = id => {
  const request = axios.get(`/api/payment/delete/${id}`).then(res => res.data);
  return {
      type: Types.DELETE_PAYMENT,
      payload: id,
  };
};
