import axios from "axios";
import { config } from "../../../utils/axiosConfig"; // Adjust path if needed

const base_url = import.meta.env.VITE_BASE_URL;

// Fetch admin details by ID
const fetchAdminDetails = async (id) => {
  const response = await axios.get(`${base_url}/getadmindetails/${id}`, config);
  return response.data;
};

// Change password
const changePassword = async (passwordData) => {
  const response = await axios.post(`${base_url}/admin/change-password`, passwordData, config);
  return response.data;
};

// Update admin profile
const updateAdminProfile = async (id,profileData) => {
  const response = await axios.put(`${base_url}/admin/update-profile/${id}`, profileData, config);
  return response.data;
};

const adminService = {
  fetchAdminDetails,
  changePassword,
  updateAdminProfile,
};

export default adminService;
