// header.js
function loadHeader() {
    const headerHTML = `
    <header>
        <div id="menu">
            <nav>
                <ul>
                    <li><a href="menu.html" class="nav-link">Menu</a></li>
                    <li><a href="doacoes.html" class="nav-link">Doações</a></li>
                    <li><a href="suporte.html" class="nav-link">Suporte</a></li>
                    <li><a href="sobre.html" class="nav-link">Sobre</a></li>
                </ul>
            </nav>
        </div>

        <div id="entrar">
            <ul>
                <li>
                    <button class="notification-btn" aria-label="Notificações">
                        <i class="far fa-bell"></i>
                        <span class="notification-badge"></span>
                    </button>
                </li>
                <li>
                    <div class="user-avatar" aria-label="Perfil do usuário">
                        <i class="fas fa-user"></i>
                    </div>
                </li>
            </ul>
        </div>
    </header>
    `;
    
    document.body.insertAdjacentHTML('afterbegin', headerHTML);
    
    // Adiciona os links de Font Awesome se não estiverem presentes
    if (!document.querySelector('link[href*="font-awesome"]')) {
        const fontAwesome = document.createElement('link');
        fontAwesome.rel = 'stylesheet';
        fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css';
        document.head.appendChild(fontAwesome);
    }
    
    // Adiciona a fonte Open Sans se não estiver presente
    if (!document.querySelector('link[href*="fonts.googleapis.com"]')) {
        const openSans = document.createElement('link');
        openSans.href = 'https://fonts.googleapis.com/css2?family=Open+Sans&display=swap';
        openSans.rel = 'stylesheet';
        document.head.appendChild(openSans);
    }
    
    // Adiciona o CSS do header se não estiver presente
    if (!document.querySelector('link[href*="nav.css"]')) {
        const navCSS = document.createElement('link');
        navCSS.rel = 'stylesheet';
        navCSS.href = 'assets/style/css/nav.css';
        document.head.appendChild(navCSS);
    }
    
    // Ativa o link da página atual
    const navLinks = document.querySelectorAll('.nav-link');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        
        if (linkPage === currentPage) {
            link.classList.add('active');
        }
        
        link.addEventListener('click', function() {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// Chama a função quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', loadHeader);