# SEO de NovaStage

La base SEO está aplicada en las seis páginas: títulos y descripciones individuales, idioma es-AR, Open Graph, tarjetas para redes, favicon y datos estructurados de la organización con información ya publicada. No se agregaron horarios, precios, reseñas ni dirección exacta no confirmados.

## Al publicar

1. Elegir la URL pública HTTPS y confirmar si las páginas conservarán sus rutas .html.
2. Ejecutar desde la carpeta del proyecto: node scripts/configure-seo.cjs URL_PUBLICA_HTTPS
3. Esto completa URLs canónicas, imagen social absoluta, datos del sitio, sitemap.xml y su referencia en robots.txt. Puede ejecutarse de nuevo si cambia el dominio.
4. Publicar y verificar respuestas 200, favicon, imagen social, sitemap y robots. Si el hosting cambia las rutas, ajustar el generador antes de ejecutarlo.
5. Registrar la propiedad en Google Search Console y enviar el sitemap.

Mientras no exista dominio, no se incluyen URLs ficticias ni un sitemap inválido. Los metadatos de redes tendrán su imagen y URL públicas al ejecutar el paso 2. La configuración supone que robots.txt se sirve desde la raíz del dominio. En sitios alojados en una subcarpeta, coordinar robots.txt con la raíz del hosting.

Documentación: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap y https://developers.google.com/search/docs/appearance/structured-data/organization
