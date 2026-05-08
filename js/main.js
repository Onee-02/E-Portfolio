/* ============================================
   E-PORTFOLIO - main.js
   ============================================ */

// ── Active Nav Link ──
function setActiveNav() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('nav a');
  navLinks.forEach(link => {
    const linkPage = link.getAttribute('href');
    if (linkPage === currentPage) {
      link.classList.add('active');
    }
  });
}

// ── Tabs (for Relevant Works) ──
function initTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  if (tabBtns.length === 0) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-tab');

      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const targetContent = document.getElementById(target);
      if (targetContent) targetContent.classList.add('active');
    });
  });
}

// ── Read More Toggle (artifact cards) ──
function initReadMore() {
  document.addEventListener('click', function (e) {
    if (e.target.classList.contains('read-more')) {
      const card = e.target.closest('.card');
      const preview = card.querySelector('.writeup-preview');
      const full = card.querySelector('.writeup-full');

      if (full.style.display === 'block') {
        full.style.display = 'none';
        preview.style.display = 'block';
        e.target.textContent = 'Read more';
      } else {
        full.style.display = 'block';
        preview.style.display = 'none';
        e.target.textContent = 'Read less';
      }
    }
  });
}

// ── Load Artifact Cards from works.json ──
async function loadWorks() {
  const container = document.getElementById('works-container');
  if (!container) return;

  try {
    const res = await fetch('data/works.json');
    const data = await res.json();

    // Build tabs
    const tabsEl = document.getElementById('works-tabs');
    const contentsEl = document.getElementById('works-contents');

    data.courses.forEach((course, index) => {
      // Tab button
      const btn = document.createElement('button');
      btn.className = 'tab-btn' + (index === 0 ? ' active' : '');
      btn.setAttribute('data-tab', `course-${index}`);
      btn.textContent = `${course.code} - ${course.name}`;
      tabsEl.appendChild(btn);

      // Tab content
      const content = document.createElement('div');
      content.className = 'tab-content' + (index === 0 ? ' active' : '');
      content.id = `course-${index}`;

      if (!course.artifacts || course.artifacts.length === 0) {
        content.innerHTML = `<div class="empty-state">No artifacts added yet.</div>`;
      } else {
        const grid = document.createElement('div');
        grid.className = 'cards-grid';

        course.artifacts.forEach((artifact, aIndex) => {
          const card = document.createElement('div');
          card.className = 'card';

          const previewText = artifact.writeup.length > 160
            ? artifact.writeup.substring(0, 160) + '...'
            : artifact.writeup;

          const hasMore = artifact.writeup.length > 160;

          card.innerHTML = `
            <div class="card-label">Artifact ${aIndex + 1}</div>
            <h3>${artifact.title}</h3>
            <div class="writeup-preview">${previewText}</div>
            ${hasMore ? `
              <div class="writeup-full">${artifact.writeup}</div>
              <button class="read-more">Read more</button>
            ` : ''}
            <div class="card-actions">
              ${artifact.file
                ? `<a href="assets/works/${course.folder}/${artifact.file}" target="_blank" class="btn btn-primary">View</a>
                   <a href="assets/works/${course.folder}/${artifact.file}" download class="btn btn-outline">Download</a>`
                : artifact.link
                  ? `<a href="${artifact.link}" target="_blank" class="btn btn-primary">Open Link</a>`
                  : `<span style="font-size:0.85rem;color:var(--text-light);font-style:italic;">File coming soon</span>`
              }
            </div>
          `;

          grid.appendChild(card);
        });

        content.appendChild(grid);
      }

      contentsEl.appendChild(content);
    });

    // Re-init tabs after dynamic render
    initTabs();

  } catch (err) {
    container.innerHTML = `<div class="empty-state">Could not load works. Make sure data/works.json exists.</div>`;
  }
}

// ── Load Achievements from achievements.json ──
async function loadAchievements() {
  const container = document.getElementById('achievements-container');
  if (!container) return;

  try {
    const res = await fetch('data/achievements.json');
    const data = await res.json();

    if (!data.achievements || data.achievements.length === 0) {
      container.innerHTML = `<div class="empty-state">No achievements added yet.</div>`;
      return;
    }

    // Group by type
    const groups = {};
    data.achievements.forEach(item => {
      if (!groups[item.type]) groups[item.type] = [];
      groups[item.type].push(item);
    });

    Object.entries(groups).forEach(([type, items]) => {
      const section = document.createElement('div');
      section.className = 'academics-block';
      section.innerHTML = `<h2>${type}</h2>`;

      items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'achievement-card';
        card.innerHTML = `
          <div class="achievement-type">${type}</div>
          <div class="achievement-body">
            <h3>${item.title}</h3>
            <div class="date">${item.date}</div>
            <p>${item.description}</p>
          </div>
        `;
        section.appendChild(card);
      });

      container.appendChild(section);
    });

  } catch (err) {
    container.innerHTML = `<div class="empty-state">Could not load achievements. Make sure data/achievements.json exists.</div>`;
  }
}

// ── Init ──
document.addEventListener('DOMContentLoaded', () => {
  setActiveNav();
  initTabs();
  initReadMore();
  loadWorks();
  loadAchievements();
});
