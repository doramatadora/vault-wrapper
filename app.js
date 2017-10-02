const express = require('express');
const app = express();

app.get('/tree', require('./controllers/tree'));

app.listen(3000);