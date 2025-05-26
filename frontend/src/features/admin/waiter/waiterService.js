// waiterService.js

import axios from "axios";
import { config } from "../../../utils/axiosConfig";

const base_url = import.meta.env.VITE_BASE_URL;

// Register a Waiter
const registerWaiter = async (waiterData) => {
  const response = await axios.post(`${base_url}/waiter/register?type=profilewaiter`, waiterData, config);
  return response.data;
};

// Edit Waiter
const editWaiter = async (id, waiterData) => {
  const response = await axios.put(`${base_url}/waiter/update/${id}?type=profilewaiter`, waiterData, config);
  return response.data;
};

// Delete Waiter
const deleteWaiter = async (id) => {
  const response = await axios.delete(`${base_url}/waiter/delete/${id}`, config);
  return response.data;
};

// Get All Waiters
const fetchAllWaiters = async () => {
  const response = await axios.get(`${base_url}/getwaiter`, config);
  return response.data;
};

const waiterService = {
  registerWaiter,
  editWaiter,
  deleteWaiter,
  fetchAllWaiters
};

export default waiterService;
