// Verificar se o usuário está autenticado
function isAuthenticated() {
  return localStorage.getItem('token') !== null;
}

// Redirecionar com base na autenticação
function checkAuth() {
  const loginContainer = document.getElementById('login-container');
  const mainContainer = document.getElementById('main-container');

  if (isAuthenticated()) {
    loginContainer.classList.add('d-none');
    mainContainer.classList.remove('d-none');
  } else {
    loginContainer.classList.remove('d-none');
    mainContainer.classList.add('d-none');
  }
}

// Função de login
async function login(email, password) {
  try {
    const data = await apiService.login(email, password);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    checkAuth();
    return true;
  } catch (error) {
    console.error('Erro no login:', error);
    return false;
  }
}

// Função de logout
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  checkAuth();
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  // Verificar autenticação ao carregar a página
  checkAuth();

  // Form de login
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      
      const success = await login(email, password);
      if (!success) {
        Swal.fire({
          icon: 'error',
          title: 'Erro no login',
          text: 'Email ou senha incorretos',
        });
      } else {
        // Carregar listas após login bem-sucedido
        loadLists();
      }
    });
  }

  // Botão de logout
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      logout();
    });
  }
});
