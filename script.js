const modal = document.getElementById("modal");
const closeButton = document.querySelector(".close-button");
const form = document.getElementById("evaluation-form");
let currentCourse = null;

// Open modal on course click
document.querySelectorAll(".course").forEach((course) => {
  course.addEventListener("click", () => {
    currentCourse = course.dataset.course;
    modal.classList.remove("hidden");
  });
});

// Close modal
closeButton.addEventListener("click", () => {
  modal.classList.add("hidden");
  form.reset();
});

// Submit evaluation
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const profName = document.getElementById("professor-name").value;
  const rating = document.getElementById("rating").value;
  const comment = document.getElementById("comment").value;

  console.log(`Curso: ${currentCourse}`);
  console.log(`Profesor: ${profName}`);
  console.log(`Calificación: ${rating}`);
  console.log(`Comentario: ${comment}`);

  alert("¡Gracias por tu evaluación!");

  modal.classList.add("hidden");
  form.reset();
});
