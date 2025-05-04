// Función para formatear la fecha actual en español
function formatCurrentDate() {
  const days = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"]
  const months = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ]

  const now = new Date()
  const dayName = days[now.getDay()]
  const day = now.getDate()
  const month = months[now.getMonth()]
  const year = now.getFullYear()

  return `${dayName}, ${day} de ${month} de ${year}`
}

// Establecer la fecha actual en el encabezado
document.addEventListener("DOMContentLoaded", () => {
  // Mostrar fecha actual
  const currentDateElement = document.getElementById("current-date")
  if (currentDateElement) {
    currentDateElement.textContent = formatCurrentDate()
  }

  // Establecer el año actual en el footer
  const currentYearElement = document.getElementById("current-year")
  if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear()
  }

  // Manejador de tabs
  const tabButtons = document.querySelectorAll(".tab-btn")

  tabButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Remover la clase active de todos los botones y contenidos
      tabButtons.forEach((btn) => btn.classList.remove("active"))
      document.querySelectorAll(".tab-content").forEach((content) => content.classList.remove("active"))

      // Agregar la clase active al botón clickeado
      this.classList.add("active")

      // Mostrar el contenido correspondiente
      const tabId = this.getAttribute("data-tab")
      document.getElementById(tabId).classList.add("active")
    })
  })

  // Manejador del formulario de encuesta
  const pollForm = document.getElementById("poll-form")
  if (pollForm) {
    pollForm.addEventListener("submit", (e) => {
      e.preventDefault()

      const selectedOption = document.querySelector('input[name="poll"]:checked')

      if (selectedOption) {
        // Aquí se podría enviar la respuesta a un servidor
        alert(`¡Gracias por tu voto! Has elegido: ${selectedOption.nextElementSibling.textContent}`)

        // Desactivar el formulario después de votar
        document.querySelectorAll('input[name="poll"]').forEach((input) => {
          input.disabled = true
        })
        document.querySelector("#poll-form button").disabled = true
        document.querySelector("#poll-form button").textContent = "¡Gracias por votar!"
      } else {
        alert("Por favor, selecciona una opción antes de votar.")
      }
    })
  }

  // Efecto de hover para artículos
  const articlePreviews = document.querySelectorAll(".article-preview")
  articlePreviews.forEach((article) => {
    article.addEventListener("mouseenter", function () {
      this.style.transition = "transform 0.3s"
      this.style.transform = "translateY(-5px)"
    })

    article.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0)"
    })
  })

  // Marcar la sección activa en el menú de navegación
  const currentPage = window.location.pathname.split("/").pop() || "index.html"
  const navLinks = document.querySelectorAll(".main-nav a")

  navLinks.forEach((link) => {
    const linkHref = link.getAttribute("href")
    if (linkHref === currentPage) {
      link.classList.add("active")
    }
  })

  // Verificar si hay un usuario con sesión iniciada y actualizar la interfaz
  function checkUserSession() {
    try {
      const localUser = localStorage.getItem("currentUser")
      const sessionUser = sessionStorage.getItem("currentUser")
      let currentUser = null

      if (localUser) {
        currentUser = JSON.parse(localUser)
      } else if (sessionUser) {
        currentUser = JSON.parse(sessionUser)
      }

      if (currentUser) {
        console.log("Usuario con sesión detectado en script.js:", currentUser.email)

        // Actualizar la interfaz
        const authLinks = document.querySelectorAll(".auth-link")
        const userProfileContainer = document.querySelector(".user-profile-container")

        if (authLinks.length > 0 && userProfileContainer) {
          // Ocultar botones de login/registro
          authLinks.forEach((link) => {
            link.style.display = "none"
          })

          // Mostrar el contenedor de perfil
          userProfileContainer.style.display = "block"
        }
      }
    } catch (error) {
      console.error("Error al verificar sesión:", error)
    }
  }

  // Ejecutar verificación de sesión
  checkUserSession()
})
document.querySelectorAll('.vote-btn').forEach((button) => {
  button.addEventListener('click', () => {
    const card = button.closest('.survey-card');
    const inputs = card.querySelectorAll('input[type="radio"]');
    const selected = [...inputs].find((i) => i.checked);

    if (!selected) {
      alert('Selecciona una opción antes de votar.');
      return;
    }

    const opciones = [...inputs].map((i) => i.value);
    const votos = {};
    opciones.forEach((op) => (votos[op] = Math.floor(Math.random() * 5)));
    votos[selected.value] += 1;

    const total = Object.values(votos).reduce((a, b) => a + b, 0);
    const resultsDiv = card.querySelector('.results');
    resultsDiv.innerHTML = opciones
      .map(
        (op) => `
        <div>
          <strong>${op}:</strong> 
          ${((votos[op] / total) * 100).toFixed(1)}%
          <div>
            <div style="background:#4caf50; width:${(votos[op] / total) * 100}%; height:10px;"></div>
          </div>
        </div>
      `
      )
      .join('<br>');

    resultsDiv.style.display = 'block';
    button.disabled = true;
    inputs.forEach((i) => (i.disabled = true));
  });
});
