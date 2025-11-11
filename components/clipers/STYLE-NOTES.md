# Sistema de estilos para Clipers (estilo YouTube)

Este documento resume la migración del diseño vertical tipo TikTok/Instagram a un diseño horizontal inspirado en YouTube, junto con decisiones técnicas para asegurar rendimiento, accesibilidad y compatibilidad.

## Objetivos

- Vista horizontal 16:9 mediante el componente `CliperPlayer`.
- Tarjetas responsivas en grilla: `grid-cols-1` y `lg:grid-cols-2`.
- Eliminación total del formato vertical: observers, autoplay, overlays y CSS `aspect-[9/16]`.
- Mantener acciones existentes: compartir, eliminar, ver perfil y paginación.
- Mejorar UX con metadatos claros y controles nativos del reproductor.

## Pautas de estilo

- Video: usar `aspect-video` dentro de `CliperPlayer` para preservar 16:9.
- Tipografía: emplear utilidades de Tailwind (`text-sm`, `font-semibold`, `text-muted-foreground`).
- Tarjetas: `Card` con `overflow-hidden`, padding y `gap-4` para panel lateral.
- Grilla: `grid grid-cols-1 lg:grid-cols-2 gap-6` para responsividad.
- Badges de estado: colores discretos (`green/yellow/red/gray`) con buen contraste.

## Accesibilidad y compatibilidad

- Imágenes y videos con `alt` cuando aplique.
- Controles accesibles y con foco, evitar overlays invasivos.
- Compatible con Chrome, Firefox, Safari, Edge (sin APIs experimentales).

## Rendimiento

- Sin `IntersectionObserver` ni autoplay: menos trabajo en el main thread.
- Carga progresiva y paginación mediante `hasMore` + `loadClipers`.
- Evitar re-renders innecesarios; `CliperPlayer` encapsula el reproductor.

## Eliminaciones realizadas

- Bloque vertical completo en `app/clipers/page.tsx`.
- `IntersectionObserver`, atajos de teclado y función `toggleMute`.
- Estados heredados: `mutedStates`, `playingStates`, `currentIndex`, `videoRefs`, `observerRefs`, `loadedStates`.

## Mantenimiento

- Para nuevos componentes de video, reutilizar `CliperPlayer`.
- Añadir tests visuales/manuales al subir cambios con UI.
- Revisar periódicamente contrastes y tamaños para AA.