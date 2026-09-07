const data = window.PORTFOLIO_DATA || { projects: [], work: [] };

document.getElementById("year").textContent = new Date().getFullYear();

// Securely render text without inserting untrusted HTML.
function textElement(tag, text, className = "") {
  const el = document.createElement(tag);
  if (className) el.className = className;
  el.textContent = text;
  return el;
}
function safeUrl(value) {
  try {
    const url = new URL(value, window.location.href);
    return ["http:", "https:", "mailto:"].includes(url.protocol) ? url.href : "#";
  } catch { return "#"; }
}

const projectGrid = document.getElementById("projectGrid");
data.projects.forEach((project, index) => {
  const card = document.createElement("article");
  card.className = "project-card";
  const visual = document.createElement("div");
  visual.className = "project-visual";
  visual.appendChild(textElement("div", project.visual || String(index + 1).padStart(2, "0"), "project-number"));
  const content = document.createElement("div");
  content.className = "card-content";
  content.appendChild(textElement("h3", project.title));
  content.appendChild(textElement("p", project.description));
  const tags = document.createElement("div"); tags.className = "tags";
  (project.tags || []).forEach(tag => tags.appendChild(textElement("span", tag)));
  content.appendChild(tags);
  if (project.link && project.link !== "#") {
    const link = document.createElement("a");
    link.className = "card-link"; link.href = safeUrl(project.link);
    link.target = "_blank"; link.rel = "noopener noreferrer";
    link.textContent = "View project ↗"; content.appendChild(link);
  }
  card.append(visual, content); projectGrid.appendChild(card);
});

const workGrid = document.getElementById("workGrid");
data.work.forEach(work => {
  const card = document.createElement("article"); card.className = "work-card";
  const thumb = document.createElement("div"); thumb.className = "work-thumb";
  if (work.thumbnail) {
    const img = document.createElement("img"); img.src = work.thumbnail; img.alt = work.title;
    thumb.classList.add("has-image"); thumb.appendChild(img);
  }
  thumb.appendChild(textElement("div", "▶", "play"));
  if (work.link && work.link !== "#") {
    thumb.style.cursor = "pointer";
    thumb.addEventListener("click", () => window.open(safeUrl(work.link), "_blank", "noopener"));
  }
  const content = document.createElement("div"); content.className = "card-content";
  content.appendChild(textElement("h3", work.title));
  content.appendChild(textElement("p", work.description));
  const tags = document.createElement("div"); tags.className = "tags";
  (work.tags || []).forEach(tag => tags.appendChild(textElement("span", tag)));
  content.appendChild(tags);
  if (work.link && work.link !== "#") {
    const link = document.createElement("a"); link.className = "card-link";
    link.href = safeUrl(work.link); link.target = "_blank"; link.rel = "noopener noreferrer";
    link.textContent = "Watch work ↗"; content.appendChild(link);
  }
  card.append(thumb, content); workGrid.appendChild(card);
});

// 3D portrait interaction.
const portrait = document.getElementById("portraitCard");
const world = document.querySelector(".portrait-world");
if (portrait && world) {
  world.addEventListener("pointermove", (e) => {
    const r = world.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5;
    const y = (e.clientY - r.top) / r.height - .5;
    portrait.style.transform = `rotateY(${x * 18}deg) rotateX(${-y * 14}deg) translateZ(20px)`;
  });
  world.addEventListener("pointerleave", () => portrait.style.transform = "rotateY(0deg) rotateX(0deg)");
}

// 3D tilt cards.
document.querySelectorAll(".tilt").forEach(card => {
  card.addEventListener("pointermove", e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5;
    const y = (e.clientY - r.top) / r.height - .5;
    card.style.transform = `rotateY(${x * 9}deg) rotateX(${-y * 9}deg) translateZ(10px)`;
  });
  card.addEventListener("pointerleave", () => card.style.transform = "");
});

// Cursor glow.
const glow = document.getElementById("cursorGlow");
window.addEventListener("pointermove", e => {
  glow.style.left = e.clientX + "px";
  glow.style.top = e.clientY + "px";
});

// Mobile navigation.
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");
menuBtn.addEventListener("click", () => navLinks.classList.toggle("open"));
navLinks.querySelectorAll("a").forEach(a => a.addEventListener("click", () => navLinks.classList.remove("open")));

// Reveal sections.
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add("show"); });
}, { threshold: .12 });
document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

// Lightweight animated 3D-space particles.
const canvas = document.getElementById("spaceCanvas");
const ctx = canvas.getContext("2d");
let particles = [];
function resizeCanvas() {
  canvas.width = innerWidth * devicePixelRatio;
  canvas.height = innerHeight * devicePixelRatio;
  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  particles = Array.from({length: Math.min(90, Math.floor(innerWidth / 16))}, () => ({
    x: Math.random() * innerWidth, y: Math.random() * innerHeight,
    z: Math.random() * 1 + .2, speed: Math.random() * .22 + .05
  }));
}
function animate() {
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  for (const p of particles) {
    p.y -= p.speed * p.z;
    if (p.y < -5) { p.y = innerHeight + 5; p.x = Math.random() * innerWidth; }
    const size = p.z * 1.8;
    ctx.beginPath(); ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(160, 190, 255, ${0.08 + p.z * 0.18})`; ctx.fill();
  }
  requestAnimationFrame(animate);
}
addEventListener("resize", resizeCanvas); resizeCanvas(); animate();
