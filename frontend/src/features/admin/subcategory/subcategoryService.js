import axios from "axios";
import { config } from "../../../utils/axiosConfig";
const base_url = import.meta.env.VITE_BASE_URL;


const createSubcategory= async(subcategoryData)=>{
    
        const response = await axios.post(`${base_url}/subcategory`, subcategoryData,config);
        return response.data
}

const updateSubcategory= async(id,subcategoryData)=>{
    const response = await axios.put(`${base_url}/updatesubcategory/${id}`,subcategoryData,config);
    return response.data
}
const updateSubcategoryStatus= async(id,subcategoryData)=>{
    const response = await axios.put(`${base_url}/updatesubcategorystatus/${id}`,subcategoryData,config);
        return response.data
}

const deleteSubcategory= async(id)=>{
    const response = await axios.delete(`${base_url}/deletesubcategory/${id}`,config);
    return response.data
}

const fetchSubcategory=async()=>{
    const response = await axios.get(`${base_url}/getsubcategory`,config);
    return response.data
}

const fetchActiveSubcategory= async()=>{
    const response = await axios.get(`${base_url}/getActivesubcategory`,config);
    return response.data
}


const subcategoryService = {
    createSubcategory,
    updateSubcategory,
    updateSubcategoryStatus,
    fetchActiveSubcategory,
    deleteSubcategory,
    fetchSubcategory


}

export default subcategoryService