[README.md](https://github.com/user-attachments/files/25206354/README.md)
Biruk Fikadu — Portfolio

Overview
- Static portfolio site built with plain HTML, CSS and vanilla JavaScript.
- Features: animated hero, projects grid + modal, contact form (EmailJS integration), contact cards, particle background and small UI animations.

Quick local preview
1. Open `index.html` directly in a browser, or run a local static server:

```powershell
# Python 3 (recommended)
python -m http.server 8000
# then open http://localhost:8000
```

Email delivery (EmailJS)
- The contact form uses EmailJS. Set these values in `script.js`:
  - `EMAILJS_USER` (Public Key from EmailJS account)
  - `EMAILJS_SERVICE` (your `service_...` ID)
  - `EMAILJS_TEMPLATE` (your template ID, e.g. `template_slafu7f`)
- Template must include template variables: `name`, `email`, and `message`.

Files added/edited
- `index.html`, `style.css`, `script.js` — main site
- `images/` — project and profile images
- `README.md` — this file
- `.gitignore` — excludes virtual env, backups and OS files

Security & notes
- EmailJS public key is safe to include client-side; do not store private SMTP credentials in the repo.
- There is an `images/backup/` folder created during optimization; you can remove it or keep it out of the repo.

Publishing to GitHub (summary)
1. Create a new repository on GitHub (via website).
2. In your project folder run:

```powershell
git remote add origin https://github.com/<your-username>/<repo>.git
git branch -M main
git push -u origin main
```

Or use GitHub Pages to host the static site (Settings → Pages) or deploy via Netlify/Vercel.

If you'd like, I can:
- Push to a GitHub repo for you (if you provide the remote), or
- Create a `gh` CLI flow and run it here if you want me to create the remote automatically.

