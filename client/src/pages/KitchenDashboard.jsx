import { useEffect, useState } from 'react';
import { fetchKitchenOrders, updateOrderStatus } from '../api';

const KitchenDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('freshdishToken');
    fetchKitchenOrders(token)
      .then((res) => setOrders(res.data))
      .catch(() => setMessage('Unable to load kitchen orders.'));
  }, []);

  const updateStatus = async (orderId, status) => {
    const token = localStorage.getItem('freshdishToken');
    try {
      await updateOrderStatus(orderId, status, token);
      setOrders((prev) => prev.map((order) => (order._id === orderId ? { ...order, status } : order)));
    } catch {
      setMessage('Status update failed.');
    }
  };

  return (
    <section className="kitchen-panel">
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Kitchen Dashboard</h2>
      <p style={{ textAlign: 'center', marginBottom: '2rem' }}>Quickly move orders through preparation and ready status.</p>
      {message && <div className="alert">{message}</div>}
      <div className="kitchen-orders-grid">
        {orders
          .filter((order) => ['pending', 'preparing'].includes(order.status))
          .map((order) => (
            <div key={order._id} className="kitchen-order-card">
              <h3 style={{ textAlign: 'center', marginBottom: 8 }}>Order #{order._id.slice(-6)}</h3>
              <div className={`track-status-bar status-${order.status?.toLowerCase()}`}>{order.status}</div>
              <div className="kitchen-btn-row">
                <button
                  className={`kitchen-status-btn${order.status === 'preparing' ? ' active' : ''}`}
                  onClick={() => updateStatus(order._id, 'preparing')}
                  disabled={order.status === 'preparing'}
                >Preparing</button>
                <button
                  className={`kitchen-status-btn${order.status === 'ready' ? ' active' : ''}`}
                  onClick={() => updateStatus(order._id, 'ready')}
                  disabled={order.status === 'ready'}
                >Ready</button>
              </div>
            </div>
          ))}
      </div>
    </section>
  );
};

export default KitchenDashboard;
