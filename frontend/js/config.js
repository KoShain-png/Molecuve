// =====================
// Molecuve — Config
// =====================

const CONFIG = {
  API_URL: 'https://molecuve-production.up.railway.app', // ← Railway URL ထည့်ပါ
  PAYMENT_INFO: {
    KBZPay:    { number: '09 xxx xxx xxx', name: 'Molecuve Store' },
    'Wave Money': { number: '09 xxx xxx xxx', name: 'Molecuve Store' },
    AYAPay:    { number: '09 xxx xxx xxx', name: 'Molecuve Store' },
  }
};

// ─── API helper ───────────────────────────────────────────
const api = {
  async get(path) {
    const res = await fetch(CONFIG.API_URL + path);
    return res.json();
  },
  async post(path, data, isForm = false) {
    const res = await fetch(CONFIG.API_URL + path, {
      method: 'POST',
      headers: isForm ? {} : { 'Content-Type': 'application/json' },
      body: isForm ? data : JSON.stringify(data),
    });
    return res.json();
  },
  async put(path, data) {
    const res = await fetch(CONFIG.API_URL + path, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  async delete(path) {
    const res = await fetch(CONFIG.API_URL + path, { method: 'DELETE' });
    return res.json();
  },
  async postForm(path, formData) {
    const res = await fetch(CONFIG.API_URL + path, {
      method: 'POST',
      body: formData,
    });
    return res.json();
  },
  async putForm(path, formData) {
    const res = await fetch(CONFIG.API_URL + path, {
      method: 'PUT',
      body: formData,
    });
    return res.json();
  }
};

// ─── Cart ─────────────────────────────────────────────────
const cart = {
  items: JSON.parse(localStorage.getItem('molecuve_cart') || '[]'),

  save() {
    localStorage.setItem('molecuve_cart', JSON.stringify(this.items));
    this.updateCount();
  },

  add(product, size, color) {
    const key = `${product.id}-${size}-${color}`;
    const existing = this.items.find(i => i.key === key);
    if (existing) {
      existing.qty += 1;
    } else {
      this.items.push({ key, product, size, color, qty: 1 });
    }
    this.save();
    showToast('Added to cart!');
  },

  remove(key) {
    this.items = this.items.filter(i => i.key !== key);
    this.save();
  },

  total() {
    return this.items.reduce((sum, i) => sum + i.product.price * i.qty, 0);
  },

  count() {
    return this.items.reduce((sum, i) => sum + i.qty, 0);
  },

  clear() {
    this.items = [];
    this.save();
  },

  updateCount() {
    const el = document.getElementById('cart-count');
    if (el) el.textContent = `Cart (${this.count()})`;
  }
};

// ─── Toast ────────────────────────────────────────────────
function showToast(msg) {
  let t = document.querySelector('.toast');
  if (!t) {
    t = document.createElement('div');
    t.className = 'toast';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

// ─── Helpers ──────────────────────────────────────────────
function formatPrice(n) {
  return Number(n).toLocaleString() + ' MMK';
}

function imgSrc(url) {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  return CONFIG.API_URL + url;
}
