# Luxin London – static site

A static copy of the Luxin London storefront, ready for GitHub Pages.

## Publish
1. Create a GitHub repo and push these files to the `main` branch.
2. Repo → Settings → Pages → Source: "Deploy from a branch" → `main` / `(root)`.
3. Your site appears at `https://<username>.github.io/<repo>/`.

## Set up contact buttons
Edit `static/config.js` (WhatsApp number, Instagram, email). Empty values hide that button.
There is no cart or checkout (GitHub Pages has no server); customers enquire by message.

## Notes
- Open the site through a web server or GitHub Pages; every page link points to an `index.html`, so double-clicking also works.
- Prices, stock and descriptions are copied from the Shopify store and live in each page's HTML.
