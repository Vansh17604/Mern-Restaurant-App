import axios from "axios";
import { config } from "../../../utils/axiosConfig";

const base_url = import.meta.env.VITE_BASE_URL;

// Create Dish
const createDish = async (dishData) => {
  const response = await axios.post(`${base_url}/dish?type=dishes`, dishData, config);
  return response.data;
};

// Fetch All Dishes
const fetchDishes = async () => {
  const response = await axios.get(`${base_url}/getdish`, config);
  return response.data;
};

// Fetch Only Active Dishes (based on category and subcategory status)
const fetchActiveDishes = async () => {
  const response = await axios.get(`${base_url}/getactiveDishes`, config);
  return response.data;
};

// Edit Dish
const editDish = async (id, dishData) => {
  const response = await axios.put(`${base_url}/updatedish/${id}?type=dishes`, dishData, config);
  return response.data;
};

// Delete Dish
const deleteDish = async (id) => {
  const response = await axios.delete(`${base_url}/deletedish/${id}`, config);
  return response.data;
};
const updateDishPriceAndCurrency = async (priceCurrencyData) => {
  const response = await axios.put(`${base_url}/updateprice-all/price-currency`, priceCurrencyData, config);
  return response.data;
};

const dishService = {
  createDish,
  fetchDishes,
  fetchActiveDishes,
  editDish,
  deleteDish,
  updateDishPriceAndCurrency
};

export default dishService;
