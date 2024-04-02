"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
// Create Express app
const app = express();
const port = 3000;
// Define a route
app.get('/', (req, res) => {
    res.send('Hello, this is a basic Express server written in TypeScript!');
});
// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
