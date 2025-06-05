function loadCareer(career) {
  const modal = document.getElementById("careerModal");
  const modalBody = document.getElementById("modalBody");

  if (career === "civil") { 
    modalBody.innerHTML = `
      <h3>Ingeniería Civil</h3>
      <div class="malla-container">
        <img src="assets/civil_malla.jpg" alt="Mapa Ingeniería Civil">
        
        <!-- Materias clickeables con coordenadas aproximadas -->
        <div class="materia" style="top: 115px; left: 15px;" data-course="Cálculo Diferencial"></div>
        <div class="materia" style="top: 205px; left: 15px;" data-course="Geometría"></div>
        <div class="materia" style="top: 295px; left: 15px;" data-course="Biología I"></div>
        <div class="materia" style="top: 383px; left: 15px;" data-course="Química General e Inorgánica"></div>
        <div class="materia" style="top: 472px; left: 15px;" data-course="Fundamentos de programación"></div>
        <div class="materia" style="top: 650px; left: 15px;" data-course="Comunicación y Ciencia"></div>
        <div class="materia" style="top: 740px; left: 15px;" data-course="Introducción a la Ingeniería"></div>
      </div>
    `;

    // Activar clics en las materias
    setTimeout(() => {
      document.querySelectorAll('.materia').forEach(materia => {
        materia.addEventListener('click', () => {
          alert(`Has hecho clic en: ${materia.dataset.course}`);
        });
      });
    }, 0);
  }
  else if (career === "sistemas") {
    modalBody.innerHTML = `
      <h3>Ingeniería de Sistemas</h3>
      <p>Contenido del mapa curricular próximamente...</p>
    `;
  } else {
    modalBody.innerHTML = "";
  }

  // Mostrar el modal
  modal.style.display = "block";
}

function closeModal() {
  const modal = document.getElementById("careerModal");
  modal.style.display = "none";
}
