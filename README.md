# Instagram-style React Frontend

A responsive, Instagram-inspired frontend demo built with React, Vite, and lucide-react.

## Features
- Responsive desktop sidebar and mobile navigation
- Stories viewer with next/previous navigation
- Feed posts with like/unlike and double-click-to-like
- Save/unsave posts
- Add comments
- Search posts by username, caption, or location
- Explore grid
- Profile page and saved posts tab
- Create a demo post by entering a public image URL
- Suggested accounts with follow/unfollow UI

## Requirements
- Node.js 20 or newer recommended
- npm

## Run locally
1. Extract the ZIP.
2. Open the extracted `instagram-react-frontend` folder in VS Code.
3. Open the terminal in that folder and run:

```bash
npm install
npm run dev
```

4. Open the local URL printed by Vite (usually `http://localhost:5173`).

## Production build

```bash
npm run build
npm run preview
```

The production output is created in `dist/`.

## Important limitations
This is **frontend only**. Login/signup, real user accounts, database persistence, real messaging, notifications, uploads, and production moderation are not connected yet. Demo changes are held in React state and reset when the page reloads. Images are loaded from Unsplash URLs, so internet access is needed for those images.

This is an Instagram-inspired learning project, not an official Instagram product. Do not use Meta/Instagram branding to imply official affiliation.
