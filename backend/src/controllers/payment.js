const Payment = require ('../models/payment');
const Order = require('../models/order');
const Dish = require('../models/dish');
const puppeteer = require('puppeteer');
const Table = require('../models/table');
const {check,validationResult}= require("express-validator");


const generateBillNo = () => {
  return "BILL-" + Math.floor(100000 + Math.random() * 900000);
};

// Language translations
const translations = {
  en: {
    receipt: "Receipt",
    date: "Date:",
    time: "Time:",
    billNo: "Bill #:",
    customer: "Customer:",
    itemDescription: "Item Description",
    amount: "Amount",
    qty: "Qty:",
    totalAmount: "TOTAL AMOUNT:",
    thankYou: "Thank you for your business",
    businessLicense: "Business License:",
    taxId: "Tax ID:",
    orderStatus: "Order Status:",
    paymentType: "Payment Type:",
    retainReceipt: "Please retain this receipt for your records.",
    returnPolicy: "Returns accepted within 24 hours with receipt.",
    companyName: "Restaurant & Co.",
    companyAddress: {
      street: "123 Food Street",
      city: "Culinary District, CA 90210",
      phone: "Tel: (555) 123-4567"
    }
  },
  es: {
    receipt: "Recibo",
    date: "Fecha:",
    time: "Hora:",
    billNo: "Factura #:",
    customer: "Cliente:",
    itemDescription: "Descripción del Artículo",
    amount: "Cantidad",
    qty: "Cant:",
    totalAmount: "CANTIDAD TOTAL:",
    thankYou: "Gracias por su compra",
    businessLicense: "Licencia Comercial:",
    taxId: "ID Fiscal:",
    orderStatus: "Estado del Pedido:",
    paymentType: "Tipo de Pago:",
    retainReceipt: "Por favor conserve este recibo para sus registros.",
    returnPolicy: "Devoluciones aceptadas dentro de 24 horas con recibo.",
    companyName: "Restaurante & Co.",
    companyAddress: {
      street: "123 Calle de Comida",
      city: "Distrito Culinario, CA 90210",
      phone: "Tel: (555) 123-4567"
    }
  }
};

const generateReceiptHTML = (billData, orderData, dishesData, lang = 'en') => {
  const t = translations[lang] || translations.en;
  
  const formatDate = (date) => {
    const locale = lang === 'es' ? 'es-ES' : 'en-US';
    return new Date(date).toLocaleDateString(locale, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const formatTime = (date) => {
    const locale = lang === 'es' ? 'es-ES' : 'en-US';
    return new Date(date).toLocaleTimeString(locale, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const calculateSubtotal = () => {
    return dishesData.reduce((total, dish) => {
      const orderDish = orderData.dishes.find(d => d.dish_id.toString() === dish._id.toString());
      return total + (dish.price * orderDish.quantity);
    }, 0);
  };

  const subtotal = calculateSubtotal();
  const taxRate = 0.0825; // 8.25%
  const serviceRate = 0.18; // 18%
  const tax = subtotal * taxRate;
  const service = subtotal * serviceRate;
  const total = subtotal + tax + service;

  const dishRows = dishesData.map(dish => {
    const orderDish = orderData.dishes.find(d => d.dish_id.toString() === dish._id.toString());
    const itemTotal = dish.price * orderDish.quantity;
    
    // Use the appropriate language for dish name and description
    const dishName = dish.dishName[lang] || dish.dishName.en || dish.dishName;
    const dishDescription = dish.description[lang] || dish.description.en || dish.description;
    
    return `
      <tr>
        <td>
          <div class="item-name">${dishName}</div>
          <div class="item-description">${dishDescription} (${t.qty} ${orderDish.quantity})</div>
        </td>
        <td class="item-price">${dish.currency} ${itemTotal.toFixed(2)}</td>
      </tr>
    `;
  }).join('');

  return `
<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${t.receipt} - ${billData.billno}</title>
<style>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    background: #f5f5f5;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    padding: 30px 20px;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .receipt {
    background: white;
    border: 2px solid #e0e0e0;
    padding: 40px;
    max-width: 450px;
    width: 100%;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    position: relative;
  }

  .receipt-header {
    text-align: center;
    margin-bottom: 30px;
    padding-bottom: 20px;
    border-bottom: 3px double #333;
  }

  .company-name {
    font-size: 28px;
    font-weight: 700;
    color: #1a1a1a;
    margin-bottom: 8px;
    letter-spacing: 1px;
    text-transform: uppercase;
  }

  .company-address {
    color: #555;
    font-size: 13px;
    line-height: 1.5;
    font-weight: 500;
  }

  .receipt-title {
    text-align: center;
    font-size: 24px;
    font-weight: 700;
    color: #1a1a1a;
    margin: 25px 0;
    text-transform: uppercase;
    letter-spacing: 2px;
    border-top: 2px solid #333;
    border-bottom: 2px solid #333;
    padding: 15px 0;
  }

  .receipt-info {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
    margin-bottom: 25px;
    padding: 15px;
    background: #f9f9f9;
    border: 1px solid #ddd;
  }

  .info-item {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
  }

  .info-label {
    font-weight: 600;
    color: #333;
  }

  .info-value {
    font-weight: 500;
    color: #666;
    font-family: 'Courier New', monospace;
  }

  .items-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
  }

  .items-table th {
    background: #f0f0f0;
    padding: 12px 8px;
    text-align: left;
    font-weight: 700;
    font-size: 13px;
    color: #333;
    border-bottom: 2px solid #333;
    text-transform: uppercase;
  }

  .items-table th:last-child {
    text-align: right;
  }

  .items-table td {
    padding: 10px 8px;
    border-bottom: 1px solid #eee;
    font-size: 14px;
  }

  .item-name {
    font-weight: 600;
    color: #333;
  }

  .item-description {
    font-size: 12px;
    color: #666;
    font-style: italic;
    margin-top: 2px;
  }

  .item-price {
    text-align: right;
    font-weight: 600;
    color: #333;
    font-family: 'Courier New', monospace;
  }

  .totals-section {
    border-top: 2px solid #333;
    padding-top: 15px;
    margin-top: 20px;
  }

  .total-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 0;
    font-size: 14px;
  }

  .total-row.final-total {
    border-top: 2px solid #333;
    font-size: 18px;
    font-weight: 700;
    color: #1a1a1a;
    margin-top: 10px;
    padding-top: 10px;
  }

  .total-label {
    font-weight: 600;
    color: #333;
  }

  .total-value {
    font-weight: 600;
    color: #333;
    font-family: 'Courier New', monospace;
  }

  .receipt-footer {
    text-align: center;
    margin-top: 30px;
    padding-top: 20px;
    border-top: 3px double #333;
  }

  .business-info {
    font-size: 12px;
    color: #666;
    line-height: 1.4;
    margin-bottom: 15px;
  }

  .thank-you {
    font-size: 14px;
    font-weight: 600;
    color: #333;
    margin-bottom: 5px;
  }

  .return-policy {
    font-size: 11px;
    color: #888;
    margin-top: 10px;
    font-style: italic;
  }

  .payment-info {
    background: #f0f8ff;
    padding: 10px;
    margin: 15px 0;
    border-left: 4px solid #007bff;
    font-size: 13px;
  }

  @media (max-width: 480px) {
    body {
      padding: 15px 10px;
    }
    
    .receipt {
      padding: 25px 20px;
    }
    
    .company-name {
      font-size: 22px;
    }
    
    .receipt-info {
      grid-template-columns: 1fr;
      gap: 10px;
    }
    
    .items-table th,
    .items-table td {
      padding: 8px 4px;
    }
  }
</style>
</head>
<body>
  <div class="receipt">
    <div class="receipt-header">
      <div class="company-name">${t.companyName}</div>
      <div class="company-address">
        <div>${t.companyAddress.street}</div>
        <div>${t.companyAddress.city}</div>
        <div>${t.companyAddress.phone}</div>
      </div>
    </div>

    <div class="receipt-title">${t.receipt}</div>

    <div class="receipt-info">
      <div class="info-item">
        <span class="info-label">${t.date}</span>
        <span class="info-value">${formatDate(billData.paymentdate)}</span>
      </div>
      <div class="info-item">
        <span class="info-label">${t.time}</span>
        <span class="info-value">${formatTime(billData.paymentdate)}</span>
      </div>
      <div class="info-item">
        <span class="info-label">${t.billNo}</span>
        <span class="info-value">${billData.billno}</span>
      </div>
      <div class="info-item">
        <span class="info-label">${t.customer}</span>
        <span class="info-value">${billData.customername}</span>
      </div>
    </div>

    <table class="items-table">
      <thead>
        <tr>
          <th>${t.itemDescription}</th>
          <th>${t.amount}</th>
        </tr>
      </thead>
      <tbody>
        ${dishRows}
      </tbody>
    </table>

    <div class="totals-section">
      <div class="total-row final-total">
        <div class="total-label">${t.totalAmount}</div>
        <div class="total-value">€${billData.amount.toFixed(2)}</div>
      </div>
    </div>

    <div class="receipt-footer">
      <div class="business-info">
        ${t.businessLicense} #BL-2024-5567<br>
        ${t.taxId} 12-3456789<br>
        ${t.orderStatus} ${orderData.orderstatus.toUpperCase()}<br>
        ${t.paymentType} ${billData.paymentmethod.toUpperCase()}  
      </div>
      
      <div class="thank-you">${t.thankYou}, ${billData.customername}!</div>
      
      <div class="return-policy">
        ${t.retainReceipt}<br>
        ${t.returnPolicy}
      </div>
    </div>
  </div>
</body>
</html>
  `;
};

module.exports.CreatePayment = [
  check("orderid").notEmpty().withMessage("Order ID is required"),
  check("customername").notEmpty().withMessage("Customer name is required"),
  check("paymentmethod").notEmpty().withMessage("Payment method is required"),
  check("paymentdate").notEmpty().isISO8601().toDate().withMessage("Valid payment date is required"),
  check("amount").isNumeric().withMessage("Amount must be a number"),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    const { orderid, customername, paymentmethod, paymentdate, amount } = req.body;
    const lang = req.query.lang || 'en'; // Get language from query parameter, default to 'en'

    try {
      // Find the order
      const order = await Order.findById(orderid);
      if (!order) {
        const errorMsg = lang === 'es' ? "Pedido no encontrado" : "Order not found";
        return res.status(404).json({ msg: errorMsg });
      }

      // Create Payment
      const billno = generateBillNo();
      const existingpayment = await Payment.findOne({orderid});
      if(existingpayment){
        const errorMsg = lang === 'es' ? "El pago ya fue realizado para este pedido" : "Payment already made for this order";
        return res.status(400).json({ msg: errorMsg });
      }

      const newPayment = new Payment({
        orderid,
        customername,
        paymentmethod,
        paymentstatus: "Complete",
        paymentdate,
        billno,
        amount
      });
      const savedPayment = await newPayment.save();

      // Unassign the waiter and mark table as available
      const table = await Table.findById(order.tableid);
      if (table) {
        table.waiter_id = null;
        table.tablestatus = "Available";
        await table.save();
      }

      // Get dishes data for receipt generation
      const dishIds = order.dishes.map(dish => dish.dish_id);
      const dishesData = await Dish.find({ _id: { $in: dishIds } });

      // Generate receipt HTML with the specified language
      const receiptHTML = generateReceiptHTML(savedPayment, order, dishesData, lang);

      const successMsg = lang === 'es' ? "Pago registrado y mesa liberada" : "Payment recorded and table unassigned";

      res.status(201).json({
        msg: successMsg,
        payment: savedPayment,
        tableUpdated: !!table,
        receiptHTML: receiptHTML
      });
    } catch (err) {
      console.error("Error:", err.message);
      const errorMsg = lang === 'es' ? "Error del servidor" : "Server error";
      res.status(500).json({ msg: errorMsg });
    }
  }
];

module.exports.FetchAllPayments = [
    async (req, res) =>
        {
            try {
                const payments = await Payment.find().sort({ date: -1 });
                res.json(payments);
                } catch (err) {
                    console.error("Error fetching payments:", err.message);
                    res.status(500).json({ msg: "Server error" });
                    }
                    }
]
module.exports.FetchPaymentByOrderId = [
  async (req, res) => {
    try {
      const { orderId } = req.query;

      if (!orderId) {
        return res.status(400).json({ msg: "orderId is required" });
      }

      const payment = await Payment.findOne({ orderid: orderId });

      if (!payment) {
        return res.status(404).json({ msg: "Payment not found" });
      }

      res.json(payment);
    } catch (err) {
      console.error("Error fetching payment by orderId:", err.message);
      res.status(500).json({ msg: "Server error" });
    }
  }
];


module.exports.GenerateBill = async (req, res) => {
  const { paymentid, lang  } = req.query;

  if (!paymentid) {
    return res.status(400).json({ msg: "Payment ID is required" });
  }

  try {
    const billData = await Payment.findById(paymentid);
    if (!billData) {
      return res.status(404).json({ msg: "Payment not found" });
    }

    const orderData = await Order.findById(billData.orderid);
    if (!orderData) {
      return res.status(404).json({ msg: "Order not found for this payment" });
    }

    const dishIds = orderData.dishes.map(d => d.dish_id);
    const dishesData = await Dish.find({ _id: { $in: dishIds } });

    // ✅ Pass lang to generateReceiptHTML
    const receiptHTML = generateReceiptHTML(billData, orderData, dishesData, lang);

    const browser = await puppeteer.launch({
      headless: 'new',
    });
    const page = await browser.newPage();

    await page.setContent(receiptHTML, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'A2',
      printBackground: true,
    });

    await browser.close();

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="bill-${paymentid}.pdf"`,
    });

    return res.send(pdfBuffer);
  } catch (err) {
    console.error("Error generating PDF bill:", err.message);
    return res.status(500).json({ msg: "Server error generating bill" });
  }
};
