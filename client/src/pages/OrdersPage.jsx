import { useEffect, useState } from 'react';
import { getMyOrders, submitOrderFeedback } from '../api';

const OrdersPage = ({ user }) => {
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState('');
  const [feedbackMap, setFeedbackMap] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('freshdishToken');
    if (!token) {
      setMessage('Login to see your orders.');
      return;
    }
    getMyOrders(token)
      .then((res) => {
        setOrders(res.data);
        const initialFeedback = res.data.reduce((acc, order) => {
          acc[order._id] = order.customerFeedback || '';
          return acc;
        }, {});
        setFeedbackMap(initialFeedback);
      })
      .catch(() => setMessage('Unable to load orders.'));
  }, [user]);

  const handleFeedbackChange = (orderId, value) => {
    setFeedbackMap((prev) => ({ ...prev, [orderId]: value }));
  };

  const submitFeedback = async (orderId) => {
    const token = localStorage.getItem('freshdishToken');
    try {
      const response = await submitOrderFeedback(orderId, feedbackMap[orderId], token);
      setOrders((prev) => prev.map((order) => (order._id === orderId ? response.data : order)));
      setMessage('Feedback submitted successfully.');
    } catch {
      setMessage('Failed to submit feedback.');
    }
  };

  return (
    <section className="orders-panel">
      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>My Orders</h2>
      {message && <div className="alert">{message}</div>}
      {orders.length === 0 ? (
        <p style={{ textAlign: 'center' }}>No orders yet.</p>
      ) : (
        <div className="orders-grid">
          {orders.map((order) => (
            <div key={order._id} className="order-card-ui">
              <h3 style={{ textAlign: 'center', marginBottom: 8 }}>Order #{order._id.slice(-6)}</h3>
              <div className={`track-status-bar status-${order.status?.toLowerCase()}`}>{order.status}</div>
              <div className="order-meta-row">
                <span><strong>Track ID:</strong> <span style={{ fontFamily: 'monospace' }}>{order._id}</span></span>
                <button
                  className="order-copy-btn"
                  onClick={() => { navigator.clipboard.writeText(order._id); }}
                  title="Copy Order ID"
                >Copy</button>
                <a
                  href={`/track?order=${order._id}`}
                  className="order-track-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >Track</a>
              </div>
              <div className="order-details-list">
                <span><strong>Method:</strong> {order.deliveryMethod}</span>
                <span><strong>Total:</strong> ${order.total.toFixed(2)}</span>
                <span><strong>Slot:</strong> {order.timeSlot}</span>
              </div>
              <label style={{ marginTop: 10, fontWeight: 600 }}>Feedback</label>
              <textarea
                className="order-feedback-box"
                value={feedbackMap[order._id] || ''}
                onChange={(e) => handleFeedbackChange(order._id, e.target.value)}
                placeholder="Share your order feedback"
              />
              <button type="button" className="primary-button" style={{ marginTop: 8 }} onClick={() => submitFeedback(order._id)}>
                Submit Feedback
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default OrdersPage;
