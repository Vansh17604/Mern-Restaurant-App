import axios from "axios";
import { config } from "../../utils/axiosConfig";
const base_url = import.meta.env.VITE_BASE_URL;

const validateToken = async () => {
  const response = await axios.post(`${base_url}/validate-token`, {}, config);
  return response.data;
};

const Login = async (user) => {
  const response = await axios.post(`${base_url}/login`, user, config);
  return response.data;
};

const Logout = async () => {
  try {
    const response = await axios.post(`${base_url}/logout`, {}, config);
    return response.data;
  } catch (error) {
    console.error("Logout failed:", error);
    throw error;
  }
};

const authService = {
  Login,
  Logout,
  validateToken,
};

export default authService;