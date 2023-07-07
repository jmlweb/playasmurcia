# PlayasMurcia crawler

A simple crawler to grab and clean the data coming from [the dataset](http://nexo.carm.es/nexo/archivos/recursos/opendata/json/Playas.json) of Región de Murcia.

## Commands

- **freshProcess**: Forces a download of the data and the pictures and stores the results after validating and parsing them.
- **process**: Tries to read the data from the local file, if it is not present, it downloads the data. Process the missing or invalid pictures.
- **processPicture**: Download and validate a single picture, storing the results.
