// Função para salvar os dados do card no localStorage
  function saveCardData(card) {
    const cardData = {
      title: card.dataset.title,
      author: card.dataset.author,
      avatar: card.dataset.avatar,
      avatarColor: card.dataset.avatarColor,
      description: card.dataset.description,
      image: card.dataset.image,
      votes: card.dataset.votes
    };
    
    localStorage.setItem('selectedCard', JSON.stringify(cardData));
  }

  // Configura o clique para todos os cards
  document.querySelectorAll('.card').forEach(card => {
    const arrow = card.querySelector('.card-arrow');
    arrow.addEventListener('click', (e) => {
      e.preventDefault();
      saveCardData(card);
      window.location.href = 'post.html';
    });
  });