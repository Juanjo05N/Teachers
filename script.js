document.querySelectorAll('.course').forEach(course => {
  course.addEventListener('click', () => {
    alert(`You clicked on ${course.dataset.course}`);
  });
});
