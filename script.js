// ============================================================
// BEYOND THE GAME — script.js
// Requires data.js to be loaded first in index.html
// ============================================================

// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  const isOpen = navLinks.classList.contains('open');
  spans[0].style.transform = isOpen ? 'rotate(45deg) translate(5px, 5px)' : '';
  spans[1].style.opacity = isOpen ? '0' : '';
  spans[2].style.transform = isOpen ? 'rotate(-45deg) translate(5px, -5px)' : '';
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

// ===== SCROLL ANIMATIONS =====
const animateObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const siblings = Array.from(entry.target.parentElement.children);
      const index = siblings.indexOf(entry.target);
      setTimeout(() => entry.target.classList.add('visible'), index * 110);
      animateObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

function observeAnimations() {
  document.querySelectorAll('[data-animate]').forEach(el => animateObserver.observe(el));
}

// ===== ACTIVE NAV HIGHLIGHT =====
const allSections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  let current = '';
  allSections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 120) current = section.getAttribute('id');
  });
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.style.color = a.getAttribute('href') === `#${current}` ? '#e8a020' : '';
  });
});

// ===== MOOD TRACKER =====
const moodMessages = {
  1: "😢 Very Low — It's okay, we're here for you.",
  2: "😟 Low — Rough day. You're not alone.",
  3: "😐 Neutral — Steady. That's progress too.",
  4: "🙂 Good — Nice! Keep going.",
  5: "😊 Great — Wonderful! You're doing amazing."
};
let selectedMood = null;

function selectMood(btn, level) {
  document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  selectedMood = level;
  document.getElementById('moodLabel').textContent = moodMessages[level];
  document.getElementById('logMoodBtn').style.display = 'inline-block';

  const tip = BTGData.mentalSupport.moodTips.find(t => t.moodScore === level);
  if (tip) {
    const tipBox = document.getElementById('moodTipBox');
    if (tipBox) {
      tipBox.innerHTML = `
        <div class="mood-tip-affirmation">"${tip.affirmation}"</div>
        <div class="mood-tip-actions">
          <strong>Suggested right now:</strong>
          <ul>${tip.immediateActions.slice(0, 2).map(a => `<li>${a}</li>`).join('')}</ul>
        </div>
        ${tip.crisisNote ? `<div class="mood-crisis-note">⚠️ ${tip.crisisText}</div>` : ''}
      `;
      tipBox.style.display = 'block';
    }
  }
}

function logMood() {
  if (!selectedMood) return;
  const todayBar = document.querySelector('.today-bar');
  const heights = { 1: '20%', 2: '35%', 3: '55%', 4: '75%', 5: '95%' };
  const colors  = { 1: '#ef4444', 2: '#f97316', 3: '#f59e0b', 4: '#22c55e', 5: '#3b82f6' };
  todayBar.style.height = heights[selectedMood];
  todayBar.style.background = colors[selectedMood];
  todayBar.style.border = 'none';
  document.getElementById('logMoodBtn').style.display = 'none';
  document.getElementById('moodLogged').style.display = 'block';
}

// ===== CONTACT FORM =====
function submitForm(e) {
  e.preventDefault();
  document.getElementById('contactForm').style.display = 'none';
  document.getElementById('formSuccess').style.display = 'block';
  document.getElementById('formSuccess').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// ===== COUNTER ANIMATION =====
function animateCounter(el, target, duration = 1500) {
  if (isNaN(parseInt(target))) return;
  const num = parseInt(target);
  const hasSuffix = target.includes('+');
  let start = 0;
  const increment = num / (duration / 16);
  const timer = setInterval(() => {
    start += increment;
    if (start >= num) { el.textContent = target; clearInterval(timer); }
    else { el.textContent = Math.floor(start) + (hasSuffix ? '+' : ''); }
  }, 16);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      document.querySelectorAll('.stat-num').forEach(stat => animateCounter(stat, stat.textContent));
      statsObserver.disconnect();
    }
  });
}, { threshold: 0.5 });

const statsEl = document.querySelector('.hero-stats');
if (statsEl) statsObserver.observe(statsEl);

// ===== ACCORDION =====
function toggleAccordion(index) {
  const body = document.getElementById(`prog-${index}`);
  const arrow = document.getElementById(`arrow-${index}`);
  const isOpen = body.style.display !== 'none';
  body.style.display = isOpen ? 'none' : 'block';
  arrow.textContent = isOpen ? '▼' : '▲';
}

// ===== MODAL =====
function closeModal() {
  const modal = document.getElementById('storyModal');
  if (modal) { modal.style.display = 'none'; document.body.style.overflow = ''; }
}

// ===== OPEN STORY MODAL =====
function openStory(id) {
  const story = BTGData.mentalSupport.motivationalStories.find(s => s.id === id);
  if (!story) return;
  const modal = document.getElementById('storyModal');
  if (!modal) return;
  modal.innerHTML = `
    <div class="modal-overlay" onclick="closeModal()">
      <div class="modal-box" onclick="event.stopPropagation()">
        <button class="modal-close" onclick="closeModal()">✕</button>
        <div class="modal-avatar">${story.name.split(' ').map(n => n[0]).join('')}</div>
        <h3>${story.name}</h3>
        <div class="modal-meta">${story.sport} · ${story.country}</div>
        <div class="modal-injury">🩹 ${story.injury}</div>
        <blockquote class="modal-quote">"${story.shortQuote}"</blockquote>
        <p class="modal-body">${story.fullStory}</p>
        <div class="modal-turning"><strong>🔑 Turning Point:</strong> "${story.keyTurningPoint}"</div>
        <div class="modal-advice"><strong>💬 Advice:</strong> "${story.adviceToOthers}"</div>
        <div class="modal-timeline">
          <strong>📅 Recovery Timeline:</strong>
          <div class="timeline-items">
            ${story.timeline.map(t => `<div class="timeline-item"><span class="tl-month">Month ${t.month}</span><span class="tl-event">${t.event}</span></div>`).join('')}
          </div>
        </div>
        <div class="modal-now">✅ Today: ${story.currentRole}</div>
      </div>
    </div>
  `;
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

// ===== OPEN CAREER PATH MODAL =====
function openCareerPath(id) {
  const path = BTGData.careerOpportunities.careerPaths.find(p => p.id === id);
  if (!path) return;
  const modal = document.getElementById('storyModal');
  if (!modal) return;
  modal.innerHTML = `
    <div class="modal-overlay" onclick="closeModal()">
      <div class="modal-box" onclick="event.stopPropagation()">
        <button class="modal-close" onclick="closeModal()">✕</button>
        <div style="text-align:center;font-size:3rem">${path.emoji}</div>
        <h3>${path.title}</h3>
        <div class="modal-meta">${path.category} · ${path.difficulty} · Launch: ${path.timeToLaunch}</div>
        <div class="modal-income">💰 ${path.potentialIncome}</div>
        <p class="modal-body">${path.fullDescription}</p>
        <div class="modal-strengths">
          <strong>💪 Your Athletic Skills That Apply:</strong>
          <ul>${path.athleteStrengthsUsed.map(s => `<li>${s}</li>`).join('')}</ul>
        </div>
        <div class="modal-roadmap">
          <strong>📍 Step-by-Step Roadmap:</strong>
          ${path.stepByStepRoadmap.map(s => `
            <div class="roadmap-step">
              <span class="roadmap-num">${s.step}</span>
              <div><div class="roadmap-action">${s.action}</div><div class="roadmap-time">${s.timeline}</div></div>
            </div>
          `).join('')}
        </div>
        <a href="#contact" class="btn btn-primary" style="margin-top:1.5rem;display:block;text-align:center;" onclick="closeModal()">Get Career Guidance →</a>
      </div>
    </div>
  `;
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

// ===== OPEN CIRCLE MODAL =====
function openCircle(id) {
  const circle = BTGData.community.sportsCircles.find(c => c.id === id);
  if (!circle) return;
  const modal = document.getElementById('storyModal');
  if (!modal) return;
  const posts = BTGData.community.forumPosts.filter(p => p.circleId === id);
  modal.innerHTML = `
    <div class="modal-overlay" onclick="closeModal()">
      <div class="modal-box" onclick="event.stopPropagation()">
        <button class="modal-close" onclick="closeModal()">✕</button>
        <div style="font-size:3rem;text-align:center">${circle.emoji}</div>
        <h3 style="text-align:center">${circle.name}</h3>
        <div class="modal-meta" style="text-align:center">👥 ${circle.memberCount.toLocaleString()} members · ${circle.sport}</div>
        <p class="modal-body">${circle.description}</p>
        <div class="circle-focus"><strong>Focus Areas:</strong><div class="focus-tags">${circle.focusAreas.map(f => `<span class="spec-tag">${f}</span>`).join('')}</div></div>
        <div class="circle-events"><strong>📅 Weekly Events:</strong><ul>${circle.weeklyEvents.map(e => `<li>${e}</li>`).join('')}</ul></div>
        ${posts.length > 0 ? `<div class="circle-posts"><strong>💬 Recent Posts:</strong>${posts.map(p => `<div class="forum-post-preview"><div class="fp-author">${p.authorInitials} · ${p.authorSport} · ${p.timestamp}</div><div class="fp-title">${p.isPinned ? '📌 ' : ''}${p.title}</div><div class="fp-content">${p.content.substring(0, 120)}...</div><div class="fp-stats">❤️ ${p.likes} · 💬 ${p.replies} replies</div></div>`).join('')}</div>` : ''}
        <a href="#contact" class="btn btn-primary" style="margin-top:1.5rem;display:block;text-align:center;" onclick="closeModal()">Join This Circle</a>
      </div>
    </div>
  `;
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

// ============================================================
// RENDER FUNCTIONS — Populate page with data
// ============================================================

function renderStories() {
  const container = document.getElementById('storiesGrid');
  if (!container) return;
  container.innerHTML = '';
  BTGData.mentalSupport.motivationalStories.forEach(story => {
    const card = document.createElement('div');
    card.className = 'story-card';
    card.setAttribute('data-animate', '');
    card.innerHTML = `
      <div class="story-header">
        <div class="story-avatar">${story.name.split(' ').map(n => n[0]).join('')}</div>
        <div><div class="story-name">${story.name}</div><div class="story-meta">${story.sport} · ${story.country}</div></div>
      </div>
      <div class="story-injury">🩹 ${story.injury}</div>
      <blockquote class="story-quote">"${story.shortQuote}"</blockquote>
      <p class="story-excerpt">${story.fullStory.substring(0, 180)}...</p>
      <div class="story-now">✅ Now: ${story.currentRole}</div>
      <button class="story-read-btn" onclick="openStory('${story.id}')">Read Full Story →</button>
    `;
    container.appendChild(card);
  });
}

function renderJournalPrompts() {
  const container = document.getElementById('journalGrid');
  if (!container) return;
  container.innerHTML = '';
  BTGData.mentalSupport.journalPrompts.forEach(prompt => {
    const card = document.createElement('div');
    card.className = 'journal-card';
    card.setAttribute('data-animate', '');
    card.innerHTML = `
      <div class="journal-header"><span class="journal-icon">${prompt.icon}</span><span class="journal-badge">${prompt.category}</span></div>
      <div class="journal-week">Week ${prompt.week} · Day ${prompt.day}</div>
      <h4 class="journal-title">${prompt.title}</h4>
      <p class="journal-prompt">${prompt.prompt}</p>
      <div class="journal-followup"><strong>Follow-up:</strong> ${prompt.followUp}</div>
      <div class="journal-meta"><span>🧠 ${prompt.therapyFramework}</span><span>⏱ ${prompt.estimatedTime}</span></div>
    `;
    container.appendChild(card);
  });
}

function renderDailyTasks() {
  const container = document.getElementById('tasksGrid');
  if (!container) return;
  container.innerHTML = '';
  BTGData.mentalSupport.dailyTasks.slice(0, 4).forEach((task, index) => {
    const card = document.createElement('div');
    card.className = `task-card ${index === 0 ? 'task-today' : ''}`;
    card.setAttribute('data-animate', '');
    card.innerHTML = `
      <div class="task-card-header">
        <span class="task-icon">${task.icon}</span>
        <span class="task-badge">${task.difficulty}</span>
        ${index === 0 ? '<span class="task-today-badge">Today</span>' : ''}
      </div>
      <h4 class="task-title">${task.title}</h4>
      <div class="task-cat">${task.category} · ${task.duration}</div>
      <p class="task-desc">${task.description}</p>
      <div class="task-why"><strong>Why this helps:</strong> ${task.why}</div>
    `;
    container.appendChild(card);
  });
}

function renderTherapists() {
  const container = document.getElementById('therapistsGrid');
  if (!container) return;
  container.innerHTML = '';
  BTGData.physicalSupport.therapistProfiles.forEach(therapist => {
    const card = document.createElement('div');
    card.className = 'therapist-card';
    card.setAttribute('data-animate', '');
    card.innerHTML = `
      <div class="therapist-top">
        <div class="therapist-avatar">${therapist.name.replace('Dr. ','').split(' ').map(n=>n[0]).join('').slice(0,2)}</div>
        <div><div class="therapist-name">${therapist.name}</div><div class="therapist-title">${therapist.title}</div><div class="therapist-country">📍 ${therapist.country}</div></div>
      </div>
      <div class="therapist-rating">${'★'.repeat(Math.floor(therapist.rating))} <span>${therapist.rating} (${therapist.reviewCount} reviews)</span></div>
      <p class="therapist-bio">${therapist.shortBio}</p>
      <div class="therapist-specs">${therapist.specializations.slice(0,3).map(s=>`<span class="spec-tag">${s}</span>`).join('')}</div>
      <div class="therapist-avail">🕐 ${therapist.availability}</div>
      <div class="therapist-price">💰 ${therapist.sessionPrice} ${therapist.currency} / session</div>
      <blockquote class="therapist-quote">"${therapist.patientQuote}"</blockquote>
      <a href="#contact" class="btn btn-primary" style="margin-top:1rem;display:block;text-align:center;">Book a Session</a>
    `;
    container.appendChild(card);
  });
}

function renderExercises() {
  const container = document.getElementById('exerciseAccordion');
  if (!container) return;
  container.innerHTML = '';
  BTGData.physicalSupport.exercisePrograms.forEach((program, pi) => {
    const section = document.createElement('div');
    section.className = 'exercise-program';
    section.setAttribute('data-animate', '');
    section.innerHTML = `
      <div class="exercise-program-header" onclick="toggleAccordion(${pi})">
        <div><h4>${program.programName}</h4><div class="ex-meta">${program.targetInjury} · ${program.durationWeeks} weeks · ${program.weeklyFrequency}</div></div>
        <span class="accordion-arrow" id="arrow-${pi}">▼</span>
      </div>
      <div class="exercise-program-body" id="prog-${pi}" style="display:none;">
        <div class="ex-goal"><strong>Goal:</strong> ${program.goal}</div>
        ${program.physioReviewRequired ? '<div class="ex-warning">⚠️ Physiotherapist review required before starting this program.</div>' : ''}
        <div class="exercises-list">
          ${program.exercises.map(ex => `
            <div class="exercise-item">
              <div class="ex-item-header"><span class="ex-item-icon">${ex.icon}</span><strong>${ex.name}</strong><span class="ex-difficulty">${ex.difficulty}</span></div>
              <div class="ex-stats">${ex.sets} sets × ${ex.reps} reps${ex.holdSeconds > 0 ? ` · Hold ${ex.holdSeconds}s` : ''} · Rest ${ex.restSeconds}s</div>
              <p class="ex-desc">${ex.description}</p>
              <div class="ex-purpose"><strong>Purpose:</strong> ${ex.purpose}</div>
              ${ex.warnings.length ? `<div class="ex-warnings">⚠️ ${ex.warnings.join(' | ')}</div>` : ''}
            </div>
          `).join('')}
        </div>
        <div class="ex-progression"><strong>Progression:</strong> ${program.progressionCriteria}</div>
      </div>
    `;
    container.appendChild(section);
  });
}

function renderNutrition() {
  const container = document.getElementById('nutritionPlan');
  if (!container) return;
  const plan = BTGData.physicalSupport.nutritionPlans[0];
  if (!plan) return;
  container.innerHTML = `
    <div class="nutrition-header" data-animate>
      <h4>${plan.planName}</h4>
      <div class="nutrition-meta">By ${plan.nutritionistName} · ${plan.qualifications[0]}</div>
      <p class="nutrition-guidance">${plan.caloricGuidance}</p>
    </div>
    <div class="nutrition-sections">
      <div class="nutrition-block" data-animate>
        <h5>🥦 Key Nutrients for Recovery</h5>
        <div class="nutrients-grid">${plan.keyNutrients.map(n=>`<div class="nutrient-card"><div class="nutrient-name">${n.nutrient}</div><div class="nutrient-target">📏 ${n.dailyTarget}</div><div class="nutrient-purpose">${n.purpose}</div><div class="nutrient-sources"><strong>Sources:</strong> ${n.sources.slice(0,3).join(', ')}</div></div>`).join('')}</div>
      </div>
      <div class="nutrition-block" data-animate>
        <h5>🍽️ Sample Day Meal Plan</h5>
        <div class="meals-list">${plan.sampleDayMealPlan.map(meal=>`<div class="meal-row"><div class="meal-time">${meal.time}</div><div class="meal-info"><div class="meal-name">${meal.meal}</div><div class="meal-example">${meal.example}</div><div class="meal-note">${meal.notes}</div></div><div class="meal-protein">${meal.proteinG}g protein</div></div>`).join('')}</div>
      </div>
      <div class="nutrition-block" data-animate>
        <h5>🚫 Foods to Avoid</h5>
        <div class="avoid-grid">${plan.foodsToAvoid.map(f=>`<div class="avoid-item"><div class="avoid-food">❌ ${f.food}</div><div class="avoid-reason">${f.reason}</div></div>`).join('')}</div>
        <div class="hydration-note">💧 <strong>Hydration:</strong> ${plan.hydrationGuidance}</div>
      </div>
    </div>
  `;
}

function renderCareerPaths() {
  const container = document.getElementById('careerPathsGrid');
  if (!container) return;
  container.innerHTML = '';
  BTGData.careerOpportunities.careerPaths.forEach(path => {
    const card = document.createElement('div');
    card.className = 'path-card';
    card.setAttribute('data-animate', '');
    card.innerHTML = `
      <div class="path-emoji">${path.emoji}</div>
      <h4>${path.title}</h4>
      <div class="path-meta"><span class="path-cat">${path.category}</span><span class="path-diff">${path.difficulty}</span></div>
      <p>${path.shortDescription}</p>
      <div class="path-income">💰 ${path.potentialIncome}</div>
      <div class="path-launch">⏱ Launch in: ${path.timeToLaunch}</div>
      <button class="path-expand-btn" onclick="openCareerPath('${path.id}')">View Roadmap →</button>
    `;
    container.appendChild(card);
  });
}

function renderMentors() {
  const container = document.getElementById('mentorsGrid');
  if (!container) return;
  container.innerHTML = '';
  BTGData.careerOpportunities.mentorProfiles.forEach(mentor => {
    const card = document.createElement('div');
    card.className = 'mentor-card';
    card.setAttribute('data-animate', '');
    card.innerHTML = `
      <div class="mentor-top">
        <div class="mentor-avatar">${mentor.name.split(' ').map(n=>n[0]).join('').slice(0,2)}</div>
        <div><div class="mentor-name">${mentor.name}</div><div class="mentor-sport">${mentor.formerSport}</div><div class="mentor-role">Now: ${mentor.currentRole}</div></div>
      </div>
      <div class="mentor-injury">🩹 ${mentor.injury}</div>
      <div class="mentor-rating">${'★'.repeat(Math.floor(mentor.rating))} ${mentor.rating} (${mentor.reviewCount} reviews)</div>
      <p class="mentor-bio">${mentor.shortBio}</p>
      <div class="mentor-specialties">${mentor.mentorSpecialties.slice(0,3).map(s=>`<span class="spec-tag">${s}</span>`).join('')}</div>
      <div class="mentor-price">💰 ${mentor.sessionPrice} ${mentor.currency} / ${mentor.sessionDuration}min</div>
      <div class="mentor-avail">🕐 ${mentor.availability}</div>
      <blockquote class="mentor-quote">"${mentor.menteeQuote}"</blockquote>
      <a href="#contact" class="btn btn-primary" style="margin-top:1rem;display:block;text-align:center;">Book Mentor Session</a>
    `;
    container.appendChild(card);
  });
}

function renderSkillsMap() {
  const container = document.getElementById('skillsMapGrid');
  if (!container) return;
  container.innerHTML = '';
  BTGData.careerOpportunities.skillsMapping.forEach(skill => {
    const row = document.createElement('div');
    row.className = 'skill-row';
    row.setAttribute('data-animate', '');
    row.innerHTML = `
      <div class="skill-from">${skill.athleticSkill}</div>
      <div class="skill-arrow">${skill.icon} →</div>
      <div class="skill-to">${skill.professionalTranslation}</div>
    `;
    container.appendChild(row);
  });
}

function renderTestimonials() {
  const container = document.querySelector('.testimonials');
  if (!container) return;
  container.innerHTML = '';
  BTGData.community.testimonials.forEach(t => {
    const card = document.createElement('div');
    card.className = 'testimonial';
    card.setAttribute('data-animate', '');
    card.innerHTML = `
      <div class="quote">${t.shortQuote}</div>
      <div class="testimonial-author">
        <div class="author-avatar">${t.initials}</div>
        <div><div class="author-name">${t.name}</div><div class="author-sport">${t.sport} · ${t.injury}</div></div>
      </div>
      <div class="testimonial-outcome">✅ ${t.outcome}</div>
    `;
    container.appendChild(card);
  });
}

function renderSportsCircles() {
  const container = document.querySelector('.community-circles');
  if (!container) return;
  container.innerHTML = '';
  BTGData.community.sportsCircles.forEach(circle => {
    const badge = document.createElement('div');
    badge.className = 'circle-badge';
    badge.setAttribute('data-animate', '');
    badge.textContent = `${circle.emoji} ${circle.name} (${circle.memberCount.toLocaleString()})`;
    badge.addEventListener('click', () => openCircle(circle.id));
    container.appendChild(badge);
  });
}

function renderForumPosts() {
  const container = document.getElementById('forumPosts');
  if (!container) return;
  container.innerHTML = '';
  BTGData.community.forumPosts.forEach(post => {
    const card = document.createElement('div');
    card.className = 'forum-card';
    card.setAttribute('data-animate', '');
    card.innerHTML = `
      <div class="forum-card-header">
        <div class="forum-author">
          <div class="author-avatar" style="width:36px;height:36px;font-size:0.75rem">${post.authorInitials}</div>
          <div><div class="author-name" style="font-size:0.85rem">${post.authorSport} · ${post.authorCountry}</div><div style="font-size:0.75rem;color:#94a3b8">${post.timestamp}</div></div>
        </div>
        ${post.isPinned ? '<span class="pinned-badge">📌 Pinned</span>' : ''}
      </div>
      <h4 class="forum-title">${post.title}</h4>
      <p class="forum-content">${post.content.substring(0, 160)}...</p>
      <div class="forum-footer">
        <span>❤️ ${post.likes}</span>
        <span>💬 ${post.replies} replies</span>
        <div class="forum-tags">${post.tags.slice(0,3).map(t=>`<span class="forum-tag">#${t}</span>`).join('')}</div>
      </div>
    `;
    container.appendChild(card);
  });
}

// ============================================================
// INIT — Run everything on page load
// ============================================================
window.addEventListener('DOMContentLoaded', () => {
  renderStories();
  renderJournalPrompts();
  renderDailyTasks();
  renderTherapists();
  renderExercises();
  renderNutrition();
  renderCareerPaths();
  renderMentors();
  renderSkillsMap();
  renderTestimonials();
  renderSportsCircles();
  renderForumPosts();
  observeAnimations();
});

window.addEventListener('load', () => {
  const heroContent = document.querySelector('.hero-content');
  if (heroContent) heroContent.style.animation = 'fadeUp 0.9s ease both';
});

// ============================================================
// AI SEARCH (Groq direct from browser)
// ============================================================

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.3-70b-versatile';
// Set your key here OR define `window.GROQ_API_KEY` OR set localStorage.GROQ_API_KEY.
const GROQ_API_KEY = (
  window.GROQ_API_KEY ||
  localStorage.getItem('GROQ_API_KEY') ||
  ''
).trim();

const GEMINI_SECTION_CONFIG = {
  stories: {
    title: 'Motivational Stories',
    defaultContainerId: 'storiesGrid',
    promptFocus: 'realistic examples of athlete recovery and reinvention stories'
  },
  journal: {
    title: 'Journal Prompts',
    defaultContainerId: 'journalGrid',
    promptFocus: 'structured, therapeutic journaling prompts for injured athletes'
  },
  tasks: {
    title: 'Daily Tasks',
    defaultContainerId: 'tasksGrid',
    promptFocus: 'small, practical daily tasks that improve emotional recovery and momentum'
  },
  therapist: {
    title: 'Therapist Guidance',
    defaultContainerId: 'therapistsGrid',
    promptFocus: 'how to choose suitable physiotherapy support and what to ask in sessions'
  },
  exercise: {
    title: 'Exercise Plan',
    defaultContainerId: 'exerciseAccordion',
    promptFocus: 'safe, progressive recovery exercise suggestions with clear cautions'
  },
  nutrition: {
    title: 'Nutrition Plan',
    defaultContainerId: 'nutritionPlan',
    promptFocus: 'evidence-based recovery nutrition guidance and meal structure'
  },
  skills: {
    title: 'Skill Translation',
    defaultContainerId: 'skillsMapGrid',
    promptFocus: 'how athletic strengths map to workplace and business capabilities'
  },
  career: {
    title: 'Career Paths',
    defaultContainerId: 'careerPathsGrid',
    promptFocus: 'practical transition options from sport into sustainable career paths'
  },
  mentor: {
    title: 'Mentor Match',
    defaultContainerId: 'mentorsGrid',
    promptFocus: 'what type of mentor profile best fits the athlete query and why'
  }
};

function getSearchElements(section) {
  const config = GEMINI_SECTION_CONFIG[section];
  if (!config) return null;

  const input = document.getElementById(`${section}SearchInput`);
  const btnText = document.getElementById(`${section}BtnTxt`);
  const loading = document.getElementById(`${section}Loading`);
  const result = document.getElementById(`${section}GeminiResult`);
  const content = document.getElementById(`${section}GeminiContent`);
  const error = document.getElementById(`${section}Error`);
  const defaultContainer = document.getElementById(config.defaultContainerId);

  if (!input || !btnText || !loading || !result || !content || !error) return null;

  return { input, btnText, loading, result, content, error, defaultContainer, config };
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatGeminiMarkdown(rawText) {
  let html = escapeHtml(rawText)
    .replace(/^### (.+)$/gm, '<h5 class="gemini-section-title">$1</h5>')
    .replace(/^## (.+)$/gm, '<h4 class="gemini-section-title">$1</h4>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^[\-\*] (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, match => `<ul>${match}</ul>`)
    .replace(/\n\n/g, '</p><p class="gemini-para">')
    .replace(/\n/g, '<br/>');

  if (!html.includes('<p class="gemini-para">')) {
    html = `<p class="gemini-para">${html}</p>`;
  }

  return html;
}

function buildGeminiPrompt(section, query) {
  const { title, promptFocus } = GEMINI_SECTION_CONFIG[section];
  return `You are a practical support assistant for injured athletes.

Search topic: ${title}
Athlete request: "${query}"

Return a concise, useful response focused on: ${promptFocus}.

Output format:
## Quick Summary
## Actionable Guidance
## Risks or Cautions
## Next 7-Day Plan

Use clear bullet points where useful. Keep guidance realistic and safety-aware.`;
}

function setSearchBusyState(els, busy) {
  els.btnText.textContent = busy ? 'Searching...' : 'Search';
  els.input.disabled = busy;
}

async function geminiSearch(section) {
  const els = getSearchElements(section);
  if (!els) {
    console.error(`Search UI not found for section: ${section}`);
    return;
  }

  const query = els.input.value.trim();
  if (!query) {
    els.input.focus();
    els.input.style.borderColor = '#ef4444';
    setTimeout(() => { els.input.style.borderColor = ''; }, 1600);
    return;
  }

  els.loading.style.display = 'flex';
  els.result.style.display = 'none';
  els.error.style.display = 'none';
  if (els.defaultContainer) els.defaultContainer.style.display = 'none';
  setSearchBusyState(els, true);

  try {
    if (!GROQ_API_KEY || GROQ_API_KEY === 'YOUR_GROQ_API_KEY_HERE') {
      throw new Error('Groq API key is not configured in script.js.');
    }

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          { role: 'system', content: 'You help injured athletes with practical, safe guidance.' },
          { role: 'user', content: buildGeminiPrompt(section, query) }
        ],
        temperature: 0.7,
        max_tokens: 1600
      })
    });

    if (!response.ok) {
      let errPayload = null;
      try {
        errPayload = await response.json();
      } catch (parseError) {
        errPayload = null;
      }
      const apiMessage = errPayload?.error?.message || errPayload?.error || errPayload?.message;
      throw new Error(apiMessage || `API error ${response.status}`);
    }

    const data = await response.json();
    let rawText = data?.choices?.[0]?.message?.content || '';
    if (Array.isArray(rawText)) {
      rawText = rawText.map(part => (typeof part === 'string' ? part : (part?.text || ''))).join('\n');
    }
    rawText = String(rawText).trim();
    if (!rawText) throw new Error('No response received from Groq.');

    els.content.innerHTML = `
      <div class="gemini-query-tag">Results for: <em>"${escapeHtml(query)}"</em></div>
      <div class="gemini-body">${formatGeminiMarkdown(rawText)}</div>
      <div class="gemini-disclaimer">AI-generated guidance. Verify important medical, rehab, and career decisions with a qualified professional.</div>
    `;
    els.result.style.display = 'block';
    els.result.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } catch (error) {
    els.error.innerHTML = `
      <div class="error-icon">!</div>
      <div class="error-text">
        <strong>Something went wrong</strong><br/>
        ${escapeHtml(error.message)}<br/><br/>
        <small>Check GROQ_API_KEY, GROQ_MODEL, and run the page via a local server (not file://).</small>
      </div>
    `;
    els.error.style.display = 'flex';
    if (els.defaultContainer) els.defaultContainer.style.display = '';
  } finally {
    els.loading.style.display = 'none';
    setSearchBusyState(els, false);
  }
}

function quickSearch(section, query) {
  const els = getSearchElements(section);
  if (!els) return;
  els.input.value = query;
  geminiSearch(section);
}

function clearGemini(section) {
  const els = getSearchElements(section);
  if (!els) return;

  els.input.value = '';
  els.result.style.display = 'none';
  els.error.style.display = 'none';
  els.loading.style.display = 'none';
  if (els.defaultContainer) els.defaultContainer.style.display = '';
  setSearchBusyState(els, false);
}

// Backward-compatible wrappers for older nutrition calls.
function fillAndSearch(query) {
  quickSearch('nutrition', query);
}

async function searchNutritionPlan() {
  await geminiSearch('nutrition');
}

function clearNutritionResult() {
  clearGemini('nutrition');
}
