# Harry — Roblox game portfolio

A static, video-led portfolio built from the project media and local source material in `C:\Users\Administrator\Documents\Vyrova`. The six featured games are Boho Salon, Catalog Runway, The Lab, Farm Soy, Style Up, and Slime Game. Individual pet systems appear below the games.

## Preview

Run `node serve.mjs` in this folder, then open `http://127.0.0.1:4173`.

Run `node verify.mjs` to check local media references and the main content structure.

The site has no package dependencies or build step. `serve.mjs` supports byte-range requests so the MP4 clips seek properly in the local preview.

## Media and evidence

- The project videos are the final local highlight edits in `Vyrova\Media\Videos\Highlights`; the four pet-system clips come from its `Drafts\Pet Systems` folder. The reel is the V3 gameplay-audio export.
- The stills and posters are supplied assets from `Vyrova\Media\Games` and the highlight preview folders. Files in `media/` retain the original bytes with slugged names.
- The technical descriptions were checked against the Boho Salon, Catalog Runway, Style Up, SystemsLab, and SlimeGame project source and documentation. Farm Soy descriptions are limited to what the supplied footage shows.
- The visual archive combines selected images from the original GitHub portfolio with a city image labelled “Build Showcase” because its source media does not confirm a game title.
- The contact email is the public Vyrova studio address from its existing website. It is not presented as Harry’s personal email.

Videos load only when a visitor plays them, or hovers a project image on a desktop pointer without reduced-motion or data-saving preferences. Only one clip plays at a time.

## Deployment

GitHub Pages serves this repository from the `main` branch root at `https://qwacky899.github.io/Portfolio/`. All site assets use relative paths so the site works under the `/Portfolio/` project path. The original portfolio images remain in the repository; selected pieces appear in the visual archive.
