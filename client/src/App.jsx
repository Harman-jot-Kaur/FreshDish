

import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './components/NavBar';
import Login from './pages/Login';
import Register from './pages/Register';
import MenuPage from './pages/MenuPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import TrackPage from './pages/TrackPage';
import AdminDashboard from './pages/AdminDashboard';
import KitchenDashboard from './pages/KitchenDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import { getProfile } from './api';
import { parseJwt } from './utils';
import { useNavigate } from 'react-router-dom';


function App() {
  const [user, setUser] = useState(null);
  const [sessionError, setSessionError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('freshdishToken');
    if (!token) {
      setLoading(false);
      return;
    }
    // Check JWT expiration
    const payload = parseJwt(token);
    if (payload && payload.exp) {
      const now = Math.floor(Date.now() / 1000);
      if (payload.exp < now) {
        localStorage.removeItem('freshdishToken');
        setSessionError("Session ended. Please log in again.");
        setUser(null);
        setLoading(false);
        return;
      }
    }
    getProfile(token)
      .then((response) => {
        if (response?.data?.user) {
          setUser(response.data.user);
        } else {
          localStorage.removeItem('freshdishToken');
          setSessionError("Session expired or user not found. Please log in again.");
          setUser(null);
        }
        setLoading(false);
      })
      .catch(() => {
        localStorage.removeItem('freshdishToken');
        setSessionError("Session expired or user not found. Please log in again.");
        setUser(null);
        setLoading(false);
      });
    // eslint-disable-next-line
  }, []);

  if (loading) {
    return <div className="app-shell"><div className="main-content"><div style={{textAlign:'center',marginTop:40}}>Loading...</div></div></div>;
  }

  return (
    <div className="app-shell">
      <NavBar user={user} setUser={setUser} />
      {sessionError && (
        <div className="alert" style={{ margin: '1rem', color: 'red', textAlign: 'center' }}>{sessionError}</div>
      )}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Navigate to="/menu" />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register setUser={setUser} />} />
          <Route path="/menu" element={<MenuPage user={user} />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage user={user} />} />
          <Route
            path="/orders"
            element={
              <ProtectedRoute user={user}>
                <OrdersPage user={user} />
              </ProtectedRoute>
            }
          />
          <Route path="/track" element={<TrackPage />} />
          <Route
            path="/admin"
            element={
              <AdminRoute user={user} loading={loading}>
                <AdminDashboard user={user} />
              </AdminRoute>
            }
          />
          <Route
            path="/kitchen"
            element={
              <AdminRoute user={user} kitchenOnly={true}>
                <KitchenDashboard />
              </AdminRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
