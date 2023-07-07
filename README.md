# Playas Murcia

<img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Flag_of_the_Region_of_Murcia.svg" width="480" alt="Flag of the Región de Murcia (Spain)" />

Catalog of beaches of Región de Murcia

## Data extracted from

http://nexo.carm.es/nexo/archivos/recursos/opendata/json/Playas.json

## Organization

The code is organized in a monorepo with two apps:

### Crawler

The crawler is a Node script that extracts the data from the source and stores it in a JSON file.

The pictures are validated against a minimun resolution and the valid ones are upscaled with [chainner](https://chainner.app/) using an AI model.

### Web

The web uses [Next.js](https://nextjs.org/) and [Tailwind CSS](https://tailwindcss.com/) as the main building tools.
