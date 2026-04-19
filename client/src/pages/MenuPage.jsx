import { useEffect, useState } from 'react';
import { fetchMenu, fetchSuggestions } from '../api';
import MenuCard from '../components/MenuCard';
import heroImage from '../assets/hero-img.jpg';

const getCart = () => JSON.parse(localStorage.getItem('freshdishCart') || '[]');

const fallbackMenu = [
  { _id: 'fallback-veg-spring-rolls', name: 'Veg Spring Rolls', description: 'Crispy rolls filled with mixed vegetables.', category: 'Vegetarian', subCategory: 'Starters', price: 5.99, isVeg: true, popular: true },
  { _id: 'fallback-paneer-tikka', name: 'Paneer Tikka', description: 'Grilled paneer cubes marinated in spices.', category: 'Vegetarian', subCategory: 'Starters', price: 8.99, isVeg: true, popular: true },
  { _id: 'fallback-crispy-corn', name: 'Crispy Corn', description: 'Spicy crispy corn bites.', category: 'Vegetarian', subCategory: 'Starters', price: 6.99, isVeg: true },
  { _id: 'fallback-veg-manchurian', name: 'Veg Manchurian', description: 'Vegetable dumplings in a tangy sauce.', category: 'Vegetarian', subCategory: 'Starters', price: 7.99, isVeg: true },
  { _id: 'fallback-aloo-tikki', name: 'Aloo Tikki', description: 'Spiced potato patties served with chutney.', category: 'Vegetarian', subCategory: 'Starters', price: 5.49, isVeg: true },
  { _id: 'fallback-paneer-butter-masala', name: 'Paneer Butter Masala', description: 'Creamy tomato gravy with soft paneer cubes.', category: 'Vegetarian', subCategory: 'Main Course', price: 12.99, isVeg: true, popular: true },
  { _id: 'fallback-palak-paneer', name: 'Palak Paneer', description: 'Paneer cooked in spinach curry.', category: 'Vegetarian', subCategory: 'Main Course', price: 11.99, isVeg: true },
  { _id: 'fallback-veg-biryani', name: 'Veg Biryani', description: 'Fragrant rice cooked with vegetables and spices.', category: 'Vegetarian', subCategory: 'Main Course', price: 10.99, isVeg: true, popular: true },
    { _id: 'fallback-dal-tadka', name: 'Dal Tadka', description: 'Yellow lentils tempered with aromatic spices.', category: 'Vegetarian', subCategory: 'Main Course', price: 8.99, isVeg: true },
  { name: 'Chole Bhature', description: 'Spiced chickpeas with fried bread.', category: 'Vegetarian', subCategory: 'Main Course', price: 11.49, isVeg: true },
  { name: 'Mixed Veg Curry', description: 'Seasonal vegetables cooked in a flavorful gravy.', category: 'Vegetarian', subCategory: 'Main Course', price: 10.49, isVeg: true },
  { name: 'Veg Burger', description: 'Vegetarian burger with crispy patty and sauces.', category: 'Vegetarian', subCategory: 'Fast Food / Snacks', price: 7.99, isVeg: true },
  { name: 'Margherita Pizza', description: 'Classic cheese and tomato pizza.', category: 'Vegetarian', subCategory: 'Fast Food / Snacks', price: 9.99, isVeg: true },
  { name: 'Veg Noodles', description: 'Stir-fried noodles with fresh vegetables.', category: 'Vegetarian', subCategory: 'Fast Food / Snacks', price: 8.49, isVeg: true },
  { name: 'Veg Fried Rice', description: 'Egg-free fried rice with mixed vegetables.', category: 'Vegetarian', subCategory: 'Fast Food / Snacks', price: 8.49, isVeg: true },
  { name: 'Grilled Veg Sandwich', description: 'Toasted sandwich loaded with fresh veggies.', category: 'Vegetarian', subCategory: 'Fast Food / Snacks', price: 7.49, isVeg: true },
  { name: 'Chicken Tikka', description: 'Tender chicken pieces marinated and grilled.', category: 'Non-Vegetarian', subCategory: 'Starters', price: 9.99, isVeg: false, popular: true },
  { name: 'Chicken Wings', description: 'Spicy fried chicken wings.', category: 'Non-Vegetarian', subCategory: 'Starters', price: 9.49, isVeg: false },
  { name: 'Fish Fry', description: 'Crispy seasoned fish fillets.', category: 'Non-Vegetarian', subCategory: 'Starters', price: 10.99, isVeg: false },
  { name: 'Chicken Lollipop', description: 'Fried chicken drumettes with spicy glaze.', category: 'Non-Vegetarian', subCategory: 'Starters', price: 9.99, isVeg: false },
  { name: 'Prawn Tempura', description: 'Lightly battered prawn pieces.', category: 'Non-Vegetarian', subCategory: 'Starters', price: 11.99, isVeg: false },
  { name: 'Butter Chicken', description: 'Rich and creamy tomato-based chicken curry.', category: 'Non-Vegetarian', subCategory: 'Main Course', price: 13.99, isVeg: false, popular: true },
  { name: 'Chicken Biryani', description: 'Flavorful chicken rice dish with spices.', category: 'Non-Vegetarian', subCategory: 'Main Course', price: 13.49, isVeg: false, popular: true },
  { name: 'Mutton Curry', description: 'Slow-cooked mutton curry with aromatic spices.', category: 'Non-Vegetarian', subCategory: 'Main Course', price: 14.99, isVeg: false },
  { name: 'Fish Curry', description: 'Fish cooked in a tangy curry sauce.', category: 'Non-Vegetarian', subCategory: 'Main Course', price: 12.99, isVeg: false },
  { name: 'Chicken Korma', description: 'Creamy chicken curry with nuts and spices.', category: 'Non-Vegetarian', subCategory: 'Main Course', price: 13.99, isVeg: false },
  { name: 'Chicken Burger', description: 'Grilled chicken burger with fresh toppings.', category: 'Non-Vegetarian', subCategory: 'Fast Food / Snacks', price: 8.99, isVeg: false },
  { name: 'Chicken Pizza', description: 'Topped with grilled chicken and cheese.', category: 'Non-Vegetarian', subCategory: 'Fast Food / Snacks', price: 10.99, isVeg: false },
  { name: 'Chicken Noodles', description: 'Stir-fried noodles with chicken and veggies.', category: 'Non-Vegetarian', subCategory: 'Fast Food / Snacks', price: 9.49, isVeg: false },
  { name: 'Chicken Fried Rice', description: 'Fried rice tossed with chicken and vegetables.', category: 'Non-Vegetarian', subCategory: 'Fast Food / Snacks', price: 9.49, isVeg: false },
  { name: 'Grilled Chicken Sandwich', description: 'Toasted sandwich with grilled chicken and greens.', category: 'Non-Vegetarian', subCategory: 'Fast Food / Snacks', price: 9.99, isVeg: false },
  { name: 'Coca-Cola', description: 'Classic cold drink.', category: 'Drinks & Beverages', subCategory: 'Cold Drinks', price: 2.99, isVeg: true },
  { name: 'Pepsi', description: 'Refreshing cola drink.', category: 'Drinks & Beverages', subCategory: 'Cold Drinks', price: 2.99, isVeg: true },
  { name: 'Sprite', description: 'Lemon-lime soda.', category: 'Drinks & Beverages', subCategory: 'Cold Drinks', price: 2.99, isVeg: true },
  { name: 'Fanta', description: 'Orange soda drink.', category: 'Drinks & Beverages', subCategory: 'Cold Drinks', price: 2.99, isVeg: true },
  { name: 'Orange Juice', description: 'Freshly squeezed orange juice.', category: 'Drinks & Beverages', subCategory: 'Fresh Juices', price: 4.99, isVeg: true },
  { name: 'Mango Juice', description: 'Fresh mango juice.', category: 'Drinks & Beverages', subCategory: 'Fresh Juices', price: 5.49, isVeg: true },
  { name: 'Apple Juice', description: 'Fresh apple juice.', category: 'Drinks & Beverages', subCategory: 'Fresh Juices', price: 4.99, isVeg: true },
  { name: 'Pineapple Juice', description: 'Fresh pineapple juice.', category: 'Drinks & Beverages', subCategory: 'Fresh Juices', price: 5.49, isVeg: true },
  { name: 'Chocolate Milkshake', description: 'Creamy chocolate milkshake.', category: 'Drinks & Beverages', subCategory: 'Shakes & Smoothies', price: 5.99, isVeg: true },
  { name: 'Strawberry Shake', description: 'Fresh strawberry shake.', category: 'Drinks & Beverages', subCategory: 'Shakes & Smoothies', price: 5.99, isVeg: true },
  { name: 'Mango Smoothie', description: 'Mango smoothie with yogurt.', category: 'Drinks & Beverages', subCategory: 'Shakes & Smoothies', price: 6.49, isVeg: true },
  { name: 'Banana Shake', description: 'Banana shake with milk.', category: 'Drinks & Beverages', subCategory: 'Shakes & Smoothies', price: 5.99, isVeg: true },
  { name: 'Tea', description: 'Hot brewed tea.', category: 'Drinks & Beverages', subCategory: 'Hot Beverages', price: 2.49, isVeg: true },
  { name: 'Coffee', description: 'Fresh brewed coffee.', category: 'Drinks & Beverages', subCategory: 'Hot Beverages', price: 2.99, isVeg: true },
  { name: 'Cappuccino', description: 'Creamy cappuccino with foam.', category: 'Drinks & Beverages', subCategory: 'Hot Beverages', price: 3.99, isVeg: true },
  { name: 'Hot Chocolate', description: 'Warm chocolate drink.', category: 'Drinks & Beverages', subCategory: 'Hot Beverages', price: 3.99, isVeg: true },
  { name: 'Gulab Jamun', description: 'Soft syrup-soaked dumplings.', category: 'Desserts', subCategory: 'Desserts', price: 4.99, isVeg: true, popular: true },
  { name: 'Ice Cream (Vanilla)', description: 'Creamy vanilla ice cream.', category: 'Desserts', subCategory: 'Desserts', price: 4.49, isVeg: true },
  { name: 'Ice Cream (Chocolate)', description: 'Rich chocolate ice cream.', category: 'Desserts', subCategory: 'Desserts', price: 4.49, isVeg: true },
  { name: 'Ice Cream (Strawberry)', description: 'Fresh strawberry ice cream.', category: 'Desserts', subCategory: 'Desserts', price: 4.49, isVeg: true },
  { name: 'Brownie', description: 'Warm chocolate brownie.', category: 'Desserts', subCategory: 'Desserts', price: 5.49, isVeg: true },
  { name: 'Cheesecake', description: 'Creamy cheesecake slice.', category: 'Desserts', subCategory: 'Desserts', price: 5.99, isVeg: true },
];

const normalizedFallbackMenu = fallbackMenu.map((item, index) => ({
  _id: item._id || `fallback-${index}`,
  ...item,
}));

const MenuPage = ({ user }) => {
  const [menu, setMenu] = useState([]);
  const [suggestions, setSuggestions] = useState({ popular: [], combos: [] });
  const [message, setMessage] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Vegetarian');
  // Optionally, scroll to or highlight Aloo Tikki if present
  const [search, setSearch] = useState("");

  const categoryOrder = [
    'Vegetarian',
    'Non-Vegetarian',
    'Drinks & Beverages',
    'Desserts',
  ];

  const groupedMenu = menu.reduce((acc, item) => {
    const category = item.category || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
  }, {});

  const categoryKeys = [
    ...categoryOrder.filter((category) => groupedMenu[category]),
    ...Object.keys(groupedMenu).filter((category) => !categoryOrder.includes(category)),
  ];

  let selectedItems = groupedMenu[selectedCategory] || [];
  if (search.trim()) {
    const searchLower = search.trim().toLowerCase();
    selectedItems = selectedItems.filter(
      (item) =>
        item.name.toLowerCase().includes(searchLower) ||
        (item.description && item.description.toLowerCase().includes(searchLower))
    );
  }

  useEffect(() => {
    fetchMenu()
      .then((res) => setMenu(res.data.length ? res.data : normalizedFallbackMenu))
      .catch(() => setMenu(normalizedFallbackMenu));
    fetchSuggestions().then((res) => {
      setSuggestions(res.data);
      setMessage(res.data.message || 'Recommended for you');
    });
  }, []);

  const addToCart = (item) => {
    const cart = getCart();
    const existing = cart.find((entry) => entry.menuItem === item._id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ menuItem: item._id, name: item.name, price: item.price, image: item.image, quantity: 1, addOns: [] });
    }
    localStorage.setItem('freshdishCart', JSON.stringify(cart));
    alert(`${item.name} added to cart`);
  };

  const addSuggestionToCart = (item) => {
    addToCart(item);
  };

  // Remove scroll feature, just set category
  const handleBrowseDishes = () => {
    setSelectedCategory(categoryKeys[0] || 'Vegetarian');
    // Scroll to menu section
    setTimeout(() => {
      const menuSection = document.querySelector('.menu-section');
      if (menuSection) {
        menuSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  return (
    <section className="page-grid">
      <div className="page-panel">
        <div className="menu-hero">
          <div className="hero-copy">
            <span className="hero-eyebrow">FreshDish</span>
            <h1>Welcome to your favorite meal hub</h1>
            <p className="hero-text">
              Explore fresh, chef-crafted dishes across vegetarian, non-vegetarian,
              drinks, and desserts. Pick a section to browse faster.
            </p>
            {user ? <p className="hero-welcome">Hello, {user.name}! Ready to order?</p> : null}
            <button
              type="button"
              className="hero-cta"
              onClick={handleBrowseDishes}
            >
              Browse Dishes
            </button>
          </div>
          <div className="hero-visual">
            <img
              src={heroImage}
              alt="Delicious food hero"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '22px',
                boxShadow: '0 8px 32px rgba(45,106,150,0.10)'
              }}
            />
          </div>
        </div>
        <div style={{ marginBottom: "1.25rem", display: "flex", gap: "1rem", alignItems: "center" }}>
          <input
            type="text"
            placeholder="Search dishes..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              flex: 1,
              padding: "0.7rem 1.1rem",
              borderRadius: "999px",
              border: "1px solid #dce1ea",
              fontSize: "1rem"
            }}
          />
        </div>
        <div className="category-tabs">
          {categoryKeys.map((category) => (
            <button
              key={category}
              type="button"
              className={`tab-button ${category === selectedCategory ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
        {menu.length === 0 ? (
          <p className="empty-message">No menu items available yet. Add items to start taking orders.</p>
        ) : (
          <section className="menu-section">
            <div className="menu-section-header">
              <h3>{selectedCategory}</h3>
              <span className="menu-section-count">{selectedItems.length} items</span>
            </div>
            {selectedItems.length === 0 ? (
              <p className="empty-message">No items found in this category yet.</p>
            ) : (
              <div className="cards-grid">
                {selectedItems.map((item) => {
                  // Combo images mapping
                  const comboImages = {
                    'Veggie Delight Combo': '/assets/combos/veggiedelightcombo.jpg',
                    'Non-Veg Feast Combo': '/assets/combos/non-vegfeastcombo.jpg',
                    'Family Combo': '/assets/combos/familycombo.jpg',
                    'Dessert Lovers Combo': '/assets/combos/dessertlovercombo.jpg',
                    'Quick Bites Combo': '/assets/combos/quickbitescombo.jpg',
                  };
                  // If this is a combo, inject image
                  let itemWithImage = item;
                  if (item.category === 'Combo' && comboImages[item.name]) {
                    itemWithImage = { ...item, image: comboImages[item.name] };
                  }
                  return <MenuCard key={item._id} item={itemWithImage} onAdd={addToCart} />;
                })}
              </div>
            )}
          </section>
        )}
      </div>
      <aside className="suggestions-panel">
        <h3>{message || 'Recommended for you'}</h3>
        <div className="suggestion-group">
          <h4>Popular Dishes</h4>
          {suggestions.popular.length > 0 ? (
            suggestions.popular.map((item) => (
              <div key={item._id} className="suggestion-item" onClick={() => addSuggestionToCart(item)}>
                <strong>{item.name}</strong>
                <p>{item.description || 'Chef favorite item.'}</p>
                <div className="suggestion-bottom">
                  <span>${item.price?.toFixed(2) ?? 'N/A'}</span>
                  <button type="button" onClick={(e) => { e.stopPropagation(); addSuggestionToCart(item); }}>
                    Add
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="empty-message">No popular dishes found yet. Mark menu items as popular.</p>
          )}
        </div>
        <div className="suggestion-group">
          <h4>Suggested Combos</h4>
          {suggestions.combos.length > 0 ? (
            suggestions.combos
              .filter(item => [
                'Veggie Delight Combo',
                'Non-Veg Feast Combo',
                'Family Combo',
                'Dessert Lovers Combo',
                'Quick Bites Combo',
              ].includes(item.name))
              .map((item) => {
                // Map combo name to image filename
                return (
                  <div key={item._id} className="suggestion-item" onClick={() => addSuggestionToCart(item)}>
                    <strong>{item.name}</strong>
                    <p>{item.description || 'Perfect paired meal.'}</p>
                    <div className="suggestion-bottom">
                      <span>${item.price?.toFixed(2) ?? 'N/A'}</span>
                      <button type="button" onClick={(e) => { e.stopPropagation(); addSuggestionToCart(item); }}>
                        Add
                      </button>
                    </div>
                  </div>
                );
              })
          ) : (
            <p className="empty-message">No combo items available yet. Add a combo meal to improve checkout upsells.</p>
          )}
        </div>
      </aside>
    </section>
  );
};

export default MenuPage;
