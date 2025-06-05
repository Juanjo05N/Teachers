// Variables globales
let currentCourse = null;
let currentUser = null;
let currentCareer = null;

// Inicializar usuarios por defecto
let users = JSON.parse(localStorage.getItem("usuarios") || "{}");

if (!users["admin"]) {
  users["admin"] = "admin123";
  localStorage.setItem("usuarios", JSON.stringify(users));
}

// Login functionality
document.getElementById("login-form").onsubmit = function (e) {
  e.preventDefault();
  const username = document.getElementById("login-username").value.trim();
  const password = document.getElementById("login-password").value;

  let users = JSON.parse(localStorage.getItem("usuarios") || "{}");

  if (!users[username]) {
    if (username === "admin") {
      document.getElementById("login-error").textContent =
        "No puedes registrar el usuario 'admin'.";
      document.getElementById("login-error").style.display = "block";
      return;
    }

    // Registro automático
    users[username] = password;
    localStorage.setItem("usuarios", JSON.stringify(users));
    currentUser = username;
    localStorage.setItem("usuarioActivo", username);
    document.getElementById(
      "user-display"
    ).textContent = `Usuario: ${username}`;
    showCareerSection();
  } else if (users[username] !== password) {
    document.getElementById("login-error").textContent =
      "Contraseña incorrecta.";
    document.getElementById("login-error").style.display = "block";
  } else {
    currentUser = username;
    localStorage.setItem("usuarioActivo", username);
    document.getElementById("user-display").innerHTML =
      username === "admin"
        ? `<span class="admin-name">Administrador</span>`
        : `Usuario: ${username}`;

    showCareerSection();
  }
};

// Show career selection section
function showCareerSection() {
  document.getElementById("login-section").classList.add("hidden");
  document.getElementById("career-section").classList.remove("hidden");
  document.getElementById("main-section").classList.add("hidden");
}

// Show main section (curriculum)
function showMainSection(careerName) {
  document.getElementById("login-section").classList.add("hidden");
  document.getElementById("career-section").classList.add("hidden");
  document.getElementById("main-section").classList.remove("hidden");

  // Update career title and user display in main section
  document.getElementById(
    "career-title"
  ).textContent = `Evaluación de Profesores - ${careerName}`;
  document.getElementById("user-display-main").innerHTML =
    currentUser === "admin"
      ? `<span class="admin-name">Administrador</span>`
      : `Usuario: ${currentUser}`;
}

// Logout functionality
function setupLogoutButtons() {
  document.getElementById("logout-button").addEventListener("click", logout);
  document
    .getElementById("logout-button-main")
    .addEventListener("click", logout);
}

function logout() {
  localStorage.removeItem("usuarioActivo");
  currentUser = null;
  currentCareer = null;
  currentCourse = null;

  // Reset form
  document.getElementById("login-form").reset();
  document.getElementById("login-error").style.display = "none";

  // Show login section
  document.getElementById("main-section").classList.add("hidden");
  document.getElementById("career-section").classList.add("hidden");
  document.getElementById("login-section").classList.remove("hidden");

  // Close any open modals
  closeModal();
  closePeek();
}

// Career loading functionality
function loadCareer(career) {
  currentCareer = career;
  const modal = document.getElementById("careerModal");
  const modalBody = document.getElementById("modalBody");

  if (career === "civil") {
    modalBody.innerHTML = `
      <h3>Ingeniería Civil</h3>
      <div class="malla-container">
        <img src="assets/civil_malla.jpg" alt="Mapa Ingeniería Civil">
        
        <!-- Materias clickeables con coordenadas aproximadas -->
        <div class="materia" style="top: 115px; left: 15px;" data-course="calculo-diferencial"></div>
        <div class="materia" style="top: 205px; left: 15px;" data-course="geometria"></div>
        <div class="materia" style="top: 295px; left: 15px;" data-course="biologia-i"></div>
        <div class="materia" style="top: 383px; left: 15px;" data-course="quimica-general"></div>
        <div class="materia" style="top: 472px; left: 15px;" data-course="programacion"></div>
        <div class="materia" style="top: 650px; left: 15px;" data-course="comunicacion-ciencia"></div>
        <div class="materia" style="top: 740px; left: 15px;" data-course="introduccion-ingenieria"></div>
      </div>
    `;

    // Activar clics en las materias
    setTimeout(() => {
      document.querySelectorAll(".materia").forEach((materia) => {
        materia.addEventListener("click", () => {
          const courseName = getCourseDisplayName(materia.dataset.course);
          currentCourse = materia.dataset.course;
          closeModal();
          showMainSection("Ingeniería Civil");

          // Crear curriculum dinámico para esta carrera
          createCurriculumForCareer("civil");

          // Abrir directamente la evaluación de profesores para esta materia
          setTimeout(() => {
            showProfessorsForCourse(currentCourse);
          }, 100);
        });
      });
    }, 0);
  } else if (career === "sistemas") {
    modalBody.innerHTML = `
      <h3>Ingeniería de Sistemas</h3>
      <div class="malla-container">
        <p>Malla curricular de Ingeniería de Sistemas próximamente...</p>
        <!-- Aquí puedes agregar la malla de sistemas cuando esté disponible -->
        <div style="margin-top: 20px;">
          <div class="course" data-course="programacion-basica" style="display: inline-block; margin: 10px; padding: 15px; background: #cce5ff; border-radius: 8px; cursor: pointer;">
            Programación Básica
          </div>
          <div class="course" data-course="estructuras-datos" style="display: inline-block; margin: 10px; padding: 15px; background: #cce5ff; border-radius: 8px; cursor: pointer;">
            Estructuras de Datos
          </div>
        </div>
      </div>
    `;

    // Activar clics para sistemas
    setTimeout(() => {
      modalBody.querySelectorAll(".course").forEach((course) => {
        course.addEventListener("click", () => {
          currentCourse = course.dataset.course;
          closeModal();
          showMainSection("Ingeniería de Sistemas");
          createCurriculumForCareer("sistemas");
          setTimeout(() => {
            showProfessorsForCourse(currentCourse);
          }, 100);
        });
      });
    }, 0);
  } else {
    modalBody.innerHTML = `
      <h3>Carrera no disponible</h3>
      <p>Esta carrera estará disponible próximamente.</p>
    `;
  }

  // Mostrar el modal
  modal.style.display = "block";
}

// Crear curriculum dinámico basado en la carrera
function createCurriculumForCareer(career) {
  const curriculum = document.getElementById("curriculum");

  if (career === "civil") {
    curriculum.innerHTML = `
      <div class="course" data-course="calculo-diferencial">Cálculo Diferencial</div>
      <div class="course" data-course="geometria">Geometría</div>
      <div class="course" data-course="biologia-i">Biología I</div>
      <div class="course" data-course="quimica-general">Química General e Inorgánica</div>
      <div class="course" data-course="programacion">Fundamentos de Programación</div>
      <div class="course" data-course="comunicacion-ciencia">Comunicación y Ciencia</div>
      <div class="course" data-course="introduccion-ingenieria">Introducción a la Ingeniería</div>
    `;
  } else if (career === "sistemas") {
    curriculum.innerHTML = `
      <div class="course" data-course="programacion-basica">Programación Básica</div>
      <div class="course" data-course="estructuras-datos">Estructuras de Datos</div>
    `;
  }

  // Agregar event listeners a las materias
  curriculum.querySelectorAll(".course").forEach((course) => {
    course.addEventListener("click", () => {
      currentCourse = course.dataset.course;
      showProfessorsForCourse(currentCourse);
    });
  });
}

// Obtener nombre legible de la materia
function getCourseDisplayName(courseId) {
  const courseNames = {
    "calculo-diferencial": "Cálculo Diferencial",
    geometria: "Geometría",
    "biologia-i": "Biología I",
    "quimica-general": "Química General e Inorgánica",
    programacion: "Fundamentos de Programación",
    "comunicacion-ciencia": "Comunicación y Ciencia",
    "introduccion-ingenieria": "Introducción a la Ingeniería",
    "programacion-basica": "Programación Básica",
    "estructuras-datos": "Estructuras de Datos",
  };

  return courseNames[courseId] || courseId.replace("-", " ");
}

// Modal control functions
function closeModal() {
  const modal = document.getElementById("careerModal");
  modal.style.display = "none";
}

// Center peek functionality
const peek = document.getElementById("center-peek");
const peekBody = document.getElementById("peek-body");
const peekClose = document.querySelector(".peek-close");

peekClose.onclick = closePeek;

function closePeek() {
  peek.classList.add("hidden");
  peekBody.innerHTML = "";
}

function showProfessorsForCourse(courseId) {
  const allData = JSON.parse(localStorage.getItem("evaluaciones") || "{}");
  const evaluations = allData[courseId] || [];

  const grouped = {};
  evaluations.forEach((e) => {
    if (!grouped[e.profesor]) grouped[e.profesor] = [];
    grouped[e.profesor].push(e);
  });

  const courseName = getCourseDisplayName(courseId);

  peekBody.innerHTML = `
    <h2>Profesores de ${courseName}</h2>
    <button onclick="newProfessorForm()" style="float: right; margin-bottom: 20px;">+ Nuevo Profesor</button>
    <div style="clear: both; margin-top: 20px;"></div>`;

  Object.entries(grouped).forEach(([prof, evals]) => {
    const avg =
      evals.reduce((sum, e) => sum + e.calificacion, 0) / evals.length;
    const stars = getStarsHTML(avg);

    const profBox = document.createElement("div");
    profBox.innerHTML = `
      <div style="padding:15px; border:1px solid #ccc; border-radius:8px; margin-bottom:15px; cursor:pointer; transition: box-shadow 0.2s;">
        <strong style="font-size:20px;">${prof}</strong>
        <div style="margin-top: 8px;">${stars} (${avg.toFixed(1)}/5)</div>
      </div>
    `;
    profBox.onclick = () => viewProfessorDetails(prof);
    profBox.onmouseover = () =>
      (profBox.firstElementChild.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)");
    profBox.onmouseout = () =>
      (profBox.firstElementChild.style.boxShadow = "none");
    peekBody.appendChild(profBox);
  });

  peek.classList.remove("hidden");
}

function getStarsHTML(score) {
  const fullStars = Math.floor(score);
  const halfStar = score % 1 >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;

  let html = "";

  for (let i = 0; i < fullStars; i++) {
    html += '<span class="star full">★</span>';
  }
  if (halfStar) {
    html += '<span class="star half">★</span>';
  }
  for (let i = 0; i < emptyStars; i++) {
    html += '<span class="star empty">★</span>';
  }

  return `<span class="stars">${html}</span>`;
}

function setPeekHeader(title, showBackArrow = true) {
  const headerHTML = `
    <div class="peek-header">
      ${
        showBackArrow
          ? `<span class="back-arrow" onclick="showProfessorsForCourse(currentCourse)">← Volver</span>`
          : `<span></span>`
      }
      <h2 style="margin: 0;">${title}</h2>
      <span></span>
    </div>
  `;
  return headerHTML;
}

function newProfessorForm() {
  const allData = JSON.parse(localStorage.getItem("evaluaciones") || "{}");
  const evaluations = allData[currentCourse] || [];

  // Para verificar nombres duplicados (ignorando mayúsculas/minúsculas)
  const nombresExistentes = evaluations.map((e) => e.profesor.toLowerCase());

  peekBody.innerHTML = `
  ${setPeekHeader("Nuevo Profesor")}
  <form id="nuevo-profesor-form">
    <label>Nombre del Profesor:</label>
    <input type="text" id="nuevo-nombre" required />

    <label>Calificación (1-5):</label>
    <select id="nuevo-calificacion" required>
      <option value="">Selecciona</option>
      <option value="1">1 - Muy Malo</option>
      <option value="2">2 - Malo</option>
      <option value="3">3 - Regular</option>
      <option value="4">4 - Bueno</option>
      <option value="5">5 - Excelente</option>
    </select>

    <label>Comentario:</label>
    <textarea id="nuevo-comentario" rows="4"></textarea>

    <button type="submit">Guardar Profesor</button>
  </form>
`;

  const form = document.getElementById("nuevo-profesor-form");
  form.onsubmit = (e) => {
    e.preventDefault();
    const nombre = document.getElementById("nuevo-nombre").value.trim();
    const calificacion = parseInt(
      document.getElementById("nuevo-calificacion").value
    );
    const comentario = document.getElementById("nuevo-comentario").value.trim();

    if (nombresExistentes.includes(nombre.toLowerCase())) {
      alert("Este profesor ya está agregado en esta materia.");
      return;
    }

    // Guardar
    const nuevaEvaluacion = {
      profesor: nombre,
      calificacion,
      comentario,
      usuario: currentUser,
    };

    if (!allData[currentCourse]) {
      allData[currentCourse] = [];
    }

    allData[currentCourse].push(nuevaEvaluacion);
    localStorage.setItem("evaluaciones", JSON.stringify(allData));

    alert("¡Profesor agregado exitosamente!");
    showProfessorsForCourse(currentCourse); // Volver a lista
  };
}

function calificarProfesor(nombreProfesor) {
  const allData = JSON.parse(localStorage.getItem("evaluaciones") || "{}");
  const cursoData = allData[currentCourse] || [];

  const yaEvaluo = cursoData.some(
    (e) =>
      e.profesor.toLowerCase() === nombreProfesor.toLowerCase() &&
      e.usuario === currentUser
  );

  if (yaEvaluo) {
    alert("Ya has evaluado a este profesor en esta materia.");
    return;
  }

  peekBody.innerHTML = `
    ${setPeekHeader("Calificar a " + nombreProfesor)}
    <form id="calificar-profesor-form">
      <label>Nombre del Profesor:</label>
      <input type="text" id="calificar-nombre" value="${nombreProfesor}" disabled />

      <label>Calificación (1-5):</label>
      <select id="calificar-calificacion" required>
        <option value="">Selecciona</option>
        <option value="1">1 - Muy Malo</option>
        <option value="2">2 - Malo</option>
        <option value="3">3 - Regular</option>
        <option value="4">4 - Bueno</option>
        <option value="5">5 - Excelente</option>
      </select>

      <label>Comentario:</label>
      <textarea id="calificar-comentario" rows="4"></textarea>

      <button type="submit">Enviar Evaluación</button>
    </form>
  `;

  document
    .getElementById("calificar-profesor-form")
    .addEventListener("submit", (e) => {
      e.preventDefault();

      const calificacion = parseInt(
        document.getElementById("calificar-calificacion").value
      );
      const comentario = document.getElementById("calificar-comentario").value;

      const allData = JSON.parse(localStorage.getItem("evaluaciones") || "{}");
      const cursoData = allData[currentCourse] || [];

      cursoData.push({
        profesor: nombreProfesor,
        calificacion,
        comentario,
        usuario: currentUser,
      });

      allData[currentCourse] = cursoData;
      localStorage.setItem("evaluaciones", JSON.stringify(allData));

      alert("¡Gracias por tu evaluación!");
      showProfessorsForCourse(currentCourse);
    });

  peek.classList.remove("hidden");
}

function eliminarReseña(curso, profesor, index) {
  if (!confirm("¿Estás seguro de que deseas eliminar esta reseña?")) return;

  const data = JSON.parse(localStorage.getItem("evaluaciones") || "{}");
  const cursoData = data[curso] || [];

  const nuevas = cursoData.filter((e, i) => {
    const esEste = i === index && e.profesor === profesor;
    return !esEste;
  });

  data[curso] = nuevas;
  localStorage.setItem("evaluaciones", JSON.stringify(data));
  viewProfessorDetails(profesor);
}

function viewProfessorDetails(nombreProfesor) {
  const allData = JSON.parse(localStorage.getItem("evaluaciones") || "{}");
  const evaluations = allData[currentCourse] || [];

  const delProfesor = evaluations.filter(
    (e) => e.profesor.toLowerCase() === nombreProfesor.toLowerCase()
  );

  const promedio =
    delProfesor.reduce((sum, e) => sum + e.calificacion, 0) /
    delProfesor.length;
  const estrellas = getStarsHTML(promedio);

  peekBody.innerHTML = `
  ${setPeekHeader(nombreProfesor)}
  <div class="peek-header">
    <span></span>
    <button onclick="calificarProfesor('${nombreProfesor.replace(
      /'/g,
      "\\'"
    )}')" style="background: #28a745; color: white; border: none; padding: 10px 15px; border-radius: 6px; cursor: pointer;">+ Calificar Profesor</button>
  </div>
  <p><strong>Promedio:</strong> ${estrellas} (${promedio.toFixed(1)}/5)</p>
  <hr />
  <div id="comentarios-lista">
    ${delProfesor
      .map(
        (e, index) => `
<div style="border: 1px solid #ccc; padding: 15px; border-radius: 8px; margin-bottom: 15px; position: relative;">
  <strong>Calificación:</strong> ${getStarsHTML(e.calificacion)} (${
          e.calificacion
        }/5)<br />
  <strong>Comentario:</strong> ${e.comentario || "(Sin comentario)"}
  ${
    currentUser === "admin"
      ? `<button onclick="eliminarReseña('${currentCourse}', '${nombreProfesor}', ${evaluations.indexOf(
          e
        )})" style="position: absolute; top: 10px; right: 10px; background-color: #dc3545; color: white; border: none; border-radius: 4px; padding: 6px 8px; cursor: pointer;">🗑️</button>`
      : ""
  }
</div>
    `
      )
      .join("")}
  </div>
`;

  peek.classList.remove("hidden");
}

// Initialize the application
window.addEventListener("DOMContentLoaded", () => {
  // Setup logout button event listeners
  setupLogoutButtons();

  // Check if user is already logged in
  const usuarioActivo = localStorage.getItem("usuarioActivo");
  if (usuarioActivo) {
    currentUser = usuarioActivo;
    showCareerSection();
    document.getElementById("user-display").innerHTML =
      usuarioActivo === "admin"
        ? `<span class="admin-name">Administrador</span>`
        : `Usuario: ${usuarioActivo}`;
  }
});
