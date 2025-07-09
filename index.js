require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const DB = require('./config/db');
const PORT = process.env.PORT || 3000;
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/upload', express.static('upload'));
DB();
const markethub = "/markethub/v1/api";
app.use(`${markethub}/auth`, require('./router/auth'));
app.use(`${markethub}/user`, require('./router/user'));
app.use(`${markethub}/product`, require('./router/product'));
app.use(`${markethub}/category`, require('./router/category'));
app.use(`${markethub}/subscription`, require('./router/subscription'));

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});


