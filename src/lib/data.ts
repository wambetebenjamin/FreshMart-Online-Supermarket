import { DELIVERY_SLOTS } from "./utils";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type StockStatus = "in" | "low";

export interface Category {
  slug: string;
  name: string;
  tagline: string;
  image: string;
}

export interface Variant {
  label: string;
  price: number;
}

export interface Review {
  author: string;
  area: string;
  rating: 1 | 2 | 3 | 4 | 5;
  date: string;
  text: string;
}

export interface Nutrition {
  energy: string;
  protein: string;
  carbs: string;
  fat: string;
  fibre: string;
}

export interface Product {
  slug: string;
  name: string;
  category: string;
  price: number;
  dealPrice?: number;
  unit: string;
  image: string;
  gallery: string[];
  stock: StockStatus;
  isNew?: boolean;
  description: string;
  origin: string;
  nutrition?: Nutrition;
  storage: string;
  variants?: Variant[];
  rating: number;
  ratingCount: number;
  reviews: Review[];
}

export interface Bundle {
  slug: string;
  name: string;
  price: number;
  cadence: string;
  image: string;
  blurb: string;
  contents: string[];
  saves: string;
}

export interface Testimonial {
  name: string;
  area: string;
  rating: number;
  text: string;
  avatar: string;
  role: string;
}

/* ------------------------------------------------------------------ */
/* Categories (mega-menu strip order per brief)                        */
/* ------------------------------------------------------------------ */

export const categories: Category[] = [
  {
    slug: "fruits-and-vegetables",
    name: "Fruits & Vegetables",
    tagline: "Sourced daily from Wakulima Market & Kiambu farms",
    image: "/images/tile-fruits-vegetables.jpg",
  },
  {
    slug: "meat-and-fish",
    name: "Meat & Fish",
    tagline: "Butcher-cut, chilled and inspected",
    image: "/images/tile-meat-fish.jpg",
  },
  {
    slug: "dairy-and-eggs",
    name: "Dairy & Eggs",
    tagline: "Farm-fresh, delivered cold",
    image: "/images/tile-dairy-eggs.jpg",
  },
  {
    slug: "bakery",
    name: "Bakery",
    tagline: "Baked fresh every morning",
    image: "/images/tile-bakery.jpg",
  },
  {
    slug: "beverages",
    name: "Beverages",
    tagline: "Kenyan tea, juices & more",
    image: "/images/tile-beverages.jpg",
  },
  {
    slug: "household",
    name: "Household",
    tagline: "Everything for a clean home",
    image: "/images/tile-household.jpg",
  },
  {
    slug: "baby-and-kids",
    name: "Baby & Kids",
    tagline: "Safe, sturdy & fun",
    image: "/images/tile-baby-kids.jpg",
  },
  {
    slug: "personal-care",
    name: "Personal Care",
    tagline: "Naturally good for your skin",
    image: "/images/tile-personal-care.jpg",
  },
  {
    slug: "frozen-foods",
    name: "Frozen Foods",
    tagline: "Quick meals, kept frozen",
    image: "/images/tile-frozen-foods.jpg",
  },
];

/* ------------------------------------------------------------------ */
/* Products                                                            */
/* ------------------------------------------------------------------ */

export const products: Product[] = [
  /* ---------------- Fruits & Vegetables ---------------- */
  {
    slug: "hass-avocados",
    name: "Hass Avocados",
    category: "fruits-and-vegetables",
    price: 250,
    dealPrice: 199,
    unit: "4 pcs",
    image: "/images/p-hass-avocados.jpg",
    gallery: ["/images/p-hass-avocados.jpg", "/images/x-fruit-stall.jpg", "/images/tile-fruits-vegetables.jpg"],
    stock: "in",
    description:
      "Creamy, ready-to-eat Hass avocados picked at peak ripeness from orchards around Murang'a and Nyeri. Perfect for toast, guacamole or a quick breakfast smoothie.",
    origin: "Murang'a County, Kenya",
    nutrition: { energy: "160 kcal", protein: "2 g", carbs: "8.5 g", fat: "14.7 g", fibre: "6.7 g" },
    storage: "Ripen at room temperature, then refrigerate for up to 4 days.",
    rating: 4.8,
    ratingCount: 212,
    reviews: [
      { author: "Wanjiru K.", area: "Kilimani", rating: 5, date: "Last week", text: "Every single one was ripe and creamy. I've stopped buying avocados anywhere else." },
      { author: "Brian M.", area: "South C", rating: 5, date: "2 weeks ago", text: "Ordered 8 pcs on Friday, they carried me through the weekend guests. Zero disappointments." },
    ],
  },
  {
    slug: "sukuma-wiki",
    name: "Sukuma Wiki",
    category: "fruits-and-vegetables",
    price: 60,
    unit: "1 kg bundle",
    image: "/images/p-sukuma-wiki.jpg",
    gallery: ["/images/p-sukuma-wiki.jpg", "/images/x-market-produce.jpg", "/images/x-market-vendor.jpg"],
    stock: "in",
    description:
      "Fresh, dark-leaf sukuma wiki cut each morning from Kiambu farms. Washed, bundled and delivered crisp — ready for the pan with a little onion and tomato.",
    origin: "Kiambu County, Kenya",
    nutrition: { energy: "49 kcal", protein: "4.3 g", carbs: "8.8 g", fat: "0.9 g", fibre: "3.6 g" },
    storage: "Keep refrigerated in a bag. Best used within 3 days.",
    rating: 4.7,
    ratingCount: 341,
    reviews: [
      { author: "Mama Njeri", area: "Kasarani", rating: 5, date: "Last week", text: "Crisp and green, exactly like Gikomba pickings without the trip." },
      { author: "Kevin O.", area: "Donholm", rating: 4, date: "3 weeks ago", text: "Great quality. I order 3 bundles weekly with the Veggie Box." },
    ],
  },
  {
    slug: "ripe-tomatoes",
    name: "Ripe Tomatoes",
    category: "fruits-and-vegetables",
    price: 120,
    dealPrice: 99,
    unit: "1 kg",
    image: "/images/p-tomatoes.jpg",
    gallery: ["/images/p-tomatoes.jpg", "/images/x-market-produce.jpg"],
    stock: "in",
    description:
      "Firm, vine-ripened tomatoes from the slopes of Loitokitok. Deep red, full of flavour and perfect for stews, salads and that Sunday mchuzi.",
    origin: "Loitokitok, Kajiado County",
    nutrition: { energy: "18 kcal", protein: "0.9 g", carbs: "3.9 g", fat: "0.2 g", fibre: "1.2 g" },
    storage: "Store at room temperature away from direct sun. Refrigerate only when fully ripe.",
    rating: 4.6,
    ratingCount: 189,
    reviews: [
      { author: "Faith A.", area: "Ruaka", rating: 5, date: "Last week", text: "Sweet and firm — the deal price made my month honestly." },
    ],
  },
  {
    slug: "sweet-bananas",
    name: "Sweet Bananas",
    category: "fruits-and-vegetables",
    price: 130,
    unit: "1 kg",
    image: "/images/p-bananas.jpg",
    gallery: ["/images/p-bananas.jpg", "/images/hero-nairobi-market.jpg", "/images/x-fruit-stall.jpg"],
    stock: "in",
    description:
      "Naturally sweet finger bananas from Meru. Great for lunchboxes, smoothies and a quick energy boost before the gym.",
    origin: "Meru County, Kenya",
    nutrition: { energy: "89 kcal", protein: "1.1 g", carbs: "23 g", fat: "0.3 g", fibre: "2.6 g" },
    storage: "Ripen on the counter. Peel and freeze over-ripe ones for smoothies.",
    rating: 4.5,
    ratingCount: 156,
    reviews: [
      { author: "Dennis M.", area: "Mlolongo", rating: 4, date: "2 weeks ago", text: "Perfectly ripe, kids finished them in two days. Ordering more." },
    ],
  },
  {
    slug: "apple-mangoes",
    name: "Apple Mangoes",
    category: "fruits-and-vegetables",
    price: 280,
    unit: "2 kg",
    image: "/images/p-mangoes.jpg",
    gallery: ["/images/p-mangoes.jpg", "/images/x-fruit-stall.jpg"],
    stock: "in",
    description:
      "The famous Kenyan apple mango — small, fragrant and fibreless with honey sweetness. In season from Makueni and Machakos orchards.",
    origin: "Makueni County, Kenya",
    nutrition: { energy: "60 kcal", protein: "0.8 g", carbs: "15 g", fat: "0.4 g", fibre: "1.6 g" },
    storage: "Ripen at room temperature for 2–3 days, then refrigerate.",
    rating: 4.9,
    ratingCount: 98,
    reviews: [
      { author: "Sharon W.", area: "Syokimau", rating: 5, date: "Last week", text: "Sweet like candy, no strings at all. My December has a new tradition." },
    ],
  },
  {
    slug: "mixed-capsicum",
    name: "Mixed Capsicum",
    category: "fruits-and-vegetables",
    price: 150,
    unit: "500 g",
    image: "/images/p-capsicum.jpg",
    gallery: ["/images/p-capsicum.jpg", "/images/x-market-produce.jpg"],
    stock: "low",
    description:
      "A colourful trio of red, yellow and green capsicum from Naivasha greenhouses. Crunchy and sweet — ideal for stir-fries, salads and pilau garnish.",
    origin: "Naivasha, Nakuru County",
    nutrition: { energy: "31 kcal", protein: "1 g", carbs: "6 g", fat: "0.3 g", fibre: "2.1 g" },
    storage: "Refrigerate unwashed in the crisper for up to a week.",
    rating: 4.4,
    ratingCount: 76,
    reviews: [
      { author: "Chef Ali", area: "Parklands", rating: 4, date: "Last month", text: "Restaurant-grade colour and crunch. Only wish the 500g pack was bigger." },
    ],
  },

  /* ---------------- Meat & Fish ---------------- */
  {
    slug: "tilapia-fillet",
    name: "Fresh Tilapia Fillet",
    category: "meat-and-fish",
    price: 450,
    unit: "500 g",
    image: "/images/p-tilapia.jpg",
    gallery: ["/images/p-tilapia.jpg", "/images/p-goat-cuts.jpg", "/images/tile-meat-fish.jpg"],
    stock: "in",
    description:
      "Boneless fillets from Lake Victoria tilapia, cleaned and chilled on ice the same morning. Pan-fry with lemon and dhania for dinner in 15 minutes.",
    origin: "Lake Victoria (Homa Bay)",
    nutrition: { energy: "96 kcal", protein: "20 g", carbs: "0 g", fat: "1.7 g", fibre: "0 g" },
    storage: "Keep on ice or refrigerate at 0–4°C. Use within 2 days or freeze.",
    variants: [{ label: "500 g", price: 450 }, { label: "1 kg", price: 850 }],
    rating: 4.7,
    ratingCount: 143,
    reviews: [
      { author: "Otieno O.", area: "Westlands", rating: 5, date: "Last week", text: "Tastes like home. Clean fillets, no muddy smell, firm flesh." },
      { author: "Lydia K.", area: "Ngong Road", rating: 4, date: "3 weeks ago", text: "Fresh and well cut. Delivered still cold with the ice pack." },
    ],
  },
  {
    slug: "beef-stewing-cubes",
    name: "Beef Stewing Cubes",
    category: "meat-and-fish",
    price: 690,
    dealPrice: 549,
    unit: "1 kg",
    image: "/images/p-beef-cubes.jpg",
    gallery: ["/images/p-beef-cubes.jpg", "/images/tile-meat-fish.jpg"],
    stock: "in",
    description:
      "Lean, well-trimmed beef cubes from grass-fed Kenyan zebu. Cut for the pot — perfect for wet fry, stew or a slow Sunday nyama choma grill.",
    origin: "Kajiado County rangelands",
    nutrition: { energy: "250 kcal", protein: "26 g", carbs: "0 g", fat: "15 g", fibre: "0 g" },
    storage: "Refrigerate and cook within 3 days, or freeze on delivery day.",
    variants: [{ label: "500 g", price: 360 }, { label: "1 kg", price: 690 }],
    rating: 4.6,
    ratingCount: 201,
    reviews: [
      { author: "Mutua K.", area: "South B", rating: 5, date: "Last week", text: "The deal price on this beef is unbeatable. Minimal fat, generous cuts." },
    ],
  },
  {
    slug: "chicken-wings",
    name: "Chicken Wings",
    category: "meat-and-fish",
    price: 390,
    unit: "1 kg",
    image: "/images/p-chicken-wings.jpg",
    gallery: ["/images/p-chicken-wings.jpg", "/images/tile-meat-fish.jpg"],
    stock: "in",
    description:
      "Plump, skin-on chicken wings from Kenyan poultry farms. Toss them in honey-garlic glaze or classic pili-pili for match night.",
    origin: "Kinangop poultry farms",
    nutrition: { energy: "203 kcal", protein: "18 g", carbs: "0 g", fat: "14 g", fibre: "0 g" },
    storage: "Refrigerate at 0–4°C. Cook within 2 days or freeze.",
    rating: 4.5,
    ratingCount: 167,
    reviews: [
      { author: "Amina H.", area: "South B", rating: 5, date: "2 weeks ago", text: "Big wings, properly cleaned. The kids' favourite Friday treat." },
    ],
  },
  {
    slug: "goat-choma-cuts",
    name: "Goat Choma Cuts",
    category: "meat-and-fish",
    price: 750,
    unit: "1 kg",
    image: "/images/p-goat-cuts.jpg",
    gallery: ["/images/p-goat-cuts.jpg", "/images/p-beef-cubes.jpg"],
    stock: "low",
    description:
      "Premium goat ribs and chops, the choma-cut way. From free-range Galla goats in the rangelands — rich flavour, tender bite, zero shortcuts.",
    origin: "Machakos County",
    nutrition: { energy: "143 kcal", protein: "27 g", carbs: "0 g", fat: "3 g", fibre: "0 g" },
    storage: "Refrigerate and grill within 2 days for best texture.",
    rating: 4.8,
    ratingCount: 89,
    reviews: [
      { author: "Juma M.", area: "Lavington", rating: 5, date: "Last week", text: "Ordered for a choma Sunday — guests asked where I bought. Enough said." },
    ],
  },

  /* ---------------- Dairy & Eggs ---------------- */
  {
    slug: "fresh-milk",
    name: "Fresh Cow Milk",
    category: "dairy-and-eggs",
    price: 120,
    unit: "1 litre",
    image: "/images/p-fresh-milk.jpg",
    gallery: ["/images/p-fresh-milk.jpg", "/images/x-milk-pour.jpg", "/images/tile-dairy-eggs.jpg"],
    stock: "in",
    description:
      "Farm-fresh whole milk from Kiambu dairy co-operatives, delivered chilled the same morning it is milked. Your chai will never be the same.",
    origin: "Kiambu dairy co-operatives",
    nutrition: { energy: "61 kcal", protein: "3.2 g", carbs: "4.8 g", fat: "3.3 g", fibre: "0 g" },
    storage: "Keep refrigerated below 4°C. Best within 3 days.",
    variants: [{ label: "500 ml", price: 65 }, { label: "1 litre", price: 120 }, { label: "2 litres", price: 235 }],
    rating: 4.7,
    ratingCount: 302,
    reviews: [
      { author: "Njeri M.", area: "Uthiru", rating: 5, date: "Last week", text: "Genuinely farm-fresh. The cream layer on my morning chai says it all." },
    ],
  },
  {
    slug: "exotic-eggs",
    name: "Exotic Eggs",
    category: "dairy-and-eggs",
    price: 530,
    dealPrice: 449,
    unit: "Tray of 30",
    image: "/images/p-eggs.jpg",
    gallery: ["/images/p-eggs.jpg", "/images/tile-dairy-eggs.jpg"],
    stock: "in",
    description:
      "Grade A brown eggs from free-range hens fed on grain and greens. Strong shells, golden yolks — a tray that actually lasts the family the week.",
    origin: "Nakuru County farms",
    nutrition: { energy: "155 kcal", protein: "13 g", carbs: "1.1 g", fat: "11 g", fibre: "0 g" },
    storage: "Refrigerate. Safe for up to 3 weeks.",
    rating: 4.6,
    ratingCount: 254,
    reviews: [
      { author: "Peter K.", area: "Kileleshwa", rating: 5, date: "Last week", text: "Tray of 30 at this deal price beats every supermarket in town. Yolks stand tall." },
    ],
  },
  {
    slug: "natural-yogurt",
    name: "Natural Yogurt",
    category: "dairy-and-eggs",
    price: 180,
    unit: "500 g",
    image: "/images/p-yogurt.jpg",
    gallery: ["/images/p-yogurt.jpg", "/images/x-strawberries.jpg"],
    stock: "in",
    description:
      "Thick, set natural yogurt with live cultures — no added sugar. Pair with our strawberries and a drizzle of honey for a quick, healthy breakfast.",
    origin: "Made in Nairobi",
    nutrition: { energy: "61 kcal", protein: "3.5 g", carbs: "4.7 g", fat: "3.3 g", fibre: "0 g" },
    storage: "Keep refrigerated at 0–4°C and consume within 5 days.",
    rating: 4.5,
    ratingCount: 112,
    reviews: [
      { author: "Wambui N.", area: "Mountain View", rating: 4, date: "2 weeks ago", text: "Proper tangy yogurt. I add my own honey and berries — breakfast sorted." },
    ],
  },

  /* ---------------- Bakery ---------------- */
  {
    slug: "white-bread",
    name: "Fresh White Bread",
    category: "bakery",
    price: 65,
    unit: "600 g loaf",
    image: "/images/p-bread.jpg",
    gallery: ["/images/p-bread.jpg", "/images/tile-bakery.jpg"],
    stock: "in",
    description:
      "Soft-crumb white bread baked in our ovens at 4am and delivered by breakfast. The classic for chai dip, toast and school sandwiches.",
    origin: "FreshMart Bakery, Nairobi",
    nutrition: { energy: "265 kcal", protein: "9 g", carbs: "49 g", fat: "3.2 g", fibre: "2.7 g" },
    storage: "Best on the day of delivery. Keeps 2 days wrapped.",
    rating: 4.5,
    ratingCount: 421,
    reviews: [
      { author: "Caroline M.", area: "Zimmerman", rating: 5, date: "Last week", text: "Still warm at 8am. My kids refuse bread from anywhere else now." },
    ],
  },
  {
    slug: "mandazi",
    name: "Mandazi (6 pack)",
    category: "bakery",
    price: 150,
    unit: "6 pcs",
    image: "/images/p-mandazi.jpg",
    gallery: ["/images/p-mandazi.jpg", "/images/p-black-tea.jpg", "/images/tile-bakery.jpg"],
    stock: "low",
    description:
      "Golden, lightly cardamom-scented mandazi fried fresh each morning. The official companion of Kenyan chai — order before 10am to catch them warm.",
    origin: "FreshMart Bakery, Nairobi",
    nutrition: { energy: "330 kcal", protein: "5 g", carbs: "42 g", fat: "15 g", fibre: "1.4 g" },
    storage: "Best eaten same day. Warm 10 seconds in the microwave to revive.",
    rating: 4.8,
    ratingCount: 187,
    reviews: [
      { author: "Alex O.", area: "Kilimani", rating: 5, date: "Last week", text: "Tastes like grandma's. Cardamom is on point, not oily at all." },
    ],
  },
  {
    slug: "butter-croissants",
    name: "Butter Croissants",
    category: "bakery",
    price: 260,
    unit: "4 pack",
    image: "/images/p-croissants.jpg",
    gallery: ["/images/p-croissants.jpg", "/images/tile-bakery.jpg"],
    stock: "in",
    isNew: true,
    description:
      "72-hour laminated all-butter croissants, baked to a deep golden shatter. New in our bakery line — grab them with the Friday morning chai.",
    origin: "FreshMart Bakery, Nairobi",
    nutrition: { energy: "406 kcal", protein: "8 g", carbs: "42 g", fat: "21 g", fibre: "2.6 g" },
    storage: "Best on the day of delivery. Freeze extra ones and re-bake 5 minutes.",
    rating: 4.9,
    ratingCount: 64,
    reviews: [
      { author: "Neema J.", area: "Karen", rating: 5, date: "Last week", text: "Flaky layers everywhere. This is a proper croissant, Nairobi can be proud." },
    ],
  },

  /* ---------------- Beverages ---------------- */
  {
    slug: "ketepa-black-tea",
    name: "Ketepa Black Tea",
    category: "beverages",
    price: 165,
    unit: "250 g",
    image: "/images/p-black-tea.jpg",
    gallery: ["/images/p-black-tea.jpg", "/images/tile-beverages.jpg"],
    stock: "in",
    description:
      "Strong, full-bodied Kenyan black tea from Kericho highlands. The leaves behind a proper built tea — bold colour, brisk flavour, fair price.",
    origin: "Kericho, Kenya",
    nutrition: { energy: "2 kcal", protein: "0 g", carbs: "0.4 g", fat: "0 g", fibre: "0 g" },
    storage: "Store in an airtight container away from moisture and spices.",
    rating: 4.7,
    ratingCount: 368,
    reviews: [
      { author: "Hellen W.", area: "Roysambu", rating: 5, date: "Last week", text: "Fragrant and strong. One spoon per cup goes a long way." },
    ],
  },
  {
    slug: "orange-mango-juice",
    name: "Orange-Mango Juice",
    category: "beverages",
    price: 250,
    dealPrice: 199,
    unit: "1 litre",
    image: "/images/p-juice.jpg",
    gallery: ["/images/p-juice.jpg", "/images/p-mangoes.jpg", "/images/tile-beverages.jpg"],
    stock: "in",
    description:
      "Chilled, not-from-concentrate juice pressed from Coast oranges and apple mangoes. No added sugar — just fruit doing what fruit does best.",
    origin: "Pressed in Nairobi",
    nutrition: { energy: "54 kcal", protein: "0.7 g", carbs: "13 g", fat: "0.2 g", fibre: "0.3 g" },
    storage: "Keep refrigerated. Shake well and enjoy within 4 days of opening.",
    rating: 4.4,
    ratingCount: 91,
    reviews: [
      { author: "Sam K.", area: "Ngara", rating: 4, date: "2 weeks ago", text: "You can taste real mango. Kids approved, and that is the real review." },
    ],
  },

  /* ---------------- Household ---------------- */
  {
    slug: "home-cleaning-kit",
    name: "Home Cleaning Kit",
    category: "household",
    price: 450,
    unit: "4 products",
    image: "/images/p-cleaning-kit.jpg",
    gallery: ["/images/p-cleaning-kit.jpg", "/images/tile-household.jpg"],
    stock: "in",
    description:
      "A starter set of Kenyan-made cleaning essentials: multi-surface spray, floor cleaner, sanitiser and glass cleaner. One box, whole house sorted.",
    origin: "Made in Kenya",
    storage: "Store away from children and food. Do not mix products.",
    rating: 4.3,
    ratingCount: 58,
    reviews: [
      { author: "Beatrice N.", area: "Mwiki", rating: 4, date: "Last month", text: "Good value bundle. The surface spray smells clean, not chemical." },
    ],
  },
  {
    slug: "dishwashing-set",
    name: "Dishwashing Liquid & Sponge",
    category: "household",
    price: 180,
    unit: "750 ml + 2 sponges",
    image: "/images/p-dish-soap.jpg",
    gallery: ["/images/p-dish-soap.jpg", "/images/tile-household.jpg"],
    stock: "low",
    description:
      "Tough on grease, gentle on hands — a thick-lather dishwashing liquid with two heavy-duty sponges included. Refill-friendly bottle.",
    origin: "Made in Kenya",
    storage: "Rinse sponges after use. Replace sponges every 2–3 weeks.",
    rating: 4.4,
    ratingCount: 73,
    reviews: [
      { author: "Irene M.", area: "Githurai", rating: 5, date: "3 weeks ago", text: "A little goes a long way with this one. Sponges are the sturdy kind." },
    ],
  },
  {
    slug: "bathroom-tissue",
    name: "Bathroom Tissue",
    category: "household",
    price: 320,
    unit: "9 rolls",
    image: "/images/p-tissue.jpg",
    gallery: ["/images/p-tissue.jpg", "/images/tile-household.jpg"],
    stock: "in",
    description:
      "Soft 2-ply bathroom tissue in a value 9-roll pack. Double-length rolls mean fewer trips to the shop for the house essentials.",
    origin: "Made in Kenya",
    storage: "Store in a dry place.",
    rating: 4.2,
    ratingCount: 129,
    reviews: [
      { author: "Victor O.", area: "Embakasi", rating: 4, date: "Last month", text: "Soft and the rolls last. Bulk price is fair." },
    ],
  },

  /* ---------------- Baby & Kids ---------------- */
  {
    slug: "wooden-learning-blocks",
    name: "Wooden Learning Blocks",
    category: "baby-and-kids",
    price: 1250,
    unit: "48 pcs",
    image: "/images/p-wooden-blocks.jpg",
    gallery: ["/images/p-wooden-blocks.jpg", "/images/tile-baby-kids.jpg"],
    stock: "in",
    isNew: true,
    description:
      "Smooth, non-toxic painted wooden blocks for building, counting and spelling. Screen-free play that grows with your child from age 2.",
    origin: "Made in Kenya",
    storage: "Wipe clean with a damp cloth. Not suitable for children under 2.",
    rating: 4.7,
    ratingCount: 41,
    reviews: [
      { author: "Joy A.", area: "Komarock", rating: 5, date: "2 weeks ago", text: "Solid wood, bright colours, zero splinters. My son builds towers daily." },
    ],
  },
  {
    slug: "wooden-dino-set",
    name: "Wooden Dino Play Set",
    category: "baby-and-kids",
    price: 950,
    unit: "6 dinos",
    image: "/images/p-wooden-dinos.jpg",
    gallery: ["/images/p-wooden-dinos.jpg", "/images/tile-baby-kids.jpg"],
    stock: "in",
    description:
      "A set of six hand-finished wooden dinosaurs for imagination play. Chunky shapes sized right for small hands, painted with child-safe colours.",
    origin: "Made in Kenya",
    storage: "Wipe clean with a damp cloth.",
    rating: 4.6,
    ratingCount: 33,
    reviews: [
      { author: "Collins K.", area: "Mombasa Road", rating: 5, date: "Last month", text: "Bought for my daughter's 4th birthday — the dinos have not left her side since." },
    ],
  },

  /* ---------------- Personal Care ---------------- */
  {
    slug: "natural-soap-bars",
    name: "Natural Soap Bars",
    category: "personal-care",
    price: 240,
    unit: "3 bars",
    image: "/images/p-soap-bars.jpg",
    gallery: ["/images/p-soap-bars.jpg", "/images/tile-personal-care.jpg"],
    stock: "in",
    description:
      "Handmade cold-process soap bars with shea and honey — no parabens, no synthetic fragrance. Kind to skin, gentle enough for the whole family.",
    origin: "Made in Kenya",
    storage: "Keep bars dry between uses on a drained dish.",
    rating: 4.5,
    ratingCount: 87,
    reviews: [
      { author: "Mercy W.", area: "Kahawa West", rating: 5, date: "2 weeks ago", text: "My sensitive skin finally agrees with a soap. The honey bar smells like comfort." },
    ],
  },
  {
    slug: "herbal-toothpaste",
    name: "Herbal Toothpaste",
    category: "personal-care",
    price: 280,
    unit: "100 ml",
    image: "/images/p-toothpaste.jpg",
    gallery: ["/images/p-toothpaste.jpg", "/images/tile-personal-care.jpg"],
    stock: "in",
    description:
      "Fluoride-free herbal toothpaste with aloe and mint. Fresh breath and clean teeth without the harsh after-burn of ordinary paste.",
    origin: "Made in Kenya",
    storage: "Store below 30°C. Use within 6 months of opening.",
    rating: 4.1,
    ratingCount: 44,
    reviews: [
      { author: "Teresa N.", area: "Umoja", rating: 4, date: "Last month", text: "Mild mint, no burn. Took a week to get used to, now I prefer it." },
    ],
  },
  {
    slug: "raw-shea-butter",
    name: "Raw Shea Body Butter",
    category: "personal-care",
    price: 300,
    unit: "125 g jar",
    image: "/images/p-shea-butter.jpg",
    gallery: ["/images/p-shea-butter.jpg", "/images/tile-personal-care.jpg"],
    stock: "low",
    description:
      "Unrefined West African shea butter whipped into a rich body cream. Deep moisture for Nairobi's dry season and after-sun care.",
    origin: "West Africa, packed in Kenya",
    storage: "Store in a cool place. Solidifies below 20°C — warm between palms.",
    rating: 4.8,
    ratingCount: 66,
    reviews: [
      { author: "Nadia S.", area: "Kileleshwa", rating: 5, date: "Last week", text: "July dry season survival kit. A pea-sized amount covers both arms." },
    ],
  },

  /* ---------------- Frozen Foods ---------------- */
  {
    slug: "frozen-green-peas",
    name: "Frozen Green Peas",
    category: "frozen-foods",
    price: 170,
    dealPrice: 139,
    unit: "500 g",
    image: "/images/p-frozen-peas.jpg",
    gallery: ["/images/p-frozen-peas.jpg", "/images/tile-frozen-foods.jpg"],
    stock: "in",
    description:
      "Flash-frozen at peak sweetness within hours of picking. Straight from freezer to pan — no shelling, no waste, all the nutrition.",
    origin: "Nanyuki farms",
    nutrition: { energy: "81 kcal", protein: "5.4 g", carbs: "14 g", fat: "0.4 g", fibre: "5.7 g" },
    storage: "Keep frozen at –18°C. Do not refreeze after thawing.",
    rating: 4.3,
    ratingCount: 95,
    reviews: [
      { author: "Grace M.", area: "Riruta", rating: 4, date: "Last week", text: "Sweet and fresh-tasting even after months in my freezer. Rice-and-peas night saver." },
    ],
  },
  {
    slug: "frozen-fries",
    name: "Frozen Potato Fries",
    category: "frozen-foods",
    price: 240,
    unit: "1 kg",
    image: "/images/p-frozen-fries.jpg",
    gallery: ["/images/p-frozen-fries.jpg", "/images/tile-frozen-foods.jpg"],
    stock: "in",
    isNew: true,
    description:
      "Skin-on straight-cut fries cut from Kenyan potatoes, blanched and blast-frozen. Air-fryer ready in 12 minutes with no oil needed.",
    origin: "Nyaribo, Nyandarua",
    nutrition: { energy: "150 kcal", protein: "2.5 g", carbs: "24 g", fat: "4.5 g", fibre: "2.2 g" },
    storage: "Keep frozen at –18°C. Cook from frozen.",
    rating: 4.5,
    ratingCount: 152,
    reviews: [
      { author: "Douglas M.", area: "Kikuyu", rating: 5, date: "Last week", text: "Air-fry 12 minutes and they crisp up beautifully. Family approved." },
    ],
  },
  {
    slug: "frozen-samosas",
    name: "Frozen Samosas (12 pack)",
    category: "frozen-foods",
    price: 450,
    unit: "12 pcs",
    image: "/images/p-samosas.jpg",
    gallery: ["/images/p-samosas.jpg", "/images/tile-frozen-foods.jpg"],
    stock: "low",
    description:
      "Hand-folded beef samosas with our spiced filling, frozen uncooked so they fry up crisp at home. Guests at the door? Twelve minutes to hero status.",
    origin: "FreshMart Kitchen, Nairobi",
    nutrition: { energy: "308 kcal", protein: "7 g", carbs: "28 g", fat: "18 g", fibre: "2 g" },
    storage: "Keep frozen at –18°C. Deep-fry or air-fry from frozen.",
    rating: 4.7,
    ratingCount: 118,
    reviews: [
      { author: "Purity C.", area: "Runda", rating: 5, date: "2 weeks ago", text: "Fried up golden and stayed crisp. The filling is properly spiced, not shy." },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Subscription bundles                                                */
/* ------------------------------------------------------------------ */

export const bundles: Bundle[] = [
  {
    slug: "veggie-box",
    name: "Veggie Box",
    price: 2499,
    cadence: "weekly",
    image: "/images/bundle-veggie.jpg",
    blurb: "A family-sized selection of the week's best greens and fruits.",
    contents: [
      "Sukuma wiki — 2 bundles",
      "Spinach — 1 bunch",
      "Ripe tomatoes — 1 kg",
      "Red onions — 1 kg",
      "Potatoes — 2 kg",
      "Carrots — 500 g",
      "Mixed capsicum — 500 g",
      "Sweet bananas — 1 kg",
      "Hass avocados — 3 pcs",
    ],
    saves: "Saves ~KES 400 vs buying separately",
  },
  {
    slug: "family-essentials-box",
    name: "Family Essentials Box",
    price: 4999,
    cadence: "weekly",
    image: "/images/bundle-family.jpg",
    blurb: "The pantry backbone for a household of four, topped up every week.",
    contents: [
      "Fresh cow milk — 3 litres",
      "Exotic eggs — tray of 30",
      "Fresh white bread — 2 loaves",
      "Maize flour — 2 kg",
      "Pishori rice — 2 kg",
      "Cooking oil — 1 litre",
      "Ketepa black tea — 250 g",
      "Sugar — 1 kg",
      "Laundry detergent — 1 litre",
    ],
    saves: "Saves ~KES 650 vs buying separately",
  },
  {
    slug: "protein-pack",
    name: "Protein Pack",
    price: 5999,
    cadence: "weekly",
    image: "/images/bundle-protein.jpg",
    blurb: "Butcher-cut meat and fish for a week of proper dinners.",
    contents: [
      "Beef stewing cubes — 1 kg",
      "Whole chicken — approx. 1 kg",
      "Tilapia fillet — 1 kg",
      "Goat choma cuts — 500 g",
      "Exotic eggs — 6 pcs",
      "Beef sausages — 500 g",
    ],
    saves: "Saves ~KES 800 vs buying separately",
  },
];

/* ------------------------------------------------------------------ */
/* Deals                                                               */
/* ------------------------------------------------------------------ */

export const dealSlugs = [
  "hass-avocados",
  "ripe-tomatoes",
  "beef-stewing-cubes",
  "exotic-eggs",
  "orange-mango-juice",
  "frozen-green-peas",
];

/* ------------------------------------------------------------------ */
/* Featured                                                            */
/* ------------------------------------------------------------------ */

export const featuredSlugs = [
  "hass-avocados",
  "tilapia-fillet",
  "fresh-milk",
  "butter-croissants",
  "apple-mangoes",
  "chicken-wings",
  "orange-mango-juice",
  "frozen-fries",
];

/* ------------------------------------------------------------------ */
/* FreshPoints loyalty                                                 */
/* ------------------------------------------------------------------ */

export const loyaltyTiers = [
  { points: 500, reward: "KES 250 off your next order" },
  { points: 1000, reward: "KES 500 off your next order" },
  { points: 2000, reward: "KES 1,100 off + a priority delivery slot" },
  { points: 5000, reward: "KES 3,000 off + free delivery for 30 days" },
];

/* ------------------------------------------------------------------ */
/* Testimonials                                                        */
/* ------------------------------------------------------------------ */

export const testimonials: Testimonial[] = [
  {
    name: "Wanjiru Kamau",
    area: "Kilimani",
    role: "Working mum of two",
    rating: 5,
    text: "I order before my 8am meeting and the groceries are at my door by lunch. The sukuma wiki and avocados are honestly fresher than what I used to pick myself.",
    avatar: "/images/avatar-wanjiru.jpg",
  },
  {
    name: "Otieno Odhiambo",
    area: "Westlands",
    role: "Office procurement manager",
    rating: 5,
    text: "We stock our office pantry with FreshMart every Monday. One Family Essentials Box covers twenty staff, and the invoice arrives on WhatsApp like clockwork.",
    avatar: "/images/avatar-otieno.jpg",
  },
  {
    name: "Amina Hassan",
    area: "South B",
    role: "Veggie Box subscriber",
    rating: 4,
    text: "The weekly Veggie Box changed my evenings. No more market runs after work — and my kids finally finish their greens because they are genuinely fresh.",
    avatar: "/images/avatar-amina.jpg",
  },
];

/* ------------------------------------------------------------------ */
/* Kenyan & East African brand partners                                */
/* ------------------------------------------------------------------ */

export const brands = [
  "Brookside Dairy",
  "Ketepa",
  "Kericho Gold",
  "Bidco Africa",
  "Alpha Fine Foods",
  "House of Manji",
  "Ennsvalley Bakery",
  "Kenafric Industries",
  "Freshco",
  "Zawadi Foods",
];

/* ------------------------------------------------------------------ */
/* Lookup helpers                                                      */
/* ------------------------------------------------------------------ */

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function productsByCategory(slug: string): Product[] {
  return products.filter((p) => p.category === slug);
}

export function getDeals(): Product[] {
  return dealSlugs
    .map(getProduct)
    .filter((p): p is Product => Boolean(p && p.dealPrice));
}

export function getFeatured(): Product[] {
  return featuredSlugs.map(getProduct).filter((p): p is Product => Boolean(p));
}

export function relatedProducts(product: Product, limit = 6): Product[] {
  const same = products.filter(
    (p) => p.category === product.category && p.slug !== product.slug
  );
  const rest = products.filter(
    (p) => p.category !== product.category && p.slug !== product.slug
  );
  return [...same, ...rest].slice(0, limit);
}

export function searchProducts(q: string, limit = 8): Product[] {
  const needle = q.trim().toLowerCase();
  if (!needle) return [];
  return products
    .filter((p) => {
      const cat = getCategory(p.category)?.name ?? "";
      return (
        p.name.toLowerCase().includes(needle) ||
        cat.toLowerCase().includes(needle) ||
        p.description.toLowerCase().includes(needle) ||
        p.unit.toLowerCase().includes(needle)
      );
    })
    .slice(0, limit);
}

export function categoryCounts(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const p of products) counts[p.category] = (counts[p.category] ?? 0) + 1;
  return counts;
}

export { DELIVERY_SLOTS };
