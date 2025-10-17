// assets/style/js/login1.js (LÓGICA COMPLETA E CORRIGIDA DE LOGIN E ADM)

// Importa as funções do Firebase SDK
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";

// Obtém a instância de autenticação (Importante!)
const auth = getAuth(); 

// --- CONSTANTES DO ADMIN ---
const ADMIN_LOGIN_DISPLAY = 'etecDarcy'; // O que o usuário ADM digita
const ADMIN_FIREBASE_EMAIL = 'etecDarcy@email.com'; // O email real no Firebase

const REDIRECT_ADMIN = 'menu.html'; // Redireciona para o menu após o login ADM
const REDIRECT_USER = 'index.html'; // Redireciona para o index após o login User

// --- FUNÇÕES DE FEEDBACK ---

/**
 * Exibe uma mensagem de feedback para o usuário.
 */
function showMessage(element, message, color) {
    element.textContent = message;
    // Define a cor de fundo e de texto
    const bgColor = color === 'green' ? '#d4edda' : color === 'red' ? '#f8d7da' : '#fff3cd';
    const textColor = color === 'red' ? '#721c24' : '#155724';

    element.style.backgroundColor = bgColor;
    element.style.color = textColor;
    element.style.display = 'block';
    
    setTimeout(() => {
        element.style.display = 'none';
    }, 5000);
}

function handleLoginError(errorCode) {
    switch (errorCode) {
        case 'auth/invalid-credential':
        case 'auth/user-not-found':
        case 'auth/wrong-password':
            return 'E-mail ou senha incorretos!';
        case 'auth/invalid-email':
            return 'Formato de e-mail inválido!';
        case 'auth/too-many-requests':
            return 'Muitas tentativas. Tente novamente mais tarde.';
        default:
            return 'Erro no login. Tente novamente.';
    }
}

// --- LÓGICA DO TOGGLE (ABAS) ---
const userTab = document.getElementById('userTab');
const adminTab = document.getElementById('adminTab');
const tabUnderline = document.getElementById('tabUnderline');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password'); 
const forgotPasswordLink = document.getElementById('forgotPasswordLink');
const loginForm = document.getElementById('signinForm');
const messageDiv = document.getElementById('signInMessage');


let currentMode = 'user'; 

function toggleLoginMode(mode) {
    // Verifica se as abas existem no HTML
    if (!userTab || !adminTab || !tabUnderline || !emailInput || !passwordInput) return;
    
    if (mode === currentMode) return;

    currentMode = mode;

    userTab.classList.remove('active');
    adminTab.classList.remove('active');

    if (mode === 'admin') {
        adminTab.classList.add('active');
        
        // Move o underline para a posição e largura do ADM
        const adminOffset = adminTab.offsetLeft;
        const adminWidth = adminTab.offsetWidth;
        tabUnderline.style.transform = `translateX(${adminOffset}px)`;
        tabUnderline.style.width = `${adminWidth}px`;
        
        // Mudar campos
        emailInput.type = 'text'; // Garante que seja text para aceitar 'etecDarcy'
        emailInput.placeholder = 'login';
        emailInput.value = ''; 
        passwordInput.placeholder = 'senha';
        passwordInput.value = ''; 
        
        // Oculta links de recuperação e criação de conta no modo ADM
        if (forgotPasswordLink) forgotPasswordLink.parentElement.style.display = 'none';
        
    } else {
        userTab.classList.add('active');
        
        // Move o underline para a posição e largura do USER
        const userWidth = userTab.offsetWidth;
        tabUnderline.style.transform = 'translateX(0)';
        tabUnderline.style.width = `${userWidth}px`;
        
        // Mudar campos
        emailInput.type = 'email'; // Volta para email
        emailInput.placeholder = 'Email';
        emailInput.value = '';
        passwordInput.placeholder = 'Password';
        passwordInput.value = '';
        
        // Mostra links
        if (forgotPasswordLink) forgotPasswordLink.parentElement.style.display = 'flex';
    }
    // Oculta a mensagem de erro ao trocar de aba
    if (messageDiv) messageDiv.style.display = 'none'; 
}

// Event Listeners para as abas
if (userTab) userTab.addEventListener('click', () => toggleLoginMode('user'));
if (adminTab) adminTab.addEventListener('click', () => toggleLoginMode('admin'));

// Inicializa a interface
document.addEventListener('DOMContentLoaded', () => {
    // Inicializa o tamanho do underline baseado no texto LOGIN
    if (userTab && tabUnderline) {
        tabUnderline.style.width = `${userTab.offsetWidth}px`;
    }
    // Garante que o modo de login padrão é 'user'
    toggleLoginMode('user'); 
});


// --- LÓGICA DE LOGIN (AGORA TRATA O ADM) ---

if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const inputLogin = emailInput.value.trim(); 
        const password = passwordInput.value;
        
        if (messageDiv) messageDiv.style.display = 'none';

        if (!inputLogin || !password) {
            if (messageDiv) showMessage(messageDiv, 'Por favor, preencha todos os campos.', 'red');
            return;
        }

        let firebaseEmail = inputLogin;
        let isAttemptingAdminLogin = false;

        // Se estiver no modo ADM, traduz o login de tela para o email do Firebase
        if (currentMode === 'admin') {
            // Verifica se o login de tela bate com o login ADM (etecDarcy), ignorando Case
            if (inputLogin.toLowerCase() === ADMIN_LOGIN_DISPLAY.toLowerCase()) {
                firebaseEmail = ADMIN_FIREBASE_EMAIL;
                isAttemptingAdminLogin = true;
            } else {
                 // Login ADM incorreto
                if (messageDiv) showMessage(messageDiv, 'Credenciais ADM incorretas (Login/Senha).', 'red');
                return;
            }
        }
        
        try {
            const userCredential = await signInWithEmailAndPassword(auth, firebaseEmail, password);
            const user = userCredential.user;
            
            // --- VERIFICAÇÃO FINAL CORRIGIDA (CASE-INSENSITIVE) ---
            // Verifica se o email do usuário logado é o do ADM, ignorando Case
            if (user.email.toLowerCase() === ADMIN_FIREBASE_EMAIL.toLowerCase()) {
                if (messageDiv) showMessage(messageDiv, 'Login ADM realizado com sucesso! Redirecionando para o Menu.', 'green');
                setTimeout(() => {
                    window.location.href = REDIRECT_ADMIN; // Redireciona para menu.html
                }, 1000);
            } else {
                if (messageDiv) showMessage(messageDiv, 'Login realizado com sucesso! Redirecionando...', 'green');
                setTimeout(() => {
                    window.location.href = REDIRECT_USER; // Redireciona para index.html
                }, 1000);
            }

        } catch (error) {
            console.error('Erro no login:', error.code, error.message);
            
            // Tratamento de erro específico para ADM ou genérico para USER
            if (isAttemptingAdminLogin || currentMode === 'admin') {
                if (messageDiv) showMessage(messageDiv, 'Credenciais ADM incorretas (Login/Senha). Tente novamente.', 'red');
            } else {
                // Erro de login normal
                if (messageDiv) showMessage(messageDiv, handleLoginError(error.code), 'red');
            }
        }
    });
}


// --- LÓGICA DE RECUPERAÇÃO DE SENHA ---

if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener('click', async (e) => {
        e.preventDefault(); 
        
        const email = emailInput.value.trim(); 

        // Bloqueia a recuperação de senha no modo ADM
        if (currentMode === 'admin') {
             if (messageDiv) showMessage(messageDiv, 'A função de recuperação de senha não está disponível no modo Administrador.', 'red');
             return;
        }

        if (!email) {
            if (messageDiv) showMessage(messageDiv, 'Por favor, digite o seu e-mail no campo e clique em "Recuperar Senha".', 'red');
            return;
        }
        
        if (messageDiv) showMessage(messageDiv, 'Enviando link de redefinição...', 'blue'); 

        try {
            await sendPasswordResetEmail(auth, email);
            
            if (messageDiv) showMessage(
                messageDiv, 
                `Se o e-mail "${email}" estiver cadastrado, um link para redefinição de senha foi enviado. Verifique sua caixa de entrada e spam!`, 
                'green'
            );

        } catch (error) {
            let errorMessage = "Erro ao solicitar a redefinição. Tente novamente mais tarde.";
            
            if (error.code === 'auth/invalid-email') {
                 errorMessage = 'O formato do e-mail digitado é inválido.';
            } else if (error.code === 'auth/missing-email') {
                 errorMessage = 'O campo de e-mail está vazio.';
            } 

            if (messageDiv) showMessage(messageDiv, errorMessage, 'red');
        }
    });
}