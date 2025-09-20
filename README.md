# CodeGremlins Site (Astro)

This directory contains the new Astro-powered version of the CodeGremlins website focused on ESX Legacy FiveM development.

## Stack

- Astro
- Static deployment to GitHub Pages
- Dark theme only

## Structure

```
astrojs/
  src/
    components/ (UI building blocks)
    layouts/ (site layout)
    pages/ (routes)
    styles/ (global.css)
  public/ (static assets like favicon.svg)
```

## Development

```bash
cd astrojs
npm install   # first time
npm run dev   # start dev server at http://localhost:4321
```

## Build

```bash
npm run build
```

Outputs static site to `dist/`.

## Preview

```bash
npm run preview
```

## Deployment

GitHub Actions workflow `.github/workflows/deploy.yml` builds and deploys automatically on pushes to `main`.

Ensure GitHub Pages is configured to use GitHub Actions in the repository settings.

## Migration Notes

The original static files (`index.html`, `styles.css`, `script.js`) remain at repo root for now. After verifying the Astro build renders equivalently, you can remove or archive them.

## Future Enhancements

- Add SEO component
- Extract team data to JSON or YAML
- Add resource/projects listing

## Animations

A lightweight IntersectionObserver adds a fade-up entrance to elements with the class `anim-fade-up`. To disable globally, remove the script import in `src/layouts/Layout.astro` or delete the classes. Reduced motion users (prefers-reduced-motion) automatically get no entrance transitions.

## Scroll Progress Bar

A top fixed progress bar (`#scroll-progress`) indicates page scroll depth. Remove the element in `Layout.astro` or related logic in `public/scripts/animations.js` to disable.

---

Made with ❤️ by CodeGremlins.
