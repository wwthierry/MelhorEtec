// assets/style/js/publish.js (COM CORREÇÃO ADM, DELETE, LIKE)

import {
    auth,
    db,
    collection,
    addDoc,
    serverTimestamp,
    query,
    orderBy,
    onSnapshot,
    doc,
    getDoc,
    updateDoc,
    arrayUnion,
    arrayRemove,
    deleteDoc,         // <--- Importação necessária para excluir
    onAuthStateChanged, // <--- Importação necessária para verificar o login
} from './firebaseauth.js';


// --- CONSTANTE DO ADMIN (deve ser a mesma do login) ---
const ADMIN_FIREBASE_EMAIL = 'etecDarcy@email.com'; 
let currentUser = undefined; // Variável global para armazenar o usuário logado


// --- Elementos do DOM ---
const newPostForm = document.getElementById('newPostForm');
const postMessageDiv = document.getElementById('postMessage');
const imageFile = document.getElementById('imageFile');
const postCaption = document.getElementById('postCaption');
const galleryDiv = document.getElementById('gallery');


// --- Funções de Feedback e Utilidade ---

function showPostMessage(message, color) {
    const messageDiv = document.getElementById('postMessage');
    messageDiv.style.display = 'block';
    messageDiv.textContent = message;
    const bgColor = color === 'green' ? '#d4edda' : color === 'red' ? '#f8d7da' : '#fff3cd';
    const textColor = color === 'red' ? '#721c24' : '#155724';

    messageDiv.style.backgroundColor = bgColor;
    messageDiv.style.color = textColor;
    messageDiv.style.opacity = 1;

    setTimeout(() => {
        messageDiv.style.opacity = 0;
        setTimeout(() => { messageDiv.style.display = 'none'; }, 500);
    }, 5000);
}

function convertImageToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

/**
* Busca o nome (firstName) e a URL da foto de perfil (profilePhotoURL) do usuário.
* CORRIGIDO: Agora trata o ADM corretamente.
*/
async function getUserData(userId) {
    // ⚠️ Atenção: Se o userId da publicação for do ADM, exibe 'Administrador'
    // Você pode precisar de uma lógica mais robusta se o ADM for postar com outro UID.
    if (currentUser && currentUser.email && currentUser.email.toLowerCase() === ADMIN_FIREBASE_EMAIL.toLowerCase() && userId === currentUser.uid) {
         return { name: 'Administrador', photoURL: null };
    }
    
    try {
        const userDocRef = doc(db, "users", userId);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
            const data = userDocSnap.data();
            return {
                name: data.firstName || 'Usuário',
                photoURL: data.profilePhotoURL || null
            };
        } else {
            return { name: 'Usuário Removido', photoURL: null };
        }
    } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
        return { name: 'Erro', photoURL: null };
    }
}


// --- FUNÇÃO DE EXCLUSÃO DE POST ---

async function deletePost(postId) {
    // Verifica se o usuário logado é o administrador
    if (!currentUser || currentUser.email.toLowerCase() !== ADMIN_FIREBASE_EMAIL.toLowerCase()) {
        showPostMessage('❌ Apenas o Administrador pode excluir posts.', 'red');
        return;
    }

    if (!confirm('Tem certeza que deseja excluir esta publicação? Esta ação é irreversível.')) {
        return;
    }

    const postRef = doc(db, "posts", postId);

    try {
        await deleteDoc(postRef);
        showPostMessage('✅ Publicação excluída com sucesso pelo Administrador!', 'green');
    } catch (error) {
        console.error("Erro ao excluir o post:", error);
        showPostMessage('❌ Erro ao excluir o post. Tente novamente.', 'red');
    }
}


// --- FUNÇÃO DE CURTIDAS ---

async function toggleLike(postId) {
    if (!currentUser) {
        showPostMessage('❌ Você precisa estar logado para curtir um post!', 'red');
        return;
    }

    const userId = currentUser.uid;
    const postRef = doc(db, "posts", postId);

    try {
        const postSnap = await getDoc(postRef);
        if (!postSnap.exists()) return;

        const currentLikes = postSnap.data().likes || [];
        const isCurrentlyLiked = currentLikes.includes(userId);

        if (isCurrentlyLiked) {
            await updateDoc(postRef, { likes: arrayRemove(userId) });
        } else {
            await updateDoc(postRef, { likes: arrayUnion(userId) });
        }
    } catch (error) {
        console.error("Erro ao alternar o like:", error);
        showPostMessage('❌ Erro ao curtir/descurtir o post.', 'red');
    }
}


// --- FUNÇÃO DE CRIAÇÃO DO ELEMENTO POST (INCLUI BOTÃO EXCLUIR) ---

function createPostElement(post, userData, postId) {
    const postDiv = document.createElement('div');
    postDiv.className = 'post-item';
    postDiv.setAttribute('data-post-id', postId); 

    // Verificação ADM (Case-Insensitive)
    const userId = currentUser ? currentUser.uid : null;
    const isAdmin = currentUser && currentUser.email.toLowerCase() === ADMIN_FIREBASE_EMAIL.toLowerCase();

    // LÓGICA DE LIKES
    const likesArray = post.likes || [];
    const isLiked = userId && likesArray.includes(userId);
    const likeCount = likesArray.length;

    const likeIconClass = isLiked ? 'fa-solid fa-star liked' : 'fa-regular fa-star';

    const date = post.timestamp ? new Date(post.timestamp.seconds * 1000).toLocaleDateString("pt-BR") : 'Carregando...';

    // Conteúdo do avatar
    const avatarContent = userData.photoURL
        ? `<img src="${userData.photoURL}" alt="Foto de Perfil">`
        : userData.name.charAt(0).toUpperCase();

    // HTML para o botão de exclusão
    // ADICIONADO: Agora só é injetado se for ADM
    const deleteButtonHTML = isAdmin 
        ? `<button class="delete-button" title="Excluir Permanentemente"><i class="fas fa-trash-alt"></i> Excluir</button>`
        : ''; 

    // Estrutura do card com o botão no local correto
    postDiv.innerHTML = `
    <div>
        <div class="post-header">
            <div class="profile-avatar">${avatarContent}</div>
            <p>${userData.name}</p>
        </div>
        <img src="${post.imageURL}" alt="${post.caption}">
        
        <div class="post-body">
            
            <div class="like-area" style="margin-top: 5px; margin-bottom: 5px; display: flex; justify-content: space-between; align-items: center;">
                
                <span class="like-container" style="display: flex; align-items: center;">
                    <i class="${likeIconClass} like-button"></i>
                    <span class="like-count">${likeCount}</span>
                    ${deleteButtonHTML} 
                </span>
                
                <a href="/help.html" class="help-button">Ajudar</a>
            </div>
            
            <div class="new-caption-container" style="margin-top: 5px;">
                <p class="post-caption" style="margin-bottom: 5px; margin-top: 0;">${post.caption || 'SEM TÍTULO'}</p>
                <p style="font-size: 0.8em; color: #999; margin: 0;"><small>Publicado em: ${date}</small></p>
            </div>

        </div>
    </div>
    `;

    // Adiciona o listener de evento à estrela (botão de like)
    const likeButton = postDiv.querySelector('.like-button');
    if (likeButton) {
        likeButton.addEventListener('click', () => toggleLike(postId));
    }
    
    // Adiciona o listener de evento ao botão de exclusão
    if (isAdmin) {
        const deleteBtn = postDiv.querySelector('.delete-button');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => deletePost(postId)); 
        }
    }

    return postDiv;
}


async function handlePostSubmission(e) {
    e.preventDefault();

    const file = imageFile.files[0];
    const caption = postCaption.value.trim();
    
    if (!currentUser) { 
        showPostMessage('❌ Você precisa estar logado para publicar!', 'red');
        return;
    }

    if (!file) {
        showPostMessage('❌ Por favor, selecione uma imagem para publicar.', 'red');
        return;
    }
    
    showPostMessage('⏳ Convertendo e enviando para o Firestore...', 'yellow');
    newPostForm.querySelector('button').disabled = true;

    try {
        const base64ImageURL = await convertImageToBase64(file);

        const postData = {
            userId: currentUser.uid,
            caption: caption,
            imageURL: base64ImageURL,
            timestamp: serverTimestamp(),
            likes: [],
        };

        await addDoc(collection(db, "posts"), postData);

        showPostMessage('✅ Publicação realizada com sucesso!', 'green');
        newPostForm.reset();

    } catch (error) {
        console.error('Erro na publicação:', error);
        showPostMessage(`❌ Erro ao publicar: ${error.message}`, 'red');
    } finally {
        newPostForm.querySelector('button').disabled = false;
    }
}


async function loadPosts() {
    if (!galleryDiv) return;

    // Garante que a função só roda quando o estado do usuário for conhecido
    if (currentUser === undefined) { 
         return;
    }

    const postsQuery = query(collection(db, "posts"), orderBy("timestamp", "desc"));

    onSnapshot(postsQuery, async (snapshot) => {
        galleryDiv.innerHTML = ''; 

        if (snapshot.empty) {
            galleryDiv.innerHTML = '<p>Ainda não há publicações. Seja o primeiro a postar!</p>';
            return;
        }
        
        // Mapeamento e carregamento de dados do usuário
        const userIds = snapshot.docs.map(doc => doc.data().userId);
        const uniqueUserIds = [...new Set(userIds)];
        const userDataMap = {};

        await Promise.all(uniqueUserIds.map(async (userId) => {
            userDataMap[userId] = await getUserData(userId);
        }));

        const postElements = snapshot.docs.map(doc => {
            const post = doc.data();
            const postId = doc.id; 
            const userData = userDataMap[post.userId];
            return createPostElement(post, userData, postId); 
        });

        postElements.forEach(element => galleryDiv.appendChild(element));

    }, (error) => {
        console.error("Erro ao carregar publicações:", error);
        galleryDiv.innerHTML = '<p>Erro ao carregar as publicações.</p>';
    });
}


// --- Inicialização: Monitora o estado de autenticação ---
onAuthStateChanged(auth, (user) => {
    // Atualiza a variável global
    currentUser = user; 
    
    // Chama o loadPosts APENAS DEPOIS que sabemos quem está logado
    loadPosts(); 
});


if (newPostForm) {
    newPostForm.addEventListener('submit', handlePostSubmission);
}

// O loadPosts será chamado dentro do onAuthStateChanged