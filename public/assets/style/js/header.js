// header.js
function loadHeader() {
    const headerHTML = `
    <header>
        <img src="assets/img/logo2.png" alt="Logo">
        <div id="right-side">
            <div id="menu">
                <nav>
                    <li><a href="index.html#sobre" class="nav-link">Sobre</a></li>
                    <li><a href="suporte.html" class="nav-link">Suporte</a></li>
                </nav>
            </div>
            <div id="login">
                <button id="entrar">Login</button>
                <button id="criar">Criar conta</button>
            </div>
        </div>
    </header>
    `;
    
    document.body.insertAdjacentHTML('afterbegin', headerHTML);
    
    // O resto do seu código de JavaScript para ativar os links...
    const navLinks = document.querySelectorAll('.nav-link');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        
        // Compara apenas o nome do arquivo
        if (linkPage === currentPage) {
            link.classList.add('active');
        }
        
        link.addEventListener('click', function() {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
     // Adicione a lógica para os botões aqui
     const loginBtn = document.getElementById('entrar');
     const registerBtn = document.getElementById('criar');
 
     // Redireciona para a página de login
     if (loginBtn) {
         loginBtn.addEventListener('click', () => {
             window.location.href = 'login.html'; // Substitua pelo caminho da sua página de login
         });
     }
 
     // Redireciona para a página de criação de conta
     if (registerBtn) {
         registerBtn.addEventListener('click', () => {
             window.location.href = 'criar.html'; // Substitua pelo caminho da sua página de criação de conta
         });
     }
}

// Chama a função quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', loadHeader);