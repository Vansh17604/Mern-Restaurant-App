import axios from "axios";
import { config } from "../../../utils/axiosConfig";

const base_url = import.meta.env.VITE_BASE_URL;
const lang=localStorage.getItem('language');

const getDashboardStats = async () => {
  const response = await axios.get(`${base_url}/getdashboard?lang=${lang}`, config);
  return response.data;
};

const getHourlyOrders = async () => {
  const response = await axios.get(`${base_url}/getdashboardbyhour`, config);
  return response.data;
};

const getWeeklySales = async () => {
  const response = await axios.get(`${base_url}/getweeklysales?lang=${lang}`, config);
  return response.data;
};

const getMenuPopularity = async () => {
  const response = await axios.get(`${base_url}/getmenudetail?lang=${lang}`, config);
  return response.data;
};

const getRecentOrders = async () => {
  const response = await axios.get(`${base_url}/getrecentorder`, config);
  return response.data;
};
const getAdnminFooter = async ()=>{
  const response = await axios.get(`${base_url}/adminfooter?lang=${lang}`, config);
  return response.data;
}
const getKitchenFooter = async () => {
  const response = await axios.get(`${base_url}/kitchenfooter?lang=${lang}`, config);
  return response.data;
};

const countService = {
  getKitchenFooter,
  getDashboardStats,
  getHourlyOrders,
  getWeeklySales,
  getMenuPopularity,
  getRecentOrders,
  getAdnminFooter
};

export default countService;