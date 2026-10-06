# Portafolio de Rodrigo Eliseo García

Portafolio bilingüe (ES/EN) para presentar experiencia Full Stack, proyectos y formas de contacto. Next.js 16 App Router, React 19, TypeScript y next-intl. Diseño mobile-first con nombre propio, azul tinta y fondo papel; gato e ilustración marina recuperados de los assets del sitio.

## Dirección visual

Newsreader para el nombre y los títulos; Source Sans 3 para textos y controles. Las dos familias se sirven localmente con next/font. Sin Syne, degradados, grandes tarjetas redondeadas ni eslóganes de producto. La experiencia se muestra en filas abiertas con separadores; las demos conservan imágenes, acciones y detalle técnico. El gato y el tiburón ballena son elementos gráficos existentes, no afirmaciones nuevas sobre aficiones personales.

## Desarrollo

```sh
npm ci
npm run dev
```

Abrir `http://localhost:3000/es`. Consultar `AGENTS.md` y la documentación local de Next.js en `node_modules/next/dist/docs/` antes de modificar APIs del framework.

## Estructura

- `messages/es.json` y `messages/en.json`: textos y datos de proyectos. Mantener la misma estructura, slugs y orden.
- `app/[locale]/page.tsx`: portada renderizada en servidor; tres experiencias principales y tres demos visibles sin pestañas.
- `app/[locale]/projects/[slug]/page.tsx`: siete casos por idioma, con problema, contribución, implementación y límites.
- `components/ProjectCard.tsx`: tarjetas y capturas optimizadas. Los esquemas de NOM RAG y PouV2 se identifican como esquemas, no como capturas.
- `components/MobileNav.tsx`: menú móvil con Escape, cierre exterior y gestión de foco; único componente cliente de la página.
- `app/globals.css`: layout responsive, foco visible, movimiento reducido y barra de contacto móvil con safe-area.
- `lib/portfolio.ts`: URLs de contacto, CV y generación de canonical, hreflang, Open Graph y Twitter.
- `app/robots.ts`, `app/sitemap.ts`, `app/og.png/route.ts`: rastreo, mapa con 16 URLs e imagen social 1200×630.
- `app/favicon.png/route.ts`: favicon PNG cuadrado de 96×96, generado en el build a partir del gato original. El test limita su peso a menos de 10 KB; el original se conserva para la marca y el icono de inicio de iOS.

Las páginas se generan estáticamente. No se cargan iframes, videos automáticos, scripts de Credly ni bibliotecas gráficas de las demos. Las apps se abren voluntariamente en otra pestaña. Las imágenes bajo el primer pliegue usan la carga diferida de Next Image.

## Criterios de contenido

Full Stack es el perfil principal; la IA es un diferenciador. La portada resume y los casos contienen el detalle técnico. AulaQR encabeza las demos.

Los hechos personales se contrastaron con el MAIN.md vigente del espacio de CV. Se mantiene Tuxtla Gutiérrez, inglés B1, fechas de experiencia y condición de egresado con título en proceso. No se añaden porcentajes sin evidencia ni se presenta formación de AWS como experiencia de producción.

El CV público es una copia sin cambios del PDF Fullstack aprobado el 05/10/2026, en español:

- Archivo servido: `public/Rodrigo_CV.pdf`.
- SHA-256: `C4342354850A31F3CBDE8A04D68C5FAC2FD25D04449A9B6A6944424969EE92FB`.
- Actualizar desde una nueva versión aprobada, no editar ese PDF a mano. Revisar su render y descarga al reemplazarlo.

## Validación

```sh
npm run lint
npm test
npm run build
npm run start -- --hostname 127.0.0.1 --port 3012
```

En otra terminal, con Playwright disponible:

```sh
npm run test:smoke
```

El script acepta `BASE_URL` (solo localhost/127.0.0.1), `PLAYWRIGHT_MODULE` (ruta a un paquete Playwright ya instalado) y `BROWSER_EXECUTABLE` (Chrome/Chromium instalado). No instala dependencias ni abre sesiones personales. Sin esas variables usa el módulo `playwright` y su Chromium de la máquina.

Comprueba las 16 páginas, h1, idiomas, canonical/hreflang, Open Graph/Twitter, JSON-LD, proyectos sin JavaScript, menú y teclado, overflow, imágenes, robots, sitemap, 404 y PDF. Prueba anchos de 320, 360, 390, 430, 768 y 1280 px. Guarda capturas en `.codex/qa/` (ignorado por Git). Revisar visualmente las capturas: el smoke test no sustituye una auditoría completa de accesibilidad o rendimiento.

## Publicación y pendientes externos

El repositorio `Eliseo10208/tech-fold` está conectado a Vercel: los commits de `master` generan despliegues de producción. Después de un push autorizado, confirmar el estado del commit en Vercel y verificar las rutas en `https://rodrigo-e-g.lat`, no solo la URL de preview. La publicación de esta revisión fue autorizada el 05/10/2026.

Revisar PageSpeed y Search Console después de publicar. Las pruebas de carga locales no son métricas de usuarios reales ni confirman indexación; un sitemap tampoco garantiza aparecer en resultados.

El README de PouV2 y el perfil de GitHub son tareas separadas; este cambio no modifica otros repositorios o cuentas. La presentación de PouV2 sí reconoce la plantilla de origen y los controles de teclado.

Se retiraron los componentes antiguos de pestañas, embeds y nube de tecnologías que ya no se utilizaban; siguen recuperables desde Git. Los recursos gráficos anteriores se conservan.
