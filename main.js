(() => {
  "use strict";

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  const initCosmicBackground = () => {
    const canvas = document.createElement("canvas");
    canvas.id = "cosmic-canvas";
    canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: -1;
      opacity: 0.8;
    `;
    document.body.prepend(canvas);

    const ctx = canvas.getContext("2d");
    let width, height, dpr;
    let particles = [];

    class Particle {
      constructor() {
        this.reset(true);
      }

      reset(initial = false) {
        this.x = Math.random() * width;
        this.y = initial ? Math.random() * height : height + 10;

        const depth = Math.pow(Math.random(), 3);
        this.size = depth * 1.2 + 0.4;
        this.speed = depth * 0.1 + 0.02;
        this.baseAlpha = depth * 0.4 + 0.2;
        this.alpha = this.baseAlpha;
        this.twinkleSpeed = Math.random() * 0.01 + 0.005;
        this.twinkleOffset = Math.random() * Math.PI * 2;

        const colorRand = Math.random();
        if (colorRand < 0.25) {
          this.color = "212, 175, 55";
        } else if (colorRand < 0.5) {
          this.color = "168, 156, 200";
        } else {
          this.color = "248, 247, 252";
        }
      }

      update() {
        this.y -= this.speed;
        this.twinkleOffset += this.twinkleSpeed;
        this.alpha = this.baseAlpha + Math.sin(this.twinkleOffset) * 0.1;
        if (this.y < -10) this.reset();
      }

      draw() {
        ctx.fillStyle = `rgba(${this.color}, ${Math.max(
          0,
          Math.min(1, this.alpha)
        )})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const resize = () => {
      dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      width = window.innerWidth;
      height = window.innerHeight;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.floor((width * height) / 12000);
      particles = Array.from(
        { length: Math.min(count, 200) },
        () => new Particle()
      );
    };

    let resizeTimeout;
    window.addEventListener(
      "resize",
      () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(resize, 150);
      },
      { passive: true }
    );

    resize();

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.update();
        p.draw();
      }
      requestAnimationFrame(animate);
    };

    animate();
  };

  const initScrollReveal = () => {
    const elements = document.querySelectorAll(
      "section, .experience-item, .degree"
    );

    elements.forEach((el) => {
      el.classList.add("reveal-on-scroll");
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    elements.forEach((el) => observer.observe(el));
  };

  function init() {
    initCosmicBackground();
    initScrollReveal();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
