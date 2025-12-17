require('dotenv').config();
const Product = require('./Models/Product');

const sampleProducts = [
  // Smartphones (15 products)
  {
    name: "iPhone 15 Pro",
    price: 134900,
    category: "smartphones",
    brand: "Apple",
    img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600",
    description: "Latest iPhone with titanium design and A17 Pro chip"
  },
  {
    name: "Samsung Galaxy S24",
    price: 79999,
    category: "smartphones",
    brand: "Samsung",
    img: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600",
    description: "Flagship Android phone with AI features"
  },
  {
    name: "OnePlus 12",
    price: 64999,
    category: "smartphones",
    brand: "OnePlus",
    img: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=600",
    description: "Fast charging flagship with premium design"
  },
  {
    name: "Google Pixel 8",
    price: 75999,
    category: "smartphones",
    brand: "Google",
    img: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600",
    description: "Pure Android experience with excellent camera"
  },
  {
    name: "Xiaomi 14",
    price: 54999,
    category: "smartphones",
    brand: "Xiaomi",
    img: "https://images.unsplash.com/photo-1567581935884-3349723552ca?w=600",
    description: "Flagship performance at affordable price"
  },
  {
    name: "iPhone 15",
    price: 79900,
    category: "smartphones",
    brand: "Apple",
    img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600",
    description: "Standard iPhone with USB-C and Dynamic Island"
  },
  {
    name: "Samsung Galaxy S23",
    price: 64999,
    category: "smartphones",
    brand: "Samsung",
    img: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600",
    description: "Previous generation flagship with great value"
  },
  {
    name: "OnePlus 11",
    price: 56999,
    category: "smartphones",
    brand: "OnePlus",
    img: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=600",
    description: "Balanced performance and features"
  },
  {
    name: "Google Pixel 7a",
    price: 43999,
    category: "smartphones",
    brand: "Google",
    img: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600",
    description: "Mid-range phone with flagship camera"
  },
  {
    name: "Xiaomi 13",
    price: 49999,
    category: "smartphones",
    brand: "Xiaomi",
    img: "https://images.unsplash.com/photo-1567581935884-3349723552ca?w=600",
    description: "Premium build with Leica cameras"
  },
  {
    name: "Nothing Phone 2",
    price: 44999,
    category: "smartphones",
    brand: "Nothing",
    img: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=600",
    description: "Unique transparent design with Glyph interface"
  },
  {
    name: "Realme GT 3",
    price: 42999,
    category: "smartphones",
    brand: "Realme",
    img: "https://images.unsplash.com/photo-1567581935884-3349723552ca?w=600",
    description: "Gaming-focused phone with 240W charging"
  },
  {
    name: "Vivo X90",
    price: 59999,
    category: "smartphones",
    brand: "Vivo",
    img: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600",
    description: "Camera-centric flagship with Zeiss optics"
  },
  {
    name: "Oppo Find X6",
    price: 67999,
    category: "smartphones",
    brand: "Oppo",
    img: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=600",
    description: "Premium design with advanced photography"
  },
  {
    name: "Motorola Edge 40",
    price: 39999,
    category: "smartphones",
    brand: "Motorola",
    img: "https://images.unsplash.com/photo-1567581935884-3349723552ca?w=600",
    description: "Clean Android experience with curved display"
  },
  
  // Laptops (15 products)
  {
    name: "MacBook Pro M3",
    price: 199900,
    category: "laptops",
    brand: "Apple",
    img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600",
    description: "Professional laptop with M3 chip for creators"
  },
  {
    name: "Dell XPS 13",
    price: 124999,
    category: "laptops",
    brand: "Dell",
    img: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600",
    description: "Ultra-portable laptop with stunning display"
  },
  {
    name: "HP Spectre x360",
    price: 109999,
    category: "laptops",
    brand: "HP",
    img: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600",
    description: "2-in-1 convertible laptop with premium build"
  },
  {
    name: "Lenovo ThinkPad X1",
    price: 139999,
    category: "laptops",
    brand: "Lenovo",
    img: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600",
    description: "Business laptop with legendary keyboard"
  },
  {
    name: "ASUS ROG Zephyrus",
    price: 159999,
    category: "laptops",
    brand: "ASUS",
    img: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600",
    description: "Gaming laptop with RTX graphics"
  },
  {
    name: "MacBook Air M2",
    price: 114900,
    category: "laptops",
    brand: "Apple",
    img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600",
    description: "Lightweight laptop with all-day battery"
  },
  {
    name: "Dell XPS 15",
    price: 179999,
    category: "laptops",
    brand: "Dell",
    img: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600",
    description: "Creator laptop with 4K OLED display"
  },
  {
    name: "HP Pavilion 15",
    price: 54999,
    category: "laptops",
    brand: "HP",
    img: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600",
    description: "Affordable laptop for everyday tasks"
  },
  {
    name: "Lenovo IdeaPad 5",
    price: 49999,
    category: "laptops",
    brand: "Lenovo",
    img: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600",
    description: "Balanced performance and portability"
  },
  {
    name: "ASUS ZenBook 14",
    price: 74999,
    category: "laptops",
    brand: "ASUS",
    img: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600",
    description: "Ultrabook with premium design"
  },
  {
    name: "Acer Swift 3",
    price: 44999,
    category: "laptops",
    brand: "Acer",
    img: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600",
    description: "Budget-friendly laptop with good performance"
  },
  {
    name: "MSI GF63 Thin",
    price: 59999,
    category: "laptops",
    brand: "MSI",
    img: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600",
    description: "Entry-level gaming laptop"
  },
  {
    name: "Surface Laptop 5",
    price: 129999,
    category: "laptops",
    brand: "Microsoft",
    img: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600",
    description: "Premium Windows laptop with touchscreen"
  },
  {
    name: "Razer Blade 15",
    price: 189999,
    category: "laptops",
    brand: "Razer",
    img: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600",
    description: "Premium gaming laptop with RGB"
  },
  {
    name: "LG Gram 17",
    price: 119999,
    category: "laptops",
    brand: "LG",
    img: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600",
    description: "Ultra-lightweight 17-inch laptop"
  },
  
  // Headphones (15 products)
  {
    name: "AirPods Pro 2",
    price: 24900,
    category: "headphones",
    brand: "Apple",
    img: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=600",
    description: "Wireless earbuds with adaptive transparency"
  },
  {
    name: "Sony WH-1000XM5",
    price: 29990,
    category: "headphones",
    brand: "Sony",
    img: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600",
    description: "Industry-leading noise canceling headphones"
  },
  {
    name: "Bose QuietComfort",
    price: 26990,
    category: "headphones",
    brand: "Bose",
    img: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600",
    description: "Premium comfort with excellent noise cancellation"
  },
  {
    name: "JBL Tune 770NC",
    price: 8999,
    category: "headphones",
    brand: "JBL",
    img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600",
    description: "Affordable wireless headphones with ANC"
  },
  {
    name: "AirPods 3rd Gen",
    price: 18900,
    category: "headphones",
    brand: "Apple",
    img: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=600",
    description: "Spatial audio with dynamic head tracking"
  },
  {
    name: "Sony WH-CH720N",
    price: 14990,
    category: "headphones",
    brand: "Sony",
    img: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600",
    description: "Mid-range headphones with good ANC"
  },
  {
    name: "Bose SoundLink",
    price: 12990,
    category: "headphones",
    brand: "Bose",
    img: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600",
    description: "Portable speaker with rich sound"
  },
  {
    name: "JBL Live 660NC",
    price: 11999,
    category: "headphones",
    brand: "JBL",
    img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600",
    description: "Over-ear headphones with smart ambient"
  },
  {
    name: "Sennheiser HD 450BT",
    price: 9999,
    category: "headphones",
    brand: "Sennheiser",
    img: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600",
    description: "Audiophile-grade wireless headphones"
  },
  {
    name: "Audio-Technica ATH-M50x",
    price: 15999,
    category: "headphones",
    brand: "Audio-Technica",
    img: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600",
    description: "Professional monitor headphones"
  },
  {
    name: "Skullcandy Crusher",
    price: 7999,
    category: "headphones",
    brand: "Skullcandy",
    img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600",
    description: "Bass-heavy headphones for music lovers"
  },
  {
    name: "Beats Studio3",
    price: 22999,
    category: "headphones",
    brand: "Beats",
    img: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600",
    description: "Stylish headphones with Apple W1 chip"
  },
  {
    name: "Marshall Major IV",
    price: 13999,
    category: "headphones",
    brand: "Marshall",
    img: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600",
    description: "Iconic design with 80+ hour battery"
  },
  {
    name: "Plantronics BackBeat",
    price: 8999,
    category: "headphones",
    brand: "Plantronics",
    img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600",
    description: "Comfortable headphones for long sessions"
  },
  {
    name: "Jabra Elite 85h",
    price: 19999,
    category: "headphones",
    brand: "Jabra",
    img: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600",
    description: "Smart headphones with AI sound adaptation"
  },
  
  // Tablets (10 products)
  {
    name: "iPad Pro 12.9",
    price: 112900,
    category: "tablets",
    brand: "Apple",
    img: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600",
    description: "Professional tablet with M2 chip and Liquid Retina XDR display"
  },
  {
    name: "Samsung Galaxy Tab S9",
    price: 73999,
    category: "tablets",
    brand: "Samsung",
    img: "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600",
    description: "Premium Android tablet with S Pen included"
  },
  {
    name: "Microsoft Surface Pro 9",
    price: 89999,
    category: "tablets",
    brand: "Microsoft",
    img: "https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=600",
    description: "2-in-1 tablet with laptop performance"
  },
  {
    name: "iPad Air",
    price: 59900,
    category: "tablets",
    brand: "Apple",
    img: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600",
    description: "Powerful and versatile tablet for creativity"
  },
  {
    name: "Samsung Galaxy Tab A8",
    price: 17999,
    category: "tablets",
    brand: "Samsung",
    img: "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600",
    description: "Affordable tablet for entertainment and productivity"
  },
  {
    name: "Lenovo Tab P11",
    price: 24999,
    category: "tablets",
    brand: "Lenovo",
    img: "https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=600",
    description: "Family-friendly tablet with kids mode"
  },
  {
    name: "Amazon Fire HD 10",
    price: 14999,
    category: "tablets",
    brand: "Amazon",
    img: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600",
    description: "Budget tablet perfect for media consumption"
  },
  {
    name: "Huawei MatePad 11",
    price: 32999,
    category: "tablets",
    brand: "Huawei",
    img: "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600",
    description: "Premium Android tablet with HarmonyOS"
  },
  {
    name: "Xiaomi Pad 5",
    price: 26999,
    category: "tablets",
    brand: "Xiaomi",
    img: "https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=600",
    description: "High-performance tablet at competitive price"
  },
  {
    name: "ASUS ZenPad 3S",
    price: 21999,
    category: "tablets",
    brand: "ASUS",
    img: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600",
    description: "Compact tablet with premium build quality"
  },
  
  // Smartwatches (10 products)
  {
    name: "Apple Watch Series 9",
    price: 41900,
    category: "smartwatches",
    brand: "Apple",
    img: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=600",
    description: "Advanced health monitoring with ECG and blood oxygen"
  },
  {
    name: "Samsung Galaxy Watch 6",
    price: 32999,
    category: "smartwatches",
    brand: "Samsung",
    img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600",
    description: "Comprehensive fitness tracking with Wear OS"
  },
  {
    name: "Garmin Forerunner 955",
    price: 49999,
    category: "smartwatches",
    brand: "Garmin",
    img: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=600",
    description: "Professional running watch with GPS and training metrics"
  },
  {
    name: "Fitbit Versa 4",
    price: 19999,
    category: "smartwatches",
    brand: "Fitbit",
    img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600",
    description: "Health and fitness focused smartwatch"
  },
  {
    name: "Amazfit GTR 4",
    price: 15999,
    category: "smartwatches",
    brand: "Amazfit",
    img: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=600",
    description: "Long battery life with comprehensive health tracking"
  },
  {
    name: "Fossil Gen 6",
    price: 24999,
    category: "smartwatches",
    brand: "Fossil",
    img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600",
    description: "Classic design with Wear OS by Google"
  },
  {
    name: "Huawei Watch GT 3",
    price: 18999,
    category: "smartwatches",
    brand: "Huawei",
    img: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=600",
    description: "Premium design with 14-day battery life"
  },
  {
    name: "OnePlus Watch 2",
    price: 22999,
    category: "smartwatches",
    brand: "OnePlus",
    img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600",
    description: "Fast charging smartwatch with health monitoring"
  },
  {
    name: "Realme Watch S Pro",
    price: 9999,
    category: "smartwatches",
    brand: "Realme",
    img: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=600",
    description: "Budget smartwatch with GPS and heart rate monitoring"
  },
  {
    name: "Noise ColorFit Pro 4",
    price: 4999,
    category: "smartwatches",
    brand: "Noise",
    img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600",
    description: "Affordable fitness tracker with color display"
  },
  
  // Accessories (15 products)
  {
    name: "MagSafe Charger",
    price: 4500,
    category: "accessories",
    brand: "Apple",
    img: "https://images.unsplash.com/photo-1609592806787-3d9c1b8e5e8e?w=600",
    description: "Wireless charging pad for iPhone"
  },
  {
    name: "Anker PowerBank 20K",
    price: 3999,
    category: "accessories",
    brand: "Anker",
    img: "https://images.unsplash.com/photo-1609592806787-3d9c1b8e5e8e?w=600",
    description: "High-capacity portable charger"
  },
  {
    name: "Logitech MX Master 3",
    price: 8999,
    category: "accessories",
    brand: "Logitech",
    img: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600",
    description: "Advanced wireless mouse for professionals"
  },
  {
    name: "Samsung 65W Charger",
    price: 2999,
    category: "accessories",
    brand: "Samsung",
    img: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600",
    description: "Fast charging adapter for devices"
  },
  {
    name: "Apple Lightning Cable",
    price: 1999,
    category: "accessories",
    brand: "Apple",
    img: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600",
    description: "Official Lightning to USB-C cable"
  },
  {
    name: "Anker USB-C Hub",
    price: 5999,
    category: "accessories",
    brand: "Anker",
    img: "https://images.unsplash.com/photo-1609592806787-3d9c1b8e5e8e?w=600",
    description: "Multi-port hub for laptops"
  },
  {
    name: "Logitech K380 Keyboard",
    price: 3499,
    category: "accessories",
    brand: "Logitech",
    img: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600",
    description: "Compact wireless keyboard"
  },
  {
    name: "Samsung Wireless Charger",
    price: 2499,
    category: "accessories",
    brand: "Samsung",
    img: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600",
    description: "Fast wireless charging pad"
  },
  {
    name: "Belkin Car Charger",
    price: 1799,
    category: "accessories",
    brand: "Belkin",
    img: "https://images.unsplash.com/photo-1609592806787-3d9c1b8e5e8e?w=600",
    description: "Dual-port car charger"
  },
  {
    name: "Spigen Phone Case",
    price: 1299,
    category: "accessories",
    brand: "Spigen",
    img: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600",
    description: "Protective case with military-grade protection"
  },
  {
    name: "PopSocket Grip",
    price: 899,
    category: "accessories",
    brand: "PopSocket",
    img: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600",
    description: "Collapsible grip and stand for phones"
  },
  {
    name: "Anker Wireless Mouse",
    price: 2299,
    category: "accessories",
    brand: "Anker",
    img: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600",
    description: "Ergonomic wireless mouse"
  },
  {
    name: "SanDisk USB Drive 128GB",
    price: 1599,
    category: "accessories",
    brand: "SanDisk",
    img: "https://images.unsplash.com/photo-1609592806787-3d9c1b8e5e8e?w=600",
    description: "High-speed USB 3.0 flash drive"
  },
  {
    name: "Webcam HD 1080p",
    price: 4999,
    category: "accessories",
    brand: "Logitech",
    img: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600",
    description: "Full HD webcam for video calls"
  },
  {
    name: "Phone Stand Adjustable",
    price: 799,
    category: "accessories",
    brand: "Generic",
    img: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600",
    description: "Adjustable desktop phone stand"
  }
];

const seedProducts = async () => {
  try {
    console.log('Connected to Products Database');
    
    await Product.deleteMany({});
    console.log('Cleared existing products');
    
    const products = await Product.insertMany(sampleProducts);
    console.log(`✅ Successfully created ${products.length} products`);
    
    const categories = {};
    products.forEach(product => {
      if (!categories[product.category]) {
        categories[product.category] = 0;
      }
      categories[product.category]++;
    });
    
    console.log('\n📊 Products by category:');
    Object.entries(categories).forEach(([category, count]) => {
      console.log(`  ${category}: ${count} products`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
};

seedProducts();