/* ============================================================
   Aayush Nagar — personal site
   Progressive enhancement: theme toggle, interactive terminal,
   boot/typewriter intro, ⌘K command palette, matrix easter egg.
   No dependencies. Site works fully without JS.
   ============================================================ */
(function () {
  "use strict";

  var root = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent || "");

  /* ---------- Analytics (GoatCounter custom events; no-op if not loaded) ---------- */
  function slug(s) {
    return String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }
  function track(path, title) {
    try {
      if (window.goatcounter && window.goatcounter.count) {
        window.goatcounter.count({ path: path, title: title || path, event: true });
      }
    } catch (e) { /* analytics must never break the page */ }
  }

  /* ---------- Theme ---------- */
  function setTheme(name) {
    if (name === "matrix") { startMatrix(); return; }
    stopMatrix();
    root.setAttribute("data-theme", name);
    localStorage.setItem("theme", name);
  }
  function toggleTheme() {
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    setTheme(next);
    track("theme-" + next, "Theme: " + next);
  }
  var themeToggle = document.getElementById("theme-toggle");
  if (themeToggle) themeToggle.addEventListener("click", toggleTheme);

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Shared content ---------- */
  var SECTIONS = ["about", "experience", "education", "certifications", "contact"];
  function go(id) {
    var el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* ============================================================
     Interactive terminal
     ============================================================ */
  var term = document.getElementById("terminal");
  var out = document.getElementById("term-output");
  var form = document.getElementById("term-form");
  var input = document.getElementById("term-input");
  var history = [];
  var histIdx = -1;

  function line(html, cls) {
    var p = document.createElement("p");
    if (cls) p.className = cls;
    p.innerHTML = html;
    out.appendChild(p);
    out.scrollTop = out.scrollHeight;
    return p;
  }
  function text(str, cls) { return line(esc(str), cls); }

  var COMMANDS = {
    help: function () {
      line("available commands:");
      line(
        "  <span class='t-green'>about</span> · <span class='t-green'>experience</span> · " +
        "<span class='t-green'>education</span> · <span class='t-green'>skills</span> · " +
        "<span class='t-green'>certs</span> · <span class='t-green'>contact</span>"
      );
      line(
        "  <span class='t-blue'>ls</span> · <span class='t-blue'>whoami</span> · " +
        "<span class='t-blue'>banner</span> · <span class='t-blue'>theme</span> [dark|light|matrix] · " +
        "<span class='t-blue'>clear</span>"
      );
      line("  <span class='t-muted'>tip: ↑/↓ for history, Tab to autocomplete, ⌘K for the palette</span>");
    },
    whoami: function () {
      line("Aayush Nagar — <span class='t-green'>VP, Software Engineering</span> @ JPMorganChase");
      line("Glasgow, UK · 11+ years in banking &amp; financial services", "t-muted");
    },
    about: function () {
      text("Aayush Nagar — VP, Software Engineering at JPMorganChase, Glasgow.");
      text("Puts ML & generative AI into the hands of wholesale credit-risk teams.");
      line("<span class='t-muted'>(opening about ↓)</span>"); go("about");
    },
    experience: function () {
      line("<span class='t-green'>2019 — now</span>  VP, Software Engineering · JPMorganChase · Glasgow");
      line("<span class='t-green'>2018 — 2019</span>  Senior Software Engineer · Nihilent · Pune");
      line("<span class='t-green'>2015 — 2017</span>  Software Engineer · HSBC · Pune & Chester");
      go("experience");
    },
    education: function () {
      line("<span class='t-green'>2009 — 2013</span>  BTech, Computer Science · A.P.J. Abdul Kalam Technical University");
      go("education");
    },
    skills: function () {
      line("Java/Spring Boot · Python · LLMs & agentic AI · AWS (Bedrock, EMR)");
      line("Databricks/Spark · Kubernetes · Terraform · Kafka · microservices");
    },
    certs: function () {
      line("✓ Machine Learning <span class='t-muted'>· Stanford · Coursera (Andrew Ng)</span>");
      line("✓ An Entire MBA in 1 Course <span class='t-muted'>· Chris Haroun · Udemy</span>");
      go("certifications");
    },
    contact: function () {
      line("email&nbsp;&nbsp;&nbsp; <a href='mailto:aayush15a@gmail.com'>aayush15a@gmail.com</a>");
      line("linkedin <a href='https://www.linkedin.com/in/aayushnagar/' target='_blank' rel='noopener'>/in/aayushnagar</a>");
      go("contact");
    },
    ls: function () {
      line(SECTIONS.map(function (s) { return "<span class='t-blue'>" + s + "/</span>"; }).join("&nbsp;&nbsp;"));
    },
    banner: function () {
      var art =
        "  __ _  __ _ _   _ _   _ ___| |__  \n" +
        " / _` |/ _` | | | | | | / __| '_ \\ \n" +
        "| (_| | (_| | |_| | |_| \\__ \\ | | |\n" +
        " \\__,_|\\__,_|\\__, |\\__,_|___/_| |_|\n" +
        "             |___/                 ";
      line("<span class='t-green'>" + esc(art) + "</span>");
    },
    theme: function (args) {
      var t = (args[0] || "").toLowerCase();
      if (t === "dark" || t === "light" || t === "matrix") { setTheme(t); line("theme → " + t, "t-muted"); }
      else if (t === "") { toggleTheme(); line("theme toggled", "t-muted"); }
      else line("unknown theme: " + esc(t) + " (try dark | light | matrix)", "t-err");
    },
    matrix: function () { setTheme("matrix"); line("entering the matrix… (Esc to exit)", "t-muted"); },
    date: function () { text(new Date().toString()); },
    echo: function (args) { text(args.join(" ")); },
    sudo: function () { line("permission denied: nice try 😏 (this incident has been logged to /dev/null)", "t-err"); },
    curl: function () { line("you're already here — but nice instinct 😄", "t-muted"); },
    clear: function () { out.innerHTML = ""; },
    exit: function () { line("there's no escape — but ⌘K is close enough", "t-muted"); }
  };
  var ALIASES = { exp: "experience", edu: "education", stack: "skills", certifications: "certs", links: "contact", social: "contact", cls: "clear", "?": "help", me: "whoami" };

  function run(raw) {
    var str = raw.trim();
    if (!str) return;
    line("<span class='term-prompt'>$</span> " + esc(str));
    history.push(str); histIdx = history.length;
    var parts = str.split(/\s+/);
    var name = parts[0].toLowerCase();
    name = ALIASES[name] || name;
    var fn = COMMANDS[name];
    if (fn) { fn(parts.slice(1)); track("terminal-" + name, "Terminal: " + name); }
    else line("command not found: " + esc(parts[0]) + " — type <span class='t-green'>help</span>", "t-err");
  }

  function bootThenReady() {
    term.hidden = false;
    var boot = [
      "booting aayush.os …",
      "[ <span class='t-green'>ok</span> ] mounting /experience",
      "[ <span class='t-green'>ok</span> ] loading models · bedrock · databricks",
      "[ <span class='t-green'>ok</span> ] starting shell",
      "welcome — type <span class='t-green'>help</span> to explore. <span class='t-muted'>(⌘K for the palette)</span>"
    ];
    if (reduceMotion) { boot.forEach(function (l) { line(l); }); return; }
    var i = 0;
    (function next() {
      if (i >= boot.length) return;
      line(boot[i]); i++;
      setTimeout(next, i === 1 ? 260 : 200);
    })();
  }

  if (term && out && form && input) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      run(input.value);
      input.value = "";
    });
    input.addEventListener("keydown", function (e) {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        if (histIdx > 0) { histIdx--; input.value = history[histIdx] || ""; }
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (histIdx < history.length - 1) { histIdx++; input.value = history[histIdx] || ""; }
        else { histIdx = history.length; input.value = ""; }
      } else if (e.key === "Tab") {
        e.preventDefault();
        var cur = input.value.trim().toLowerCase();
        if (!cur) return;
        var pool = Object.keys(COMMANDS).concat(Object.keys(ALIASES));
        var hit = pool.filter(function (c) { return c.indexOf(cur) === 0; });
        if (hit.length === 1) input.value = hit[0];
        else if (hit.length > 1) line(hit.join("  "), "t-muted");
      }
    });
    bootThenReady();
  }

  /* ============================================================
     Matrix rain
     ============================================================ */
  var canvas = document.getElementById("matrix");
  var ctx = canvas ? canvas.getContext("2d") : null;
  var rafId = null, cols, drops;
  var GLYPHS = "アイウエオカキクケコサシスセソｱｲｳｴｵ0123456789".split("");

  function sizeMatrix() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    cols = Math.floor(canvas.width / 14);
    drops = [];
    for (var i = 0; i < cols; i++) drops[i] = Math.random() * -50;
  }
  function drawMatrix() {
    ctx.fillStyle = "rgba(0,0,0,0.07)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#39ff14";
    ctx.font = "14px monospace";
    for (var i = 0; i < cols; i++) {
      var ch = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      ctx.fillText(ch, i * 14, drops[i] * 14);
      if (drops[i] * 14 > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }
    rafId = setTimeout(function () { requestAnimationFrame(drawMatrix); }, 33);
  }
  function startMatrix() {
    if (!canvas || !ctx) return;
    track("matrix-mode", "Matrix mode");
    root.classList.add("matrix-on");
    canvas.hidden = false;
    sizeMatrix();
    if (rafId) clearTimeout(rafId);
    if (!reduceMotion) drawMatrix();
  }
  function stopMatrix() {
    if (!canvas) return;
    root.classList.remove("matrix-on");
    canvas.hidden = true;
    if (rafId) { clearTimeout(rafId); rafId = null; }
  }
  window.addEventListener("resize", function () { if (!canvas.hidden) sizeMatrix(); });

  /* ============================================================
     Command palette (⌘K)
     ============================================================ */
  var overlay = document.getElementById("palette");
  var pInput = document.getElementById("palette-input");
  var pList = document.getElementById("palette-list");
  var ACTIONS = [
    { icon: "→", label: "Go to about", hint: "about", run: function () { go("about"); } },
    { icon: "→", label: "Go to experience", hint: "experience", run: function () { go("experience"); } },
    { icon: "→", label: "Go to education", hint: "education", run: function () { go("education"); } },
    { icon: "→", label: "Go to certifications", hint: "certs", run: function () { go("certifications"); } },
    { icon: "→", label: "Go to contact", hint: "contact", run: function () { go("contact"); } },
    { icon: "◐", label: "Toggle light / dark", hint: "theme", run: toggleTheme },
    { icon: "▚", label: "Enter the matrix", hint: "easter egg", run: function () { setTheme("matrix"); } },
    { icon: "_", label: "Focus the terminal", hint: "shell", run: function () { if (input) input.focus(); } },
    { icon: "@", label: "Email Aayush", hint: "mailto", run: function () { window.location.href = "mailto:aayush15a@gmail.com"; } },
    { icon: "in", label: "Open LinkedIn", hint: "↗", run: function () { window.open("https://www.linkedin.com/in/aayushnagar/", "_blank", "noopener"); } }
  ];
  var pActive = 0, pFiltered = ACTIONS.slice();

  function renderPalette() {
    pList.innerHTML = "";
    pFiltered.forEach(function (a, i) {
      var li = document.createElement("li");
      li.className = "palette-item" + (i === pActive ? " active" : "");
      li.setAttribute("role", "option");
      li.innerHTML =
        "<span class='pi-icon'>" + esc(a.icon) + "</span><span>" + esc(a.label) +
        "</span><span class='pi-hint'>" + esc(a.hint) + "</span>";
      li.addEventListener("click", function () { fire(i); });
      pList.appendChild(li);
    });
  }
  function filterPalette(q) {
    q = q.toLowerCase();
    pFiltered = ACTIONS.filter(function (a) {
      return (a.label + " " + a.hint).toLowerCase().indexOf(q) !== -1;
    });
    pActive = 0;
    renderPalette();
  }
  function openPalette() {
    if (!overlay) return;
    overlay.hidden = false;
    pInput.value = "";
    filterPalette("");
    pInput.focus();
  }
  function closePalette() { if (overlay) overlay.hidden = true; }
  function fire(i) {
    var a = pFiltered[i];
    if (!a) return;
    closePalette();
    track("palette-" + slug(a.label), "Palette: " + a.label);
    a.run();
  }
  if (overlay && pInput && pList) {
    pInput.addEventListener("input", function () { filterPalette(pInput.value); });
    pInput.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown") { e.preventDefault(); pActive = Math.min(pActive + 1, pFiltered.length - 1); renderPalette(); }
      else if (e.key === "ArrowUp") { e.preventDefault(); pActive = Math.max(pActive - 1, 0); renderPalette(); }
      else if (e.key === "Enter") { e.preventDefault(); fire(pActive); }
    });
    overlay.addEventListener("click", function (e) { if (e.target === overlay) closePalette(); });
  }

  var paletteOpen = document.getElementById("palette-open");
  if (paletteOpen) {
    paletteOpen.hidden = false;
    paletteOpen.textContent = isMac ? "⌘K" : "Ctrl K";
    paletteOpen.addEventListener("click", openPalette);
  }

  /* ---------- Global keys ---------- */
  document.addEventListener("keydown", function (e) {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      overlay && overlay.hidden ? openPalette() : closePalette();
    } else if (e.key === "Escape") {
      if (overlay && !overlay.hidden) closePalette();
      else if (canvas && !canvas.hidden) stopMatrix();
    }
  });

  /* ---------- Konami code → matrix ---------- */
  var konami = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
  var kIdx = 0;
  document.addEventListener("keydown", function (e) {
    kIdx = (e.keyCode === konami[kIdx]) ? kIdx + 1 : (e.keyCode === konami[0] ? 1 : 0);
    if (kIdx === konami.length) { kIdx = 0; setTheme("matrix"); }
  });
})();
