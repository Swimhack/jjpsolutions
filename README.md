# JJP Solutions Website

AI-Powered Security & Safety Intelligence

## Live Site
https://jjpsolutions.fly.dev

## Deployment

This site automatically deploys to Fly.io via GitHub Actions when you push to the `main` branch.

### Setup Instructions

1. **Get your Fly.io API token:**
   ```bash
   fly auth token
   ```

2. **Add the token to GitHub Secrets:**
   - Go to: https://github.com/Swimhack/jjpsolutions/settings/secrets/actions
   - Click "New repository secret"
   - Name: `FLY_API_TOKEN`
   - Value: Paste your token from step 1
   - Click "Add secret"

3. **Push changes to deploy:**
   ```bash
   git add .
   git commit -m "Your changes"
   git push
   ```

The site will automatically deploy within 1-2 minutes.

## Local Development

Simply open `index.html` in your browser, or use a local server:

```bash
python -m http.server 8000
```

Then visit: http://localhost:8000

## Tech Stack

- Pure HTML/CSS (no build process needed)
- Nginx on Alpine Linux (Docker)
- Deployed on Fly.io
- CI/CD via GitHub Actions
