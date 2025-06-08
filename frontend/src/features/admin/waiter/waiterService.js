import axios from "axios";
import { config } from "../../../utils/axiosConfig";

const base_url = import.meta.env.VITE_BASE_URL;
const registerWaiter = async (waiterData) => {
  const response = await axios.post(`${base_url}/waiter/register?type=profilewaiter`, waiterData, config);
  return response.data;
};

const editWaiter = async (id, waiterData) => {
  const response = await axios.put(`${base_url}/waiter/update/${id}?type=profilewaiter`, waiterData, config);
  return response.data;
};

const deleteWaiter = async (id) => {
  const response = await axios.delete(`${base_url}/waiter/delete/${id}`, config);
  return response.data;
};

const fetchAllWaiters = async () => {
  const response = await axios.get(`${base_url}/getwaiter`, config);
  return response.data;
};
const changeWaiterPassword = async (id, passwordData) => {
  const response = await axios.post(`${base_url}/waiter/changepassword/${id}`, passwordData, config);
  return response.data;
};

// Update Waiter Profile
const updateWaiterProfile = async (id, profileData) => {
  const response = await axios.put(`${base_url}/updatewaiter/${id}?type=profilewaiter`, profileData, config);
  return response.data;
};

// Fetch Waiter Profile (Details)
const fetchWaiterProfile = async (id) => {
  const response = await axios.get(`${base_url}/getwaiterprofile/${id}`, config);
  return response.data;
};

// Fetch Waiter Header (Name + Photo)
const fetchWaiterHeader = async (id) => {
  const response = await axios.get(`${base_url}/waiterheader/${id}`, config);
  return response.data;
};

const waiterService = {
  registerWaiter,
  editWaiter,
  deleteWaiter,
  fetchAllWaiters,
  changeWaiterPassword,
  updateWaiterProfile,
  fetchWaiterProfile,
  fetchWaiterHeader
  
};

export default waiterService;
