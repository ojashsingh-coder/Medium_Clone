const articles = [
  {
    author: "Ojash Singh",
    init: "O",
    color: "#16a34a",
    title: "Building My Medium Clone: What I Learned Along The Way",
    sub: "From designing the layout to handling interactions with JavaScript, these are the lessons I learned while creating my own Medium-inspired platform.",
    tag: "Web Dev",
    date: "Jun 15",
    time: "7 min",
    claps: 1284,
    comments: 86,
    icon: "🚀"
  },

  {
    author: "Gaurav Singh",
    init: "G",
    color: "#0ea5e9",
    title: "7 JavaScript Concepts That Finally Clicked For Me",
    sub: "Closures, promises, async functions and other concepts that seemed confusing until I started building real projects.",
    tag: "JavaScript",
    date: "Jun 14",
    time: "6 min",
    claps: 932,
    comments: 48,
    icon: "⚡"
  },

  {
    author: "Harsh Singh",
    init: "H",
    color: "#8b5cf6",
    title: "Simple CSS Tricks That Make Any Website Look Better",
    sub: "Small design improvements like spacing, shadows and typography can instantly transform a basic website.",
    tag: "CSS",
    date: "Jun 13",
    time: "5 min",
    claps: 1158,
    comments: 63,
    icon: "🎨"
  },

  {
    author: "Alok Singh",
    init: "A",
    color: "#f59e0b",
    title: "My Roadmap For Learning AI As A Student Developer",
    sub: "A practical path for beginners who want to explore artificial intelligence without feeling overwhelmed.",
    tag: "AI",
    date: "Jun 12",
    time: "8 min",
    claps: 1872,
    comments: 102,
    icon: "🤖"
  },

  {
    author: "Darpan Singh",
    init: "D",
    color: "#ef4444",
    title: "Projects Helped Me Learn Faster Than Tutorials",
    sub: "Why building real applications taught me more than endlessly watching coding videos online.",
    tag: "Career",
    date: "Jun 11",
    time: "6 min",
    claps: 1495,
    comments: 77,
    icon: "💼"
  }
];

const picks = [
  {
    author: "Ojash Singh",
    title: "How I Designed This Medium Clone",
    date: "Jun 15"
  },
  {
    author: "Vishal Kumar",
    title: "Frontend Habits That Improved My Code",
    date: "Jun 14"
  },
  {
    author: "MS Dhoni",
    title: "Why Every Student Should Build Projects",
    date: "Jun 13"
  }
];

const people = [
  {
    name: "Ojash Singh",
    bio: "Frontend Developer",
    init: "O",
    color: "#16a34a"
  },

  {
    name: "Sakshi Sinha",
    bio: "JavaScript Enthusiast",
    init: "S",
    color: "#0ea5e9"
  },

  {
    name: "Kabir Singh",
    bio: "AI Explorer",
    init: "K",
    color: "#8b5cf6"
  }
];

// Render Feed
const feed = document.getElementById("feed");

articles.forEach(article => {
  feed.innerHTML += `
    <div class="card">
      <div class="card-body">

        <div class="author-row">
          <div class="a-avatar" style="background:${article.color}">
            ${article.init}
          </div>
          <span class="a-name">${article.author}</span>
        </div>

        <div class="card-title">
          ${article.title}
        </div>

        <div class="card-sub">
          ${article.sub}
        </div>

        <div class="card-meta">
          <span class="meta-tag">${article.tag}</span>

          <span>
            ${article.date} · ${article.time} read
          </span>

          <div class="actions">
            <button class="act-btn clap-btn" onclick="clap(this)">
              👏 <span>${article.claps}</span>
            </button>

            <button class="act-btn">
              💬 ${article.comments}
            </button>

            <button class="act-btn">
              🔖
            </button>
          </div>
        </div>

      </div>

      <div class="thumb">
        ${article.icon}
      </div>
    </div>
  `;
});

// Staff Picks
const staffPicks = document.getElementById("staff-picks");

picks.forEach((pick, index) => {
  staffPicks.innerHTML += `
    <div class="pick">
      <div class="pick-num">
        0${index + 1}
      </div>

      <div>
        <div class="pick-author">
          ${pick.author}
        </div>

        <div class="pick-title">
          ${pick.title}
        </div>

        <div class="pick-date">
          ${pick.date}
        </div>
      </div>
    </div>
  `;
});

// Who To Follow
const followList = document.getElementById("follow-list");

people.forEach(person => {
  followList.innerHTML += `
    <div class="follow-card">

      <div
        class="f-avatar"
        style="background:${person.color}"
      >
        ${person.init}
      </div>

      <div class="f-info">
        <div class="f-name">
          ${person.name}
        </div>

        <div class="f-bio">
          ${person.bio}
        </div>
      </div>

      <button
        class="follow-btn"
        onclick="toggleFollow(this)"
      >
        Follow
      </button>

    </div>
  `;
});

// Navigation Tags
document.querySelectorAll(".tag").forEach(tag => {
  tag.addEventListener("click", () => {
    document
      .querySelectorAll(".tag")
      .forEach(item => item.classList.remove("active"));

    tag.classList.add("active");
  });
});

// Clap Feature
function clap(button) {
  const count = button.querySelector("span");
  let current = Number(count.textContent);

  if (button.dataset.clapped) {
    count.textContent = current - 1;
    delete button.dataset.clapped;
    button.style.color = "";
  } else {
    count.textContent = current + 1;
    button.dataset.clapped = true;
    button.style.color = "#16a34a";
  }
}

// Follow Feature
function toggleFollow(button) {
  button.classList.toggle("following");

  if (button.classList.contains("following")) {
    button.textContent = "Following";
  } else {
    button.textContent = "Follow";
  }
}

console.log("Medium Clone by Ojash Singh 🚀");