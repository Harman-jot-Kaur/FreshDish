import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../api';

// Helper to check for valid MongoDB ObjectId
function isValidObjectId(id) {
  return typeof id === 'string' && /^[a-fA-F0-9]{24}$/.test(id);
}

const getCart = () => {
  const cart = JSON.parse(localStorage.getItem('freshdishCart') || '[]');
  // Filter out invalid items
  const validCart = cart.filter(item => isValidObjectId(item._id || item.menuItem));
  if (validCart.length !== cart.length) {
    localStorage.setItem('freshdishCart', JSON.stringify(validCart));
  }
  return validCart;
};


const CheckoutPage = ({ user }) => {
  const [cart, setCart] = useState(getCart());
  const [deliveryMethod, setDeliveryMethod] = useState('pickup');
  const [address, setAddress] = useState('');
  const [timeSlot, setTimeSlot] = useState('12:00 - 12:30');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setCart(getCart());
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setMessage('Please login before placing an order.');
      return;
    }
    if (deliveryMethod === 'delivery' && !address) {
      setMessage('Please enter delivery address.');
      return;
    }
    try {
      const token = localStorage.getItem('freshdishToken');
      const response = await createOrder(
        {
          items: cart.map(item => ({
            menuItem: item._id || item.menuItem,
            quantity: item.quantity || 1,
            addOns: item.addOns || [],
          })),
          deliveryMethod,
          address,
          timeSlot,
        },
        token
      );
      localStorage.removeItem('freshdishCart');
      navigate(`/track?order=${response.data._id}`);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Order creation failed');
    }
  };

  // Calculate total
  const total = cart.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);

  return (
    <div className="checkout-bg">
      <section className="checkout-card">
        <h2 style={{ textAlign: 'center', marginBottom: '1.2rem' }}>Checkout</h2>
        <div className="checkout-flex">
          <form className="checkout-form" onSubmit={handleSubmit}>
            <div className="checkout-form-section">
              <div className="checkout-label">Delivery Method</div>
              <select className="checkout-input" value={deliveryMethod} onChange={(e) => setDeliveryMethod(e.target.value)}>
                <option value="pickup">Pickup</option>
                <option value="delivery">Delivery</option>
              </select>
            </div>
            {deliveryMethod === 'delivery' && (
              <div className="checkout-form-section">
                <div className="checkout-label">Delivery Address</div>
                <input className="checkout-input" type="text" value={address} onChange={(e) => setAddress(e.target.value)} required />
              </div>
            )}
            <div className="checkout-form-section">
              <div className="checkout-label">Time Slot</div>
              <select className="checkout-input" value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)}>
                <option>12:00 - 12:30</option>
                <option>12:30 - 13:00</option>
                <option>13:00 - 13:30</option>
                <option>18:00 - 18:30</option>
                <option>18:30 - 19:00</option>
              </select>
            </div>
            {message && <div className="alert" style={{ marginBottom: '1rem' }}>{message}</div>}
            <button type="submit" className="checkout-btn">Place Order</button>
          </form>
          <div className="checkout-summary">
            <h3>Order Summary</h3>
            <div className="checkout-summary-list">
              {cart.length === 0 ? (
                <div className="checkout-summary-empty">Your cart is empty.</div>
              ) : (
                cart.map(item => (
                  <div key={item._id || item.menuItem} className="checkout-summary-item">
                    <span>{item.name} × {item.quantity}</span>
                    <span>${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</span>
                  </div>
                ))
              )}
            </div>
            <div className="checkout-summary-total">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default CheckoutPage;
