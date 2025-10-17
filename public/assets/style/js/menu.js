document.addEventListener('DOMContentLoaded', async () => {
  const galleryEl = document.getElementById('gallery');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');

  // Função para carregar as imagens
  async function loadGallery() {
      galleryEl.innerHTML = '<p>Carregando imagens...</p>';
      try {
          const response = await fetch('/api/files');
          if (!response.ok) {
              throw new Error('Não foi possível buscar as imagens.');
          }
          const files = await response.json();
          
          galleryEl.innerHTML = '';
          if (files.length === 0) {
              galleryEl.innerHTML = '<p>Nenhuma imagem encontrada.</p>';
              return;
          }

          files.forEach(file => {
              const col = document.createElement('div');
              col.className = 'gallery-item';
              const card = `
                  <div>
                      <a href="${file.url}" target="_blank">
                          <img src="${file.url}" class="gallery-image" alt="${file.pathname}">
                      </a>
                      <div>
                          <p title="${file.pathname}">
                              ${file.pathname.length > 20 ? file.pathname.substring(0, 20) + '...' : file.pathname}
                          </p>
                      </div>
                  </div>`;
              col.innerHTML = card;
              galleryEl.appendChild(col);
          });

          // Chama a função de configuração da navegação APÓS o carregamento das imagens
          setupCarouselNavigation();

      } catch (error) {
          galleryEl.innerHTML = `<p>Erro ao carregar a galeria: ${error.message}</p>`;
      }
  }

  // Função para configurar a navegação do carrossel
  function setupCarouselNavigation() {
      const firstItem = galleryEl.querySelector('.gallery-item');
      if (!firstItem) return;

      // Calcula a quantidade de rolagem: largura de um item + gap
      const scrollAmount = firstItem.offsetWidth + 20;

      nextBtn.addEventListener('click', () => {
          galleryEl.scrollBy({
              left: scrollAmount,
              behavior: 'smooth'
          });
      });
      
      prevBtn.addEventListener('click', () => {
          galleryEl.scrollBy({
              left: -scrollAmount,
              behavior: 'smooth'
          });
      });
  }

  // Inicia o processo de carregamento da galeria
  loadGallery();
});