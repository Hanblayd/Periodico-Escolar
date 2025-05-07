// Set current date
document.addEventListener("DOMContentLoaded", () => {
  // Set current date
  const currentDateElement = document.getElementById("current-date")
  const currentYearElement = document.getElementById("current-year")

  if (currentDateElement) {
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" }
    const today = new Date()
    currentDateElement.textContent = today.toLocaleDateString("es-ES", options)
  }

  if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear()
  }

  // Tab functionality
  const tabButtons = document.querySelectorAll(".tab-btn")
  const tabContents = document.querySelectorAll(".tab-content")

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Remove active class from all buttons and contents
      tabButtons.forEach((btn) => btn.classList.remove("active"))
      tabContents.forEach((content) => content.classList.remove("active"))

      // Add active class to clicked button
      button.classList.add("active")

      // Show corresponding content
      const tabId = button.getAttribute("data-tab")
      document.getElementById(tabId).classList.add("active")
    })
  })

  // Poll form submission
  const pollForm = document.getElementById("poll-form")
  if (pollForm) {
    pollForm.addEventListener("submit", (e) => {
      e.preventDefault()
      alert("¡Gracias por participar en nuestra encuesta!")
    })
  }

  // Mobile menu toggle - versión corregida
  const menuToggle = document.getElementById("mobile-menu-toggle")
  const mobileMenu = document.querySelector(".mobile-menu")
  const mobileMenuOverlay = document.querySelector(".mobile-menu-overlay")
  const mobileMenuClose = document.querySelector(".mobile-menu-close")

  if (menuToggle && mobileMenu && mobileMenuOverlay) {
    // Asegurarse de que el overlay esté oculto al cargar
    mobileMenuOverlay.style.display = "none"

    menuToggle.addEventListener("click", () => {
      mobileMenu.classList.add("active")
      mobileMenuOverlay.style.display = "block"
      // Pequeño retraso para permitir que el display:block se aplique antes de la transición
      setTimeout(() => {
        mobileMenuOverlay.classList.add("active")
      }, 10)
      document.body.style.overflow = "hidden"
    })

    const closeMenu = () => {
      mobileMenu.classList.remove("active")
      mobileMenuOverlay.classList.remove("active")
      // Esperar a que termine la transición antes de ocultar
      setTimeout(() => {
        mobileMenuOverlay.style.display = "none"
      }, 300)
      document.body.style.overflow = ""
    }

    if (mobileMenuClose) {
      mobileMenuClose.addEventListener("click", closeMenu)
    }

    if (mobileMenuOverlay) {
      mobileMenuOverlay.addEventListener("click", closeMenu)
    }
  }

  // Galería de fotos en la sección destacada
  const featuredGalleryContainer = document.querySelector(".featured-gallery .gallery-container")
  if (featuredGalleryContainer) {
    // Array de imágenes para la galería
    const galleryImages = [
      {
        src: "imagenes deportes/foto en blanco todos.jpg",
        alt: "Foto en blanco todos",
      },
      {
        src: "imagenes/foto en blanco 1.jpeg",
        alt: "Celebración navideña",
      },
      {
        src: "imagenes/foto en blanco 2.jpeg",
        alt: "Celebración navideña",
      },
      {
        src: "imagenes/foto en blanco 3.jpeg",
        alt: "Celebración navideña",
      },
      {
        src: "imagenes/foto en blanco 4.jpeg",
        alt: "Celebración navideña",
      },
      // Puedes agregar o quitar imágenes aquí sin romper la estructura
    ]

    // Limpiar el contenedor
    featuredGalleryContainer.innerHTML = ""

    // Crear slides dinámicamente
    galleryImages.forEach((image) => {
      const slide = document.createElement("div")
      slide.className = "gallery-slide"

      const img = document.createElement("img")
      img.src = image.src
      img.alt = image.alt

      slide.appendChild(img)
      featuredGalleryContainer.appendChild(slide)
    })

    // Crear puntos de navegación dinámicamente
    const dotsContainer = document.querySelector(".featured-gallery .gallery-dots")
    if (dotsContainer) {
      dotsContainer.innerHTML = ""

      galleryImages.forEach((_, index) => {
        const dot = document.createElement("div")
        dot.className = "gallery-dot"
        if (index === 0) dot.classList.add("active")

        dot.addEventListener("click", () => {
          showSlide(index)
          resetSlideInterval() // Reiniciar el temporizador al hacer clic en un punto
        })

        dotsContainer.appendChild(dot)
      })
    }

    const slides = document.querySelectorAll(".featured-gallery .gallery-slide")
    const prevBtn = document.querySelector(".featured-gallery .gallery-prev")
    const nextBtn = document.querySelector(".featured-gallery .gallery-next")
    const dots = document.querySelectorAll(".featured-gallery .gallery-dot")

    let currentSlide = 0
    const slideCount = slides.length
    let slideInterval

    // Función para mostrar un slide específico
    function showSlide(index) {
      if (index < 0) index = slideCount - 1
      if (index >= slideCount) index = 0

      currentSlide = index

      // Actualizar posición de los slides - asegurarse de que todos los slides estén posicionados correctamente
      slides.forEach((slide, i) => {
        // Posicionar cada slide correctamente
        slide.style.transform = `translateX(${100 * (i - currentSlide)}%)`

        // Asegurarse de que todos los slides sean visibles
        slide.style.display = "block"
        slide.style.opacity = "1"
      })

      // Actualizar dots
      dots.forEach((dot, i) => {
        dot.classList.toggle("active", i === currentSlide)
      })
    }

    // Función para reiniciar el temporizador
    function resetSlideInterval() {
      clearInterval(slideInterval)
      slideInterval = setInterval(() => {
        showSlide(currentSlide + 1)
      }, 2500)
    }

    // Inicializar galería
    showSlide(0)
    resetSlideInterval() // Iniciar el temporizador

    // Event listeners para navegación
    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        showSlide(currentSlide - 1)
        resetSlideInterval() // Reiniciar el temporizador al hacer clic en el botón anterior
      })
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        showSlide(currentSlide + 1)
        resetSlideInterval() // Reiniciar el temporizador al hacer clic en el botón siguiente
      })
    }

    // Pausar auto-rotación al hover
    featuredGalleryContainer.addEventListener("mouseenter", () => {
      clearInterval(slideInterval)
    })

    featuredGalleryContainer.addEventListener("mouseleave", () => {
      resetSlideInterval() // Reiniciar el temporizador cuando el mouse sale del contenedor
    })
  }

  // Botón de volver arriba con animación
  const backToTopButton = document.querySelector(".back-to-top")

  if (backToTopButton) {
    // Mostrar/ocultar botón según el scroll
    window.addEventListener("scroll", () => {
      if (window.pageYOffset > 300) {
        backToTopButton.classList.add("visible")
      } else {
        backToTopButton.classList.remove("visible")
      }
    })

    // Scroll suave con animación al hacer clic
    backToTopButton.addEventListener("click", () => {
      // Añadir clase de animación al botón
      backToTopButton.classList.add("scroll-animation")

      // Calcular la duración del scroll basado en la posición actual
      const scrollTop = window.pageYOffset
      const scrollDuration = Math.min(Math.max(scrollTop / 4, 500), 1500) // Entre 500ms y 1500ms

      // Posición inicial
      const startPosition = window.pageYOffset
      const startTime = performance.now()

      // Función de animación
      function scrollAnimation(currentTime) {
        const elapsedTime = currentTime - startTime
        const progress = Math.min(elapsedTime / scrollDuration, 1)

        // Función de easing (suavizado)
        const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1)

        // Calcular nueva posición
        const position = startPosition * (1 - easeInOutCubic(progress))

        window.scrollTo(0, position)

        // Continuar la animación si no ha terminado
        if (progress < 1) {
          requestAnimationFrame(scrollAnimation)
        } else {
          // Quitar la clase de animación cuando termine
          setTimeout(() => {
            backToTopButton.classList.remove("scroll-animation")
          }, 300)
        }
      }

      // Iniciar la animación
      requestAnimationFrame(scrollAnimation)
    })
  }
})

document.querySelectorAll(".vote-btn").forEach((button) => {
  button.addEventListener("click", () => {
    const card = button.closest(".survey-card")
    const inputs = card.querySelectorAll('input[type="radio"]')
    const selected = [...inputs].find((i) => i.checked)

    if (!selected) {
      alert("Selecciona una opción antes de votar.")
      return
    }

    const opciones = [...inputs].map((i) => i.value)
    const votos = {}
    opciones.forEach((op) => (votos[op] = Math.floor(Math.random() * 5)))
    votos[selected.value] += 1

    const total = Object.values(votos).reduce((a, b) => a + b, 0)
    const resultsDiv = card.querySelector(".results")
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
      `,
      )
      .join("<br>")

    resultsDiv.style.display = "block"
    button.disabled = true
    inputs.forEach((i) => (i.disabled = true))
  })
})
