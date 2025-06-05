const modal = document.getElementById("modal");
const closeButton = document.querySelector(".close-button");
const form = document.getElementById("evaluation-form");
let currentCourse = null;

// Abrir modal al hacer clic en un curso
document.querySelectorAll(".course").forEach((course) => {
  course.addEventListener("click", () => {
    currentCourse = course.dataset.course;
    showPreviousEvaluations(currentCourse);
    modal.classList.remove("hidden");
  });
});

// Cerrar modal
closeButton.addEventListener("click", () => {
  modal.classList.add("hidden");
  form.reset();
});

// Guardar evaluación al enviar
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const profName = document.getElementById("professor-name").value;
  const rating = parseInt(document.getElementById("rating").value);
  const comment = document.getElementById("comment").value;

  const newEvaluation = {
    profesor: profName,
    calificacion: rating,
    comentario: comment,
  };

  // Obtener evaluaciones anteriores
  const allData = JSON.parse(localStorage.getItem("evaluaciones") || "{}");

  if (!allData[currentCourse]) {
    allData[currentCourse] = [];
  }

  allData[currentCourse].push(newEvaluation);

  // Guardar actualizado
  localStorage.setItem("evaluaciones", JSON.stringify(allData));

  alert("¡Gracias por tu evaluación!");

  modal.classList.add("hidden");
  form.reset();
});

// Mostrar evaluaciones anteriores (en consola por ahora)
function showPreviousEvaluations(courseId) {
  const allData = JSON.parse(localStorage.getItem("evaluaciones") || "{}");
  const evaluations = allData[courseId] || [];

  const profInput = document.getElementById("professor-name");
  const select = document.getElementById("existing-professors");
  const evalList = document.getElementById("evaluations-list");

  // Limpiar select y lista previa
  select.innerHTML = '<option value="">-- Otro / Nuevo --</option>';
  evalList.innerHTML = "";

  // Agrupar evaluaciones por profesor
  const grouped = {};
  evaluations.forEach((e) => {
    if (!grouped[e.profesor]) grouped[e.profesor] = [];
    grouped[e.profesor].push(e);
  });

  // Llenar select con profesores únicos
  Object.keys(grouped).forEach((prof) => {
    const opt = document.createElement("option");
    opt.value = prof;
    opt.textContent = prof;
    select.appendChild(opt);
  });

  select.onchange = () => {
    profInput.value = select.value;
  };

  // Mostrar evaluaciones agrupadas por profesor
  Object.entries(grouped).forEach(([prof, evals]) => {
    const container = document.createElement("div");
    container.classList.add("prof-evaluation");

    // Calcular promedio
    const avg =
      evals.reduce((sum, e) => sum + e.calificacion, 0) / evals.length;
    const avgRounded = avg.toFixed(1);

    // Mostrar estrellas
    const stars = "★".repeat(Math.round(avg)) + "☆".repeat(5 - Math.round(avg));

    container.innerHTML = `
      <h4>${prof}</h4>
      <div class="stars">${stars} (${avgRounded}/5)</div>
      ${evals
        .map((e) =>
          e.comentario
            ? `<p><em>"${e.comentario}"</em></p>`
            : `<p><em>Sin comentario.</em></p>`
        )
        .join("")}
    `;

    evalList.appendChild(container);
  });
}
