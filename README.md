# R-WEF Team Dashboard

A real-time team dashboard for R-WEF: everyone registers their own account,
sees all tasks at a glance (or just their own), gets owner/shadow tasks
reflected on both people's lists automatically, and can chat live with the
team.

**How it's built:** this is a static front-end (React, via Vite) that you'll
host for free on **GitHub Pages**. GitHub Pages can only serve files — it
can't run logins or store data — so the actual accounts and database live in
**Firebase** (Google's free backend service). Firebase gives you:

- **Authentication** — real email/password accounts for each team member
- **Firestore** — a real-time database; every change (a new task, a status
  update, a chat message) pushes instantly to everyone else's screen, and
  nothing is lost when someone logs out and back in later

Both have generous free tiers that are more than enough for a 7-person team.

---

## 1. Create your Firebase project (10 minutes, one-time)

1. Go to [console.firebase.google.com](https://console.firebase.google.com) and sign in with a Google account (create one for R-WEF if you don't want to use a personal one).
2. Click **Add project**, name it e.g. `rwef-dashboard`, and finish the setup wizard (you can disable Google Analytics — not needed here).
3. In the left sidebar, click **Build → Authentication → Get started**. Under **Sign-in method**, enable **Email/Password**.
4. Click **Build → Firestore Database → Create database**. Choose a location close to your team, and start in **production mode**.
5. Once created, go to the **Rules** tab of Firestore and replace the contents with what's in `firestore.rules` in this project, then click **Publish**.
6. Go to **Project settings** (gear icon, top left) → scroll to **Your apps** → click the **</>** (web) icon → give it a nickname (e.g. "dashboard") → **Register app**. You'll now see a `firebaseConfig` object with values like `apiKey`, `authDomain`, etc. Keep this tab open, you'll need it next.

## 2. Configure the project

1. Copy `.env.example` to a new file named `.env`.
2. Fill in the values from the `firebaseConfig` object you just saw:

   ```
   VITE_FIREBASE_API_KEY=...
   VITE_FIREBASE_AUTH_DOMAIN=...
   VITE_FIREBASE_PROJECT_ID=...
   VITE_FIREBASE_STORAGE_BUCKET=...
   VITE_FIREBASE_MESSAGING_SENDER_ID=...
   VITE_FIREBASE_APP_ID=...
   ```

   These values are safe to have in your repo's build — they're not secret
   (Firebase's web config is meant to be public). Your data is protected by
   the Firestore rules you published in step 1.5, not by hiding these values.
   Still, `.env` is git-ignored by default here so you don't have to think
   about it.

## 3. Run it locally

```bash
npm install
npm run dev
```

Open the printed local URL. Register your first account (this becomes your
personal login), then have each teammate do the same the first time they
visit. Use "**+ Add team member**" in the sidebar only for occasional
contributors who won't be logging in themselves — everyone else should just
register their own account.

## 4. Deploy to GitHub Pages — no terminal, using the GitHub website

This project includes a GitHub Actions workflow (`.github/workflows/deploy.yml`)
that builds and publishes the site automatically every time you upload
changes — you never need to run a build command yourself.

1. **Unzip** the project on your computer first. GitHub's web upload only
   accepts individual files/folders, not a `.zip` — so unzip it before
   uploading.
2. On GitHub, create a new repository (e.g. `rwef-dashboard`). Don't
   initialize it with a README.
3. On the repo's page, click **"uploading an existing file"** (or **Add
   file → Upload files**). Drag in *everything inside* the unzipped folder
   — including the hidden `.github` folder. If your file browser hides
   dot-folders, on Mac press `Cmd+Shift+.` in Finder, on Windows enable
   "Show hidden items" in File Explorer's View tab, so `.github` is
   visible to drag in.
4. Commit the upload directly to the `main` branch.
5. Open `vite.config.js` in the GitHub web editor (click the file, then the
   pencil icon) and set `base` to match your repo name exactly:
   ```js
   base: "/rwef-dashboard/",
   ```
   Commit the change.
6. Add your Firebase keys as GitHub Secrets so the build can use them
   without ever putting them in a plain file: go to your repo's
   **Settings → Secrets and variables → Actions → New repository secret**,
   and add each of these one at a time (values from Part 1, step 6):
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
7. Go to **Settings → Pages**. Under **Build and deployment → Source**,
   choose **GitHub Actions**.
8. Go to the **Actions** tab of your repo — you should see a "Deploy to
   GitHub Pages" run in progress (it kicks off automatically once you
   committed in step 4, and will re-run every time you upload changes
   after this point). Wait for the green checkmark, usually 1–2 minutes.
9. Your site is now live at `https://<your-username>.github.io/<repo-name>/`.
10. Back in the Firebase console: **Authentication → Settings → Authorized
    domains → Add domain**, and add `<your-username>.github.io`. Without
    this, logins will fail on the live site.

From now on, any time you want to change something, edit the files on
GitHub directly (or re-upload changed ones) — the Action rebuilds and
redeploys automatically.

## Alternative: deploying from a terminal

If you'd rather use git and the command line instead of the website, the
steps below do the same thing more directly.

1. Create a new GitHub repository (e.g. `rwef-dashboard`) and push this project to it.
2. Open `vite.config.js` and set `base` to match your repo name exactly, e.g. if your repo is `github.com/yourorg/rwef-dashboard`, set:
   ```js
   base: "/rwef-dashboard/",
   ```
3. Install the deploy helper and publish:
   ```bash
   npm install
   npm run deploy
   ```
   This builds the app and pushes it to a `gh-pages` branch.
4. In your GitHub repo, go to **Settings → Pages**, and under **Source**, choose the `gh-pages` branch. Your site will be live at `https://<your-username>.github.io/<repo-name>/` within a minute or two.
5. Back in the Firebase console, go to **Authentication → Settings → Authorized domains** and add your GitHub Pages domain (e.g. `<your-username>.github.io`) so login works from the live site.

From then on, whenever you make changes: `npm run deploy` re-publishes the
site. Firebase data is untouched by this — deploying only updates the
front-end files.

## Roles

- **Admin** — full access: manage members, roles, and programs; edit or delete any task. The very first person to ever register becomes Admin automatically. After that, promote others from **"⚙ Manage team & roles"** in the sidebar (Admin-only).
- **Lead** — can edit any task and manage programs, but can't delete other people's tasks or change member roles.
- **Associate** — the default for everyone who registers after the first person. Sees all tasks (full transparency), but can only edit or delete tasks where they're the owner or shadow.

These rules are enforced both in the interface and inside `firestore.rules` — so it's real security, not just hidden buttons. If you update `firestore.rules`, remember to re-paste it into the Firebase console's **Firestore → Rules** tab and click **Publish** for the change to take effect.

## What's inside

- **All tasks** — a single grouped table (by program) showing every task,
  who owns it, who's shadowing, due date, and status — built to feel like a
  simple Asana list view
- **My tasks** — just your own (as owner or shadow)
- **Team overview** — everyone's completion ring and overdue count at a glance
- **Live chat** — a lightweight team-wide feed for quick comments, separate
  from the deeper conversations you'll still have on WhatsApp/Gmail
- **Per-task comments** — a small thread on each task itself
- **Owner + shadow** — assign both on any task; it shows up on both people's
  "My tasks" automatically
- **Deadline flags** — overdue and due-soon badges, computed live
- **Add team member** — for occasional/guest contributors who don't need
  their own login
- No demo data — the app starts empty except for whichever accounts your
  team registers

## Notes on cost

Firebase's free "Spark" plan includes generous daily quotas for
Authentication and Firestore reads/writes/storage — a 7-person team using
this daily is very unlikely to hit them. If you ever did, Firebase would
tell you in the console rather than silently failing.
