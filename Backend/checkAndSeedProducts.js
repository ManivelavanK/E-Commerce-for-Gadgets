require('dotenv').config();
const mongoose = require('mongoose');
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
    description: "Portable wireless speaker with rich sound"
  },
  {
    name: "JBL Live 660NC",
    price: 7999,
    category: "headphones",
    brand: "JBL",
    img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600",
    description: "Wireless on-ear headphones with ANC"
  },
  {
    name: "Sennheiser HD 450BT",
    price: 11999,
    category: "headphones",
    brand: "Sennheiser",
    img: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600",
    description: "Audiophile-grade wireless headphones"
  },
  {
    name: "Audio-Technica ATH-M50xBT2",
    price: 16999,
    category: "headphones",
    brand: "Audio-Technica",
    img: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600",
    description: "Professional monitor headphones with Bluetooth"
  },
  {
    name: "Skullcandy Crusher Evo",
    price: 9999,
    category: "headphones",
    brand: "Skullcandy",
    img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600",
    description: "Bass-heavy headphones with haptic feedback"
  },
  {
    name: "Beats Studio3",
    price: 21999,
    category: "headphones",
    brand: "Beats",
    img: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600",
    description: "Stylish headphones with Apple W1 chip"
  },
  {
    name: "Marshall Major IV",
    price: 8999,
    category: "headphones",
    brand: "Marshall",
    img: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600",
    description: "Iconic design with 80+ hour battery life"
  },
  {
    name: "Plantronics BackBeat Pro 2",
    price: 13999,
    category: "headphones",
    brand: "Plantronics",
    img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600",
    description: "Business-focused headphones with ANC"
  },
  {
    name: "Jabra Elite 85h",
    price: 19999,
    category: "headphones",
    brand: "Jabra",
    img: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600",
    description: "Smart headphones with adaptive ANC"
  }
];

const checkAndSeedProducts = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    
    mongoose.set('strictQuery', false);
    await mongoose.connect(process.env.MONGO_URL, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    console.log('✅ Connected to MongoDB');
    
    // Check if products exist
    const existingProducts = await Product.find();
    console.log(`📊 Found ${existingProducts.length} existing products`);
    
    if (existingProducts.length === 0) {
      console.log('🌱 No products found. Seeding database...');
      
      const insertedProducts = await Product.insertMany(sampleProducts);
      console.log(`✅ Successfully seeded ${insertedProducts.length} products`);
      
      // Verify the seeding
      const verifyCount = await Product.countDocuments();
      console.log(`✅ Verification: ${verifyCount} products now in database`);
    } else {
      console.log('✅ Products already exist in database');
      
      // Show some sample products
      const sampleExisting = existingProducts.slice(0, 3);
      console.log('📋 Sample existing products:');
      sampleExisting.forEach(product => {
        console.log(`  - ${product.name} (${product.category}) - ₹${product.price}`);
      });
    }
    
    await mongoose.connection.close();
    console.log('✅ Database connection closed');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
};

checkAndSeedProducts();