function loadCareer(career) {
  const modal = document.getElementById("careerModal");
  const modalBody = document.getElementById("modalBody");

  if (career === "civil") {
    modalBody.innerHTML = `
      <h3>Ingeniería Civil</h3>
      <img src="assets/civil_malla.jpg" alt="Mapa Ingeniería Civil" style="max-width:100%; height:auto;">
    `;
  } else if (career === "sistemas") {
    modalBody.innerHTML = `
      <h3>Ingeniería de Sistemas</h3>
      <p>Contenido del mapa curricular próximamente...</p>
    `;
  } else {
    modalBody.innerHTML = "";
  }

  modal.style.display = "block";
}

function closeModal() {
  const modal = document.getElementById("careerModal");
  modal.style.display = "none";
}
