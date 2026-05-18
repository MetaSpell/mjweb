(function() {
  const themeKey = "majify-theme";
  const root = document.documentElement;

  function escapeHtml(text) {
    return text.replace(/[&<>"']/g, function(character) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "\"": "&quot;",
        "'": "&#39;"
      }[character];
    });
  }

  function applyTheme(theme) {
    const nextTheme = theme === "dark" ? "dark" : "light";
    const isDark = nextTheme === "dark";

    root.setAttribute("data-theme", nextTheme);

    document.querySelectorAll("[data-theme-toggle]").forEach(function(button) {
      button.setAttribute("aria-pressed", String(isDark));
      button.setAttribute("aria-label", isDark ? "Switch to light theme" : "Switch to dark theme");

      const label = button.querySelector("[data-theme-label]");
      if (label) {
        label.textContent = isDark ? "Light mode" : "Dark mode";
      }
    });

    document.querySelectorAll("[data-theme-wordmark]").forEach(function(image) {
      const lightSrc = image.getAttribute("data-light-src");
      const darkSrc = image.getAttribute("data-dark-src");
      image.setAttribute("src", isDark ? darkSrc : lightSrc);
    });
  }

  function initTheme() {
    let storedTheme = "light";

    try {
      storedTheme = localStorage.getItem(themeKey) || "light";
    } catch (error) {
      storedTheme = "light";
    }

    applyTheme(storedTheme);

    document.addEventListener("click", function(event) {
      const button = event.target.closest("[data-theme-toggle]");
      if (!button) {
        return;
      }

      const nextTheme = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(nextTheme);

      try {
        localStorage.setItem(themeKey, nextTheme);
      } catch (error) {
      }
    });
  }

  function buildHeader(label) {
    const pageLabel = label ? '<p class="page-kicker">' + escapeHtml(label) + "</p>" : "";

    return (
      '<div class="site-topbar">' +
        '<a class="site-brand-link" href="index.html" aria-label="Majify Technologies home">' +
          '<span class="sr-only">Majify Technologies</span>' +
          '<span class="site-brand-lockup">' +
            '<img class="site-brand-mark" src="logo/majify-mark.svg" alt="" aria-hidden="true">' +
            '<img class="site-brand-wordmark" src="logo/majify-wordmark-dark.svg" data-theme-wordmark data-light-src="logo/majify-wordmark-dark.svg" data-dark-src="logo/majify-wordmark-light.svg" alt="" aria-hidden="true">' +
            '<span class="site-brand-caption">Technologies</span>' +
          "</span>" +
        "</a>" +
        '<button class="theme-toggle" type="button" data-theme-toggle aria-pressed="false" aria-label="Switch to dark theme">' +
          '<span data-theme-label>Dark mode</span>' +
        "</button>" +
      "</div>" +
      pageLabel
    );
  }

  function buildFooter() {
    return (
      '<div class="footer-row">' +
        '<div class="footer-copy">' +
          '<a href="index.html">&copy; <span data-site-year></span> Majify Technologies Inc.</a>' +
        "</div>" +
        '<div class="footer-links">' +
          '<a href="index.html">Home</a>' +
          '<a href="terms.html">Terms &amp; Conditions</a>' +
          '<a href="privacy.html">Privacy Policy</a>' +
          '<a href="mailto:contact@majify.tech">Contact</a>' +
        "</div>" +
      "</div>"
    );
  }

  function initShell() {
    document.querySelectorAll("[data-site-header]").forEach(function(header) {
      header.innerHTML = buildHeader(header.dataset.pageLabel || "");
    });

    document.querySelectorAll("[data-site-footer]").forEach(function(footer) {
      footer.innerHTML = buildFooter();
    });

    document.querySelectorAll("[data-site-year]").forEach(function(node) {
      node.textContent = new Date().getFullYear();
    });
  }

  function initTypewriter() {
    const target = document.getElementById("typewriter");
    if (!target) {
      return;
    }

    const steps = [
      { type: "text", text: "Majify your day ", delay: 800 },
      { type: "text", text: "- One idea at a time ", delay: 550 },
      { type: "text", text: "- It's ", delay: 450 },
      { type: "link", text: "Wake Time", href: "https://wake.tools", delay: 300 }
    ];

    let stepIndex = 0;

    function runStep() {
      if (stepIndex >= steps.length) {
        return;
      }

      const step = steps[stepIndex++];

      setTimeout(function() {
        if (step.type === "text") {
          let characterIndex = 0;

          const interval = setInterval(function() {
            if (characterIndex < step.text.length) {
              target.append(document.createTextNode(step.text[characterIndex]));
              characterIndex += 1;
            } else {
              clearInterval(interval);
              runStep();
            }
          }, 38);
          return;
        }

        const link = document.createElement("a");
        link.href = step.href;
        link.target = "_blank";
        link.rel = "noopener";
        link.textContent = step.text;
        target.appendChild(link);
      }, step.delay);
    }

    runStep();
  }

  initShell();
  initTheme();
  initTypewriter();
})();
