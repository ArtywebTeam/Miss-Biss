/**
 * Miss Biss Pizzeria - Main Application Engine
 * Vanilla JavaScript ES6+
 */

document.addEventListener('DOMContentLoaded', () => {
  // State variables
  let currentLang = localStorage.getItem('missbiss_lang') || 'it';
  let currentTheme = localStorage.getItem('missbiss_theme') || 'light';
  let currentCategory = 'pizze';
  let cart = [];
  try {
    const savedCart = localStorage.getItem('missbiss_cart');
    if (savedCart) cart = JSON.parse(savedCart);
  } catch (e) {
    cart = [];
  }

  let orderType = 'delivery'; // 'delivery' or 'pickup'
  let deliveryCoords = [...APP_DATA.restaurant.coords];

  // Leaflet Maps instances
  let deliveryMapInstance = null;
  let deliveryMarker = null;
  let checkoutMapInstance = null;
  let checkoutMarker = null;
  let contactMapInstance = null;

  /* ------------------------------------------------------------------------
     1. Helper Translations
     ------------------------------------------------------------------------ */
  function t(path) {
    const keys = path.split('.');
    let obj = APP_DATA.translations;
    for (const key of keys) {
      if (!obj) return path;
      obj = obj[key];
    }
    if (!obj) return path;
    return obj[currentLang] || obj.it || path;
  }

  function tn(obj) {
    if (!obj) return '';
    return obj[currentLang] || obj.it || '';
  }

  /* ------------------------------------------------------------------------
     2. Theme Management
     ------------------------------------------------------------------------ */
  function applyTheme(theme) {
    currentTheme = theme;
    const sun1 = document.getElementById('themeIconSun');
    const moon1 = document.getElementById('themeIconMoon');
    const sun2 = document.getElementById('themeFooterIconSun');
    const moon2 = document.getElementById('themeFooterIconMoon');

    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      if (sun1) sun1.style.display = 'none';
      if (moon1) moon1.style.display = 'block';
      if (sun2) sun2.style.display = 'none';
      if (moon2) moon2.style.display = 'block';
    } else {
      document.documentElement.classList.remove('dark');
      if (sun1) sun1.style.display = 'block';
      if (moon1) moon1.style.display = 'none';
      if (sun2) sun2.style.display = 'block';
      if (moon2) moon2.style.display = 'none';
    }
    localStorage.setItem('missbiss_theme', theme);
  }

  function toggleTheme() {
    applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
  }

  document.getElementById('btnThemeToggle')?.addEventListener('click', toggleTheme);
  document.getElementById('btnFooterThemeToggle')?.addEventListener('click', toggleTheme);

  applyTheme(currentTheme);

  /* ------------------------------------------------------------------------
     3. Language Management (I18n)
     ------------------------------------------------------------------------ */
  function applyLanguage(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;
    localStorage.setItem('missbiss_lang', lang);

    // Update switcher active states (Header & Footer)
    const btnIt = document.getElementById('btnLangIt');
    const btnEn = document.getElementById('btnLangEn');
    const btnFootIt = document.getElementById('btnFooterLangIt');
    const btnFootEn = document.getElementById('btnFooterLangEn');

    const activeClass = 'px-2.5 py-1 rounded-full font-semibold transition-colors bg-primary text-primary-foreground';
    const inactiveClass = 'px-2.5 py-1 rounded-full font-semibold transition-colors text-muted-foreground hover:text-foreground';

    if (lang === 'it') {
      if (btnIt) btnIt.className = activeClass;
      if (btnEn) btnEn.className = inactiveClass;
      if (btnFootIt) btnFootIt.className = activeClass;
      if (btnFootEn) btnFootEn.className = inactiveClass;
    } else {
      if (btnEn) btnEn.className = activeClass;
      if (btnIt) btnIt.className = inactiveClass;
      if (btnFootEn) btnFootEn.className = activeClass;
      if (btnFootIt) btnFootIt.className = inactiveClass;
    }

    // Update all text nodes with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      el.textContent = t(key);
    });

    // Update placeholders with data-i18n-ph
    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
      const key = el.getAttribute('data-i18n-ph');
      el.placeholder = t(key);
    });

    // Success State texts
    const successTitle = document.getElementById('orderSuccessTitle');
    if (successTitle) successTitle.textContent = lang === 'it' ? 'Ordine inviato!' : 'Order sent!';
    const successMsg = document.getElementById('orderSuccessMsg');
    if (successMsg) successMsg.textContent = lang === 'it' ? 'Ti contatteremo su WhatsApp per confermare. Grazie!' : "We'll contact you on WhatsApp to confirm. Thank you!";
    const resetOrderText = document.getElementById('btnResetOrderText');
    if (resetOrderText) resetOrderText.textContent = lang === 'it' ? 'Nuovo ordine' : 'New order';

    // Update dynamic sections
    renderCategoryTabs();
    renderPizzaGrid();
    renderDeliveryExamples();
    renderContactHours();
    renderFooterHours();
    renderCart();
    updateWhatsAppDirectLinks();
    updateOrderTypeButtons();
  }

  document.getElementById('btnLangIt')?.addEventListener('click', () => applyLanguage('it'));
  document.getElementById('btnLangEn')?.addEventListener('click', () => applyLanguage('en'));
  document.getElementById('btnFooterLangIt')?.addEventListener('click', () => applyLanguage('it'));
  document.getElementById('btnFooterLangEn')?.addEventListener('click', () => applyLanguage('en'));

  function updateWhatsAppDirectLinks() {
    const msg = encodeURIComponent(currentLang === 'en' ? 'Hello, I would like to order a pizza.' : 'Ciao, vorrei ordinare una pizza.');
    const waUrl = `https://wa.me/${APP_DATA.restaurant.whatsapp}?text=${msg}`;
    
    const heroWA = document.getElementById('heroWhatsAppBtn');
    if (heroWA) heroWA.href = waUrl;
    
    const contactWA = document.getElementById('contactWhatsAppBtn');
    if (contactWA) contactWA.href = waUrl;

    const footerWA = document.getElementById('footerWhatsAppLink');
    if (footerWA) footerWA.href = waUrl;

    const mobWA = document.getElementById('mobileBottomWhatsApp');
    if (mobWA) mobWA.href = waUrl;
  }

  /* ------------------------------------------------------------------------
     4. Header Scroll Effect
     ------------------------------------------------------------------------ */
  const header = document.getElementById('mainHeader');
  function handleScroll() {
    if (window.scrollY > 20) {
      header.className = 'fixed top-0 inset-x-0 z-[1000] transition-all duration-300 glass shadow-sm border-b border-border';
    } else {
      header.className = 'fixed top-0 inset-x-0 z-[1000] transition-all duration-300 bg-transparent';
    }
  }
  window.addEventListener('scroll', handleScroll);
  handleScroll();

  // Current year in footer
  const currentYearEl = document.getElementById('currentYear');
  if (currentYearEl) currentYearEl.textContent = new Date().getFullYear();

  /* ------------------------------------------------------------------------
     5. Menu Rendering
     ------------------------------------------------------------------------ */
  function renderCategoryTabs() {
    const tabsContainer = document.getElementById('categoryTabs');
    if (!tabsContainer) return;
    tabsContainer.innerHTML = '';

    APP_DATA.categories.forEach(cat => {
      const btn = document.createElement('button');
      btn.type = 'button';
      const isActive = cat.id === currentCategory;
      btn.className = `px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
        isActive 
          ? 'bg-primary text-primary-foreground shadow' 
          : 'bg-card border border-border text-foreground/80 hover:text-primary'
      }`;
      btn.textContent = currentLang === 'en' ? cat.name_en : cat.name_it;
      btn.addEventListener('click', () => {
        currentCategory = cat.id;
        renderCategoryTabs();
        renderPizzaGrid();
      });
      tabsContainer.appendChild(btn);
    });
  }

  function renderPizzaGrid() {
    const grid = document.getElementById('pizzaGrid');
    if (!grid) return;
    grid.innerHTML = '';

    const filtered = APP_DATA.products.filter(p => p.category === currentCategory);

    filtered.forEach(pizza => {
      const name = currentLang === 'en' ? pizza.name_en : pizza.name_it;
      const desc = currentLang === 'en' ? pizza.desc_en : pizza.desc_it;
      const ingredients = currentLang === 'en' ? pizza.ingredients_en : pizza.ingredients_it;
      const ingLabel = t('menu.ingredients');
      const addLabel = t('menu.add');

      const card = document.createElement('article');
      card.className = 'group flex flex-col overflow-hidden rounded-3xl bg-card border border-border shadow-sm hover:shadow-xl transition-shadow';
      card.innerHTML = `
        <div class="relative aspect-square w-full overflow-hidden bg-muted">
          <img src="${pizza.image}" alt="${name}" class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy">
          <span class="absolute top-3 left-3 rounded-full bg-secondary text-secondary-foreground px-3 py-1 text-sm font-bold shadow">€ ${pizza.price.toFixed(2)}</span>
          <button type="button" class="absolute bottom-3 right-3 h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg active:scale-90 transition-transform hover:scale-105" aria-label="${addLabel}" data-add-id="${pizza.id}">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
          </button>
        </div>
        <div class="p-4 flex flex-col gap-1.5 flex-1">
          <h3 class="font-display text-xl font-semibold leading-tight">${name}</h3>
          <p class="text-sm text-muted-foreground leading-snug line-clamp-2">${desc}</p>
          <p class="text-xs text-foreground/60 mt-1">
            <span class="font-semibold text-foreground/80">${ingLabel}:</span> ${ingredients}
          </p>
        </div>
      `;

      card.querySelector('button[data-add-id]').addEventListener('click', (e) => {
        e.stopPropagation();
        addToCart(pizza.id);
        openCartDrawer();
      });

      grid.appendChild(card);
    });
  }

  /* ------------------------------------------------------------------------
     6. Shopping Cart Logic
     ------------------------------------------------------------------------ */
  function saveCart() {
    localStorage.setItem('missbiss_cart', JSON.stringify(cart));
    updateCartBadges();
    renderCart();
  }

  function addToCart(productId) {
    const product = APP_DATA.products.find(p => p.id === productId);
    if (!product) return;

    const existing = cart.find(item => item.id === productId);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({
        id: product.id,
        price: product.price,
        image: product.image,
        name_it: product.name_it,
        name_en: product.name_en,
        qty: 1
      });
    }
    saveCart();
  }

  function updateQuantity(productId, delta) {
    const item = cart.find(i => i.id === productId);
    if (!item) return;

    item.qty += delta;
    if (item.qty <= 0) {
      cart = cart.filter(i => i.id !== productId);
    }
    saveCart();
  }

  function removeFromCart(productId) {
    cart = cart.filter(i => i.id !== productId);
    saveCart();
  }

  function clearCart() {
    cart = [];
    saveCart();
  }

  function updateCartBadges() {
    const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
    const headerBadge = document.getElementById('cartBadgeCount');
    const mobileBadge = document.getElementById('mobileCartBadge');

    if (totalCount > 0) {
      if (headerBadge) {
        headerBadge.textContent = totalCount;
        headerBadge.classList.remove('hidden');
        headerBadge.classList.add('flex');
      }
      if (mobileBadge) {
        mobileBadge.textContent = totalCount;
        mobileBadge.classList.remove('hidden');
        mobileBadge.classList.add('flex');
      }
    } else {
      if (headerBadge) {
        headerBadge.classList.add('hidden');
        headerBadge.classList.remove('flex');
      }
      if (mobileBadge) {
        mobileBadge.classList.add('hidden');
        mobileBadge.classList.remove('flex');
      }
    }
  }

  function renderCart() {
    const totalPrice = cart.reduce((sum, item) => sum + (item.qty * item.price), 0);

    // 1. Render Cart Drawer
    const drawerEmpty = document.getElementById('cartDrawerEmpty');
    const drawerList = document.getElementById('cartDrawerItems');
    const drawerFooter = document.getElementById('cartDrawerFooter');
    const drawerSubtotal = document.getElementById('cartDrawerSubtotal');

    if (cart.length === 0) {
      if (drawerEmpty) drawerEmpty.style.display = 'flex';
      if (drawerList) drawerList.innerHTML = '';
      if (drawerFooter) drawerFooter.style.display = 'none';
    } else {
      if (drawerEmpty) drawerEmpty.style.display = 'none';
      if (drawerFooter) drawerFooter.style.display = 'block';
      if (drawerSubtotal) drawerSubtotal.textContent = `€ ${totalPrice.toFixed(2)}`;
      if (drawerList) {
        drawerList.innerHTML = '';
        cart.forEach(item => {
          const name = currentLang === 'en' ? item.name_en : item.name_it;
          const li = document.createElement('li');
          li.className = 'flex gap-3 rounded-2xl bg-card border border-border p-3';
          li.innerHTML = `
            <div class="h-20 w-20 rounded-xl overflow-hidden bg-muted shrink-0">
              <img src="${item.image}" alt="${name}" class="w-full h-full object-cover">
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-semibold leading-tight">${name}</p>
              <p class="text-sm text-primary font-bold mt-0.5">€ ${(item.price * item.qty).toFixed(2)}</p>
              <div class="mt-2 flex items-center gap-2">
                <div class="inline-flex items-center rounded-full border border-border">
                  <button type="button" class="h-8 w-8 flex items-center justify-center btn-minus" aria-label="-">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/></svg>
                  </button>
                  <span class="w-7 text-center text-sm font-semibold">${item.qty}</span>
                  <button type="button" class="h-8 w-8 flex items-center justify-center btn-plus" aria-label="+">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
                  </button>
                </div>
                <button type="button" class="ml-auto text-muted-foreground hover:text-primary p-1.5 btn-remove" aria-label="Remove">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                </button>
              </div>
            </div>
          `;

          li.querySelector('.btn-minus').addEventListener('click', () => updateQuantity(item.id, -1));
          li.querySelector('.btn-plus').addEventListener('click', () => updateQuantity(item.id, 1));
          li.querySelector('.btn-remove').addEventListener('click', () => removeFromCart(item.id));
          drawerList.appendChild(li);
        });
      }
    }

    // 2. Render Checkout Section Cart Review (hz Component 1:1)
    const checkoutEmpty = document.getElementById('checkoutCartEmpty');
    const checkoutList = document.getElementById('checkoutCartItems');
    const checkoutSubtotalContainer = document.getElementById('checkoutSubtotalContainer');
    const checkoutSubtotal = document.getElementById('checkoutSubtotal');
    const btnSubmit = document.getElementById('btnSubmitWhatsApp');

    if (cart.length === 0) {
      if (checkoutEmpty) checkoutEmpty.style.display = 'block';
      if (checkoutList) checkoutList.innerHTML = '';
      if (checkoutSubtotalContainer) checkoutSubtotalContainer.style.display = 'none';
      if (btnSubmit) btnSubmit.disabled = true;
    } else {
      if (checkoutEmpty) checkoutEmpty.style.display = 'none';
      if (checkoutSubtotalContainer) checkoutSubtotalContainer.style.display = 'flex';
      if (checkoutSubtotal) checkoutSubtotal.textContent = `€ ${totalPrice.toFixed(2)}`;
      if (btnSubmit) btnSubmit.disabled = false;
      if (checkoutList) {
        checkoutList.innerHTML = '';
        cart.forEach(item => {
          const name = currentLang === 'en' ? item.name_en : item.name_it;
          const li = document.createElement('li');
          li.className = 'flex gap-3 items-center';
          li.innerHTML = `
            <div class="h-16 w-16 rounded-xl overflow-hidden bg-muted shrink-0">
              <img src="${item.image}" alt="${name}" class="w-full h-full object-cover">
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-semibold text-sm leading-tight">${name}</p>
              <p class="text-primary font-bold text-sm">€ ${(item.price * item.qty).toFixed(2)}</p>
            </div>
            <div class="inline-flex items-center rounded-full border border-border">
              <button type="button" class="h-7 w-7 flex items-center justify-center btn-minus" aria-label="-">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/></svg>
              </button>
              <span class="w-6 text-center text-sm font-semibold">${item.qty}</span>
              <button type="button" class="h-7 w-7 flex items-center justify-center btn-plus" aria-label="+">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
              </button>
            </div>
            <button type="button" class="text-muted-foreground hover:text-primary p-1 btn-remove" aria-label="Remove">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
            </button>
          `;

          li.querySelector('.btn-minus').addEventListener('click', () => updateQuantity(item.id, -1));
          li.querySelector('.btn-plus').addEventListener('click', () => updateQuantity(item.id, 1));
          li.querySelector('.btn-remove').addEventListener('click', () => removeFromCart(item.id));
          checkoutList.appendChild(li);
        });
      }
    }
  }

  // Drawer Open/Close controls
  const cartDrawer = document.getElementById('cartDrawer');
  const cartOverlay = document.getElementById('cartDrawerOverlay');

  function openCartDrawer() {
    if (cartDrawer && cartOverlay) {
      cartDrawer.classList.add('open');
      cartOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeCartDrawer() {
    if (cartDrawer && cartOverlay) {
      cartDrawer.classList.remove('open');
      cartOverlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  document.getElementById('btnOpenCart')?.addEventListener('click', openCartDrawer);
  document.getElementById('btnMobileCart')?.addEventListener('click', openCartDrawer);
  document.getElementById('btnCloseCart')?.addEventListener('click', closeCartDrawer);
  cartOverlay?.addEventListener('click', closeCartDrawer);
  document.getElementById('btnClearCart')?.addEventListener('click', clearCart);

  // Close drawer on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && cartDrawer?.classList.contains('open')) {
      closeCartDrawer();
    }
  });

  document.getElementById('btnDrawerCheckout')?.addEventListener('click', () => {
    closeCartDrawer();
    const orderSection = document.getElementById('order');
    if (orderSection) {
      setTimeout(() => {
        orderSection.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  });

  /* ------------------------------------------------------------------------
     7. Delivery Geolocation & Maps
     ------------------------------------------------------------------------ */
  function createPinIcon() {
    return L.divIcon({
      className: '',
      html: `
        <div style="width:36px;height:36px;display:flex;align-items:center;justify-content:center;cursor:grab;">
          <div style="width:24px;height:24px;border-radius:50% 50% 50% 0;background:#E63946;transform:rotate(-45deg);border:3px solid #fff;box-shadow:0 3px 8px rgba(0,0,0,0.35);"></div>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 36]
    });
  }

  function renderDeliveryExamples() {
    const container = document.getElementById('deliveryExamplesGrid');
    if (!container) return;
    const examples = APP_DATA.translations.delivery.examples[currentLang] || APP_DATA.translations.delivery.examples.it;
    container.innerHTML = '';

    const icons = [
      `<svg class="text-secondary shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>`,
      `<svg class="text-secondary shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`,
      `<svg class="text-secondary shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2Z"/><path d="m9 16 .348-.24c1.465-1.013 3.84-1.013 5.304 0L15 16"/><path d="M8 7h.01"/><path d="M16 7h.01"/><path d="M12 7h.01"/><path d="M12 11h.01"/><path d="M16 11h.01"/><path d="M8 11h.01"/></svg>`,
      `<svg class="text-secondary shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`,
      `<svg class="text-secondary shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
      `<svg class="text-secondary shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>`
    ];

    examples.forEach((text, i) => {
      const badge = document.createElement('div');
      badge.className = 'flex items-center gap-2 px-3 py-2 rounded-xl bg-background border border-border text-xs font-medium text-foreground/80';
      badge.innerHTML = `${icons[i % icons.length]} <span>${text}</span>`;
      container.appendChild(badge);
    });
  }

  function initDeliveryMap() {
    const mapEl = document.getElementById('deliveryMap');
    if (!mapEl || deliveryMapInstance) return;

    deliveryMapInstance = L.map('deliveryMap', {
      center: deliveryCoords,
      zoom: 15,
      zoomControl: true,
      attributionControl: false
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    }).addTo(deliveryMapInstance);

    deliveryMarker = L.marker(deliveryCoords, {
      draggable: true,
      icon: createPinIcon()
    }).addTo(deliveryMapInstance);

    deliveryMarker.on('dragend', (e) => {
      const latlng = e.target.getLatLng();
      updateLocationCoordinates([latlng.lat, latlng.lng]);
      showDeliveryStatus(t('delivery.confirmed'), 'success');
    });

    deliveryMapInstance.on('click', (e) => {
      updateLocationCoordinates([e.latlng.lat, e.latlng.lng]);
      showDeliveryStatus(t('delivery.confirmed'), 'success');
    });
  }

  function initCheckoutMap() {
    const mapEl = document.getElementById('checkoutMap');
    if (!mapEl || checkoutMapInstance) return;

    checkoutMapInstance = L.map('checkoutMap', {
      center: deliveryCoords,
      zoom: 15,
      zoomControl: true,
      attributionControl: false
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    }).addTo(checkoutMapInstance);

    checkoutMarker = L.marker(deliveryCoords, {
      draggable: true,
      icon: createPinIcon()
    }).addTo(checkoutMapInstance);

    checkoutMarker.on('dragend', (e) => {
      const latlng = e.target.getLatLng();
      updateLocationCoordinates([latlng.lat, latlng.lng]);
      showCheckoutMapStatus(t('delivery.confirmed'), 'success');
    });

    checkoutMapInstance.on('click', (e) => {
      updateLocationCoordinates([e.latlng.lat, e.latlng.lng]);
      showCheckoutMapStatus(t('delivery.confirmed'), 'success');
    });
  }

  function updateLocationCoordinates(coords) {
    deliveryCoords = coords;
    if (deliveryMapInstance && deliveryMarker) {
      deliveryMarker.setLatLng(coords);
    }
    if (checkoutMapInstance && checkoutMarker) {
      checkoutMarker.setLatLng(coords);
    }
  }

  function showDeliveryStatus(msg, type = 'info') {
    const el = document.getElementById('deliveryStatusMsg');
    if (!el) return;
    el.textContent = msg;
    if (type === 'success') {
      el.className = 'mt-2 text-sm text-secondary font-semibold flex items-center gap-1';
    } else if (type === 'error') {
      el.className = 'mt-2 text-sm text-primary font-medium flex items-center gap-1';
    } else {
      el.className = 'mt-2 text-sm text-muted-foreground flex items-center gap-1';
    }
    el.style.display = 'flex';
  }

  function showCheckoutMapStatus(msg, type = 'info') {
    const el = document.getElementById('checkoutMapStatus');
    if (!el) return;
    el.textContent = msg;
    if (type === 'success') {
      el.className = 'text-xs text-secondary font-semibold';
    } else if (type === 'error') {
      el.className = 'text-xs text-primary font-medium';
    } else {
      el.className = 'text-xs text-muted-foreground';
    }
    el.style.display = 'inline';
  }

  // Geolocation trigger
  function handleGeolocation(source) {
    if (!navigator.geolocation) {
      if (source === 'delivery') showDeliveryStatus(t('delivery.locationError'), 'error');
      else showCheckoutMapStatus(t('delivery.locationError'), 'error');
      return;
    }

    if (source === 'delivery') showDeliveryStatus(t('delivery.locating'), 'info');
    else showCheckoutMapStatus(t('delivery.locating'), 'info');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const coords = [lat, lng];
        updateLocationCoordinates(coords);
        if (deliveryMapInstance) deliveryMapInstance.setView(coords, 16);
        if (checkoutMapInstance) checkoutMapInstance.setView(coords, 16);

        if (source === 'delivery') showDeliveryStatus(t('delivery.confirmed'), 'success');
        else showCheckoutMapStatus(t('delivery.confirmed'), 'success');
      },
      () => {
        if (source === 'delivery') showDeliveryStatus(t('delivery.locationError'), 'error');
        else showCheckoutMapStatus(t('delivery.locationError'), 'error');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  document.getElementById('btnUseLocation')?.addEventListener('click', () => handleGeolocation('delivery'));
  document.getElementById('btnCheckoutUseLocation')?.addEventListener('click', () => handleGeolocation('checkout'));

  document.getElementById('btnConfirmLocation')?.addEventListener('click', () => {
    showDeliveryStatus(t('delivery.confirmed'), 'success');
  });

  // Search Address via Nominatim
  async function searchAddress() {
    const input = document.getElementById('addressInput');
    const query = input.value.trim();
    if (!query) return;

    showDeliveryStatus(t('delivery.locating'), 'info');
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`, {
        headers: { 'Accept-Language': currentLang }
      });
      const results = await res.json();
      if (results && results.length > 0) {
        const lat = parseFloat(results[0].lat);
        const lon = parseFloat(results[0].lon);
        const coords = [lat, lon];
        updateLocationCoordinates(coords);
        if (deliveryMapInstance) deliveryMapInstance.setView(coords, 16);
        if (checkoutMapInstance) checkoutMapInstance.setView(coords, 16);
        const addressField = document.getElementById('orderAddress');
        if (addressField) addressField.value = results[0].display_name;
        showDeliveryStatus(t('delivery.confirmed'), 'success');
      } else {
        showDeliveryStatus(t('delivery.locationError'), 'error');
      }
    } catch (e) {
      showDeliveryStatus(t('delivery.locationError'), 'error');
    }
  }

  document.getElementById('btnSearchAddress')?.addEventListener('click', searchAddress);
  document.getElementById('addressInput')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      searchAddress();
    }
  });

  /* ------------------------------------------------------------------------
     8. Contact Section & Leaflet Map (Exact 1:1 pz Component)
     ------------------------------------------------------------------------ */
  function renderContactHours() {
    const container = document.getElementById('contactHoursList');
    if (!container) return;
    const hours = currentLang === 'en' ? APP_DATA.restaurant.hours_en : APP_DATA.restaurant.hours_it;
    container.innerHTML = '';

    hours.forEach(item => {
      const isClosed = item.time === 'Chiuso' || item.time === 'Closed';
      const li = document.createElement('li');
      li.className = 'flex justify-between py-1 border-b border-border/40 last:border-0';
      li.innerHTML = `
        <span class="font-medium">${item.day}</span>
        <span class="${isClosed ? 'text-primary font-medium' : 'text-muted-foreground'}">${item.time}</span>
      `;
      container.appendChild(li);
    });
  }

  function renderFooterHours() {
    const container = document.getElementById('footerHoursList');
    if (!container) return;
    const hours = currentLang === 'en' ? APP_DATA.restaurant.hours_en : APP_DATA.restaurant.hours_it;
    container.innerHTML = '';

    hours.forEach(item => {
      const isClosed = item.time === 'Chiuso' || item.time === 'Closed';
      const li = document.createElement('li');
      li.className = 'flex justify-between gap-2';
      li.innerHTML = `
        <span class="text-muted-foreground">${item.day}</span>
        <span class="${isClosed ? 'text-primary font-medium' : 'text-muted-foreground text-right'}">${item.time}</span>
      `;
      container.appendChild(li);
    });
  }

  function initContactMap() {
    const mapEl = document.getElementById('pizzeriaLocationMap');
    if (!mapEl || contactMapInstance) return;

    contactMapInstance = L.map('pizzeriaLocationMap', {
      center: APP_DATA.restaurant.coords,
      zoom: 16,
      zoomControl: true,
      attributionControl: false,
      scrollWheelZoom: false
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    }).addTo(contactMapInstance);

    const pinIcon = L.divIcon({
      className: '',
      html: `
        <div style="width:34px;height:34px;display:flex;align-items:center;justify-content:center;">
          <div style="width:22px;height:22px;border-radius:50% 50% 50% 0;background:#E63946;transform:rotate(-45deg);border:3px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.4);"></div>
        </div>
      `,
      iconSize: [34, 34],
      iconAnchor: [17, 34]
    });

    L.marker(APP_DATA.restaurant.coords, { icon: pinIcon })
      .addTo(contactMapInstance)
      .bindPopup(`<strong>${APP_DATA.restaurant.name}</strong><br>${APP_DATA.restaurant.address}`);
  }

  /* ------------------------------------------------------------------------
     9. Checkout & WhatsApp Order Submission (Exact 1:1 hz Component)
     ------------------------------------------------------------------------ */
  const btnTypeDelivery = document.getElementById('btnTypeDelivery');
  const btnTypePickup = document.getElementById('btnTypePickup');
  const deliveryFieldsGroup = document.getElementById('deliveryFieldsGroup');

  function updateOrderTypeButtons() {
    if (!btnTypeDelivery || !btnTypePickup) return;
    if (orderType === 'delivery') {
      btnTypeDelivery.className = 'min-h-[52px] rounded-xl border-2 font-semibold text-sm transition-colors border-primary bg-primary/10 text-primary flex items-center justify-center gap-1.5';
      btnTypePickup.className = 'min-h-[52px] rounded-xl border-2 font-semibold text-sm transition-colors border-border text-foreground/70 flex items-center justify-center gap-1.5';
      if (deliveryFieldsGroup) deliveryFieldsGroup.style.display = 'grid';
      if (checkoutMapInstance) {
        setTimeout(() => checkoutMapInstance.invalidateSize(), 150);
      }
    } else {
      btnTypePickup.className = 'min-h-[52px] rounded-xl border-2 font-semibold text-sm transition-colors border-primary bg-primary/10 text-primary flex items-center justify-center gap-1.5';
      btnTypeDelivery.className = 'min-h-[52px] rounded-xl border-2 font-semibold text-sm transition-colors border-border text-foreground/70 flex items-center justify-center gap-1.5';
      if (deliveryFieldsGroup) deliveryFieldsGroup.style.display = 'none';
    }
  }

  btnTypeDelivery?.addEventListener('click', () => {
    orderType = 'delivery';
    updateOrderTypeButtons();
  });

  btnTypePickup?.addEventListener('click', () => {
    orderType = 'pickup';
    updateOrderTypeButtons();
  });

  document.getElementById('btnSubmitWhatsApp')?.addEventListener('click', () => {
    const errorEl = document.getElementById('checkoutErrorMsg');
    if (errorEl) errorEl.style.display = 'none';

    if (cart.length === 0) {
      if (errorEl) {
        errorEl.textContent = currentLang === 'it' ? 'Aggiungi almeno una pizza.' : 'Add at least one pizza.';
        errorEl.style.display = 'block';
      }
      return;
    }

    const name = document.getElementById('orderName')?.value.trim() || '';
    const phone = document.getElementById('orderPhone')?.value.trim() || '';
    const address = document.getElementById('orderAddress')?.value.trim() || '';
    const notes = document.getElementById('orderNotes')?.value.trim() || '';

    if (!name || !phone) {
      if (errorEl) {
        errorEl.textContent = t('checkout.required');
        errorEl.style.display = 'block';
      }
      return;
    }

    if (orderType === 'delivery' && !address) {
      if (errorEl) {
        errorEl.textContent = t('checkout.addressRequired');
        errorEl.style.display = 'block';
      }
      return;
    }

    // Build the WhatsApp message exactly matching the original hz component
    const totalPrice = cart.reduce((sum, item) => sum + (item.qty * item.price), 0);
    const itemsLines = cart.map(item => {
      const itemName = currentLang === 'en' ? item.name_en : item.name_it;
      return `• ${itemName} x${item.qty} — €${(item.price * item.qty).toFixed(2)}`;
    });

    const typeLabel = orderType === 'delivery'
      ? (currentLang === 'it' ? 'Consegna' : 'Delivery')
      : (currentLang === 'it' ? 'Ritiro in pizzeria' : 'Pickup at pizzeria');

    let msg = currentLang === 'it'
      ? `Ciao Miss Biss! Vorrei ordinare:\n${itemsLines.join('\n')}\n\n*Totale: €${totalPrice.toFixed(2)}*`
      : `Hi Miss Biss! I'd like to order:\n${itemsLines.join('\n')}\n\n*Total: €${totalPrice.toFixed(2)}*`;

    msg += `\n\n${currentLang === 'it' ? 'Tipo' : 'Type'}: ${typeLabel}`;
    msg += `\n${currentLang === 'it' ? 'Nome' : 'Name'}: ${name}`;
    msg += `\n${currentLang === 'it' ? 'Telefono' : 'Phone'}: ${phone}`;

    if (orderType === 'delivery') {
      const mapsLink = `https://maps.google.com/?q=${deliveryCoords[0].toFixed(5)},${deliveryCoords[1].toFixed(5)}`;
      msg += `\n${currentLang === 'it' ? 'Consegna a' : 'Deliver to'}: ${address}\n📍 ${mapsLink}`;
      if (notes) {
        msg += `\n${currentLang === 'it' ? 'Note' : 'Notes'}: ${notes}`;
      }
    }

    const waUrl = `https://wa.me/${APP_DATA.restaurant.whatsapp}?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank');

    // Display success view
    const activeState = document.getElementById('orderActiveState');
    const successState = document.getElementById('orderSuccessState');
    if (activeState) activeState.style.display = 'none';
    if (successState) successState.style.display = 'block';
  });

  document.getElementById('btnResetOrder')?.addEventListener('click', () => {
    clearCart();
    const orderName = document.getElementById('orderName');
    const orderPhone = document.getElementById('orderPhone');
    const orderAddress = document.getElementById('orderAddress');
    const orderNotes = document.getElementById('orderNotes');
    if (orderName) orderName.value = '';
    if (orderPhone) orderPhone.value = '';
    if (orderAddress) orderAddress.value = '';
    if (orderNotes) orderNotes.value = '';
    
    const activeState = document.getElementById('orderActiveState');
    const successState = document.getElementById('orderSuccessState');
    if (successState) successState.style.display = 'none';
    if (activeState) activeState.style.display = 'grid';
  });

  /* ------------------------------------------------------------------------
     10. Bootstrap Initialization
     ------------------------------------------------------------------------ */
  applyLanguage(currentLang);
  updateCartBadges();

  // Lazy initialize maps
  setTimeout(() => {
    initDeliveryMap();
    initCheckoutMap();
    initContactMap();
  }, 250);
});
