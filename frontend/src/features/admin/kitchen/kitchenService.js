import axios from "axios";
import { config } from "../../../utils/axiosConfig";

const base_url = import.meta.env.VITE_BASE_URL;

const registerKitchen = async (kitchenData) => {
  const response = await axios.post(`${base_url}/kitchen/register?type=profilekitchen`, kitchenData, config);
  return response.data;
};

const editKitchen = async (id, kitchenData) => {
  const response = await axios.put(`${base_url}/kitchen/update/${id}?type=profilekitchen`, kitchenData, config);
  return response.data;
};

const deleteKitchen = async (id) => {
  const response = await axios.delete(`${base_url}/kitchen/delete/${id}`, config);
  return response.data;
};

const fetchAllKitchens = async () => {
  const response = await axios.get(`${base_url}/getkitchen`, config);
  return response.data;
};
const changeKitchenPassword = async (id, passwordData) => {
  const response = await axios.post(`${base_url}/kitchen/changepassword/${id}`, passwordData, config);
  return response.data;
};

const updateKitchenProfile = async (id, profileData) => {
  const response = await axios.put(`${base_url}/updatekitchen/${id}?type=profilekitchen`, profileData, config);
  return response.data;
};

const fetchKitchenProfile = async (id) => {
  const response = await axios.get(`${base_url}/getkitchenprofile/${id}`, config);
  return response.data;
};
const fetchKitchenHeader = async (id) => {
  const response = await axios.get(`${base_url}/kitchenheader/${id}`, config);
  return response.data;
};



const kitchenService = {
  registerKitchen,
  fetchKitchenHeader,
  editKitchen,
  deleteKitchen,
  fetchAllKitchens,
  changeKitchenPassword,
  updateKitchenProfile,
  fetchKitchenProfile
 
};

export default kitchenService;
