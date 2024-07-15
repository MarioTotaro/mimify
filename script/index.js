document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('fireworksCanvas');
    const confetti = window.confetti.create(canvas, {
      resize: true,
      useWorker: true
    });
  
    function firework() {
      const duration = 1 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
  
      function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
      }
  
      const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();
  
        if (timeLeft <= 0) {
          return clearInterval(interval);
        }
  
        const particleCount = 50 * (timeLeft / duration);
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
      }, 250);
    }
  
    const fireworkInterval = setInterval(firework, 2000);
  
    setTimeout(() => {
      clearInterval(fireworkInterval);
    }, 10000); // 30 seconds
  });

  window.onload = function() {
    var img = document.getElementById('animatedImage');
    img.classList.add('move-animation');
    setTimeout(function() {
      img.classList.remove('move-animation');
    }, 10000);
  }
  