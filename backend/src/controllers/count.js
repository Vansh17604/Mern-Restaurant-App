const Order=require('../models/order');
const Payment =require('../models/payment');
const Table =require('../models/table');
const Dish = require('../models/dish');


const calculateChange = (current, previous) => {
  if (previous === 0) return 'N/A';
  const diff = current - previous;
  const percent = (diff / previous) * 100;
  const sign = percent >= 0 ? '+' : '-';
  return `${sign}${Math.abs(percent).toFixed(1)}%`;
};

const langTitles = {
  en: {
    orders: 'Total Orders',
    revenue: 'Total Revenue',
    tables: 'Active Tables',
    customers: 'Customers',
  },
  es: {
    orders: 'Total de Pedidos',
    revenue: 'Ingresos Totales',
    tables: 'Mesas Activas',
    customers: 'Clientes',
  }
};

module.exports.getDashboardStats = async (req, res) => {
  try {
    const lang = req.query.lang === 'es' ? 'es' : 'en';

    const now = new Date();
    const lastMonth = new Date();
    lastMonth.setMonth(now.getMonth() - 1);

    const totalOrders = await Order.countDocuments();
    const lastMonthOrders = await Order.countDocuments({ createdAt: { $gte: lastMonth, $lt: now } });

    const totalRevenueResult = await Payment.aggregate([{ $group: { _id: null, total: { $sum: '$amount' } } }]);
    const totalRevenue = totalRevenueResult[0]?.total || 0;

    const lastMonthRevenueResult = await Payment.aggregate([
      { $match: { createdAt: { $gte: lastMonth, $lt: now } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const lastMonthRevenue = lastMonthRevenueResult[0]?.total || 0;

    const availableTables = await Table.countDocuments({ tablestatus: 'Available' });
    const lastMonthTables = await Table.countDocuments({
      tablestatus: 'Available',
      createdAt: { $gte: lastMonth, $lt: now }
    });

    const allOrders = await Order.find().populate('tableid');
    const totalCustomers = allOrders.reduce((acc, order) => acc + (order.tableid?.tablecapacity || 0), 0);

    const lastMonthOrdersDetailed = await Order.find({ createdAt: { $gte: lastMonth, $lt: now } }).populate('tableid');
    const lastMonthCustomers = lastMonthOrdersDetailed.reduce((acc, order) => acc + (order.tableid?.tablecapacity || 0), 0);

    return res.json([
      {
        title: langTitles[lang].orders,
        value: totalOrders.toLocaleString(),
        icon: 'Utensils',
        change: calculateChange(lastMonthOrders, totalOrders - lastMonthOrders),
        color: 'bg-blue-100'
      },
      {
        title: langTitles[lang].revenue,
        value: `$${totalRevenue.toLocaleString()}`,
        icon: 'DollarSign',
        change: calculateChange(lastMonthRevenue, totalRevenue - lastMonthRevenue),
        color: 'bg-green-100'
      },
      {
        title: langTitles[lang].tables,
        value: availableTables.toString(),
        icon: 'Coffee',
        change: calculateChange(lastMonthTables, availableTables - lastMonthTables),
        color: 'bg-amber-100'
      },
      {
        title: langTitles[lang].customers,
        value: totalCustomers.toLocaleString(),
        icon: 'Users',
        change: calculateChange(lastMonthCustomers, totalCustomers - lastMonthCustomers),
        color: 'bg-purple-100'
      }
    ]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to load dashboard stats' });
  }
};

const dayMap = {
  en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  es: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
};

module.exports.getWeeklySalesData = async (req, res) => {
  try {
    const lang = req.query.lang === 'es' ? 'es' : 'en';

    const today = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(today.getDate() - 6);

    const orders = await Order.find({ createdAt: { $gte: oneWeekAgo } }).populate('tableid');
    const payments = await Payment.find({ createdAt: { $gte: oneWeekAgo } });

    const result = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(today.getDate() - (6 - i));
      const dayName = dayMap[lang][date.getDay()];

      const ordersForDay = orders.filter(o => o.createdAt.toDateString() === date.toDateString());
      const paymentsForDay = payments.filter(p => p.createdAt.toDateString() === date.toDateString());

      const salesTotal = paymentsForDay.reduce((sum, p) => sum + (p.amount || 0), 0);
      const ordersTotal = ordersForDay.length;

      result.push({
        name: dayName,
        sales: salesTotal,
        orders: ordersTotal
      });
    }

    return res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to get weekly sales data' });
  }
};




module.exports.getRecentOrders = async (req, res) => {
  try {
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(4)
      .populate('dishes.dish_id');

    const formattedOrders = recentOrders.map(order => {
      let totalAmount = 0;

      // Calculate total price for order
      order.dishes.forEach(d => {
        const price = d.dish_id?.price || 0;
        totalAmount += price * d.quantity;
      });

      const time = new Date(order.createdAt).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });

      return {
        id: `#ORD-${String(order._id).slice(-4).toUpperCase()}`,
        amount: `$${totalAmount.toFixed(2)}`,
        status: order.orderstatus || 'Pending',
        time
      };
    });

    return res.json(formattedOrders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to get recent orders' });
  }
};


module.exports.getHourlyOrders = async (req, res) => {
  try {
    const startHour = 9;
    const endHour = 22;

    const now = new Date();
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));


    const todayOrders = await Order.find({
      createdAt: { $gte: startOfDay }
    });

    const hourlyData = [];
    for (let hour = startHour; hour <= endHour; hour++) {
      const label = hour < 12 ? `${hour}AM` : (hour === 12 ? `12PM` : `${hour - 12}PM`);
      hourlyData.push({ name: label, orders: 0 });
    }

    todayOrders.forEach(order => {
      const hour = new Date(order.createdAt).getHours();
      if (hour >= startHour && hour <= endHour) {
        hourlyData[hour - startHour].orders += 1;
      }
    });

    return res.json(hourlyData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to get hourly orders data' });
  }
};




module.exports.getMenuPopularity = async (req, res) => {
  try {
    const lang = req.query.lang === 'es' ? 'es' : 'en';

    const orders = await Order.find().select('dishes');
    const dishCountMap = {};

    orders.forEach(order => {
      order.dishes.forEach(d => {
        const id = d.dish_id.toString();
        dishCountMap[id] = (dishCountMap[id] || 0) + d.quantity;
      });
    });

    const dishIds = Object.keys(dishCountMap);
    const dishes = await Dish.find({ _id: { $in: dishIds } });

    const result = dishes.map(dish => ({
      name: dish.dishName[lang], // Localized dish name
      value: dishCountMap[dish._id.toString()] || 0
    }));

    result.sort((a, b) => b.value - a.value);

    return res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to get menu popularity data' });
  }
};






