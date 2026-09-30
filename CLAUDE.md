# BeKnown — Landing page

Contexto para Claude Code. Leelo antes de tocar cualquier archivo.

## Qué es
Landing de ventas de **BeKnown**: consultoría y dirección de arte para marcas personales intencionales.
Fundadores: Lucas de Rosa (@lucas.derosaa) y Camila Etchegño. Instagram: @beknown.mkt.
Objetivo único de conversión: que el visitante **aplique y agende una llamada estratégica**. Todas las CTAs van a `#aplicar`.

Cliente ideal: consultores, servicios high-ticket, agencias y especialistas B2B con conocimiento probado y capacidad de pago.
Modalidades: DWY (lo construimos con vos) y DFY (lo construimos por vos).

## Stack
HTML + CSS + JS vanilla. Sin frameworks ni build. Abrir `index.html` o usar Live Server.
- `index.html` — estructura y contenido
- `styles.css` — estilos (tokens en `:root`, modo oscuro automático)
- `script.js` — shader WebGL (anillo de Modalidades), nav, animaciones, formulario

## Identidad visual (no cambiar sin pedirlo)
- Bordo (firma): `#7F0000` · Bordo claro: `#A8231A`
- Latón (acento, con moderación): `#B0894F` · Latón claro: `#E4CC9C`
- Hueso (fondo): `#F6F1E9` · Crema: `#EEE5D6`
- Noche bordo (secciones oscuras): `#120807` / `#23100D`
- Tipografías: Geist (titulares y texto) + Geist Mono (etiquetas y datos). No usar Inter, Roboto ni Arial.
- Nav: pill flotante oscuro (noche bordo, filo latón, volumen 3D) + barra flotante inferior con CTA que entra al scrollear.
- Concepto visual: hero claro (fondo hueso→crema, grilla desvanecida y arco bordo al pie) con la flecha del logo que sale del arco y se dibuja al cargar, problema con intro fija y una línea que baja con el scroll encendiendo cada dolor y al final gira como la flecha ("tiene solución"), servicios como índice + panel (hover/teclado cambian la ficha), tarjetas de vidrio sobre anillo animado, equipo en tarjetas con foto circular (ola bordo y redes al hover), manifiesto oscuro que se enciende palabra por palabra al scrollear + banda de palabras en movimiento, cierre oscuro con formulario.
- Logo: BK Marketing (BK con flecha curva). Vector en `img/` y como `<symbol>` al inicio del `<body>` (`#bk-mark` = solo BK, `#bk-logo` = BK + MARKETING). Color crema `#EEE5D6` sobre fondos oscuros o bordo.
- La flecha es parte central de la estética: reutilizarla como recurso gráfico cuando sume.

## Voz y copy
- Español rioplatense con voseo. Conversacional, seguro sin soberbia, frases cortas.
- Palabras SÍ: criterio, intención, autoridad, confianza, estética, sin humo.
- PROHIBIDO: sinergia, mindset, "romper el algoritmo", "en la era digital", promesas de riqueza rápida, motivacional vacío, emojis.
- Nunca sonar a vende-cursos, gurú ni infoproducto. Y no nombrar "vende-cursos" ni "cursos" en la página, ni siquiera para negarlo.
- Regla del conocimiento: se muestra el qué y el porqué, NUNCA el cómo paso a paso (eso es lo que se vende). No detallar metodología interna ni etapas de trabajo (por eso se sacó la sección "Cómo trabajamos").
- Sin precios en la página: la inversión se define en la llamada.
- Equipo: los cuatro (Lucas, Camila, Guido, Ramiro) se presentan por igual, mismo formato y sin títulos jerárquicos.
- No inventar métricas ni testimonios. Si falta un dato, dejar placeholder entre [corchetes].

## Pendientes (buscar `[` en index.html)
- [ ] 3 casos de estudio con números reales (bloques `CASO 1/2/3`)
- [ ] Fotos del equipo de Lucas, Camila y Guido (cuadradas, en `img/equipo/`; buscar `FOTO:`), apellido de Guido, handles de Camila, Guido y Ramiro
- [ ] Rangos de facturación del formulario (`[Rango 1..4]`)
- [ ] Mail de contacto (`[MAIL]`)
- [ ] Embed de Calendly (buscar `PEGAR ACÁ EL EMBED DE CALENDLY`)
- [ ] Conectar el formulario al CRM: función `enviarAplicacion()` en `script.js`
- [ ] Dominio y deploy (Vercel o GitHub Pages)

## Reglas de trabajo
- Al cambiar `styles.css` o `script.js`, subir el `?v=N` de sus links en `index.html` (GitHub Pages cachea 10 min y el HTML nuevo con CSS viejo rompe el hero).
- Cambios chicos y puntuales; no reescribir secciones que no se pidieron.
- Mantener responsive (probar a 390px), foco visible y `prefers-reduced-motion`.
- Mantener un solo objetivo de conversión: no agregar links que saquen al visitante de la página.
