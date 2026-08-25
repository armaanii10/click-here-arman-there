(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Type-in effect for the intro line.
  const typed = document.getElementById('typed');
  const line = "Hey, I'm Arman. Welcome to my corner of the internet.";
  if (typed) {
    if (reduceMotion) {
      typed.textContent = line;
    } else {
      let i = 0;
      const tick = () => {
        if (i <= line.length) {
          typed.textContent = line.slice(0, i++);
          setTimeout(tick, 55);
        }
      };
      setTimeout(tick, 400);
    }
  }

  // Active-panel reveal + dot-nav sync.
  const panels = document.querySelectorAll('.panel');
  const dots = document.querySelectorAll('.dot-nav a');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        dots.forEach(d => d.classList.remove('current'));
        const dot = document.querySelector(`.dot-nav a[href="#${entry.target.id}"]`);
        if (dot) dot.classList.add('current');
      } else {
        entry.target.classList.remove('active');
      }
    });
  }, { threshold: 0.6 });

  panels.forEach(p => observer.observe(p));

  // Prime the intro panel so its content isn't hidden until first scroll event.
  const intro = document.getElementById('intro');
  if (intro) intro.classList.add('active');

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
