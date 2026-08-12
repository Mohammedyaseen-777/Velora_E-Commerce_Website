import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const products = [
  // =========================================================
  // ELECTRONICS — 10
  // =========================================================
  {
    name: "Velora Pro Wireless Headphones",
    description:
      "Over-ear wireless headphones with deep bass, comfortable ear cushions, and long-lasting battery life.",
    price: 4999,
    image: "/products/electronics/velora-pro-wireless-headphones.jpg",
    category: "Electronics",
    stock: 24,
  },
  {
    name: "Velora Smart Watch S1",
    description:
      "Smartwatch with fitness tracking, heart-rate monitoring, notifications, and a bright touchscreen display.",
    price: 5499,
    image: "/products/electronics/velora-smart-watch-s1.jpg",
    category: "Electronics",
    stock: 18,
  },
  {
    name: "Noise-Canceling Earbuds",
    description:
      "Compact wireless earbuds with active noise reduction, clear calls, and a portable charging case.",
    price: 2799,
    image: "/products/electronics/noise-canceling-earbuds.jpg",
    category: "Electronics",
    stock: 35,
  },
  {
    name: "65W Fast Charger",
    description:
      "Compact USB-C fast charger designed for smartphones, tablets, and compatible laptops.",
    price: 1699,
    image: "/products/electronics/65w-fast-charger.jpg",
    category: "Electronics",
    stock: 42,
  },
  {
    name: "Wireless Bluetooth Speaker",
    description:
      "Portable Bluetooth speaker with balanced audio, strong bass, and an all-day battery.",
    price: 2499,
    image: "/products/electronics/wireless-bluetooth-speaker.jpg",
    category: "Electronics",
    stock: 27,
  },
  {
    name: "1080p USB Webcam",
    description:
      "Full-HD webcam with built-in microphone for video calls, classes, and streaming.",
    price: 2199,
    image: "/products/electronics/1080p-usb-webcam.jpg",
    category: "Electronics",
    stock: 31,
  },
  {
    name: "10,000mAh Power Bank",
    description:
      "Slim power bank with high-speed charging and dual USB output for everyday travel.",
    price: 1499,
    image: "/products/electronics/10000mah-power-bank.jpg",
    category: "Electronics",
    stock: 45,
  },
  {
    name: "Mechanical Keyboard",
    description:
      "RGB mechanical keyboard with tactile switches, durable keycaps, and a compact gaming-friendly layout.",
    price: 3499,
    image: "/products/electronics/mechanical-keyboard.jpg",
    category: "Electronics",
    stock: 22,
  },
  {
    name: "24-inch Full HD Monitor",
    description:
      "Full-HD monitor with a crisp display, slim bezels, and smooth everyday performance.",
    price: 9499,
    image: "/products/electronics/24-inch-full-hd-monitor.jpg",
    category: "Electronics",
    stock: 14,
  },
  {
    name: "1TB Portable SSD",
    description:
      "Compact high-speed external SSD for storing and transferring large files quickly.",
    price: 7999,
    image: "/products/electronics/1tb-portable-ssd.jpg",
    category: "Electronics",
    stock: 16,
  },

  // =========================================================
  // FASHION — 10
  // =========================================================
  {
    name: "Classic Cotton T-Shirt",
    description:
      "Soft cotton everyday T-shirt with a clean regular fit and versatile styling.",
    price: 699,
    image: "/products/fashion/classic-cotton-t-shirt.jpg",
    category: "Fashion",
    stock: 60,
  },
  {
    name: "Premium Oversized T-Shirt",
    description:
      "Heavyweight cotton oversized T-shirt with a relaxed silhouette and modern streetwear look.",
    price: 999,
    image: "/products/fashion/premium-oversized-t-shirt.jpg",
    category: "Fashion",
    stock: 48,
  },
  {
    name: "Slim Fit Casual Shirt",
    description:
      "Comfortable casual shirt with a structured slim fit suitable for everyday and semi-formal outfits.",
    price: 1499,
    image: "/products/fashion/slim-fit-casual-shirt.jpg",
    category: "Fashion",
    stock: 32,
  },
  {
    name: "Classic Denim Jacket",
    description:
      "Durable denim jacket with a timeless design that works across casual outfits.",
    price: 2499,
    image: "/products/fashion/classic-denim-jacket.jpg",
    category: "Fashion",
    stock: 21,
  },
  {
    name: "Regular Fit Blue Jeans",
    description:
      "Comfortable denim jeans with a classic regular fit designed for everyday wear.",
    price: 1899,
    image: "/products/fashion/regular-fit-blue-jeans.jpg",
    category: "Fashion",
    stock: 38,
  },
  {
    name: "Cargo Jogger Pants",
    description:
      "Utility-inspired joggers with multiple pockets and a comfortable tapered fit.",
    price: 1599,
    image: "/products/fashion/cargo-jogger-pants.jpg",
    category: "Fashion",
    stock: 34,
  },
  {
    name: "Casual Hoodie",
    description:
      "Soft fleece hoodie with a relaxed fit and adjustable drawstring hood.",
    price: 1799,
    image: "/products/fashion/casual-hoodie.jpg",
    category: "Fashion",
    stock: 29,
  },
  {
    name: "Everyday Polo T-Shirt",
    description:
      "Classic polo shirt made with breathable fabric for smart-casual everyday wear.",
    price: 1199,
    image: "/products/fashion/everyday-polo-t-shirt.jpg",
    category: "Fashion",
    stock: 41,
  },
  {
    name: "Minimalist Backpack",
    description:
      "Spacious everyday backpack with organized compartments for books, accessories, and laptops.",
    price: 1899,
    image: "/products/fashion/minimalist-backpack.jpg",
    category: "Fashion",
    stock: 26,
  },
  {
    name: "Classic Leather Wallet",
    description:
      "Compact wallet with multiple card slots and a practical everyday design.",
    price: 799,
    image: "/products/fashion/classic-leather-wallet.jpg",
    category: "Fashion",
    stock: 55,
  },

  // =========================================================
  // HOME & KITCHEN — 10
  // =========================================================
  {
    name: "Stainless Steel Water Bottle",
    description:
      "Double-wall insulated bottle designed to keep beverages at a comfortable temperature for longer.",
    price: 899,
    image: "/products/home-kitchen/stainless-steel-water-bottle.jpg",
    category: "Home & Kitchen",
    stock: 50,
  },
  {
    name: "Electric Kettle 1.5L",
    description:
      "Fast-boiling electric kettle with automatic shutoff and a convenient cordless design.",
    price: 1299,
    image: "/products/home-kitchen/electric-kettle-1-5l.jpg",
    category: "Home & Kitchen",
    stock: 25,
  },
  {
    name: "Non-Stick Cookware Set",
    description:
      "Multi-piece cookware set with durable non-stick surfaces for convenient everyday cooking.",
    price: 2999,
    image: "/products/home-kitchen/non-stick-cookware-set.jpg",
    category: "Home & Kitchen",
    stock: 17,
  },
  {
    name: "Digital Kitchen Scale",
    description:
      "Compact digital scale for accurately measuring ingredients during cooking and baking.",
    price: 699,
    image: "/products/home-kitchen/digital-kitchen-scale.jpg",
    category: "Home & Kitchen",
    stock: 37,
  },
  {
    name: "3-Piece Storage Container Set",
    description:
      "Airtight kitchen containers designed to keep dry ingredients organized and fresh.",
    price: 599,
    image: "/products/home-kitchen/storage-container-set.jpg",
    category: "Home & Kitchen",
    stock: 44,
  },
  {
    name: "LED Desk Lamp",
    description:
      "Adjustable LED desk lamp with multiple brightness levels for study and workspaces.",
    price: 1099,
    image: "/products/home-kitchen/led-desk-lamp.jpg",
    category: "Home & Kitchen",
    stock: 30,
  },
  {
    name: "Cotton Cushion Set",
    description:
      "Soft decorative cushion covers designed to add comfort and style to living spaces.",
    price: 799,
    image: "/products/home-kitchen/cotton-cushion-set.jpg",
    category: "Home & Kitchen",
    stock: 33,
  },
  {
    name: "Ceramic Dinner Set",
    description:
      "Elegant ceramic dinnerware set designed for everyday family meals and special occasions.",
    price: 2499,
    image: "/products/home-kitchen/ceramic-dinner-set.jpg",
    category: "Home & Kitchen",
    stock: 19,
  },
  {
    name: "Digital Kitchen Timer",
    description:
      "Easy-to-use digital timer with a clear display for cooking, baking, and study sessions.",
    price: 349,
    image: "/products/home-kitchen/digital-kitchen-timer.jpg",
    category: "Home & Kitchen",
    stock: 40,
  },
  {
    name: "4-Slice Pop-Up Toaster",
    description:
      "Compact toaster with adjustable browning levels and convenient pop-up controls.",
    price: 2199,
    image: "/products/home-kitchen/4-slice-pop-up-toaster.jpg",
    category: "Home & Kitchen",
    stock: 15,
  },

  // =========================================================
  // BEAUTY — 10
  // =========================================================
  {
    name: "Hydrating Face Wash",
    description:
      "Gentle daily cleanser designed to remove dirt and excess oil while maintaining a comfortable feel.",
    price: 399,
    image: "/products/beauty/hydrating-face-wash.jpg",
    category: "Beauty",
    stock: 55,
  },
  {
    name: "Vitamin C Face Serum",
    description:
      "Lightweight facial serum formulated for a simple daily skincare routine.",
    price: 699,
    image: "/products/beauty/vitamin-c-face-serum.jpg",
    category: "Beauty",
    stock: 46,
  },
  {
    name: "Moisturizing Face Cream",
    description:
      "Everyday moisturizer designed to provide comfortable hydration without a heavy feel.",
    price: 549,
    image: "/products/beauty/moisturizing-face-cream.jpg",
    category: "Beauty",
    stock: 39,
  },
  {
    name: "SPF 50 Sunscreen",
    description:
      "Lightweight sunscreen designed for daily outdoor use with broad-spectrum SPF 50 protection.",
    price: 599,
    image: "/products/beauty/spf-50-sunscreen.jpg",
    category: "Beauty",
    stock: 52,
  },
  {
    name: "Aloe Vera Gel",
    description:
      "Multipurpose aloe vera gel suitable for a refreshing addition to everyday skincare routines.",
    price: 299,
    image: "/products/beauty/aloe-vera-gel.jpg",
    category: "Beauty",
    stock: 63,
  },
  {
    name: "Lip Care Balm",
    description:
      "Nourishing lip balm designed to keep lips comfortable and moisturized throughout the day.",
    price: 199,
    image: "/products/beauty/lip-care-balm.jpg",
    category: "Beauty",
    stock: 70,
  },
  {
    name: "Makeup Brush Set",
    description:
      "Complete brush collection with soft synthetic bristles for everyday makeup application.",
    price: 899,
    image: "/products/beauty/makeup-brush-set.jpg",
    category: "Beauty",
    stock: 28,
  },
  {
    name: "Compact Hair Dryer",
    description:
      "Lightweight hair dryer with multiple airflow settings for convenient home styling.",
    price: 1299,
    image: "/products/beauty/compact-hair-dryer.jpg",
    category: "Beauty",
    stock: 23,
  },
  {
    name: "Ceramic Hair Straightener",
    description:
      "Ceramic straightener with adjustable temperature settings for smooth everyday styling.",
    price: 1799,
    image: "/products/beauty/ceramic-hair-straightener.jpg",
    category: "Beauty",
    stock: 20,
  },
  {
    name: "Fragrance Body Mist",
    description:
      "Fresh everyday body mist with a light fragrance designed for casual daily use.",
    price: 499,
    image: "/products/beauty/fragrance-body-mist.jpg",
    category: "Beauty",
    stock: 36,
  },

  // =========================================================
  // GAMING — 10
  // =========================================================
  {
    name: "Velora GX Gaming Mouse",
    description:
      "Precision gaming mouse with adjustable DPI, responsive buttons, and an ergonomic shape.",
    price: 1499,
    image: "/products/gaming/velora-gx-gaming-mouse.jpg",
    category: "Gaming",
    stock: 35,
  },
  {
    name: "RGB Mechanical Gaming Keyboard",
    description:
      "Mechanical gaming keyboard with RGB lighting, responsive switches, and durable construction.",
    price: 2999,
    image: "/products/gaming/rgb-mechanical-gaming-keyboard.jpg",
    category: "Gaming",
    stock: 24,
  },
  {
    name: "Gaming Headset Pro",
    description:
      "Over-ear gaming headset with immersive audio, comfortable cushions, and a flexible microphone.",
    price: 2499,
    image: "/products/gaming/gaming-headset-pro.jpg",
    category: "Gaming",
    stock: 28,
  },
  {
    name: "Extended Gaming Mouse Pad",
    description:
      "Large smooth-surface mouse pad providing room for both keyboard and gaming mouse movement.",
    price: 799,
    image: "/products/gaming/extended-gaming-mouse-pad.jpg",
    category: "Gaming",
    stock: 45,
  },
  {
    name: "USB Gaming Microphone",
    description:
      "Plug-and-play USB microphone designed for gaming voice chat, streaming, and recording.",
    price: 2199,
    image: "/products/gaming/usb-gaming-microphone.jpg",
    category: "Gaming",
    stock: 19,
  },
  {
    name: "RGB Gaming Controller",
    description:
      "Ergonomic USB controller with responsive buttons and RGB lighting for compatible games.",
    price: 1899,
    image: "/products/gaming/rgb-gaming-controller.jpg",
    category: "Gaming",
    stock: 26,
  },
  {
    name: "Laptop Cooling Pad",
    description:
      "Multi-fan cooling pad designed to improve airflow beneath gaming and performance laptops.",
    price: 1399,
    image: "/products/gaming/laptop-cooling-pad.jpg",
    category: "Gaming",
    stock: 32,
  },
  {
    name: "Gaming Chair",
    description:
      "Ergonomic gaming chair with adjustable height, padded seating, and reclining backrest.",
    price: 8999,
    image: "/products/gaming/gaming-chair.jpg",
    category: "Gaming",
    stock: 11,
  },
  {
    name: "24-inch Gaming Monitor",
    description:
      "Full-HD gaming monitor designed for smooth gameplay with a responsive display.",
    price: 11999,
    image: "/products/gaming/24-inch-gaming-monitor.jpg",
    category: "Gaming",
    stock: 13,
  },
  {
    name: "USB RGB Gaming Light Bar",
    description:
      "Desktop RGB light bar designed to add customizable ambient lighting to gaming setups.",
    price: 1299,
    image: "/products/gaming/usb-rgb-gaming-light-bar.jpg",
    category: "Gaming",
    stock: 29,
  },

  // =========================================================
  // BOOKS — 10
  // =========================================================
  {
    name: "The Art of Programming",
    description:
      "Beginner-friendly introduction to programming concepts, problem solving, and computational thinking.",
    price: 599,
    image: "/products/books/the-art-of-programming.jpg",
    category: "Books",
    stock: 30,
  },
  {
    name: "Python for Beginners",
    description:
      "Practical introduction to Python covering fundamentals, functions, collections, and small projects.",
    price: 699,
    image: "/products/books/python-for-beginners.jpg",
    category: "Books",
    stock: 27,
  },
  {
    name: "Data Structures Made Easy",
    description:
      "Accessible guide to fundamental data structures and algorithmic problem-solving techniques.",
    price: 799,
    image: "/products/books/data-structures-made-easy.jpg",
    category: "Books",
    stock: 22,
  },
  {
    name: "Introduction to Artificial Intelligence",
    description:
      "Beginner-oriented overview of AI concepts, machine learning, and intelligent systems.",
    price: 899,
    image: "/products/books/introduction-to-artificial-intelligence.jpg",
    category: "Books",
    stock: 18,
  },
  {
    name: "Web Development Fundamentals",
    description:
      "Practical guide covering HTML, CSS, JavaScript, and the fundamentals of modern websites.",
    price: 749,
    image: "/products/books/web-development-fundamentals.jpg",
    category: "Books",
    stock: 25,
  },
  {
    name: "Business & Entrepreneurship Basics",
    description:
      "Introduction to business principles, entrepreneurship, planning, and basic management concepts.",
    price: 549,
    image: "/products/books/business-entrepreneurship-basics.jpg",
    category: "Books",
    stock: 31,
  },
  {
    name: "The Productivity Handbook",
    description:
      "Practical strategies for organizing tasks, managing time, and building productive routines.",
    price: 499,
    image: "/products/books/the-productivity-handbook.jpg",
    category: "Books",
    stock: 34,
  },
  {
    name: "Financial Literacy Guide",
    description:
      "Beginner-friendly guide to budgeting, saving, investing concepts, and responsible money management.",
    price: 599,
    image: "/products/books/financial-literacy-guide.jpg",
    category: "Books",
    stock: 29,
  },
  {
    name: "Learn JavaScript",
    description:
      "Hands-on introduction to JavaScript syntax, programming concepts, and browser-based development.",
    price: 799,
    image: "/products/books/learn-javascript.jpg",
    category: "Books",
    stock: 20,
  },
  {
    name: "Modern Computer Networks",
    description:
      "Introduction to networking concepts including protocols, devices, addressing, and network architecture.",
    price: 949,
    image: "/products/books/modern-computer-networks.jpg",
    category: "Books",
    stock: 16,
  },

  // =========================================================
  // SPORTS — 10
  // =========================================================
  {
    name: "Professional Cricket Bat",
    description:
      "Full-size cricket bat designed for recreational and competitive practice sessions.",
    price: 2499,
    image: "/products/sports/professional-cricket-bat.jpg",
    category: "Sports",
    stock: 18,
  },
  {
    name: "Cricket Practice Ball Set",
    description:
      "Durable practice balls suitable for training sessions and recreational cricket.",
    price: 699,
    image: "/products/sports/cricket-practice-ball-set.jpg",
    category: "Sports",
    stock: 40,
  },
  {
    name: "Football Size 5",
    description:
      "Standard-size football with durable construction for training and recreational matches.",
    price: 899,
    image: "/products/sports/football-size-5.jpg",
    category: "Sports",
    stock: 35,
  },
  {
    name: "Badminton Racket",
    description:
      "Lightweight badminton racket designed for responsive handling and everyday practice.",
    price: 1299,
    image: "/products/sports/badminton-racket.jpg",
    category: "Sports",
    stock: 27,
  },
  {
    name: "Badminton Shuttlecock Set",
    description:
      "Durable shuttlecock set designed for regular badminton training and recreational play.",
    price: 499,
    image: "/products/sports/badminton-shuttlecock-set.jpg",
    category: "Sports",
    stock: 44,
  },
  {
    name: "Adjustable Dumbbell Set",
    description:
      "Adjustable dumbbell set with multiple weight options for versatile home workouts.",
    price: 2999,
    image: "/products/sports/adjustable-dumbbell-set.jpg",
    category: "Sports",
    stock: 16,
  },
  {
    name: "Yoga Mat",
    description:
      "Comfortable non-slip exercise mat designed for yoga, stretching, and floor workouts.",
    price: 899,
    image: "/products/sports/yoga-mat.jpg",
    category: "Sports",
    stock: 38,
  },
  {
    name: "Resistance Band Set",
    description:
      "Multi-level resistance band set for strength training, mobility, and home workouts.",
    price: 699,
    image: "/products/sports/resistance-band-set.jpg",
    category: "Sports",
    stock: 42,
  },
  {
    name: "Sports Water Bottle",
    description:
      "Durable reusable bottle designed for sports sessions, workouts, and outdoor activities.",
    price: 599,
    image: "/products/sports/sports-water-bottle.jpg",
    category: "Sports",
    stock: 47,
  },
  {
    name: "Training Sports Shoes",
    description:
      "Lightweight athletic shoes designed for everyday training, walking, and fitness activities.",
    price: 2199,
    image: "/products/sports/training-sports-shoes.jpg",
    category: "Sports",
    stock: 23,
  },

  // =========================================================
  // GROCERY — 10
  // =========================================================
  {
    name: "Premium Basmati Rice 5kg",
    description:
      "Long-grain basmati rice suitable for everyday meals, pulao, and biryani.",
    price: 699,
    image: "/products/grocery/premium-basmati-rice-5kg.jpg",
    category: "Grocery",
    stock: 45,
  },
  {
    name: "Whole Wheat Atta 5kg",
    description:
      "Finely milled whole wheat flour suitable for everyday rotis and home cooking.",
    price: 349,
    image: "/products/grocery/whole-wheat-atta-5kg.jpg",
    category: "Grocery",
    stock: 52,
  },
  {
    name: "Toor Dal 1kg",
    description:
      "Quality split pigeon peas suitable for everyday Indian dal preparations.",
    price: 169,
    image: "/products/grocery/toor-dal-1kg.jpg",
    category: "Grocery",
    stock: 60,
  },
  {
    name: "Refined Sunflower Oil 1L",
    description:
      "Everyday cooking oil suitable for frying, sautéing, and general meal preparation.",
    price: 149,
    image: "/products/grocery/refined-sunflower-oil-1l.jpg",
    category: "Grocery",
    stock: 58,
  },
  {
    name: "Green Tea Bags",
    description:
      "Convenient tea bags with a refreshing flavor for a simple everyday beverage.",
    price: 249,
    image: "/products/grocery/green-tea-bags.jpg",
    category: "Grocery",
    stock: 40,
  },
  {
    name: "Roasted Almonds 500g",
    description:
      "Crunchy roasted almonds suitable as a convenient snack or everyday pantry item.",
    price: 449,
    image: "/products/grocery/roasted-almonds-500g.jpg",
    category: "Grocery",
    stock: 34,
  },
  {
    name: "Natural Honey 500g",
    description:
      "Naturally sweet honey suitable for beverages, breakfast, and everyday recipes.",
    price: 399,
    image: "/products/grocery/natural-honey-500g.jpg",
    category: "Grocery",
    stock: 31,
  },
  {
    name: "Mixed Dry Fruits 500g",
    description:
      "Assorted dry fruits suitable for snacking, breakfast bowls, and festive occasions.",
    price: 699,
    image: "/products/grocery/mixed-dry-fruits-500g.jpg",
    category: "Grocery",
    stock: 26,
  },
  {
    name: "Premium Instant Coffee",
    description:
      "Rich instant coffee blend designed for convenient preparation at home or work.",
    price: 299,
    image: "/products/grocery/premium-instant-coffee.jpg",
    category: "Grocery",
    stock: 43,
  },
  {
    name: "Multigrain Breakfast Cereal",
    description:
      "Crunchy multigrain cereal suitable for quick breakfast bowls with milk or yogurt.",
    price: 349,
    image: "/products/grocery/multigrain-breakfast-cereal.jpg",
    category: "Grocery",
    stock: 37,
  },
];

async function main() {
  console.log("Starting Velora product seed...");

  let created = 0;
  let skipped = 0;

  for (const product of products) {
    const existingProduct = await prisma.product.findFirst({
      where: {
        name: product.name,
      },
    });

    if (existingProduct) {
      skipped++;
      continue;
    }

    await prisma.product.create({
      data: product,
    });

    created++;
  }

  console.log("----------------------------------------");
  console.log(`Products in catalog: ${products.length}`);
  console.log(`Products created:    ${created}`);
  console.log(`Products skipped:    ${skipped}`);
  console.log("----------------------------------------");
  console.log("Velora product seed completed successfully!");
}

main()
  .catch((error) => {
    console.error("Seed Error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });