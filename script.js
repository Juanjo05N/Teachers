let currentCourse = null;

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
  const full = Math.floor(score);
  const half = score - full >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return "★".repeat(full) + (half ? "½" : "") + "☆".repeat(empty);
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
      <div style="border: 1px solid #ccc; padding: 10px; border-radius: 6px; margin-bottom: 10px;">
        <strong>Calificación:</strong> ${getStarsHTML(e.calificacion)} (${
          e.calificacion
        }/5)<br />
        <strong>Comentario:</strong> ${e.comentario || "(Sin comentario)"}
      </div>
    `
      )
      .join("")}
  </div>
`;

  peek.classList.remove("hidden");
}
