# Mario Kart Records

A work-in-progress web app that displays Mario Kart world records for all games in the series.

## Dev:
- ```npm i && npm i --prefix ./frontend```
- ```npm start```
- In separate terminal:
- ```npm start --prefix ./frontend```

## Production:
- At root: ```npm run build```
- ```serve -s -n build```
- ```forever stopall; forever start ./backend/server.js```