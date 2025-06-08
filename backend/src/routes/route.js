const express= require('express');
const AdminController= require('../controllers/admin');
const AuthController= require('../controllers/auth');
const KitchenController=require('../controllers/kitchen');
const WaiterController = require('../controllers/waiter');
const CategoryController=require('../controllers/category');
const SubCategoryController=require("../controllers/subcategory");
const TableController=require("../controllers/table");
const DishController=require("../controllers/dish");
const OrderController = require('../controllers/order');
const PaymentController = require('../controllers/payment');
const CountController = require('../controllers/count');
const {verifyTokenAndAuthorize}= require('../middleware/auth');
const upload= require('../middleware/upload');


const router = express.Router();

router.post("/admin/register",AdminController.RegisterAdmin);

router.put("/admin/update-profile/:id",verifyTokenAndAuthorize('Admin'),AdminController.UpdateAdminProfile);
router.post("/admin/change-password",verifyTokenAndAuthorize('Admin'), AdminController.ChangePassword);
router.get("/getadmindetails/:id",verifyTokenAndAuthorize('Admin'),AdminController.fetchAdmindetails);
router.post("/kitchen/register",verifyTokenAndAuthorize('Admin'),upload.single("photo"),KitchenController.RegisterKitchen);
router.put("/kitchen/update/:id",verifyTokenAndAuthorize('Admin'),upload.single("photo"),KitchenController.EditKitchen);
router.delete("/kitchen/delete/:id",verifyTokenAndAuthorize('Admin'),KitchenController.DeleteKitchen);
router.get("/getkitchen",verifyTokenAndAuthorize('Admin'),KitchenController.GetAllKitchens);
router.post("/waiter/register",verifyTokenAndAuthorize('Admin'),upload.single("photo"),WaiterController.RegisterWaiter);
router.put("/waiter/update/:id",verifyTokenAndAuthorize('Admin'),upload.single("photo"),WaiterController.EditWaiter);
router.delete("/waiter/delete/:id",verifyTokenAndAuthorize('Admin'),WaiterController.DeleteWaiter);
router.get("/getwaiter",verifyTokenAndAuthorize('Admin'),WaiterController.GetAllWaiters);
router.post("/login",AuthController.Login);
router.post("/validate-token",verifyTokenAndAuthorize('Admin','Kitchen','Waiter'),AuthController.validateToken);
router.post("/logout",AuthController.Logout);

router.post("/category",verifyTokenAndAuthorize('Admin'),CategoryController.CreateCategory);
router.put("/updatecategory/:id",verifyTokenAndAuthorize('Admin'),CategoryController.UpdateCategory);
router.put("/updatecategorystatus/:id",verifyTokenAndAuthorize('Admin'),CategoryController.UpdateCategoryStatus);
router.get("/getcategory",verifyTokenAndAuthorize('Admin'),CategoryController.FetchCategory);
router.get("/getactivecategory",verifyTokenAndAuthorize('Admin'),CategoryController.FetchCategorywithActivestatus);
router.delete("/deletecategory/:id",verifyTokenAndAuthorize('Admin'),CategoryController.DeleteCategory);
router.post("/subcategory",verifyTokenAndAuthorize('Admin'),SubCategoryController.CreateSubcategory);
router.put("/updatesubcategory/:id",verifyTokenAndAuthorize('Admin'),SubCategoryController.EditSubCategory);
router.put("/updatesubcategorystatus/:id",verifyTokenAndAuthorize('Admin'),SubCategoryController.EditSubCategoryWithStatus);
router.get("/getsubcategory",verifyTokenAndAuthorize('Admin'),SubCategoryController.FetchSubcategory);
router.delete("/deletesubcategory/:id",verifyTokenAndAuthorize('Admin'),SubCategoryController.DeleteSubCategory);
router.get("/getActivesubcategory",verifyTokenAndAuthorize('Admin'),SubCategoryController.FetchSubcategorywithsatusactive);

router.post("/dish",verifyTokenAndAuthorize('Admin'),upload.single("imageUrl"),DishController.CreateDish);
router.put("/updatedish/:id",verifyTokenAndAuthorize('Admin'),upload.single("imageUrl"),DishController.EditDish);
router.delete("/deletedish/:id",verifyTokenAndAuthorize('Admin'),DishController.DeleteDish);
router.get("/getdish",verifyTokenAndAuthorize('Admin'),DishController.FetchDishes);
router.get("/getactiveDishes",verifyTokenAndAuthorize('Waiter'),DishController.FetchActiveDishes);
router.put("/updateprice-all/price-currency",verifyTokenAndAuthorize('Admin'), DishController.EditCurrencyAndConvertPrices);
router.get("/getalltheorderadmin",OrderController.FetchAllOrderForAdmin);

router.post("/table",verifyTokenAndAuthorize('Admin'),TableController.createTable);
router.put("/updatetable/:id",verifyTokenAndAuthorize('Admin'),TableController.Edittable);
router.delete("/deletetable/:id",verifyTokenAndAuthorize('Admin'),TableController.Deletetable);
router.get("/gettable",TableController.getAllTables);
router.get("/getactivetable",TableController.gettableAvlible);
router.post("/assignwaiter/:id",TableController.AssignWaiter);
router.post("/unassignwaiter/:id",TableController.UnassignWaiter);

router.post("/createorder",OrderController.CreateOrder);
router.delete("/deleteorder/:id",OrderController.DeleteOrder);
router.put("/updateorders/:id",OrderController.EditOrder);
router.get("/getorderbywaiterid/:id",OrderController.FetchOrderByWaiterId);
router.get("/getorderbyorderid/:id",OrderController.FetchOrderbyOrderId);
router.get('/getallorders', OrderController.FetchallTheOrder);
router.post('/assignkitchen', OrderController.AssignKitchen);
router.post('/markprepared', OrderController.MarkDishPrepared);
router.post('/markasserved',OrderController.MarkAsServed);
router.get("/getordertableidwaiterid/:tableId/:id",OrderController.FetchOrderbyWaiterIdandTableId);
router.get("/generatebill",PaymentController.GenerateBill);

router.post("/createpayment",PaymentController.CreatePayment);
router.get("/getpayment",PaymentController.FetchAllPayments);
router.get("/getpaymentbyorder", PaymentController.FetchPaymentByOrderId);


router.get('/getdashboard',CountController.getDashboardStats);
router.get('/getdashboardbyhour',CountController.getHourlyOrders);
router.get('/getweeklysales',CountController.getWeeklySalesData);
router.get('/getmenudetail',CountController.getMenuPopularity);
router.get('/getrecentorder',CountController.getRecentOrders);

router.post("/waiter/changepassword/:id",WaiterController.ChangeWaiterPassword);
router.get("/getwaiterprofile/:id",WaiterController.FetchWaiterDetails);
router.put("/updatewaiter/:id",upload.single('photo'),WaiterController.UpdateWaiterProfile);
router.get("/waiterheader/:id",WaiterController.FetchNameandPhoto);

router.post("/kitchen/changepassword/:id",KitchenController.ChangeKitchenPassword);
router.get("/getkitchenprofile/:id",KitchenController.FetchKitchenDetails);
router.put("/updatekitchen/:id",upload.single("photo"),KitchenController.UpdateKitchenProfile);
router.get("/kitchenheader/:id",KitchenController.FetchNameandPhoto);


module.exports = router;