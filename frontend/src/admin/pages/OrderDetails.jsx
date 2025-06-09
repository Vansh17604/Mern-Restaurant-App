import React, { useState, useEffect } from "react";
import { ClipboardList, Search, Calendar, DollarSign, User, ChefHat, Table, Clock, Package, CreditCard, FileText } from "lucide-react";
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
  const [paymentSubmitted, setPaymentSubmitted] = useState(false); // Track if payment was submitted
  
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

  return (
    <div className="mt-8 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
      <div className="mb-6">
        <div className="flex items-center space-x-3">
          <ClipboardList className="w-8 h-8 text-black dark:text-white" strokeWidth={1.5} />
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-1">
            {t('orderdetails.title') || 'Order Management'}
          </h1>
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          {t('orderdetails.description') || 'View and manage all restaurant orders'}
        </p>
      </div>
      
      {/* Filter and Search Controls */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        {/* Search Bar */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
            <Input
              type="text"
              placeholder={t('orderdetails.search_placeholder') || "Search by Order ID, Table, Waiter, Kitchen, or Status..."}
              className="pl-10 border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        {/* Status Filter */}
        <div className="sm:w-48">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Orders Table */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center py-16 bg-white dark:bg-gray-900">
            <img
              src={gif}
              alt="Loading..."
              className="h-16 w-16"
            />
            <span className="ml-3 text-gray-600 dark:text-gray-300">
              {t('orderdetails.loading') || 'Loading orders...'}
            </span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full bg-white dark:bg-gray-900">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {t('orderdetails.order_id') || 'Order ID'}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {t('orderdetails.table') || 'Table'}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {t('orderdetails.waiter') || 'Waiter'}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {t('orderdetails.kitchen') || 'Kitchen'}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {t('orderdetails.status') || 'Status'}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {t('orderdetails.total') || 'Total'}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {t('orderdetails.date') || 'Order Date'}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
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
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            #{order._id?.slice(-8) || 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Table className="w-4 h-4 text-gray-400 dark:text-gray-500 mr-2" />
                            <span className="text-sm text-gray-900 dark:text-gray-100">
                              {order.tableid?.tablenumber || 'N/A'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <User className="w-4 h-4 text-gray-400 dark:text-gray-500 mr-2" />
                            <span className="text-sm text-gray-900 dark:text-gray-100">
                              {order.waiterid?.name || 'N/A'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <ChefHat className="w-4 h-4 text-gray-400 dark:text-gray-500 mr-2" />
                            <span className="text-sm text-gray-900 dark:text-gray-100">
                              {order.kitchenid?.name || 'N/A'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusBadgeColor(order.orderstatus)}`}>
                            {order.orderstatus || 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {getCurrencySymbol(order.dishes?.[0]?.dish_id?.currency || 'USD')}
                            {calculateOrderTotal(order.dishes).toFixed(2)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <Calendar className="w-4 h-4 mr-1" />
                            {formatDate(order.orderdate)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            {order.orderstatus?.toLowerCase() === 'served' && createPayment && (
                              <>
                                {isPaymentComplete ? (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex items-center px-3 py-1 bg-blue-600 text-white border border-blue-600 hover:bg-blue-700 hover:border-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 transition-all duration-200 rounded-md text-xs"
                                    onClick={() => handleGenerateBill(order)}
                                    disabled={paymentLoading}
                                  >
                                    <FileText size={12} className="mr-1" />
                                    Generate Bill
                                  </Button>
                                ) : (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex items-center px-3 py-1 bg-green-600 text-white border border-green-600 hover:bg-green-700 hover:border-green-700 dark:bg-green-700 dark:hover:bg-green-600 transition-all duration-200 rounded-md text-xs"
                                    onClick={() => handlePayment(order)}
                                  >
                                    <CreditCard size={12} className="mr-1" />
                                    {t('orderdetails.payment') || 'Payment'}
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
                    <td colSpan="8" className="px-6 py-10 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-900">
                      <div className="flex flex-col items-center">
                        <ClipboardList className="w-10 h-10 text-gray-400 dark:text-gray-500 mb-2" strokeWidth={1.5} />
                        <p className="text-lg font-medium">
                          {t('orderdetails.no_orders') || 'No orders found'}
                        </p>
                        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                          {t('orderdetails.no_orders_description') || 'No orders match your current filters'}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {createPayment && (
        <CustomModal
          open={isPaymentModalOpen}
          hideModal={closePaymentModal}
          hideFooter={true}
          title={`${t('orderdetails.payment_details') || 'Payment Details'} - #${selectedOrder?._id?.slice(-8) || ''}`}
          size="md"
        >
          {selectedOrder && (
            <div className="bg-white dark:bg-gray-900">
              <form onSubmit={handlePaymentSubmit} className="space-y-6">
                {/* Success Message */}
                {paymentSuccess && (
                  <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20">
                    <AlertDescription className="text-green-800 dark:text-green-300 flex items-center justify-between">
                      <span>{t('orderdetails.payment_success') || "Payment processed successfully!"}</span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={closePaymentModal}
                        className="ml-4 bg-green-600 text-white border-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
                      >
                        Close
                      </Button>
                    </AlertDescription>
                  </Alert>
                )}

                {/* Error Message */}
                {paymentError && (
                  <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
                    <AlertDescription className="text-red-800 dark:text-red-300">
                      {t('orderdetails.payment_error') || "Payment processing failed. Please try again."}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Order Summary */}
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
                    <ClipboardList className="w-5 h-5 mr-2" />
                    {t('orderdetails.order_summary') || 'Order Summary'}
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">{t('orderdetails.table') || 'Table'}:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">{selectedOrder.tableid?.tablenumber || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">{t('orderdetails.waiter') || 'Waiter'}:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">{selectedOrder.waiterid?.name || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">{t('orderdetails.total_amount') || 'Total Amount'}:</span>
                      <span className="font-bold text-lg text-indigo-600 dark:text-indigo-400">
                        {getCurrencySymbol(selectedOrder.dishes?.[0]?.dish_id?.currency || 'USD')}
                        {calculateOrderTotal(selectedOrder.dishes).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

               
                {!paymentSuccess && (
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="customername" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('orderdetails.customer_name') || 'Customer Name'} *
                      </label>
                      <Input
                        type="text"
                        id="customername"
                        name="customername"
                        value={paymentForm.customername}
                        onChange={handlePaymentFormChange}
                        placeholder={t('orderdetails.enter_customer_name') || 'Enter customer name'}
                        required
                        className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400"
                        disabled={paymentLoading}
                      />
                    </div>

                    <div>
                      <label htmlFor="paymentmethod" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('orderdetails.payment_method') || 'Payment Method'} *
                      </label>
                      <select
                        id="paymentmethod"
                        name="paymentmethod"
                        value={paymentForm.paymentmethod}
                        onChange={handlePaymentFormChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        required
                        disabled={paymentLoading}
                      >
                        <option value="cash">{t('orderdetails.cash') || 'Cash'}</option>
                        <option value="card">{t('orderdetails.card') || 'Card'}</option>
                        <option value="upi">{t('orderdetails.upi') || 'UPI'}</option>
                        <option value="digital_wallet">{t('orderdetails.digital_wallet') || 'Digital Wallet'}</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('orderdetails.amount') || 'Amount'} *
                      </label>
                      <Input
                        type="number"
                        id="amount"
                        name="amount"
                        value={paymentForm.amount}
                        onChange={handlePaymentFormChange}
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        required
                        className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400"
                        disabled={paymentLoading}
                      />
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={closePaymentModal}
                    disabled={paymentLoading}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    {t('orderdetails.cancel') || 'Cancel'}
                  </Button>
                  {!paymentSuccess && (
                    <Button
                      type="submit"
                      disabled={paymentLoading || !paymentForm.customername}
                      className="bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-2"
                    >
                      {paymentLoading ? (
                        <>
                          <Clock className="w-4 h-4 mr-2 animate-spin" />
                          {t('orderdetails.processing') || 'Processing...'}
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-4 h-4 mr-2" />
                          {t('orderdetails.process_payment') || 'Process Payment'}
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </form>
            </div>
          )}
        </CustomModal>
      )}

      {/* Order Items Modal - Optional detailed view */}
      {selectedOrder && (
        <div className="hidden">
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mt-4">
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
              <Package className="w-5 h-5 mr-2" />
              {t('orderdetails.order_items') || 'Order Items'}
            </h4>
            <div className="space-y-2">
              {selectedOrder.dishes?.map((dishItem, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600 last:border-b-0">
                  <div>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {getDishDisplayName(dishItem.dish_id)}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 ml-2">
                      x{dishItem.quantity}
                    </span>
                  </div>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {getCurrencySymbol(dishItem.dish_id?.currency || 'USD')}
                    {((dishItem.dish_id?.price || 0) * (dishItem.quantity || 0)).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;