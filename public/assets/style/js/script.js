document.addEventListener('DOMContentLoaded', function() {
    const signInForm = document.getElementById('signinForm');
    const signUpForm = document.getElementById('signupForm');
    const showSignIn = document.getElementById('showSignIn');
    const showSignUp = document.getElementById('showSignUp');
    const signInButton = document.getElementById('signInButton');

    // Mostrar formulário de login
    signInButton.addEventListener('click', function() {
      signUpForm.style.display = 'none';
      signInForm.style.display = 'block';
    });

    // Mostrar formulário de cadastro
    showSignUp.addEventListener('click', function(e) {
      e.preventDefault();
      signInForm.style.display = 'none';
      signUpForm.style.display = 'block';
    });

    // Voltar para o login
    showSignIn.addEventListener('click', function(e) {
      e.preventDefault();
      signUpForm.style.display = 'none';
      signInForm.style.display = 'block';
    });
  });