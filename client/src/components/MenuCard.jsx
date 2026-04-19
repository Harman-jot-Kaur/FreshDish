

import React from 'react';
import { useState } from 'react';

const MenuCard = ({ item, onAdd }) => {
  const [showModal, setShowModal] = useState(false);
  let imgSrc = item.image;
  if (imgSrc && typeof imgSrc === 'object' && imgSrc.default) {
    imgSrc = imgSrc.default;
  }
  const handleImgError = (e) => {
    e.target.onerror = null;
    e.target.src = 'https://via.placeholder.com/180?text=No+Image';
    e.target.style.border = '2px solid #ccc'; // Use neutral border color
  };

  return (
    <>
      <article
        className="menu-card"
        style={{ cursor: 'pointer' }}
        onClick={e => {
          // Only open modal if the click is directly on the card, not on the button
          if (e.target.closest('button')) return;
          setShowModal(true);
        }}
      >
        {/* Show image for all categories, including Vegetarian */}
        <img
          src={imgSrc || 'https://via.placeholder.com/180'}
          alt={item.name}
          style={{ border: '2px solid #ccc', borderRadius: '16px' }}
          onError={handleImgError}
        />
        <div className="menu-info">
          <h3>{item.name}</h3>
          <p>{item.description}</p>
          <div className="menu-meta">
            <span>${Number(item.price || 0).toFixed(2)}</span>
            {item.popular && <span className="badge">Popular</span>}
          </div>
          <button onClick={() => onAdd(item)}>Add to Cart</button>
        </div>
      </article>
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}
          onClick={() => setShowModal(false)}
        >
          <div style={{ background: '#fff', borderRadius: 16, padding: 32, minWidth: 320, maxWidth: 400, boxShadow: '0 8px 32px rgba(0,0,0,0.18)', position: 'relative' }} onClick={e => e.stopPropagation()}>
            {/* Show image in modal for all categories */}
            <img src={imgSrc || 'https://via.placeholder.com/180'} alt={item.name} style={{ width: '100%', borderRadius: 12, marginBottom: 16 }} />
            <h2 style={{ margin: '0 0 12px' }}>{item.name}</h2>
            <p style={{ margin: '0 0 12px' }}>{item.description}</p>
            <div style={{ marginBottom: 12 }}><strong>Price:</strong> ${Number(item.price || 0).toFixed(2)}</div>
            {item.popular && <div style={{ marginBottom: 12 }}><span className="badge">Popular</span></div>}
            <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: 12, right: 16, background: 'none', border: 'none', fontSize: 22, cursor: 'pointer' }}>&times;</button>
          </div>
        </div>
      )}
    </>
  );
};

export default MenuCard;
