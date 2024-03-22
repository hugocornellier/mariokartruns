# MarioKartRuns

A work-in-progress web app that displays Mario Kart world records for all games in the series.

View the live web app: [https://mariokartruns.com](https://mariokartruns.com)

## Set-up Instructions
### Dev:
- ```npm i && npm i --prefix ./frontend```
- ```npm start```
- In separate terminal:
  - ```npm start --prefix ./frontend```

### Production:
- At root: ```npm run build```
- ```forever stopall && forever start ./backend/server.js```