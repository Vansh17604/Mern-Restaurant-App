import axios from "axios";
import { config } from "../../../utils/axiosConfig";

const base_url = import.meta.env.VITE_BASE_URL;

const createOrder = async (orderData) => {
  const response = await axios.post(`${base_url}/createorder`, orderData, config);
  return response.data;
};

const deleteOrder = async (id) => {
  const response = await axios.delete(`${base_url}/deleteorder/${id}`, config);
  return response.data;
};

const updateOrderDishes = async (id, dishesData) => {
  const response = await axios.put(`${base_url}/updateorders/${id}`,  dishesData, config);
  return response.data;
};

const fetchOrderbyWaiterId = async (id) => {
  const response = await axios.get(`${base_url}/getorderbywaiterid/${id}`, config);
  return response.data || [];
};

const fetchOrderbyOrderId = async (orderId) => {
  const response = await axios.get(`${base_url}/getorderbyorderid/${orderId}`, config);
  return response.data;
};
const fetchOrderByTableAndWaiter = async (tableId, waiterId) => {
  const response = await axios.get(`${base_url}/getordertableidwaiterid/${tableId}/${waiterId}`, config);
  return response.data;
};
const fetchAllOrders = async () => {
  const response = await axios.get(`${base_url}/getallorders`, config);
  return response.data;
};
const assignKitchen = async ({orderId,dishId,kitchenId}) => {
  const response = await axios.post(`${base_url}/assignkitchen`, {orderId,dishId,kitchenId}, config);
  return response.data;
};
const markOrderAsPrepared = async ({ orderId,dishId }) => {
  const response = await axios.post(`${base_url}/markprepared`, { orderId,dishId }, config);
  return response.data;
};
const markOrderAsServed = async(orderId)=>{
  const response = await axios.post(`${base_url}/markasserved`, {orderId}, config);
  return response.data;
}
const fetchAllOrdersForAdmin = async () => {
  const response = await axios.get(`${base_url}/getalltheorderadmin`, config);
  return response.data;
};

const orderService = {
  createOrder,
  deleteOrder,
  updateOrderDishes,
  fetchOrderbyWaiterId,
  fetchOrderbyOrderId,
  fetchOrderByTableAndWaiter,
  fetchAllOrders,
  assignKitchen,
  markOrderAsPrepared,
  markOrderAsServed,
  fetchAllOrdersForAdmin
};

export default orderService;
