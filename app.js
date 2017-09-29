const express = require('express');
const app = express();

app.get('/', require('./controllers/everything'));

app.listen(3000);