(function () {
  "use strict";

  var root = document.documentElement;
  var themeToggle = document.getElementById("themeToggle");
  var storedTheme = localStorage.getItem("theme");
  if (storedTheme) root.setAttribute("data-theme", storedTheme);

  themeToggle.addEventListener("click", function () {
    var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    var current = root.getAttribute("data-theme") || (prefersDark ? "dark" : "light");
    var next = current === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  });

  var navbar = document.getElementById("navbar");
  var progressBar = document.getElementById("progressBar");
  var sections = document.querySelectorAll("main section[id]");
  var navLinkEls = document.querySelectorAll(".nav-links a");

  function onScroll() {
    navbar.classList.toggle("scrolled", window.scrollY > 20);

    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var scrolled = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
    progressBar.style.width = scrolled + "%";

    var scrollPos = window.scrollY + 140;
    var activeId = "";
    sections.forEach(function (sec) {
      if (scrollPos >= sec.offsetTop) activeId = sec.id;
    });
    navLinkEls.forEach(function (link) {
      link.classList.toggle("active", link.getAttribute("href") === "#" + activeId);
    });
  }
  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  var menuToggle = document.getElementById("menuToggle");
  var navLinks = document.getElementById("navLinks");
  menuToggle.addEventListener("click", function () {
    navLinks.classList.toggle("open");
    menuToggle.classList.toggle("open");
  });
  navLinkEls.forEach(function (link) {
    link.addEventListener("click", function () {
      navLinks.classList.remove("open");
      menuToggle.classList.remove("open");
    });
  });

  var toTop = document.getElementById("toTop");
  toTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  document.getElementById("year").textContent = new Date().getFullYear();

  var roles = [
    "Senior Software Engineer",
    "Golang Backend Developer",
    "Distributed Systems Engineer",
    "Full-Stack Web Developer"
  ];
  var twEl = document.getElementById("typewriter");
  var roleIndex = 0, charIndex = 0, deleting = false;

  function typeLoop() {
    var current = roles[roleIndex];
    if (!deleting) {
      charIndex++;
      twEl.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(typeLoop, 1600);
        return;
      }
    } else {
      charIndex--;
      twEl.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
    }
    setTimeout(typeLoop, deleting ? 40 : 80);
  }
  typeLoop();

  var revealEls = document.querySelectorAll(".reveal");
  var revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  revealEls.forEach(function (el) { revealObserver.observe(el); });

  var statEls = document.querySelectorAll(".stat-num");
  var statsObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var target = parseInt(el.getAttribute("data-target"), 10);
        var count = 0;
        var step = Math.max(1, Math.round(target / 40));
        var timer = setInterval(function () {
          count += step;
          if (count >= target) {
            count = target;
            clearInterval(timer);
          }
          el.textContent = count;
        }, 35);
        statsObserver.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );
  statEls.forEach(function (el) { statsObserver.observe(el); });

  var contactForm = document.getElementById("contactForm");
  var formNote = document.getElementById("formNote");
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var data = new FormData(contactForm);
    var name = encodeURIComponent(data.get("name"));
    var subject = encodeURIComponent(data.get("subject"));
    var body = encodeURIComponent(
      data.get("message") + "\n\nFrom: " + data.get("name") + " (" + data.get("email") + ")"
    );
    window.location.href =
      "mailto:fahreyadome@gmail.com?subject=" + subject + "&body=" + body;
    formNote.textContent = "Opening your email client…";
    contactForm.reset();
  });
})();
