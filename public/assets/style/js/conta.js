// assets/style/js/conta.js (Correção da Lógica de Nome)

import {
    auth,
    db,
    doc,
    getDoc,
    updateDoc, 
    onAuthStateChanged,
    signOut, 
    updatePassword, 
} from './firebaseauth.js'; 


// --- Elementos do DOM ---
const loggedUserFName = document.getElementById('loggedUserFName');
const nameInput = document.getElementById('nameInput');
const emailInput = document.getElementById('emailInput');
const passwordInput = document.getElementById('passwordInput');
const signOutButton = document.getElementById('signOutButton');
const saveButton = document.getElementById('saveButton');
const fileInput = document.getElementById('fileInput');
const profilePic = document.getElementById('profilePic');
const profileIcon = document.getElementById('profileIcon');


// --- Funções de Utilidade (mantidas) ---

function convertImageToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

function displayProfile(photoURL, firstName) {
    if (photoURL) {
        profilePic.style.backgroundImage = `url('${photoURL}')`;
        profileIcon.style.display = 'none';
        profilePic.classList.remove('has-icon');
    } else {
        profilePic.style.backgroundImage = 'none';
        profileIcon.style.display = 'flex'; 
        profileIcon.textContent = firstName.charAt(0).toUpperCase();
        profilePic.classList.add('has-icon');
    }
}


// --- Lógica de Autenticação e Dados do Usuário ---

onAuthStateChanged(auth, (user) => {
    if (user) {
        loadUserProfile(user.uid);
        emailInput.value = user.email || 'Email indisponível';
    } else {
        window.location.href = 'index.html'; 
    }
});


async function loadUserProfile(userId) {
    try {
        const userDocRef = doc(db, "users", userId);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
            const userData = docSnap.data();
            const firstName = userData.firstName || 'Usuário';
            const fullName = userData.fullName || userData.firstName || 'Nome Completo'; 

            loggedUserFName.textContent = firstName;
            
            // CORRIGIDO: Garante que o input de nome não está readonly para que o usuário possa digitar
            nameInput.readOnly = false; 
            nameInput.value = fullName;
            nameInput.dataset.originalValue = fullName; 
            
            displayProfile(userData.profilePhotoURL, firstName);

        } else {
            console.log("Documento do usuário não encontrado no Firestore!");
        }
    } catch (error) {
        console.error("Erro ao carregar perfil:", error);
    }
}

// --- Handlers de Eventos ---

// 1. Sair (Funcional)
if (signOutButton) {
    signOutButton.addEventListener('click', async () => {
        try {
            await signOut(auth);
            localStorage.removeItem('loggedInUserId'); 
        } catch (error) {
            console.error("Erro ao sair:", error);
            alert('Erro ao sair. Tente novamente.');
        }
    });
}


// 2. Upload de Imagem de Perfil (Funcional - Mantido)
if (fileInput) {
    fileInput.addEventListener('change', async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const user = auth.currentUser;
        if (!user) return;

        try {
            const base64ImageURL = await convertImageToBase64(file);
            const userDocRef = doc(db, "users", user.uid);
            await updateDoc(userDocRef, { profilePhotoURL: base64ImageURL });

            const firstName = nameInput.value.split(' ')[0] || 'U';
            displayProfile(base64ImageURL, firstName);

            alert('Foto de perfil atualizada com sucesso!');
            fileInput.value = ''; 

        } catch (error) {
            console.error("Erro ao fazer upload da foto:", error);
            alert('Erro ao fazer upload da foto. Tente novamente.');
        }
    });
}


// 3. Salvar Dados (Nome e Senha) (Funcional)
if (saveButton) {
    saveButton.addEventListener('click', async () => {
        const user = auth.currentUser;
        if (!user) return;

        const newName = nameInput.value.trim();
        const newPassword = passwordInput.value;
        let updateSuccess = true; // Assume sucesso até que um erro ocorra
        let changesMade = false;

        // **CORREÇÃO APLICADA AQUI:** Lógica de Atualização de Nome
        if (newName && newName !== nameInput.dataset.originalValue) {
            changesMade = true;
            try {
                const userDocRef = doc(db, "users", user.uid);
                await updateDoc(userDocRef, { 
                    fullName: newName, 
                    firstName: newName.split(' ')[0] 
                });
                alert('Nome atualizado com sucesso!');
                nameInput.dataset.originalValue = newName; // Atualiza o valor de comparação
                updateSuccess = true;
            } catch (error) {
                console.error("Erro ao atualizar nome:", error);
                alert('Erro ao atualizar nome. Tente novamente.');
                updateSuccess = false;
            }
        }
        
        // Atualizar Senha (Lógica já funcional)
        if (newPassword && newPassword !== '***********' && newPassword.length >= 6) {
            changesMade = true;
            try {
                await updatePassword(user, newPassword);
                alert('Senha atualizada com sucesso!');
                passwordInput.value = '***********'; 
                updateSuccess = true;
            } catch (error) {
                console.error("Erro ao atualizar senha:", error);
                alert('Erro ao atualizar senha. Por favor, faça login novamente e tente salvar a senha.');
                updateSuccess = false;
            }
        } else if (newPassword.length > 0 && newPassword !== '***********' && newPassword.length < 6) {
             alert('A senha deve ter pelo menos 6 caracteres.');
             updateSuccess = false;
        }

        if (changesMade && updateSuccess) {
            loadUserProfile(user.uid); 
        } else if (!changesMade) {
            alert('Nenhuma alteração detectada para salvar.');
        }
    });
}