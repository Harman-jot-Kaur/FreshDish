import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

// Combos
export const fetchCombos = () => api.get("/combos");

export const login = (data) => api.post("/auth/login", data);
export const register = (data) => api.post("/auth/register", data);
export const getProfile = (token) =>
  api.get("/auth/profile", { headers: { Authorization: `Bearer ${token}` } });
export const fetchMenu = () => api.get("/menu");
export const fetchCategories = () => api.get("/menu/categories");
export const fetchSuggestions = () => api.get("/suggestions");
export const createOrder = (data, token) =>
  api.post("/orders", data, { headers: { Authorization: `Bearer ${token}` } });
export const getMyOrders = (token) =>
  api.get("/orders/mine", { headers: { Authorization: `Bearer ${token}` } });
export const getOrderById = (id, token) =>
  api.get(`/orders/${id}`, { headers: { Authorization: `Bearer ${token}` } });
export const fetchAdminOrders = (token) =>
  api.get("/admin/orders", { headers: { Authorization: `Bearer ${token}` } });

export const fetchKitchenOrders = (token) =>
  api.get("/orders/kitchen", { headers: { Authorization: `Bearer ${token}` } });
export const updateOrderStatus = (id, status, token) =>
  api.put(
    `/orders/${id}/status`,
    { status },
    { headers: { Authorization: `Bearer ${token}` } },
  );
export const submitOrderFeedback = (id, feedback, token) =>
  api.put(
    `/orders/${id}/feedback`,
    { feedback },
    { headers: { Authorization: `Bearer ${token}` } },
  );
