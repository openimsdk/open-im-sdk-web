import axios from "axios";

const instance = axios.create({
  baseURL: "https://server/10002",
  timeout: 3000,
});
export default instance;
