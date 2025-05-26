const express= require('express');
const AdminController= require('../controllers/admin');
const AuthController= require('../controllers/auth');
const KitchenController=require('../controllers/kitchen');
const WaiterController = require('../controllers/waiter');
const CategoryController=require('../controllers/category');
const SubCategoryController=require("../controllers/subcategory");
const TableController=require("../controllers/table");
const DishController=require("../controllers/dish");
const {verifyTokenAndAuthorize}= require('../middleware/auth');
const upload= require('../middleware/upload');


const router = express.Router();

router.post("/admin/register",AdminController.RegisterAdmin);
router.post("/kitchen/register",KitchenController.RegisterKitchen);
router.post("/waiter/register",upload.single("photo"),WaiterController.RegisterWaiter);
router.put("/waiter/update/:id",upload.single("photo"),WaiterController.EditWaiter);
router.delete("/waiter/delete/:id",WaiterController.DeleteWaiter);
router.get("/getwaiter",WaiterController.GetAllWaiters);
router.post("/login",AuthController.Login);
router.post("/validate-token",verifyTokenAndAuthorize('Admin','Kitchen','Waiter'),AuthController.validateToken);
router.post("/logout",AuthController.Logout);
router.post("/category",CategoryController.CreateCategory);
router.put("/updatecategory/:id",CategoryController.UpdateCategory);
router.put("/updatecategorystatus/:id",CategoryController.UpdateCategoryStatus);
router.get("/getcategory",CategoryController.FetchCategory);
router.get("/getactivecategory",CategoryController.FetchCategorywithActivestatus);
router.delete("/deletecategory/:id",CategoryController.DeleteCategory);
router.post("/subcategory",SubCategoryController.CreateSubcategory);
router.put("/updatesubcategory/:id",SubCategoryController.EditSubCategory);
router.put("/updatesubcategorystatus/:id",SubCategoryController.EditSubCategoryWithStatus);
router.get("/getsubcategory",SubCategoryController.FetchSubcategory);
router.delete("/deletesubcategory/:id",SubCategoryController.DeleteSubCategory);
router.get("/getActivesubcategory",SubCategoryController.FetchSubcategorywithsatusactive);

router.post("/dish",upload.single("imageUrl"),DishController.CreateDish);
router.put("/updatedish/:id",upload.single("imageUrl"),DishController.EditDish);
router.delete("/deletedish/:id",DishController.DeleteDish);
router.get("/getdish",DishController.FetchDishes);
router.get("/getactiveDishes",DishController.FetchActiveDishes);
router.put("/updateprice-all/price-currency", DishController.EditCurrencyAndConvertPrices);

router.post("/table",TableController.createTable);

router.delete("/deletetable/:id",TableController.Deletetable);
router.get("/gettable",TableController.getAllTables);
router.get("/getactivetable",TableController.gettableAvlible);


module.exports = router;