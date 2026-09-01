# Secciones

Bloques de página compuestos y reutilizables (hero, listados de servicios,
CTA, FAQ…). Se escriben en **Astro**, no en React: son contenido estático y SEO.

Convenciones:

- Un archivo por sección, en `PascalCase.astro`.
- Reciben datos por props; no leen de `src/data/` directamente si la página
  puede pasárselos.
- Los estilos van en un `<style>` scoped del propio componente y usan tokens.
- Si una sección necesita interactividad real, se extrae esa parte a una isla
  concreta; la sección sigue siendo Astro.

Vacío por ahora: el diseño definitivo es la siguiente etapa.
