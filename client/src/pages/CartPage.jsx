import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const getCart = () => JSON.parse(localStorage.getItem('freshdishCart') || '[]');

const CartPage = () => {
  const [cart, setCart] = useState(getCart());

  useEffect(() => {
    setCart(getCart());
  }, []);

  const updateQuantity = (id, diff) => {
    const updated = cart.map((item) => {
      if (item.menuItem === id) {
        return { ...item, quantity: Math.max(1, item.quantity + diff) };
      }
      return item;
    });
    localStorage.setItem('freshdishCart', JSON.stringify(updated));
    setCart(updated);
  };

  const removeItem = (id) => {
    const updated = cart.filter((item) => item.menuItem !== id);
    localStorage.setItem('freshdishCart', JSON.stringify(updated));
    setCart(updated);
  };

  const total = cart.reduce((sum, item) => sum + item.quantity * (item.price || 0), 0);

  return (
    <section className="cart-page">
      <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Your Cart</h2>
      {cart.length === 0 ? (
        <p style={{ textAlign: 'center' }}>Your cart is empty. Start browsing the menu.</p>
      ) : (
        <div className="cart-flex-container">
          <div className="cart-list">
            {cart.map((item) => (
              <div key={item.menuItem} className="cart-item-card" style={{ display: 'flex', alignItems: 'center' }}>
                {item.image && !item.name.toLowerCase().includes('combo') && (
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px', marginRight: '16px' }}
                  />
                )}
                <div className="cart-item-info" style={{ flex: 1 }}>
                  <strong style={{ fontSize: '1.1rem' }}>{item.name}</strong>
                  <div className="cart-item-details">
                    <span>Qty: {item.quantity}</span>
                    <span style={{ color: 'var(--muted)', fontSize: '0.98rem' }}>${item.price?.toFixed(2)}</span>
                  </div>
                </div>
                <div className="cart-controls">
                  <button className="cart-qty-btn" onClick={() => updateQuantity(item.menuItem, -1)}>-</button>
                  <button className="cart-qty-btn" onClick={() => updateQuantity(item.menuItem, 1)}>+</button>
                  <button className="cart-remove-btn" onClick={() => removeItem(item.menuItem)}>Remove</button>
                </div>
              </div>
            ))}
          </div>
          <div className="cart-summary-card">
            <h3>Summary</h3>
            <p>Total items: <strong>{cart.length}</strong></p>
            <p>Total amount: <strong>${total.toFixed(2)}</strong></p>
            <Link to="/checkout" className="primary-button" style={{ marginTop: '1.2rem' }}>Checkout</Link>
          </div>
        </div>
      )}
    </section>
  );
};

export default CartPage;
