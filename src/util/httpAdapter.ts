import { acceptFriendApplicationParams } from "../im/params";
//http.js
import axios from "axios";
import mpAdapter from "axios-miniprogram-adapter";

const instance = axios.create({
  adapter: mpAdapter,
  timeout: 4000,
});
export { instance };
