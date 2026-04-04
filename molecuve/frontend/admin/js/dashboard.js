const API = window.ENV_API_URL || 'https://your-app.railway.app';

// Auth guard
const token = localStorage.getItem('token');
if (!token) location.href = 'login.html';

// ─── Load Products ───
async function loadProducts() {
  try {
    const res = await fetch(`${API}/api/products`);
    const products = await res.json();

    document.getElementById('totalProducts').textContent = products.length;
    document.getElementById('tableLoading').style.display = 'none';
    document.getElementById('productsTable').style.display = 'table';

    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = products.map(p => `
      <tr>
        <td><strong>${escapeHtml(p.name)}</strong></td>
        <td>$${Number(p.price).toFixed(2)}</td>
        <td>${p.category ? `<span class="category-tag">${escapeHtml(p.category)}</span>` : '—'}</td>
        <td>
          ${p.image
            ? `<img src="${escapeHtml(p.image)}" class="thumb" alt="${escapeHtml(p.name)}" />`
            : `<div class="thumb-placeholder">No img</div>`
          }
        </td>
        <td>
          <button class="btn-delete" onclick="deleteProduct('${p._id}')">Delete</button>
        </td>
      </tr>
    `).join('');
  } catch (err) {
    console.error('Load failed:', err);
    document.getElementById('tableLoading').innerHTML = '<p style="color:#dc3545">Failed to load products.</p>';
  }
}

// ─── Add Product ───
async function addProduct() {
  const name = document.getElementById('addName').value.trim();
  const price = document.getElementById('addPrice').value;
  const category = document.getElementById('addCategory').value;
  const image = document.getElementById('addImage').value.trim();
  const btn = document.getElementById('addBtn');
  const formError = document.getElementById('formError');

  formError.style.display = 'none';

  if (!name || !price) {
    formError.textContent = 'Name and price are required.';
    formError.style.display = 'block';
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Adding...';

  try {
    const res = await fetch(`${API}/api/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ name, price: parseFloat(price), category, image }),
    });

    const data = await res.json();

    if (!res.ok) {
      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem('token');
        location.href = 'login.html';
        return;
      }
      throw new Error(data.msg || 'Failed to add product');
    }

    closeAddModal();
    showAlert('Product added successfully!');
    clearAddForm();
    loadProducts();
  } catch (err) {
    formError.textContent = err.message || 'Something went wrong.';
    formError.style.display = 'block';
  } finally {
    btn.disabled = false;
    btn.textContent = 'Add Product';
  }
}

// ─── Delete Product ───
async function deleteProduct(id) {
  if (!confirm('Delete this product?')) return;

  try {
    const res = await fetch(`${API}/api/products/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });

    if (!res.ok) throw new Error('Failed to delete');
    showAlert('Product deleted.');
    loadProducts();
  } catch (err) {
    alert('Could not delete product.');
    console.error(err);
  }
}

// ─── Logout ───
function logout() {
  localStorage.removeItem('token');
  location.href = 'login.html';
}

// ─── Modal ───
function openAddModal() {
  document.getElementById('addModal').classList.add('open');
}

function closeAddModal() {
  document.getElementById('addModal').classList.remove('open');
  clearAddForm();
}

function clearAddForm() {
  ['addName', 'addPrice', 'addImage'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('addCategory').value = '';
  document.getElementById('formError').style.display = 'none';
}

// ─── Alert ───
function showAlert(msg) {
  const el = document.getElementById('alertMsg');
  el.textContent = msg;
  el.style.display = 'block';
  setTimeout(() => el.style.display = 'none', 3000);
}

// ─── Helpers ───
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
