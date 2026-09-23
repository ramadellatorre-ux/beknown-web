# BeKnown — Landing

## Abrir en VS Code
1. Descomprimí la carpeta y abrila en VS Code (Archivo → Abrir carpeta).
2. Instalá la extensión **Live Server** y hacé clic derecho en `index.html` → "Open with Live Server".

## Trabajar con Claude Code
Desde la terminal de VS Code, parado en esta carpeta:
```
claude
```
Claude Code lee `CLAUDE.md` automáticamente, con el contexto de marca, la voz y los pendientes.
Ejemplo de pedido: "Completá los precios con DWY USD X / DFY USD Y por mes".

## Publicar
- Vercel: `npx vercel` desde esta carpeta, o conectá el repo de GitHub.
- GitHub Pages: subí la carpeta a un repo y activá Pages en la rama `main`.
