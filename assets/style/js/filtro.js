document.addEventListener('DOMContentLoaded', function() {
  // Seleciona os elementos do DOM
  const filterLinks = document.querySelectorAll('.secondary-nav-link');
  const cardsGrid = document.querySelector('.cards-grid');
  const cards = Array.from(document.querySelectorAll('.card'));
  
  // Dados de exemplo para simular a ordenação
  const cardData = [
    { id: 1, votes: 127, price: 150, recent: 3, progress: 30 },
    { id: 2, votes: 103, price: 200, recent: 1, progress: 80 },
    { id: 3, votes: 127, price: 150, recent: 3, progress: 30 },
    { id: 4, votes: 103, price: 200, recent: 1, progress: 80 }
  ];

  // Adiciona os dados como atributos aos cards
  cards.forEach((card, index) => {
    card.dataset.id = cardData[index].id;
    card.dataset.votes = cardData[index].votes;
    card.dataset.price = cardData[index].price;
    card.dataset.recent = cardData[index].recent;
    card.dataset.progress = cardData[index].progress;
  });

  // Função para ordenar os cards
  function sortCards(criteria) {
    // Remove todos os cards do grid
    while (cardsGrid.firstChild) {
      cardsGrid.removeChild(cardsGrid.firstChild);
    }

    // Ordena os cards com base no critério
    let sortedCards = [...cards];
    switch(criteria) {
      case 'votados':
        sortedCards.sort((a, b) => b.dataset.votes - a.dataset.votes);
        break;
      case 'concluidos':
        sortedCards.sort((a, b) => b.dataset.progress - a.dataset.progress);
        break;
      case 'caros':
        sortedCards.sort((a, b) => b.dataset.price - a.dataset.price);
        break;
      case 'recentes':
        sortedCards.sort((a, b) => b.dataset.recent - a.dataset.recent);
        break;
      default:
        // Ordem original
        break;
    }

    // Adiciona os cards ordenados de volta ao grid
    sortedCards.forEach(card => {
      cardsGrid.appendChild(card);
    });
  }

  // Adiciona eventos de clique aos links de filtro
  filterLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Remove a classe active de todos os links
      filterLinks.forEach(l => l.classList.remove('active'));
      
      // Adiciona a classe active ao link clicado
      this.classList.add('active');
      
      // Obtém o critério de ordenação do data-attribute ou do texto
      const filterType = this.dataset.filter || 
                        this.textContent.toLowerCase().replace(' ', '').replace('ç', 'c').replace('ã', 'a');
      
      // Ordena os cards
      sortCards(filterType);
    });
  });

  // Ativa o filtro "Mais Votados" por padrão
  document.querySelector('.secondary-nav-link.active').click();
});