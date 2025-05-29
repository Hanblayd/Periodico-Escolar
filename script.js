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

  // Sistema de etiquetas para noticias
  initializeTagsSystem()

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

  // Poll form submission in home page
  const pollForm = document.getElementById("poll-form")
  if (pollForm) {
    pollForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // Obtener la opción seleccionada
      const selectedOption = document.querySelector('input[name="poll"]:checked')

      if (!selectedOption) {
        alert("Por favor, selecciona una opción")
        return
      }

      const pollId = "home_poll"
      const choice = selectedOption.value

      // Verificar si el usuario ya ha votado
      const hasVoted = localStorage.getItem(`poll_${pollId}_voted`) === "true"

      if (hasVoted) {
        // Solo mostrar resultados si ya votó
        showPollResults(pollId)
        return
      }

      // Guardar la elección del usuario
      localStorage.setItem(`poll_${pollId}_voted`, "true")
      localStorage.setItem(`poll_${pollId}_choice`, choice)

      // Obtener resultados actuales o inicializar
      let results = {}
      try {
        const savedResults = localStorage.getItem(`poll_${pollId}_results`)
        results = savedResults ? JSON.parse(savedResults) : {}
      } catch (e) {
        console.error("Error parsing poll results:", e)
        results = {}
      }

      // Incrementar el contador para la opción seleccionada
      results[choice] = (results[choice] || 0) + 1

      // Guardar resultados actualizados
      localStorage.setItem(`poll_${pollId}_results`, JSON.stringify(results))

      // Mostrar resultados
      showPollResults(pollId)
    })

    // Verificar si el usuario ya ha votado y mostrar resultados
    const pollId = "home_poll"
    const hasVoted = localStorage.getItem(`poll_${pollId}_voted`) === "true"

    if (hasVoted) {
      showPollResults(pollId)
    }
  }

  // Función para mostrar resultados de encuesta
  function showPollResults(pollId) {
    const resultsContainer = document.querySelector(`#poll-form .results`)
    if (!resultsContainer) return

    try {
      const results = JSON.parse(localStorage.getItem(`poll_${pollId}_results`) || "{}")
      const total = Object.values(results).reduce((sum, count) => sum + count, 0)

      if (total === 0) {
        resultsContainer.innerHTML = "<p>No hay votos todavía.</p>"
        resultsContainer.style.display = "block"
        return
      }

      let resultsHTML = "<h4>Resultados:</h4>"

      for (const [option, votes] of Object.entries(results)) {
        const percentage = ((votes / total) * 100).toFixed(1)

        resultsHTML += `
          <div>
            <strong>${option}</strong>: ${votes} votos (${percentage}%)
            <div>
              <div style="width: ${percentage}%"></div>
            </div>
          </div>
        `
      }

      resultsHTML += `<p><strong>Total de votos:</strong> ${total}</p>`

      resultsContainer.innerHTML = resultsHTML
      resultsContainer.style.display = "block"

      // Deshabilitar el botón de votar
      const voteBtn = document.querySelector(`#poll-form .vote-btn`)
      if (voteBtn) {
        voteBtn.disabled = true
        voteBtn.textContent = "Votado"
      }
    } catch (e) {
      console.error("Error showing poll results:", e)
      resultsContainer.innerHTML = "<p>Error al cargar los resultados.</p>"
      resultsContainer.style.display = "block"
    }
  }

  // Manejar encuestas en la página de opinión
  const surveyCards = document.querySelectorAll(".survey-card")
  surveyCards.forEach((card) => {
    const surveyId = card.getAttribute("data-survey")
    const form = card.querySelector("form")
    const resultsContainer = card.querySelector(".results")

    if (form) {
      const voteBtn = form.querySelector(".vote-btn")

      if (voteBtn) {
        voteBtn.addEventListener("click", () => {
          const selectedOption = form.querySelector('input[type="radio"]:checked')

          if (!selectedOption) {
            alert("Por favor, selecciona una opción")
            return
          }

          const choice = selectedOption.value

          // Verificar si el usuario ya ha votado
          const hasVoted = localStorage.getItem(`poll_${surveyId}_voted`) === "true"

          if (hasVoted) {
            // Solo mostrar resultados si ya votó
            showSurveyResults(surveyId, resultsContainer)
            return
          }

          // Guardar la elección del usuario
          localStorage.setItem(`poll_${surveyId}_voted`, "true")
          localStorage.setItem(`poll_${surveyId}_choice`, choice)

          // Obtener resultados actuales o inicializar
          let results = {}
          try {
            const savedResults = localStorage.getItem(`poll_${surveyId}_results`)
            results = savedResults ? JSON.parse(savedResults) : {}
          } catch (e) {
            console.error("Error parsing poll results:", e)
            results = {}
          }

          // Incrementar el contador para la opción seleccionada
          results[choice] = (results[choice] || 0) + 1

          // Guardar resultados actualizados
          localStorage.setItem(`poll_${surveyId}_results`, JSON.stringify(results))

          // Mostrar resultados
          showSurveyResults(surveyId, resultsContainer)
        })
      }

      // Verificar si el usuario ya ha votado y mostrar resultados
      const hasVoted = localStorage.getItem(`poll_${surveyId}_voted`) === "true"

      if (hasVoted && resultsContainer) {
        showSurveyResults(surveyId, resultsContainer)
      }
    }
  })

  // Función para mostrar resultados de encuesta en la página de opinión
  function showSurveyResults(surveyId, resultsContainer) {
    if (!resultsContainer) return

    try {
      const results = JSON.parse(localStorage.getItem(`poll_${surveyId}_results`) || "{}")
      const total = Object.values(results).reduce((sum, count) => sum + count, 0)

      if (total === 0) {
        resultsContainer.innerHTML = "<p>No hay votos todavía.</p>"
        resultsContainer.style.display = "block"
        return
      }

      let resultsHTML = "<h4>Resultados:</h4>"

      for (const [option, votes] of Object.entries(results)) {
        const percentage = ((votes / total) * 100).toFixed(1)

        resultsHTML += `
          <div>
            <strong>${option}</strong>: ${votes} votos (${percentage}%)
            <div>
              <div style="width: ${percentage}%"></div>
            </div>
          </div>
        `
      }

      resultsHTML += `<p><strong>Total de votos:</strong> ${total}</p>`

      resultsContainer.innerHTML = resultsHTML
      resultsContainer.style.display = "block"

      // Deshabilitar el botón de votar
      const voteBtn = resultsContainer.closest(".survey-card").querySelector(".vote-btn")
      if (voteBtn) {
        voteBtn.disabled = true
        voteBtn.textContent = "Votado"
      }
    } catch (e) {
      console.error("Error showing survey results:", e)
      resultsContainer.innerHTML = "<p>Error al cargar los resultados.</p>"
      resultsContainer.style.display = "block"
    }
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
        src: "imagenes deportes/todos los cursos.jpg",
        alt: "Foto en blanco todos",
      },
      {
        src: "imagenes deportes/foto en blanco todos.jpg",
        alt: "Foto en blanco todos",
      },
      {
        src: "imagenes deportes/todos los enfermeros.jpg",
        alt: "Celebración navideña",
      },
      {
        src: "imagenes deportes/todos los generales.jpg",
        alt: "Celebración navideña",
      },
      {
        src: "imagenes deportes/todos los contables.jpg",
        alt: "Celebración navideña",
      },
      {
        src: "imagenes deportes/flor.jpg",
        alt: "Celebración navideña",
      },
      {
        src: "imagenes/eliezer calvo.jpg",
        alt: "Celebración navideña",
      },
      {
        src: "imagenes deportes/mujeres contabilidad.jpg",
        alt: "Celebración navideña",
      },
      {
        src: "imagenes deportes/chica sola.jpg",
        alt: "Celebración navideña",
      },
      {
        src: "imagenes/grupo 3.jpg",
        alt: "Celebración navideña",
      },
      {
        src: "imagenes deportes/carola.jpg",
        alt: "Celebración navideña",
      },
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

  // Inicializar sistema de etiquetas
  function initializeTagsSystem() {
    // Verificar si ya existen etiquetas
    if (!localStorage.getItem("news_tags")) {
      // Crear etiquetas predeterminadas
      const defaultTags = [
        {
          id: "1",
          name: "Noticias",
          description: "Noticias generales del centro",
          newsIds: ["1", "2", "3"],
        },
        {
          id: "2",
          name: "Deportes",
          description: "Eventos y noticias deportivas",
          newsIds: ["4", "5"],
        },
        {
          id: "3",
          name: "Cultura",
          description: "Actividades culturales y artísticas",
          newsIds: ["6"],
        },
        {
          id: "4",
          name: "Eventos",
          description: "Próximos eventos y actividades",
          newsIds: ["7", "8"],
        },
        {
          id: "5",
          name: "Tecnología",
          description: "Noticias relacionadas con tecnología",
          newsIds: ["9"],
        },
      ]

      localStorage.setItem("news_tags", JSON.stringify(defaultTags))
    }

    // Inicializar noticias si no existen
    if (!localStorage.getItem("news_items")) {
      // Recopilar todas las noticias de la página
      const newsItems = []
      let newsId = 1

      // Noticia principal
      const featuredNews = document.querySelector(".featured-news")
      if (featuredNews) {
        const title = featuredNews.querySelector("h2")?.textContent || "Noticia destacada"
        const image = "imagenes deportes/foto en blanco todos.jpg"
        const excerpt = featuredNews.querySelector(".excerpt")?.textContent || ""
        const author = featuredNews.querySelector(".article-meta span")?.textContent || "Equipo Editorial"
        const date = featuredNews.querySelector(".article-meta span:last-child")?.textContent || ""

        newsItems.push({
          id: String(newsId++),
          title,
          image,
          excerpt,
          content: excerpt,
          author,
          date,
          category: "Destacado",
          tags: ["1", "4"], // IDs de las etiquetas
        })
      }

      // Noticias recientes
      document.querySelectorAll(".article-preview").forEach((article) => {
        const title = article.querySelector("h3")?.textContent || ""
        const image = article.querySelector(".article-image img")?.src || ""
        const excerpt = article.querySelector("p")?.textContent || ""
        const author = article.querySelector(".article-meta span")?.textContent || ""
        const date = article.querySelector(".article-meta span:last-child")?.textContent || ""
        const category = article.querySelector(".tag")?.textContent || ""

        // Determinar etiquetas basadas en la categoría
        const tagIds = ["1"] // Por defecto, todas son noticias

        if (category.includes("TECNOLOGÍA")) {
          tagIds.push("5")
        } else if (category.includes("DEPORTES")) {
          tagIds.push("2")
        } else if (category.includes("CULTURA")) {
          tagIds.push("3")
        } else if (category.includes("EVENTOS") || category.includes("Actividades")) {
          tagIds.push("4")
        }

        newsItems.push({
          id: String(newsId++),
          title,
          image,
          excerpt,
          content: excerpt,
          author,
          date,
          category,
          tags: tagIds,
        })
      })

      // Artículos pequeños
      document.querySelectorAll(".small-article").forEach((article) => {
        const title = article.querySelector("h4")?.textContent || ""
        const image = article.querySelector(".small-image img")?.src || ""
        const date = article.querySelector("p")?.textContent || ""

        // Determinar categoría basada en la sección
        let category = "General"
        const tagIds = ["1"]

        const sectionTitle = article.closest(".column")?.querySelector(".section-title")?.textContent

        if (sectionTitle) {
          category = sectionTitle

          if (sectionTitle.includes("DEPORTES")) {
            tagIds.push("2")
          } else if (sectionTitle.includes("CULTURA")) {
            tagIds.push("3")
          } else if (sectionTitle.includes("EVENTOS")) {
            tagIds.push("4")
          }
        }

        newsItems.push({
          id: String(newsId++),
          title,
          image,
          excerpt: "",
          content: "Contenido completo del artículo.",
          author: "Equipo Editorial",
          date,
          category,
          tags: tagIds,
        })
      })

      localStorage.setItem("news_items", JSON.stringify(newsItems))
    }
  }

  // SISTEMA DE MODAL PARA NOTICIAS MEJORADO
  function setupNewsModals() {
    // Crear el overlay del modal una sola vez
    let modalOverlay = document.querySelector(".news-modal-overlay")
    if (!modalOverlay) {
      modalOverlay = document.createElement("div")
      modalOverlay.className = "news-modal-overlay"
      document.body.appendChild(modalOverlay)
    }

    let modalContent = document.querySelector(".news-modal")
    if (!modalContent) {
      modalContent = document.createElement("div")
      modalContent.className = "news-modal"
      modalOverlay.appendChild(modalContent)
    }

    // Cerrar modal al hacer clic en el overlay
    modalOverlay.addEventListener("click", (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.classList.remove("active")
        document.body.style.overflow = ""
      }
    })

    // Añadir botones "Saber más" a todas las noticias
    const addReadMoreButtons = () => {
      // Seleccionar todos los tipos de noticias en la página
      const newsItems = document.querySelectorAll(
        ".noticia-card, .article-preview, .noticia, .evento, .evento2, .small-article, .featured-news",
      )

      newsItems.forEach((item, index) => {
        // Verificar si ya tiene un botón para evitar duplicados
        if (!item.querySelector(".read-more-btn")) {
          const button = document.createElement("button")
          button.className = "read-more-btn"
          button.textContent = "Saber más"
          button.setAttribute("data-news-id", index)

          // Encontrar el contenedor adecuado para el botón según el tipo de noticia
          let container
          if (item.classList.contains("noticia-card")) {
            container = item.querySelector(".noticia-contenido")
          } else if (item.classList.contains("article-preview")) {
            container = item.querySelector(".article-details")
          } else if (item.classList.contains("small-article")) {
            container = item.querySelector("div:last-child")
          } else if (item.classList.contains("evento5")) {
            container = item.querySelector(".evento5-info")
          } else if (item.classList.contains("featured-news")) {
            // Para la noticia principal, añadir después del excerpt
            const excerpt = item.querySelector(".excerpt")
            if (excerpt) {
              container = excerpt.parentNode
              button.style.marginLeft = "var(--spacing-4)"
            } else {
              container = item
            }
          } else {
            // Para otros tipos de noticias
            container = item
          }

          if (container) {
            container.appendChild(button)

            // Añadir evento de clic
            button.addEventListener("click", () => {
              openNewsModal(item)
            })
          }
        }
      })
    }

    // Función para obtener noticias relacionadas reales
    function getRelatedNews(currentNewsId, currentTags) {
      let relatedNews = []

      try {
        // Obtener todas las noticias
        const allNews = JSON.parse(localStorage.getItem("news_items") || "[]")

        // Filtrar noticias que comparten etiquetas pero no son la actual
        const filteredNews = allNews.filter((news) => {
          // No incluir la noticia actual
          if (news.id === currentNewsId) return false

          // Verificar si comparte al menos una etiqueta
          return news.tags && currentTags && news.tags.some((tag) => currentTags.includes(tag))
        })

        // Tomar hasta 3 noticias relacionadas
        relatedNews = filteredNews.slice(0, 3)

        // Si no hay suficientes noticias relacionadas, añadir algunas aleatorias
        if (relatedNews.length < 3) {
          const randomNews = allNews
            .filter((news) => news.id !== currentNewsId && !relatedNews.some((rn) => rn.id === news.id))
            .sort(() => 0.5 - Math.random())
            .slice(0, 3 - relatedNews.length)

          relatedNews = [...relatedNews, ...randomNews]
        }
      } catch (e) {
        console.error("Error getting related news:", e)
      }

      return relatedNews
    }

    // Función para abrir el modal con la noticia
    function openNewsModal(newsItem) {
      // Limpiar el contenido anterior
      modalContent.innerHTML = ""

      // Obtener datos de la noticia
      let title, image, date, author, content, category, newsId, tags

      // Intentar obtener el ID de la noticia
      const newsIndex = newsItem.querySelector(".read-more-btn")?.getAttribute("data-news-id")

      // Buscar la noticia en el almacenamiento
      try {
        const allNews = JSON.parse(localStorage.getItem("news_items") || "[]")
        const storedNews = allNews.find((n) => {
          // Intentar hacer coincidir por título
          return n.title === newsItem.querySelector("h2, h3, h4")?.textContent
        })

        if (storedNews) {
          newsId = storedNews.id
          tags = storedNews.tags
        }
      } catch (e) {
        console.error("Error finding news item:", e)
      }

      // Extraer información según el tipo de noticia
      if (newsItem.classList.contains("noticia-card")) {
        title = newsItem.querySelector(".noticia-titulo").textContent
        image = newsItem.querySelector(".noticia-imagen img").src
        date = newsItem.querySelector(".noticia-fecha").textContent
        content = newsItem.querySelector(".noticia-extracto").textContent
        author = "Equipo Editorial"
        category = newsItem.querySelector(".noticia-categoria")
          ? newsItem.querySelector(".noticia-categoria").textContent
          : "Noticias"
      } else if (newsItem.classList.contains("article-preview")) {
        title = newsItem.querySelector("h3").textContent
        image = newsItem.querySelector(".article-image img").src
        const metaInfo = newsItem.querySelector(".article-meta")
        date = metaInfo ? metaInfo.textContent : "Fecha no disponible"
        content = newsItem.querySelector("p").textContent
        author = metaInfo ? metaInfo.querySelector("span").textContent : "Equipo Editorial"
        category = newsItem.querySelector(".tag") ? newsItem.querySelector(".tag").textContent : "Destacado"
      } else if (newsItem.classList.contains("small-article")) {
        title = newsItem.querySelector("h4").textContent
        image = newsItem.querySelector(".small-image img").src
        date = newsItem.querySelector("p").textContent
        content =
          "Contenido completo de la noticia. Esta es una versión extendida que incluye más detalles sobre el evento o noticia mencionada."
        author = "Equipo Editorial"
        category = newsItem.closest(".column")?.querySelector(".section-title")?.textContent || "Actualidad"
      } else if (newsItem.classList.contains("evento5")) {
        title = newsItem.querySelector("h3").textContent
        image = newsItem.querySelector("img").src
        date = newsItem.querySelector("strong")
          ? newsItem.querySelector("strong").nextSibling.textContent
          : "Fecha próxima"
        content = newsItem.querySelector("p:last-child").textContent
        author = "Equipo de Eventos"
        category = "Eventos"
      } else if (
        newsItem.classList.contains("evento") ||
        newsItem.classList.contains("evento2") ||
        newsItem.classList.contains("noticia")
      ) {
        title = newsItem.querySelector("h3").textContent
        image = newsItem.querySelector("img").src
        content = newsItem.querySelector("p").textContent
        date = "Evento destacado"
        author = "Equipo Editorial"
        category =
          newsItem.classList.contains("evento") || newsItem.classList.contains("evento2") ? "Eventos" : "Deportes"
      } else if (newsItem.classList.contains("featured-news")) {
        title = newsItem.querySelector("h2").textContent
        // Para la noticia destacada, usar la primera imagen de la galería
        const galleryImg = document.querySelector(".featured-gallery .gallery-slide img")
        image = galleryImg ? galleryImg.src : "imagenes deportes/foto en blanco todos.jpg"
        content = newsItem.querySelector(".excerpt").textContent
        const metaInfo = newsItem.querySelector(".article-meta")
        date = metaInfo ? metaInfo.textContent : "Fecha no disponible"
        author = metaInfo ? metaInfo.querySelector("span").textContent : "Equipo Editorial"
        category = "Destacado"
      } else {
        // Valores por defecto
        title = "Noticia destacada"
        image = newsItem.querySelector("img") ? newsItem.querySelector("img").src : "logo/isotipo yoan.png"
        date = "Fecha no disponible"
        content = "Contenido no disponible"
        author = "Equipo Editorial"
        category = "General"
      }

      // Obtener noticias relacionadas reales
      const relatedNews = getRelatedNews(newsId, tags)

      // Crear estructura del modal
      const modalHTML = `
        <button class="news-modal-close">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        
        <div class="news-modal-image-container">
          <img src="${image}" alt="${title}" class="news-modal-image">
        </div>
        
        <h2 class="news-modal-title">${title}</h2>
        
        <div class="news-modal-meta">
          <span>${author}</span>
          <span>•</span>
          <span>${date}</span>
          <span>•</span>
          <span>${category}</span>
        </div>
        
        <div class="news-modal-content">
          <p>${content}</p>
          <p>El evento contó con la participación de estudiantes de todos los grados, quienes demostraron gran entusiasmo y dedicación. Los profesores expresaron su satisfacción por el nivel de compromiso mostrado por los alumnos.</p>
          <p>Esta actividad forma parte de las iniciativas del centro educativo para fomentar la participación y el desarrollo integral de los estudiantes, promoviendo valores como el trabajo en equipo, la creatividad y el espíritu de superación.</p>
          <p>Padres y representantes también estuvieron presentes, apoyando a los estudiantes y reconociendo la labor educativa del centro. La dirección del colegio agradeció la colaboración de toda la comunidad educativa para el éxito de la actividad.</p>
        </div>
        
        <div class="news-modal-footer">
          <div class="news-modal-tags">
            <span class="news-modal-tag">${category}</span>
            <span class="news-modal-tag">Estudiantes</span>
            <span class="news-modal-tag">Educación</span>
          </div>
          
          <div class="news-modal-social">
            <a href="#" class="news-modal-social-icon" title="Compartir en Facebook">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/>
              </svg>
            </a>
            <a href="#" class="news-modal-social-icon" title="Compartir en Twitter">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/>
              </svg>
            </a>
            <a href="#" class="news-modal-social-icon" title="Compartir en Instagram">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.546.453.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"/>
              </svg>
            </a>
          </div>
        </div>
        
        <div class="news-modal-related">
          <h3>Noticias relacionadas</h3>
          <div class="news-modal-related-items">
            ${relatedNews
              .map(
                (news) => `
              <div class="news-modal-related-item">
                <img src="${news.image}" alt="${news.title}">
                <h4>${news.title}</h4>
              </div>
            `,
              )
              .join("")}
          </div>
        </div>
      `

      modalContent.innerHTML = modalHTML

      // Mostrar el modal
      modalOverlay.classList.add("active")
      document.body.style.overflow = "hidden"

      // Añadir evento para cerrar el modal con el botón de cierre
      const closeButton = modalContent.querySelector(".news-modal-close")
      if (closeButton) {
        closeButton.addEventListener("click", () => {
          modalOverlay.classList.remove("active")
          document.body.style.overflow = ""
        })
      }

      // Añadir evento para cerrar el modal con la tecla Escape
      const handleEscape = (e) => {
        if (e.key === "Escape") {
          modalOverlay.classList.remove("active")
          document.body.style.overflow = ""
          document.removeEventListener("keydown", handleEscape)
        }
      }
      document.addEventListener("keydown", handleEscape)

      // Añadir eventos a las noticias relacionadas
      const relatedItems = modalContent.querySelectorAll(".news-modal-related-item")
      relatedItems.forEach((item, index) => {
        item.style.cursor = "pointer"
        item.addEventListener("click", () => {
          // Cerrar el modal actual
          modalOverlay.classList.remove("active")

          // Obtener datos de la noticia relacionada
          const relatedTitle = item.querySelector("h4").textContent
          const relatedImage = item.querySelector("img").src

          // Buscar la noticia en el almacenamiento
          try {
            const allNews = JSON.parse(localStorage.getItem("news_items") || "[]")
            const relatedNews = allNews.find((n) => n.title === relatedTitle)

            if (relatedNews) {
              // Crear un elemento temporal para abrir el modal
              const tempElement = document.createElement("div")
              tempElement.className = "temp-news-item"
              tempElement.innerHTML = `
            <h3>${relatedNews.title}</h3>
            <img src="${relatedNews.image}" alt="${relatedNews.title}">
            <p>${relatedNews.excerpt || relatedNews.content}</p>
            <div class="article-meta">
              <span>${relatedNews.author}</span>
              <span>•</span>
              <span>${relatedNews.date}</span>
            </div>
          `

              // Pequeño retraso para permitir que el modal actual se cierre
              setTimeout(() => {
                openNewsModal(tempElement)
              }, 300)
            }
          } catch (e) {
            console.error("Error opening related news:", e)
          }
        })
      })
    }

    // Llamar a la función para añadir botones
    addReadMoreButtons()
  }

  // Inicializar el sistema de modales para noticias
  setupNewsModals()

  // Asegurarse de que los botones "Saber más" funcionen en todas las páginas, incluida eventos.html
  const saberMasBotones = document.querySelectorAll(".saber-mas-btn, .btn-saber-mas")
  saberMasBotones.forEach((boton) => {
    boton.addEventListener("click", function (e) {
      e.preventDefault()
      const noticiaId = this.getAttribute("data-noticia-id")
      if (noticiaId) {
        abrirModal(noticiaId)
      }
    })
  })

  // Hacer que las noticias relacionadas en el modal sean clickeables
  document.addEventListener("click", (e) => {
    if (e.target.closest(".noticia-relacionada")) {
      const noticiaRelacionada = e.target.closest(".noticia-relacionada")
      const noticiaId = noticiaRelacionada.getAttribute("data-noticia-id")
      if (noticiaId) {
        // Cerrar el modal actual
        document.querySelector(".news-modal-overlay").classList.remove("active")
        // Abrir el nuevo modal
        setTimeout(() => openNewsModal(noticiaRelacionada), 300)
      }
    }
  })
})

// Asegurarse de que la función abrirModal incluya la generación de noticias relacionadas con atributos data-noticia-id
function abrirModal(noticiaId) {
  // Código existente para abrir el modal...

  // Al generar noticias relacionadas, asegurarse de añadir el atributo data-noticia-id
  const noticiasRelacionadasHTML = ""

  // Resto del código existente...
}
