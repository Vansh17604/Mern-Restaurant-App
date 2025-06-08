import axios from "axios";
import { config } from "../../../utils/axiosConfig";

const base_url = import.meta.env.VITE_BASE_URL;
const lang=localStorage.getItem('language');

// Create Payment
const createPayment = async (paymentData) => {
  const response = await axios.post(`${base_url}/createpayment?lang=${lang}`, paymentData, config);
  return response.data;
};

// Fetch All Payments
const getAllPayments = async () => {
  const response = await axios.get(`${base_url}/getpayment`, config);
  return response.data;
};
const generateBill = async (paymentId) => {
  const response = await axios.get(`${base_url}/generatebill?paymentid=${paymentId}`, {
    headers: {
      ...config.headers,
      Accept: "application/pdf", // <-- expecting PDF now
    },
    responseType: "blob", // <-- Important for binary files
  });

  // Create a blob from the PDF response
  const blob = new Blob([response.data], { type: "application/pdf" });

  // Create a download link and trigger download
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `payment-bill-${paymentId}.pdf`; // PDF extension
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);

  return "PDF bill download triggered";
};

const fetchPaymentByOrderId = async (orderId) => {
  const response = await axios.get(`${base_url}/getpaymentbyorderid?orderId=${orderId}`, config);
  return response.data;
};

const paymentService = {
  createPayment,
  getAllPayments,
  generateBill,
  fetchPaymentByOrderId
};

export default paymentService;
