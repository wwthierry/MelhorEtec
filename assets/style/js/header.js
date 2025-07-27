// header.js
function loadHeader() {
    const headerHTML = `
    <header>
        <div id="menu">
            <nav>
                <li><a href="sobre.html" class="nav-link">Sobre</a></li>
                <li><a href="suporte.html" class="nav-link">Suporte</a></li>
            </nav>
        </div>

        <div id="entrar">
            <li><a href="login.html" class="nav-link">Login</a></li>
            <li><a href="criar.html" class="nav-link">Criar Conta</a></li>
        </div>
    </header>
    `;
    
    document.body.insertAdjacentHTML('afterbegin', headerHTML);
    
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
}

// Chama a função quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', loadHeader);