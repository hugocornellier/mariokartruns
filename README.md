# MarioKartRuns

A web app that displays and archives Mario Kart world records.

View live: [https://mariokartruns.com](https://mariokartruns.com)

## Set-up Instructions
### Dev:
- ```npm i && npm i --prefix ./frontend```
- ```npm start```
- In separate terminal:
  - ```npm start --prefix ./frontend```

### Production:
- At root: ```npm run build```
- ```pm2 stop all && pm2 start ./backend/server.js```
