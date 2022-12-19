import * as Types from "../constants/types";
import axios from "axios";
export const loginAdmin = dataToSubmit => {
  const request = axios
    .post("/api/client/login", dataToSubmit)
    .then(res => res.data);
  return {
    type: Types.LOGIN,
    payload: request
  };
};
export const auth = () => {
  const request = axios.get("/api/client/authAdmin").then(res => res.data);
  return {
    type: Types.AUTH_USER,
    payload: request
  };
};
export const logout = () => {
  const request = axios.get("/api/client/logout").then(res => res.data);
  return {
    type: Types.LOGOUT,
    payload: request
  };
};
