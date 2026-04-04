// ─── Config ───
const API = window.ENV_API_URL || 'https://your-app.railway.app';

// ─── State ───
let allProducts = [];
let activeFilter = 'all';

// ─── DOM ───
const grid = document.getElementById('productsGrid');
const loadingEl = document.getElementById('loading');
const errorEl = document.getElementById('error');

// ─── Load Products ───
async function loadProducts() {
  showLoading();
  try {
    const res = await fetch(`${API}/api/products`);
    if (!res.ok) throw new Error('Network error');
    allProducts = await res.json();
    showLoading(false);
    renderProducts(allProducts);
  } catch (err) {
    showLoading(false);
    showError(true);
    console.error('Failed to load products:', err);
  }
}

// ─── Render ───
function renderProducts(products) {
  const filtered = activeFilter === 'all'
    ? products
    : products.filter(p => p.category?.toLowerCase() === activeFilter);

  if (filtered.length === 0) {
    grid.innerHTML = `<p class="empty-state">No products found in this category.</p>`;
    return;
  }

  grid.innerHTML = filtered.map(product => `
    <div class="product-card" onclick="openModal(${JSON.stringify(JSON.stringify(product))})">
      <div class="card-img">
        ${product.image
          ? `<img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}" loading="lazy" />`
          : `<span class="card-img-placeholder">${escapeHtml(product.name?.[0] ?? '?')}</span>`
        }
      </div>
      <div class="card-info">
        <p class="card-name">${escapeHtml(product.name)}</p>
        <div class="card-meta">
          <span class="card-price">$${Number(product.price).toFixed(2)}</span>
          ${product.category ? `<span class="card-category">${escapeHtml(product.category)}</span>` : ''}
        </div>
      </div>
    </div>
  `).join('');
}

// ─── Filter ───
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeFilter = btn.dataset.filter;
    renderProducts(allProducts);
  });
});

// ─── Modal ───
function openModal(productJson) {
  const p = JSON.parse(productJson);
  document.getElementById('modalName').textContent = p.name;
  document.getElementById('modalPrice').textContent = `$${Number(p.price).toFixed(2)}`;
  document.getElementById('modalCategory').textContent = p.category ?? '';
  const img = document.getElementById('modalImg');
  if (p.image) {
    img.src = p.image;
    img.style.display = 'block';
  } else {
    img.style.display = 'none';
  }
  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

// ─── Mobile Menu ───
document.getElementById('menuBtn').addEventListener('click', () => {
  document.getElementById('mobileMenu').classList.toggle('open');
});

function closeMobileMenu() {
  document.getElementById('mobileMenu').classList.remove('open');
}

// ─── Helpers ───
function showLoading(show = true) {
  loadingEl.style.display = show ? 'block' : 'none';
}

function showError(show = true) {
  errorEl.style.display = show ? 'block' : 'none';
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ─── Init ───
loadProducts();
