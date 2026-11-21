# Prakyath (GSHM) Malnada Spices: storefront

A playful, conversion-focused shop for an Instagram-first spice brand from Malnad, Karnataka.
Plain HTML/CSS/JS with **no build step and no dependencies**. Upload the folder to any static host
(Hostinger, Netlify, GitHub Pages, Firebase Hosting) and it works.

```
prakyath-malnada-spices/
├── index.html          page structure
├── assets/config.js    ✏️ the ONLY file the shop owner edits
├── assets/app.js       cart, checkout, games, animations
├── assets/styles.css   look & feel
└── assets/logo.webp    brand logo (cut from the Instagram profile picture)
```

Preview locally: `python3 -m http.server 8000`, then open http://localhost:8000

## Before going live: replace the placeholders

Everything below is in `assets/config.js`:

| What | Why |
|---|---|
| `whatsappNumber` | Orders are sent here, e.g. `"919876543210"`. If it's empty, WhatsApp opens and the customer has to pick the chat themselves. |
| `products` | Names, pack sizes and **prices are placeholders**. Match them to the real catalogue. |
| `freeShippingAbove`, `shippingFee` | Delivery rules shown in the bag and the top banner. |
| `coupons` | `GRIND10` (10% off, from the grind game) and `MYSPICE` (free delivery, from the quiz). Codes are written into the WhatsApp order, so they can be checked before confirming. |
| `reviews` | Empty by default, so the section stays hidden. Add **real** customer reviews only, with their permission. |
| `faqs`, `recipes`, `quiz` | Edit freely. |

## How ordering works

The bag → name/phone/address/pincode + UPI or COD → **"Order on WhatsApp"** opens WhatsApp with
a pre-filled, itemised order (order number, items, coupon, delivery charge, total and address).
The customer taps send, and the seller confirms payment in the chat. This suits a brand that sells
through Instagram DMs and WhatsApp, and there's no payment gateway to set up. The bag and the
customer's delivery details are remembered on their device.

To take online payments later, replace `checkout()` in `app.js` with a Razorpay/Cashfree/Shopify call.
The cart totals are already calculated in `totals()`.

## What's on the page

- **Monsoon hero**: animated rain over misty Western Ghats hills. Tap anywhere for a pepper shower,
  or tap the logo badge to "spill the sack".
- **Sniffable jars**: every product is an illustrated jar. Tap it and the lid pops off and the aroma
  notes float out. Includes heat/aroma meters, pack-size picker and a fly-to-bag animation.
- **Build your Malnada Box**: fill a wooden crate with any 4 spices for 15% off (raises order value, and works as a gift).
- **Spice personality quiz**: 4 questions → your "spice twin" + free-delivery code.
- **Grind it fresh!**: tap the mortar 25 times in 10 seconds to unlock 10% off.
- **Vine-to-jar story** with a scroll-drawn pepper vine.
- **Recipe flip cards** with a one-tap "add all spices" button.
- **Conversion basics**: free-delivery progress bar with a truck, smart upsell in the bag, sticky
  mobile bag bar, floating WhatsApp button, FAQ, trust badges, Kannada touches (ಮಲೆನಾಡಿನ ಘಮ).
- Accessible (keyboard, focus states, `prefers-reduced-motion`), mobile-first, no horizontal scroll.
