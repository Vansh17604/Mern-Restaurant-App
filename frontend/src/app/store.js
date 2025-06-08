import { configureStore } from "@reduxjs/toolkit"; 
import authReducer from "../features/auth/authSlice";
import categoryReducer from "../features/admin/category/categorySlice"
import subcategoryReducer from "../features/admin/subcategory/subcategorySlice";
import dishReducer from "../features/admin/dish/dishSlice";
import tableReducer from "../features/admin/table/tableSlice";
import waiterReducer from "../features/admin/waiter/waiterSlice"; 
import kitchenReducer from "../features/admin/kitchen/kitchenSlice"; 
import orderReducer from "../features/waiter/order/orderSlice";
import adminReducer from '../features/admin/admin/adminSlice';
import countReducer from '../features/admin/count/countSlice';



export const store= configureStore({
    reducer:{
    auth: authReducer,
    category: categoryReducer,
    subcategory: subcategoryReducer,
    dish: dishReducer,
    table: tableReducer,
    waiter: waiterReducer,
    kitchen: kitchenReducer, 
    order: orderReducer,
    admin: adminReducer,
    count: countReducer


    }
})

 