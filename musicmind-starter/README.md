# MusicMind — Starter (Auth + Data Layer)

This is Step 1 from the build checklist: Spotify OAuth login + pulling top
artists/tracks/recently-played. No UI polish yet — just proving the data
pipeline works end to end. Once this runs and you can see your own JSON data
on `/dashboard.html`, move to feature extraction + scoring (checklist
sections 2–3).

## 1. Create a Spotify Developer App (one-time, do this yourself)

1. Go to https://developer.spotify.com/dashboard and log in with any Spotify
   account (free account is fine).
2. Click **Create app**.
3. Fill in:
   - App name: `MusicMind` (or whatever)
   - App description: anything
   - Redirect URI: `http://127.0.0.1:8888/callback` — must match exactly,
     including the port
   - Check the box for **Web API**
4. Save. On the app's page, click **Settings** to find your **Client ID**
   and **Client Secret**.

Note: Spotify requires `127.0.0.1` instead of `localhost` for redirect URIs
now — using `localhost` will fail.

## 2. Configure environment variables

```bash
cd backend
cp .env.example .env
```

Open `.env` and paste in your `SPOTIFY_CLIENT_ID` and
`SPOTIFY_CLIENT_SECRET` from step 1. Leave the rest as-is unless you changed
the port.

## 3. Install and run

```bash
cd backend
npm install
npm start
```

You should see:
```
MusicMind backend running at http://127.0.0.1:8888
```

## 4. Test the flow

1. Open `http://127.0.0.1:8888` in your browser
2. Click **Login with Spotify**
3. Approve the permissions (top items + recently played)
4. You'll land on `/dashboard.html` showing your raw profile data as JSON

If you see real data (your top artists/tracks), the auth + data layer is
done. If something breaks, check the terminal logs — most issues at this
stage are a mismatched Redirect URI.

## What's implemented here (checklist section 1)

- OAuth login/callback with CSRF state check
- Token refresh endpoint (`/auth/refresh`)
- `/api/top?type=artists|tracks&range=...` — individual top-items calls
- `/api/recently-played`
- `/api/genres?ids=...` — genre lookup for artist IDs not already carrying genres
- `/api/full-profile` — one call that gets everything needed for the next
  step (feature extraction)

## What's next (not in this starter yet)

- Feature extraction logic (genre diversity, discovery rate, consistency —
  checklist section 2)
- OCEAN scoring (section 3)
- LLM explanation calls (section 4)
- Real React + Tailwind dashboard UI (section 5) — this repo's `public/`
  folder is just plain HTML for testing, not the final frontend
