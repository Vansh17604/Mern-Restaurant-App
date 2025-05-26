import { configureStore } from "@reduxjs/toolkit"; 
import authReducer from "../features/auth/authSlice";
import categoryReducer from "../features/admin/category/categorySlice"
import subcategoryReducer from "../features/admin/subcategory/subcategorySlice";
import dishReducer from "../features/admin/dish/dishSlice";
import tableReducer from "../features/admin/table/tableSlice";
import waiterReducer from "../features/admin/waiter/waiterSlice"; 


export const store= configureStore({
    reducer:{
    auth: authReducer,
    category: categoryReducer,
    subcategory: subcategoryReducer,
    dish: dishReducer,
    table: tableReducer,
    waiter: waiterReducer, // Assuming you have a waiterSlice.js


    }
})

 