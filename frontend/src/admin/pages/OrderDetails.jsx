import React, { useState, useEffect } from "react";
import { ClipboardList, Search, Calendar, DollarSign, User, ChefHat, Table, Clock, Package, CreditCard, FileText, Eye, X } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { useDispatch, useSelector } from "react-redux";
import { CustomModal } from "../componets/Customes";
import gif from '/assets/Animation - 1747722366024.gif';
import { useTranslation } from "react-i18next";
import { 
  fetchAllOrdersForAdmin,
  resetOrderState
} from "../../features/waiter/order/orderSlice";
import {
  createPayment,
  resetPaymentState,
  fetchPaymentByOrderId,
  generateBill
} from "../../features/admin/payment/paymentSlice";

const OrderDetails = () => {
  const { t, i18n } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [orderPaymentStatus, setOrderPaymentStatus] = useState({});
  const [paymentSubmitted, setPaymentSubmitted] = useState(false);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'cards'
  
  // Payment form state
  const [paymentForm, setPaymentForm] = useState({
    customername: "",
    paymentmethod: "cash",
    amount: 0
  });
  
  const base_url = import.meta.env.VITE_BASE_URL;
  
  // Get current language from i18next
  const currentLanguage = i18n.language || 'en';
  
  const dispatch = useDispatch();
  const { orders, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.order
  );
  
  const { 
    isLoading: paymentLoading = false, 
    isSuccess: paymentSuccess = false, 
    isError: paymentError = false,
    singlePayment = null,
    bill = null
  } = useSelector((state) => state.payment || {});

  useEffect(() => {
    dispatch(fetchAllOrdersForAdmin());
    
    return () => {
      dispatch(resetOrderState());
      if (resetPaymentState) {
        dispatch(resetPaymentState());
      }
    };
  }, [dispatch]);

  // Check payment status for served orders
  useEffect(() => {
    if (orders && orders.length > 0) {
      orders.forEach(order => {
        if (order.orderstatus?.toLowerCase() === 'served') {
          dispatch(fetchPaymentByOrderId(order._id))
            .unwrap()
            .then((paymentData) => {
              setOrderPaymentStatus(prev => ({
                ...prev,
                [order._id]: paymentData?.paymentstatus || 'pending'
              }));
            })
            .catch(() => {
              setOrderPaymentStatus(prev => ({
                ...prev,
                [order._id]: 'pending'
              }));
            });
        }
      });
    }
  }, [orders, dispatch]);

  // Handle payment success - but don't auto-close modal
  useEffect(() => {
    if (paymentSuccess && paymentSubmitted) {
      // Reset form but keep modal open
      setPaymentForm({
        customername: "",
        paymentmethod: "cash",
        amount: 0
      });
      
      // Update order payment status immediately
      if (selectedOrder) {
        setOrderPaymentStatus(prev => ({
          ...prev,
          [selectedOrder._id]: 'complete'
        }));
      }
      
      // Refresh orders to get updated data
      dispatch(fetchAllOrdersForAdmin());
      
      // Reset payment submitted flag
      setPaymentSubmitted(false);
      
      // Reset payment state after a delay to show success message
      setTimeout(() => {
        if (resetPaymentState) {
          dispatch(resetPaymentState());
        }
      }, 3000);
    }
  }, [paymentSuccess, paymentSubmitted, dispatch, selectedOrder]);

  // Handle bill generation success
  useEffect(() => {
    if (bill) {
      const newWindow = window.open('', '_blank');
      if (newWindow) {
        newWindow.document.write(bill);
        newWindow.document.close();
      }
      if (resetPaymentState) {
        dispatch(resetPaymentState());
      }
    }
  }, [bill, dispatch]);

  // Detect screen size and auto-switch view mode
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setViewMode('cards');
      } else {
        setViewMode('table');
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800';
      case 'preparing':
        return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800';
      case 'ready':
        return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800';
      case 'served':
        return 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700';
    }
  };

  // Helper function to get dish display name
  const getDishDisplayName = (dish) => {
    if (!dish) return 'N/A';
    
    if (typeof dish.dishName === 'object') {
      if (currentLanguage === 'es') {
        return dish.dishName.es || dish.dishName.en || 'N/A';
      } else {
        return dish.dishName.en || dish.dishName.es || 'N/A';
      }
    }
    return dish.dishName || 'N/A';
  };

  // Calculate total price for an order
  const calculateOrderTotal = (dishes) => {
    if (!dishes || !Array.isArray(dishes)) return 0;
    
    return dishes.reduce((total, dishItem) => {
      const price = dishItem.dish_id?.price || 0;
      const quantity = dishItem.quantity || 0;
      return total + (price * quantity);
    }, 0);
  };

  // Get currency symbol
  const getCurrencySymbol = (currencyCode) => {
    const currencies = {
      USD: { symbol: '$', name: 'US Dollar' },
      EUR: { symbol: '€', name: 'Euro' },
      GBP: { symbol: '£', name: 'British Pound' },
      INR: { symbol: '₹', name: 'Indian Rupee' }
    };
    const currency = currencies[currencyCode];
    return currency ? currency.symbol : currencyCode;
  };

  // Filter orders based on search term and status
  const filteredOrders = orders?.filter(order => {
    const matchesSearch = 
      order._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.tableid?.tableNumber?.toString().includes(searchTerm.toLowerCase()) ||
      order.waiterid?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.kitchenid?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.orderstatus?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === "all" || order.orderstatus?.toLowerCase() === filterStatus.toLowerCase();

    return matchesSearch && matchesStatus;
  }) || [];

  const handlePayment = (order) => {
    setSelectedOrder(order);
    setPaymentForm({
      ...paymentForm,
      amount: calculateOrderTotal(order.dishes)
    });
    setIsPaymentModalOpen(true);
    // Reset payment states when opening modal
    if (resetPaymentState) {
      dispatch(resetPaymentState());
    }
    setPaymentSubmitted(false);
  };

  const handleGenerateBill = async (order) => {
    try {
      const paymentResponse = await dispatch(fetchPaymentByOrderId(order._id)).unwrap();
      if (paymentResponse && paymentResponse._id) {
        dispatch(generateBill(paymentResponse._id));
      } else {
        alert(t('orderdetails.no_payment_found') || 'No payment found for this order');
      }
    } catch (error) {
      console.error('Error generating bill:', error);
      alert(t('orderdetails.bill_generation_error') || 'Error generating bill. Please try again.');
    }
  };

  const closePaymentModal = () => {
    setIsPaymentModalOpen(false);
    setSelectedOrder(null);
    setPaymentForm({
      customername: "",
      paymentmethod: "cash",
      amount: 0
    });
    setPaymentSubmitted(false);
    // Reset payment state when closing modal
    if (resetPaymentState) {
      dispatch(resetPaymentState());
    }
  };

  const handlePaymentFormChange = (e) => {
    const { name, value } = e.target;
    setPaymentForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    if (!selectedOrder) return;

    const paymentData = {
      orderid: selectedOrder._id,
      customername: paymentForm.customername,
      paymentmethod: paymentForm.paymentmethod,
      paymentdate: new Date().toISOString(),
      amount: paymentForm.amount
    };

    // Set payment submitted flag
    setPaymentSubmitted(true);

    if (createPayment) {
      dispatch(createPayment(paymentData));
    } else {
      console.error('createPayment action is not available');
      alert(t('orderdetails.payment_not_available') || 'Payment functionality is not available');
      setPaymentSubmitted(false);
    }
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString() + ' ' + new Date(date).toLocaleTimeString();
  };

  // Status options for filter
  const statusOptions = [
    { value: 'all', label: t('orderdetails.all_status') || 'All Status' },
    { value: 'pending', label: t('orderdetails.pending') || 'Pending' },
    { value: 'preparing', label: t('orderdetails.preparing') || 'Preparing' },
    { value: 'ready', label: t('orderdetails.ready') || 'Ready' },
    { value: 'served', label: t('orderdetails.served') || 'Served' },
    { value: 'completed', label: t('orderdetails.completed') || 'Completed' },
    { value: 'cancelled', label: t('orderdetails.cancelled') || 'Cancelled' },
  ];

  // Mobile Card Component
  const OrderCard = ({ order }) => {
    const paymentStatus = orderPaymentStatus[order._id];
    const isPaymentComplete = paymentStatus?.toLowerCase() === 'complete';
    
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
              #{order._id?.slice(-8) || 'N/A'}
            </h3>
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border mt-1 ${getStatusBadgeColor(order.orderstatus)}`}>
              {order.orderstatus || 'N/A'}
            </span>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
              {getCurrencySymbol(order.dishes?.[0]?.dish_id?.currency || 'USD')}
              {calculateOrderTotal(order.dishes).toFixed(2)}
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <Table className="w-4 h-4 mr-2" />
              <span>Table</span>
            </div>
            <span className="text-gray-900 dark:text-gray-100 font-medium">
              {order.tableid?.tablenumber || 'N/A'}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <User className="w-4 h-4 mr-2" />
              <span>Waiter</span>
            </div>
            <span className="text-gray-900 dark:text-gray-100 font-medium">
              {order.waiterid?.name || 'N/A'}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <ChefHat className="w-4 h-4 mr-2" />
              <span>Kitchen</span>
            </div>
            <span className="text-gray-900 dark:text-gray-100 font-medium">
              {order.kitchenid?.name || 'N/A'}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <Calendar className="w-4 h-4 mr-2" />
              <span>Date</span>
            </div>
            <span className="text-gray-900 dark:text-gray-100 font-medium text-xs">
              {formatDate(order.orderdate)}
            </span>
          </div>
        </div>

        {/* Actions */}
        {order.orderstatus?.toLowerCase() === 'served' && createPayment && (
          <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
            {isPaymentComplete ? (
              <Button
                variant="outline"
                size="sm"
                className="w-full flex items-center justify-center px-3 py-2 bg-blue-600 text-white border border-blue-600 hover:bg-blue-700 hover:border-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 transition-all duration-200 rounded-md text-sm"
                onClick={() => handleGenerateBill(order)}
                disabled={paymentLoading}
              >
                <FileText size={16} className="mr-2" />
                Generate Bill
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="w-full flex items-center justify-center px-3 py-2 bg-green-600 text-white border border-green-600 hover:bg-green-700 hover:border-green-700 dark:bg-green-700 dark:hover:bg-green-600 transition-all duration-200 rounded-md text-sm"
                onClick={() => handlePayment(order)}
              >
                <CreditCard size={16} className="mr-2" />
                {t('orderdetails.payment') || 'Payment'}
              </Button>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="mt-4 sm:mt-8 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-3 sm:p-6">
      <div className="mb-4 sm:mb-6">
        <div className="flex items-center space-x-3">
          <ClipboardList className="w-6 h-6 sm:w-8 sm:h-8 text-black dark:text-white" strokeWidth={1.5} />
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-1">
            {t('orderdetails.title') || 'Order Management'}
          </h1>
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
          {t('orderdetails.description') || 'View and manage all restaurant orders'}
        </p>
      </div>
      
      {/* Filter and Search Controls */}
      <div className="mb-4 sm:mb-6 flex flex-col gap-3 sm:gap-4">
        {/* Search Bar */}
        <div className="w-full">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
            <Input
              type="text"
              placeholder={t('orderdetails.search_placeholder') || "Search orders..."}
              className="pl-10 text-sm border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        {/* Status Filter and View Toggle */}
        <div className="flex gap-2 sm:gap-4">
          <div className="flex-1">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          {/* View Mode Toggle - Hidden on mobile since auto-switching */}
          <div className="hidden sm:flex">
            <Button
              variant={viewMode === 'table' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('table')}
              className="px-3 py-2 text-sm"
            >
              Table
            </Button>
            <Button
              variant={viewMode === 'cards' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('cards')}
              className="px-3 py-2 text-sm ml-1"
            >
              Cards
            </Button>
          </div>
        </div>
      </div>
      
      {/* Orders Display */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center py-12 sm:py-16 bg-white dark:bg-gray-900">
            <img
              src={gif}
              alt="Loading..."
              className="h-12 w-12 sm:h-16 sm:w-16"
            />
            <span className="ml-3 text-gray-600 dark:text-gray-300 text-sm">
              {t('orderdetails.loading') || 'Loading orders...'}
            </span>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            {viewMode === 'table' && (
              <div className="overflow-x-auto">
                <table className="w-full bg-white dark:bg-gray-900 min-w-[800px]">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                      <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        {t('orderdetails.order_id') || 'Order ID'}
                      </th>
                      <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        {t('orderdetails.table') || 'Table'}
                      </th>
                      <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        {t('orderdetails.waiter') || 'Waiter'}
                      </th>
                      <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        {t('orderdetails.kitchen') || 'Kitchen'}
                      </th>
                      <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        {t('orderdetails.status') || 'Status'}
                      </th>
                      <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        {t('orderdetails.total') || 'Total'}
                      </th>
                      <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        {t('orderdetails.date') || 'Order Date'}
                      </th>
                      <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        {t('orderdetails.actions') || 'Actions'}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredOrders.length > 0 ? (
                      filteredOrders.map((order) => {
                        const paymentStatus = orderPaymentStatus[order._id];
                        const isPaymentComplete = paymentStatus?.toLowerCase() === 'complete';
                        
                        return (
                          <tr key={order._id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                            <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                #{order._id?.slice(-8) || 'N/A'}
                              </div>
                            </td>
                            <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <Table className="w-4 h-4 text-gray-400 dark:text-gray-500 mr-2" />
                                <span className="text-sm text-gray-900 dark:text-gray-100">
                                  {order.tableid?.tablenumber || 'N/A'}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <User className="w-4 h-4 text-gray-400 dark:text-gray-500 mr-2" />
                                <span className="text-sm text-gray-900 dark:text-gray-100">
                                  {order.waiterid?.name || 'N/A'}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <ChefHat className="w-4 h-4 text-gray-400 dark:text-gray-500 mr-2" />
                                <span className="text-sm text-gray-900 dark:text-gray-100">
                                  {order.kitchenid?.name || 'N/A'}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusBadgeColor(order.orderstatus)}`}>
                                {order.orderstatus || 'N/A'}
                              </span>
                            </td>
                            <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                {getCurrencySymbol(order.dishes?.[0]?.dish_id?.currency || 'USD')}
                                {calculateOrderTotal(order.dishes).toFixed(2)}
                              </div>
                            </td>
                            <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                <Calendar className="w-4 h-4 mr-1" />
                                <span className="hidden lg:inline">
                                  {formatDate(order.orderdate)}
                                </span>
                                <span className="lg:hidden">
                                  {new Date(order.orderdate).toLocaleDateString()}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                              <div className="flex items-center space-x-2">
                                {order.orderstatus?.toLowerCase() === 'served' && createPayment && (
                                  <>
                                    {isPaymentComplete ? (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex items-center px-2 sm:px-3 py-1 bg-blue-600 text-white border border-blue-600 hover:bg-blue-700 hover:border-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 transition-all duration-200 rounded-md text-xs"
                                        onClick={() => handleGenerateBill(order)}
                                        disabled={paymentLoading}
                                      >
                                        <FileText size={12} className="mr-1" />
                                        <span className="hidden sm:inline">Generate Bill</span>
                                        <span className="sm:hidden">Bill</span>
                                      </Button>
                                    ) : (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex items-center px-2 sm:px-3 py-1 bg-green-600 text-white border border-green-600 hover:bg-green-700 hover:border-green-700 dark:bg-green-700 dark:hover:bg-green-600 transition-all duration-200 rounded-md text-xs"
                                        onClick={() => handlePayment(order)}
                                      >
                                        <CreditCard size={12} className="mr-1" />
                                        <span className="hidden sm:inline">{t('orderdetails.payment') || 'Payment'}</span>
                                        <span className="sm:hidden">Pay</span>
                                      </Button>
                                    )}
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        )
                      })
                    ) : (
                      <tr>
                        <td colSpan="8" className="px-4 sm:px-6 py-8 sm:py-10 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900">
                          <div className="flex flex-col items-center">
                            <ClipboardList className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400 dark:text-gray-500 mb-3" />
                            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
                              {t('orderdetails.no_orders') || 'No orders found'}
                            </p>
                            <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-500 mt-1">
                              {t('orderdetails.adjust_filters') || 'Try adjusting your filters or search terms'}
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Mobile Cards View */}
            {viewMode === 'cards' && (
              <div className="p-4 space-y-4">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <OrderCard key={order._id} order={order} />
                  ))
                ) : (
                  <div className="text-center py-8">
                    <ClipboardList className="w-10 h-10 text-gray-400 dark:text-gray-500 mb-3 mx-auto" />
                    <p className="text-base text-gray-500 dark:text-gray-400">
                      {t('orderdetails.no_orders') || 'No orders found'}
                    </p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                      {t('orderdetails.adjust_filters') || 'Try adjusting your filters or search terms'}
                    </p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Payment Modal */}
      <CustomModal
        isOpen={isPaymentModalOpen}
        onClose={closePaymentModal}
        title={
          <div className="flex items-center">
            <CreditCard className="w-5 h-5 mr-2" />
            {t('orderdetails.payment_modal_title') || 'Process Payment'}
          </div>
        }
        size="md"
      >
        <div className="p-6">
          {paymentSuccess && paymentSubmitted && (
            <Alert className="mb-4 bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800">
              <AlertDescription className="text-green-800 dark:text-green-300">
                {t('orderdetails.payment_success') || 'Payment processed successfully!'}
              </AlertDescription>
            </Alert>
          )}

          {paymentError && (
            <Alert className="mb-4 bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800">
              <AlertDescription className="text-red-800 dark:text-red-300">
                {message || t('orderdetails.payment_error') || 'Error processing payment. Please try again.'}
              </AlertDescription>
            </Alert>
          )}

          {selectedOrder && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {t('orderdetails.order_summary') || 'Order Summary'}
              </h3>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {t('orderdetails.order_id') || 'Order ID'}:
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    #{selectedOrder._id?.slice(-8)}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {t('orderdetails.table') || 'Table'}:
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {selectedOrder.tableid?.tablenumber}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {t('orderdetails.total_amount') || 'Total Amount'}:
                  </span>
                  <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    {getCurrencySymbol(selectedOrder.dishes?.[0]?.dish_id?.currency || 'USD')}
                    {calculateOrderTotal(selectedOrder.dishes).toFixed(2)}
                  </span>
                </div>

                {/* Dishes List */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                    {t('orderdetails.items') || 'Items'}:
                  </h4>
                  <div className="space-y-1">
                    {selectedOrder.dishes?.map((dishItem, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">
                          {getDishDisplayName(dishItem.dish_id)} × {dishItem.quantity}
                        </span>
                        <span className="text-gray-900 dark:text-gray-100">
                          {getCurrencySymbol(dishItem.dish_id?.currency || 'USD')}
                          {((dishItem.dish_id?.price || 0) * (dishItem.quantity || 0)).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handlePaymentSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('orderdetails.customer_name') || 'Customer Name'}
              </label>
              <Input
                type="text"
                name="customername"
                value={paymentForm.customername}
                onChange={handlePaymentFormChange}
                placeholder={t('orderdetails.enter_customer_name') || 'Enter customer name'}
                className="w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('orderdetails.payment_method') || 'Payment Method'}
              </label>
              <select
                name="paymentmethod"
                value={paymentForm.paymentmethod}
                onChange={handlePaymentFormChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                required
              >
                <option value="cash">{t('orderdetails.cash') || 'Cash'}</option>
                <option value="card">{t('orderdetails.card') || 'Card'}</option>
                <option value="upi">{t('orderdetails.upi') || 'UPI'}</option>
                <option value="other">{t('orderdetails.other') || 'Other'}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('orderdetails.amount') || 'Amount'}
              </label>
              <Input
                type="number"
                name="amount"
                value={paymentForm.amount}
                onChange={handlePaymentFormChange}
                placeholder="0.00"
                className="w-full"
                step="0.01"
                min="0"
                required
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={closePaymentModal}
                className="px-4 py-2"
                disabled={paymentLoading}
              >
                {t('orderdetails.cancel') || 'Cancel'}
              </Button>
              <Button
                type="submit"
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white"
                disabled={paymentLoading || paymentSubmitted}
              >
                {paymentLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {t('orderdetails.processing') || 'Processing...'}
                  </div>
                ) : (
                  t('orderdetails.process_payment') || 'Process Payment'
                )}
              </Button>
            </div>
          </form>
        </div>
      </CustomModal>

      {/* Error Alert */}
      {isError && (
        <Alert className="mt-4 bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800">
          <AlertDescription className="text-red-800 dark:text-red-300">
            {message || t('orderdetails.error') || 'An error occurred while loading orders.'}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default OrderDetails;