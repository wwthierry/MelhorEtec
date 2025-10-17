// criar.js

document.getElementById('signupForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    const email = document.getElementById('rEmail').value.trim();
    const password = document.getElementById('rPassword').value;
    const messageDiv = document.getElementById('signUpMessage');

    try {
        const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
        console.log('Usuário criado:', userCredential.user);
        messageDiv.style.display = 'block';
        messageDiv.textContent = 'Conta criada com sucesso!';
        messageDiv.style.backgroundColor = 'green';
        window.location.href = 'login.html';
    } catch (error) {
        console.error('Erro ao criar conta:', error);
        messageDiv.style.display = 'block';
        messageDiv.textContent = `Erro: ${error.message}`;
        messageDiv.style.backgroundColor = 'red';
    }
});