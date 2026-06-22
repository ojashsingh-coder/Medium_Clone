(function(){
  "use strict";

  /* ---------------------------------------------------------------
     STORAGE HELPERS (graceful fallback if localStorage is blocked)
  --------------------------------------------------------------- */
  const memoryStore = {};
  const storage = {
    get(key, fallback){
      try{
        const v = localStorage.getItem(key);
        return v === null ? fallback : JSON.parse(v);
      }catch(e){
        return key in memoryStore ? memoryStore[key] : fallback;
      }
    },
    set(key, value){
      try{
        localStorage.setItem(key, JSON.stringify(value));
      }catch(e){
        memoryStore[key] = value;
      }
    }
  };

  /* ---------------------------------------------------------------
     SEED CONTENT
     Each post has a `thumb` image (royalty-free, topic-matched) used
     for both the feed card and the hover-preview popover.
  --------------------------------------------------------------- */
  const seedPosts = [
    {
      id: "seed-1",
      title: "Should You Still Learn to Code in 2026?",
      subtitle: "The answer isn't as obvious as I used to believe.",
      author: "Marina Wyss", initial: "M",
      pub: "Data Science Collective",
      date: "Feb 23",
      claps: "4.2K", comments: 214,
      tag: "Data Science",
      thumb: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=480&h=320&fit=crop",
      body: `<p>Every few years a question resurfaces in developer circles, and right now it's louder than ever: with AI writing functional code in seconds, is it still worth learning to program from scratch?</p>
             <h2>The case against</h2>
             <p>Tools can scaffold entire applications from a single sentence. Junior-level tasks that once took an afternoon now take a prompt.</p>
             <blockquote>The skill that matters now isn't typing syntax. It's knowing what to ask for, and recognizing when the answer is wrong.</blockquote>
             <p>That distinction changes everything about how we should teach and learn.</p>
             <h2>The case for</h2>
             <p>Understanding how systems work underneath the abstraction is what lets you debug, architect, and judge quality. Without it, you're flying blind.</p>
             <p>So yes — learn to code. Just don't expect the syllabus to look like it did a decade ago.</p>`
    },
    {
      id: "seed-2",
      title: "Code is Great",
      subtitle: "You just need to learn how to use it.",
      author: "Leo Godin", initial: "L",
      pub: null,
      date: "Mar 2",
      claps: "5.5K", comments: 172,
      tag: "Programming",
      thumb: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=480&h=320&fit=crop",
      body: `<p>Most complaints about AI coding tools come down to one thing: people expect a vending machine and get a colleague instead.</p>
             <h2>Treat it like a pair programmer</h2>
             <p>The developers getting the most value aren't the ones issuing a single giant prompt and hoping for the best. They're the ones working iteratively, reviewing output, and steering.</p>
             <blockquote>Using an LLM well is itself a skill, and like any skill, it has to be practiced.</blockquote>
             <p>Give it context. Break problems down. Read what it gives you back. The results speak for themselves.</p>`
    },
    {
      id: "seed-3",
      title: '"Women Are Born Reading Ready"',
      subtitle: "A look at literacy, gender, and early development.",
      author: "Desiree Peralta", initial: "D",
      pub: "Books Are Our Superpower",
      date: "Mar 9",
      claps: "3.1K", comments: 98,
      tag: "Books",
      thumb: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=480&h=320&fit=crop",
      body: `<p>The claim shows up everywhere from parenting forums to op-eds: girls are simply born more ready to read. The truth, as usual, is messier and more interesting.</p>
             <h2>What the research actually shows</h2>
             <p>Early language exposure, not biology alone, accounts for much of the gap researchers observe in early childhood.</p>
             <p>Environment compounds quickly. Small early advantages become large ones by the time children reach school age, regardless of where they started.</p>`
    },
    {
      id: "seed-4",
      title: "The Political Power of Black Cultural Gatherings",
      subtitle: "Cookouts, cyphers, and Sunday dinners carry weight beyond the food.",
      author: "Tieshka K Smith", initial: "T",
      pub: null,
      date: "May 12",
      claps: "2.8K", comments: 64,
      tag: "Culture",
      thumb: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=480&h=320&fit=crop",
      body: `<p>Cookouts, cyphers, and Sunday dinners have always carried weight beyond the food and the music.</p>
             <h2>More than community</h2>
             <p>These gatherings have historically functioned as organizing spaces, places where information traveled and movements took shape long before a single flyer was printed.</p>`
    },
    {
      id: "seed-5",
      title: "The AirPods Effect",
      subtitle: "How earbuds quietly changed the default state of public life.",
      author: "Markham Heid", initial: "M",
      pub: "The Escape",
      date: "Jun 11",
      claps: "6.7K", comments: 301,
      tag: "Technology",
      thumb: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=480&h=320&fit=crop",
      body: `<p>Walk down any street and you'll see them: the small white commas tucked into ears, signaling a person who is present but not quite available.</p>
             <h2>Ambient isolation</h2>
             <p>It isn't that anyone is being rude. It's that the default state of public life has quietly shifted toward semi-privacy.</p>`
    },
    {
      id: "seed-6",
      title: "50 Years Ago I Played a Solo to Make My Father Proud",
      subtitle: "A memoir about fear, music, and the silence before the first note.",
      author: "Stacy V.", initial: "S",
      pub: "Médousa's Child",
      date: "Apr 30",
      claps: "1.9K", comments: 47,
      tag: "Memoir",
      thumb: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=480&h=320&fit=crop",
      body: `<p>The trumpet was too big for my hands. I played anyway, because the only thing bigger than my fear was my need for his attention.</p>
             <h2>The solo</h2>
             <p>Fifty years later I can still feel the exact weight of the silence before the first note.</p>`
    }
  ];

  const staffPicks = [
    { author: "Tieshka K Smith", initial:"T", title:"The Political Power of Black Cultural Gatherings", date:"May 12" },
    { author: "Markham Heid", initial:"M", title:"The AirPods Effect", date:"Jun 11" },
    { author: "Stacy V.", initial:"S", title:"50 Years Ago I Played a Solo to Make My Father Proud", date:"Apr 30" }
  ];

  const topics = ["Data Science","Programming","Technology","Culture","Self Improvement","Writing","Books","Politics"];

  /* ---------------------------------------------------------------
     STATE
  --------------------------------------------------------------- */
  let posts = storage.get("medium_posts", null);
  if(!posts){ posts = seedPosts; storage.set("medium_posts", posts); }
  let savedIds = new Set(storage.get("medium_saved", []));
  let currentTab = "for-you";
  let searchQuery = "";

  /* ---------------------------------------------------------------
     DOM REFS
  --------------------------------------------------------------- */
  const $ = sel => document.querySelector(sel);
  const storyList = $("#storyList");
  const staffPicksEl = $("#staffPicks");
  const topicChipsEl = $("#topicChips");
  const toastEl = $("#toast");
  const hoverPreviewEl = $("#hoverPreview");

  /* ---------------------------------------------------------------
     UTIL
  --------------------------------------------------------------- */
  function escapeHtml(str){
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function plainExcerpt(html, len){
    const div = document.createElement("div");
    div.innerHTML = html;
    const text = div.textContent || div.innerText || "";
    return text.length > len ? text.slice(0, len).trim() + "…" : text;
  }

  function showToast(msg){
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(()=> toastEl.classList.remove("show"), 2600);
  }

  /* ---------------------------------------------------------------
     RENDER: STORY CARD
  --------------------------------------------------------------- */
  function renderStoryCard(post){
    const isMine = post.id.startsWith("user-");
    const isSaved = savedIds.has(post.id);
    const isFresh = isMine && post._fresh;

    const card = document.createElement("article");
    card.className = "story-card" + (isMine ? " mine" : "") + (isFresh ? " fresh" : "");
    card.dataset.id = post.id;

    const pubTag = post.pub ? `<span class="pub-tag">${escapeHtml(post.pub)}</span> · ` : (isMine ? "" : "");

    card.innerHTML = `
      <div class="story-main">
        <div class="story-byline">
          ${pubTag}
          <span class="mini-avatar">${escapeHtml(post.initial)}</span>
          <span>${escapeHtml(post.author)}</span>
          <span>· ${escapeHtml(post.date)}</span>
        </div>
        <h2 class="story-title">${escapeHtml(post.title)}</h2>
        <p class="story-excerpt">${escapeHtml(post.subtitle || plainExcerpt(post.body, 140))}</p>
        <div class="story-meta">
          <span class="tag-dot">${escapeHtml(post.tag || "Story")}</span>
          <span>${escapeHtml(post.claps || "0")} claps</span>
          <span>${post.comments != null ? post.comments : 0} responses</span>
          <span class="meta-actions">
            <button class="mini-icon-btn save-btn ${isSaved ? "saved":""}" title="Save">
              <svg viewBox="0 0 24 24" fill="${isSaved ? 'currentColor':'none'}" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
            </button>
          </span>
        </div>
      </div>
      <img class="story-thumb" src="${post.thumb || ''}" loading="lazy" alt="" onerror="this.style.background='var(--rule)'" />
      ${isMine ? `<button class="delete-btn" title="Delete story"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg></button>` : ""}
    `;

    card.addEventListener("click", (e)=>{
      if(e.target.closest(".save-btn") || e.target.closest(".delete-btn")) return;
      openReader(post);
    });

    card.addEventListener("mouseenter", (e)=> showHoverPreview(post, card));
    card.addEventListener("mousemove", (e)=> positionHoverPreview(e));
    card.addEventListener("mouseleave", hideHoverPreview);

    card.querySelector(".save-btn").addEventListener("click", (e)=>{
      e.stopPropagation();
      toggleSave(post.id, card.querySelector(".save-btn"));
    });

    const delBtn = card.querySelector(".delete-btn");
    if(delBtn){
      delBtn.addEventListener("click", (e)=>{
        e.stopPropagation();
        deletePost(post.id);
      });
    }

    return card;
  }

  function toggleSave(id, btnEl){
    if(savedIds.has(id)){
      savedIds.delete(id);
      btnEl.classList.remove("saved");
      btnEl.querySelector("svg").setAttribute("fill","none");
      showToast("Removed from your library");
    }else{
      savedIds.add(id);
      btnEl.classList.add("saved");
      btnEl.querySelector("svg").setAttribute("fill","currentColor");
      showToast("Saved to your library");
    }
    storage.set("medium_saved", Array.from(savedIds));
  }

  function deletePost(id){
    posts = posts.filter(p => p.id !== id);
    storage.set("medium_posts", posts);
    renderFeed();
    showToast("Story deleted");
  }

  /* ---------------------------------------------------------------
     HOVER PREVIEW — shows a quick-glance card when hovering a story
  --------------------------------------------------------------- */
  let hoverTimer = null;

  function showHoverPreview(post, cardEl){
    clearTimeout(hoverTimer);
    hoverTimer = setTimeout(()=>{
      hoverPreviewEl.innerHTML = `
        ${post.thumb ? `<img src="${post.thumb}" alt="" loading="lazy" />` : ""}
        <div class="hp-byline">
          <span class="mini-avatar">${escapeHtml(post.initial)}</span>
          <span>${escapeHtml(post.author)}</span>
          <span>· ${escapeHtml(post.date)}</span>
        </div>
        <h4>${escapeHtml(post.title)}</h4>
        <p>${escapeHtml(post.subtitle || plainExcerpt(post.body, 110))}</p>
        <div class="hp-stats">
          <span>${escapeHtml(post.claps || "0")} claps</span>
          <span>${post.comments != null ? post.comments : 0} responses</span>
          <span>${escapeHtml(post.tag || "Story")}</span>
        </div>
      `;
      hoverPreviewEl.classList.add("show");
    }, 350); // small delay so it doesn't flash on quick mouse passes
  }

  function positionHoverPreview(e){
    if(!hoverPreviewEl.classList.contains("show")) return;
    const margin = 16;
    const previewW = 300;
    const previewH = hoverPreviewEl.offsetHeight || 280;
    let left = e.clientX + 18;
    let top = e.clientY + 18;

    if(left + previewW + margin > window.innerWidth) left = e.clientX - previewW - 18;
    if(top + previewH + margin > window.innerHeight) top = window.innerHeight - previewH - margin;
    if(top < margin) top = margin;

    hoverPreviewEl.style.left = left + "px";
    hoverPreviewEl.style.top = top + "px";
  }

  function hideHoverPreview(){
    clearTimeout(hoverTimer);
    hoverPreviewEl.classList.remove("show");
  }

  /* ---------------------------------------------------------------
     RENDER: FEED
  --------------------------------------------------------------- */
  function renderFeed(){
    storyList.innerHTML = "";

    let list = posts.slice();

    if(currentTab === "featured"){
      list = list.filter(p => p.pub);
    } else if(currentTab === "following"){
      // No follow graph in this demo — show only the reader's own posts as "following yourself".
      list = list.filter(p => p.id.startsWith("user-"));
    }

    if(searchQuery.trim()){
      const q = searchQuery.toLowerCase();
      list = list.filter(p =>
        p.title.toLowerCase().includes(q) ||
        (p.subtitle||"").toLowerCase().includes(q) ||
        p.author.toLowerCase().includes(q) ||
        (p.tag||"").toLowerCase().includes(q)
      );
    }

    if(list.length === 0){
      storyList.innerHTML = `
        <div class="empty-state">
          <div class="caret-big">|</div>
          <p>${searchQuery ? "No stories match your search." : "Nothing here yet."}</p>
        </div>`;
      return;
    }

    list.forEach(p => storyList.appendChild(renderStoryCard(p)));
  }

  /* ---------------------------------------------------------------
     RENDER: SIDEBAR
  --------------------------------------------------------------- */
  function renderSidebar(){
    staffPicksEl.innerHTML = staffPicks.map(p => `
      <li>
        <div class="pl-byline"><span class="mini-avatar">${escapeHtml(p.initial)}</span><span>${escapeHtml(p.author)}</span></div>
        <h4>${escapeHtml(p.title)}</h4>
        <span class="pl-date">${escapeHtml(p.date)}</span>
      </li>`).join("");

    topicChipsEl.innerHTML = topics.map(t => `<span data-topic="${escapeHtml(t)}">${escapeHtml(t)}</span>`).join("");
    topicChipsEl.querySelectorAll("span").forEach(chip=>{
      chip.addEventListener("click", ()=>{
        searchQuery = chip.dataset.topic;
        $("#searchInput").value = searchQuery;
        currentTab = "for-you";
        document.querySelectorAll(".tab").forEach(t=>t.classList.toggle("active", t.dataset.tab==="for-you"));
        renderFeed();
        window.scrollTo({top:0, behavior:"smooth"});
      });
    });
  }

  /* ---------------------------------------------------------------
     THEME TOGGLE
  --------------------------------------------------------------- */
  function initTheme(){
    const saved = storage.get("medium_theme", null);
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const useDark = saved ? saved === "dark" : prefersDark;
    document.documentElement.classList.toggle("dark", useDark);
  }
  $("#themeToggle").addEventListener("click", ()=>{
    const nowDark = document.documentElement.classList.toggle("dark");
    storage.set("medium_theme", nowDark ? "dark" : "light");
    showToast(nowDark ? "Dark mode on" : "Light mode on");
  });

  /* ---------------------------------------------------------------
     SEARCH
  --------------------------------------------------------------- */
  $("#searchInput").addEventListener("input", (e)=>{
    searchQuery = e.target.value;
    renderFeed();
  });

  /* ---------------------------------------------------------------
     TABS
  --------------------------------------------------------------- */
  document.querySelectorAll(".tab").forEach(tabBtn=>{
    tabBtn.addEventListener("click", ()=>{
      document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));
      tabBtn.classList.add("active");
      currentTab = tabBtn.dataset.tab;
      renderFeed();
    });
  });

  /* ---------------------------------------------------------------
     SIDEBAR TOGGLE
     - Desktop (>980px): hamburger collapses/expands the left rail
       in place, content reflows to fill the space.
     - Mobile (<=980px): hamburger opens the slide-out drawer instead,
       since the left rail is hidden entirely at that width.
  --------------------------------------------------------------- */
  const drawer = $("#sideDrawer");
  const overlay = $("#drawerOverlay");
  const hamburgerBtn = $("#hamburgerBtn");
  const mainLayout = $("#mainLayout");
  const DESKTOP_BREAKPOINT = 980;

  function openDrawer(){ drawer.classList.add("open"); overlay.classList.add("open"); }
  function closeDrawer(){ drawer.classList.remove("open"); overlay.classList.remove("open"); }

  function toggleDesktopPanel(){
    const closed = mainLayout.classList.toggle("panel-closed");
    hamburgerBtn.classList.toggle("panel-closed", closed);
    storage.set("medium_panel_closed", closed);
  }

  hamburgerBtn.addEventListener("click", ()=>{
    if(window.innerWidth <= DESKTOP_BREAKPOINT){
      openDrawer();
    }else{
      toggleDesktopPanel();
    }
  });

  // restore the user's last panel state on desktop
  if(storage.get("medium_panel_closed", false)){
    mainLayout.classList.add("panel-closed");
    hamburgerBtn.classList.add("panel-closed");
  }

  $("#closeDrawer").addEventListener("click", closeDrawer);
  overlay.addEventListener("click", closeDrawer);
  document.querySelectorAll(".drawer-link[data-feed]").forEach(link=>{
    link.addEventListener("click", (e)=>{
      e.preventDefault();
      closeDrawer();
      showToast(link.textContent + " — coming soon");
    });
  });

  document.querySelectorAll(".rail-link[data-feed]").forEach(link=>{
    link.addEventListener("click", (e)=>{
      e.preventDefault();
      if(link.dataset.feed === "for-you"){
        document.querySelectorAll(".rail-link").forEach(r=>r.classList.remove("active"));
        link.classList.add("active");
        currentTab = "for-you";
        document.querySelectorAll(".tab").forEach(t=>t.classList.toggle("active", t.dataset.tab==="for-you"));
        renderFeed();
      }else{
        showToast(link.textContent.trim() + " — coming soon");
      }
    });
  });

  $("#logoHome").addEventListener("click", (e)=>{
    e.preventDefault();
    searchQuery = "";
    $("#searchInput").value = "";
    currentTab = "for-you";
    document.querySelectorAll(".tab").forEach(t=>t.classList.toggle("active", t.dataset.tab==="for-you"));
    renderFeed();
    window.scrollTo({top:0, behavior:"smooth"});
  });

  $("#bellBtn").addEventListener("click", ()=> showToast("No new notifications"));
  $("#avatarBtn").addEventListener("click", ()=> showToast("Ojash — signed in"));

  /* ---------------------------------------------------------------
     EDITOR (WRITE)
  --------------------------------------------------------------- */
  const editorOverlay = $("#editorOverlay");
  const titleInput = $("#storyTitle");
  const subtitleInput = $("#storySubtitle");
  const contentInput = $("#storyContent");
  const publishBtn = $("#publishBtn");
  const draftStatus = $("#draftStatus");

  function openEditor(){
    editorOverlay.classList.add("open");
    document.body.style.overflow = "hidden";
    setTimeout(()=> titleInput.focus(), 200);
    updatePublishState();
  }
  function closeEditor(){
    editorOverlay.classList.remove("open");
    document.body.style.overflow = "";
  }

  $("#writeBtn").addEventListener("click", openEditor);
  $("#closeEditor").addEventListener("click", ()=>{
    if(titleInput.value.trim() || contentInput.textContent.trim()){
      if(!confirm("Discard this draft?")) return;
    }
    clearEditor();
    closeEditor();
  });

  function clearEditor(){
    titleInput.value = "";
    subtitleInput.value = "";
    contentInput.innerHTML = "";
  }

  function updatePublishState(){
    const ready = titleInput.value.trim().length > 0 && contentInput.textContent.trim().length > 0;
    publishBtn.disabled = !ready;
    draftStatus.textContent = ready ? "Ready to publish" : "Draft saved";
  }
  titleInput.addEventListener("input", updatePublishState);
  contentInput.addEventListener("input", updatePublishState);
  updatePublishState();

  // formatting toolbar
  document.querySelectorAll("#formatToolbar button").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      contentInput.focus();
      const cmd = btn.dataset.cmd;
      const val = btn.dataset.value || null;
      document.execCommand(cmd, false, val);
      refreshToolbarState();
    });
  });
  function refreshToolbarState(){
    document.querySelectorAll("#formatToolbar button").forEach(btn=>{
      const cmd = btn.dataset.cmd;
      try{
        const active = cmd === "bold" || cmd === "italic"
          ? document.queryCommandState(cmd)
          : false;
        btn.classList.toggle("is-active", active);
      }catch(e){ /* no-op */ }
    });
  }
  contentInput.addEventListener("keyup", refreshToolbarState);
  contentInput.addEventListener("mouseup", refreshToolbarState);

  // PUBLISH — this is the core "write button should work, should be able to post what we write" feature
  publishBtn.addEventListener("click", ()=>{
    const title = titleInput.value.trim();
    const subtitle = subtitleInput.value.trim();
    const bodyHtml = contentInput.innerHTML.trim();

    if(!title || !contentInput.textContent.trim()){
      showToast("Add a title and some content first");
      return;
    }

    const fallbackThumbs = [
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=480&h=320&fit=crop",
      "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=480&h=320&fit=crop",
      "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=480&h=320&fit=crop",
      "https://images.unsplash.com/photo-1517842645767-c639042777db?w=480&h=320&fit=crop"
    ];

    const newPost = {
      id: "user-" + Date.now(),
      title,
      subtitle,
      author: "Ojash",
      initial: "O",
      pub: null,
      date: new Date().toLocaleDateString(undefined, { month:"short", day:"numeric" }),
      claps: "0",
      comments: 0,
      tag: "Your story",
      thumb: fallbackThumbs[Math.floor(Math.random() * fallbackThumbs.length)],
      body: bodyHtml,
      _fresh: true
    };

    posts.unshift(newPost);
    storage.set("medium_posts", posts);

    clearEditor();
    closeEditor();
    currentTab = "for-you";
    document.querySelectorAll(".tab").forEach(t=>t.classList.toggle("active", t.dataset.tab==="for-you"));
    searchQuery = "";
    $("#searchInput").value = "";
    renderFeed();
    showToast("Published! Your story is live");

    // scroll new post into view
    window.scrollTo({top:0, behavior:"smooth"});
  });

  // preview = open the reader using current draft contents
  $("#previewBtn").addEventListener("click", ()=>{
    const title = titleInput.value.trim() || "Untitled story";
    const subtitle = subtitleInput.value.trim();
    const bodyHtml = contentInput.innerHTML.trim() || "<p>Nothing written yet.</p>";
    openReader({
      title, subtitle, body: bodyHtml,
      author: "Ojash", initial: "O",
      date: "Draft preview", pub: null
    }, true);
  });

  /* ---------------------------------------------------------------
     READER MODAL
  --------------------------------------------------------------- */
  const readOverlay = $("#readOverlay");
  const readArticle = $("#readArticle");

  function openReader(post, isPreview){
    hideHoverPreview();
    readArticle.innerHTML = `
      ${post.pub ? `<div class="ra-pub">${escapeHtml(post.pub)}</div>` : ""}
      <h1>${escapeHtml(post.title)}</h1>
      ${post.subtitle ? `<p class="ra-sub">${escapeHtml(post.subtitle)}</p>` : ""}
      <div class="ra-byline">
        <span class="mini-avatar">${escapeHtml(post.initial)}</span>
        <div>
          <div class="ra-name">${escapeHtml(post.author)}</div>
          <div class="ra-date">${escapeHtml(post.date)}${isPreview ? "" : " · " + (post.claps||"0") + " claps"}</div>
        </div>
      </div>
      ${post.thumb ? `<img class="ra-hero" src="${post.thumb}" alt="" />` : ""}
      <div class="ra-body">${post.body}</div>
    `;
    readOverlay.classList.add("open");
    document.body.style.overflow = "hidden";
    readOverlay.scrollTop = 0;
  }
  function closeReader(){
    readOverlay.classList.remove("open");
    document.body.style.overflow = editorOverlay.classList.contains("open") ? "hidden" : "";
  }
  $("#closeRead").addEventListener("click", closeReader);

  // ESC closes whichever modal is open
  document.addEventListener("keydown", (e)=>{
    if(e.key === "Escape"){
      if(readOverlay.classList.contains("open")) closeReader();
      else if(editorOverlay.classList.contains("open")) $("#closeEditor").click();
      else if(drawer.classList.contains("open")) closeDrawer();
    }
  });

  /* ---------------------------------------------------------------
     INIT
  --------------------------------------------------------------- */
  initTheme();
  renderSidebar();
  renderFeed();

})();
