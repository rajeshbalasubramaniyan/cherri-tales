/* Prakyath Malnada Spices: storefront logic (no build step, no dependencies) */
(() => {
  "use strict";
  const S = window.SHOP;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const RM = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const money = (n) => S.currency + Math.round(n).toLocaleString("en-IN");
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const byId = Object.fromEntries(S.products.map((p) => [p.id, p]));
  const minVar = (p) => p.variants.reduce((a, v, i) => (v.p < p.variants[a].p ? i : a), 0);

  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* storage unavailable */ } },
  };

  const waNumber = String(S.whatsappNumber || "").replace(/\D/g, "");
  const waLink = (text) => `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`;

  /* ------------------------------------------------------------------ */
  /* Illustrated jars (pure SVG, so no product photos are needed)       */
  /* ------------------------------------------------------------------ */
  let uid = 0;
  function textureSVG(p, id) {
    const c = p.color, a = p.accent;
    const pat = (w, h, body) => `<pattern id="${id}" width="${w}" height="${h}" patternUnits="userSpaceOnUse"><rect width="${w}" height="${h}" fill="${c}"/>${body}</pattern>`;
    switch (p.texture) {
      case "corns": return pat(14, 12, `<circle cx="4" cy="4" r="4.4" fill="${a}"/><circle cx="3" cy="3" r="1.2" fill="#fff" opacity=".25"/><circle cx="11" cy="10" r="4.4" fill="${a}"/><circle cx="10" cy="9" r="1.2" fill="#fff" opacity=".25"/>`);
      case "pods": return pat(22, 16, `<ellipse cx="7" cy="5" rx="7" ry="4" fill="${a}" transform="rotate(-20 7 5)"/><ellipse cx="17" cy="12" rx="7" ry="4" fill="#a8cf6b" transform="rotate(25 17 12)"/>`);
      case "cloves": return pat(16, 16, `<path d="M4 2v10M1 3h6" stroke="${a}" stroke-width="2.4" stroke-linecap="round"/><circle cx="4" cy="2.5" r="2.2" fill="${a}"/><path d="M12 6v9" stroke="${a}" stroke-width="2.4" stroke-linecap="round"/><circle cx="12" cy="6" r="2.2" fill="${a}"/>`);
      case "sticks": return pat(26, 14, `<rect x="1" y="2" width="22" height="4" rx="2" fill="${a}"/><rect x="5" y="8" width="20" height="4" rx="2" fill="#7a431f"/>`);
      case "nuts": return pat(28, 22, `<ellipse cx="9" cy="8" rx="8" ry="6.5" fill="${c}" stroke="#5f3c25" stroke-width="1.5"/><path d="M19 14q4-6 8 0q-4 6-8 0" fill="none" stroke="${a}" stroke-width="2"/><ellipse cx="22" cy="17" rx="6" ry="5" fill="#a0704f"/>`);
      case "beans": return pat(16, 14, `<ellipse cx="5" cy="5" rx="5" ry="3.6" fill="${a}"/><path d="M1.5 5h7" stroke="${c}" stroke-width="1"/><ellipse cx="12" cy="11" rx="5" ry="3.6" fill="${a}" transform="rotate(30 12 11)"/>`);
      case "flakes": return pat(20, 18, `<path d="M2 3l8-1 2 6-7 3z" fill="${a}"/><path d="M12 10l7 1-1 6-8-1z" fill="#3e0f1c"/>`);
      default: return pat(8, 8, `<circle cx="2" cy="2" r=".9" fill="#fff" opacity=".18"/><circle cx="6" cy="5" r=".8" fill="#000" opacity=".15"/><circle cx="4" cy="7" r=".6" fill="#fff" opacity=".12"/>`);
    }
  }
  function jarSVG(p, opts = {}) {
    const id = "t" + ++uid, clip = "c" + uid;
    const label = esc((p.short || p.name.split(" ").slice(-1)[0]).toUpperCase());
    const long = label.length > 9, xlong = label.length > 12;
    return `<svg class="jar" viewBox="0 0 150 190" aria-hidden="true">
      <defs>${textureSVG(p, id)}<clipPath id="${clip}"><rect x="21" y="45" width="108" height="134" rx="18"/></clipPath></defs>
      <ellipse cx="75" cy="184" rx="52" ry="5" fill="#000" opacity=".12"/>
      <rect x="18" y="42" width="114" height="140" rx="22" fill="#fffdf6" fill-opacity=".55" stroke="#2a211b" stroke-width="3"/>
      <g clip-path="url(#${clip})"><rect x="0" y="${opts.fill ?? 66}" width="150" height="140" fill="url(#${id})"/>
        <path d="M0 ${(opts.fill ?? 66) + 2} q20 -8 40 0 t40 0 t40 0 t40 0" fill="none" stroke="#000" stroke-opacity=".12" stroke-width="3"/></g>
      <path d="M32 58 q-6 40 0 100" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity=".55" fill="none"/>
      <rect x="30" y="96" width="90" height="52" rx="8" fill="#f3eee4" stroke="#3b3836" stroke-width="2.5"/>
      <rect x="35" y="101" width="80" height="42" rx="5" fill="none" stroke="#3b3836" stroke-width="1" stroke-dasharray="3 2"/>
      <text x="75" y="${long ? 123 : 126}" text-anchor="middle" font-family="Cinzel, Fraunces, serif" font-weight="700" font-size="${xlong ? 8.5 : long ? 9.5 : 13}" fill="#3b3836">${label}</text>
      <text x="75" y="138" text-anchor="middle" font-family="Cinzel, serif" font-size="6.5" letter-spacing="1.2" fill="#6d5d4f">MALNADA</text>
      <g class="lid"><rect x="30" y="30" width="90" height="16" rx="4" fill="#5a524b" stroke="#2a211b" stroke-width="2.5"/>
        <rect x="26" y="16" width="98" height="18" rx="6" fill="#3b3836" stroke="#2a211b" stroke-width="2.5"/>
        <path d="M38 20v10M50 20v10M62 20v10M74 20v10M86 20v10M98 20v10M110 20v10" stroke="#6b625a" stroke-width="2"/></g>
    </svg>`;
  }

  /* ------------------------------------------------------------------ */
  /* Toast, confetti, fly-to-bag                                         */
  /* ------------------------------------------------------------------ */
  const toastEl = $("#toast");
  let toastT;
  function toast(msg, action) {
    toastEl.innerHTML = esc(msg) + (action ? ` <button class="link-btn" style="color:#e8a317;opacity:1">${esc(action.label)}</button>` : "");
    if (action) $("button", toastEl).onclick = () => { action.fn(); toastEl.classList.remove("show"); };
    toastEl.classList.add("show");
    clearTimeout(toastT);
    toastT = setTimeout(hideToast, action ? 4200 : 2400);
  }
  function hideToast() { toastEl.classList.remove("show"); }
  function confetti(x, y, n = 26) {
    if (RM) return;
    const bits = ["🌶️", "🌿", "✨", "⚫", "🟤", "🟡", "🫚"];
    for (let i = 0; i < n; i++) {
      const s = document.createElement("span");
      s.className = "confetti";
      s.textContent = bits[i % bits.length];
      s.style.left = x + "px"; s.style.top = y + "px";
      document.body.appendChild(s);
      const ang = Math.random() * Math.PI * 2, dist = 80 + Math.random() * 180;
      s.animate([
        { transform: "translate(-50%,-50%) scale(.4)", opacity: 1 },
        { transform: `translate(${Math.cos(ang) * dist}px, ${Math.sin(ang) * dist - 60}px) rotate(${Math.random() * 360}deg)`, opacity: 1, offset: .55 },
        { transform: `translate(${Math.cos(ang) * dist * 1.2}px, ${Math.sin(ang) * dist + 160}px) rotate(${Math.random() * 720}deg)`, opacity: 0 },
      ], { duration: 1300 + Math.random() * 600, easing: "cubic-bezier(.2,.7,.4,1)" }).onfinish = () => s.remove();
    }
  }
  function flyToBag(fromEl, color) {
    const target = $("#cartBtn");
    if (!fromEl || RM) return bump();
    const a = fromEl.getBoundingClientRect(), b = target.getBoundingClientRect();
    const dot = document.createElement("div");
    dot.className = "fly"; dot.style.background = color;
    dot.style.left = a.left + a.width / 2 - 13 + "px"; dot.style.top = a.top + a.height / 2 - 13 + "px";
    document.body.appendChild(dot);
    const dx = b.left + b.width / 2 - (a.left + a.width / 2), dy = b.top + b.height / 2 - (a.top + a.height / 2);
    dot.animate([
      { transform: "translate(0,0) scale(1.4)" },
      { transform: `translate(${dx * .5}px, ${dy * .5 - 120}px) scale(1.1)`, offset: .5 },
      { transform: `translate(${dx}px, ${dy}px) scale(.4)`, opacity: .7 },
    ], { duration: 700, easing: "cubic-bezier(.5,0,.6,1)" }).onfinish = () => { dot.remove(); bump(); };
  }
  function bump() { const c = $("#cartBtn"); c.classList.remove("bump"); void c.offsetWidth; c.classList.add("bump"); }

  /* ------------------------------------------------------------------ */
  /* Cart state                                                          */
  /* ------------------------------------------------------------------ */
  let cart = store.get("pms_cart", []).filter((l) => (l.type === "box" ? l.ids.every((i) => byId[i]) : byId[l.id] && byId[l.id].variants[l.vi]));
  let coupon = store.get("pms_coupon", null);
  if (coupon && !S.coupons[coupon]) coupon = null;
  let view = "cart";

  const boxUnit = (ids) => ids.reduce((s, i) => s + byId[i].variants[minVar(byId[i])].p, 0);
  const boxPrice = (ids) => Math.round(boxUnit(ids) * (1 - S.box.discountPercent / 100));
  const linePrice = (l) => (l.type === "box" ? boxPrice(l.ids) : byId[l.id].variants[l.vi].p) * l.qty;
  const count = () => cart.reduce((s, l) => s + l.qty, 0);

  function totals() {
    const sub = cart.reduce((s, l) => s + linePrice(l), 0);
    const boxSave = cart.filter((l) => l.type === "box").reduce((s, l) => s + (boxUnit(l.ids) - boxPrice(l.ids)) * l.qty, 0);
    const c = coupon && S.coupons[coupon];
    const disc = c && c.type === "percent" ? Math.round(sub * c.value / 100) : 0;
    const freeship = (c && c.type === "freeship") || sub - disc >= S.freeShippingAbove;
    const ship = sub === 0 || freeship ? 0 : S.shippingFee;
    return { sub, disc, ship, freeship, boxSave, total: sub - disc + ship };
  }
  function save() { store.set("pms_cart", cart); store.set("pms_coupon", coupon); }

  function addItem(id, vi, srcEl, silent) {
    const key = id + "|" + vi;
    const l = cart.find((x) => x.key === key);
    if (l) l.qty++; else cart.push({ key, type: "item", id, vi, qty: 1 });
    save(); renderCart();
    flyToBag(srcEl, byId[id].color);
    if (!silent) toast(`${byId[id].name} (${byId[id].variants[vi].w}) added`, { label: "View bag →", fn: openCart });
  }
  function addBox(ids, srcEl) {
    const sorted = [...ids].sort();
    const key = "box|" + sorted.join(",");
    const l = cart.find((x) => x.key === key);
    if (l) l.qty++; else cart.push({ key, type: "box", ids: sorted, qty: 1 });
    save(); renderCart(); flyToBag(srcEl, "#b4834f");
    toast(`Malnada Box packed! You saved ${money(boxUnit(ids) - boxPrice(ids))}`, { label: "View bag →", fn: openCart });
  }
  function applyCoupon(code, quiet) {
    code = String(code || "").trim().toUpperCase();
    if (!S.coupons[code]) { if (!quiet) toast("Hmm, that code doesn't exist. Try GRIND10 from the game!"); return false; }
    coupon = code; save(); renderCart();
    if (!quiet) toast(`${code} applied: ${S.coupons[code].label}`);
    return true;
  }

  /* ------------------------------------------------------------------ */
  /* Drawer                                                              */
  /* ------------------------------------------------------------------ */
  const drawer = $("#drawer"), scrim = $("#scrim");
  let lastFocus;
  function openCart() {
    lastFocus = document.activeElement;
    hideToast();
    if (view === "thanks" && cart.length) view = "cart";
    renderCart();
    scrim.hidden = false; drawer.classList.add("open"); drawer.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    setTimeout(() => $("#drClose").focus(), 50);
  }
  function closeCart() {
    drawer.classList.remove("open"); drawer.setAttribute("aria-hidden", "true"); scrim.hidden = true;
    document.body.style.overflow = "";
    if (view === "thanks") view = "cart";
    lastFocus && lastFocus.focus && lastFocus.focus();
  }
  $("#cartBtn").onclick = openCart;
  $("#mbar").onclick = openCart;
  $("#drClose").onclick = closeCart;
  scrim.onclick = closeCart;
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && drawer.classList.contains("open")) closeCart(); });

  function lineHTML(l, i) {
    if (l.type === "box") {
      return `<div class="line"><div style="font-size:2.4rem;text-align:center">📦</div>
        <div><h4>Malnada Box <small style="display:inline;color:var(--moss);font-weight:700">−${S.box.discountPercent}%</small></h4>
        <small>${l.ids.map((x) => esc(byId[x].short || byId[x].name)).join(" · ")}</small>
        <div class="qty"><button data-q="${i}" data-d="-1" aria-label="Decrease">−</button><span>${l.qty}</span><button data-q="${i}" data-d="1" aria-label="Increase">+</button></div></div>
        <div class="lp">${money(linePrice(l))}<button class="rm" data-rm="${i}">Remove</button></div></div>`;
    }
    const p = byId[l.id], v = p.variants[l.vi];
    return `<div class="line">${jarSVG(p)}
      <div><h4>${esc(p.name)}</h4><small>${esc(v.w)} · ${money(v.p)} each</small>
      <div class="qty"><button data-q="${i}" data-d="-1" aria-label="Decrease">−</button><span>${l.qty}</span><button data-q="${i}" data-d="1" aria-label="Increase">+</button></div></div>
      <div class="lp">${money(linePrice(l))}<button class="rm" data-rm="${i}">Remove</button></div></div>`;
  }

  function upsellHTML(t) {
    const inCart = new Set(cart.flatMap((l) => (l.type === "box" ? l.ids : [l.id])));
    const pref = ["cardamom", "pepper", "kashaya", "coffee", "turmeric", ...S.products.map((p) => p.id)];
    const pid = pref.find((id) => byId[id] && !inCart.has(id));
    if (!pid) return "";
    const p = byId[pid], vi = minVar(p), v = p.variants[vi];
    const gap = S.freeShippingAbove - (t.sub - t.disc);
    const unlock = !t.freeship && gap > 0 && v.p >= gap;
    return `<div class="upsell">${jarSVG(p)}<p><b>${unlock ? "Unlock free delivery!" : "Goes well with your order"}</b><br>${esc(p.name)} · ${esc(v.w)}</p>
      <button data-up="${pid}" data-vi="${vi}">+ ${money(v.p)}</button></div>`;
  }

  function renderCart() {
    const n = count(), t = totals();
    $("#cartCount").textContent = n;
    const mbar = $("#mbar");
    mbar.hidden = n === 0;
    $("#mbarTxt").textContent = `${n} item${n === 1 ? "" : "s"} · ${money(t.total)}`;

    // shipping meter
    const meter = $("#shipMeter");
    meter.style.display = n && view !== "thanks" ? "" : "none";
    const pct = t.freeship ? 100 : Math.min(100, ((t.sub - t.disc) / S.freeShippingAbove) * 100);
    $("#shipFill").style.width = pct + "%";
    $("#shipTruck").style.left = Math.max(4, pct) + "%";
    $("#shipTxt").innerHTML = t.freeship
      ? (coupon && S.coupons[coupon].type === "freeship" && t.sub - t.disc < S.freeShippingAbove ? `🎉 Free delivery unlocked with <b>${esc(coupon)}</b>` : "🎉 You've unlocked <b>free delivery</b>!")
      : `You're <b>${money(S.freeShippingAbove - (t.sub - t.disc))}</b> away from free delivery`;

    const body = $("#drBody"), foot = $("#drFoot");
    $("#drTitle").textContent = view === "details" ? "Almost there" : view === "thanks" ? "Thank you!" : "Your bag";

    if (view === "thanks") return; // thanks view rendered by checkout()

    if (!n) {
      view = "cart";
      body.innerHTML = `<div class="empty"><div class="big">🫙</div><p><b>Your bag is empty.</b><br>The pepper is feeling a little lonely.</p>
        <button class="btn btn-dark" id="emptyShop">Start shopping</button></div>`;
      foot.innerHTML = "";
      $("#emptyShop").onclick = () => { closeCart(); location.hash = "#shop"; };
      return;
    }

    const sumHTML = `<div class="sum">
        <div><span>Subtotal</span><span>${money(t.sub)}</span></div>
        ${t.boxSave ? `<div class="save"><span>Box savings (included)</span><span>−${money(t.boxSave)}</span></div>` : ""}
        ${t.disc ? `<div class="save"><span>Coupon ${esc(coupon)}</span><span>−${money(t.disc)}</span></div>` : ""}
        <div><span>Delivery</span><span>${t.ship ? money(t.ship) : "<b style='color:var(--moss)'>FREE</b>"}</span></div>
        <div class="tot"><span>Total</span><span>${money(t.total)}</span></div></div>`;

    if (view === "cart") {
      body.innerHTML = cart.map(lineHTML).join("") + upsellHTML(t);
      foot.innerHTML = `
        ${coupon ? `<p class="coupon-ok"><span>✓ ${esc(coupon)}: ${esc(S.coupons[coupon].label)}</span><button id="rmCoupon">remove</button></p>`
          : `<form class="coupon-row" id="couponForm"><input id="couponIn" placeholder="Coupon code" aria-label="Coupon code" autocomplete="off"><button>Apply</button></form>`}
        ${sumHTML}
        <button class="btn btn-gold wide" id="toDetails">Checkout · ${money(t.total)}</button>
        <p class="pay-note">🔒 Order confirmed on WhatsApp · UPI or Cash on Delivery</p>`;
      $("#toDetails").onclick = () => { view = "details"; renderCart(); $("#f-name")?.focus(); };
      if (coupon) $("#rmCoupon").onclick = () => { coupon = null; save(); renderCart(); };
      else $("#couponForm").onsubmit = (e) => { e.preventDefault(); applyCoupon($("#couponIn").value); };
    } else if (view === "details") {
      const d = store.get("pms_details", {});
      body.innerHTML = `
        <button class="back-link" id="backCart">← Back to bag</button>
        <form id="detailsForm" novalidate>
          <div class="field"><label for="f-name">Your name</label><input id="f-name" name="name" autocomplete="name" value="${esc(d.name || "")}" required><span class="msg"></span></div>
          <div class="field"><label for="f-phone">Phone (WhatsApp)</label><input id="f-phone" name="phone" type="tel" inputmode="numeric" autocomplete="tel" placeholder="10-digit mobile" value="${esc(d.phone || "")}" required><span class="msg"></span></div>
          <div class="field"><label for="f-addr">Delivery address</label><textarea id="f-addr" name="addr" autocomplete="street-address" placeholder="House, street, area, city" required>${esc(d.addr || "")}</textarea><span class="msg"></span></div>
          <div class="field"><label for="f-pin">Pincode</label><input id="f-pin" name="pin" inputmode="numeric" autocomplete="postal-code" maxlength="6" value="${esc(d.pin || "")}" required><span class="msg"></span></div>
          <div class="field"><label>Payment</label>
            <div class="pay-opts"><label><input type="radio" name="pay" value="UPI" ${d.pay !== "COD" ? "checked" : ""}> 📱 UPI</label><label><input type="radio" name="pay" value="COD" ${d.pay === "COD" ? "checked" : ""}> 💵 Cash on delivery</label></div></div>
          <div class="field"><label for="f-note">Note (optional)</label><input id="f-note" name="note" placeholder="Gift message, delivery time…"></div>
        </form>`;
      foot.innerHTML = `${sumHTML}<button class="btn wa-btn wide" id="placeOrder">
        <svg viewBox="0 0 32 32" width="20" height="20" aria-hidden="true"><path fill="#fff" d="M16 3a13 13 0 0 0-11.2 19.6L3 29l6.6-1.7A13 13 0 1 0 16 3Z"/></svg>
        Order on WhatsApp · ${money(t.total)}</button>
        <p class="pay-note">We'll reply on WhatsApp to confirm your order and payment.</p>`;
      $("#backCart").onclick = () => { view = "cart"; renderCart(); };
      $("#placeOrder").onclick = checkout;
      $("#detailsForm").onsubmit = (e) => { e.preventDefault(); checkout(); };
    }
  }

  // Delegated cart actions
  $("#drawer").addEventListener("click", (e) => {
    const q = e.target.closest("[data-q]"), rm = e.target.closest("[data-rm]"), up = e.target.closest("[data-up]");
    if (q) { const l = cart[+q.dataset.q]; l.qty += +q.dataset.d; if (l.qty <= 0) cart.splice(+q.dataset.q, 1); save(); renderCart(); }
    if (rm) { cart.splice(+rm.dataset.rm, 1); save(); renderCart(); }
    if (up) addItem(up.dataset.up, +up.dataset.vi, up, true);
  });

  function checkout() {
    const f = $("#detailsForm");
    const val = (n) => f.elements[n].value.trim();
    const rules = {
      name: [val("name").length >= 2, "Please tell us your name"],
      phone: [/^(\+?91)?[6-9]\d{9}$/.test(val("phone").replace(/[\s-]/g, "")), "Enter a valid 10-digit mobile number"],
      addr: [val("addr").length >= 8, "Please add your full address"],
      pin: [/^\d{6}$/.test(val("pin")), "Pincode should be 6 digits"],
    };
    let ok = true, first;
    for (const [n, [pass, msg]] of Object.entries(rules)) {
      const fld = f.elements[n].closest(".field");
      fld.classList.toggle("err", !pass);
      $(".msg", fld).textContent = pass ? "" : msg;
      if (!pass && ok) { ok = false; first = f.elements[n]; }
    }
    if (!ok) { first.focus(); return; }
    const d = { name: val("name"), phone: val("phone"), addr: val("addr"), pin: val("pin"), pay: f.elements.pay.value };
    store.set("pms_details", d);

    const t = totals();
    const orderId = "PMS-" + Date.now().toString(36).slice(-5).toUpperCase();
    const lines = cart.map((l, i) => l.type === "box"
      ? `${i + 1}. Malnada Box (${l.ids.map((x) => byId[x].name + " " + byId[x].variants[minVar(byId[x])].w).join(", ")}) × ${l.qty} = ${money(linePrice(l))}`
      : `${i + 1}. ${byId[l.id].name} (${byId[l.id].variants[l.vi].w}) × ${l.qty} = ${money(linePrice(l))}`);
    const msg = [
      `🌿 *New order: ${S.brand}*`, `Order #${orderId}`, "",
      ...lines, "",
      `Subtotal: ${money(t.sub)}`,
      t.disc ? `Coupon ${coupon}: −${money(t.disc)}` : (coupon ? `Coupon: ${coupon}` : null),
      `Delivery: ${t.ship ? money(t.ship) : "FREE"}`,
      `*Total: ${money(t.total)}*`, "",
      `Name: ${d.name}`, `Phone: ${d.phone}`, `Address: ${d.addr}, PIN ${d.pin}`,
      `Payment: ${d.pay === "COD" ? "Cash on Delivery" : "UPI"}`,
      val("note") ? `Note: ${val("note")}` : null,
    ].filter((x) => x !== null).join("\n");

    const link = waLink(msg);
    window.open(link, "_blank", "noopener");
    cart = []; coupon = null; save();
    view = "thanks";
    renderCart();
    $("#drBody").innerHTML = `<div class="thanks"><div class="big">🙏</div><h3>Dhanyavadagalu, ${esc(d.name.split(" ")[0])}!</h3>
      <p>Your order <b>#${orderId}</b> is ready in WhatsApp. Just hit <b>send</b> and we'll confirm it shortly.</p>
      <p><a class="btn wa-btn" href="${esc(link)}" target="_blank" rel="noopener">WhatsApp didn't open? Tap here</a></p></div>`;
    $("#drFoot").innerHTML = `<button class="btn btn-dark wide" id="keepShop">Keep browsing</button>`;
    $("#keepShop").onclick = closeCart;
    const r = $("#drBody").getBoundingClientRect();
    confetti(r.left + r.width / 2, r.top + 120, 34);
  }

  /* ------------------------------------------------------------------ */
  /* Shop grid                                                           */
  /* ------------------------------------------------------------------ */
  const sel = Object.fromEntries(S.products.map((p) => [p.id, 0]));
  let cat = "all";
  function renderChips() {
    $("#chips").innerHTML = S.categories.map((c) => `<button class="chip" role="tab" aria-selected="${c.id === cat}" data-cat="${c.id}">${esc(c.label)}</button>`).join("");
  }
  $("#chips").addEventListener("click", (e) => {
    const b = e.target.closest("[data-cat]"); if (!b) return;
    cat = b.dataset.cat; renderChips(); renderGrid();
  });
  const chilies = (n) => `<b>${"🌶".repeat(n)}<span class="meter-off">${"🌶".repeat(4 - n)}</span></b>`;
  const leaves = (n) => `<b>${"🌿".repeat(Math.min(n, 5))}</b>`;

  function cardHTML(p, i) {
    const v = p.variants[sel[p.id]];
    return `<article class="pcard" data-id="${p.id}" style="animation-delay:${i * 50}ms">
      ${p.tag ? `<span class="ptag">${esc(p.tag)}</span>` : ""}
      <button class="jar-btn" style="--glow:${p.color}33" data-sniff aria-label="Smell ${esc(p.name)}">
        ${jarSVG(p)}
        <span class="aroma">${p.notes.map((n, k) => `<i style="--dx:${(k - 1) * 46}px;--r:${(k - 1) * 10}deg">${esc(n)}</i>`).join("")}</span>
        <span class="sniff-hint">tap to sniff</span>
      </button>
      <h3 class="pname">${esc(p.name)}</h3>
      ${p.kn ? `<span class="pkn" lang="kn">${esc(p.kn)}</span>` : ""}
      <p class="pblurb">${esc(p.blurb)}</p>
      <div class="meters"><span>Heat ${chilies(p.heat)}</span><span>Aroma ${leaves(p.aroma)}</span></div>
      <div class="variants" role="group" aria-label="Pack size">
        ${p.variants.map((x, k) => `<button class="var" aria-pressed="${k === sel[p.id]}" data-v="${k}">${esc(x.w)}</button>`).join("")}
      </div>
      <div class="pbuy">
        <span class="price">${money(v.p)}<small>${esc(v.w)}</small></span>
        <button class="add-btn" data-add>Add to bag</button>
      </div>
    </article>`;
  }
  function renderGrid() {
    const list = S.products.filter((p) => cat === "all" || p.cat === cat);
    $("#grid").innerHTML = list.map(cardHTML).join("");
  }
  $("#grid").addEventListener("click", (e) => {
    const card = e.target.closest(".pcard"); if (!card) return;
    const p = byId[card.dataset.id];
    if (e.target.closest("[data-sniff]")) {
      card.classList.remove("sniff"); void card.offsetWidth; card.classList.add("sniff");
      clearTimeout(card._t); card._t = setTimeout(() => card.classList.remove("sniff"), 2600);
    }
    const vb = e.target.closest("[data-v]");
    if (vb) {
      sel[p.id] = +vb.dataset.v;
      $$(".var", card).forEach((b, k) => b.setAttribute("aria-pressed", k === sel[p.id]));
      const v = p.variants[sel[p.id]];
      $(".price", card).innerHTML = `${money(v.p)}<small>${esc(v.w)}</small>`;
    }
    const add = e.target.closest("[data-add]");
    if (add) {
      addItem(p.id, sel[p.id], $(".jar", card));
      add.classList.add("added"); add.textContent = "Added ✓";
      clearTimeout(add._t); add._t = setTimeout(() => { add.classList.remove("added"); add.textContent = "Add to bag"; }, 1400);
    }
  });

  /* ------------------------------------------------------------------ */
  /* Box builder                                                         */
  /* ------------------------------------------------------------------ */
  let picks = [];
  $("[data-box-size]").textContent = S.box.size;
  $("[data-box-off]").textContent = S.box.discountPercent + "%";
  function renderBox() {
    const full = picks.length >= S.box.size;
    $("#boxPicks").innerHTML = S.products.map((p) => {
      const on = picks.includes(p.id);
      return `<button class="bpick" aria-pressed="${on}" data-pick="${p.id}" ${full && !on ? "disabled" : ""}>
        <span class="dot" style="background:${p.color}"></span>${esc(p.short || p.name)} · ${esc(p.variants[minVar(p)].w)}</button>`;
    }).join("");
    $("#crate").innerHTML = Array.from({ length: S.box.size }, (_, i) => {
      const id = picks[i];
      return id ? `<div class="slot filled" data-unpick="${id}" title="Tap to remove">${`<div>${jarSVG(byId[id])}<span>${esc(byId[id].short || byId[id].name)}</span></div>`}</div>`
        : `<div class="slot">slot ${i + 1}</div>`;
    }).join("");
    const left = S.box.size - picks.length;
    $("#boxPrice").innerHTML = picks.length === 0
      ? `Tap spices on the left to fill your crate`
      : left > 0
        ? `${left} more to go… <br><span style="opacity:.75">so far ${money(boxUnit(picks))}</span>`
        : `<s>${money(boxUnit(picks))}</s><b>${money(boxPrice(picks))}</b><br>You save ${money(boxUnit(picks) - boxPrice(picks))} 🎉`;
    $("#boxAdd").disabled = left > 0;
  }
  $("#boxPicks").addEventListener("click", (e) => {
    const b = e.target.closest("[data-pick]"); if (!b) return;
    const id = b.dataset.pick;
    picks = picks.includes(id) ? picks.filter((x) => x !== id) : picks.length < S.box.size ? [...picks, id] : picks;
    renderBox();
    if (picks.length === S.box.size) { const r = $("#crate").getBoundingClientRect(); confetti(r.left + r.width / 2, r.top + 30, 18); }
  });
  $("#crate").addEventListener("click", (e) => {
    const s = e.target.closest("[data-unpick]"); if (!s) return;
    picks = picks.filter((x) => x !== s.dataset.unpick); renderBox();
  });
  $("#boxAdd").onclick = () => { addBox(picks, $("#crate")); picks = []; renderBox(); };
  $("#boxClear").onclick = () => { picks = []; renderBox(); };

  /* ------------------------------------------------------------------ */
  /* Quiz                                                                */
  /* ------------------------------------------------------------------ */
  let qi = -1, scores = {};
  function couponHTML(code) {
    return `<div class="coupon"><span>Your code:</span><code>${esc(code)}</code><button data-apply="${esc(code)}">${coupon === code ? "Applied ✓" : "Apply to bag"}</button></div>`;
  }
  function renderQuiz() {
    const el = $("#quizCard");
    if (qi < 0) {
      el.innerHTML = `<div class="quiz-start"><span class="big">🌶️</span><h3>Which Malnad spice are you?</h3>
        <p>Four quick questions. Find your spice twin and get <b>free delivery</b> on your order.</p>
        <button class="btn btn-dark" id="quizGo">Start the quiz</button></div>`;
      $("#quizGo").onclick = () => { qi = 0; scores = {}; renderQuiz(); };
      return;
    }
    if (qi < S.quiz.length) {
      const q = S.quiz[qi];
      el.innerHTML = `<div class="quiz-prog">${S.quiz.map((_, k) => `<i class="${k <= qi ? "on" : ""}"></i>`).join("")}</div>
        <h3 class="quiz-q">${esc(q.q)}</h3>
        <div class="quiz-a">${q.a.map((a, k) => `<button class="qa" data-a="${k}">${esc(a.t)}</button>`).join("")}</div>`;
      return;
    }
    const ranked = Object.entries(scores).filter(([id]) => byId[id] && S.quizResults[id]).sort((a, b) => b[1] - a[1]);
    const pid = ranked.length ? ranked[0][0] : "pepper";
    const p = byId[pid], r = S.quizResults[pid] || { title: p.name, line: p.blurb };
    const vi = minVar(p);
    const code = Object.keys(S.coupons).find((k) => S.coupons[k].type === "freeship") || Object.keys(S.coupons)[0];
    el.innerHTML = `<div class="quiz-res">${jarSVG(p)}
      <div><span class="twin">Your spice twin is…</span><h3>${esc(r.title)}: ${esc(p.short || p.name)}</h3>
      <p>${esc(r.line)}</p>
      ${code ? couponHTML(code) : ""}
      <div class="res-actions"><button class="btn btn-gold" data-qadd="${pid}">Add ${esc(p.short || p.name)} · ${money(p.variants[vi].p)}</button>
      <button class="link-btn" id="quizRe">Retake</button></div></div></div>`;
    $("#quizRe").onclick = () => { qi = 0; scores = {}; renderQuiz(); };
    const rr = el.getBoundingClientRect();
    confetti(rr.left + rr.width / 2, rr.top + 80, 24);
  }
  $("#quizCard").addEventListener("click", (e) => {
    const a = e.target.closest("[data-a]");
    if (a) {
      const s = S.quiz[qi].a[+a.dataset.a].s;
      for (const k in s) scores[k] = (scores[k] || 0) + s[k];
      qi++; renderQuiz();
    }
    const add = e.target.closest("[data-qadd]");
    if (add) addItem(add.dataset.qadd, minVar(byId[add.dataset.qadd]), $(".jar", $("#quizCard")));
  });
  document.addEventListener("click", (e) => {
    const ap = e.target.closest("[data-apply]");
    if (ap && applyCoupon(ap.dataset.apply)) ap.textContent = "Applied ✓";
  });

  /* ------------------------------------------------------------------ */
  /* Grind-it game                                                       */
  /* ------------------------------------------------------------------ */
  const GOAL = 25, SECS = 10;
  let gTaps = 0, gStart = 0, gState = "idle", gRaf;
  const mortar = $("#mortar");
  function seedCorns() {
    let h = "";
    for (let i = 0; i < 20; i++) {
      const x = 50 + (i % 10) * 12 + (i > 9 ? 6 : 0), y = 112 + (i > 9 ? 12 : 0) + Math.sin(i * 1.7) * 4;
      h += `<circle cx="${x}" cy="${y}" r="6" fill="#2a211b" stroke="#4a3b30" stroke-width="1.5"/>`;
    }
    $("#corns").innerHTML = h;
  }
  function grindUI() {
    const pct = Math.min(1, gTaps / GOAL);
    $("#grindFill").style.width = pct * 100 + "%";
    $("#grindTaps").textContent = `${gTaps} / ${GOAL}`;
    $("#powder").setAttribute("y", 182 - pct * 78);
    const corns = $$("#corns circle");
    const keep = Math.round(corns.length * (1 - pct));
    corns.forEach((c, i) => (c.style.display = i < keep ? "" : "none"));
  }
  function grindReset() {
    gTaps = 0; gState = "idle"; cancelAnimationFrame(gRaf);
    $("#grindTime").textContent = SECS.toFixed(1) + "s";
    $("#grindResult").innerHTML = "";
    seedCorns(); grindUI();
  }
  function tick() {
    const left = Math.max(0, SECS - (performance.now() - gStart) / 1000);
    $("#grindTime").textContent = left.toFixed(1) + "s";
    if (gState !== "run") return;
    if (left <= 0) {
      gState = "done";
      $("#grindResult").innerHTML = `<p>So close: <b>${gTaps}</b> taps! Ajji says try again 😄</p><button class="btn btn-gold" id="grindRe">Try again</button>`;
      $("#grindRe").onclick = grindReset;
      return;
    }
    gRaf = requestAnimationFrame(tick);
  }
  function grindTap() {
    if (gState === "done") return;
    if (gState === "idle") { gState = "run"; gStart = performance.now(); tick(); }
    gTaps++;
    mortar.classList.remove("hit"); void mortar.offsetWidth; mortar.classList.add("hit");
    setTimeout(() => mortar.classList.remove("hit"), 80);
    if (navigator.vibrate) try { navigator.vibrate(8); } catch { /* ignore */ }
    grindUI();
    if (gTaps >= GOAL) {
      gState = "done"; cancelAnimationFrame(gRaf);
      $("#grindTime").textContent = Math.max(0, SECS - (performance.now() - gStart) / 1000).toFixed(1) + "s";
      const code = Object.keys(S.coupons).find((k) => S.coupons[k].type === "percent") || Object.keys(S.coupons)[0];
      const secs = ((performance.now() - gStart) / 1000).toFixed(1);
      $("#grindResult").innerHTML = `<span class="stamp">FRESH<br>GROUND</span>
        <p>Done in <b>${secs}s</b>! Ajji would be proud.</p>${couponHTML(code)}`;
      const r = mortar.getBoundingClientRect();
      confetti(r.left + r.width / 2, r.top + r.height / 2, 34);
    }
  }
  mortar.addEventListener("pointerdown", (e) => { e.preventDefault(); grindTap(); });
  mortar.addEventListener("click", (e) => { if (e.detail === 0) grindTap(); }); // keyboard (Enter/Space)
  grindReset();

  /* ------------------------------------------------------------------ */
  /* Recipes                                                             */
  /* ------------------------------------------------------------------ */
  $("#recipeGrid").innerHTML = S.recipes.map((r, i) => {
    const items = r.items.filter((id) => byId[id]);
    const total = items.reduce((s, id) => s + byId[id].variants[minVar(byId[id])].p, 0);
    return `<div class="flip" data-r="${i}"><div class="flip-in">
      <div class="face front" role="button" tabindex="0" aria-label="Show recipe: ${esc(r.title)}"><div class="meta"><span>⏱ ${esc(r.time)}</span><span class="flip-hint">flip me ↻</span></div>
        <div class="emo">${r.emoji}</div><h3>${esc(r.title)}</h3></div>
      <div class="face back"><button class="back-x" aria-label="Flip back">↺</button><h3>${esc(r.title)}</h3><p>${esc(r.desc)}</p>
        <div class="r-items">${items.map((id) => `<span>${esc(byId[id].short || byId[id].name)}</span>`).join("")}</div>
        <button class="btn btn-dark" data-radd="${i}">Add all ${items.length} spices · ${money(total)}</button></div>
    </div></div>`;
  }).join("");
  $("#recipeGrid").addEventListener("click", (e) => {
    const card = e.target.closest(".flip"); if (!card) return;
    const add = e.target.closest("[data-radd]");
    if (add) {
      const r = S.recipes[+add.dataset.radd];
      r.items.filter((id) => byId[id]).forEach((id) => addItem(id, minVar(byId[id]), add, true));
      toast(`Everything for ${r.title} is in your bag`, { label: "View bag →", fn: openCart });
      return;
    }
    if (e.target.closest(".front") || e.target.closest(".back-x")) card.classList.toggle("on");
  });
  $("#recipeGrid").addEventListener("keydown", (e) => {
    if ((e.key === "Enter" || e.key === " ") && e.target.classList.contains("front")) { e.preventDefault(); e.target.closest(".flip").classList.add("on"); }
  });

  /* ------------------------------------------------------------------ */
  /* Static bits: marquee, reviews, FAQ, links                           */
  /* ------------------------------------------------------------------ */
  const mq = ["Farm-direct from Malnad", "No added colour", "Sun-dried & hand-sorted", "Small-batch ground", "UPI & Cash on Delivery", "Pan-India delivery", "ಮಲೆನಾಡಿನ ಘಮ"];
  $("#marquee").innerHTML = [...mq, ...mq].map((t) => `<span>${esc(t)}</span>`).join("");
  $$("[data-free-ship]").forEach((e) => (e.textContent = money(S.freeShippingAbove)));
  $$("[data-insta-handle]").forEach((e) => (e.textContent = S.instagramHandle));
  ["#instaLink", "#ftrInsta"].forEach((s) => ($(s).href = S.instagram));
  const hello = waLink(`Hi ${S.shortBrand}! I'd like to know more about your spices 🌿`);
  ["#waFloat", "#ftrWa"].forEach((s) => ($(s).href = hello));
  $("#yr").textContent = new Date().getFullYear();
  if (S.reviews && S.reviews.length) {
    $("#reviews").hidden = false;
    $("#reviewRow").innerHTML = S.reviews.map((r) => `<figure class="review"><div class="stars">${"★".repeat(r.stars || 5)}</div><p>${esc(r.text)}</p><b>${esc(r.name)}</b></figure>`).join("");
  }
  $("#faqList").innerHTML = S.faqs.map((f) => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join("");

  /* ------------------------------------------------------------------ */
  /* Scroll effects: header, parallax hills, story vine, step reveal    */
  /* ------------------------------------------------------------------ */
  const hdr = $("#hdr"), hills = $$(".hill"), vine = $("#vinePath"), journey = $("#journey");
  const vineLen = vine.getTotalLength();
  vine.style.strokeDasharray = vineLen; vine.style.strokeDashoffset = vineLen;
  let ticking = false;
  function onScroll() {
    const y = window.scrollY;
    hdr.classList.toggle("scrolled", y > 10);
    if (!RM && y < window.innerHeight * 1.2) hills.forEach((h, i) => (h.style.transform = `translateY(${y * (0.25 - i * 0.08)}px)`));
    const r = journey.getBoundingClientRect();
    const prog = Math.min(1, Math.max(0, (window.innerHeight - r.top) / (window.innerHeight * 0.9)));
    vine.style.strokeDashoffset = vineLen * (1 - prog);
    ticking = false;
  }
  window.addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();
  const io = new IntersectionObserver((ents) => ents.forEach((en) => en.isIntersecting && en.target.classList.add("in")), { threshold: 0.25 });
  $$(".step").forEach((s) => io.observe(s));

  /* ------------------------------------------------------------------ */
  /* Hero canvas: monsoon rain + pepper storms on tap                    */
  /* ------------------------------------------------------------------ */
  const hero = $("#hero"), cv = $("#heroCanvas"), ctx = cv.getContext("2d");
  let W = 0, H = 0, DPR = 1, drops = [], bits = [], heroVisible = true, raf;
  const SPICE = [
    { c: "#1a1410", r: 4.5, shape: "corn" }, { c: "#2a211b", r: 5, shape: "corn" },
    { c: "#8db255", r: 6, shape: "pod" }, { c: "#c0392b", r: 7, shape: "chili" },
    { c: "#e8a317", r: 2.5, shape: "dust" }, { c: "#5b3420", r: 5, shape: "clove" },
  ];
  function resize() {
    DPR = Math.min(2, window.devicePixelRatio || 1);
    W = hero.clientWidth; H = hero.clientHeight;
    cv.width = W * DPR; cv.height = H * DPR; ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    drops = Array.from({ length: RM ? 0 : Math.round(W / 14) }, () => ({ x: Math.random() * W, y: Math.random() * H, l: 8 + Math.random() * 14, v: 6 + Math.random() * 6 }));
  }
  function burst(x, y, n, spread = 1, up = 1) {
    for (let i = 0; i < n; i++) {
      const s = SPICE[(Math.random() * SPICE.length) | 0];
      bits.push({ ...s, x, y, vx: (Math.random() - 0.5) * 9 * spread, vy: -(2 + Math.random() * 8) * up, rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.3, life: 1, bounced: 0 });
    }
    if (bits.length > 500) bits.splice(0, bits.length - 500);
    if (!raf) loop();
  }
  function drawBit(b) {
    ctx.save(); ctx.translate(b.x, b.y); ctx.rotate(b.rot); ctx.globalAlpha = Math.max(0, b.life); ctx.fillStyle = b.c;
    if (b.shape === "pod") { ctx.beginPath(); ctx.ellipse(0, 0, b.r * 1.5, b.r * .8, 0, 0, 7); ctx.fill(); }
    else if (b.shape === "chili") { ctx.beginPath(); ctx.ellipse(0, 0, b.r * 1.8, b.r * .55, 0, 0, 7); ctx.fill(); ctx.fillStyle = "#2f5d3a"; ctx.fillRect(b.r * 1.6, -1.5, 4, 3); }
    else if (b.shape === "clove") { ctx.fillRect(-1.2, -b.r, 2.4, b.r * 2); ctx.beginPath(); ctx.arc(0, -b.r, 2.6, 0, 7); ctx.fill(); }
    else { ctx.beginPath(); ctx.arc(0, 0, b.r, 0, 7); ctx.fill(); if (b.shape === "corn") { ctx.fillStyle = "rgba(255,255,255,.25)"; ctx.beginPath(); ctx.arc(-b.r * .35, -b.r * .35, b.r * .3, 0, 7); ctx.fill(); } }
    ctx.restore();
  }
  function loop() {
    raf = null;
    if (!heroVisible && !bits.length) return;
    ctx.clearRect(0, 0, W, H);
    ctx.strokeStyle = "rgba(200,230,255,.28)"; ctx.lineWidth = 1.2; ctx.beginPath();
    for (const d of drops) { d.y += d.v; d.x -= d.v * 0.18; if (d.y > H) { d.y = -20; d.x = Math.random() * W * 1.2; } ctx.moveTo(d.x, d.y); ctx.lineTo(d.x + d.l * 0.18, d.y - d.l); }
    ctx.stroke();
    const floor = H - 8;
    for (const b of bits) {
      b.vy += 0.32; b.x += b.vx; b.y += b.vy; b.rot += b.vr; b.vx *= 0.995;
      if (b.y > floor) { b.y = floor; if (b.bounced < 2) { b.vy *= -0.38; b.vx *= 0.7; b.bounced++; } else { b.vy = 0; b.vx *= 0.8; b.life -= 0.02; } }
      drawBit(b);
    }
    bits = bits.filter((b) => b.life > 0 && b.x > -40 && b.x < W + 40);
    if (heroVisible || bits.length) raf = requestAnimationFrame(loop);
  }
  new IntersectionObserver(([en]) => { heroVisible = en.isIntersecting; if (heroVisible && !raf) loop(); }).observe(hero);
  window.addEventListener("resize", resize);
  resize(); loop();
  hero.addEventListener("pointerdown", (e) => {
    if (e.target.closest("a, button")) return;
    const r = hero.getBoundingClientRect();
    burst(e.clientX - r.left, e.clientY - r.top, RM ? 8 : 28);
  });
  // Ambient sprinkle so first-time visitors see what's possible
  if (!RM) setTimeout(() => burst(W * (W > 980 ? 0.35 : 0.5), 40, 18, 1.6, 0.2), 900);

  // Logo badge: tilt toward cursor, spill spices from the sack
  const badge = $("#heroBadge");
  badge.addEventListener("click", () => {
    const r = hero.getBoundingClientRect(), b = badge.getBoundingClientRect();
    burst(b.left - r.left + b.width / 2, b.top - r.top + b.height * 0.4, RM ? 10 : 45, 1.6, 1.2);
    badge.classList.remove("spill"); void badge.offsetWidth; badge.classList.add("spill");
  });
  if (!RM) hero.addEventListener("pointermove", (e) => {
    if (e.pointerType !== "mouse") return;
    const r = hero.getBoundingClientRect();
    badge.style.setProperty("--tilt", ((e.clientX - r.left) / r.width - 0.5) * 16 + "deg");
  });

  /* ------------------------------------------------------------------ */
  renderChips(); renderGrid(); renderBox(); renderQuiz(); renderCart();
  if (!waNumber) console.info("[Prakyath] Set SHOP.whatsappNumber in assets/config.js so orders go straight to your WhatsApp.");
})();
