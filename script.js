function loadCareer(career) {
  const modal = document.getElementById("careerModal");
  const modalBody = document.getElementById("modalBody");

  if (career === "civil") { 
    modalBody.innerHTML = `
        <h3>Ingeniería Civil</h3>
        <div class="malla-container">
            <img src="assets/civil_malla.jpg" alt="Mapa Ingeniería Civil">
            
            <!-- Materias clickeables con coordenadas aproximadas -->
            <div class="materia" style="top: 65px; left: 90px;" data-course="Cálculo Diferencial"></div>
            <div class="materia" style="top: 125px; left: 90px;" data-course="Geometría"></div>
            <div class="materia" style="top: 185px; left: 90px;" data-course="Biología I"></div>
            <div class="materia" style="top: 245px; left: 90px;" data-course="Química General e Inorgánica"></div>

        </div>


    `;
    // Y activa los clics:
    setTimeout(() => {
    document.querySelectorAll('.materia').forEach(materia => {
        materia.addEventListener('click', () => {
            alert(`Has hecho clic en: ${div.dataset.materia}`);
            });
        });
    }, 0);
    }
    modal.style.display = "block";
}
  /*else if (career === "sistemas") {
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
}*/
