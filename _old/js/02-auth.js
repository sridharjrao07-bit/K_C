// ====================== AUTHENTICATION ======================
console.log('Auth system running');

/* Utility: Show a quick toast-style message */
function showMessage(message, type = 'info') {
  console.log(`[${type}] ${message}`);
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.textContent = message;
  Object.assign(el.style, {
    position: 'fixed',
    top: '80px',
    right: '20px',
    padding: '1rem 1.5rem',
    borderRadius: '8px',
    color: 'white',
    background: type === 'success' ? '#28a745' :
          type === 'error'   ? '#dc3545' :
          '#17a2b8',
    boxShadow: '0 5px 15px rgba(0,0,0,.1)',
    animation: 'slideIn .3s ease',
    zIndex: 1000
  });
  document.body.appendChild(el);
  setTimeout(() => {
    el.remove();
  }, 2500);
}

function logout() {
  localStorage.removeItem('artisanUser');
  showMessage('Logged out – see you next time', 'success');
  location.href = '01-index.html';
}

// expose globally
window.showMessage = showMessage;
window.logout = logout;

/* On DOM ready – hook up forms */
document.addEventListener('DOMContentLoaded', () => {
  /* ---- Login ---- */
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', e => {
      e.preventDefault();
      const email = loginForm.email.value?.trim();
      const password = loginForm.password.value;
      if (!email || !password) {
        showMessage('Both fields are required', 'error');
        return;
      }
      // For demo we simply accept any credential
      const user = { email, fullName: 'Demo Artisan', loggedIn: true };
      localStorage.setItem('artisanUser', JSON.stringify(user));
      showMessage('✅ Logged in!', 'success');
      setTimeout(() => location.href = '04-dashboard.html', 800);
    });
  }

  /* ---- Register ---- */
  const regForm = document.getElementById('registerForm');
  if (regForm) {
    regForm.addEventListener('submit', e => {
      e.preventDefault();
      const full = regForm.fullName.value?.trim();
      const email = regForm.email.value?.trim();
      const craft = regForm.craftType.value;
      const pwd = regForm.password.value;
      const confirmPwd = regForm.confirmPassword.value;
      if (!full || !email || !craft || !pwd) {
        showMessage('All fields are required', 'error');
        return;
      }
      if (pwd !== confirmPwd) {
        showMessage('Passwords do not match', 'error');
        return;
      }
      const newUser = { fullName: full, email, craft, loggedIn: true };
      localStorage.setItem('artisanUser', JSON.stringify(newUser));
      showMessage('✅ Account created', 'success');
      setTimeout(() => location.href = '04-dashboard.html', 800);
    });
  }
});
