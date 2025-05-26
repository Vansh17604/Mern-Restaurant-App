import axios from "axios";
import { config } from "../../../utils/axiosConfig";
const base_url = import.meta.env.VITE_BASE_URL;


const createCategory = async(categoryData)=>{
    const response= await axios.post(`${base_url}/category`,categoryData,config);
    return response.data

}

const fetchCategories= async()=>{
    const response = await axios.get(`${base_url}/getcategory`,config);
    return response.data
}
const fetchactiveCategory= async()=>{
    const response = await axios.get(`${base_url}/getactivecategory`,config);
    return response.data
}

const EditCategory= async(id,categoryData)=>{
    const response =await axios.put(`${base_url}/updatecategory/${id}`,categoryData,config);
    return response.data
}

const DeleteCategory = async(id)=>{
    const response= await axios.delete(`${base_url}/deletecategory/${id}`,config);
    return response.data
}

const EditCategoryStatus= async(id,categoryData)=>{
    const response=await axios.put(`${base_url}/updatecategorystatus/${id}`,categoryData,config);
    return response.data
}

const categoeyService = {
    createCategory,
    fetchCategories,
    fetchactiveCategory,
    EditCategory,
    DeleteCategory,
    EditCategoryStatus
}

export default categoeyService;