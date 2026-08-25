---
name: flow-state-website
description: Build a single-page "flow state" personal website in plain HTML/CSS/JS, where the visitor scrolls smoothly from an intro hero through sequential full-screen sections (about me, experience, passions, currently reading, contact) using CSS scroll-snap. Deploys straight to GitHub Pages as static files. Use this skill whenever the user wants a personal site, portfolio, link-in-bio page, or "about me" page that scrolls through their story section by section, mentions "flow state," "scrolling website," "smooth scroll portfolio," or wants each part of their bio (intro, about, experience, interests, books) to feel like one continuous cinematic scroll rather than a normal stacked page. Also use when the user asks to update or restyle an existing scroll-snap personal site.
---

# Flow State Website

A skill for building single-page personal sites where scrolling *is* the interaction. Each section fills the viewport, scroll-snap locks the visitor onto one section at a time, and the whole page reads like a slow reveal of one person's story — intro, then who they are, then what they've done, then what they care about, then how to reach them.

This produces plain HTML/CSS/JS only (no build step), so it deploys directly to GitHub Pages: commit the files, enable Pages on the repo, done.

## When to reach for this vs. a normal page

Use scroll-snap flow when the content is a personal narrative with a handful of discrete beats (5–7 sections). Don't use it for content-heavy pages (blogs, docs, long resumes) — scroll-snap fights with pages that need free scrolling or variable-height content. If the user's content doesn't compress into clean full-screen beats, say so and suggest a normal long-scroll page instead.

## Step 1: Gather the story beats

Before writing code, get the section list and content from the user. Standard shape (adapt freely):

1. **Intro / hero** — name, one-line identity, subtle prompt to scroll
2. **About me** — a few sentences, personal
3. **Experience** — roles/projects, kept short (this is a vibe piece, not a resume)
4. **Passions / interests**
5. **Currently reading / books**
6. **Contact / links**

Ask for: name, the actual text/bullets for each section, any links (LinkedIn, email, etc.), and a color/font direction if they have one. If they don't have a direction, pick something deliberate and tell them what and why (see Step 3) rather than defaulting to generic template look.

## Step 2: Structure — the scroll-snap skeleton

The core mechanic: a scroll container with `scroll-snap-type: y mandatory`, and each section is `height: 100vh` with `scroll-snap-align: start`.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Name — site</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <nav class="dot-nav">
    <!-- one dot per section, filled in by JS -->
  </nav>

  <main class="scroll-container">
    <section class="panel" id="intro">...</section>
    <section class="panel" id="about">...</section>
    <section class="panel" id="experience">...</section>
    <section class="panel" id="passions">...</section>
    <section class="panel" id="reading">...</section>
    <section class="panel" id="contact">...</section>
  </main>

  <script src="script.js"></script>
</body>
</html>
```

```css
html, body {
  margin: 0;
  height: 100%;
  overflow: hidden; /* the scroll-container owns scrolling, not the page */
}

.scroll-container {
  height: 100vh;
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
  scroll-behavior: smooth;
}

.panel {
  height: 100vh;
  scroll-snap-align: start;
  scroll-snap-stop: always; /* stops one section at a time, no skipping on fast scroll */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 8vh 8vw;
  box-sizing: border-box;
}
```

Key details that make this feel good instead of janky:
- `scroll-snap-stop: always` — without it, a fast scroll/trackpad flick can blow past a section entirely.
- `overflow: hidden` on `html, body` with the scroll living on `.scroll-container` — prevents double scrollbars and rubber-banding weirdness on some browsers.
- Keep each panel's content vertically centered and padded, not edge-to-edge — full-bleed text at viewport edges feels cramped on mobile.
- On mobile, scroll-snap works with touch scrolling by default; just test that section content doesn't overflow 100vh (long bios especially) — shrink font or trim copy rather than letting content clip.

## Step 3: Visual direction — make it feel intentional, not templated

Read `/mnt/skills/public/frontend-design/SKILL.md` if available before finalizing typography and color — it has the house design tokens and anti-generic-AI-look guidance and should govern the actual aesthetic choices here.

On top of that, flow-specific guidance:
- **Each section can have its own accent color or subtle background shift** (not jarring — a gradient or tone progression across the scroll works well, e.g. dark→lighter as the visitor moves through the story). This reinforces "flow" — the page is visibly progressing, not just repeating the same template six times.
- **Typography should carry the personality.** A distinct display font for names/headers plus a clean body font goes a long way; if the user requests something specific (e.g. typewriter/monospace for a technical person), lean into it fully rather than diluting it with a generic sans-serif everywhere else.
- **Motion should feel like the page breathing, not decorating.** Prefer restrained fade/rise-in of a section's content as it becomes active over busy parallax — parallax is fine if requested but easy to overdo.

## Step 4: The active-section reveal (JS)

Use `IntersectionObserver` to detect which panel is active and trigger its content to fade/rise in, and to sync a dot-nav indicator:

```js
const panels = document.querySelectorAll('.panel');
const dots = document.querySelectorAll('.dot-nav a');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      dots.forEach(d => d.classList.remove('current'));
      document.querySelector(`.dot-nav a[href="#${entry.target.id}"]`)
        ?.classList.add('current');
    } else {
      entry.target.classList.remove('active');
    }
  });
}, { threshold: 0.6 });

panels.forEach(p => observer.observe(p));
```

Pair with CSS that hides content until `.active` is added:

```css
.panel .content {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.8s ease, transform 0.8s ease;
}
.panel.active .content {
  opacity: 1;
  transform: translateY(0);
}
```

## Step 5: Dot navigation

A fixed right-edge (or bottom-on-mobile) dot nav is the standard affordance for scroll-snap sites — it tells the visitor how many sections exist and where they are, and lets them jump directly:

```css
.dot-nav {
  position: fixed;
  right: 24px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 12px;
  z-index: 10;
}
.dot-nav a {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
  opacity: 0.3;
  transition: opacity 0.3s, transform 0.3s;
}
.dot-nav a.current {
  opacity: 1;
  transform: scale(1.4);
}
```

On narrow viewports, move `.dot-nav` to the bottom edge, horizontal, and keep it small enough not to overlap panel content — check this specifically, it's the easiest thing to forget.

## Step 6: Deploying to GitHub Pages

Plain static files, so deployment is just:

1. Files live at repo root (or `/docs`) as `index.html`, `style.css`, `script.js`
2. Push to the repo
3. In repo Settings → Pages, set source to the branch/folder containing `index.html`
4. Site is live at `https://<username>.github.io/<repo-name>/`

If the user already has a repo/URL for this (check memory / ask), reuse it rather than assuming a new one.

## Common pitfalls to avoid

- Forgetting `scroll-snap-stop: always` → sections get skipped on fast scroll, breaks the "flow" feeling entirely.
- Section content taller than 100vh → gets clipped, especially on mobile with browser chrome eating viewport height. Test at realistic mobile heights (~650px) and trim copy or reduce font size rather than letting scroll-snap fight internal scrolling.
- Six sections that all look identical → defeats the point. Vary background tone, alignment, or accent per section so the scroll reads as a journey.
- Adding parallax/motion libraries by default → not needed for this pattern; IntersectionObserver + CSS transitions covers it with zero dependencies, which matters for a GitHub Pages static site.