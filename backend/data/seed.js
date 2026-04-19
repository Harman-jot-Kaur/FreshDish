const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const connectDB = require("../config/db");
const User = require("../models/User");
const MenuItem = require("../models/MenuItem");
const Combo = require("../models/Combo");

// Always load .env from backend directory
const path = require("path");
dotenv.config({ path: path.resolve(__dirname, "../.env") });

console.log("MONGO_URI:", process.env.MONGO_URI);

const seedData = async () => {
  try {
    await connectDB();
    // Always ensure all customers have the default password and correct role/permissions
    const defaultCustomerPassword = await bcrypt.hash("Customer@1234", 10);
    const allCustomers = await User.find({ role: "customer" });
    for (const customer of allCustomers) {
      customer.password = defaultCustomerPassword;
      customer.role = "customer";
      customer.permissions = [];
      await customer.save();
    }

    // Always ensure default customer exists
    let defaultCustomer = await User.findOne({ email: "olu@gmail.com" });
    if (!defaultCustomer) {
      await User.create({
        name: "Olu Customer",
        email: "olu@gmail.com",
        password: defaultCustomerPassword,
        role: "customer",
        permissions: [],
      });
    }
    // Only update or insert admin and kitchen users, do not delete any users (preserve customers)
    // Only create admin if not exists, do not overwrite password
    let admin = await User.findOne({ email: "admin@freshdish.com" });
    if (!admin) {
      const adminPassword = await bcrypt.hash("Admin@1234", 10);
      await User.create({
        name: "Admin User",
        email: "admin@freshdish.com",
        password: adminPassword,
        role: "admin",
        permissions: ["manage_menu", "manage_orders", "view_admin"],
      });
    }

    // Always ensure kitchen staff exists and has correct password
    let kitchen = await User.findOne({ email: "kitchen@freshdish.com" });
    const kitchenPassword = await bcrypt.hash("Kitchen@1234", 10);
    if (!kitchen) {
      await User.create({
        name: "Kitchen Staff",
        email: "kitchen@freshdish.com",
        password: kitchenPassword,
        role: "kitchen",
        permissions: ["manage_orders"],
      });
    } else {
      // Update password and permissions if user exists
      kitchen.password = kitchenPassword;
      kitchen.role = "kitchen";
      kitchen.permissions = ["manage_orders"];
      await kitchen.save();
    }

    // Helper to slugify dish names
    function slugify(name) {
      return name
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^a-z0-9-]/g, "");
    }

    // Map category to folder
    function getImageFolder(category) {
      if (category.toLowerCase().includes("vegetarian")) return "vegetarian";
      if (category.toLowerCase().includes("non-vegetarian"))
        return "non-vegetarian";
      if (category.toLowerCase().includes("dessert")) return "desserts";
      if (category.toLowerCase().includes("drink")) return "drinks";
      return "other";
    }

    await MenuItem.deleteMany();
    const menuItems = [
      // --- Ensure all combo items exist ---
      {
        name: "Mango Juice",
        description: "Fresh mango juice.",
        category: "Drinks & Beverages",
        subCategory: "Fresh Juices",
        price: 5.49,
        isVeg: true,
        image: "/assets/drinks/mangojuice.jpg",
        tags: ["juice"],
      },
      {
        name: "Fish Fry",
        description: "Crispy seasoned fish fillets.",
        category: "Non-Vegetarian",
        subCategory: "Starters",
        price: 10.99,
        isVeg: false,
        image: "/assets/non-vegetarian/fishfry.jpg",
        tags: ["non-veg", "starter"],
      },
      {
        name: "Fish Curry",
        description: "Fish cooked in a tangy curry sauce.",
        category: "Non-Vegetarian",
        subCategory: "Main Course",
        price: 12.99,
        isVeg: false,
        image: "/assets/non-vegetarian/fishcurry.jpg",
        tags: ["non-veg"],
      },
      {
        name: "Pineapple Juice",
        description: "Fresh pineapple juice.",
        category: "Drinks & Beverages",
        subCategory: "Fresh Juices",
        price: 5.49,
        isVeg: true,
        image: "/assets/drinks/pineapplejuice.jpg",
        tags: ["juice"],
      },
      {
        name: "Hot Chocolate",
        description: "Warm chocolate drink.",
        category: "Drinks & Beverages",
        subCategory: "Hot Beverages",
        price: 3.99,
        isVeg: true,
        image: "/assets/drinks/hotchocolate.jpg",
        tags: ["hot drink"],
      },
      {
        name: "Veg Spring Rolls",
        description: "Crispy rolls filled with mixed vegetables.",
        category: "Vegetarian",
        subCategory: "Starters",
        price: 5.99,
        isVeg: true,
        image: "/assets/vegetarian/vegspringrolls.jpg",
        tags: ["vegetarian", "starter"],
        popular: true,
      },
      {
        name: "Paneer Tikka",
        description: "Grilled paneer cubes marinated in spices.",
        category: "Vegetarian",
        subCategory: "Starters",
        price: 8.99,
        isVeg: true,
        image: "/assets/vegetarian/paneertikka.jpg",
        tags: ["vegetarian", "starter"],
        popular: true,
      },
      {
        name: "Crispy Corn",
        description: "Spicy crispy corn bites.",
        category: "Vegetarian",
        subCategory: "Starters",
        price: 6.99,
        isVeg: true,
        image: "/assets/vegetarian/crispycorn.jpg",
        tags: ["vegetarian", "starter"],
      },
      {
        name: "Veg Manchurian",
        description: "Vegetable dumplings in a tangy sauce.",
        category: "Vegetarian",
        subCategory: "Starters",
        price: 7.99,
        isVeg: true,
        image: "/assets/vegetarian/vegmanchurian.jpg",
        tags: ["vegetarian", "starter"],
      },
      {
        name: "Aloo Tikki",
        description: "Spiced potato patties served with chutney.",
        category: "Vegetarian",
        subCategory: "Starters",
        price: 5.49,
        isVeg: true,
        image: "/assets/vegetarian/alootikki.jpg",
        tags: ["vegetarian", "starter"],
      },
      {
        name: "Paneer Butter Masala",
        description: "Creamy tomato gravy with soft paneer cubes.",
        category: "Vegetarian",
        subCategory: "Main Course",
        price: 12.99,
        isVeg: true,
        image: "/assets/vegetarian/paneerbuttermasala.jpg",
        tags: ["vegetarian", "popular"],
        popular: true,
      },
      {
        name: "Palak Paneer",
        description: "Paneer cooked in spinach curry.",
        category: "Vegetarian",
        subCategory: "Main Course",
        price: 11.99,
        isVeg: true,
        image: "/assets/vegetarian/palakpaneer.jpg",
        tags: ["vegetarian"],
      },
      {
        name: "Veg Biryani",
        description: "Fragrant rice cooked with vegetables and spices.",
        category: "Vegetarian",
        subCategory: "Main Course",
        price: 10.99,
        isVeg: true,
        image: "/assets/vegetarian/vegbiryani.jpg",
        tags: ["vegetarian"],
        popular: true,
      },
      {
        name: "Dal Tadka",
        description: "Yellow lentils tempered with aromatic spices.",
        category: "Vegetarian",
        subCategory: "Main Course",
        price: 8.99,
        isVeg: true,
        image: "/assets/vegetarian/daaltadka.jpg",
        tags: ["vegetarian"],
      },
      {
        name: "Chole Bhature",
        description: "Spiced chickpeas with fried bread.",
        category: "Vegetarian",
        subCategory: "Main Course",
        price: 11.49,
        isVeg: true,
        image: "/assets/vegetarian/cholebhture.jpg",
        tags: ["vegetarian"],
      },
      {
        name: "Mixed Veg Curry",
        description: "Seasonal vegetables cooked in a flavorful gravy.",
        category: "Vegetarian",
        subCategory: "Main Course",
        price: 10.49,
        isVeg: true,
        image: "/assets/vegetarian/mixedvegcurry.jpg",
        tags: ["vegetarian"],
      },
      {
        name: "Veg Burger",
        description: "Vegetarian burger with crispy patty and sauces.",
        category: "Vegetarian",
        subCategory: "Fast Food / Snacks",
        price: 7.99,
        isVeg: true,
        image: "/assets/vegetarian/vegburger.jpg",
        tags: ["vegetarian", "snack"],
      },
      {
        name: "Margherita Pizza",
        description: "Classic cheese and tomato pizza.",
        category: "Vegetarian",
        subCategory: "Fast Food / Snacks",
        price: 9.99,
        isVeg: true,
        image: "/assets/vegetarian/pizza.jpg",
        tags: ["vegetarian", "pizza"],
      },
      {
        name: "Veg Noodles",
        description: "Stir-fried noodles with fresh vegetables.",
        category: "Vegetarian",
        subCategory: "Fast Food / Snacks",
        price: 8.49,
        isVeg: true,
        image: "/assets/vegetarian/vegnoodles.jpg",
        tags: ["vegetarian", "noodles"],
      },
      {
        name: "Veg Fried Rice",
        description: "Egg-free fried rice with mixed vegetables.",
        category: "Vegetarian",
        subCategory: "Fast Food / Snacks",
        price: 8.49,
        isVeg: true,
        image: "/assets/vegetarian/vegfriedrice.jpg",
        tags: ["vegetarian"],
      },
      {
        name: "Grilled Veg Sandwich",
        description: "Toasted sandwich loaded with fresh veggies.",
        category: "Vegetarian",
        subCategory: "Fast Food / Snacks",
        price: 7.49,
        isVeg: true,
        image: "/assets/vegetarian/vegsandwich.jpg",
        tags: ["vegetarian"],
      },
      {
        name: "Chicken Tikka",
        description: "Tender chicken pieces marinated and grilled.",
        category: "Non-Vegetarian",
        subCategory: "Starters",
        price: 9.99,
        isVeg: false,
        image: "/assets/non-vegetarian/chickentikka.jpg",
        tags: ["non-veg", "starter"],
        popular: true,
      },
      {
        name: "Chicken Wings",
        description: "Spicy fried chicken wings.",
        category: "Non-Vegetarian",
        subCategory: "Starters",
        price: 9.49,
        isVeg: false,
        image: "/assets/non-vegetarian/chickenwings.jpg",
        tags: ["non-veg", "starter"],
      },
      {
        name: "Fish Fry",
        description: "Crispy seasoned fish fillets.",
        category: "Non-Vegetarian",
        subCategory: "Starters",
        price: 10.99,
        isVeg: false,
        image: "/assets/non-vegetarian/fishfry.jpg",
        tags: ["non-veg", "starter"],
      },
      {
        name: "Chicken Lollipop",
        description: "Fried chicken drumettes with spicy glaze.",
        category: "Non-Vegetarian",
        subCategory: "Starters",
        price: 9.99,
        isVeg: false,
        image: "/assets/non-vegetarian/chickenlollipop.jpg",
        tags: ["non-veg", "starter"],
      },
      {
        name: "Prawn Tempura",
        description: "Lightly battered prawn pieces.",
        category: "Non-Vegetarian",
        subCategory: "Starters",
        price: 11.99,
        isVeg: false,
        image: "/assets/non-vegetarian/prawn.jpg",
        tags: ["non-veg", "starter"],
      },
      {
        name: "Butter Chicken",
        description: "Rich and creamy tomato-based chicken curry.",
        category: "Non-Vegetarian",
        subCategory: "Main Course",
        price: 13.99,
        isVeg: false,
        image: "/assets/non-vegetarian/butterchicken.jpg",
        tags: ["non-veg", "popular"],
        popular: true,
      },
      {
        name: "Chicken Biryani",
        description: "Flavorful chicken rice dish with spices.",
        category: "Non-Vegetarian",
        subCategory: "Main Course",
        price: 13.49,
        isVeg: false,
        image: "/assets/non-vegetarian/chickenbiryani.jpg",
        tags: ["non-veg", "popular"],
        popular: true,
      },
      {
        name: "Mutton Curry",
        description: "Slow-cooked mutton curry with aromatic spices.",
        category: "Non-Vegetarian",
        subCategory: "Main Course",
        price: 14.99,
        isVeg: false,
        image: "/assets/non-vegetarian/muttoncurry.jpg",
        tags: ["non-veg"],
      },
      {
        name: "Fish Curry",
        description: "Fish cooked in a tangy curry sauce.",
        category: "Non-Vegetarian",
        subCategory: "Main Course",
        price: 12.99,
        isVeg: false,
        image: "/assets/non-vegetarian/fishcurry.jpg",
        tags: ["non-veg"],
      },
      {
        name: "Chicken Korma",
        description: "Creamy chicken curry with nuts and spices.",
        category: "Non-Vegetarian",
        subCategory: "Main Course",
        price: 13.99,
        isVeg: false,
        image: "/assets/non-vegetarian/korma.jpg",
        tags: ["non-veg"],
      },
      {
        name: "Chicken Burger",
        description: "Grilled chicken burger with fresh toppings.",
        category: "Non-Vegetarian",
        subCategory: "Fast Food / Snacks",
        price: 8.99,
        isVeg: false,
        image: "/assets/non-vegetarian/chickenburger.jpg",
        tags: ["non-veg", "snack"],
      },
      {
        name: "Chicken Pizza",
        description: "Topped with grilled chicken and cheese.",
        category: "Non-Vegetarian",
        subCategory: "Fast Food / Snacks",
        price: 10.99,
        isVeg: false,
        image: "/assets/non-vegetarian/chickenpizza.jpg",
        tags: ["non-veg", "pizza"],
      },
      {
        name: "Chicken Noodles",
        description: "Stir-fried noodles with chicken and veggies.",
        category: "Non-Vegetarian",
        subCategory: "Fast Food / Snacks",
        price: 9.49,
        isVeg: false,
        image: "/assets/non-vegetarian/chickennoodles.jpg",
        tags: ["non-veg", "noodles"],
      },
      {
        name: "Chicken Fried Rice",
        description: "Fried rice tossed with chicken and vegetables.",
        category: "Non-Vegetarian",
        subCategory: "Fast Food / Snacks",
        price: 9.49,
        isVeg: false,
        image: "/assets/non-vegetarian/chickenfriedrice.jpg",
        tags: ["non-veg"],
      },
      {
        name: "Grilled Chicken Sandwich",
        description: "Toasted sandwich with grilled chicken and greens.",
        category: "Non-Vegetarian",
        subCategory: "Fast Food / Snacks",
        price: 9.99,
        isVeg: false,
        image: "/assets/non-vegetarian/grilledsandwich.jpg",
        tags: ["non-veg"],
      },
      {
        name: "Coca-Cola",
        description: "Classic cold drink.",
        category: "Drinks & Beverages",
        subCategory: "Cold Drinks",
        price: 2.99,
        isVeg: true,
        image: "/assets/drinks/cocacola.jpg",
        tags: ["drink"],
      },
      {
        name: "Pepsi",
        description: "Refreshing cola drink.",
        category: "Drinks & Beverages",
        subCategory: "Cold Drinks",
        price: 2.99,
        isVeg: true,
        image: "/assets/drinks/pepsi.jpg",
        tags: ["drink"],
      },
      {
        name: "Sprite",
        description: "Lemon-lime soda.",
        category: "Drinks & Beverages",
        subCategory: "Cold Drinks",
        price: 2.99,
        isVeg: true,
        image: "/assets/drinks/sprite.jpg",
        tags: ["drink"],
      },
      {
        name: "Fanta",
        description: "Orange soda drink.",
        category: "Drinks & Beverages",
        subCategory: "Cold Drinks",
        price: 2.99,
        isVeg: true,
        image: "/assets/drinks/fanta.jpg",
        tags: ["drink"],
      },
      {
        name: "Orange Juice",
        description: "Freshly squeezed orange juice.",
        category: "Drinks & Beverages",
        subCategory: "Fresh Juices",
        price: 4.99,
        isVeg: true,
        image: "/assets/drinks/orangejuice.jpg",
        tags: ["juice"],
      },
      {
        name: "Mango Juice",
        description: "Fresh mango juice.",
        category: "Drinks & Beverages",
        subCategory: "Fresh Juices",
        price: 5.49,
        isVeg: true,
        image: "/assets/drinks/mangojuice.jpg",
        tags: ["juice"],
      },
      {
        name: "Apple Juice",
        description: "Fresh apple juice.",
        category: "Drinks & Beverages",
        subCategory: "Fresh Juices",
        price: 4.99,
        isVeg: true,
        image: "/assets/drinks/applejuice.jpg",
        tags: ["juice"],
      },
      {
        name: "Pineapple Juice",
        description: "Fresh pineapple juice.",
        category: "Drinks & Beverages",
        subCategory: "Fresh Juices",
        price: 5.49,
        isVeg: true,
        image: "/assets/drinks/pineapplejuice.jpg",
        tags: ["juice"],
      },
      {
        name: "Chocolate Milkshake",
        description: "Creamy chocolate milkshake.",
        category: "Drinks & Beverages",
        subCategory: "Shakes & Smoothies",
        price: 5.99,
        isVeg: true,
        image: "/assets/drinks/chocolatemilkshake.jpg",
        tags: ["shake"],
      },
      {
        name: "Strawberry Shake",
        description: "Fresh strawberry shake.",
        category: "Drinks & Beverages",
        subCategory: "Shakes & Smoothies",
        price: 5.99,
        isVeg: true,
        image: "/assets/drinks/strawberryshake.jpg",
        tags: ["shake"],
      },
      {
        name: "Mango Smoothie",
        description: "Mango smoothie with yogurt.",
        category: "Drinks & Beverages",
        subCategory: "Shakes & Smoothies",
        price: 6.49,
        isVeg: true,
        image: "/assets/drinks/mangosmoothie.jpg",
        tags: ["smoothie"],
      },
      {
        name: "Banana Shake",
        description: "Banana shake with milk.",
        category: "Drinks & Beverages",
        subCategory: "Shakes & Smoothies",
        price: 5.99,
        isVeg: true,
        image: "/assets/drinks/bananashake.jpg",
        tags: ["shake"],
      },
      {
        name: "Tea",
        description: "Hot brewed tea.",
        category: "Drinks & Beverages",
        subCategory: "Hot Beverages",
        price: 2.49,
        isVeg: true,
        image: "/assets/drinks/tea.jpg",
        tags: ["hot drink"],
      },
      {
        name: "Coffee",
        description: "Fresh brewed coffee.",
        category: "Drinks & Beverages",
        subCategory: "Hot Beverages",
        price: 2.99,
        isVeg: true,
        image: "/assets/drinks/coffee.jpg",
        tags: ["hot drink"],
      },
      {
        name: "Cappuccino",
        description: "Creamy cappuccino with foam.",
        category: "Drinks & Beverages",
        subCategory: "Hot Beverages",
        price: 3.99,
        isVeg: true,
        image: "/assets/drinks/cappuccinocreamy.jpg",
        tags: ["hot drink"],
      },
      {
        name: "Hot Chocolate",
        description: "Warm chocolate drink.",
        category: "Drinks & Beverages",
        subCategory: "Hot Beverages",
        price: 3.99,
        isVeg: true,
        image: "/assets/drinks/hotchocolate.jpg",
        tags: ["hot drink"],
      },
      {
        name: "Gulab Jamun",
        description: "Soft syrup-soaked dumplings.",
        category: "Desserts",
        subCategory: "Sweets",
        price: 4.99,
        isVeg: true,
        image: "/assets/desserts/gulabjamun.jpg",
        tags: ["dessert"],
        popular: true,
      },
      {
        name: "Ice Cream (Vanilla)",
        description: "Creamy vanilla ice cream.",
        category: "Desserts",
        subCategory: "Desserts",
        price: 4.49,
        isVeg: true,
        image: "/assets/desserts/icecreamvanilla.jpg",
        tags: ["dessert"],
      },
      {
        name: "Ice Cream (Chocolate)",
        description: "Rich chocolate ice cream.",
        category: "Desserts",
        subCategory: "Desserts",
        price: 4.49,
        isVeg: true,
        image: "/assets/desserts/icecream.jpg",
        tags: ["dessert"],
      },
      {
        name: "Ice Cream (Strawberry)",
        description: "Fresh strawberry ice cream.",
        category: "Desserts",
        subCategory: "Desserts",
        price: 4.49,
        isVeg: true,
        image: "/assets/desserts/strawberryicecream.jpg",
        tags: ["dessert"],
      },
      {
        name: "Brownie",
        description: "Warm chocolate brownie.",
        category: "Desserts",
        subCategory: "Desserts",
        price: 5.49,
        isVeg: true,
        image: "/assets/desserts/brownie.jpg",
        tags: ["dessert"],
      },
      {
        name: "Cheesecake",
        description: "Creamy cheesecake slice.",
        category: "Desserts",
        subCategory: "Desserts",
        price: 5.99,
        isVeg: true,
        image: "/assets/desserts/cheesecake.jpg",
        tags: ["dessert"],
      },
      // Combo menu items
      {
        name: "Veggie Delight Combo",
        description:
          "Veg Spring Rolls, Paneer Butter Masala, Veg Biryani, and a Coke.",
        category: "Combo",
        subCategory: "Vegetarian Combo",
        price: 29.99,
        isVeg: true,
        image: "/assets/combos/veggie-delight.jpg",
        tags: ["combo", "meal", "vegetarian"],
        available: true,
      },
      {
        name: "Non-Veg Feast Combo",
        description:
          "Chicken Tikka, Butter Chicken, Chicken Biryani, and a Pepsi.",
        category: "Combo",
        subCategory: "Non-Vegetarian Combo",
        price: 34.99,
        isVeg: false,
        image: "/assets/combos/nonveg-feast.jpg",
        tags: ["combo", "meal", "non-veg"],
        available: true,
      },
      {
        name: "Family Combo",
        description:
          "Paneer Tikka, Chicken Wings, Mixed Veg Curry, Chicken Fried Rice, and Sprite.",
        category: "Combo",
        subCategory: "Mixed Combo",
        price: 44.99,
        isVeg: false,
        image: "/assets/combos/family.jpg",
        tags: ["combo", "meal", "family"],
        available: true,
      },
      {
        name: "Dessert Lovers Combo",
        description: "Gulab Jamun, Brownie, and Ice Cream (Vanilla).",
        category: "Combo",
        subCategory: "Dessert Combo",
        price: 13.99,
        isVeg: true,
        image: "/assets/combos/dessert.jpg",
        tags: ["combo", "meal", "dessert"],
        available: true,
      },
      {
        name: "Quick Bites Combo",
        description:
          "Veg Burger, Chicken Burger, Grilled Veg Sandwich, and Fanta.",
        category: "Combo",
        subCategory: "Snacks Combo",
        price: 24.99,
        isVeg: false,
        image: "/assets/combos/quickbites.jpg",
        tags: ["combo", "meal", "snack"],
        available: true,
      },
    ];
    await MenuItem.create(menuItems);

    // --- Combo Seeding ---
    await Combo.deleteMany();
    // Fetch menu items for combos
    const allMenuItems = await MenuItem.find();
    console.log(
      "Menu items in DB:",
      allMenuItems.map((i) => i.name),
    );
    // Helper to get item by name
    const getItem = (name) => allMenuItems.find((item) => item.name === name);

    const combos = [
      {
        name: "Veggie Delight Combo",
        description:
          "Veg Spring Rolls, Paneer Butter Masala, Veg Biryani, and a Coke.",
        items: [
          getItem("Veg Spring Rolls")?._id,
          getItem("Paneer Butter Masala")?._id,
          getItem("Veg Biryani")?._id,
          getItem("Coca-Cola")?._id,
        ],
        price: 29.99,
        image: "/assets/combos/veggie-delight.jpg",
      },
      {
        name: "Non-Veg Feast Combo",
        description:
          "Chicken Tikka, Butter Chicken, Chicken Biryani, and a Pepsi.",
        items: [
          getItem("Chicken Tikka")?._id,
          getItem("Butter Chicken")?._id,
          getItem("Chicken Biryani")?._id,
          getItem("Pepsi")?._id,
        ],
        price: 34.99,
        image: "/assets/combos/nonveg-feast.jpg",
      },
      {
        name: "Family Combo",
        description:
          "Paneer Tikka, Chicken Wings, Mixed Veg Curry, Chicken Fried Rice, and Sprite.",
        items: [
          getItem("Paneer Tikka")?._id,
          getItem("Chicken Wings")?._id,
          getItem("Mixed Veg Curry")?._id,
          getItem("Chicken Fried Rice")?._id,
          getItem("Sprite")?._id,
        ],
        price: 44.99,
        image: "/assets/combos/family.jpg",
      },
      {
        name: "Dessert Lovers Combo",
        description: "Gulab Jamun, Brownie, and Ice Cream (Vanilla).",
        items: [
          getItem("Gulab Jamun")?._id,
          getItem("Brownie")?._id,
          getItem("Ice Cream (Vanilla)")?._id,
        ],
        price: 13.99,
        image: "/assets/combos/dessert.jpg",
      },
      {
        name: "Quick Bites Combo",
        description:
          "Veg Burger, Chicken Burger, Grilled Veg Sandwich, and Fanta.",
        items: [
          getItem("Veg Burger")?._id,
          getItem("Chicken Burger")?._id,
          getItem("Grilled Veg Sandwich")?._id,
          getItem("Fanta")?._id,
        ],
        price: 24.99,
        image: "/assets/combos/quickbites.jpg",
      },
      {
        name: "Spicy Treat Combo",
        description: "Crispy Corn, Chicken Wings, Veg Manchurian, and Pepsi.",
        items: [
          getItem("Crispy Corn")?._id,
          getItem("Chicken Wings")?._id,
          getItem("Veg Manchurian")?._id,
          getItem("Pepsi")?._id,
        ],
        price: 22.99,
        image: "/assets/combos/spicy-treat.jpg",
      },
      {
        name: "Royal Indian Combo",
        description:
          "Paneer Butter Masala, Dal Tadka, Veg Fried Rice, and Mango Juice.",
        items: [
          getItem("Paneer Butter Masala")?._id,
          getItem("Dal Tadka")?._id,
          getItem("Veg Fried Rice")?._id,
          getItem("Mango Juice")?._id,
        ],
        price: 26.99,
        image: "/assets/combos/royal-indian.jpg",
      },
      {
        name: "Seafood Special Combo",
        description: "Fish Fry, Fish Curry, Pineapple Juice, and Brownie.",
        items: [
          getItem("Fish Fry")?._id,
          getItem("Fish Curry")?._id,
          getItem("Pineapple Juice")?._id,
          getItem("Brownie")?._id,
        ],
        price: 32.49,
        image: "/assets/combos/seafood-special.jpg",
      },
      {
        name: "Classic Comfort Combo",
        description:
          "Aloo Tikki, Mixed Veg Curry, Tea, and Ice Cream (Vanilla).",
        items: [
          getItem("Aloo Tikki")?._id,
          getItem("Mixed Veg Curry")?._id,
          getItem("Tea")?._id,
          getItem("Ice Cream (Vanilla)")?._id,
        ],
        price: 19.99,
        image: "/assets/combos/classic-comfort.jpg",
      },
      {
        name: "Paneer Party Combo",
        description:
          "Paneer Tikka, Palak Paneer, Margherita Pizza, and Mango Juice.",
        items: [
          getItem("Paneer Tikka")?._id,
          getItem("Palak Paneer")?._id,
          getItem("Margherita Pizza")?._id,
          getItem("Mango Juice")?._id,
        ],
        price: 27.99,
        image: "/assets/combos/paneer-party.jpg",
      },
      {
        name: "Chicken Lovers Combo",
        description:
          "Chicken Lollipop, Chicken Korma, Chicken Pizza, and Coke.",
        items: [
          getItem("Chicken Lollipop")?._id,
          getItem("Chicken Korma")?._id,
          getItem("Chicken Pizza")?._id,
          getItem("Coca-Cola")?._id,
        ],
        price: 32.99,
        image: "/assets/combos/chicken-lovers.jpg",
      },
      {
        name: "Sweet Tooth Combo",
        description: "Cheesecake, Ice Cream (Chocolate), and Hot Chocolate.",
        items: [
          getItem("Cheesecake")?._id,
          getItem("Ice Cream (Chocolate)")?._id,
          getItem("Hot Chocolate")?._id,
        ],
        price: 15.99,
        image: "/assets/combos/sweet-tooth.jpg",
      },
    ];
    // Only add combos if all items exist
    const validCombos = combos.filter((c) => c.items.every(Boolean));
    if (validCombos.length !== combos.length) {
      console.log("Some combos were skipped because not all items exist:");
      combos.forEach((c) => {
        if (!c.items.every(Boolean)) {
          console.log(
            `Combo '${c.name}' missing items:`,
            c.items.map((id, idx) =>
              id ? null : c.description.split(",")[idx],
            ),
          );
        }
      });
    }
    await Combo.insertMany(validCombos);

    console.log(
      `Inserted combos:`,
      validCombos.map((c) => c.name),
    );
    console.log("Seed data created successfully");
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
};

seedData();
