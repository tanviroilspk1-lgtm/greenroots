const DEFAULT_PRODUCTS = [
      { id: 1, name: "Kids Hair Oil", price: 1000, cat: "oils", img: "images/products/kids-hair-oil.jpg", desc: "Gentle & safe formula for children's delicate hair", tag: "👶 Kids Safe" },
      { id: 2, name: "White Hair Dark Oil", price: 800, cat: "oils", img: "images/products/white-hair-dark-oil.jpg", desc: "Naturally darken white & grey hair with herbs", tag: "Bestseller" },
      { id: 3, name: "Fast Hair Growth Oil", price: 800, cat: "oils", img: "images/products/fast-hair-growth-oil.jpg", desc: "Accelerate hair growth naturally", tag: "" },
      { id: 4, name: "Anti Hair Fall Oil", price: 1000, cat: "oils", img: "images/products/anti-hair-fall-oil.jpg", desc: "Stop hair fall & strengthen roots", tag: "Popular" },
      { id: 5, name: "Root Strength Oil", price: 1000, cat: "oils", img: "images/products/root-strength-oil.jpg", desc: "Deep root nourishment for stronger hair", tag: "" },
      { id: 6, name: "Cooling Herbal Oil", price: 1000, cat: "oils", img: "images/products/cooling-hair-oil.jpg", desc: "Refreshing cooling for scalp relaxation" },
      { id: 7, name: "Non-Sticky Luxury Oil", price: 1000, cat: "oils", img: "images/products/non-sticky-oil.jpg", desc: "Lightweight non-sticky premium oil", tag: "Luxury" },
      { id: 8, name: "Strong & Shine Oil", price: 1000, cat: "oils", img: "images/products/strong-shine-oil.jpg", desc: "Premium shine & smoothness for beautiful hair", badge: "★ Featured" },
      { id: 9, name: "Herbal Shampoo", price: 800, cat: "shampoo", img: "images/products/herbal-shampoo.jpg", desc: "Gentle herbal cleansing", tag: "Shampoo" },
      { id: 10, name: "Pure Coconut Oil", price: 800, cat: "budget", img: "images/products/pure-coconut-oil.jpg", desc: "100% pure cold pressed coconut oil — 250ml", extra: "250ml" },
      { id: 11, name: "Pure Mustard Oil", price: 250, cat: "budget", img: "images/products/mustard-oil.jpg", desc: "100% pure cold pressed mustard oil — 250ml", extra: "250ml" },
      { id: 12, name: "Pure Almond Oil", price: 2000, cat: "budget", img: "images/products/pure-almond-oil.jpg", desc: "100% pure cold pressed almond oil — 250ml", extra: "250ml" }
    ];

    let products = [];
    try {
      const sp = localStorage.getItem('gr_products');
      products = sp ? JSON.parse(sp) : JSON.parse(JSON.stringify(DEFAULT_PRODUCTS));
      if (!products || !products.length) products = JSON.parse(JSON.stringify(DEFAULT_PRODUCTS));
    } catch (e) {
      products = JSON.parse(JSON.stringify(DEFAULT_PRODUCTS));
    }

    let cart = [];
    try {
      const sc = localStorage.getItem('gr_cart');
      cart = sc ? JSON.parse(sc) : [];
    } catch (e) {
      cart = [];
    }

    let lang = 'en';
    let currentSlide = 0;
    let sliderInterval = null;
    let currentRating = 0;

    const reviewsData = [
      { name: 'Ayesha Khan', text: 'Strong & Shine Oil is amazing! Mere baal bohat shiny aur soft ho gaye hain.', rating: 5, date: '2 weeks ago' },
      { name: 'Usman Ali', text: 'Anti Hair Fall Oil ne mere baal fall kam kar dia hai. Highly recommended!', rating: 5, date: '1 month ago' },
      { name: 'Fatima Noor', text: 'Kids Hair Oil use kar rahi hoon apni beti ke liye. 100% safe hai!', rating: 5, date: '3 weeks ago' },
      { name: 'Zara Ahmed', text: 'Non-Sticky Luxury Oil best hai! Lightweight aur non-sticky. Love it!', rating: 5, date: '5 days ago' },
      { name: 'Bilal Ahmed', text: 'Fast Hair Growth Oil ne meray baal 2 inch lamba bhi bada hain. Bohhat effective hai!', rating: 5, date: '1 week ago' },
      { name: 'Sara Khan', text: 'Herbal Shampoo ne meri scalp se dandruff khatam kar dia hai. Bohhat acha lagta hai baal ko.', rating: 4, date: '3 days ago' }
    ];

    window.addEventListener('load', () => {
      setTimeout(() => {
        const l = document.getElementById('loader');
        if (l) l.classList.add('hide');
      }, 800);
    });

    window.addEventListener('scroll', () => {
      const nav = document.getElementById('navbar');
      if (nav) nav.classList.toggle('scrolled', window.scrollY > 50);
      const btt = document.getElementById('backToTop');
      if (btt) {
        if (window.scrollY > 400) btt.classList.add('show');
        else btt.classList.remove('show');
      }
    });

    function toggleMenu() {
      const m = document.getElementById('mobileMenu');
      if (m) m.classList.toggle('open');
    }
    function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }

    function toggleTheme() {
      const html = document.documentElement;
      const curr = html.getAttribute('data-theme') || 'light';
      const next = curr === 'light' ? 'dark' : 'light';
      html.setAttribute('data-theme', next);
      try { localStorage.setItem('gr_theme', next); } catch (e) { }
      const btn = document.getElementById('themeToggle');
      if (btn) btn.innerHTML = next === 'dark' ? '☀️' : '🌙';
    }

    function toggleLang() {
      lang = lang === 'en' ? 'ur' : 'en';
      try { localStorage.setItem('gr_lang', lang); } catch (e) { }
      const lbl = document.getElementById('langLabel');
      if (lbl) lbl.textContent = lang === 'en' ? 'اردو' : 'EN';
      document.body.style.direction = lang === 'ur' ? 'rtl' : 'ltr';
    }

    function renderProducts(filter = 'all', searchTerm = '') {
      const grid = document.getElementById('productsGrid');
      if (!grid) return;

      let html = '';
      const filtered = products.filter(p => {
        if (filter !== 'all' && p.cat !== filter) return false;
        if (searchTerm) {
          const s = searchTerm.toLowerCase();
          if (!p.name.toLowerCase().includes(s)) return false;
        }
        return true;
      });

      if (filtered.length === 0) {
        grid.innerHTML = '<p style="text-align:center;color:var(--text3);padding:40px;">No products found.</p>';
        return;
      }

      filtered.forEach(p => {
        const tagHTML = p.tag ? `<div class="product-tag">${p.tag}</div>` : '';
        const badgeHTML = p.badge ? `<div class="product-badge">${p.badge}</div>` : '';
        html += `
        <div class="product-card">
            <div class="product-img-area">
                <img src="${p.img}" alt="${p.name} | Green Roots Pakistan Natural Hair Oil" loading="lazy" decoding="async" />
                ${tagHTML}${badgeHTML}
            </div>
            <div class="product-info">
                <div class="product-name">${p.name}</div>
                <div class="product-desc">${p.desc || ''}</div>
                <div class="product-rating">
★★★★★
<span>Trusted by Hair Lovers</span>
</div>
<div class="product-trust">
<span>🌿 Natural</span>
<span>🚚 Fast</span>
<span>💚 Trusted</span>
</div>
                <div class="product-bottom">
                    <div class="product-price">Rs.${p.price} <small>${p.extra || ''}</small></div>
                    <button class="product-add-cart" onclick="addToCart(${p.id})"><svg viewBox="0 0 24 24"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/></svg></button>
                    <a href="https://wa.me/923199088670?text=Hi!%20I%20want%20${encodeURIComponent(p.name)}%20-%20Rs.${p.price}" target="_blank" class="product-wa"><svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg></a>
                </div>
            </div>
        </div>`;
      });
      grid.innerHTML = html;
    }

    function addToCart(id) {
      const p = products.find(x => x.id === id);
      if (!p) return;
      const existing = cart.find(x => x.id === id);
      if (existing) existing.qty++;
      else cart.push({ id: p.id, name: p.name, price: p.price, qty: 1, img: p.img });
      try { localStorage.setItem('gr_cart', JSON.stringify(cart)); } catch (e) { }
      renderCart();
      updateCartBadge();
      showToast('🛒 Added: ' + p.name);
    }

    function removeFromCart(id) {
      cart = cart.filter(x => x.id !== id);
      try { localStorage.setItem('gr_cart', JSON.stringify(cart)); } catch (e) { }
      renderCart();
      updateCartBadge();
    }

    function changeQty(id, delta) {
      const item = cart.find(x => x.id === id);
      if (!item) return;
      item.qty += delta;
      if (item.qty < 1) item.qty = 1;
      try { localStorage.setItem('gr_cart', JSON.stringify(cart)); } catch (e) { }
      renderCart();
      updateCartBadge();
    }

    function updateCartBadge() {
      const badge = document.getElementById('cartBadge');
      if (!badge) return;
      const total = cart.reduce((s, i) => s + i.qty, 0);
      badge.textContent = total > 0 ? total : '';
      badge.classList.toggle('show', total > 0);
    }

    function renderCart() {
      const wrap = document.getElementById('cart-items');
      const totalEl = document.getElementById('cart-total-price');
      if (!wrap || !totalEl) return;

      if (cart.length === 0) {
        wrap.innerHTML = '<div class="cart-empty"><p>Cart is empty</p></div>';
        totalEl.textContent = 'Rs.0';
        return;
      }

      let html = '';
      let total = 0;
      cart.forEach(item => {
        total += item.price * item.qty;
        html += `
        <div class="cart-item">
            <img src="${item.img}" alt="${item.name}" />
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">Rs.${item.price}</div>
                <div class="cart-item-qty">
                    <button class="qty-btn" onclick="changeQty(${item.id},-1)">-</button>
                    <span class="qty-btn" style="border:none;cursor:default;">${item.qty}</span>
                    <button class="qty-btn" onclick="changeQty(${item.id},1)">+</button>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart(${item.id})">✕ Remove</button>
            </div>
        </div>`;
      });
      wrap.innerHTML = html;
      totalEl.textContent = 'Rs.' + total;
    }

    function toggleCart() {
      document.getElementById('cart-overlay').classList.toggle('open');
    }

    function checkout(method) {

    let msg = "Hi! I want to order:\n";
    let total = 0;

    cart.forEach(i => {
        msg += `${i.name} x${i.qty} = Rs.${i.price * i.qty}\n`;
        total += i.price * i.qty;
    });

    msg += `\nTotal: Rs.${total}\nPayment Method: ${method}`;

    if(method === "Easypaisa"){
        openPaymentPopup(total);
        return;
    }

    window.open(
        `https://wa.me/923199088670?text=${encodeURIComponent(msg)}`,
        '_blank'
    );
}
function openPaymentPopup(total){

    document.getElementById("payment-total").innerText = "Rs." + total;

    document.getElementById("payment-popup").style.display = "flex";
}

function closePaymentPopup(){

    document.getElementById("payment-popup").style.display = "none";
}

function copyPaymentNumber(){

    navigator.clipboard.writeText("03035650538");

    alert("Easypaisa Number Copied Successfully");
}
function sendPaymentWhatsApp(){

    let total = document.getElementById("payment-total").innerText;

    let message =
`Assalam-o-Alaikum Green Roots 🌿

I have paid through Easypaisa.

👤 Account Title:
Tanveer Iqbal Qureshi

💰 Amount:
${total}

🧾 Transaction ID:
(Write your Transaction ID here)

Kindly confirm my payment. Thank you.`;

    window.open(
        `https://wa.me/923199088670?text=${encodeURIComponent(message)}`,
        "_blank"
    );

}

    function searchProducts(val) {
      renderProducts('all', val);
    }

    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', function () {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderProducts(btn.dataset.filter);
      });
    });

    const faqData = [
      { q: 'Delivery kis kis area mein hoti hai?', a: 'Abhi humari delivery sirf local area mein available hai. Cash on Delivery (COD) ke sath order apke doorstep tak pohanchta hai.' },
      { q: 'Payment kaise karni hai?', a: 'Cash on Delivery (COD) hai — order milne par cash pay karein. Koi advance payment nahi chahiye!' },
      { q: 'Cold Pressed oil kya hota hai?', a: 'Oil bina kisi heat ke extract kiya jata hai — is se oil ke saare natural nutrients bachay rehte hain.' },
      { q: 'Kya ye oils chemicals free hain?', a: 'Bilkul! Green Roots ke saare oils 100% organic aur chemical free hain.' },
      { q: 'Order kaise karein?', a: 'Website par kisi bhi product ke neeche green WhatsApp button dabao. Ya directly 0319-9088670 par WhatsApp karein.' }
    ];

    function initFaq() {
      const list = document.getElementById('faqList');
      if (!list) return;
      list.innerHTML = faqData.map(item => `
        <div class="faq-item">
            <div class="faq-q" onclick="toggleFaq(this)">
                <h4>${item.q}</h4>
                <div class="faq-icon"><svg viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg></div>
            </div>
            <div class="faq-a"><p>${item.a}</p></div>
        </div>
    `).join('');
    }

    function toggleFaq(el) {
      const item = el.parentElement;
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(x => x.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    }

    function initSlider() {
      const track = document.getElementById('sliderTrack');
      const dots = document.getElementById('sliderDots');
      if (!track || !dots) return;

      track.innerHTML = reviewsData.map(r => {
        const cols = ['#ec4899', '#8b5cf6', '#f97316', '#0e7490', '#22c55e'];
        const c = cols[r.rating - 1] || cols[4];
        let stars = '';
        for (let i = 0; i < 5; i++) stars += `<svg viewBox="0 0 24 24" style="fill:${i < r.rating ? '#fbbf24' : '#ddd'};width:16px;height:16px"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`;
        return `
        <div class="slider-card">
            <div class="review-card">
                <div class="review-stars">${stars}</div>
                <p class="review-text">${r.text}</p>
                <div class="review-author">
                    <div class="review-avatar" style="background:${c}">${r.name.charAt(0).toUpperCase()}</div>
                    <div>
                        <div class="review-name">${r.name}</div>
                        <div class="review-date">${r.date}</div>
                    </div>
                </div>
            </div>
        </div>`;
      }).join('');

      const total = reviewsData.length;
      dots.innerHTML = Array.from({ length: total }, (_, i) => `<div class="slider-dot ${i === currentSlide ? 'active' : ''}" onclick="goToSlide(${i})"></div>`).join('');

      clearInterval(sliderInterval);
      sliderInterval = setInterval(() => {
        currentSlide = (currentSlide + 1) % total;
        goToSlide(currentSlide);
      }, 3500);
    }

    function goToSlide(i) {
      const track = document.getElementById('sliderTrack');
      const dots = document.getElementById('sliderDots');
      if (!track || !dots) return;
      currentSlide = i;
      track.style.transform = `translateX(-${i * 100}%)`;
      Array.from(dots.children).forEach((d, j) => d.classList.toggle('active', j === i));
    }

    function slideDir(dir) {
      let total = reviewsData.length;
      currentSlide = (currentSlide + dir + total) % total;
      goToSlide(currentSlide);
    }

    function openModal(id) { document.getElementById(id).classList.add('open'); }
    function closeModal(id) { document.getElementById(id).classList.remove('open'); }

    function setRating(n) {
      currentRating = n;
      document.querySelectorAll('#starSelect button').forEach((b, i) => b.classList.toggle('active', i < n));
    }

    function submitReview() {
      const n = document.getElementById('reviewName').value.trim();
      const t = document.getElementById('reviewText').value.trim();
      if (!n || !t || currentRating === 0) {
        showToast('⚠️ Please fill all fields & select rating');
        return;
      }
      closeModal('reviewModal');
      showToast('✅ Review submitted!');
      document.getElementById('reviewName').value = '';
      document.getElementById('reviewText').value = '';
      currentRating = 0;
      document.querySelectorAll('#starSelect button').forEach(b => b.classList.remove('active'));
    }

    function showToast(msg) {
      const toast = document.getElementById('toast');
      const txt = document.getElementById('toastText');
      if (!toast || !txt) return;
      txt.textContent = msg;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 3000);
    }

    document.addEventListener('DOMContentLoaded', () => {
      try {
        renderProducts();
        initFaq();
        initSlider();
        renderCart();
        updateCartBadge();
      } catch (e) {
        console.error("Init error:", e);
      }
      setTimeout(() => {
        const l = document.getElementById('loader');
        if (l) l.classList.add('hide');
      }, 1500);
    });