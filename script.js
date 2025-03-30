// Función para formatear la fecha actual en español
function formatCurrentDate() {
    const days = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    
    const now = new Date();
    const dayName = days[now.getDay()];
    const day = now.getDate();
    const month = months[now.getMonth()];
    const year = now.getFullYear();
    
    return `${dayName}, ${day} de ${month} de ${year}`;
}

// Establecer la fecha actual en el encabezado
document.addEventListener('DOMContentLoaded', function() {
    // Mostrar fecha actual
    document.getElementById('current-date').textContent = formatCurrentDate();
    
    // Establecer el año actual en el footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Manejador de tabs
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remover la clase active de todos los botones y contenidos
            tabButtons.forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            
            // Agregar la clase active al botón clickeado
            this.classList.add('active');
            
            // Mostrar el contenido correspondiente
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Manejador del formulario de encuesta
    const pollForm = document.getElementById('poll-form');
    if (pollForm) {
        pollForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const selectedOption = document.querySelector('input[name="poll"]:checked');
            
            if (selectedOption) {
                // Aquí se podría enviar la respuesta a un servidor
                alert(`¡Gracias por tu voto! Has elegido: ${selectedOption.nextElementSibling.textContent}`);
                
                // Desactivar el formulario después de votar
                document.querySelectorAll('input[name="poll"]').forEach(input => {
                    input.disabled = true;
                });
                document.querySelector('#poll-form button').disabled = true;
                document.querySelector('#poll-form button').textContent = '¡Gracias por votar!';
            } else {
                alert('Por favor, selecciona una opción antes de votar.');
            }
        });
    }
    
    // Efecto de hover para artículos
    const articlePreviews = document.querySelectorAll('.article-preview');
    articlePreviews.forEach(article => {
        article.addEventListener('mouseenter', function() {
            this.style.transition = 'transform 0.3s';
            this.style.transform = 'translateY(-5px)';
        });
        
        article.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});