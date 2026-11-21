/* ==========================================================================
   PRAKYATH (GSHM) MALNADA SPICES: SHOP CONFIG
   --------------------------------------------------------------------------
   This is the only file the shop owner needs to edit.
   Everything marked  ✏️  is PLACEHOLDER content. Replace it with real
   details (WhatsApp number, prices, pack sizes, products) before going live.
   ========================================================================== */

window.SHOP = {
  brand: "Prakyath Malnada Spices",
  shortBrand: "Prakyath",
  instagram: "https://www.instagram.com/prakyathmalnadspices/",
  instagramHandle: "@prakyathmalnadspices",

  // ✏️ WhatsApp number with country code, digits only (e.g. "919876543210").
  // If left empty, checkout still opens WhatsApp and the customer picks the chat.
  whatsappNumber: "",

  currency: "₹",
  freeShippingAbove: 599,   // ✏️ order value for free delivery
  shippingFee: 60,          // ✏️ delivery charge below that

  // Coupons customers can unlock on the site (games + quiz).
  // Orders arrive on WhatsApp with the coupon and final total written in,
  // so you can check them before confirming.
  coupons: {
    GRIND10: { type: "percent", value: 10, label: "10% off: you ground it fresh!" },
    MYSPICE: { type: "freeship", value: 0, label: "Free delivery: spice twin bonus" },
  },

  // "Build your Malnad Box": pick N items (smallest pack of each) and get a discount.
  box: { size: 4, discountPercent: 15 },

  categories: [
    { id: "all", label: "Everything" },
    { id: "whole", label: "Whole spices" },
    { id: "masala", label: "Powders & masalas" },
    { id: "estate", label: "From the estate" },
  ],

  // ✏️ PRODUCTS: names, notes, packs and prices are placeholders.
  // short: text on the jar label · texture: corns | pods | cloves | sticks | nuts | powder | beans | flakes
  // heat: 0–4 chillies, aroma: 1–5
  products: [
    {
      id: "pepper", name: "Malnad Black Pepper", short: "Black Pepper", kn: "ಕಾಳುಮೆಣಸು", cat: "whole",
      tag: "Signature", texture: "corns", color: "#2a211b", accent: "#5b4636",
      notes: ["Woody", "Citrusy", "Sharp"], heat: 3, aroma: 5,
      blurb: "Bold, oily corns from rain-fed vines that climb areca and silver oak.",
      variants: [{ w: "100 g", p: 160 }, { w: "250 g", p: 380 }, { w: "500 g", p: 720 }],
    },
    {
      id: "pepper-powder", name: "Fresh-ground Pepper", short: "Pepper Powder", kn: "ಮೆಣಸಿನ ಪುಡಿ", cat: "masala",
      texture: "powder", color: "#4a3b30", accent: "#7a6352",
      notes: ["Punchy", "Warm", "Earthy"], heat: 3, aroma: 4,
      blurb: "Ground in small batches so the aroma hits you when you open the jar.",
      variants: [{ w: "100 g", p: 180 }, { w: "250 g", p: 420 }],
    },
    {
      id: "cardamom", name: "Green Cardamom", short: "Elakki", kn: "ಏಲಕ್ಕಿ", cat: "whole",
      tag: "Fragrant", texture: "pods", color: "#8db255", accent: "#5f8a32",
      notes: ["Floral", "Sweet", "Minty"], heat: 0, aroma: 5,
      blurb: "Plump green pods for chai, payasa and biryani.",
      variants: [{ w: "50 g", p: 220 }, { w: "100 g", p: 420 }],
    },
    {
      id: "cloves", name: "Hand-picked Cloves", short: "Cloves", kn: "ಲವಂಗ", cat: "whole",
      texture: "cloves", color: "#5b3420", accent: "#8a5232",
      notes: ["Intense", "Sweet-hot", "Numbing"], heat: 1, aroma: 5,
      blurb: "Whole-headed cloves, dried slowly so they keep their oils.",
      variants: [{ w: "50 g", p: 140 }, { w: "100 g", p: 260 }],
    },
    {
      id: "cinnamon", name: "Cinnamon Quills", short: "Cinnamon", kn: "ಚಕ್ಕೆ", cat: "whole",
      texture: "sticks", color: "#9b5a2e", accent: "#c27a45",
      notes: ["Sweet", "Woody", "Cosy"], heat: 0, aroma: 4,
      blurb: "Thin, curled bark for pulao, desserts and Sunday baking.",
      variants: [{ w: "100 g", p: 150 }, { w: "250 g", p: 350 }],
    },
    {
      id: "nutmeg", name: "Nutmeg & Mace", short: "Nutmeg", kn: "ಜಾಯಿಕಾಯಿ", cat: "whole",
      texture: "nuts", color: "#8a5a3c", accent: "#c0392b",
      notes: ["Nutty", "Warm", "Buttery"], heat: 0, aroma: 4,
      blurb: "Whole nutmeg with its red mace lace. Grate it fresh.",
      variants: [{ w: "100 g", p: 260 }],
    },
    {
      id: "turmeric", name: "Malnad Turmeric", short: "Turmeric", kn: "ಅರಿಶಿನ", cat: "masala",
      texture: "powder", color: "#e8a317", accent: "#c98a0c",
      notes: ["Earthy", "Golden", "Gingery"], heat: 0, aroma: 3,
      blurb: "Deep golden powder with no added colour.",
      variants: [{ w: "200 g", p: 140 }, { w: "500 g", p: 320 }],
    },
    {
      id: "chilli", name: "Byadagi Chilli Powder", short: "Byadagi", kn: "ಬ್ಯಾಡಗಿ ಮೆಣಸಿನಕಾಯಿ", cat: "masala",
      texture: "powder", color: "#b8321f", accent: "#8f2414",
      notes: ["Smoky", "Vivid red", "Medium heat"], heat: 2, aroma: 3,
      blurb: "That famous Karnataka red: lots of colour, gentle heat.",
      variants: [{ w: "200 g", p: 160 }, { w: "500 g", p: 380 }],
    },
    {
      id: "sambar", name: "Home-style Sambar Powder", short: "Sambar", kn: "ಸಾಂಬಾರ್ ಪುಡಿ", cat: "masala",
      tag: "Ajji's recipe", texture: "powder", color: "#a8541f", accent: "#7d3c12",
      notes: ["Roasted", "Tangy", "Hearty"], heat: 2, aroma: 4,
      blurb: "Slow-roasted, ground the way it's made at home in Malnad.",
      variants: [{ w: "200 g", p: 170 }, { w: "500 g", p: 400 }],
    },
    {
      id: "rasam", name: "Rasam Powder", short: "Rasam", kn: "ಸಾರಿನ ಪುಡಿ", cat: "masala",
      texture: "powder", color: "#9c3d1c", accent: "#6e2710",
      notes: ["Peppery", "Bright", "Comforting"], heat: 2, aroma: 4,
      blurb: "Pepper-forward saaru powder for rainy-day comfort.",
      variants: [{ w: "200 g", p: 160 }],
    },
    {
      id: "kashaya", name: "Kashaya Mix", short: "Kashaya", kn: "ಕಷಾಯ", cat: "masala",
      texture: "powder", color: "#7a5230", accent: "#4f331c",
      notes: ["Soothing", "Gingery", "Peppery"], heat: 1, aroma: 4,
      blurb: "The traditional warm spice drink for cold, rainy evenings.",
      variants: [{ w: "100 g", p: 150 }, { w: "250 g", p: 340 }],
    },
    {
      id: "coffee", name: "Estate Filter Coffee", short: "Coffee", kn: "ಕಾಫಿ ಪುಡಿ", cat: "estate",
      tag: "Morning ritual", texture: "beans", color: "#3b2418", accent: "#6b4430",
      notes: ["Chocolatey", "Rich", "Smooth"], heat: 0, aroma: 5,
      blurb: "Malnad-grown coffee, roasted and ground for the steel filter.",
      variants: [{ w: "250 g", p: 280 }, { w: "500 g", p: 540 }],
    },
    {
      id: "kokum", name: "Sun-dried Kokum", short: "Kokum", kn: "ಮುರುಗಲು", cat: "estate",
      texture: "flakes", color: "#5a1a2a", accent: "#8c2d45",
      notes: ["Tangy", "Fruity", "Cooling"], heat: 0, aroma: 3,
      blurb: "Murugalu rinds for saaru and summer coolers.",
      variants: [{ w: "200 g", p: 180 }],
    },
  ],

  // Recipes that fill the cart with one tap.
  recipes: [
    {
      title: "Malnad Pepper Fry", time: "30 min", emoji: "🍳",
      desc: "Chicken, mushroom or paneer tossed in crushed pepper, curry leaves and turmeric. Very Malnad.",
      items: ["pepper", "turmeric", "chilli"],
    },
    {
      title: "Ajji's Kashaya", time: "10 min", emoji: "🫖",
      desc: "Boil kashaya mix with jaggery and a pinch of pepper. Sip it while the rain comes down.",
      items: ["kashaya", "pepper-powder"],
    },
    {
      title: "Sunday Sambar", time: "45 min", emoji: "🍲",
      desc: "Toor dal, drumstick, tamarind and a generous spoon of home-style sambar powder.",
      items: ["sambar", "turmeric", "chilli"],
    },
    {
      title: "Elakki Filter Coffee", time: "5 min", emoji: "☕",
      desc: "Crush one cardamom pod into the filter. Pour with frothy milk. Thank us later.",
      items: ["coffee", "cardamom"],
    },
  ],

  // Quiz results. Keys are product ids.
  quizResults: {
    pepper:   { title: "The Bold One",      line: "Black pepper is called the king of spices for a reason. You walk in and the room notices." },
    cardamom: { title: "The Charmer",       line: "Sweet, floral and impossible to forget. Everyone wants you in their chai." },
    coffee:   { title: "The Dreamer",       line: "Misty mornings, a steel tumbler and big plans. You're Malnad filter coffee." },
    chilli:   { title: "The Firecracker",   line: "Colourful, warm and always the life of the party. Byadagi energy." },
    kashaya:  { title: "The Healer",        line: "Everyone calls you when they're down. Warm, soothing, quietly powerful." },
    sambar:   { title: "The Feast-Maker",   line: "Your kitchen is always full and nobody leaves hungry. Pure Sunday sambar." },
    cinnamon: { title: "The Cosy Soul",     line: "Blankets, baking and slow evenings. Warm and sweet." },
    kokum:    { title: "The Free Spirit",   line: "Tangy, surprising and refreshing. You do things your own way." },
    nutmeg:   { title: "The Explorer",      line: "A little mysterious and always trying new things." },
  },

  quiz: [
    {
      q: "Your perfect monsoon evening?",
      a: [
        { t: "Hot drink by the window, rain outside", s: { kashaya: 3, coffee: 1 } },
        { t: "Bajji, chai and loud friends", s: { chilli: 3, cardamom: 1 } },
        { t: "A book and a strong coffee", s: { coffee: 3, nutmeg: 1 } },
        { t: "Cooking a feast for the family", s: { sambar: 3, pepper: 1 } },
      ],
    },
    {
      q: "Pick a flavour mood",
      a: [
        { t: "Bold & sharp", s: { pepper: 3, chilli: 1 } },
        { t: "Sweet & floral", s: { cardamom: 3, cinnamon: 1 } },
        { t: "Warm & cosy", s: { cinnamon: 3, kashaya: 1 } },
        { t: "Tangy & bright", s: { kokum: 3, sambar: 1 } },
      ],
    },
    {
      q: "In the kitchen, you are…",
      a: [
        { t: "The 15-minute weekday hero", s: { pepper: 2, chilli: 1 } },
        { t: "The slow-cooked Sunday type", s: { sambar: 3 } },
        { t: "The baker", s: { cinnamon: 2, nutmeg: 2, cardamom: 1 } },
        { t: "The experimenter", s: { nutmeg: 3, kokum: 2 } },
      ],
    },
    {
      q: "How much heat can you take?",
      a: [
        { t: "None, keep it fragrant", s: { cardamom: 2, coffee: 1, cinnamon: 1 } },
        { t: "A gentle glow", s: { kashaya: 2, kokum: 1 } },
        { t: "Bring the colour", s: { chilli: 2, sambar: 1 } },
        { t: "Make my eyes water", s: { pepper: 3 } },
      ],
    },
  ],

  // ✏️ Paste REAL customer reviews here (e.g. from Instagram DMs/comments, with permission).
  // The reviews section stays hidden while this list is empty.
  // Example: { name: "Ananya, Bengaluru", text: "The pepper smells amazing!", stars: 5 }
  reviews: [],

  faqs: [
    { q: "Where do your spices come from?", a: "From farms in the Malnad region of Karnataka's Western Ghats, where heavy monsoon rain and shade-grown plantations give spices their strong aroma." },
    { q: "Do you add colour or preservatives?", a: "No. Our spices are sun-dried, cleaned and packed as they are. Powders are ground in small batches." },
    { q: "How do I place an order?", a: "Add items to your bag and tap \"Order on WhatsApp\". Your order, address and total are sent to us on WhatsApp, and we confirm payment (UPI or Cash on Delivery) and dispatch." },
    { q: "Do you deliver across India?", a: "Yes, we ship across India. Orders above the free-delivery amount ship free." },
    { q: "How should I store them?", a: "Keep them in an airtight jar, away from sunlight and moisture. Whole spices stay fresh much longer than powders, so grind small amounts when you can." },
  ],
};
