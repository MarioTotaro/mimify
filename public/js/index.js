document.addEventListener("DOMContentLoaded", function () {
  const canvas = document.getElementById("fireworksCanvas");
  const confetti = window.confetti.create(canvas, {
    resize: true,
    useWorker: true,
  });

  function firework() {
    const duration = 1 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti(
        Object.assign({}, defaults, {
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        })
      );
      confetti(
        Object.assign({}, defaults, {
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        })
      );
    }, 250);
  }

  const fireworkInterval = setInterval(firework, 2000);

  setTimeout(() => {
    clearInterval(fireworkInterval);
  }, 10000); // 30 seconds
});

window.onload = function () {
  var img = document.getElementById("animatedImage");
  img.classList.add("move-animation");
  setTimeout(function () {
    img.classList.remove("move-animation");
  }, 10000);
};
document.addEventListener("DOMContentLoaded", function () {
  const canvas = document.getElementById("fireworksCanvas");
  const confetti = window.confetti.create(canvas, {
    resize: true,
    useWorker: true,
  });

  function firework() {
    const duration = 1 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti(
        Object.assign({}, defaults, {
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        })
      );
      confetti(
        Object.assign({}, defaults, {
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        })
      );
    }, 250);
  }

  const fireworkInterval = setInterval(firework, 2000);

  setTimeout(() => {
    clearInterval(fireworkInterval);
  }, 10000);
});

window.onload = function () {
  var img = document.getElementById("animatedImage");
  img.classList.add("move-animation");
  setTimeout(function () {
    img.classList.remove("move-animation");
  }, 10000);
};

document.addEventListener("DOMContentLoaded", function () {
  const iconContainer = document.getElementById("icon-container");
  const iconPaths = [
    "../assets/images/index/icon1.png",
    "../assets/images/index/icon2.png",
    "../assets/images/index/icon3.png",
    "../assets/images/index/icon4.png",
    "../assets/images/index/icon5.png",
    "../assets/images/index/icon6.png",
    "../assets/images/index/icon7.png",
    "../assets/images/index/icon8.png",
    "../assets/images/index/icon9.png",
  ];

  for (let i = 0; i < 10; i++) {
    const icon = document.createElement("img");
    icon.src = iconPaths[i];
    icon.classList.add("icon");
    icon.style.top = `${Math.random() * 100}%`;
    icon.style.left = `${Math.random() * 100}%`;
    iconContainer.appendChild(icon);
  }

  const icons = document.querySelectorAll(".icon");

  function animateIcons() {
    icons.forEach((icon) => {
      let top = parseFloat(icon.style.top);
      let left = parseFloat(icon.style.left);
      const deltaTop = (Math.random() - 0.5) * 10; // Increase the movement range
      const deltaLeft = (Math.random() - 0.5) * 10; // Increase the movement range

      top += deltaTop;
      left += deltaLeft;

      // Ensure the icons stay within the container
      if (top < 0) top = 0;
      if (top > 100) top = 100;
      if (left < 0) left = 0;
      if (left > 100) left = 100;

      icon.style.top = `${top}%`;
      icon.style.left = `${left}%`;
    });

    requestAnimationFrame(animateIcons);
  }

  requestAnimationFrame(animateIcons);

  setTimeout(() => {
    icons.forEach((icon) => {
      icon.style.transition = "opacity 1s";
      icon.style.opacity = 0;
    });
    setTimeout(() => {
      iconContainer.innerHTML = "";
    }, 1000);
  }, 20000);
});
