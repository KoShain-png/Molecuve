const API = window.ENV_API_URL || 'https://your-app.railway.app';

// Redirect if already logged in
if (localStorage.getItem('token')) {
  location.href = 'dashboard.html';
}

async function login() {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;
  const btn = document.getElementById('loginBtn');
  const errorMsg = document.getElementById('errorMsg');

  errorMsg.style.display = 'none';

  if (!username || !password) {
    showError('Please enter username and password.');
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Signing in...';

  try {
    const res = await fetch(`${API}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      showError(data.msg || 'Invalid username or password.');
      return;
    }

    localStorage.setItem('token', data.token);
    location.href = 'dashboard.html';
  } catch (err) {
    showError('Cannot connect to server. Please try again.');
    console.error(err);
  } finally {
    btn.disabled = false;
    btn.textContent = 'Sign In';
  }
}

function showError(msg) {
  const el = document.getElementById('errorMsg');
  el.textContent = msg;
  el.style.display = 'block';
}

// Enter key support
document.addEventListener('keydown', e => {
  if (e.key === 'Enter') login();
});
