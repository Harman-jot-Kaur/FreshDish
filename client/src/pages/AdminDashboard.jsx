
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAdminOrders, updateOrderStatus, fetchMenu, fetchCategories } from '../api';

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const AdminDashboard = ({ user }) => {
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState('');
  const [menu, setMenu] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState(null);
  const [menuForm, setMenuForm] = useState({ name: '', category: '', price: '', description: '' });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('freshdishToken');
    if (!token) {
      setMessage('Session expired or user not found. Please log in again.');
      navigate('/login');
      return;
    }
    fetchAdminOrders(token)
      .then((res) => setOrders(res.data))
      .catch((err) => {
        if (err?.response?.status === 401) {
          localStorage.removeItem('freshdishToken');
          setMessage('Session expired or user not found. Please log in again.');
          navigate('/login');
        } else {
          setMessage('Unable to load admin orders.');
        }
      });
    fetchMenu().then((res) => setMenu(res.data));
    fetchCategories().then((res) => setCategories(res.data));
    fetch(`${API_BASE}/admin/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.status === 401) {
          localStorage.removeItem('freshdishToken');
          setMessage('Session expired or user not found. Please log in again.');
          navigate('/login');
          return null;
        }
        return res.json();
      })
      .then((data) => { if (data) setStats(data); })
      .catch(() => {});
  }, [navigate]);

  const changeStatus = async (orderId, status) => {
    const token = localStorage.getItem('freshdishToken');
    try {
      await updateOrderStatus(orderId, status, token);
      setOrders((prev) => prev.map((order) => (order._id === orderId ? { ...order, status } : order)));
    } catch {
      setMessage('Failed to update order status.');
    }
  };

  // Menu Management
  const handleMenuFormChange = (e) => {
    setMenuForm({ ...menuForm, [e.target.name]: e.target.value });
  };

  const handleMenuSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('freshdishToken');
    try {
      if (editingId) {
        const res = await fetch(`${API_BASE}/menu/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(menuForm),
        });
        const updated = await res.json();
        setMenu((prev) => prev.map((item) => (item._id === editingId ? updated : item)));
        setEditingId(null);
      } else {
        const res = await fetch(`${API_BASE}/menu`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(menuForm),
        });
        const created = await res.json();
        setMenu((prev) => [...prev, created]);
      }
      setMenuForm({ name: '', category: '', price: '', description: '' });
    } catch {
      setMessage('Failed to save menu item.');
    }
    setLoading(false);
  };

  const handleEditMenu = (item) => {
    setMenuForm({ name: item.name, category: item.category, price: item.price, description: item.description || '' });
    setEditingId(item._id);
  };

  const handleDeleteMenu = async (id) => {
    if (!window.confirm('Delete this menu item?')) return;
    setLoading(true);
    const token = localStorage.getItem('freshdishToken');
    try {
      const res = await fetch(`${API_BASE}/menu/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        setMessage(errorData.message || 'Failed to delete menu item.');
      } else {
        setMenu((prev) => prev.filter((item) => item._id !== id));
      }
    } catch (err) {
      setMessage('Failed to delete menu item.');
    }
    setLoading(false);
  };

  return (
    <section className="page-panel" style={{ maxWidth: 1100, margin: '0 auto', padding: 32 }}>
      <h2 style={{ marginBottom: 24 }}>Admin Dashboard</h2>
      {message && <div className="alert">{message}</div>}

      {/* Stats Panel - Only for Admin */}
      {user?.role === 'admin' && stats && (
        <div className="admin-stats" style={{ marginBottom: 32, padding: 16, background: '#f7f8fa', borderRadius: 12 }}>
          <h3 style={{ marginBottom: 12 }}>Order Stats</h3>
          <ul style={{ display: 'flex', gap: 32, listStyle: 'none', padding: 0, margin: 0 }}>
            <li><strong>Total Orders:</strong> {stats.orderCount}</li>
            <li><strong>Pending:</strong> {stats.pendingCount}</li>
            <li><strong>Ready:</strong> {stats.readyCount}</li>
            <li><strong>Completed:</strong> {stats.completedCount}</li>
          </ul>
        </div>
      )}

      {/* Menu Management Panel - Only for Admin */}
      {user?.role === 'admin' && (
        <div className="admin-menu-panel" style={{ marginBottom: 40, padding: 16, background: '#f7f8fa', borderRadius: 12 }}>
          <h3 style={{ marginBottom: 16 }}>Menu Management</h3>
          <form onSubmit={handleMenuSubmit} className="menu-form" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 18 }}>
            <input
              name="name"
              value={menuForm.name}
              onChange={handleMenuFormChange}
              placeholder="Name"
              required
              style={{ flex: '1 1 160px', minWidth: 120, padding: 8, borderRadius: 6, border: '1px solid #ddd' }}
            />
            <input
              name="category"
              value={menuForm.category}
              onChange={handleMenuFormChange}
              placeholder="Category"
              list="category-list"
              required
              style={{ flex: '1 1 140px', minWidth: 100, padding: 8, borderRadius: 6, border: '1px solid #ddd' }}
            />
            <datalist id="category-list">
              {categories.map((cat) => (
                <option key={cat} value={cat} />
              ))}
            </datalist>
            <input
              name="price"
              type="number"
              value={menuForm.price}
              onChange={handleMenuFormChange}
              placeholder="Price"
              required
              min="0"
              step="0.01"
              style={{ flex: '1 1 100px', minWidth: 80, padding: 8, borderRadius: 6, border: '1px solid #ddd' }}
            />
            <input
              name="description"
              value={menuForm.description}
              onChange={handleMenuFormChange}
              placeholder="Description"
              style={{ flex: '2 1 220px', minWidth: 120, padding: 8, borderRadius: 6, border: '1px solid #ddd' }}
            />
            <button type="submit" disabled={loading} style={{ padding: '8px 18px', borderRadius: 6, background: '#ff7f32', color: '#fff', border: 'none', fontWeight: 600 }}>{editingId ? 'Update' : 'Add'} Item</button>
            {editingId && <button type="button" style={{ padding: '8px 18px', borderRadius: 6, background: '#bbb', color: '#fff', border: 'none', fontWeight: 600 }} onClick={() => { setEditingId(null); setMenuForm({ name: '', category: '', price: '', description: '' }); }}>Cancel</button>}
          </form>
          <div className="menu-list" style={{ maxHeight: 260, overflowY: 'auto', background: '#fff', borderRadius: 8, padding: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
            {menu.map((item) => (
              <div key={item._id} className="menu-list-item" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #eee' }}>
                <span><strong>{item.name}</strong> <span style={{ color: '#888' }}>({item.category})</span> - ${item.price}</span>
                <span style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => handleEditMenu(item)} style={{ padding: '4px 14px', borderRadius: 6, background: '#1976d2', color: '#fff', border: 'none', fontWeight: 500 }}>Edit</button>
                  <button onClick={() => handleDeleteMenu(item._id)} style={{ padding: '4px 14px', borderRadius: 6, background: '#d32f2f', color: '#fff', border: 'none', fontWeight: 500 }}>Delete</button>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Divider */}
      <hr style={{ margin: '32px 0', border: 0, borderTop: '1.5px solid #eee' }} />

      {/* Order Management Panel */}
      <div className="orders-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
        <h3 style={{ gridColumn: '1/-1', marginBottom: 0 }}>Order Management</h3>
        {orders.map((order) => (
          <div key={order._id} className="order-card admin-card" style={{ background: '#fff', borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: 18, marginBottom: 0 }}>
            <h4 style={{ margin: '0 0 8px' }}>Order #{order._id.slice(-6)}</h4>
            <p style={{ margin: '0 0 4px' }}><strong>User:</strong> {order.user?.name || 'Unknown'}</p>
            <p style={{ margin: '0 0 4px' }}><strong>Status:</strong> {order.status}</p>
            <p style={{ margin: '0 0 4px' }}><strong>Method:</strong> {order.deliveryMethod}</p>
            <p style={{ margin: '0 0 8px' }}><strong>Feedback:</strong> {order.customerFeedback || 'No feedback yet'}</p>
            <div className="status-actions" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['pending', 'preparing', 'ready', 'completed', 'cancelled'].map((status) => (
                <button key={status} onClick={() => changeStatus(order._id, status)} style={{ padding: '6px 14px', borderRadius: 6, background: '#ff7f32', color: '#fff', border: 'none', fontWeight: 500 }}>{status}</button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AdminDashboard;
