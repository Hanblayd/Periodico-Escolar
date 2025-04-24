document.addEventListener("DOMContentLoaded", () => {
  console.log("Inicializando sistema de autenticación...");

  // SOLUCIÓN DE EMERGENCIA: Verificar si hay un problema de redirección
  const isLoginPage = window.location.pathname.includes("login.html");
  const isRegisterPage = window.location.pathname.includes("registro.html");
  const isVerificationPage = window.location.pathname.includes(
    "verificar-email.html"
  );

  // Si estamos en una página de autenticación, verificamos si hay una bandera para evitar redirección
  if (isLoginPage || isRegisterPage || isVerificationPage) {
    // Si no existe la bandera, la creamos para esta sesión
    if (!sessionStorage.getItem("allowAuthPages")) {
      console.log(
        "Estableciendo bandera para permitir páginas de autenticación"
      );
      sessionStorage.setItem("allowAuthPages", "true");

      // Limpiamos cualquier posible sesión residual que esté causando problemas
      if (!isVerificationPage) {
        // No limpiar en la página de verificación para no perder el email pendiente
        console.log("Limpiando posibles sesiones residuales...");
        localStorage.removeItem("currentUser");
        sessionStorage.removeItem("currentUser");
      }
    }
  }

  // Referencias a elementos del DOM
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");
  const verificationForm = document.getElementById("verification-form");
  const togglePasswordButtons = document.querySelectorAll(".toggle-password");
  const authMessage = document.getElementById("auth-message");
  const authMessageText = document.getElementById("auth-message-text");
  const resendCodeButton = document.getElementById("resend-code");

  // Función para mostrar mensajes de autenticación
  function showAuthMessage(message, type) {
    if (!authMessage || !authMessageText) {
      console.error("Elementos de mensaje no encontrados");
      return;
    }

    authMessageText.textContent = message;
    authMessage.classList.add("show", type);

    setTimeout(() => {
      authMessage.classList.remove("show", type);
    }, 3000);
  }

  // Función para validar email
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Función para validar contraseña
  function isValidPassword(password) {
    return password.length >= 8;
  }

  // Función para evaluar la fortaleza de la contraseña
  function evaluatePasswordStrength(password) {
    let strength = 0;

    // Longitud mínima
    if (password.length >= 8) strength += 1;

    // Contiene números
    if (/\d/.test(password)) strength += 1;

    // Contiene letras minúsculas y mayúsculas
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 1;

    // Contiene caracteres especiales
    if (/[^a-zA-Z0-9]/.test(password)) strength += 1;

    return strength;
  }

  // Función para actualizar el indicador de fortaleza de contraseña
  function updatePasswordStrength(password) {
    const strengthText = document.getElementById("strength-text");
    if (!strengthText) return;

    if (!password) {
      document.querySelectorAll(".strength-segment").forEach((segment) => {
        segment.className = "strength-segment";
      });
      strengthText.textContent = "Seguridad de la contraseña";
      return;
    }

    const strength = evaluatePasswordStrength(password);
    const segments = document.querySelectorAll(".strength-segment");

    // Resetear clases
    segments.forEach((segment) => {
      segment.className = "strength-segment";
    });

    // Aplicar clases según la fortaleza
    if (strength >= 1) {
      segments[0].classList.add("weak");
      strengthText.textContent = "Débil";
    }

    if (strength >= 2) {
      segments[0].classList.add("medium");
      segments[1].classList.add("medium");
      strengthText.textContent = "Media";
    }

    if (strength >= 3) {
      segments[0].classList.add("strong");
      segments[1].classList.add("strong");
      segments[2].classList.add("strong");
      strengthText.textContent = "Fuerte";
    }

    if (strength >= 4) {
      segments.forEach((segment) => {
        segment.classList.add("very-strong");
      });
      strengthText.textContent = "Muy fuerte";
    }
  }

  // Manejar botones de mostrar/ocultar contraseña
  togglePasswordButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const input = this.previousElementSibling;
      const type =
        input.getAttribute("type") === "password" ? "text" : "password";
      input.setAttribute("type", type);

      // Cambiar el ícono
      const eyeIcon = this.querySelector("svg");
      if (type === "text") {
        eyeIcon.innerHTML =
          '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><line x1="1" y1="1" x2="23" y2="23"></line>';
      } else {
        eyeIcon.innerHTML =
          '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>';
      }
    });
  });

  // Manejar formulario de inicio de sesión
  if (loginForm) {
    console.log("Formulario de login detectado");

    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      console.log("Procesando envío de formulario de login");

      // Obtener valores
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const remember =
        document.getElementById("remember") &&
        document.getElementById("remember").checked;

      // Validar email
      if (!isValidEmail(email)) {
        document.getElementById("email-error").textContent =
          "Por favor, ingresa un correo electrónico válido";
        return;
      } else {
        document.getElementById("email-error").textContent = "";
      }

      // Validar contraseña
      if (!password) {
        document.getElementById("password-error").textContent =
          "Por favor, ingresa tu contraseña";
        return;
      } else {
        document.getElementById("password-error").textContent = "";
      }

      // Verificar si el usuario existe en localStorage
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const user = users.find((u) => u.email === email);

      if (!user || user.password !== password) {
        showAuthMessage("Correo electrónico o contraseña incorrectos", "error");
        return;
      }

      // Verificar si el usuario ha verificado su correo electrónico
      if (!user.emailVerified) {
        // Guardar el email en sessionStorage para la página de verificación
        sessionStorage.setItem("pendingVerification", email);

        showAuthMessage(
          "Por favor, verifica tu correo electrónico primero",
          "error"
        );

        // Redireccionar a la página de verificación
        setTimeout(() => {
          window.location.href = "verificar-email.html";
        }, 2000);

        return;
      }

      // Guardar sesión si "recordarme" está marcado
      if (remember) {
        localStorage.setItem(
          "currentUser",
          JSON.stringify({
            email: user.email,
            nombre: user.nombre,
            apellido: user.apellido,
            tipoUsuario: user.tipoUsuario,
          })
        );
      } else {
        sessionStorage.setItem(
          "currentUser",
          JSON.stringify({
            email: user.email,
            nombre: user.nombre,
            apellido: user.apellido,
            tipoUsuario: user.tipoUsuario,
          })
        );
      }

      // Eliminar la bandera de permitir páginas de autenticación
      sessionStorage.removeItem("allowAuthPages");

      // Mostrar mensaje de éxito
      showAuthMessage("¡Inicio de sesión exitoso! Redirigiendo...", "success");

      // Redireccionar después de 2 segundos
      setTimeout(() => {
        window.location.href = "index.html";
      }, 2000);
    });
  }

  // Manejar formulario de registro
  if (registerForm) {
    console.log("Formulario de registro detectado");

    // Actualizar fortaleza de contraseña en tiempo real
    const passwordInput = document.getElementById("password-register");
    if (passwordInput) {
      passwordInput.addEventListener("input", function () {
        updatePasswordStrength(this.value);
      });
    }

    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      console.log("Procesando envío de formulario de registro");

      // Obtener valores
      const nombre = document.getElementById("nombre").value;
      const apellido = document.getElementById("apellido").value;
      const email = document.getElementById("email-register").value;
      const password = document.getElementById("password-register").value;
      const confirmPassword = document.getElementById("confirm-password").value;
      const tipoUsuario = document.getElementById("tipo-usuario").value;
      const terminos = document.getElementById("terminos").checked;

      let isValid = true;

      // Validar nombre
      if (!nombre) {
        document.getElementById("nombre-error").textContent =
          "Por favor, ingresa tu nombre";
        isValid = false;
      } else {
        document.getElementById("nombre-error").textContent = "";
      }

      // Validar apellido
      if (!apellido) {
        document.getElementById("apellido-error").textContent =
          "Por favor, ingresa tu apellido";
        isValid = false;
      } else {
        document.getElementById("apellido-error").textContent = "";
      }

      // Validar email
      if (!isValidEmail(email)) {
        document.getElementById("email-register-error").textContent =
          "Por favor, ingresa un correo electrónico válido";
        isValid = false;
      } else {
        document.getElementById("email-register-error").textContent = "";
      }

      // Validar contraseña
      if (!isValidPassword(password)) {
        document.getElementById("password-register-error").textContent =
          "La contraseña debe tener al menos 8 caracteres";
        isValid = false;
      } else {
        document.getElementById("password-register-error").textContent = "";
      }

      // Validar confirmación de contraseña
      if (password !== confirmPassword) {
        document.getElementById("confirm-password-error").textContent =
          "Las contraseñas no coinciden";
        isValid = false;
      } else {
        document.getElementById("confirm-password-error").textContent = "";
      }

      // Validar tipo de usuario
      if (!tipoUsuario) {
        document.getElementById("tipo-usuario-error").textContent =
          "Por favor, selecciona un tipo de usuario";
        isValid = false;
      } else {
        document.getElementById("tipo-usuario-error").textContent = "";
      }

      // Validar términos y condiciones
      if (!terminos) {
        document.getElementById("terminos-error").textContent =
          "Debes aceptar los términos y condiciones";
        isValid = false;
      } else {
        document.getElementById("terminos-error").textContent = "";
      }

      if (!isValid) return;

      // Verificar si el correo ya está registrado
      const users = JSON.parse(localStorage.getItem("users")) || [];
      if (users.some((user) => user.email === email)) {
        showAuthMessage("Este correo electrónico ya está registrado", "error");
        return;
      }

      // Generar código de verificación (en un sistema real, esto se enviaría por correo)
      const verificationCode = "12345"; // Código fijo para demostración

      // Guardar nuevo usuario con estado de verificación pendiente
      users.push({
        nombre,
        apellido,
        email,
        password,
        tipoUsuario,
        fechaRegistro: new Date().toISOString(),
        emailVerified: false,
        verificationCode: verificationCode,
      });

      localStorage.setItem("users", JSON.stringify(users));

      // Guardar el email en sessionStorage para la página de verificación
      sessionStorage.setItem("pendingVerification", email);

      // Mostrar mensaje de éxito
      showAuthMessage(
        "¡Registro exitoso! Redirigiendo a verificación de correo...",
        "success"
      );

      // Redireccionar a la página de verificación
      setTimeout(() => {
        window.location.href = "verificar-email.html";
      }, 2000);
    });
  }

  // Manejar formulario de verificación de correo
  if (verificationForm) {
    console.log("Formulario de verificación detectado");

    // Obtener el email pendiente de verificación
    const pendingEmail = sessionStorage.getItem("pendingVerification");

    // Si no hay email pendiente, redirigir al registro
    if (!pendingEmail) {
      console.log(
        "No hay email pendiente de verificación, redirigiendo a registro"
      );
      window.location.href = "registro.html";
      return;
    }

    // Mostrar el email en la página
    const userEmailElement = document.getElementById("user-email");
    if (userEmailElement) {
      userEmailElement.textContent = pendingEmail;
    }

    // Manejar la entrada de código de verificación
    const digitInputs = document.querySelectorAll(".verification-digit");

    // Auto-avanzar al siguiente campo cuando se ingresa un dígito
    digitInputs.forEach((input, index) => {
      input.addEventListener("input", function () {
        if (this.value.length === 1) {
          if (index < digitInputs.length - 1) {
            digitInputs[index + 1].focus();
          }
        }
      });

      // Permitir retroceder con la tecla de borrar
      input.addEventListener("keydown", function (e) {
        if (e.key === "Backspace" && this.value.length === 0 && index > 0) {
          digitInputs[index - 1].focus();
        }
      });
    });

    // Manejar el envío del formulario de verificación
    verificationForm.addEventListener("submit", (e) => {
      e.preventDefault();
      console.log("Procesando verificación de código");

      // Obtener el código ingresado
      let enteredCode = "";
      digitInputs.forEach((input) => {
        enteredCode += input.value;
      });

      // Validar que se haya ingresado un código completo
      if (enteredCode.length !== 5) {
        document.getElementById("verification-error").textContent =
          "Por favor, ingresa el código completo";
        return;
      }

      // Obtener usuarios y verificar el código
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const userIndex = users.findIndex((user) => user.email === pendingEmail);

      if (userIndex === -1) {
        // Usuario no encontrado
        document.getElementById("verification-error").textContent =
          "Usuario no encontrado. Por favor, regístrate nuevamente.";
        return;
      }

      const user = users[userIndex];

      // Verificar el código (en un sistema real, esto sería más seguro)
      if (enteredCode === user.verificationCode) {
        // Actualizar el estado de verificación del usuario
        users[userIndex].emailVerified = true;
        localStorage.setItem("users", JSON.stringify(users));

        // Mostrar mensaje de éxito
        showAuthMessage(
          "¡Correo verificado con éxito! Redirigiendo al inicio de sesión...",
          "success"
        );

        // Limpiar el email pendiente de verificación
        sessionStorage.removeItem("pendingVerification");

        // Eliminar la bandera de permitir páginas de autenticación
        sessionStorage.removeItem("allowAuthPages");

        // Redireccionar al inicio de sesión
        setTimeout(() => {
          window.location.href = "login.html";
        }, 2000);
      } else {
        // Código incorrecto
        document.getElementById("verification-error").textContent =
          "Código de verificación incorrecto. Inténtalo de nuevo.";
      }
    });

    // Manejar el reenvío de código
    if (resendCodeButton) {
      resendCodeButton.addEventListener("click", (e) => {
        e.preventDefault();

        // En un sistema real, aquí se enviaría un nuevo código por correo
        // Para esta demostración, simplemente mostramos un mensaje

        showAuthMessage(
          "Se ha reenviado un nuevo código a tu correo electrónico",
          "success"
        );
      });
    }
  }

  // Verificar si hay un usuario con sesión iniciada
  function getUserFromStorage() {
    try {
      const localUser = localStorage.getItem("currentUser");
      const sessionUser = sessionStorage.getItem("currentUser");

      if (localUser) {
        return JSON.parse(localUser);
      } else if (sessionUser) {
        return JSON.parse(sessionUser);
      }
      return null;
    } catch (error) {
      console.error("Error al obtener usuario del almacenamiento:", error);
      // Limpiar datos corruptos
      localStorage.removeItem("currentUser");
      sessionStorage.removeItem("currentUser");
      return null;
    }
  }

  const currentUser = getUserFromStorage();
  console.log(
    "Estado de sesión:",
    currentUser ? "Usuario con sesión" : "Sin sesión"
  );

  // Si hay un usuario con sesión y estamos en una página de autenticación
  if (currentUser && (isLoginPage || isRegisterPage || isVerificationPage)) {
    // Solo redirigir si no tenemos la bandera que permite páginas de autenticación
    if (!sessionStorage.getItem("allowAuthPages")) {
      console.log(
        "Redirigiendo a index.html desde página de autenticación (usuario con sesión)"
      );
      window.location.href = "index.html";
    } else {
      console.log(
        "Permitiendo acceso a página de autenticación a pesar de tener sesión (bandera presente)"
      );
    }
  }

  // IMPORTANTE: Actualizar la interfaz para mostrar que el usuario ha iniciado sesión
  if (currentUser) {
    console.log("Actualizando interfaz para usuario con sesión:", currentUser);

    // Seleccionar elementos de la interfaz
    const authLinks = document.querySelectorAll(".auth-link");
    const userProfileContainer = document.querySelector(
      ".user-profile-container"
    );

    console.log("Elementos encontrados:", {
      authLinks: authLinks.length,
      userProfileContainer: userProfileContainer ? "Sí" : "No",
    });

    // Ocultar los enlaces de autenticación y mostrar el icono de perfil
    if (authLinks.length > 0 && userProfileContainer) {
      // Ocultar botones de login/registro
      authLinks.forEach((link) => {
        link.style.display = "none";
      });

      // Mostrar el contenedor de perfil
      userProfileContainer.style.display = "block";

      // Limpiar cualquier contenido previo
      userProfileContainer.innerHTML = `
        <div class="user-avatar">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
        </div>
      `;

      // Crear el menú desplegable
      const dropdown = document.createElement("div");
      dropdown.className = "user-dropdown";
      dropdown.innerHTML = `
        <div class="user-dropdown-header">
          <div class="user-info">
            <div class="user-info-avatar">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            </div>
            <div class="user-info-details">
              <div class="user-info-name">${currentUser.nombre} ${currentUser.apellido}</div>
              <div class="user-info-email">${currentUser.email}</div>
            </div>
          </div>
        </div>
        <div class="user-dropdown-menu">
          <a href="#" class="user-dropdown-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            Mi perfil
          </a>
          <a href="#" class="user-dropdown-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
            Subir una noticia
          </a>
          <a href="#" class="user-dropdown-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
            Configuración de la cuenta
          </a>
          <a href="#" class="user-dropdown-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg>
            Mis publicaciones
          </a>
          <div class="user-dropdown-divider"></div>
          <div class="user-dropdown-footer">
            <div class="logout-btn" id="logout-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
              Cerrar sesión
            </div>
          </div>
        </div>
      `;

      // Agregar el dropdown al contenedor de perfil
      userProfileContainer.appendChild(dropdown);

      // Manejar clic en el avatar para mostrar/ocultar el dropdown
      userProfileContainer.addEventListener("click", (e) => {
        e.stopPropagation();
        dropdown.classList.toggle("show");
      });

      // Manejar cierre de sesión
      const logoutBtn = document.getElementById("logout-btn");
      if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
          console.log("Cerrando sesión...");
          localStorage.removeItem("currentUser");
          sessionStorage.removeItem("currentUser");
          sessionStorage.removeItem("allowAuthPages");
          window.location.reload();
        });
      }

      // Cerrar dropdown al hacer clic fuera de él
      document.addEventListener("click", (e) => {
        if (!userProfileContainer.contains(e.target)) {
          dropdown.classList.remove("show");
        }
      });
    } else {
      console.warn(
        "No se encontraron elementos necesarios para actualizar la interfaz:",
        {
          "authLinks encontrados": authLinks.length,
          "userProfileContainer encontrado": !!userProfileContainer,
        }
      );
    }
  } else {
    console.log("Interfaz en modo sin sesión");
  }
});
