document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('fileInput');
    const form = document.getElementById('uploadForm');
    const statusEl = document.getElementById('status');
  
    // O código abaixo foi removido para evitar a duplicidade.
    // const uploadLabel = document.querySelector('.upload');
    // uploadLabel.addEventListener('click', function() {
    //   fileInput.click();
    // });
  
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const file = fileInput.files[0];
        if (!file) {
            statusEl.textContent = 'Por favor, selecione um arquivo para upload.';
            return;
        }
  
        statusEl.innerHTML = 'Enviando...';
        statusEl.className = '';
  
        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                headers: {
                    'x-vercel-filename': file.name,
                    'Content-Type': file.type,
                },
                body: file,
            });
  
            if (response.ok) {
                const newBlob = await response.json();
                statusEl.textContent = `✅ Upload concluído!`;
                statusEl.className = '';
                form.reset();
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro desconhecido');
            }
        } catch (error) {
            statusEl.textContent = `❌ Erro no upload: ${error.message}`;
            statusEl.className = '';
        }
    });
});