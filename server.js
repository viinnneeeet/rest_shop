const http = require('http'); //
const app = require('./src/app');

const port = process.env.PORT || 4000;

const server = http.createServer(app);

server.listen(port);

// PORT=8626

// MONGODB="mongodb+srv://node-shop:node-shop@cluster1.wep5a.mongodb.net/?retryWrites=true&w=majority"
