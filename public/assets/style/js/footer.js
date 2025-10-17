// footer.js
function loadFooter() {
    const footerHTML = `
    <footer>
        <div class="footer-contain">
            <div class="main">
                <img id="logo" src="assets/img/logow.png" alt="Logo">
                <div class="footer-section1">
                    <ul>
                        <li><a href="#main-content">Menu</a></li>
                        <li><a href="index.html#sobre">Sobre</a></li>
                        <li><a href="suporte.html">Suporte</a></li>
                    </ul>
                </div>
                <div class="footer-section1">
                    <ul>
                        <li>15 990000000</li>
                        <li><a href="mailto:emailmelhoretec@email.com">emailmelhoretec@email.com</a></li>
                        <li>Documentação</li>
                    </ul>
                </div>
            </div>
            <hr>
            <div class="footer-section"> 
                <div id="social-icons">
                    <a href="#"><i class="fa-brands fa-facebook-f"></i></a>
                    <a href="#"><i class="fa-brands fa-instagram"></i></a>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy;2025 MelhorETEC. Todos os direitos reservados.</p>
            </div>
        </div>
    </footer>
    `;

    document.body.insertAdjacentHTML('beforeend', footerHTML);
}
document.addEventListener('DOMContentLoaded', loadFooter);