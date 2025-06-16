import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Search, Plus, Minus, X, ChefHat, ShoppingCart, Receipt, Star, Utensils, CheckCircle, Loader2, ImageIcon } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { ScrollArea } from '../../components/ui/scroll-area';
import { fetchActiveDishes } from '../../features/admin/dish/dishSlice';
import { createOrder, updateOrderDishes, resetOrderState } from '../../features/waiter/order/orderSlice';

const base_url = import.meta.env.VITE_BASE_URL;

const TakeOrderModal = ({ 
  open, 
  onClose, 
  tableId, 
  darkMode, 
  waiterId, 
  existingOrder = null, 
  mode = 'create' 
}) => {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const { dishes, isLoading: dishesLoading } = useSelector(state => state.dish);
  const { isLoading: orderLoading, isSuccess, isError, message } = useSelector(state => state.order);
  
  // State management
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [orderItems, setOrderItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dishesInitialized, setDishesInitialized] = useState(false);
  const [hasHandledSuccess, setHasHandledSuccess] = useState(false);
  const [imageErrors, setImageErrors] = useState(new Set());
  
  // Refs to track component state
  const isMountedRef = useRef(true);
  const successHandledRef = useRef(false);
  const orderSubmittedRef = useRef(false);
  const fetchAttemptedRef = useRef(false); // Add this to track fetch attempts
  
  const currentLanguage = i18n.language || 'en';
  const isEditMode = mode === 'edit' && existingOrder;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Fetch dishes when modal opens - FIXED VERSION
  useEffect(() => {
    if (open && !fetchAttemptedRef.current) {
      fetchAttemptedRef.current = true;
      
      // Only fetch if we don't have dishes or they're not loading
      if (!dishes || dishes.length === 0) {
        dispatch(fetchActiveDishes())
          .then(() => {
            if (isMountedRef.current) {
              setDishesInitialized(true);
            }
          })
          .catch((error) => {
            console.error('Error fetching dishes:', error);
            if (isMountedRef.current) {
              setDishesInitialized(true);
            }
          });
      } else {
        // If dishes already exist, mark as initialized
        setDishesInitialized(true);
      }
    }
  }, [open, dispatch, dishes]); // Removed dishesInitialized and dishesLoading from dependencies

  // Reset states when modal opens/closes
  useEffect(() => {
    if (open) {
      // Modal is opening - reset states
      setHasHandledSuccess(false);
      setIsSubmitting(false);
      setImageErrors(new Set());
      successHandledRef.current = false;
      orderSubmittedRef.current = false;
      fetchAttemptedRef.current = false; // Reset fetch attempt flag
      dispatch(resetOrderState());
    } else {
      // Modal is closing - cleanup
      setOrderItems([]);
      setSelectedCategory('All');
      setSearchTerm('');
      setDishesInitialized(false);
      setImageErrors(new Set());
      successHandledRef.current = false;
      orderSubmittedRef.current = false;
      fetchAttemptedRef.current = false; // Reset fetch attempt flag
    }
  }, [open, dispatch]);

  // Alternative approach: Use a separate effect to track when dishes are loaded
  useEffect(() => {
    if (dishes && dishes.length > 0 && !dishesInitialized) {
      setDishesInitialized(true);
    }
  }, [dishes, dishesInitialized]);

  // Initialize order items for edit mode
  useEffect(() => {
    if (
      open && 
      isEditMode && 
      existingOrder && 
      dishesInitialized && 
      dishes?.length > 0 &&
      orderItems.length === 0
    ) {
      if (!existingOrder.dishes || !Array.isArray(existingOrder.dishes)) {
        return;
      }
      
      const initialOrderItems = existingOrder.dishes.map(orderDish => {
        const dishId = orderDish.dish_id?._id || orderDish.dish_id || orderDish.dishId;
        const dish = dishes.find(d => d._id === dishId);
        
        if (!dish) {
          const dishData = orderDish.dish_id || orderDish;
          return {
            dish_id: dishId,
            dishName: dishData?.dishName?.[currentLanguage] || dishData?.dishName?.en || dishData?.dishName || 'Unknown Dish',
            price: dishData?.price || orderDish.price || 0,
            currency: dishData?.currency || orderDish.currency || 'USD',
            quantity: orderDish.quantity || 1,
            status: orderDish.status || 'pending',
            imageUrl: dishData?.imageUrl
          };
        }
        
        return {
          dish_id: dish._id,
          dishName: dish.dishName?.[currentLanguage] || dish.dishName?.en || dish.dishName || 'Unknown Dish',
          price: dish.price || 0,
          currency: dish.currency || 'USD',
          quantity: orderDish.quantity || 1,
          status: orderDish.status || 'pending',
          imageUrl: dish.imageUrl
        };
      });
      
      setOrderItems(initialOrderItems);
    }
  }, [open, isEditMode, existingOrder, dishesInitialized, dishes, currentLanguage, orderItems.length]);

  // Handle order success
  useEffect(() => {
    if (
      isSuccess && 
      !successHandledRef.current && 
      orderSubmittedRef.current &&
      isMountedRef.current
    ) {
      successHandledRef.current = true;
      setHasHandledSuccess(true);
      setIsSubmitting(false);
      
      // Close modal after successful submission
      setTimeout(() => {
        if (isMountedRef.current && typeof onClose === 'function') {
          onClose();
        }
      }, 500);
    }
  }, [isSuccess, onClose]);

  // Handle order error
  useEffect(() => {
    if (isError && orderSubmittedRef.current) {
      setIsSubmitting(false);
      orderSubmittedRef.current = false;
    }
  }, [isError, message]);

  // Memoized close handler
  const handleClose = useCallback(() => {
    if (typeof onClose === 'function' && !isSubmitting) {
      onClose();
    }
  }, [onClose, isSubmitting]);

  // Get unique categories
  const categories = ['All', ...new Set(
    dishes?.map(dish => dish.category).filter(Boolean) || []
  )];

  // Filter dishes based on category and search
  const filteredDishes = dishes?.filter(dish => {
    if (!dish) return false;
    
    const matchesCategory = selectedCategory === 'All' || dish.category === selectedCategory;
    const dishName = dish.dishName?.[currentLanguage] || dish.dishName?.en || dish.dishName || '';
    const matchesSearch = searchTerm === '' || 
      dishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (dish.category || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesSearch;
  }) || [];

  // Handle image error
  const handleImageError = useCallback((dishId) => {
    setImageErrors(prev => new Set([...prev, dishId]));
  }, []);

  // Get image URL
  const getImageUrl = useCallback((imageUrl) => {
    if (!imageUrl) return null;
    if (imageUrl.startsWith('http')) return imageUrl;
    return `${base_url}${imageUrl}`;
  }, []);

  // Add item to order
  const addToOrder = useCallback((dish) => {
    if (!dish || !dish._id) return;
    
    setOrderItems(prev => {
      const existingItem = prev.find(item => item.dish_id === dish._id);
      
      if (existingItem) {
        return prev.map(item =>
          item.dish_id === dish._id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        const newItem = {
          dish_id: dish._id,
          dishName: dish.dishName?.[currentLanguage] || dish.dishName?.en || dish.dishName || 'Unknown Dish',
          price: dish.price || 0,
          currency: dish.currency || 'USD',
          quantity: 1,
          status: 'order',
          imageUrl: dish.imageUrl
        };
        return [...prev, newItem];
      }
    });
  }, [currentLanguage]);

  // Remove item from order
  const removeFromOrder = useCallback((dishId) => {
    setOrderItems(prev => {
      const item = prev.find(item => item.dish_id === dishId);
      if (item && item.status !== 'prepare') {
        return prev.filter(item => item.dish_id !== dishId);
      }
      return prev;
    });
  }, []);

  // Update quantity
  const updateQuantity = useCallback((dishId, newQuantity) => {
    setOrderItems(prev => {
      const item = prev.find(item => item.dish_id === dishId);
      
      if (newQuantity <= 0) {
        if (item && item.status !== 'prepare') {
          return prev.filter(item => item.dish_id !== dishId);
        }
        return prev;
      } else {
        const currentQuantity = item ? item.quantity : 0;
        if (newQuantity < currentQuantity && item && item.status === 'prepare') {
          return prev;
        }
        
        return prev.map(item =>
          item.dish_id === dishId 
            ? { ...item, quantity: newQuantity }
            : item
        );
      }
    });
  }, []);

  // Calculate total
  const calculateTotal = useCallback(() => {
    return orderItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [orderItems]);

  // Submit order
  const handleSubmitOrder = useCallback(async () => {
    if (orderItems.length === 0) {
      alert(t('TakeOrderModal.pleaseAddAtLeastOneItem') || 'Please add at least one item');
      return;
    }

    if (isSubmitting || orderSubmittedRef.current) {
      return;
    }

    setIsSubmitting(true);
    orderSubmittedRef.current = true;

    try {
      if (isEditMode) {
        const dishesArray = orderItems.map(item => ({
          dish_id: item.dish_id,
          quantity: item.quantity,
          status: item.status || 'order'
        }));

        await dispatch(updateOrderDishes({
          id: existingOrder._id,
          dishes: dishesArray
        }));
      } else {
        const orderData = {
          tableid: tableId,
          waiterid: waiterId,
          dishes: orderItems,
          totalAmount: calculateTotal(),
          orderstatus: 'order'
        };
        await dispatch(createOrder(orderData));
      }
      
    } catch (error) {
      console.error('Error submitting order:', error);
      setIsSubmitting(false);
      orderSubmittedRef.current = false;
    }
  }, [orderItems, isSubmitting, isEditMode, existingOrder, tableId, waiterId, calculateTotal, dispatch, t]);

  // Format price
  const formatPrice = useCallback((price, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(price || 0);
  }, []);

  // Get item quantity in order
  const getItemQuantity = useCallback((dishId) => {
    const item = orderItems.find(item => item.dish_id === dishId);
    return item ? item.quantity : 0;
  }, [orderItems]);

  // Early return if modal should not be shown
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-2">
      <div className={`w-full max-w-5xl h-[70vh] rounded-xl shadow-2xl overflow-hidden ${
        darkMode ? 'bg-slate-900 border border-slate-700' : 'bg-white border border-gray-200'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-3 border-b ${
          darkMode ? 'border-slate-700 bg-slate-800' : 'border-gray-200 bg-gray-50'
        }`}>
          <div className="flex items-center space-x-2">
            <div className="p-1 rounded-lg bg-gradient-to-r from-violet-500 to-purple-600">
              <ChefHat className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-violet-600">
                {isEditMode ? (t('TakeOrderModal.editOrder') || 'Edit Order') : (t('TakeOrderModal.takeOrder') || 'Take Order')}
              </h2>
              {tableId && (
                <p className="text-xs text-gray-500">Table {tableId}</p>
              )}
            </div>
          </div>
          <Button
            onClick={handleClose}
            variant="ghost"
            size="icon"
            className="hover:bg-red-100 hover:text-red-600 rounded-full h-7 w-7"
            disabled={isSubmitting}
          >
            <X size={16} />
          </Button>
        </div>

        <div className="flex h-[calc(70vh-4rem)]">
          {/* Left Side - Dishes */}
          <div className="flex-1 p-3 overflow-hidden flex flex-col">
            <div className="mb-3 space-y-2">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
                <Input
                  type="text"
                  placeholder={t('TakeOrderModal.searchDishes') || 'Search dishes...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 py-1.5 text-sm rounded-lg h-8"
                />
              </div>
              
              <div className="flex flex-wrap gap-1">
                {categories.map(category => (
                  <Button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    className={`rounded-full px-3 py-1 text-xs h-6 ${
                      selectedCategory === category
                        ? 'bg-violet-600 text-white'
                        : 'hover:bg-violet-50'
                    }`}
                  >
                    {category === 'All' ? (t('TakeOrderModal.all') || 'All') : category}
                  </Button>
                ))}
              </div>
            </div>

            {/* Dishes Grid */}
            <ScrollArea className="flex-1">
              <div className="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 pb-2">
                {dishesLoading ? (
                  <div className="col-span-full flex flex-col items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 text-violet-600 animate-spin mb-2" />
                    <p className="text-sm text-gray-600">{t('TakeOrderModal.loadingDishes') || 'Loading dishes...'}</p>
                  </div>
                ) : filteredDishes.length === 0 ? (
                  <div className="col-span-full flex flex-col items-center justify-center py-8">
                    <Utensils size={32} className="mb-2 text-gray-300" />
                    <p className="text-sm text-gray-500">{t('TakeOrderModal.noDishesFound') || 'No dishes found'}</p>
                  </div>
                ) : (
                  filteredDishes.map(dish => {
                    const quantity = getItemQuantity(dish._id);
                    const imageUrl = getImageUrl(dish.imageUrl);
                    const hasImageError = imageErrors.has(dish._id);
                    
                    return (
                      <Card
                        key={dish._id}
                        className={`group relative cursor-pointer transition-all duration-200 hover:scale-105 border rounded-lg overflow-hidden ${
                          quantity > 0
                            ? 'border-emerald-400 bg-emerald-50 shadow-sm'
                            : 'hover:border-violet-300'
                        }`}
                        onClick={() => addToOrder(dish)}
                      >
                        <CardContent className="p-0">
                          {/* Image Section */}
                          <div className="relative h-16 overflow-hidden bg-gray-100">
                            {imageUrl && !hasImageError ? (
                              <img
                                src={imageUrl}
                                alt={dish.dishName?.[currentLanguage] || dish.dishName?.en || dish.dishName}
                                className="w-full h-full object-cover"
                                onError={() => handleImageError(dish._id)}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                <ImageIcon size={16} className="text-gray-400" />
                              </div>
                            )}
                            
                            {/* Quantity Badge */}
                            {quantity > 0 && (
                              <div className="absolute top-0.5 right-0.5 bg-emerald-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs font-bold">
                                {quantity}
                              </div>
                            )}

                            {/* Price Overlay */}
                            <div className="absolute bottom-0.5 left-0.5 bg-black/70 text-white px-1 py-0.5 rounded text-xs font-bold">
                              {formatPrice(dish.price, dish.currency)}
                            </div>
                          </div>

                          {/* Content Section */}
                          <div className="p-1.5">
                            <h4 className="font-semibold text-xs leading-tight mb-1 line-clamp-2 text-gray-900">
                              {dish.dishName?.[currentLanguage] || dish.dishName?.en || dish.dishName || 'Unknown Dish'}
                            </h4>

                            {/* Add Button */}
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                addToOrder(dish);
                              }}
                              size="sm"
                              className="w-full h-5 text-xs rounded bg-violet-600 hover:bg-violet-700 text-white"
                            >
                              <Plus size={10} className="mr-0.5" />
                              {quantity > 0 ? (t('TakeOrderModal.addMore') || 'Add More') : (t('TakeOrderModal.add') || 'Add')}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Right Side - Order Summary */}
          <div className="w-72 flex-shrink-0 border-l border-gray-200 dark:border-slate-700">
            <div className={`h-full flex flex-col ${
              darkMode ? 'bg-slate-800' : 'bg-gray-50'
            }`}>
              <div className="p-3 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm flex items-center text-gray-900">
                    <ShoppingCart size={16} className="mr-1 text-violet-600" />
                    {t('TakeOrderModal.orderSummary') || 'Order Summary'}
                  </h3>
                  {orderItems.length > 0 && (
                    <Badge className="bg-violet-100 text-violet-800 rounded-full text-xs">
                      {orderItems.length}
                    </Badge>
                  )}
                </div>
              </div>

              {orderItems.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-center p-4">
                  <div>
                    <Receipt size={32} className="mx-auto mb-2 text-gray-300" />
                    <p className="text-sm font-semibold mb-1 text-gray-500">
                      {t('TakeOrderModal.noItemsInOrder') || 'No items in order'}
                    </p>
                    <p className="text-xs text-gray-400">
                      {t('TakeOrderModal.startAddingDishes') || 'Start adding dishes'}
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <ScrollArea className="flex-1 p-2">
                    <div className="space-y-1">
                      {orderItems.map(item => {
                        const isPreparing = item.status === 'prepare';
                        
                        return (
                          <Card key={item.dish_id} className={`border rounded-lg ${
                            isPreparing ? 'border-orange-300 bg-orange-50' : ''
                          }`}>
                            <CardContent className="p-2">
                              <div className="flex justify-between items-start mb-1">
                                <div className="flex-1 mr-2">
                                  <h5 className="font-semibold text-xs text-gray-900">
                                    {item.dishName}
                                  </h5>
                                  {isPreparing && (
                                    <span className="text-xs text-orange-600 font-medium">
                                      {t('TakeOrderModal.preparing') || 'Preparing...'}
                                    </span>
                                  )}
                                </div>
                                <Button
                                  onClick={() => removeFromOrder(item.dish_id)}
                                  variant="ghost"
                                  size="icon"
                                  disabled={isPreparing}
                                  className={`h-4 w-4 ${
                                    isPreparing 
                                      ? 'text-gray-400 cursor-not-allowed' 
                                      : 'text-red-500 hover:text-red-700'
                                  }`}
                                >
                                  <X size={8} />
                                </Button>
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-1">
                                  <Button
                                    onClick={() => updateQuantity(item.dish_id, item.quantity - 1)}
                                    variant="outline"
                                    size="icon"
                                    disabled={isPreparing}
                                    className={`h-4 w-4 rounded-full ${
                                      isPreparing ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                  >
                                    <Minus size={8} />
                                  </Button>
                                  <span className="w-4 text-center font-bold text-xs text-gray-900">
                                    {item.quantity}
                                  </span>
                                  <Button
                                    onClick={() => updateQuantity(item.dish_id, item.quantity + 1)}
                                    variant="outline"
                                    size="icon"
                                    className="h-4 w-4 rounded-full"
                                  >
                                    <Plus size={8} />
                                  </Button>
                                </div>
                                <span className="font-bold text-xs text-emerald-600">
                                  {formatPrice(item.price * item.quantity, item.currency)}
                                </span>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </ScrollArea>

                  {/* Submit Section */}
                  <div className="p-3 border-t border-gray-200 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-sm text-gray-900">
                        {t('TakeOrderModal.total') || 'Total'}:
                      </span>
                      <span className="font-bold text-lg text-emerald-600">
                        {formatPrice(calculateTotal())}
                      </span>
                    </div>
                    
                    <Button
                      onClick={handleSubmitOrder}
                      disabled={isSubmitting || orderLoading || orderSubmittedRef.current}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 text-sm font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting || orderLoading ? (
                        <>
                          <Loader2 className="w-3 h-3 animate-spin mr-1" />
                          {isEditMode ? (t('TakeOrderModal.updating') || 'Updating...') : (t('TakeOrderModal.submitting') || 'Submitting...')}
                        </>
                      ) : (
                        <>
                          <CheckCircle size={14} className="mr-1" />
                          {isEditMode ? (t('TakeOrderModal.updateOrder') || 'Update Order') : (t('TakeOrderModal.submitOrder') || 'Submit Order')}
                        </>
                      )}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TakeOrderModal;