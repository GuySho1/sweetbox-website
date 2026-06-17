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
    flashAdded: flashAddedFeedback
  };

  // Update badge as soon as DOM is ready
  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', updateAllBadges);
  } else {
    updateAllBadges();
  }

})(window);
