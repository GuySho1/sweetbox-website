/* =========================================================
   Sweet Box - Cart System (Shared)
   ---------------------------------------------------------
   Manages the cart in localStorage so the cart badge
   updates across all pages, and so cart.html / checkout.html
   can render items added from anywhere on the site.

   NOTE FOR DEVELOPER:
   When connecting to WooCommerce, replace localStorage with
   actual API calls. The function signatures stay the same.
   ========================================================= */

(function(window){
  const CART_KEY = 'sweetbox_cart';
  const SEED_KEY = 'sweetbox_cart_seeded';

  // Default cart for first-time visitors (mockup purposes)
  const SAMPLE_ITEMS = [
    {
      id: 'mini-cupcake-box',
      name: 'Mini Cupcake Box',
      price: 170,
      image: 'box-cupcake.jpg',
      meta: '16 מיני קאפקייקס · 4 טעמים',
      qty: 1
    },
    {
      id: 'valentines-box',
      name: "Valentine's Box",
      price: 250,
      image: 'box-valentines.png',
      meta: 'מארז רומנטי · 8 פריטים',
      qty: 1
    }
  ];

  function getCart(){
    try {
      const raw = localStorage.getItem(CART_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch(e){
      return [];
    }
  }

  function saveCart(items){
    localStorage.setItem(CART_KEY, JSON.stringify(items));
    updateAllBadges();
  }

  function getCount(){
    const items = getCart();
    return items.reduce((s,i)=> s + (parseInt(i.qty)||0), 0);
  }

  function getSubtotal(){
    const items = getCart();
    return items.reduce((s,i)=> s + ((parseFloat(i.price)||0) * (parseInt(i.qty)||0)), 0);
  }

  function addItem(item){
    const items = getCart();
    const existing = items.find(i => i.id === item.id);
    if (existing){
      existing.qty = (parseInt(existing.qty)||0) + (parseInt(item.qty)||1);
    } else {
      items.push({
        id: item.id,
        name: item.name,
        price: parseFloat(item.price)||0,
        image: item.image || '',
        meta: item.meta || '',
        qty: parseInt(item.qty)||1
      });
    }
    saveCart(items);
    return getCount();
  }

  function setQty(id, qty){
    const items = getCart();
    const it = items.find(i => i.id === id);
    if (!it) return;
    qty = Math.max(0, parseInt(qty)||0);
    if (qty === 0){
      removeItem(id);
      return;
    }
    it.qty = qty;
    saveCart(items);
  }

  function removeItem(id){
    const items = getCart().filter(i => i.id !== id);
    saveCart(items);
  }

  function clearCart(){
    localStorage.removeItem(CART_KEY);
    updateAllBadges();
  }

  function updateAllBadges(){
    const count = getCount();
    document.querySelectorAll('.cart-badge').forEach(badge => {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    });
  }

  // Seed the cart with sample items on first visit (mockup only)
  function seedIfEmpty(){
    if (localStorage.getItem(SEED_KEY)) return;
    if (getCart().length === 0){
      saveCart(SAMPLE_ITEMS.slice());
    }
    localStorage.setItem(SEED_KEY, '1');
  }

  // "Buy Now" - clear cart, add single item, go to checkout
  function buyNow(item){
    clearCart();
    addItem(item);
    window.location.href = 'checkout.html';
  }

  // Visual feedback for "Add to cart" buttons
  function flashAddedFeedback(btn, originalText){
    const original = originalText || btn.innerHTML;
    btn.innerHTML = '✓ נוסף לעגלה';
    btn.disabled = true;
    btn.dataset.flashing = '1';
    setTimeout(()=>{
      btn.innerHTML = original;
      btn.disabled = false;
      delete btn.dataset.flashing;
    }, 1600);
  }

  /* ============================================================
     MOBILE MENU — Hamburger button + side drawer.
     Injected automatically on every page so the topbar is clean
     on small screens. Desktop layout is untouched.
     ============================================================ */

  function injectMobileMenuStyles(){
    if (document.getElementById('sb-mobile-menu-style')) return;
    const css = `
      /* Hamburger button */
      .mobile-hamburger {
        display: none;
        width: 42px;
        height: 42px;
        border-radius: 50%;
        background: white;
        border: 1.5px solid var(--line, #E8EAED);
        align-items: center;
        justify-content: center;
        cursor: pointer;
        padding: 0;
        font-family: inherit;
        justify-self: end;
        transition: border-color 0.3s, transform 0.2s;
      }
      .mobile-hamburger:hover {
        border-color: var(--blue-deep, #5B9DB5);
        transform: translateY(-1px);
      }
      .mobile-hamburger svg {
        width: 20px;
        height: 20px;
        color: var(--brown, #554B41);
      }

      /* Keep CTA positioning explicit so the new (display:none) hamburger
         being :last-child doesn't accidentally remove the left-side CTA's
         justify-self: end on grid-based topbars. */
      .topbar > .cta { justify-self: end; }
      .topbar > .topbar-side { justify-self: start; }

      @media (max-width: 760px) {
        .topbar .cta-bulk,
        .topbar .cta,
        .topbar .cta-hr,
        .topbar nav {
          display: none !important;
        }
        .mobile-hamburger { display: flex !important; }
      }

      /* Drawer overlay */
      .sb-drawer {
        position: fixed;
        inset: 0;
        z-index: 1000;
        pointer-events: none;
        direction: rtl;
      }
      .sb-drawer.open { pointer-events: auto; }
      .sb-drawer-backdrop {
        position: absolute;
        inset: 0;
        background: rgba(20, 20, 25, 0.55);
        opacity: 0;
        transition: opacity 0.3s;
      }
      .sb-drawer.open .sb-drawer-backdrop { opacity: 1; }
      .sb-drawer-panel {
        position: absolute;
        top: 0;
        bottom: 0;
        inset-inline-end: 0;
        width: 84%;
        max-width: 340px;
        background: white;
        transform: translateX(-100%);
        transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
        padding: 22px 26px 30px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        box-shadow: 4px 0 28px rgba(20, 20, 25, 0.22);
      }
      .sb-drawer.open .sb-drawer-panel { transform: translateX(0); }

      .sb-drawer-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 18px;
        padding-bottom: 18px;
        border-bottom: 1px solid var(--line, #E8EAED);
      }
      .sb-drawer-header .sb-drawer-logo img {
        height: 48px;
        display: block;
      }
      .sb-drawer-close {
        background: white;
        border: 1.5px solid var(--line, #E8EAED);
        width: 38px;
        height: 38px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 16px;
        color: var(--brown, #554B41);
        font-family: inherit;
        transition: border-color 0.3s, transform 0.2s;
        padding: 0;
        line-height: 1;
      }
      .sb-drawer-close:hover {
        border-color: var(--blue-deep, #5B9DB5);
        transform: rotate(90deg);
      }

      .sb-drawer-cta {
        display: block;
        background: var(--teal-accent, #4A8FA8);
        color: white;
        text-align: center;
        border-radius: 999px;
        padding: 14px 18px;
        font-weight: 500;
        letter-spacing: 2px;
        font-size: 13px;
        text-decoration: none;
        margin-bottom: 12px;
        transition: background 0.3s;
      }
      .sb-drawer-cta:hover { background: var(--brown, #554B41); color: white; }
      .sb-drawer-cta.secondary {
        background: white;
        color: var(--teal-accent, #4A8FA8);
        border: 1.5px solid var(--teal-accent, #4A8FA8);
      }
      .sb-drawer-cta.secondary:hover {
        background: var(--teal-accent, #4A8FA8);
        color: white;
      }

      .sb-drawer-links {
        list-style: none;
        margin: 16px 0 0;
        padding: 0;
        flex: 1;
      }
      .sb-drawer-links li {
        border-bottom: 1px solid var(--line, #E8EAED);
      }
      .sb-drawer-links li:last-child { border-bottom: none; }
      .sb-drawer-links a {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 15px 4px;
        text-decoration: none;
        color: var(--brown, #554B41);
        font-size: 15.5px;
        font-weight: 500;
        transition: color 0.2s;
      }
      .sb-drawer-links a:hover { color: var(--blue-deep, #5B9DB5); }
      .sb-drawer-links a .arrow {
        color: var(--ink-whisper, #8A8E96);
        font-size: 14px;
      }
      .sb-drawer-links a .cart-mini-badge {
        background: var(--teal-accent, #4A8FA8);
        color: white;
        font-size: 11px;
        font-weight: 700;
        padding: 2px 8px;
        border-radius: 999px;
        margin-inline-start: auto;
        margin-inline-end: 8px;
      }

      .sb-drawer-footer {
        margin-top: 18px;
        padding-top: 18px;
        border-top: 1px solid var(--line, #E8EAED);
      }
      .sb-drawer-social {
        display: flex;
        justify-content: center;
        gap: 14px;
      }
      .sb-drawer-social a {
        width: 38px;
        height: 38px;
        border-radius: 50%;
        border: 1px solid var(--line, #E8EAED);
        background: white;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.2s;
      }
      .sb-drawer-social a:hover { background: #EDF6FA; }
      .sb-drawer-social svg {
        width: 16px;
        height: 16px;
        fill: var(--brown, #554B41);
      }
    `;
    const style = document.createElement('style');
    style.id = 'sb-mobile-menu-style';
    style.textContent = css;
    document.head.appendChild(style);
  }

  function injectDrawer(){
    if (document.querySelector('.sb-drawer')) return;
    const drawer = document.createElement('div');
    drawer.className = 'sb-drawer';
    drawer.setAttribute('aria-hidden', 'true');
    drawer.innerHTML = `
      <div class="sb-drawer-backdrop" data-sb-close></div>
      <nav class="sb-drawer-panel" aria-label="תפריט ראשי">
        <div class="sb-drawer-header">
          <a href="index.html" class="sb-drawer-logo">
            <img src="logo-sweetbox.png" alt="Sweet Box">
          </a>
          <button type="button" class="sb-drawer-close" data-sb-close aria-label="סגירת תפריט">✕</button>
        </div>

        <a href="index.html#display" class="sb-drawer-cta">בחירת קופסה</a>
        <a href="happy-hour.html" class="sb-drawer-cta secondary">הזמנה מרוכזת</a>

        <ul class="sb-drawer-links">
          <li><a href="cart.html"><span>עגלת הקניות</span><span class="cart-mini-badge cart-badge" style="display:none;">0</span><span class="arrow">‹</span></a></li>
          <li><a href="index.html#display"><span>כל הקופסאות</span><span class="arrow">‹</span></a></li>
          <li><a href="index.html#branches"><span>הסניפים שלנו</span><span class="arrow">‹</span></a></li>
          <li><a href="about.html"><span>קצת עלינו</span><span class="arrow">‹</span></a></li>
          <li><a href="qna.html"><span>שאלות נפוצות</span><span class="arrow">‹</span></a></li>
          <li><a href="hr-portal.html"><span>כניסת HR</span><span class="arrow">‹</span></a></li>
        </ul>

        <div class="sb-drawer-footer">
          <div class="sb-drawer-social">
            <a href="https://www.instagram.com/sweetbox.il/" target="_blank" rel="noopener" aria-label="Instagram">
              <svg viewBox="0 0 24 24"><path d="M12 2.2c3.2 0 3.6 0 4.8.1 1.2.1 1.8.2 2.2.4.6.2 1 .5 1.4.9.4.4.7.9.9 1.4.2.4.4 1.1.4 2.2.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 1.2-.2 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.9.7-1.4.9-.4.2-1.1.4-2.2.4-1.3.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2-.1-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.9-.9-1.4-.2-.4-.4-1.1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8c.1-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.9-.7 1.4-.9.4-.2 1.1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2zm0 3.4c-3.5 0-6.4 2.9-6.4 6.4s2.9 6.4 6.4 6.4 6.4-2.9 6.4-6.4-2.9-6.4-6.4-6.4zm0 10.6c-2.3 0-4.2-1.9-4.2-4.2s1.9-4.2 4.2-4.2 4.2 1.9 4.2 4.2-1.9 4.2-4.2 4.2zm6.6-10.9c0 .8-.7 1.5-1.5 1.5s-1.5-.7-1.5-1.5.7-1.5 1.5-1.5 1.5.7 1.5 1.5z"/></svg>
            </a>
            <a href="https://www.facebook.com/sweetboxil/" target="_blank" rel="noopener" aria-label="Facebook">
              <svg viewBox="0 0 24 24"><path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.41 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.69.24 2.69.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.26h3.33l-.53 3.49h-2.79V24C19.61 23.1 24 18.1 24 12.07z"/></svg>
            </a>
            <a href="https://www.tiktok.com/@sweetbox_tlv?lang=en" target="_blank" rel="noopener" aria-label="TikTok">
              <svg viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.66 20.1a6.34 6.34 0 0 0 10.86-4.43V8.79a8.16 8.16 0 0 0 4.77 1.52V6.86a4.85 4.85 0 0 1-1.71-.17z"/></svg>
            </a>
          </div>
        </div>
      </nav>
    `;
    document.body.appendChild(drawer);

    drawer.querySelectorAll('[data-sb-close]').forEach(el => {
      el.addEventListener('click', closeDrawer);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('open')) {
        closeDrawer();
      }
    });
  }

  function injectHamburger(){
    const topbar = document.querySelector('.topbar');
    if (!topbar || topbar.querySelector('.mobile-hamburger')) return;
    const hamburger = document.createElement('button');
    hamburger.type = 'button';
    hamburger.className = 'mobile-hamburger';
    hamburger.setAttribute('aria-label', 'פתיחת תפריט');
    hamburger.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`;
    hamburger.addEventListener('click', openDrawer);
    topbar.appendChild(hamburger);
  }

  function openDrawer(){
    const drawer = document.querySelector('.sb-drawer');
    if (!drawer) return;
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    updateAllBadges();
  }

  function closeDrawer(){
    const drawer = document.querySelector('.sb-drawer');
    if (!drawer) return;
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function initMobileMenu(){
    injectMobileMenuStyles();
    injectDrawer();
    injectHamburger();
  }

  // Expose
  window.SweetCart = {
    get: getCart,
    save: saveCart,
    count: getCount,
    subtotal: getSubtotal,
    add: addItem,
    setQty: setQty,
    remove: removeItem,
    clear: clearCart,
    updateBadges: updateAllBadges,
    seedIfEmpty: seedIfEmpty,
    buyNow: buyNow,
    flashAdded: flashAddedFeedback,
    openDrawer: openDrawer,
    closeDrawer: closeDrawer
  };

  // Update badge + setup mobile menu as soon as DOM is ready
  function onReady(){
    initMobileMenu();
    updateAllBadges();
  }
  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', onReady);
  } else {
    onReady();
  }

})(window);
