// nav.js

// Importações do Firebase - Adicionando 'signOut' para a opção de sair.
import { auth, db, doc, getDoc, onAuthStateChanged, signOut } from './firebaseauth.js'; 


/**
 * Busca a URL da foto de perfil (profilePhotoURL), o nome (firstName) e o email do usuário.
 */
async function getUserData(userId) {
    // Verifica se db está definido (depende do firebaseauth.js)
    if (typeof db === 'undefined') {
        console.error("Firebase DB não está acessível. Verifique as importações em firebaseauth.js.");
        return { name: 'Usuário', email: 'email@padrao.com', photoURL: null };
    }
    
    try {
        const userDocRef = doc(db, "users", userId);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
            const data = userDocSnap.data();
            return {
                name: data.firstName || 'Usuário',
                // Pega o email do objeto auth.currentUser
                email: auth.currentUser.email || 'email@padrao.com', 
                photoURL: data.profilePhotoURL || null // URL da foto de perfil (Base64)
            };
        } else {
            // Pega o email do objeto auth.currentUser mesmo que o doc não exista
            return { name: 'Usuário', email: auth.currentUser?.email || 'email@padrao.com', photoURL: null };
        }
    } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
        return { name: 'Erro', email: 'erro@email.com', photoURL: null };
    }
}

async function loadHeader() {
    let userAvatarHTML = '<i class="fa-solid fa-circle-user"></i>';
    let userFirstName = 'Usuário'; // Valor padrão
    let userEmail = 'email@padrao.com'; // Valor padrão
    let userPhotoURL = null; // Para usar na foto grande do dropdown

    // Verifica se auth está definido (depende do firebaseauth.js)
    if (typeof auth !== 'undefined' && auth.currentUser) {
        const userId = auth.currentUser.uid;
        const userData = await getUserData(userId); 
        userFirstName = userData.name;
        userEmail = userData.email; 
        userPhotoURL = userData.photoURL;
        
        if (userData.photoURL) {
            // Se houver foto, usa a imagem no widget
            userAvatarHTML = `<img src="${userData.photoURL}" alt="Foto de Perfil" class="profile-avatar-nav">`;
        } else {
            // Se não houver foto, usa o avatar de inicial
            userAvatarHTML = `
                <div class="profile-avatar-nav initial-avatar">
                    ${userData.name.charAt(0).toUpperCase()}
                </div>
            `;
        }
    }


    const headerHTML = `
    <header>
      <div id="menu">
        <nav>
          <ul>
            <li><a href="menu.html" class="nav-link">Menu</a></li>
            <li><a href="doacao2.html" class="nav-link">Doações</a></li>
            <li><a href="suporte2.html" class="nav-link">Suporte</a></li>
            <li><a href="sobre2.html" class="nav-link">Sobre</a></li>
            
            <li><a href="publi.html" class="nav-link post-link-btn"><i class="fas fa-plus"></i> Publicar</a></li> 
            
          </ul>
          
          <div class="user-profile-widget">
              ${userAvatarHTML}
              <span id="loggedUserFName">${userFirstName}</span>
          </div>
          
          <div class="dropdown">
            <div class="dropdown-profile-header">
                ${
                    // Foto do usuário no dropdown
                    userPhotoURL 
                    ? `<img src="${userPhotoURL}" alt="Foto de Perfil" class="profile-avatar-dropdown">`
                    : `<div class="profile-avatar-dropdown initial-avatar">${userFirstName.charAt(0).toUpperCase()}</div>`
                }
                <p class="welcome-message">Olá, <strong>${userFirstName}</strong>!</p>
                <span class="dropdown-email">${userEmail}</span> 
                
            </div>
            
            <div class="dropdown-actions-container">
                <button id="configButton" class="dropdown-button config-button" onclick="window.location.href='conta.html'">
                    <i class="fas fa-cog"></i> Configurações
                </button>
                <button id="signOutButton" class="dropdown-button signout-button">
                    <i class="fas fa-arrow-right-to-bracket"></i> Sair
                </button>
            </div>
            <button class="dropdown-close-btn" aria-label="Fechar Menu">
              <i class="fas fa-times"></i>
            </button>
          </div>
        </nav>
      </div>
    </header>
    `;
    
    // Remove qualquer header existente antes de inserir o novo (para evitar duplicação em SPAs ou reloads)
    const existingHeader = document.querySelector('header');
    if (existingHeader) {
        existingHeader.remove();
    }
    
    document.body.insertAdjacentHTML('afterbegin', headerHTML);
 
    // Font Awesome
    if (!document.querySelector('link[href*="font-awesome"]')) {
      const fontAwesome = document.createElement('link');
      fontAwesome.rel = 'stylesheet';
      fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css'; // Atualizado para v6
      document.head.appendChild(fontAwesome);
    }
 
    // Fonte Open Sans
    if (!document.querySelector('link[href*="fonts.googleapis.com"]')) {
      const openSans = document.createElement('link');
      openSans.href = 'https://fonts.googleapis.com/css2?family=Open+Sans&display=swap';
      openSans.rel = 'stylesheet';
      document.head.appendChild(openSans);
    }
 
    // CSS nav
    if (!document.querySelector('link[href*="nav.css"]')) {
      const navCSS = document.createElement('link');
      navCSS.rel = 'stylesheet';
      navCSS.href = 'assets/style/css/nav.css';
      document.head.appendChild(navCSS);
    }
 
    // Link ativo (lógica de navegação)
    const navLinks = document.querySelectorAll('.nav-link');
    const currentPage = window.location.pathname.split('/').pop() || 'menu.html'; 
    navLinks.forEach(link => {
      const linkPage = link.getAttribute('href');
      const normalizedLinkPage = linkPage.endsWith('.html') ? linkPage : linkPage.split('/').pop() || 'menu.html'; 
      const normalizedCurrentPage = currentPage.endsWith('.html') ? currentPage : currentPage.split('/').pop() || 'menu.html';

      if (normalizedLinkPage === normalizedCurrentPage) {
        link.classList.add('active');
      }
      link.addEventListener('click', function() {
        navLinks.forEach(l => l.classList.remove('active'));
        this.classList.add('active');
      });
    });
 
    // Dropdown clique
    const userProfileWidget = document.querySelector('.user-profile-widget');
    const dropdown = document.querySelector('.dropdown');
    const closeBtn = document.querySelector('.dropdown-close-btn');
 
    if (userProfileWidget && dropdown) {
      userProfileWidget.addEventListener('click', () => {
        dropdown.classList.toggle('active');
      });

      if (closeBtn) {
        closeBtn.addEventListener('click', () => {
          dropdown.classList.remove('active');
        });
      }
 
      document.addEventListener('click', (event) => {
        if (!userProfileWidget.contains(event.target) && !dropdown.contains(event.target)) {
          dropdown.classList.remove('active');
        }
      });
    }

    // LÓGICA: Sign Out Button (alterado de link para button)
    const signOutButton = document.getElementById('signOutButton');
    if (signOutButton) {
        signOutButton.addEventListener('click', async (event) => {
            event.preventDefault(); 
            try {
                await signOut(auth);
                window.location.href = 'index.html'; 
            } catch (error) {
                console.error("Erro ao sair:", error);
                alert('Erro ao sair. Tente novamente.');
            }
        });
    }
}
 
// Lógica de autenticação do Firebase
if (typeof onAuthStateChanged !== 'undefined') {
    onAuthStateChanged(auth, (user) => {
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            loadHeader();
        } else {
            document.addEventListener('DOMContentLoaded', loadHeader);
        }
    });
} else {
    document.addEventListener('DOMContentLoaded', loadHeader);
}