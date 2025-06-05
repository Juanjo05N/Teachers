document.querySelectorAll('.course').forEach(course => {
  course.addEventListener('click', () => {
    alert(`You clicked on ${course.dataset.course}`);
  });
});

function loadCareer() {
  const selected = document.getElementById("career").value;
  const canvas = document.getElementById("career-canvas");

  if (selected === "civil") {
    canvas.innerHTML = `
      <h2>Ingeniería Civil</h2>
      <img src="assets/ingenieria_civil.png" alt="Mapa Ingeniería Civil" style="max-width:100%; height:auto;">
    `;
  } else if (selected === "sistemas") {
    canvas.innerHTML = `
      <h2>Ingeniería de Sistemas</h2>
      <p>Contenido de la carrera de Sistemas próximamente...</p>
    `;
  } else {
    canvas.innerHTML = "";
  }
}
