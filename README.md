# MarioKartRuns

A web app that displays and archives Mario Kart world records.

View live: [https://mariokartruns.com](https://mariokartruns.com)

## Set-up Instructions
### Dev:
- ```npm i && npm i --prefix ./frontend```
- ```npm start```
- In separate terminal:
  - ```npm start --prefix ./frontend```
- For testing...
  - ```npm run server```

### Production:
- At root: ```npm run build```
- ```forever stopall && forever start ./backend/server.js```
