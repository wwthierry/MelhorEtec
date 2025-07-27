
const tabLogin = document.getElementById('tab-login');
const tabAdmin = document.getElementById('tab-admin');
const tabsContainer = document.querySelector('.tabs');
const rmLabel = document.querySelector('label[for="rm"]');

function updateUnderline() {
    const activeTab = document.querySelector('.tab.active');
    const isAdmin = activeTab.classList.contains('admin');

    const tabRect = activeTab.getBoundingClientRect();
    const containerRect = tabsContainer.getBoundingClientRect();

    const position = tabRect.left - containerRect.left;
    const width = tabRect.width;
    const color = isAdmin ? '#FFFFFFFF' : 'white';

    tabsContainer.style.setProperty('--underline-width', `${width}px`);
    tabsContainer.style.setProperty('--underline-position', `${position}px`);
    tabsContainer.style.setProperty('--underline-color', color);
}

function activateTab(tab) {
    if (tab === 'login') {
        tabLogin.classList.add('active');
        tabAdmin.classList.remove('active');
        rmLabel.textContent = 'R.M escolar:';
    } else if (tab === 'admin') {
        tabAdmin.classList.add('active');
        tabLogin.classList.remove('active');
        rmLabel.textContent = 'Escola:';
    }
    updateUnderline();
}

// Inicializa o underline na posição correta
window.addEventListener('load', updateUnderline);
tabLogin.addEventListener('click', () => activateTab('login'));
tabAdmin.addEventListener('click', () => activateTab('admin'));

    // Seu JavaScript existente
    
    // Adicione esta parte se quiser usar o método com button
    document.addEventListener('DOMContentLoaded', function() {
      const btnCriarConta = document.querySelector('.btn-black');
      if(btnCriarConta && btnCriarConta.textContent.trim() === 'Criar conta') {
        btnCriarConta.addEventListener('click', function() {
          window.location.href = 'criar.html';
        });
      }
    });

    // Adicione esta parte se quiser usar o método com button
    document.addEventListener('DOMContentLoaded', function() {
      const btnCriarConta = document.querySelector('.btn-login');
      if(btnCriarConta && btnCriarConta.textContent.trim() === 'Menu') {
        btnCriarConta.addEventListener('click', function() {
          window.location.href = 'menu.html';
        });
      }
    });
