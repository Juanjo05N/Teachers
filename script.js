let currentCourse = null;
let currentUser = null;

let users = JSON.parse(localStorage.getItem("usuarios") || "{}");

if (!users["admin"]) {
  users["admin"] = "admin123";
  localStorage.setItem("usuarios", JSON.stringify(users));
}

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
    showMainSection();
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

    showMainSection();
  }
};

function showMainSection() {
  document.getElementById("login-section").classList.add("hidden");
  document.getElementById("main-section").classList.remove("hidden");
}

document.getElementById("logout-button").addEventListener("click", () => {
  localStorage.removeItem("usuarioActivo"); // Borra el usuario activo (si lo usas)
  document.getElementById("main-section").classList.add("hidden");
  document.getElementById("login-section").classList.remove("hidden");
});

document.querySelectorAll(".course").forEach((course) => {
  course.addEventListener("click", () => {
    currentCourse = course.dataset.course;
    showProfessorsForCourse(currentCourse);
  });
});

const peek = document.getElementById("center-peek");
const peekBody = document.getElementById("peek-body");
const peekClose = document.querySelector(".peek-close");

peekClose.onclick = () => {
  peek.classList.add("hidden");
  peekBody.innerHTML = "";
};

function showProfessorsForCourse(courseId) {
  const allData = JSON.parse(localStorage.getItem("evaluaciones") || "{}");
  const evaluations = allData[courseId] || [];

  const grouped = {};
  evaluations.forEach((e) => {
    if (!grouped[e.profesor]) grouped[e.profesor] = [];
    grouped[e.profesor].push(e);
  });

  peekBody.innerHTML = `
    <h2>Profesores de ${courseId.replace("-", " ")}</h2>
    <button onclick="newProfessorForm()">+ Nuevo Profesor</button>
    <div style="margin-top: 20px;"></div>`;

  Object.entries(grouped).forEach(([prof, evals]) => {
    const avg =
      evals.reduce((sum, e) => sum + e.calificacion, 0) / evals.length;
    const stars = getStarsHTML(avg);

    const profBox = document.createElement("div");
    profBox.innerHTML = `
      <div style="padding:10px; border:1px solid #ccc; border-radius:8px; margin-bottom:10px; cursor:pointer;">
        <strong style="font-size:18px;">${prof}</strong>
        <div>${stars} (${avg.toFixed(1)}/5)</div>
      </div>
    `;
    profBox.onclick = () => viewProfessorDetails(prof);
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

function setPeekHeader(showBackArrow = true) {
  const headerHTML = `
    <div class="peek-header">
      ${
        showBackArrow
          ? `<span class="back-arrow" onclick="showProfessorsForCourse(currentCourse)">← Volver</span>`
          : `<span></span>`
      }
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
  <div class="peek-header">
  </div>
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
    <h2 style="margin: 0;">${nombreProfesor}</h2>
    <button onclick="calificarProfesor('${nombreProfesor.replace(
      /'/g,
      "\\'"
    )}')">+ Calificar Profesor</button>
  </div>
  <p><strong>Promedio:</strong> ${estrellas} (${promedio.toFixed(1)}/5)</p>
  <hr />
  <div id="comentarios-lista">
    ${delProfesor
      .map(
        (e) => `
<div style="border: 1px solid #ccc; padding: 10px; border-radius: 6px; margin-bottom: 10px; position: relative;">
  <strong>Calificación:</strong> ${getStarsHTML(e.calificacion)} (${
          e.calificacion
        }/5)<br />
  <strong>Comentario:</strong> ${e.comentario || "(Sin comentario)"}
  ${
    currentUser === "admin"
      ? `<button onclick="eliminarReseña('${currentCourse}', '${nombreProfesor}', ${evaluations.indexOf(
          e
        )})" style="position: absolute; top: 5px; right: 5px; background-color: red; color: white; border: none; border-radius: 4px; padding: 4px;">🗑️</button>`
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

window.addEventListener("DOMContentLoaded", () => {
  const usuarioActivo = localStorage.getItem("usuarioActivo");
  if (usuarioActivo) {
    currentUser = usuarioActivo;
    showMainSection();
    document.getElementById("user-display").innerHTML =
      usuarioActivo === "admin"
        ? `<span class="admin-name">Administrador</span>`
        : `Usuario: ${usuarioActivo}`;
  }
});
