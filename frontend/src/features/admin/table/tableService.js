import axios from "axios";
import { config } from "../../../utils/axiosConfig";
const base_url = import.meta.env.VITE_BASE_URL;

// Create Table
const createTable = async (tableData) => {
  const response = await axios.post(`${base_url}/table`, tableData, config);
  return response.data;
};

// Update Table


// Delete Table
const deleteTable = async (id) => {
  const response = await axios.delete(`${base_url}/deletetable/${id}`, config);
  return response.data;
};

// Fetch All Tables
const fetchAllTables = async () => {
  const response = await axios.get(`${base_url}/gettable`, config);
  return response.data;
};

// Fetch Available Tables
const fetchAvailableTables = async () => {
  const response = await axios.get(`${base_url}/gettableavailable`, config);
  return response.data;
};

const tableService = {
  createTable,

  deleteTable,
  fetchAllTables,
  fetchAvailableTables
};

export default tableService;
