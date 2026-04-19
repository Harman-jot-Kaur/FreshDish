import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getOrderById, submitOrderFeedback } from '../api';

const TrackPage = () => {
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState(null);
  const [message, setMessage] = useState('Enter an order ID to track status.');
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [feedbackMsg, setFeedbackMsg] = useState("");

  useEffect(() => {
    const urlOrderId = searchParams.get('order');
    if (urlOrderId) setOrderId(urlOrderId);
  }, [searchParams]);

  const handleTrack = async () => {
    setOrder(null);
    setMessage("");
    setLoading(true);
    const token = localStorage.getItem('freshdishToken');
    if (!orderId) {
      setMessage('Please enter an order ID.');
      setLoading(false);
      return;
    }
    if (!token) {
      setMessage('You must be logged in to track your order.');
      setLoading(false);
      return;
    }
    try {
      const res = await getOrderById(orderId, token);
      setOrder(res.data);
      setMessage("");
    } catch (e) {
      setMessage('Unable to retrieve order status.');
    }
    setLoading(false);
  };

  return (
    <div className="track-center-bg">
      <section className="track-card-panel">
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Order Tracking</h2>
        <div className="track-input-row">
          <input
            type="text"
            placeholder="Enter your order ID"
            value={orderId}
            onChange={e => setOrderId(e.target.value)}
            className="track-input"
          />
          <button onClick={handleTrack} disabled={loading} className="primary-button" style={{ minWidth: 130 }}>
            {loading ? 'Tracking...' : 'Track Order'}
          </button>
        </div>
        {message && !order && <div className="alert" style={{ marginTop: '1.2rem' }}>{message}</div>}
        {order ? (
          <div className="track-order-card">
            <h3 style={{ textAlign: 'center', marginBottom: 8 }}>Order #{order._id.slice(-6)}</h3>
            <div className={`track-status-bar status-${order.status?.toLowerCase()}`}>{order.status}</div>
            <p><strong>Pickup/Delivery:</strong> {order.deliveryMethod}</p>
            <p><strong>Time slot:</strong> {order.timeSlot}</p>
            <p><strong>Total:</strong> ${order.total.toFixed(2)}</p>
            <div style={{ marginTop: 18 }}>
              <h4>Items</h4>
              {order.items.map((item) => (
                <div key={item.menuItem} className="track-item">
                  {item.name} × {item.quantity}
                </div>
              ))}
            </div>
            <div style={{ marginTop: 24 }}>
              <h4>Submit Feedback</h4>
              <textarea
                value={feedback}
                onChange={e => setFeedback(e.target.value)}
                placeholder="Write your feedback..."
                rows={3}
                style={{ width: '100%', borderRadius: 8, border: '1px solid #dce1ea', padding: 8, fontSize: '1rem', marginBottom: 8 }}
              />
              <button
                onClick={async () => {
                  setFeedbackMsg("");
                  const token = localStorage.getItem('freshdishToken');
                  try {
                    await submitOrderFeedback(order._id, feedback, token);
                    setFeedbackMsg("Feedback submitted! Thank you.");
                    setFeedback("");
                  } catch (e) {
                    setFeedbackMsg("Failed to submit feedback.");
                  }
                }}
                style={{ padding: '0.6rem 1.2rem', borderRadius: 8, background: '#f17f3d', color: '#fff', border: 'none', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}
                disabled={!feedback.trim()}
              >
                Submit Feedback
              </button>
              {feedbackMsg && <div style={{ marginTop: 8, color: feedbackMsg.includes('Thank') ? 'green' : 'red' }}>{feedbackMsg}</div>}
            </div>
          </div>
        ) : (
          <p>Use the order link after checkout to view live updates.</p>
        )}
      </section>
    </div>
  );
};

export default TrackPage;
