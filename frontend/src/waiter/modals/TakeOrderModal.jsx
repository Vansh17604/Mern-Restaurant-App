import React, { useState, useEffect, useRef } from 'react';
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
  const [showOrderSummary, setShowOrderSummary] = useState(false); // Mobile order summary toggle
  
  const isMountedRef = useRef(true);
  const currentLanguage = i18n.language || 'en';
  const isEditMode = mode === 'edit' && existingOrder;

  
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Reset success tracking when modal opens/closes
  useEffect(() => {
    if (open) {
      setHasHandledSuccess(false);
      setIsSubmitting(false);
      setDishesInitialized(false);
      setImageErrors(new Set());
      setShowOrderSummary(false);
      dispatch(resetOrderState());
    } else {
      setOrderItems([]);
      setSelectedCategory('All');
      setSearchTerm('');
      setDishesInitialized(false);
      setImageErrors(new Set());
      setShowOrderSummary(false);
    }
  }, [open, dispatch]);

  // Fetch dishes when modal opens
  useEffect(() => {
    if (open && !dishesInitialized) {
      dispatch(fetchActiveDishes())
        .then(() => {
          setDishesInitialized(true);
        })
        .catch((error) => {
          console.error('Error fetching dishes:', error);
        });
    }
  }, [open, dispatch, dishesInitialized]);

  // Initialize order items for edit mode
  useEffect(() => {
    if (open && isEditMode && existingOrder && dishesInitialized && dishes?.length > 0) {
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
  }, [open, isEditMode, existingOrder, dishesInitialized, dishes, currentLanguage]);

  // Handle order success
  useEffect(() => {
    if (isSuccess && !hasHandledSuccess && isMountedRef.current) {
      setHasHandledSuccess(true);
      setIsSubmitting(false);
      
      setTimeout(() => {
        if (isMountedRef.current) {
          onClose();
        }
      }, 500);
    }
  }, [isSuccess, hasHandledSuccess, onClose]);

  // Handle order error
  useEffect(() => {
    if (isError && isSubmitting) {
      setIsSubmitting(false);
    }
  }, [isError, message, isSubmitting]);

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
  const handleImageError = (dishId) => {
    setImageErrors(prev => new Set([...prev, dishId]));
  };

  // Get image URL
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    if (imageUrl.startsWith('http')) return imageUrl;
    return `${base_url}${imageUrl}`;
  };

  // Add item to order
  const addToOrder = (dish) => {
    if (!dish || !dish._id) return;
    
    const existingItem = orderItems.find(item => item.dish_id === dish._id);
    
    if (existingItem) {
      setOrderItems(prev => prev.map(item =>
        item.dish_id === dish._id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
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
      setOrderItems(prev => [...prev, newItem]);
    }
  };

  // Remove item from order - now checks status
  const removeFromOrder = (dishId) => {
    const item = orderItems.find(item => item.dish_id === dishId);
    if (item && item.status !== 'prepare') {
      setOrderItems(prev => prev.filter(item => item.dish_id !== dishId));
    }
  };

  const updateQuantity = (dishId, newQuantity) => {
    const item = orderItems.find(item => item.dish_id === dishId);
    
    if (newQuantity <= 0) {
      if (item && item.status !== 'prepare') {
        removeFromOrder(dishId);
      }
    } else {
      const currentQuantity = item ? item.quantity : 0;
      if (newQuantity < currentQuantity && item && item.status === 'prepare') {
        return; // Don't allow decreasing quantity for items being prepared
      }
      
      setOrderItems(prev => prev.map(item =>
        item.dish_id === dishId 
          ? { ...item, quantity: newQuantity }
          : item
      ));
    }
  };

  // Calculate total
  const calculateTotal = () => {
    return orderItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Submit order
  const handleSubmitOrder = async () => {
    if (orderItems.length === 0) {
      alert(t('TakeOrderModal.pleaseAddAtLeastOneItem'));
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEditMode) {
        const dishesArray = orderItems.map(item => ({
          dish_id: item.dish_id,
          quantity: item.quantity,
          status: item.status || 'order'
        }));

        console.log('Sending dishes for update:', dishesArray);

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
      
      // Close modal immediately after dispatch
      onClose();
      
    } catch (error) {
      console.error('Error submitting order:', error);
      setIsSubmitting(false);
      // Don't close modal if there's an error
    }
  };

  const formatPrice = (price, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(price || 0);
  };

  // Get item quantity in order
  const getItemQuantity = (dishId) => {
    const item = orderItems.find(item => item.dish_id === dishId);
    return item ? item.quantity : 0;
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      {/* Mobile and Desktop Layout */}
      <div className={`w-full h-full sm:h-[90vh] sm:max-w-6xl sm:rounded-xl shadow-2xl overflow-hidden ${
        darkMode ? 'bg-slate-900 border-0 sm:border sm:border-slate-700' : 'bg-white border-0 sm:border sm:border-gray-200'
      }`}>
        {/* Header - Mobile Optimized */}
        <div className={`flex items-center justify-between p-4 sm:p-3 border-b ${
          darkMode ? 'border-slate-700 bg-slate-800' : 'border-gray-200 bg-gray-50'
        }`}>
          <div className="flex items-center space-x-3 sm:space-x-2">
            <div className="p-2 sm:p-1 rounded-lg bg-gradient-to-r from-violet-500 to-purple-600">
              <ChefHat className="w-6 h-6 sm:w-4 sm:h-4 text-white" />
            </div>
            <div>
              <h2 className="text-xl sm:text-lg font-bold text-violet-600">
                {isEditMode ? t('TakeOrderModal.editOrder') : t('TakeOrderModal.takeOrder')}
              </h2>
              {tableId && (
                <p className="text-sm sm:text-xs text-gray-500">Table {tableId}</p>
              )}
            </div>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="hover:bg-red-100 hover:text-red-600 rounded-full h-10 w-10 sm:h-7 sm:w-7"
          >
            <X size={20} className="sm:w-4 sm:h-4" />
          </Button>
        </div>

        {/* Mobile Order Summary Toggle */}
        <div className="sm:hidden">
          {orderItems.length > 0 && (
            <div className={`p-3 border-b flex items-center justify-between ${
              darkMode ? 'border-slate-700 bg-slate-800' : 'border-gray-200 bg-gray-50'
            }`}>
              <div className="flex items-center space-x-2">
                <ShoppingCart size={16} className="text-violet-600" />
                <span className="font-semibold text-sm">{orderItems.length} items</span>
                <span className="font-bold text-emerald-600">{formatPrice(calculateTotal())}</span>
              </div>
              <Button
                onClick={() => setShowOrderSummary(!showOrderSummary)}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                {showOrderSummary ? 'Hide Order' : 'View Order'}
              </Button>
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <div className="flex h-[calc(100vh-8rem)] sm:h-[calc(90vh-4rem)]">
          {/* Left Side - Dishes (Full width on mobile when order summary is hidden) */}
          <div className={`${
            showOrderSummary ? 'hidden' : 'flex-1'
          } sm:flex-1 p-4 sm:p-3 overflow-hidden flex flex-col`}>
            {/* Search and Categories */}
            <div className="mb-4 sm:mb-3 space-y-3 sm:space-y-2">
              <div className="relative">
                <Search className="absolute left-3 sm:left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  type="text"
                  placeholder={t('TakeOrderModal.searchDishes')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 sm:pl-8 py-3 sm:py-1.5 text-base sm:text-sm rounded-lg h-12 sm:h-8"
                />
              </div>
              
              <ScrollArea className="w-full whitespace-nowrap">
                <div className="flex gap-2 sm:gap-1 pb-2">
                  {categories.map(category => (
                    <Button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      className={`rounded-full px-4 sm:px-3 py-2 sm:py-1 text-sm sm:text-xs h-9 sm:h-6 whitespace-nowrap ${
                        selectedCategory === category
                          ? 'bg-violet-600 text-white'
                          : 'hover:bg-violet-50'
                      }`}
                    >
                      {category === 'All' ? t('TakeOrderModal.all') : 
                       t(`TakeOrderModal.categories.${category.toLowerCase().replace(/\s+/g, '')}`, category)}
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Dishes Grid - Mobile Optimized */}
            <ScrollArea className="flex-1">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-2 pb-4 sm:pb-2">
                {dishesLoading ? (
                  <div className="col-span-full flex flex-col items-center justify-center py-12 sm:py-8">
                    <Loader2 className="w-8 h-8 sm:w-6 sm:h-6 text-violet-600 animate-spin mb-3 sm:mb-2" />
                    <p className="text-base sm:text-sm text-gray-600">{t('TakeOrderModal.loadingDishes')}</p>
                  </div>
                ) : filteredDishes.length === 0 ? (
                  <div className="col-span-full flex flex-col items-center justify-center py-12 sm:py-8">
                    <Utensils size={40} className="sm:w-8 sm:h-8 mb-3 sm:mb-2 text-gray-300" />
                    <p className="text-base sm:text-sm text-gray-500">{t('TakeOrderModal.noDishesFound')}</p>
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
                          {/* Image Section - Mobile Optimized */}
                          <div className="relative h-24 sm:h-16 overflow-hidden bg-gray-100">
                            {imageUrl && !hasImageError ? (
                              <img
                                src={imageUrl}
                                alt={dish.dishName?.[currentLanguage] || dish.dishName?.en || dish.dishName}
                                className="w-full h-full object-cover"
                                onError={() => handleImageError(dish._id)}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                <ImageIcon size={24} className="sm:w-4 sm:h-4 text-gray-400" />
                              </div>
                            )}
                            
                            {/* Quantity Badge */}
                            {quantity > 0 && (
                              <div className="absolute top-1 sm:top-0.5 right-1 sm:right-0.5 bg-emerald-500 text-white rounded-full w-6 h-6 sm:w-4 sm:h-4 flex items-center justify-center text-sm sm:text-xs font-bold">
                                {quantity}
                              </div>
                            )}

                            {/* Price Overlay */}
                            <div className="absolute bottom-1 sm:bottom-0.5 left-1 sm:left-0.5 bg-black/70 text-white px-2 sm:px-1 py-1 sm:py-0.5 rounded text-sm sm:text-xs font-bold">
                              {formatPrice(dish.price, dish.currency)}
                            </div>
                          </div>

                          {/* Content Section - Mobile Optimized */}
                          <div className="p-3 sm:p-1.5">
                            <h4 className="font-semibold text-sm sm:text-xs leading-tight mb-2 sm:mb-1 line-clamp-2 text-gray-900">
                              {dish.dishName?.[currentLanguage] || dish.dishName?.en || dish.dishName || 'Unknown Dish'}
                            </h4>

                            {/* Add Button - Mobile Optimized */}
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                addToOrder(dish);
                              }}
                              size="sm"
                              className="w-full h-8 sm:h-5 text-sm sm:text-xs rounded bg-violet-600 hover:bg-violet-700 text-white"
                            >
                              <Plus size={14} className="sm:w-2.5 sm:h-2.5 mr-1 sm:mr-0.5" />
                              {quantity > 0 ? t('TakeOrderModal.addMore') : t('TakeOrderModal.add')}
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

          {/* Right Side - Order Summary (Full width on mobile when shown) */}
          <div className={`${
            showOrderSummary ? 'flex-1' : 'hidden'
          } sm:flex sm:w-80 sm:flex-shrink-0 border-l border-gray-200 dark:border-slate-700`}>
            <div className={`h-full w-full flex flex-col ${
              darkMode ? 'bg-slate-800' : 'bg-gray-50'
            }`}>
              <div className="p-4 sm:p-3 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base sm:text-sm flex items-center text-gray-900">
                    <ShoppingCart size={20} className="sm:w-4 sm:h-4 mr-2 sm:mr-1 text-violet-600" />
                    {t('TakeOrderModal.orderSummary')}
                  </h3>
                  {orderItems.length > 0 && (
                    <Badge className="bg-violet-100 text-violet-800 rounded-full text-sm sm:text-xs">
                      {orderItems.length}
                    </Badge>
                  )}
                </div>
                {/* Mobile Back Button */}
                <Button
                  onClick={() => setShowOrderSummary(false)}
                  variant="ghost"
                  size="sm"
                  className="mt-2 sm:hidden w-full"
                >
                  ← Back to Menu
                </Button>
              </div>

              {orderItems.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-center p-6 sm:p-4">
                  <div>
                    <Receipt size={48} className="sm:w-8 sm:h-8 mx-auto mb-3 sm:mb-2 text-gray-300" />
                    <p className="text-base sm:text-sm font-semibold mb-2 sm:mb-1 text-gray-500">{t('TakeOrderModal.noItemsInOrder')}</p>
                    <p className="text-sm sm:text-xs text-gray-400">{t('TakeOrderModal.startAddingDishes')}</p>
                  </div>
                </div>
              ) : (
                <>
                  <ScrollArea className="flex-1 p-3 sm:p-2">
                    <div className="space-y-3 sm:space-y-1">
                      {orderItems.map(item => {
                        const isPreparing = item.status === 'prepare';
                        
                        return (
                          <Card key={item.dish_id} className={`border rounded-lg ${
                            isPreparing ? 'border-orange-300 bg-orange-50' : ''
                          }`}>
                            <CardContent className="p-3 sm:p-2">
                              <div className="flex justify-between items-start mb-2 sm:mb-1">
                                <div className="flex-1 mr-3 sm:mr-2">
                                  <h5 className="font-semibold text-sm sm:text-xs text-gray-900">
                                    {item.dishName}
                                  </h5>
                                  {isPreparing && (
                                    <span className="text-sm sm:text-xs text-orange-600 font-medium">
                                      {t('TakeOrderModal.preparing')}
                                    </span>
                                  )}
                                </div>
                                <Button
                                  onClick={() => removeFromOrder(item.dish_id)}
                                  variant="ghost"
                                  size="icon"
                                  disabled={isPreparing}
                                  className={`h-6 w-6 sm:h-4 sm:w-4 ${
                                    isPreparing 
                                      ? 'text-gray-400 cursor-not-allowed' 
                                      : 'text-red-500 hover:text-red-700'
                                  }`}
                                >
                                  <X size={14} className="sm:w-2 sm:h-2" />
                                </Button>
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2 sm:space-x-1">
                                  <Button
                                    onClick={() => updateQuantity(item.dish_id, item.quantity - 1)}
                                    variant="outline"
                                    size="icon"
                                    disabled={isPreparing}
                                    className={`h-8 w-8 sm:h-4 sm:w-4 rounded-full ${
                                      isPreparing ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                  >
                                    <Minus size={14} className="sm:w-2 sm:h-2" />
                                  </Button>
                                  <span className="w-8 sm:w-4 text-center font-bold text-sm sm:text-xs text-gray-900">
                                    {item.quantity}
                                  </span>
                                  <Button
                                    onClick={() => updateQuantity(item.dish_id, item.quantity + 1)}
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8 sm:h-4 sm:w-4 rounded-full"
                                  >
                                    <Plus size={14} className="sm:w-2 sm:h-2" />
                                  </Button>
                                </div>
                                <span className="font-bold text-sm sm:text-xs text-emerald-600">
                                  {formatPrice(item.price * item.quantity, item.currency)}
                                </span>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </ScrollArea>

                  {/* Submit Section - Mobile Optimized */}
                  <div className="p-4 sm:p-3 border-t border-gray-200 space-y-3 sm:space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-base sm:text-sm text-gray-900">{t('TakeOrderModal.total')}:</span>
                      <span className="font-bold text-xl sm:text-lg text-emerald-600">
                        {formatPrice(calculateTotal())}
                      </span>
                    </div>
                    
                    <Button
                      onClick={handleSubmitOrder}
                      disabled={isSubmitting || orderLoading}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 sm:py-2 text-base sm:text-sm font-bold rounded-lg"
                    >
                      {isSubmitting || orderLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 sm:w-3 sm:h-3 animate-spin mr-2 sm:mr-1" />
                          {isEditMode ? t('TakeOrderModal.updating') : t('TakeOrderModal.submitting')}
                        </>
                      ) : (
                        <>
                          <CheckCircle size={18} className="sm:w-3.5 sm:h-3.5 mr-2 sm:mr-1" />
                          {isEditMode ? t('TakeOrderModal.updateOrder') : t('TakeOrderModal.submitOrder')}
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